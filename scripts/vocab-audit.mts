#!/usr/bin/env npx tsx
/** Audit core lexique: counts, duplicate EN headwords, IRCC jargon scan. */
import { getExamLemmaFlashcards } from "../src/lib/content/tcf-exam-lexique";

const BANNED = /express entry|\bcrs\b|\bircc\b|\bnclc\b|\bpnp\b|proof of funds|provincial nominee/i;

const cards = getExamLemmaFlashcards();
const byEn = new Map<string, number>();
const hits: string[] = [];

for (const c of cards) {
  const k = c.front.toLowerCase();
  byEn.set(k, (byEn.get(k) ?? 0) + 1);
  if (BANNED.test(c.front) || BANNED.test(c.back)) hits.push(c.key);
}

const dupes = [...byEn.entries()].filter(([, n]) => n > 1);

console.log(`Core cards: ${cards.length}`);
console.log(`Duplicate EN headwords: ${dupes.length}`);
if (dupes.length) {
  for (const [k, n] of dupes.slice(0, 20)) console.log(`  - ${k} (${n})`);
}
console.log(`Banned-pattern hits: ${hits.length}`);
for (const k of hits) console.log(`  - ${k}`);
