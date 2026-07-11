import { TRACK_A_PART1 } from "@/lib/content/tcf-curriculum/track-a-part1";
import { TRACK_A_PART2 } from "@/lib/content/tcf-curriculum/track-a-part2";
import { TRACK_B } from "@/lib/content/tcf-curriculum/track-b";
import { TRACK_C } from "@/lib/content/tcf-curriculum/track-c";
import { TRACK_D } from "@/lib/content/tcf-curriculum/track-d";
import type { TcfUnit, TcfTrackId } from "@/lib/tcf-program/types";

export const ALL_TCF_UNITS: TcfUnit[] = [
  ...TRACK_A_PART1,
  ...TRACK_A_PART2,
  ...TRACK_B,
  ...TRACK_C,
  ...TRACK_D,
];

export function getAllTcfUnits(): TcfUnit[] {
  return ALL_TCF_UNITS;
}

export function getTcfUnitBySlug(slug: string): TcfUnit | undefined {
  return ALL_TCF_UNITS.find((u) => u.slug === slug);
}

export function getTcfUnitsForTrack(trackId: TcfTrackId): TcfUnit[] {
  return ALL_TCF_UNITS.filter((u) => u.trackId === trackId).sort((a, b) => a.order - b.order);
}

export function getNextTcfUnit(afterSlug?: string): TcfUnit | undefined {
  if (!afterSlug) return ALL_TCF_UNITS[0];
  const idx = ALL_TCF_UNITS.findIndex((u) => u.slug === afterSlug);
  if (idx < 0 || idx >= ALL_TCF_UNITS.length - 1) return undefined;
  return ALL_TCF_UNITS[idx + 1];
}

export function getTcfProgramStats() {
  const byTrack = (id: TcfTrackId) => ALL_TCF_UNITS.filter((u) => u.trackId === id).length;
  return {
    totalUnits: ALL_TCF_UNITS.length,
    totalHours: Math.round(ALL_TCF_UNITS.reduce((s, u) => s + u.estimatedMins, 0) / 60),
    foundation: byTrack("foundation"),
    bridge: byTrack("bridge"),
    b2: byTrack("b2"),
    exam: byTrack("exam"),
  };
}
