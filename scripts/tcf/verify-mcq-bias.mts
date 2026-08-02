/**
 * Verify TCF MCQ banks match official FEI bias targets.
 * Run: npx tsx scripts/tcf/verify-mcq-bias.mts
 */
import { READING_PAPERS, LISTENING_PAPERS } from "../../src/lib/content/tcf-papers";
import {
  analyzeMcqBias,
  OFFICIAL_MCQ_BIAS_TARGETS,
} from "../../src/lib/tcf-program/normalize-mcq";

function check(label: string, questions: Parameters<typeof analyzeMcqBias>[0]) {
  const s = analyzeMcqBias(questions);
  const longestOk = s.longestCorrectPct <= OFFICIAL_MCQ_BIAS_TARGETS.longestCorrectMax;
  const uniqueOk =
    s.uniqueLongestCorrectPct <= OFFICIAL_MCQ_BIAS_TARGETS.uniqueLongestCorrectMax;
  const indexOk = s.indexPct.every((p) => p >= OFFICIAL_MCQ_BIAS_TARGETS.indexSpreadMin);

  console.log(`${label}: n=${s.n}`);
  console.log(
    `  longest correct: ${(s.longestCorrectPct * 100).toFixed(1)}% (max ${OFFICIAL_MCQ_BIAS_TARGETS.longestCorrectMax * 100}%) ${longestOk ? "OK" : "FAIL"}`,
  );
  console.log(
    `  unique longest: ${(s.uniqueLongestCorrectPct * 100).toFixed(1)}% (max ${OFFICIAL_MCQ_BIAS_TARGETS.uniqueLongestCorrectMax * 100}%) ${uniqueOk ? "OK" : "FAIL"}`,
  );
  console.log(
    `  index spread A/B/C/D: ${s.indexPct.map((p) => (p * 100).toFixed(1) + "%").join(" / ")} ${indexOk ? "OK" : "FAIL"}`,
  );

  if (!longestOk || !uniqueOk || !indexOk) {
    process.exitCode = 1;
  }
}

const reading = Object.values(READING_PAPERS).flat();
const listening = Object.values(LISTENING_PAPERS).flat();

check("Reading", reading);
check("Listening", listening);
check("Combined", [...reading, ...listening]);

if (process.exitCode === 1) {
  console.error("\nMCQ bias verification failed.");
} else {
  console.log("\nMCQ bias verification passed.");
}
