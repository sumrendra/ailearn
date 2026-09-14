import { prisma } from "@/lib/prisma";
import { getAllFlashcards, getFlashcardsForTheme } from "@/lib/content";
import { VOCAB_THEMES } from "./vocab-themes";
import { getExamLemmaFlashcards, getPackFlashcards } from "@/lib/content/tcf-exam-lexique";
import { isMasteredForProgress } from "@/lib/flashcard-srs";

function percentMastered(
  cardKeys: string[],
  reviews: Map<string, { interval: number; rating: number }>,
): number {
  if (cardKeys.length === 0) return 0;
  let mastered = 0;
  for (const key of cardKeys) {
    const r = reviews.get(key);
    if (r && isMasteredForProgress(r.interval, r.rating)) mastered += 1;
  }
  return Math.round((mastered / cardKeys.length) * 100);
}

export async function loadUserCardReviews(userId: string) {
  const rows = await prisma.flashcardReview.findMany({
    where: { userId },
    select: { cardKey: true, interval: true, rating: true, nextReview: true },
  });
  const byKey = new Map<string, { interval: number; rating: number; nextReview: Date }>();
  for (const row of rows) {
    byKey.set(row.cardKey, {
      interval: row.interval,
      rating: row.rating,
      nextReview: row.nextReview,
    });
  }
  return byKey;
}

export async function getVocabThemePercents(userId: string): Promise<Record<string, number>> {
  const reviews = await loadUserCardReviews(userId);
  const reviewSimple = new Map(
    [...reviews.entries()].map(([k, v]) => [k, { interval: v.interval, rating: v.rating }]),
  );
  const out: Record<string, number> = {};
  for (const theme of VOCAB_THEMES) {
    const keys = getFlashcardsForTheme(theme.id).map((c) => c.key);
    out[theme.id] = percentMastered(keys, reviewSimple);
  }
  return out;
}

export async function getExamBandPercents(userId: string): Promise<Record<"a" | "b" | "c", number>> {
  const reviews = await loadUserCardReviews(userId);
  const reviewSimple = new Map(
    [...reviews.entries()].map(([k, v]) => [k, { interval: v.interval, rating: v.rating }]),
  );
  return {
    a: percentMastered(getExamLemmaFlashcards("a").map((c) => c.key), reviewSimple),
    b: percentMastered(getExamLemmaFlashcards("b").map((c) => c.key), reviewSimple),
    c: percentMastered(getExamLemmaFlashcards("c").map((c) => c.key), reviewSimple),
  };
}

export async function countDueFlashcards(userId: string): Promise<number> {
  const now = new Date();
  const tcfKeys = new Set(
    getAllFlashcards()
      .filter((c) => c.tags.some((t) => t === "TCF Canada" || t === "Lexique"))
      .map((c) => c.key),
  );
  const reviews = await loadUserCardReviews(userId);
  let due = 0;
  for (const key of tcfKeys) {
    const r = reviews.get(key);
    if (!r || r.nextReview <= now) due += 1;
  }
  return due;
}

export function getPackProgressKeys(packId: string): string[] {
  return getPackFlashcards(packId).map((c) => c.key);
}

export function getCoreExamCardKeys(): string[] {
  return [
    ...getExamLemmaFlashcards("a").map((c) => c.key),
    ...getExamLemmaFlashcards("b").map((c) => c.key),
    ...getExamLemmaFlashcards("c").map((c) => c.key),
  ];
}

function countMasteredKeys(
  cardKeys: string[],
  reviews: Map<string, { interval: number; rating: number }>,
): number {
  let mastered = 0;
  for (const key of cardKeys) {
    const r = reviews.get(key);
    if (r && isMasteredForProgress(r.interval, r.rating)) mastered += 1;
  }
  return mastered;
}

export async function getCoreVocabProgress(userId: string): Promise<{
  mastered: number;
  total: number;
  due: number;
  byBand: Record<"a" | "b" | "c", { mastered: number; total: number }>;
}> {
  const reviews = await loadUserCardReviews(userId);
  const reviewSimple = new Map(
    [...reviews.entries()].map(([k, v]) => [k, { interval: v.interval, rating: v.rating }]),
  );
  const bands = ["a", "b", "c"] as const;
  const byBand = {} as Record<"a" | "b" | "c", { mastered: number; total: number }>;
  let total = 0;
  let mastered = 0;
  for (const band of bands) {
    const keys = getExamLemmaFlashcards(band).map((c) => c.key);
    const m = countMasteredKeys(keys, reviewSimple);
    byBand[band] = { mastered: m, total: keys.length };
    total += keys.length;
    mastered += m;
  }
  const due = await countDueFlashcards(userId);
  return { mastered, total, due, byBand };
}
