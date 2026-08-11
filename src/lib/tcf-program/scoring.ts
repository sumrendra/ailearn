/**
 * TCF Canada comprehension scoring on the official 0–699 scale.
 *
 * The real exam does not count raw correct answers: FEI converts them with a
 * barème that weights each item by difficulty ("Ce score brut ne constitue pas
 * une mesure en soi... un barème est établi pour convertir le score brut en
 * note calibrée (100 à 699)" — Manuel du candidat TCF).
 *
 * A flat `correct / 39 * 699` badly overstates candidates who only answer the
 * easy first third, which is the most common failure profile: on the real exam
 * Q1–10 are worth ~9% of the scale while Q20–39 are worth ~71%.
 *
 * The band weights below reproduce that published distribution and sum to
 * exactly 699 for each skill.
 */

import type { TCFLevel } from "@/lib/content/tcf-listening";
import { NCLC7_TARGETS, scoreToNclcListening, scoreToNclcReading } from "./nclc";

export interface ScoreBand {
  /** Inclusive 1-based question range. */
  from: number;
  to: number;
  label: string;
  pointsPerQuestion: number;
}

/** Compréhension orale — 39 items, 699 points. */
export const LISTENING_BANDS: ScoreBand[] = [
  { from: 1, to: 4, label: "A1", pointsPerQuestion: 3 },
  { from: 5, to: 10, label: "A2", pointsPerQuestion: 9 },
  { from: 11, to: 19, label: "A2–B1", pointsPerQuestion: 15 },
  { from: 20, to: 30, label: "B1–B2", pointsPerQuestion: 21 },
  { from: 31, to: 35, label: "B2–C1", pointsPerQuestion: 27 },
  { from: 36, to: 39, label: "C1–C2", pointsPerQuestion: 33 },
];

/** Compréhension écrite — 39 items, 699 points. */
export const READING_BANDS: ScoreBand[] = [
  { from: 1, to: 4, label: "A1", pointsPerQuestion: 3 },
  { from: 5, to: 10, label: "A2", pointsPerQuestion: 9 },
  { from: 11, to: 19, label: "B1", pointsPerQuestion: 15 },
  { from: 20, to: 29, label: "B2", pointsPerQuestion: 21 },
  { from: 30, to: 35, label: "C1", pointsPerQuestion: 26 },
  { from: 36, to: 39, label: "C2", pointsPerQuestion: 33 },
];

export type ComprehensionSkill = "listening" | "reading";

export function bandsFor(skill: ComprehensionSkill): ScoreBand[] {
  return skill === "listening" ? LISTENING_BANDS : READING_BANDS;
}

export function maxScoreFor(skill: ComprehensionSkill): number {
  return bandsFor(skill).reduce(
    (sum, b) => sum + (b.to - b.from + 1) * b.pointsPerQuestion,
    0,
  );
}

/** Points awarded for a correct answer at a 1-based question number. */
export function pointsForQuestion(skill: ComprehensionSkill, questionNumber: number): number {
  const band = bandsFor(skill).find((b) => questionNumber >= b.from && questionNumber <= b.to);
  return band?.pointsPerQuestion ?? 0;
}

export interface BandResult {
  label: string;
  from: number;
  to: number;
  correct: number;
  total: number;
  pointsEarned: number;
  pointsAvailable: number;
}

export interface ComprehensionScore {
  skill: ComprehensionSkill;
  /** Calibrated 0–699 score. */
  score699: number;
  maxScore: number;
  correct: number;
  total: number;
  /** Unweighted percentage, shown only for reference. */
  rawPercent: number;
  bands: BandResult[];
}

/**
 * Score a comprehension section from the answer sheet.
 *
 * `answers[i]` is the chosen option index for question i+1 (null = unanswered),
 * matching the exam rule that blanks and wrong answers both score 0.
 */
export function scoreComprehension(
  skill: ComprehensionSkill,
  answers: (number | null)[],
  correctIndices: number[],
): ComprehensionScore {
  const bands = bandsFor(skill);
  const total = correctIndices.length;

  const bandResults: BandResult[] = bands.map((band) => {
    let correct = 0;
    let count = 0;
    for (let q = band.from; q <= Math.min(band.to, total); q++) {
      count++;
      if (answers[q - 1] != null && answers[q - 1] === correctIndices[q - 1]) correct++;
    }
    return {
      label: band.label,
      from: band.from,
      to: band.to,
      correct,
      total: count,
      pointsEarned: correct * band.pointsPerQuestion,
      pointsAvailable: count * band.pointsPerQuestion,
    };
  });

  const score699 = bandResults.reduce((sum, b) => sum + b.pointsEarned, 0);
  const correct = bandResults.reduce((sum, b) => sum + b.correct, 0);

  return {
    skill,
    score699,
    maxScore: maxScoreFor(skill),
    correct,
    total,
    rawPercent: total > 0 ? correct / total : 0,
    bands: bandResults,
  };
}

/** CEFR level from a 0–699 comprehension score (FEI level grid). */
export function cefrFromScore699(score699: number): TCFLevel | "pre-A1" {
  if (score699 >= 600) return "C2";
  if (score699 >= 500) return "C1";
  if (score699 >= 400) return "B2";
  if (score699 >= 300) return "B1";
  if (score699 >= 200) return "A2";
  if (score699 >= 100) return "A1";
  return "pre-A1";
}

export interface ScoreDescription {
  clb: string;
  cefr: string;
  description: string;
  score699: number;
}

/** NCLC label and CEFR level for a calibrated comprehension score. */
export function describeComprehensionScore(
  skill: ComprehensionSkill,
  score699: number,
): ScoreDescription {
  const nclc =
    skill === "listening" ? scoreToNclcListening(score699) : scoreToNclcReading(score699);
  const cefr = cefrFromScore699(score699);
  const threshold =
    skill === "listening" ? NCLC7_TARGETS.listening.min : NCLC7_TARGETS.reading.min;

  const belowFloor = skill === "listening" ? score699 < 331 : score699 < 342;
  if (belowFloor) {
    return {
      clb: "Sous NCLC 4",
      cefr,
      description: "En dessous du premier palier NCLC",
      score699,
    };
  }

  const description =
    score699 >= threshold
      ? "Seuil NCLC 7 atteint — éligible Entrée express"
      : `Sous le seuil NCLC 7 (${threshold}/699)`;

  return { clb: `NCLC ${nclc}`, cefr, description, score699 };
}

/**
 * Weakest band that is costing the most points — the highest-leverage place to
 * study next, since later bands carry several times the weight of early ones.
 */
export function biggestPointLoss(score: ComprehensionScore): BandResult | null {
  const losses = score.bands
    .map((b) => ({ band: b, lost: b.pointsAvailable - b.pointsEarned }))
    .sort((a, b) => b.lost - a.lost);
  return losses[0]?.lost ? losses[0].band : null;
}
