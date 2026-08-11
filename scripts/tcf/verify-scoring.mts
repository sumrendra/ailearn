/**
 * Sanity-check the TCF comprehension scoring model and readiness verdicts.
 * Run: npm run tcf:verify-scoring
 */
import {
  maxScoreFor,
  scoreComprehension,
  type ComprehensionSkill,
} from "../../src/lib/tcf-program/scoring";
import { evaluateExamReadiness } from "../../src/lib/tcf-program/readiness";
import { scoreToNclcListening, scoreToNclcReading } from "../../src/lib/tcf-program/nclc";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

/** Answer sheet where a chosen set of 1-based question numbers is correct. */
function sheet(correctQuestions: Set<number>, total = 39) {
  const correctIndices = Array(total).fill(0);
  const answers = correctIndices.map((_, i) => (correctQuestions.has(i + 1) ? 0 : 1));
  return { answers, correctIndices };
}

function frontLoaded(n: number) {
  return sheet(new Set(Array.from({ length: n }, (_, i) => i + 1)));
}

function backLoaded(n: number) {
  return sheet(new Set(Array.from({ length: n }, (_, i) => 39 - i)));
}

function score(skill: ComprehensionSkill, s: { answers: (number | null)[]; correctIndices: number[] }) {
  return scoreComprehension(skill, s.answers, s.correctIndices).score699;
}

console.log("Scale integrity");
check("listening max = 699", maxScoreFor("listening") === 699, String(maxScoreFor("listening")));
check("reading max = 699", maxScoreFor("reading") === 699, String(maxScoreFor("reading")));
check("all correct = 699", score("listening", frontLoaded(39)) === 699);
check("none correct = 0", score("listening", frontLoaded(0)) === 0);

console.log("\nDifficulty weighting (same raw count, different questions)");
for (const n of [20, 26, 30]) {
  const front = score("listening", frontLoaded(n));
  const back = score("listening", backLoaded(n));
  check(
    `${n}/39 easy-only scores below ${n}/39 hard-only`,
    front < back,
    `easy=${front} hard=${back}`,
  );
}

console.log("\nNCLC 7 boundary (listening floor 458 / reading floor 453)");
for (let n = 1; n <= 39; n++) {
  const s = score("listening", frontLoaded(n));
  if (scoreToNclcListening(s) >= 7) {
    console.log(`  listening: NCLC 7 reached at ${n}/39 front-loaded (${s}/699)`);
    check("listening NCLC 7 needs a demanding raw count", n >= 28, `${n}/39`);
    break;
  }
}
for (let n = 1; n <= 39; n++) {
  const s = score("reading", frontLoaded(n));
  if (scoreToNclcReading(s) >= 7) {
    console.log(`  reading:   NCLC 7 reached at ${n}/39 front-loaded (${s}/699)`);
    check("reading NCLC 7 needs a demanding raw count", n >= 28, `${n}/39`);
    break;
  }
}

console.log("\nReadiness verdicts");
const ready = evaluateExamReadiness({ listening: 500, reading: 495, writing: 13, speaking: 12 });
check("comfortable profile is ready", ready.verdict === "ready", ready.verdict);

const borderline = evaluateExamReadiness({ listening: 460, reading: 455, writing: 10, speaking: 10 });
check("just-at-floor profile is borderline", borderline.verdict === "borderline", borderline.verdict);

const notReady = evaluateExamReadiness({ listening: 520, reading: 510, writing: 14, speaking: 8 });
check("one weak skill blocks the verdict", notReady.verdict === "not-ready", notReady.verdict);
check("effective NCLC follows the weakest skill", notReady.effectiveNclc === 6, String(notReady.effectiveNclc));

const partial = evaluateExamReadiness({ listening: 500, reading: 495 });
check("missing sections mark exam incomplete", partial.verdict === "incomplete", partial.verdict);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nAll scoring checks passed.");
}
