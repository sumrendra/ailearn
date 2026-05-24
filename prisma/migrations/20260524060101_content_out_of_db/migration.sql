-- Content-out-of-DB migration
--
-- All static educational content moves to src/lib/content/ in code.
-- User-specific data (LessonProgress, Note, FlashcardReview, etc.) is rewritten
-- to reference content by stable slugs/keys instead of FK ids.
--
-- Safe to run on existing data: the backfills look up slugs from the
-- about-to-be-dropped content tables BEFORE dropping them.

BEGIN;

-- 1. LessonProgress.lessonId → lessonSlug
ALTER TABLE "LessonProgress" ADD COLUMN "lessonSlug" TEXT;
UPDATE "LessonProgress" lp
   SET "lessonSlug" = l.slug
  FROM "Lesson" l
 WHERE lp."lessonId" = l.id;
ALTER TABLE "LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_lessonId_fkey";
ALTER TABLE "LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_userId_lessonId_key";
ALTER TABLE "LessonProgress" DROP COLUMN "lessonId";
-- For rows where the lookup failed (orphan progress), drop them — no slug = no point
DELETE FROM "LessonProgress" WHERE "lessonSlug" IS NULL;
ALTER TABLE "LessonProgress" ALTER COLUMN "lessonSlug" SET NOT NULL;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_lessonSlug_key" UNIQUE ("userId", "lessonSlug");
CREATE INDEX "LessonProgress_lessonSlug_idx" ON "LessonProgress"("lessonSlug");

-- 2. Note.lessonId → lessonSlug
ALTER TABLE "Note" ADD COLUMN "lessonSlug" TEXT;
UPDATE "Note" n
   SET "lessonSlug" = l.slug
  FROM "Lesson" l
 WHERE n."lessonId" = l.id;
ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_lessonId_fkey";
ALTER TABLE "Note" DROP COLUMN "lessonId";
CREATE INDEX "Note_userId_idx"     ON "Note"("userId");
CREATE INDEX "Note_lessonSlug_idx" ON "Note"("lessonSlug");

-- 3. ChatSession.lessonId → lessonSlug
ALTER TABLE "ChatSession" ADD COLUMN "lessonSlug" TEXT;
UPDATE "ChatSession" cs
   SET "lessonSlug" = l.slug
  FROM "Lesson" l
 WHERE cs."lessonId" = l.id;
ALTER TABLE "ChatSession" DROP COLUMN "lessonId";

-- 4. QuizAttempt.lessonId → lessonSlug
ALTER TABLE "QuizAttempt" ADD COLUMN "lessonSlug" TEXT;
UPDATE "QuizAttempt" qa
   SET "lessonSlug" = l.slug
  FROM "Lesson" l
 WHERE qa."lessonId" = l.id;
ALTER TABLE "QuizAttempt" DROP COLUMN "lessonId";

-- 5. FlashcardReview.cardId → cardKey
-- The new key format is "{lessonSlug}:{ordinal}" but old rows referenced cuids.
-- Cards were created in a deterministic order per lesson, so we can rebuild the
-- key from the original Flashcard rows ordered by their createdAt.
ALTER TABLE "FlashcardReview" ADD COLUMN "cardKey" TEXT;
WITH ranked AS (
  SELECT f.id,
         l.slug || ':' || ROW_NUMBER() OVER (PARTITION BY f."lessonId" ORDER BY f."createdAt") AS new_key
    FROM "Flashcard" f
    JOIN "Lesson" l ON l.id = f."lessonId"
)
UPDATE "FlashcardReview" fr
   SET "cardKey" = r.new_key
  FROM ranked r
 WHERE fr."cardId" = r.id;
ALTER TABLE "FlashcardReview" DROP CONSTRAINT IF EXISTS "FlashcardReview_cardId_fkey";
ALTER TABLE "FlashcardReview" DROP COLUMN "cardId";
DELETE FROM "FlashcardReview" WHERE "cardKey" IS NULL;
ALTER TABLE "FlashcardReview" ALTER COLUMN "cardKey" SET NOT NULL;
CREATE INDEX "FlashcardReview_userId_nextReview_idx" ON "FlashcardReview"("userId", "nextReview");
CREATE INDEX "FlashcardReview_cardKey_idx" ON "FlashcardReview"("cardKey");

-- 6. QuizAttemptQuestion.questionId → questionKey
-- Same trick: rebuild question key from original QuizQuestion ordered by createdAt.
ALTER TABLE "QuizAttemptQuestion" ADD COLUMN "questionKey" TEXT;
WITH ranked AS (
  SELECT q.id,
         l.slug || ':q' || ROW_NUMBER() OVER (PARTITION BY q."lessonId" ORDER BY q."createdAt") AS new_key
    FROM "QuizQuestion" q
    JOIN "Lesson" l ON l.id = q."lessonId"
)
UPDATE "QuizAttemptQuestion" qaq
   SET "questionKey" = r.new_key
  FROM ranked r
 WHERE qaq."questionId" = r.id;
ALTER TABLE "QuizAttemptQuestion" DROP CONSTRAINT IF EXISTS "QuizAttemptQuestion_questionId_fkey";
ALTER TABLE "QuizAttemptQuestion" DROP COLUMN "questionId";
DELETE FROM "QuizAttemptQuestion" WHERE "questionKey" IS NULL;
ALTER TABLE "QuizAttemptQuestion" ALTER COLUMN "questionKey" SET NOT NULL;

-- 7. UserAchievement.achievementId → achievementSlug
ALTER TABLE "UserAchievement" ADD COLUMN "achievementSlug" TEXT;
UPDATE "UserAchievement" ua
   SET "achievementSlug" = a.slug
  FROM "Achievement" a
 WHERE ua."achievementId" = a.id;
ALTER TABLE "UserAchievement" DROP CONSTRAINT IF EXISTS "UserAchievement_achievementId_fkey";
ALTER TABLE "UserAchievement" DROP CONSTRAINT IF EXISTS "UserAchievement_userId_achievementId_key";
ALTER TABLE "UserAchievement" DROP COLUMN "achievementId";
DELETE FROM "UserAchievement" WHERE "achievementSlug" IS NULL;
ALTER TABLE "UserAchievement" ALTER COLUMN "achievementSlug" SET NOT NULL;
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_achievementSlug_key" UNIQUE ("userId", "achievementSlug");

-- 8. Drop content tables (now unreferenced)
DROP TABLE IF EXISTS "Flashcard"      CASCADE;
DROP TABLE IF EXISTS "QuizQuestion"   CASCADE;
DROP TABLE IF EXISTS "Achievement"    CASCADE;
DROP TABLE IF EXISTS "DailyChallenge" CASCADE;
DROP TABLE IF EXISTS "Lesson"         CASCADE;
DROP TABLE IF EXISTS "LearningPath"   CASCADE;

-- 9. Drop unused enums
DROP TYPE IF EXISTS "QuestionType" CASCADE;
DROP TYPE IF EXISTS "Rarity"       CASCADE;
DROP TYPE IF EXISTS "ChallengeType" CASCADE;

COMMIT;
