/**
 * IRCC-aligned NCLC thresholds for TCF Canada (2026 tables).
 * Listening/Reading: 0–699. Writing/Speaking: 0–20.
 */

export interface NclcBand {
  nclc: number;
  cefr: string;
  listeningMin: number;
  readingMin: number;
  productionMin: number; // writing & speaking share scale
}

export const NCLC_BANDS: NclcBand[] = [
  { nclc: 4, cefr: "A2", listeningMin: 331, readingMin: 342, productionMin: 4 },
  { nclc: 5, cefr: "A2+", listeningMin: 369, readingMin: 375, productionMin: 6 },
  { nclc: 6, cefr: "B1", listeningMin: 398, readingMin: 406, productionMin: 8 },
  { nclc: 7, cefr: "B2", listeningMin: 458, readingMin: 453, productionMin: 10 },
  { nclc: 8, cefr: "B2+", listeningMin: 503, readingMin: 499, productionMin: 12 },
  { nclc: 9, cefr: "C1", listeningMin: 523, readingMin: 524, productionMin: 14 },
  { nclc: 10, cefr: "C1+", listeningMin: 549, readingMin: 549, productionMin: 16 },
];

export const NCLC7_TARGETS = {
  listening: { min: 458, max: 502 },
  reading: { min: 453, max: 498 },
  writing: { min: 10, max: 11 },
  speaking: { min: 10, max: 11 },
} as const;

export function estimateNclcFromMcq(correct: number, total = 39): { score699: number; nclc: number } {
  const score699 = Math.round(100 + (correct / total) * 599);
  const nclc = scoreToNclcListening(score699);
  return { score699, nclc };
}

export function scoreToNclcListening(score699: number): number {
  for (let i = NCLC_BANDS.length - 1; i >= 0; i--) {
    if (score699 >= NCLC_BANDS[i].listeningMin) return NCLC_BANDS[i].nclc;
  }
  return 4;
}

export function scoreToNclcReading(score699: number): number {
  for (let i = NCLC_BANDS.length - 1; i >= 0; i--) {
    if (score699 >= NCLC_BANDS[i].readingMin) return NCLC_BANDS[i].nclc;
  }
  return 4;
}

export function scoreToNclcProduction(score20: number): number {
  for (let i = NCLC_BANDS.length - 1; i >= 0; i--) {
    if (score20 >= NCLC_BANDS[i].productionMin) return NCLC_BANDS[i].nclc;
  }
  return 4;
}

export function weakestNclc(skills: { listening: number; reading: number; writing: number; speaking: number }): {
  skill: keyof typeof skills;
  nclc: number;
} {
  const entries = Object.entries(skills) as [keyof typeof skills, number][];
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  return { skill: sorted[0][0], nclc: sorted[0][1] };
}
