/**
 * Static content types — the shape of the educational data that used to live
 * in the database. Single source of truth: lives in code, served directly,
 * no seed step required.
 */

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "CODE_REVIEW" | "SCENARIO";

export type ChallengeType = "CONCEPT" | "PAPER" | "CODE_SNIPPET" | "SCENARIO" | "TOOL_SPOTLIGHT";

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  /** Lucide icon name hint — actual icon resolved by getPathMeta(slug) */
  icon: string;
  color: string;
  difficulty: Difficulty;
  estimatedHours: number;
  tags: string[];
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  content: string;
  /** Position within the path (1-indexed) */
  order: number;
  estimatedMins: number;
  xpReward: number;
  tags: string[];
}

export interface Flashcard {
  /** Stable string key — typically `${lessonSlug}:${index}` */
  key: string;
  lessonSlug: string;
  front: string;
  back: string;
  tags: string[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  /** Stable string key — typically `${lessonSlug}:q${index}` */
  key: string;
  lessonSlug: string;
  type: QuestionType;
  question: string;
  /** MCQ-only */
  options?: QuizOption[];
  /** TRUE_FALSE / SHORT_ANSWER */
  correctAnswer?: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface Achievement {
  slug: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: Rarity;
}

export interface DailyChallenge {
  /** ISO date string — YYYY-MM-DD */
  date: string;
  type: ChallengeType;
  title: string;
  content: string;
  xpReward: number;
  tags: string[];
}
