#!/usr/bin/env npx tsx
/**
 * Pre-generate English practice translations for all listening scripts and reading passages (papers 1–10).
 * Requires GEMINI_API_KEY in env or .env.local
 *
 * npm run tcf:gen-practice-translations
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { LISTENING_PAPERS, READING_PAPERS, PAPER_COUNT } from "../src/lib/content/tcf-papers";
import { practiceTranslationKey } from "../src/lib/tcf-program/practice-translation-keys";
import { callGeminiForJson } from "../src/lib/gemini-eval";

config({ path: path.join(process.cwd(), ".env.local") });
config({ path: path.join(process.cwd(), ".env") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is required");
  process.exit(1);
}

type Item = { key: string; french: string; label: string };

function collectItems(): Item[] {
  const items: Item[] = [];
  for (let paper = 1; paper <= PAPER_COUNT; paper++) {
    const listening = LISTENING_PAPERS[paper] ?? [];
    listening.forEach((q, index) => {
      items.push({
        key: practiceTranslationKey("listening", paper, index),
        french: q.audioScript,
        label: `listening paper ${paper} Q${index + 1}`,
      });
    });
    const reading = READING_PAPERS[paper] ?? [];
    reading.forEach((q, index) => {
      items.push({
        key: practiceTranslationKey("reading", paper, index),
        french: q.passage,
        label: `reading paper ${paper} Q${index + 1}`,
      });
    });
  }
  return items;
}

async function translateBatch(batch: Item[], key: string): Promise<Record<string, string>> {
  const payload = batch.map((b, i) => ({ id: i, text: b.french }));
  const prompt = `You translate TCF Canada exam practice texts from French to English.

Return a JSON object ONLY (no markdown) shaped like:
{"0":"English for item 0","1":"..."}

Rules:
- Preserve line breaks inside each string (use \\n)
- Clear, natural English for learners
- One translation per id

Items:
${JSON.stringify(payload, null, 0)}`;

  const { text } = await callGeminiForJson(key, {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.15, maxOutputTokens: 8192, responseMimeType: "application/json" },
  });

  const parsed = JSON.parse(text) as Record<string, string>;
  const out: Record<string, string> = {};
  batch.forEach((item, i) => {
    const en = parsed[String(i)] ?? parsed[i as unknown as string];
    if (typeof en === "string" && en.trim()) {
      out[item.key] = en.replace(/\\n/g, "\n").trim();
    }
  });
  return out;
}

async function main() {
  const items = collectItems();
  console.log(`Translating ${items.length} items in batches of 8…`);
  const map: Record<string, string> = {};
  const BATCH = 8;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    console.log(`  ${i + 1}-${Math.min(i + BATCH, items.length)} / ${items.length}`);
    const part = await translateBatch(batch, apiKey);
    Object.assign(map, part);
    await new Promise((r) => setTimeout(r, 400));
  }

  const missing = items.filter((it) => !map[it.key]);
  if (missing.length) {
    console.warn(`Warning: ${missing.length} items missing translation`);
  }

  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, en]) => {
      const esc = en.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
      return `  "${key}": "${esc}",`;
    });

  const out = `/**
 * English practice aids — auto-generated. Do not edit by hand.
 * Regenerate: npm run tcf:gen-practice-translations
 */
export const TCF_PRACTICE_TRANSLATIONS_EN: Record<string, string> = {
${lines.join("\n")}
};
`;

  const target = path.join(process.cwd(), "src/lib/content/tcf-practice-translations.generated.ts");
  fs.writeFileSync(target, out, "utf8");
  console.log(`Wrote ${Object.keys(map).length} entries → ${target}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
