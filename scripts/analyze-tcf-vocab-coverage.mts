#!/usr/bin/env npx tsx
/**
 * Compare core exam lexique to mock reading/listening corpus.
 * Run: npx tsx scripts/analyze-tcf-vocab-coverage.mts
 */
import fs from "node:fs";
import path from "node:path";
import { extractFrenchLemma } from "../src/lib/tcf-program/flashcard-display";
import { getExamLemmaFlashcards } from "../src/lib/content/tcf-exam-lexique";
import { CORE_VOCAB_TOPICS } from "../src/lib/tcf-program/vocab-core-topics";

const ROOT = path.join(process.cwd(), "src/lib/content");
const FILE_RE = /^tcf-(reading|listening)(-p\d+)?\.ts$/;

function normalizeFr(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

const STOP = new Set(
  [
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "en", "au", "aux", "pour", "par", "avec", "sans", "sur", "dans", "entre",
    "que", "qui", "dont", "où", "quand", "comment", "mais", "ou", "et", "si", "ne", "pas", "plus", "très", "aussi", "bien", "même", "meme",
    "tout", "toute", "tous", "toutes", "cette", "ce", "ces", "leur", "leurs", "votre", "vos", "notre", "nos", "mon", "ma", "mes", "ton", "ta", "tes",
    "son", "sa", "ses", "ils", "elles", "nous", "vous", "je", "tu", "il", "on", "elle", "lui", "eux",
    "est", "sont", "été", "être", "etre", "avoir", "faire", "comme", "quel", "quelle", "quels", "quelles", "parce", "c'est", "n'est", "qu'est-ce",
    "peut", "moins", "plus", "trop", "souvent", "seulement", "uniquement", "avant", "après", "apres", "temps", "heures", "deux", "trois", "quatre",
    "cinq", "six", "sept", "huit", "neuf", "dix", "francais", "français", "langue", "langues", "personnes", "pays", "article", "l'auteur", "auteur",
    "critique", "politique", "services", "familles", "pourquoi", "selon", "d'une", "d'un", "ligne", "cours", "travail",
  ].map(normalizeFr),
);

const coreFr = new Set<string>();
const coreEn = new Set<string>();
for (const card of getExamLemmaFlashcards()) {
  const fr = extractFrenchLemma(card.back);
  if (fr) coreFr.add(normalizeFr(fr));
  coreEn.add(normalizeFr(card.front));
}

function extractStrings(source: string): string[] {
  const out: string[] = [];
  const re = /"(?:[^"\\]|\\.)*"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const s = m[0].slice(1, -1);
    if (s.length >= 8) out.push(s);
  }
  return out;
}

const tokenRe = /[a-zàâäéèêëïîôùûüç'-]{4,}/gi;
const mockTokenFreq = new Map<string, number>();
const mockLemmaHits = new Map<string, number>();

for (const name of fs.readdirSync(ROOT)) {
  if (!FILE_RE.test(name)) continue;
  const text = fs.readFileSync(path.join(ROOT, name), "utf8");
  for (const chunk of extractStrings(text)) {
    for (const raw of chunk.match(tokenRe) ?? []) {
      const t = normalizeFr(raw);
      if (t.length < 4 || STOP.has(t)) continue;
      mockTokenFreq.set(t, (mockTokenFreq.get(t) ?? 0) + 1);
    }
  }
}

function lemmaCoversToken(tok: string): boolean {
  if (coreFr.has(tok) || coreEn.has(tok)) return true;
  for (const lemma of coreFr) {
    if (!lemma.includes(" ")) continue;
    const parts = lemma.split(/\s+/).filter((p) => p.length >= 4);
    if (parts.includes(tok)) return true;
  }
  return false;
}

let coveredTokens = 0;
let totalTokenMass = 0;
for (const [tok, count] of mockTokenFreq) {
  totalTokenMass += count;
  if (lemmaCoversToken(tok)) coveredTokens += count;
}

const missing = [...mockTokenFreq.entries()]
  .filter(([t]) => !lemmaCoversToken(t))
  .sort((a, b) => b[1] - a[1]);

console.log("# TCF mock corpus vs core lexique\n");
console.log(`- Core flashcard lemmas (unique FR): ${coreFr.size}`);
console.log(`- Mock content tokens (4+ chars, no stopwords): ${mockTokenFreq.size}`);
console.log(
  `- Token mass in mocks matched to core lemmas: ${Math.round((coveredTokens / totalTokenMass) * 100)}% (content tokens only; not full B2)`,
);
console.log(`- Unique mock tokens still unmatched: ${missing.length}`);
console.log("\n## Top 40 mock tokens NOT in core list (candidates to author)\n");
for (const [word, count] of missing.slice(0, 40)) {
  console.log(`- ${word} (${count})`);
}

console.log("\n## FEI-aligned themes — core tag counts (cards can have multiple tags)\n");
console.log("(Run app import for live counts; see vocab-core-topics.ts)\n");
for (const t of CORE_VOCAB_TOPICS) {
  console.log(`- ${t.id}: ${t.titleEn}`);
}

console.log("\n## Notes");
console.log("- Mocks alone cannot define B2 (~3k–4k lemmas); they define what THIS app's exams repeat.");
console.log("- Prioritize thematic clusters from FEI skill descriptors (announcements, work, society, environment).");
console.log("- Exclude rare C2/academic lemmas unless they appear in mocks or official samples.\n");
