#!/usr/bin/env npx tsx
/**
 * Rank mock-corpus tokens for core lexique authoring.
 * Filters noise; attaches a sample mock sentence when found.
 *
 * Run: npx tsx scripts/mine-tcf-vocab-candidates.mts [--min=12] [--limit=120]
 */
import fs from "node:fs";
import path from "node:path";
import { extractFrenchLemma } from "../src/lib/tcf-program/flashcard-display";
import { getExamLemmaFlashcards } from "../src/lib/content/tcf-exam-lexique";

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
    "que", "qui", "dont", "ou", "et", "si", "ne", "pas", "plus", "tres", "très", "aussi", "bien", "meme", "même", "tout", "toute", "tous", "toutes",
    "cette", "ce", "ces", "leur", "leurs", "votre", "vos", "notre", "nos", "mon", "ma", "mes", "ils", "elles", "nous", "vous", "je", "tu", "il", "on", "elle",
    "est", "sont", "ete", "été", "etre", "être", "avoir", "faire", "comme", "peut", "moins", "trop", "souvent", "avant", "apres", "après", "temps", "heures",
    "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "vingt", "trente", "quarante", "cinquante", "soixante",
    "minutes", "jours", "mois", "matin", "soir", "nuit", "annee", "année", "heure", "fois", "chez", "vers", "reste", "encore", "deja", "déjà",
    "personne", "personnes", "certains", "chaque", "ceux", "celles", "quil", "qu'elle", "qu'il", "quelqu", "quelque", "quelques",
    "bonjour", "merci", "monsieur", "madame", "canada", "quebec", "québec", "francais", "français", "texte", "extrait", "article", "auteur",
    "critique", "doit", "peuvent", "fait", "etre", "être", "academique", "académique", "linguistique", "parents", "dollars", "nouveaux",
    "monde", "ville", "culture", "citoyens", "politiques", "sociale", "economique", "économique", "culturelle",
  ].map(normalizeFr),
);

/** Too generic alone — skip unless part of a phrase lemma later */
const SKIP_SINGLE = STOP;

const coreFr = new Set<string>();
const coreEn = new Set<string>();
for (const card of getExamLemmaFlashcards()) {
  const fr = extractFrenchLemma(card.back);
  if (fr) coreFr.add(normalizeFr(fr));
  coreEn.add(normalizeFr(card.front));
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

function extractStrings(source: string): string[] {
  const out: string[] = [];
  const re = /"(?:[^"\\]|\\.)*"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const s = m[0].slice(1, -1);
    if (s.length >= 12) out.push(s);
  }
  return out;
}

const tokenRe = /[a-zàâäéèêëïîôùûüç'-]{4,}/gi;
const mockTokenFreq = new Map<string, number>();
const tokenSample = new Map<string, string>();

for (const name of fs.readdirSync(ROOT)) {
  if (!FILE_RE.test(name)) continue;
  const text = fs.readFileSync(path.join(ROOT, name), "utf8");
  for (const chunk of extractStrings(text)) {
    for (const raw of chunk.match(tokenRe) ?? []) {
      const t = normalizeFr(raw);
      if (t.length < 4 || SKIP_SINGLE.has(t)) continue;
      mockTokenFreq.set(t, (mockTokenFreq.get(t) ?? 0) + 1);
      if (!tokenSample.has(t) && chunk.length <= 220) tokenSample.set(t, chunk);
    }
  }
}

const minFreq = Number(process.argv.find((a) => a.startsWith("--min="))?.split("=")[1] ?? 18);
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 100);

const missing = [...mockTokenFreq.entries()]
  .filter(([t]) => !lemmaCoversToken(t))
  .sort((a, b) => b[1] - a[1]);

console.log(JSON.stringify({ minFreq, limit, candidates: missing.slice(0, limit).map(([tok, freq]) => ({ tok, freq, sample: tokenSample.get(tok) ?? null })) }, null, 2));
