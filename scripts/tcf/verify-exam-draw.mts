/**
 * Check that randomized exam sittings stay exam-valid.
 * Run: npm run tcf:verify-draw
 */
import {
  compositionFor,
  drawExamSection,
  fixedExamSection,
  newExamSeed,
  sourcePapersOf,
} from "../../src/lib/tcf-program/exam-draw";
import { bandsFor, type ComprehensionSkill } from "../../src/lib/tcf-program/scoring";
import type { TCFLevel } from "../../src/lib/content/tcf-listening";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

const LEVEL_RANK: Record<TCFLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };

for (const skill of ["listening", "reading"] as ComprehensionSkill[]) {
  console.log(`\n${skill.toUpperCase()}`);

  const expected = compositionFor(skill).reduce((sum, s) => sum + s.count, 0);
  check("composition totals 39 slots", expected === 39, String(expected));

  const bandTotal = bandsFor(skill).reduce((sum, b) => sum + (b.to - b.from + 1), 0);
  check("scoring bands cover 39 questions", bandTotal === 39, String(bandTotal));

  const seeds = Array.from({ length: 200 }, () => newExamSeed());
  let sizeOk = true;
  let uniqueOk = true;
  let orderOk = true;
  let idsOk = true;
  let maxOverlap = 0;

  const reference = drawExamSection(skill, seeds[0]);
  const signature = (items: { sourcePaper: number; sourceQuestionIndex: number }[]) =>
    items.map((i) => `${i.sourcePaper}:${i.sourceQuestionIndex}`);

  for (const seed of seeds) {
    const items = drawExamSection(skill, seed);
    if (items.length !== 39) sizeOk = false;
    if (new Set(signature(items)).size !== 39) uniqueOk = false;
    if (!items.every((it, i) => it.id === i + 1)) idsOk = false;
    for (let i = 1; i < items.length; i++) {
      if (LEVEL_RANK[items[i].level] < LEVEL_RANK[items[i - 1].level]) orderOk = false;
    }
    if (seed !== seeds[0]) {
      const refSig = signature(reference);
      const overlap = signature(items).filter((s, i) => s === refSig[i]).length;
      maxOverlap = Math.max(maxOverlap, overlap);
    }
  }

  check("every sitting has 39 items", sizeOk);
  check("no repeated item within a sitting", uniqueOk);
  check("items renumbered 1..39", idsOk);
  check("difficulty never decreases", orderOk);
  check("distinct seeds barely overlap", maxOverlap <= 8, `worst overlap ${maxOverlap}/39`);

  const a = signature(drawExamSection(skill, 4242));
  const b = signature(drawExamSection(skill, 4242));
  check("same seed rebuilds the same exam", JSON.stringify(a) === JSON.stringify(b));

  const drawn = drawExamSection(skill, 777);
  check("draws across the whole bank", sourcePapersOf(drawn).length >= 3, sourcePapersOf(drawn).join(","));

  const fixed = fixedExamSection(skill, 2);
  check("practice mode keeps its paper", fixed.every((i) => i.sourcePaper === 2));
  check(
    "practice mode keeps original order",
    fixed.every((i, idx) => i.sourceQuestionIndex === idx),
  );
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nAll exam draw checks passed.");
}
