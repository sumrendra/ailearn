import { auth } from "@/auth";
import { getFlashcardByKey, getLessonBySlug } from "@/lib/content";
import { toComprehensionDisplay } from "@/lib/tcf-program/flashcard-display";
import { loadUserCardReviews } from "@/lib/tcf-program/vocab-progress";
import { buildCoreStudyQueue } from "@/lib/tcf-program/vocab-study-queue";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "Sign in to load your daily study queue." }, { status: 401 });
  }

  const { cardKeys, cardPhases, meta } = await buildCoreStudyQueue(userId);
  const reviews = await loadUserCardReviews(userId);
  const now = Date.now();

  const cards = cardKeys
    .map((key) => getFlashcardByKey(key))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => {
      const lesson = getLessonBySlug(c.lessonSlug);
      const rev = reviews.get(c.key);
      return toComprehensionDisplay({
        id: c.key,
        front: c.front,
        back: c.back,
        tags: c.tags,
        lessonTitle: lesson?.title ?? null,
        lessonSlug: c.lessonSlug,
        nextReview: rev?.nextReview.toISOString() ?? null,
        due: rev ? rev.nextReview.getTime() <= now : true,
      });
    });

  return Response.json({ cards, cardPhases, meta });
}
