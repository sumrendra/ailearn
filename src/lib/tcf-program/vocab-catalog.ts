import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";

/** Exam-priority lexique in-app (high-yield TCF themes — not full B2 lexicon). */
export const CORE_EXAM_WORD_TARGET = 1000;

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

export type VocabContentStatus = {
  coreInApp: number;
  coreTarget: number;
  stillToAuthor: number;
  optional: { packWords: number; themeWords: number; total: number };
  bands: { id: "a" | "b" | "c"; label: string; inApp: number; targetShare: number; gap: number }[];
};

export function getVocabContentStatus(): VocabContentStatus {
  const coreInApp = getCoreExamWordCountInApp();
  const coreTarget = CORE_EXAM_WORD_TARGET;
  const optional = getOptionalWordCounts();
  const bands = EXAM_BAND_META.map((b) => {
    const targetShare =
      coreInApp > 0 ? Math.round((coreTarget * b.count) / coreInApp) : Math.round(coreTarget / 3);
    return {
      id: b.id,
      label: b.title,
      inApp: b.count,
      targetShare,
      gap: Math.max(0, targetShare - b.count),
    };
  });
  return {
    coreInApp,
    coreTarget,
    stillToAuthor: getWordsStillToAuthor(),
    optional,
    bands,
  };
}
