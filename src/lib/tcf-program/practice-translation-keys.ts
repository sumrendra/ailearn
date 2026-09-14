/** Stable key for practice translations (paper + index within that paper). */
export function practiceTranslationKey(
  skill: "listening" | "reading",
  sourcePaper: number,
  sourceQuestionIndex: number,
): string {
  return `${skill}:${sourcePaper}:${sourceQuestionIndex}`;
}
