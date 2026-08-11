/**
 * Turns four mock section scores into an honest "would you pass?" verdict.
 *
 * IRCC does not average TCF sections: the effective NCLC is the *lowest* of the
 * four, so one weak skill caps eligibility no matter how strong the others are.
 *
 * Our comprehension scores come from a weighted approximation of the FEI
 * barème, not the proprietary IRT model, so a score sitting exactly on a band
 * floor is not evidence of passing. Each skill therefore has a safety margin;
 * only candidates clearing it are reported as ready.
 */

import { NCLC_BANDS, scoreToNclcListening, scoreToNclcProduction, scoreToNclcReading } from "./nclc";

export type ExamSkill = "listening" | "reading" | "writing" | "speaking";

export const SKILL_ORDER: ExamSkill[] = ["listening", "reading", "writing", "speaking"];

export const SKILL_LABELS: Record<ExamSkill, string> = {
  listening: "Compréhension orale",
  reading: "Compréhension écrite",
  writing: "Expression écrite",
  speaking: "Expression orale",
};

export interface SkillThreshold {
  /** Minimum score for the target NCLC level. */
  floor: number;
  /** Score that clears the band comfortably, absorbing estimation error. */
  safe: number;
  /** "699" for comprehension, "20" for production. */
  scale: "699" | "20";
}

/** Thresholds for NCLC 7, the usual Express Entry requirement. */
export const NCLC7_THRESHOLDS: Record<ExamSkill, SkillThreshold> = {
  listening: { floor: 458, safe: 480, scale: "699" },
  reading: { floor: 453, safe: 475, scale: "699" },
  writing: { floor: 10, safe: 12, scale: "20" },
  speaking: { floor: 10, safe: 12, scale: "20" },
};

export type SkillVerdict = "clear" | "borderline" | "below";

export interface SkillReadiness {
  skill: ExamSkill;
  score: number;
  scale: "699" | "20";
  nclc: number;
  floor: number;
  safe: number;
  verdict: SkillVerdict;
  /** Points still needed to reach the safety margin (0 when already clear). */
  pointsToSafe: number;
}

export type ExamVerdict = "ready" | "borderline" | "not-ready" | "incomplete";

export interface ExamReadiness {
  verdict: ExamVerdict;
  /** Lowest NCLC across completed skills — the IRCC rule. */
  effectiveNclc: number;
  skills: SkillReadiness[];
  /** Skills that are not yet clear, weakest first. */
  blockers: SkillReadiness[];
  summary: string;
}

export function nclcForSkill(skill: ExamSkill, score: number): number {
  if (skill === "listening") return scoreToNclcListening(score);
  if (skill === "reading") return scoreToNclcReading(score);
  return scoreToNclcProduction(score);
}

function assessSkill(skill: ExamSkill, score: number): SkillReadiness {
  const { floor, safe, scale } = NCLC7_THRESHOLDS[skill];
  const verdict: SkillVerdict = score >= safe ? "clear" : score >= floor ? "borderline" : "below";
  return {
    skill,
    score,
    scale,
    nclc: nclcForSkill(skill, score),
    floor,
    safe,
    verdict,
    pointsToSafe: Math.max(0, safe - score),
  };
}

/**
 * `scores` holds the section score on that skill's own scale: 0–699 for
 * listening and reading, 0–20 for writing and speaking. Missing skills mark
 * the exam incomplete.
 */
export function evaluateExamReadiness(
  scores: Partial<Record<ExamSkill, number>>,
): ExamReadiness {
  const completed = SKILL_ORDER.filter((s) => typeof scores[s] === "number");
  const skills = completed.map((s) => assessSkill(s, scores[s] as number));
  const blockers = skills
    .filter((s) => s.verdict !== "clear")
    .sort((a, b) => b.pointsToSafe - a.pointsToSafe);

  if (completed.length < SKILL_ORDER.length) {
    return {
      verdict: "incomplete",
      effectiveNclc: skills.length ? Math.min(...skills.map((s) => s.nclc)) : 0,
      skills,
      blockers,
      summary: `${completed.length} / 4 épreuves terminées.`,
    };
  }

  const effectiveNclc = Math.min(...skills.map((s) => s.nclc));
  const anyBelow = skills.some((s) => s.verdict === "below");
  const anyBorderline = skills.some((s) => s.verdict === "borderline");

  if (anyBelow) {
    const weakest = blockers[0];
    return {
      verdict: "not-ready",
      effectiveNclc,
      skills,
      blockers,
      summary: `NCLC ${effectiveNclc} effectif. ${SKILL_LABELS[weakest.skill]} est sous le seuil NCLC 7.`,
    };
  }

  if (anyBorderline) {
    return {
      verdict: "borderline",
      effectiveNclc,
      skills,
      blockers,
      summary:
        "Toutes les épreuves atteignent le seuil NCLC 7, mais certaines de justesse. " +
        "Un écart d'un niveau reste possible le jour de l'examen.",
    };
  }

  return {
    verdict: "ready",
    effectiveNclc,
    skills,
    blockers,
    summary:
      "Les quatre épreuves dépassent le seuil NCLC 7 avec une marge de sécurité. " +
      "Profil cohérent avec une réussite à l'examen officiel.",
  };
}

/** Score needed on `skill` to reach a given NCLC level. */
export function scoreNeededForNclc(skill: ExamSkill, targetNclc: number): number | null {
  const band = NCLC_BANDS.find((b) => b.nclc === targetNclc);
  if (!band) return null;
  if (skill === "listening") return band.listeningMin;
  if (skill === "reading") return band.readingMin;
  return band.productionMin;
}
