import type { Flashcard } from "@/lib/content/types";
import { extractFrenchLemma } from "@/lib/tcf-program/flashcard-display";
import { getExamLemmaFlashcards, type TcfExamBand } from "@/lib/content/tcf-exam-lexique";

export type VocabQuizScope = "all" | TcfExamBand;

export type VocabMcqQuestion = {
  id: string;
  french: string;
  english: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type VocabQuizResult = {
  total: number;
  correct: number;
  percent: number;
};

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cardToPair(card: Flashcard): { en: string; fr: string; key: string } | null {
  const fr = extractFrenchLemma(card.back);
  if (!fr) return null;
  const en = card.front.trim();
  if (!en) return null;
  return { en, fr, key: card.key };
}

export function collectVocabPairs(scope: VocabQuizScope): { en: string; fr: string; key: string }[] {
  const bands: TcfExamBand[] = scope === "all" ? ["a", "b", "c"] : [scope];
  const seen = new Set<string>();
  const out: { en: string; fr: string; key: string }[] = [];
  for (const band of bands) {
    for (const card of getExamLemmaFlashcards(band)) {
      const pair = cardToPair(card);
      if (!pair) continue;
      const dedupe = pair.en.toLowerCase();
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      out.push(pair);
    }
  }
  return out;
}

/** Build a multiple-choice vocab quiz (French prompt → pick English). */
export function buildVocabQuiz(params: {
  scope: VocabQuizScope;
  count: number;
  seed?: number;
}): VocabMcqQuestion[] {
  const pool = collectVocabPairs(params.scope);
  const rand = mulberry32(params.seed ?? Date.now() >>> 0);
  const take = Math.min(params.count, pool.length);
  if (take === 0) return [];

  const picked = shuffle(pool, rand).slice(0, take);

  return picked.map((p) => {
    const distractorPool = pool.filter((x) => x.en.toLowerCase() !== p.en.toLowerCase());
    const distractors = shuffle(distractorPool, rand)
      .slice(0, 3)
      .map((d) => d.en);
    while (distractors.length < 3) {
      distractors.push(`— (${distractors.length + 1})`);
    }
    const options = shuffle([p.en, distractors[0], distractors[1], distractors[2]], rand) as [
      string,
      string,
      string,
      string,
    ];
    const correctIndex = options.findIndex((o) => o === p.en) as 0 | 1 | 2 | 3;
    return {
      id: p.key,
      french: p.fr,
      english: p.en,
      options,
      correctIndex,
    };
  });
}

export function scoreVocabQuiz(answers: (number | null)[], questions: VocabMcqQuestion[]): VocabQuizResult {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct += 1;
  });
  const total = questions.length;
  return { total, correct, percent: total ? Math.round((correct / total) * 100) : 0 };
}

export function scopeLabel(scope: VocabQuizScope): string {
  if (scope === "all") return "All core words (450)";
  if (scope === "a") return "Band A (easier exam words)";
  if (scope === "b") return "Band B (main exam words)";
  return "Band C (harder exam words)";
}
