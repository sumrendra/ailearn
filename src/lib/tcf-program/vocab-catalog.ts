import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";

/** Words we plan to ship for TCF reading/listening prep (internal content target). */
export const CORE_EXAM_WORD_TARGET = 450;

export function getCoreExamWordCountInApp(): number {
  return EXAM_BAND_META.reduce((sum, b) => sum + b.count, 0);
}

export function getWordsStillToAuthor(): number {
  return Math.max(0, CORE_EXAM_WORD_TARGET - getCoreExamWordCountInApp());
}

export function getOptionalWordCounts() {
  const packWords = TCF_CONTEXT_PACKS.reduce((s, p) => s + p.items.length, 0);
  const themeWords = VOCAB_THEMES.reduce((s, t) => s + t.cardCount, 0);
  return { packWords, themeWords, total: packWords + themeWords };
}

export function getFirstContextPackId(): string {
  return TCF_CONTEXT_PACKS[0]?.id ?? "p6-work-orientation";
}
