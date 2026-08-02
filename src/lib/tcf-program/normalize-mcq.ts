/**
 * Rebalance TCF MCQ options to match official FEI sample patterns:
 * - Correct answers distributed across A/B/C/D (~25% each)
 * - Similar option lengths (official samples: ~28% uniquely longest correct;
 *   hard items use parallel sentences within ~5–15 chars of each other)
 */

export type McqOptionTuple = [string, string, string, string];
export type McqCorrectIndex = 0 | 1 | 2 | 3;

export interface NormalizableMcq {
  id: number;
  options: McqOptionTuple;
  correctIndex: McqCorrectIndex;
}

/** Official FEI sample targets (14 documented items with answer keys). */
export const OFFICIAL_MCQ_BIAS_TARGETS = {
  longestCorrectMax: 0.4,
  uniqueLongestCorrectMax: 0.32,
  indexSpreadMin: 0.2,
} as const;

export function targetCorrectIndex(id: number): McqCorrectIndex {
  return ((id - 1) % 4) as McqCorrectIndex;
}

export function permuteOptionsToIndex(
  options: McqOptionTuple,
  correctIndex: McqCorrectIndex,
  targetIndex: McqCorrectIndex,
): { options: McqOptionTuple; correctIndex: McqCorrectIndex } {
  if (correctIndex === targetIndex) {
    return { options, correctIndex };
  }
  const correctText = options[correctIndex];
  const wrong = options.filter((_, i) => i !== correctIndex);
  const next: string[] = new Array(4);
  next[targetIndex] = correctText;
  let wi = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== targetIndex) next[i] = wrong[wi++]!;
  }
  return {
    options: next as McqOptionTuple,
    correctIndex: targetIndex,
  };
}

function shortenCorrectOption(text: string): string {
  let t = text.trim();

  const tailPatterns = [
    / en montrant .+$/i,
    / tout en .+$/i,
    / ce qui .+$/i,
    /, not .+$/i,
    / non une .+$/i,
    / non pas .+$/i,
    / plutôt que .+$/i,
    / afin de .+$/i,
    / pour que .+$/i,
  ];
  for (const pattern of tailPatterns) {
    if (pattern.test(t)) {
      const shorter = t.replace(pattern, "").trim();
      if (shorter.length >= 16) {
        t = shorter.endsWith(".") ? shorter : `${shorter}.`;
        break;
      }
    }
  }

  if (t.length > 68 && t.includes(",")) {
    const first = t.split(",")[0].trim();
    if (first.length >= 18) {
      t = first.endsWith(".") ? first : `${first}.`;
    }
  }

  if (t.length > 55) {
    const quiCut = t.replace(/ qui .+$/i, "").trim();
    if (quiCut.length >= 18 && quiCut.length < t.length) {
      t = quiCut.endsWith(".") ? quiCut : `${quiCut}.`;
    }
  }

  if (t.length > 55) {
    const etCut = t.replace(/ et (de |des |du |d'|le |la |les |l').+$/i, "").trim();
    if (etCut.length >= 18 && etCut.length < t.length) {
      t = etCut.endsWith(".") ? etCut : `${etCut}.`;
    }
  }

  return t;
}

function trimToMaxLength(text: string, maxLen: number): string {
  let t = text.trim();
  if (t.length <= maxLen) return t;

  const badTail = /\b(des|de|du|la|le|les|un|une|en|à|et|ou|qui|que|dont|par|pour|avec|sans)\.$/i;

  while (t.length > maxLen && t.includes(" ")) {
    t = t.replace(/\s+\S+$/, "").trim();
  }
  while (badTail.test(t) && t.includes(" ")) {
    t = t.replace(/\s+\S+$/, "").trim();
  }

  if (!t.endsWith(".")) t += ".";
  return t;
}

function detectSharedPrefix(opts: string[]): string {
  const prefixes = ["De ", "Que ", "Pour ", "Il ", "Elle ", "La ", "Le ", "Un ", "Une ", "Les ", "Des ", "En ", "À "];
  for (const p of prefixes) {
    if (opts.every((o) => o.startsWith(p))) return p;
  }
  return "";
}

function insertQualifier(text: string, qualifier: string): string {
  const trimmed = text.trim();
  const m = trimmed.match(/^(\S+\s+\S+)(.*)$/);
  if (m) {
    const middle = m[2].trimStart();
    return `${m[1]} ${qualifier}${middle ? ` ${middle}` : ""}`;
  }
  return trimmed;
}

