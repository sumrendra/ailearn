/**
 * Assembles a 39-item comprehension section.
 *
 * A fixed set of five papers is memorisable: scores climb on a retake without
 * the candidate's French improving, which is exactly the false confidence the
 * simulator exists to prevent. Exam mode therefore draws each sitting from the
 * pooled bank (5 papers x 39 items per skill), stratified so every slot keeps
 * the CEFR level the official barème assigns to that position.
 *
 * Draws are seeded so a sitting stays stable across reloads and across the
 * section handoffs of a full mock.
 */

import type { TCFLevel } from "@/lib/content/tcf-listening";
import { LISTENING_PAPERS, READING_PAPERS, PAPER_COUNT } from "@/lib/content/tcf-papers";
import type { ComprehensionSkill } from "./scoring";

/** Where an item came from, so listening can resolve its stored audio. */
export interface ExamItemSource {
  sourcePaper: number;
  /** 0-based index within the source paper, matching the audio route. */
  sourceQuestionIndex: number;
}

export type DrawnItem<T> = T & ExamItemSource & { id: number };

interface LevelSlot {
  level: TCFLevel;
  count: number;
}

/**
 * Target CEFR level for each position, aligned with the scoring bands in
 * `scoring.ts` so difficulty and point weight always agree.
 */
const LISTENING_COMPOSITION: LevelSlot[] = [
  { level: "A1", count: 4 },
  { level: "A2", count: 6 },
  { level: "B1", count: 9 },
  { level: "B2", count: 11 },
  { level: "C1", count: 5 },
  { level: "C2", count: 4 },
];

const READING_COMPOSITION: LevelSlot[] = [
  { level: "A1", count: 4 },
  { level: "A2", count: 6 },
  { level: "B1", count: 9 },
  { level: "B2", count: 10 },
  { level: "C1", count: 6 },
  { level: "C2", count: 4 },
];

export function compositionFor(skill: ComprehensionSkill): LevelSlot[] {
  return skill === "listening" ? LISTENING_COMPOSITION : READING_COMPOSITION;
}

/** Deterministic PRNG so a seed always rebuilds the same exam. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function newExamSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

type PoolEntry<T> = { item: T; source: ExamItemSource; level: TCFLevel };

function buildPool<T extends { level: TCFLevel }>(
  papers: Record<number, T[]>,
): PoolEntry<T>[] {
  const pool: PoolEntry<T>[] = [];
  for (let p = 1; p <= PAPER_COUNT; p++) {
    const questions = papers[p];
    if (!questions) continue;
    questions.forEach((item, index) => {
      pool.push({ item, source: { sourcePaper: p, sourceQuestionIndex: index }, level: item.level });
    });
  }
  return pool;
}

/** Levels to fall back on when a target level is exhausted, nearest first. */
const LEVEL_ORDER: TCFLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function fallbackLevels(level: TCFLevel): TCFLevel[] {
  const home = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER.map((l, i) => ({ l, distance: Math.abs(i - home) }))
    .filter((x) => x.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .map((x) => x.l);
}

function drawFromPool<T extends { level: TCFLevel }>(
  pool: PoolEntry<T>[],
  composition: LevelSlot[],
  rand: () => number,
): PoolEntry<T>[] {
  const byLevel = new Map<TCFLevel, PoolEntry<T>[]>();
  for (const level of LEVEL_ORDER) {
    byLevel.set(
      level,
      shuffled(pool.filter((e) => e.level === level), rand),
    );
  }

  const picked: PoolEntry<T>[] = [];
  for (const slot of composition) {
    for (let n = 0; n < slot.count; n++) {
      let entry = byLevel.get(slot.level)?.pop();
      if (!entry) {
        for (const alt of fallbackLevels(slot.level)) {
          entry = byLevel.get(alt)?.pop();
          if (entry) break;
        }
      }
      if (entry) picked.push(entry);
    }
  }
  return picked;
}

/**
 * Draw a randomized exam section. Items are renumbered 1..39 in ascending
 * difficulty, matching the real exam's progressive ordering.
 */
export function drawExamSection<T extends { level: TCFLevel }>(
  skill: ComprehensionSkill,
  seed: number,
): DrawnItem<T>[] {
  const papers = (skill === "listening" ? LISTENING_PAPERS : READING_PAPERS) as unknown as Record<number, T[]>;
  const rand = mulberry32(seed);
  const pool = buildPool(papers);
  const picked = drawFromPool(pool, compositionFor(skill), rand);

  return picked.map((entry, i) => ({
    ...entry.item,
    ...entry.source,
    id: i + 1,
  }));
}

/** A fixed paper presented through the same shape as a drawn one. */
export function fixedExamSection<T extends { level: TCFLevel }>(
  skill: ComprehensionSkill,
  paper: number,
): DrawnItem<T>[] {
  const papers = (skill === "listening" ? LISTENING_PAPERS : READING_PAPERS) as unknown as Record<number, T[]>;
  const questions = papers[paper] ?? papers[1] ?? [];
  return questions.map((item, index) => ({
    ...item,
    sourcePaper: paper,
    sourceQuestionIndex: index,
    id: index + 1,
  }));
}

/**
 * Exam mode draws from the whole bank; practice mode keeps the chosen paper so
 * learners can work through a known set and review it.
 */
export function resolveExamSection<T extends { level: TCFLevel }>(
  skill: ComprehensionSkill,
  options: { paper: number; seed?: number | null },
): DrawnItem<T>[] {
  return options.seed != null
    ? drawExamSection<T>(skill, options.seed)
    : fixedExamSection<T>(skill, options.paper);
}

/** Distinct source papers an exam pulls audio from. */
export function sourcePapersOf(items: ExamItemSource[]): number[] {
  return [...new Set(items.map((i) => i.sourcePaper))].sort((a, b) => a - b);
}
