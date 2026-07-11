export * from "./types";
export { TCF_TRACKS } from "./types";
export * from "./nclc";
export * from "./grammar-topics";
export * from "./vocab-themes";

import { getLessonBySlug } from "@/lib/content";
import {
  getAllTcfUnits,
  getTcfUnitBySlug,
  getTcfUnitsForTrack,
  getNextTcfUnit,
  getTcfProgramStats,
} from "@/lib/content/tcf-curriculum/index";

export {
  getAllTcfUnits,
  getTcfUnitBySlug,
  getTcfUnitsForTrack,
  getNextTcfUnit,
  getTcfProgramStats,
};

export type { TcfUnit } from "./types";

/** Unified learnable for progress API — PATH lessons + TCF units */
export function getLearnableBySlug(slug: string): {
  slug: string;
  title: string;
  xpReward: number;
  kind: "lesson" | "tcf-unit";
} | undefined {
  const lesson = getLessonBySlug(slug);
  if (lesson) {
    return { slug: lesson.slug, title: lesson.title, xpReward: lesson.xpReward, kind: "lesson" };
  }
  const unit = getTcfUnitBySlug(slug);
  if (unit) {
    return { slug: unit.slug, title: unit.title, xpReward: unit.xpReward, kind: "tcf-unit" };
  }
  return undefined;
}
