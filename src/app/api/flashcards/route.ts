import { NextRequest } from "next/server";
import { getAllFlashcards, getFlashcardsForLesson, getFlashcardsForTheme, getLessonBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lessonSlug = req.nextUrl.searchParams.get("lesson");
  const theme = req.nextUrl.searchParams.get("theme");
  const cards = lessonSlug
    ? getFlashcardsForLesson(lessonSlug)
    : theme
      ? getFlashcardsForTheme(theme)
      : getAllFlashcards().slice(0, 50);

  const limit = theme || lessonSlug ? 200 : 50;
  const result = cards.slice(0, limit).map((c) => {
    const lesson = getLessonBySlug(c.lessonSlug);
    return {
      id: c.key,
      front: c.front,
      back: c.back,
      tags: c.tags,
      lessonTitle: lesson?.title ?? null,
      lessonSlug: c.lessonSlug,
    };
  });

  return new Response(JSON.stringify({ cards: result }), {
    headers: { "Content-Type": "application/json" },
  });
}
