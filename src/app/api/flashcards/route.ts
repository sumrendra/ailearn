import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getAllFlashcards,
  getFlashcardsForBand,
  getFlashcardsForLesson,
  getFlashcardsForPack,
  getFlashcardsForTheme,
  getFlashcardByKey,
  getLessonBySlug,
} from "@/lib/content";
import type { TcfExamBand } from "@/lib/content/tcf-exam-lexique";
import { loadUserCardReviews } from "@/lib/tcf-program/vocab-progress";

export const dynamic = "force-dynamic";

function sortByDue(
  cards: ReturnType<typeof getAllFlashcards>,
  reviews: Map<string, { nextReview: Date }>,
) {
  const now = Date.now();
  return [...cards].sort((a, b) => {
    const ra = reviews.get(a.key);
    const rb = reviews.get(b.key);
    const dueA = !ra || ra.nextReview.getTime() <= now;
    const dueB = !rb || rb.nextReview.getTime() <= now;
    if (dueA !== dueB) return dueA ? -1 : 1;
    return a.key.localeCompare(b.key);
  });
}

export async function GET(req: NextRequest) {
  const lessonSlug = req.nextUrl.searchParams.get("lesson");
  const theme = req.nextUrl.searchParams.get("theme");
  const band = req.nextUrl.searchParams.get("band") as TcfExamBand | null;
  const pack = req.nextUrl.searchParams.get("pack");
  const keysParam = req.nextUrl.searchParams.get("keys");

  let cards = lessonSlug
    ? getFlashcardsForLesson(lessonSlug)
    : theme
      ? getFlashcardsForTheme(theme)
      : band && ["a", "b", "c"].includes(band)
        ? getFlashcardsForBand(band)
        : pack
          ? getFlashcardsForPack(pack)
          : keysParam
            ? keysParam
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
                .map((k) => getFlashcardByKey(k))
                .filter((c): c is NonNullable<typeof c> => Boolean(c))
            : getAllFlashcards().slice(0, 50);

  const session = await auth();
  let reviews = new Map<string, { nextReview: Date; interval: number; rating: number }>();
  if (session?.user?.id) {
    reviews = await loadUserCardReviews(session.user.id);
    if (theme || band || pack || lessonSlug || keysParam) {
      cards = sortByDue(cards, reviews);
    }
  }

  const limit = theme || lessonSlug || band || pack || keysParam ? 400 : 50;
  const result = cards.slice(0, limit).map((c) => {
    const lesson = getLessonBySlug(c.lessonSlug);
    const rev = reviews.get(c.key);
    return {
      id: c.key,
      front: c.front,
      back: c.back,
      tags: c.tags,
      lessonTitle: lesson?.title ?? null,
      lessonSlug: c.lessonSlug,
      nextReview: rev?.nextReview.toISOString() ?? null,
      due: rev ? rev.nextReview.getTime() <= Date.now() : true,
    };
  });

  return new Response(JSON.stringify({ cards: result }), {
    headers: { "Content-Type": "application/json" },
  });
}