function expandDistractor(text: string, targetLen: number, peers: string[], sharedPrefix: string): string {
  let t = text.trim();
  if (!t.endsWith(".")) t += ".";

  const qualifiers = ["souvent", "généralement", "notamment", "parfois", "régulièrement"];
  for (const q of qualifiers) {
    if (t.length >= targetLen) break;
    if (!t.toLowerCase().includes(q)) {
      t = insertQualifier(t, q);
      if (!t.endsWith(".")) t += ".";
    }
  }

  const contextualTails = sharedPrefix.startsWith("De ")
    ? [
        " pendant plusieurs semaines.",
        " avec leurs proches.",
        " dans la région.",
        " sans frais supplémentaires.",
      ]
    : sharedPrefix.startsWith("Que ")
      ? [
          " dans ce contexte précis.",
          " selon cette interprétation.",
          " dans la majorité des cas.",
          " sans autre précision.",
        ]
      : sharedPrefix.startsWith("Il ") || sharedPrefix.startsWith("Elle ")
        ? [
            " dans ce domaine.",
            " sur une longue période.",
            " de façon permanente.",
            " dans plusieurs situations.",
          ]
        : [
            " dans ce contexte.",
            " sur une longue période.",
            " de manière habituelle.",
            " dans la plupart des cas.",
          ];

  for (const tail of contextualTails) {
    if (t.length >= targetLen) break;
    if (!t.includes(tail.trim())) t += tail;
  }

  // Mirror clause rhythm from longest peer (structure only, not content)
  const longestPeer = peers.reduce((a, b) => (a.length > b.length ? a : b), t);
  if (t.length < targetLen - 6 && longestPeer.includes(",") && !t.includes(",")) {
    const peerTail = longestPeer.split(",").slice(1).join(",").trim();
    if (peerTail.length >= 8 && peerTail.length <= 35) {
      const synthetic = peerTail.replace(/^[a-zà-ÿ]/, (c) => c.toUpperCase());
      if (!t.includes(synthetic.slice(0, 12))) {
        t = `${t.replace(/\.$/, "")}, ${synthetic.charAt(0).toLowerCase()}${synthetic.slice(1)}`;
        if (!t.endsWith(".")) t += ".";
      }
    }
  }

  return t;
}

function isBrokenOption(text: string): boolean {
  const t = text.trim();
  if (t.length < 8) return true;
  if (/\b(des|de|du|la|le|les|un|une|en|à|et|ou|qui|que|d')\.$/i.test(t)) return true;
  return false;
}

export function balanceOptionLengths(
  options: McqOptionTuple,
  correctIndex: McqCorrectIndex,
): McqOptionTuple {
  const original = [...options] as McqOptionTuple;
  const opts = [...options] as McqOptionTuple;
  const lens = () => opts.map((o) => o.length);
  const allShort = opts.every((o) => o.length <= 34);

  const sharedPrefix = detectSharedPrefix(opts);
  const median = Math.round(lens().reduce((a, b) => a + b, 0) / 4);
  const maxWrong = Math.max(...lens().filter((_, i) => i !== correctIndex));

  // Shorten correct when it dominates (main bias in generated bank)
  let correct = shortenCorrectOption(opts[correctIndex]);
  const targetCorrectMax = allShort
    ? maxWrong + 4
    : Math.min(maxWrong + 6, median + 5);

  if (correct.length > targetCorrectMax) {
    correct = trimToMaxLength(correct, targetCorrectMax);
  }
  if (!isBrokenOption(correct)) {
    opts[correctIndex] = correct;
  }

  // Lengthen short distractors toward official parallel length
  if (!allShort) {
    const targetWrong = Math.round((opts[correctIndex].length + maxWrong) / 2);
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) continue;
      if (opts[i].length < targetWrong - 10) {
        const expanded = expandDistractor(
          opts[i],
          targetWrong - 2 + (i % 2),
          opts.filter((_, j) => j !== i),
          sharedPrefix,
        );
        if (!isBrokenOption(expanded)) opts[i] = expanded;
      }
    }
  }

  // Final pass: if correct still uniquely longest by >8, shorten again
  const currentLens = lens();
  const maxLen = Math.max(...currentLens);
  const correctLen = currentLens[correctIndex];
  const othersAtMax = currentLens.filter((l, i) => i !== correctIndex && l === maxLen).length;
  if (correctLen === maxLen && othersAtMax === 0 && correctLen > maxWrong + 6) {
    const tighter = trimToMaxLength(opts[correctIndex], maxWrong + 4);
    if (!isBrokenOption(tighter)) opts[correctIndex] = tighter;
  }

  // Safety: revert any broken option
  for (let i = 0; i < 4; i++) {
    if (isBrokenOption(opts[i])) opts[i] = original[i];
  }

  return opts;
}

export function normalizeMcqQuestion<T extends NormalizableMcq>(question: T): T {
  const target = targetCorrectIndex(question.id);
  const permuted = permuteOptionsToIndex(question.options, question.correctIndex, target);
  const balanced = balanceOptionLengths(permuted.options, permuted.correctIndex);
  return {
    ...question,
    options: balanced,
    correctIndex: permuted.correctIndex,
  };
}

export function normalizeMcqPaper<T extends NormalizableMcq>(questions: T[]): T[] {
  return questions.map(normalizeMcqQuestion);
}

export function analyzeMcqBias<T extends NormalizableMcq>(questions: T[]) {
  let longest = 0;
  let uniqueLongest = 0;
  const indexCounts = [0, 0, 0, 0];

  for (const q of questions) {
    const lens = q.options.map((o) => o.length);
    const max = Math.max(...lens);
    indexCounts[q.correctIndex]++;
    if (lens[q.correctIndex] === max) longest++;
    if (lens[q.correctIndex] === max && lens.filter((l) => l === max).length === 1) uniqueLongest++;
  }

  const n = questions.length;
  return {
    n,
    longestCorrectPct: longest / n,
    uniqueLongestCorrectPct: uniqueLongest / n,
    indexPct: indexCounts.map((c) => c / n),
  };
}
