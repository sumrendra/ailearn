/**
 * Public API for static educational content.
 *
 * All lessons, learning paths, flashcards, quizzes, and achievements live in
 * code (not the database). This file is the single import surface every page
 * uses; the underlying data files (paths.ts, flashcards.ts, etc.) are private
 * implementation details.
 *
 * Lookups are O(n) over small arrays — under 1000 items total — so we don't
 * bother with maps. If counts ever grow into the thousands, wrap with memoized
 * Map indexes.
 */

import { PATHS } from "./paths";
import { FLASHCARDS } from "./flashcards";
import { QUIZ_QUESTIONS } from "./quizzes";
import { ACHIEVEMENTS } from "./achievements";
import type { LearningPath, Lesson, Flashcard, QuizQuestion, Achievement } from "./types";

export type { LearningPath, Lesson, Flashcard, QuizQuestion, Achievement } from "./types";

/* ── Paths ──────────────────────────────────────────────────────────────── */

export function getAllPaths(): LearningPath[] {
  return PATHS;
}

export function getPathBySlug(slug: string): LearningPath | undefined {
  return PATHS.find((p) => p.slug === slug);
}

/* ── Lessons ────────────────────────────────────────────────────────────── */

export function getAllLessons(): (Lesson & { pathSlug: string; pathTitle: string })[] {
  return PATHS.flatMap((p) =>
    p.lessons.map((l) => ({ ...l, pathSlug: p.slug, pathTitle: p.title })),
  );
}

export function getLessonBySlug(slug: string): (Lesson & { pathSlug: string; pathTitle: string }) | undefined {
  for (const p of PATHS) {
    const l = p.lessons.find((x) => x.slug === slug);
    if (l) return { ...l, pathSlug: p.slug, pathTitle: p.title };
  }
  return undefined;
}

export function getLessonsForPath(pathSlug: string): Lesson[] {
  return getPathBySlug(pathSlug)?.lessons ?? [];
}

/* ── Flashcards ─────────────────────────────────────────────────────────── */

export function getAllFlashcards(): Flashcard[] {
  return FLASHCARDS;
}

export function getFlashcardsForLesson(lessonSlug: string): Flashcard[] {
  return FLASHCARDS.filter((f) => f.lessonSlug === lessonSlug);
}

export function getFlashcardByKey(key: string): Flashcard | undefined {
  return FLASHCARDS.find((f) => f.key === key);
}

/* ── Quiz questions ─────────────────────────────────────────────────────── */

export function getAllQuizQuestions(): QuizQuestion[] {
  return QUIZ_QUESTIONS;
}

export function getQuizQuestionsForLesson(lessonSlug: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.lessonSlug === lessonSlug);
}

/* ── Achievements ───────────────────────────────────────────────────────── */

export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENTS;
}

export function getAchievementBySlug(slug: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.slug === slug);
}
