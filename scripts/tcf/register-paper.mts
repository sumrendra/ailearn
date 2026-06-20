/**
 * Register a new paper in src/lib/content/tcf-papers.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: { paper: { type: "string" } },
});

const paper = parseInt(values.paper ?? "", 10);
if (!Number.isFinite(paper) || paper < 1) {
  console.error("Usage: --paper=N");
  process.exit(1);
}

const papersPath = path.join(process.cwd(), "src/lib/content/tcf-papers.ts");
let src = await fs.readFile(papersPath, "utf8");

type Mod = "LISTENING" | "READING" | "WRITING" | "SPEAKING";
const mods: Mod[] = ["LISTENING", "READING", "WRITING", "SPEAKING"];

for (const mod of mods) {
  const lower = mod.toLowerCase();
  const constName = paper === 1 ? `TCF_${mod}` : `TCF_${mod}_P${paper}`;
  const file = paper === 1 ? `./tcf-${lower}` : `./tcf-${lower}-p${paper}`;
  const importLine = `import { ${constName} } from "${file}";`;

  if (!src.includes(importLine)) {
    const insertAfter = src.indexOf('export type {');
    src = src.slice(0, insertAfter) + importLine + "\n" + src.slice(insertAfter);
  }

  const mapName = `${mod}_PAPERS`;
  const entry = `  ${paper}: ${constName},`;
  const mapRe = new RegExp(`(export const ${mapName}: Record<number, [^>]+> = \\{)([\\s\\S]*?)(\\n\\};)`);
  const m = src.match(mapRe);
  if (m && !m[2].includes(`${paper}: ${constName}`)) {
    src = src.replace(mapRe, `$1$2\n${entry}$3`);
  }
}

const countMatch = src.match(/export const PAPER_COUNT = (\d+);/);
const current = countMatch ? parseInt(countMatch[1], 10) : 1;
const next = Math.max(paper, current);
if (next !== current) {
  src = src.replace(/export const PAPER_COUNT = \d+;/, `export const PAPER_COUNT = ${next};`);
}

await fs.writeFile(papersPath, src, "utf8");
console.log(`Updated tcf-papers.ts (PAPER_COUNT=${next})`);
