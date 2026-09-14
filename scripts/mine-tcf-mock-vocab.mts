#!/usr/bin/env npx tsx
/**
 * Rough frequency scan of French tokens in mock reading/listening text
 * not already covered by exam flashcard French lemmas.
 */
import fs from "node:fs";
import path from "node:path";
import { extractFrenchLemma } from "../src/lib/tcf-program/flashcard-display";
import { ALL_TCF_LEXIQUE_FLASHCARDS } from "../src/lib/content/tcf-exam-lexique";

const ROOT = path.join(process.cwd(), "src/lib/content");
const FILE_RE = /^tcf-(reading|listening)(-p\d+)?\.ts$/;

const knownFr = new Set<string>();
for (const card of ALL_TCF_LEXIQUE_FLASHCARDS) {
  const fr = extractFrenchLemma(card.back);
  if (fr) knownFr.add(fr.toLowerCase());
  knownFr.add(card.front.toLowerCase());
}

function extractStrings(source: string): string[] {
  const out: string[] = [];
  const re = /"(?:[^"\\]|\\.)*"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const s = m[0].slice(1, -1);
    if (s.length >= 12 && /[àâäéèêëïîôùûüç]|(\b(le|la|les|des|une|dans|pour|qui|que|pas|est|sont|avec)\b)/i.test(s)) {
      out.push(s);
    }
  }
  return out;
}

const tokenRe = /[a-zàâäéèêëïîôùûüç'-]{4,}/gi;
const freq = new Map<string, number>();

for (const name of fs.readdirSync(ROOT)) {
  if (!FILE_RE.test(name)) continue;
  const text = fs.readFileSync(path.join(ROOT, name), "utf8");
  for (const chunk of extractStrings(text)) {
    for (const raw of chunk.match(tokenRe) ?? []) {
      const t = raw.toLowerCase();
      if (t.length < 4) continue;
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
  }
}

const candidates = [...freq.entries()]
  .filter(([t]) => !knownFr.has(t))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 100);

console.log("# Top French tokens in mocks not in core flashcards (heuristic)\n");
for (const [word, count] of candidates) {
  console.log(`- ${word} (${count})`);
}
