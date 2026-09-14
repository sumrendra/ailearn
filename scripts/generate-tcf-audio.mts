import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";

const execAsync = promisify(exec);

import { TCF_LISTENING } from "../src/lib/content/tcf-listening";
import { TCF_LISTENING_P2 } from "../src/lib/content/tcf-listening-p2";
import { TCF_LISTENING_P3 } from "../src/lib/content/tcf-listening-p3";
import { TCF_LISTENING_P4 } from "../src/lib/content/tcf-listening-p4";
import { TCF_LISTENING_P5 } from "../src/lib/content/tcf-listening-p5";
import { TCF_LISTENING_P6 } from "../src/lib/content/tcf-listening-p6";
import { TCF_LISTENING_P7 } from "../src/lib/content/tcf-listening-p7";
import { TCF_LISTENING_P8 } from "../src/lib/content/tcf-listening-p8";
import { TCF_LISTENING_P9 } from "../src/lib/content/tcf-listening-p9";
import { TCF_LISTENING_P10 } from "../src/lib/content/tcf-listening-p10";

function hashAudioScript(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

const papers = [
  TCF_LISTENING,
  TCF_LISTENING_P2,
  TCF_LISTENING_P3,
  TCF_LISTENING_P4,
  TCF_LISTENING_P5,
  TCF_LISTENING_P6,
  TCF_LISTENING_P7,
  TCF_LISTENING_P8,
  TCF_LISTENING_P9,
  TCF_LISTENING_P10,
];

// Voices for different levels (Canadian/France Neural voices)
const VOICES: Record<string, string> = {
  A1: "fr-CA-SylvieNeural",
  A2: "fr-CA-SylvieNeural",
  B1: "fr-FR-DeniseNeural",
  B2: "fr-FR-HenriNeural",
  C1: "fr-FR-DeniseNeural",
  C2: "fr-FR-HenriNeural",
};

const { values } = parseArgs({
  options: {
    paper: { type: "string" },
    force: { type: "boolean" },
  },
});

async function main() {
  const paperIndex = values.paper ? parseInt(values.paper, 10) - 1 : undefined;

  let succeeded = 0;
  let skipped = 0;
  let failed = 0;

  for (let p = 0; p < papers.length; p++) {
    if (paperIndex !== undefined && p !== paperIndex) continue;

    const paperNum = p + 1;
    const questions = papers[p];
    const outDir = path.join(process.cwd(), `data/tcf-audio/p${paperNum}`);

    await fs.mkdir(outDir, { recursive: true });

    for (let q = 0; q < questions.length; q++) {
      const qNum = String(q).padStart(2, "0");
      const question = questions[q];
      const audioExt = ".mp3"; // edge-tts outputs mp3 by default
      const mediaPath = path.join(outDir, `q${qNum}${audioExt}`);
      const hashPath = path.join(outDir, `q${qNum}.hash`);

      const currentHash = hashAudioScript(question.audioScript);

      if (!values.force) {
        try {
          const existingHash = await fs.readFile(hashPath, "utf8");
          if (existingHash.trim() === currentHash) {
            await fs.access(mediaPath);
            console.log(`[p${paperNum}-q${qNum}] Skipped (already exists)`);
            skipped++;
            continue;
          }
        } catch {
          // Proceed to generate
        }
      }

      const voice = VOICES[question.level] || "fr-CA-SylvieNeural";
      console.log(`[p${paperNum}-q${qNum}] Generating (${question.level}) using Edge-TTS (${voice})...`);
      
      try {
        // Escape quotes to safely pass text to shell
        const safeText = question.audioScript.replace(/"/g, '\\"');
        const command = `python3 -m edge_tts --text "${safeText}" --voice ${voice} --write-media "${mediaPath}"`;
        
        await execAsync(command);
        await fs.writeFile(hashPath, currentHash);
        console.log(`[p${paperNum}-q${qNum}] Success`);
        succeeded++;
      } catch (err: any) {
        console.error(`[p${paperNum}-q${qNum}] Failed:`, err.message);
        failed++;
      }
      
      // Wait a short time to avoid spamming the endpoint too aggressively,
      // though Edge TTS doesn't have strict rate limits like Gemini.
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\nFinished! Succeeded=${succeeded}, Skipped=${skipped}, Failed=${failed}`);
}

main().catch(console.error);
