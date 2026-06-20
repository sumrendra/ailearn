/**
 * Call Gemini to generate a full TCF paper manifest JSON.
 *
 *   npx tsx scripts/tcf/generate-content.mts --paper=6 --theme="..."
 */

import { config } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { validateManifest, type TcfPaperManifest } from "./validate-manifest";

config({ path: ".env.local" });
config({ path: ".env" });

const { values } = parseArgs({
  options: {
    paper: { type: "string" },
    theme: { type: "string" },
  },
});

const paper = parseInt(values.paper ?? "", 10);
const theme = values.theme?.trim();

if (!Number.isFinite(paper) || paper < 1) {
  console.error("Usage: --paper=N --theme=\"...\"");
  process.exit(1);
}
if (!theme) {
  console.error("--theme is required");
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}

const promptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "prompts/generate-paper.md");
const systemPrompt = await fs.readFile(promptPath, "utf8");

const userPrompt = `${systemPrompt}

Generate paper ${paper} with theme: "${theme}".
Return only the JSON object.`;

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    }),
  },
);

if (!res.ok) {
  console.error("Gemini error:", await res.text());
  process.exit(1);
}

const data = await res.json() as {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};
const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) {
  console.error("No JSON in Gemini response");
  process.exit(1);
}

let manifest: TcfPaperManifest;
try {
  manifest = JSON.parse(text) as TcfPaperManifest;
  manifest.paper = paper;
  manifest.theme = theme;
} catch {
  console.error("Failed to parse JSON from model");
  process.exit(1);
}

const errors = validateManifest(manifest);
if (errors.length) {
  console.error("Validation errors:");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const outDir = path.join(process.cwd(), "content/tcf/manifests");
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `paper-${String(paper).padStart(2, "0")}.json`);
await fs.writeFile(outPath, JSON.stringify(manifest, null, 2), "utf8");
console.log(`Wrote ${outPath}`);
