import { prisma } from "@/lib/prisma";
import { getFlashcardByKey } from "@/lib/content";
import { isMasteredForProgress } from "@/lib/flashcard-srs";
import { getCoreExamCardKeys, loadUserCardReviews } from "@/lib/tcf-program/vocab-progress";

export const DEFAULT_NEW_DAILY_CAP = 15;
export const DEFAULT_REVIEW_SESSION_CAP = 40;

export type VocabSrsBreakdown = {
  total: number;
  new: number;
  dueReview: number;
  learning: number;
  mastered: number;
  newIntroducedToday: number;
  newRemainingToday: number;
  newDailyCap: number;
};

export type StudySessionMeta = {
  newInSession: number;
  reviewInSession: number;
  newDailyCap: number;
  reviewCap: number;
  remainingNew: number;
  remainingDueReview: number;
  breakdown: VocabSrsBreakdown;
};

type VocabStudyPrefs = {
  newIntroducedDate?: string;
  newIntroducedCount?: number;
  newDailyCap?: number;
  reviewCap?: number;
};

function isoDateLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseRoadmapPrefs(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

export async function getVocabStudyPrefs(userId: string): Promise<Required<VocabStudyPrefs>> {
  const profile = await prisma.tcfProfile.findUnique({
    where: { userId },
    select: { roadmapPrefs: true },
  });
  const root = parseRoadmapPrefs(profile?.roadmapPrefs);
  const v = (root.vocabStudy ?? {}) as VocabStudyPrefs;
  const today = isoDateLocal();
  const count =
    v.newIntroducedDate === today && typeof v.newIntroducedCount === "number"
      ? v.newIntroducedCount
      : 0;
  return {
    newIntroducedDate: v.newIntroducedDate === today ? today : today,
    newIntroducedCount: count,
    newDailyCap:
      typeof v.newDailyCap === "number" && v.newDailyCap >= 1 && v.newDailyCap <= 50
        ? v.newDailyCap
        : DEFAULT_NEW_DAILY_CAP,
    reviewCap:
      typeof v.reviewCap === "number" && v.reviewCap >= 5 && v.reviewCap <= 100
        ? v.reviewCap
        : DEFAULT_REVIEW_SESSION_CAP,
  };
}

export async function recordNewCardIntroduced(userId: string): Promise<void> {
  const profile = await prisma.tcfProfile.findUnique({
    where: { userId },
    select: { roadmapPrefs: true },
  });
  const root = parseRoadmapPrefs(profile?.roadmapPrefs);
  const v = (root.vocabStudy ?? {}) as VocabStudyPrefs;
  const today = isoDateLocal();
  const prevCount = v.newIntroducedDate === today && typeof v.newIntroducedCount === "number" ? v.newIntroducedCount : 0;
  const vocabStudy: VocabStudyPrefs = {
    ...v,
    newIntroducedDate: today,
    newIntroducedCount: prevCount + 1,
    newDailyCap: v.newDailyCap ?? DEFAULT_NEW_DAILY_CAP,
    reviewCap: v.reviewCap ?? DEFAULT_REVIEW_SESSION_CAP,
  };
  const roadmapPrefs = { ...root, vocabStudy };
  await prisma.tcfProfile.upsert({
    where: { userId },
    create: { userId, roadmapPrefs },
    update: { roadmapPrefs },
  });
}

export async function getCoreVocabSrsBreakdown(userId: string): Promise<VocabSrsBreakdown> {
  const keys = getCoreExamCardKeys();
  const reviews = await loadUserCardReviews(userId);
  const prefs = await getVocabStudyPrefs(userId);
  const now = Date.now();
  let newCount = 0;
  let dueReview = 0;
  let learning = 0;
  let mastered = 0;

  for (const key of keys) {
    const r = reviews.get(key);
    if (!r) {
      newCount += 1;
      continue;
    }
    if (isMasteredForProgress(r.interval, r.rating)) {
      mastered += 1;
      if (r.nextReview.getTime() <= now) dueReview += 1;
      continue;
    }
    if (r.nextReview.getTime() <= now) dueReview += 1;
    else learning += 1;
  }

  const newRemainingToday = Math.max(0, prefs.newDailyCap - prefs.newIntroducedCount);

  return {
    total: keys.length,
    new: newCount,
    dueReview,
    learning,
    mastered,
    newIntroducedToday: prefs.newIntroducedCount,
    newRemainingToday,
    newDailyCap: prefs.newDailyCap,
  };
}

export async function buildCoreStudyQueue(userId: string): Promise<{
  cardKeys: string[];
  cardPhases: ("new" | "review")[];
  meta: StudySessionMeta;
}> {
  const keys = getCoreExamCardKeys();
  const reviews = await loadUserCardReviews(userId);
  const prefs = await getVocabStudyPrefs(userId);
  const breakdown = await getCoreVocabSrsBreakdown(userId);
  const now = Date.now();

  const dueReviews: { key: string; due: number }[] = [];
  const unseen: string[] = [];

  for (const key of keys) {
    const r = reviews.get(key);
    if (!r) {
      unseen.push(key);
      continue;
    }
    if (r.nextReview.getTime() <= now) {
      dueReviews.push({ key, due: r.nextReview.getTime() });
    }
  }

  dueReviews.sort((a, b) => a.due - b.due);
  unseen.sort((a, b) => a.localeCompare(b));

  const reviewTake = dueReviews.slice(0, prefs.reviewCap).map((d) => d.key);
  const newTake = unseen.slice(0, breakdown.newRemainingToday);

  const cardKeys = [...reviewTake, ...newTake];
  const cardPhases: ("new" | "review")[] = [
    ...reviewTake.map(() => "review" as const),
    ...newTake.map(() => "new" as const),
  ];

  return {
    cardKeys,
    cardPhases,
    meta: {
      newInSession: newTake.length,
      reviewInSession: reviewTake.length,
      newDailyCap: prefs.newDailyCap,
      reviewCap: prefs.reviewCap,
      remainingNew: Math.max(0, breakdown.new - newTake.length),
      remainingDueReview: Math.max(0, breakdown.dueReview - reviewTake.length),
      breakdown,
    },
  };
}

export function validateStudyCardKeys(cardKeys: string[]): string[] {
  const core = new Set(getCoreExamCardKeys());
  return cardKeys.filter((k) => core.has(k) && getFlashcardByKey(k));
}
