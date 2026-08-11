/**
 * Emit TypeScript content files from a TCF paper manifest.
 *
 *   npx tsx scripts/tcf/emit-typescript.mts --paper=6
 */

import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { validateManifest, type TcfPaperManifest } from "./validate-manifest";

const { values } = parseArgs({
  options: { paper: { type: "string" } },
});

const paper = parseInt(values.paper ?? "", 10);
if (!Number.isFinite(paper) || paper < 1) {
  console.error("Usage: --paper=N");
  process.exit(1);
}

const manifestPath = path.join(
  process.cwd(),
  "content/tcf/manifests",
  `paper-${String(paper).padStart(2, "0")}.json`,
);
const raw = await fs.readFile(manifestPath, "utf8");
const manifest = JSON.parse(raw) as TcfPaperManifest;

const errors = validateManifest(manifest);
if (errors.length) {
  console.error("Invalid manifest:", errors.join("; "));
  process.exit(1);
}

function lit(value: unknown, indent = 2): string {
  const pad = " ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const isTuple4 = value.length === 4 && value.every((v) => typeof v === "string");
    if (isTuple4) {
      return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    }
    const items = value.map((v) => `${pad}  ${lit(v, indent + 2)},`).join("\n");
    return `[\n${items}\n${pad}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const lines = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : JSON.stringify(k);
      return `${pad}  ${key}: ${lit(v, indent + 2)},`;
    });
    return `{\n${lines.join("\n")}\n${pad}}`;
  }
  return JSON.stringify(value);
}

function exportName(module: string, paperNum: number): string {
  return paperNum === 1
    ? `TCF_${module.toUpperCase()}`
    : `TCF_${module.toUpperCase()}_P${paperNum}`;
}

function fileName(module: string, paperNum: number): string {
  return paperNum === 1
    ? `tcf-${module}.ts`
    : `tcf-${module}-p${paperNum}.ts`;
}

async function writeModule(
  module: "listening" | "reading" | "writing" | "speaking",
  paperNum: number,
  items: unknown[],
  typeImport?: string,
) {
  const contentDir = path.join(process.cwd(), "src/lib/content");
  const outFile = path.join(contentDir, fileName(module, paperNum));
  const constName = exportName(module, paperNum);

  let header = "";
  if (paperNum === 1) {
    if (module === "listening") {
      header = `export type TCFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";\n\nexport interface TCFListeningQuestion {\n  id: number;\n  level: TCFLevel;\n  topic: string;\n  audioScript: string;\n  question: string;\n  options: [string, string, string, string];\n  correctIndex: 0 | 1 | 2 | 3;\n  explanation: string;\n}\n\n`;
    } else if (module === "reading") {
      header = `import type { TCFLevel } from "./tcf-listening";\n\nexport interface TCFReadingQuestion {\n  id: number;\n  level: TCFLevel;\n  passageType: string;\n  passage: string;\n  question: string;\n  options: [string, string, string, string];\n  correctIndex: 0 | 1 | 2 | 3;\n  explanation: string;\n}\n\n`;
    } else if (module === "writing") {
      header = `export interface WritingDocument {\n  label: string;\n  author: string;\n  text: string;\n}\n\nexport interface WritingTask {\n  type: 1 | 2 | 3;\n  register: string;\n  minWords: number;\n  maxWords: number;\n  timeMin: number;\n  context: string;\n  prompt: string;\n  /** Task 3 only: the two viewpoints to compare. */\n  documents?: [WritingDocument, WritingDocument];\n  /** Task 3 only: official split of the total word count. */\n  partWords?: {\n    comparison: { min: number; max: number };\n    position: { min: number; max: number };\n  };\n}\n\nexport const TASK3_PART_WORDS = {\n  comparison: { min: 40, max: 60 },\n  position: { min: 80, max: 120 },\n} as const;\n\n`;
    } else {
      header = `export interface SpeakingTask {\n  type: 1 | 2 | 3;\n  label: string;\n  prepSeconds: number;\n  recordSeconds: number;\n  context: string;\n  prompt: string;\n  tips: string[];\n}\n\n`;
    }
  } else if (typeImport) {
    header = `import type { ${typeImport} } from "./tcf-${module}";\n\n`;
  }

  const typeAnnot = paperNum === 1
    ? module === "listening"
      ? ": TCFListeningQuestion[]"
      : module === "reading"
        ? ": TCFReadingQuestion[]"
        : module === "writing"
          ? ": WritingTask[]"
          : ": SpeakingTask[]"
    : typeImport
      ? `: ${typeImport}[]`
      : "";

  const body = `${header}export const ${constName}${typeAnnot} = ${lit(items, 0)};\n`;
  await fs.writeFile(outFile, body, "utf8");
  console.log(`Wrote ${outFile}`);
}

await writeModule("listening", paper, manifest.listening, "TCFListeningQuestion");
await writeModule("reading", paper, manifest.reading, "TCFReadingQuestion");
await writeModule("writing", paper, manifest.writing, "WritingTask");
await writeModule("speaking", paper, manifest.speaking, "SpeakingTask");
