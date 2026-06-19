/**
 * One-time (resumable) seed: generate TCF listening WAV files via Gemini TTS
 * and store them in PostgreSQL.
 *
 * Usage:
 *   npm run seed:tcf-audio
 *   npm run seed:tcf-audio -- --paper 1        # single paper
 *   npm run seed:tcf-audio -- --force          # regenerate even if hash matches
 *
 * Free-tier Gemini TTS is ~10 requests/day — the script skips existing rows
 * and can be re-run until all 195 clips (5 papers × 39 questions) are stored.
 */

import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { LISTENING_PAPERS, PAPER_COUNT } from "../src/lib/content/tcf-papers";
import {
  generateTcfListeningWav,
  hashAudioScript,
  sleep,
} from "../src/lib/tcf-tts-server";

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const apiKey = process.env.GEMINI_API_KEY;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const paperArg = args.find((a) => a.startsWith("--paper="))?.split("=")[1]
  ?? (args.includes("--paper") ? args[args.indexOf("--paper") + 1] : undefined);
const papers = paperArg
  ? [parseInt(paperArg, 10)].filter((p) => p >= 1 && p <= PAPER_COUNT)
  : Array.from({ length: PAPER_COUNT }, (_, i) => i + 1);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DELAY_BETWEEN_MS = 7_000;
const AUDIO_ROOT = process.env.TCF_AUDIO_DIR ?? join(process.cwd(), "public/tcf-audio");

function saveWavFile(paper: number, questionIndex: number, wav: Buffer) {
  const path = join(AUDIO_ROOT, String(paper), `${questionIndex}.wav`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, wav);
}

async function main() {
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const paper of papers) {
    const questions = LISTENING_PAPERS[paper];
    if (!questions?.length) {
      console.warn(`Paper ${paper}: no questions found, skipping`);
      continue;
    }

    console.log(`\n── Paper ${paper} (${questions.length} questions) ──`);

    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const q = questions[questionIndex];
      const contentHash = hashAudioScript(q.audioScript);
      const label = `P${paper} Q${questionIndex + 1}`;

      const existing = await prisma.tcfListeningAudio.findUnique({
        where: { paper_questionIndex: { paper, questionIndex } },
      });

      if (existing && existing.contentHash === contentHash && !force) {
        skipped++;
        console.log(`  ✓ ${label} — already stored (${(existing.audioData.length / 1024).toFixed(0)} KB)`);
        continue;
      }

      try {
        console.log(`  … ${label} — generating (${q.level})…`);
        const { wav, voice, model } = await generateTcfListeningWav(
          q.audioScript,
          q.level,
          apiKey!,
        );

        saveWavFile(paper, questionIndex, wav);

        await prisma.tcfListeningAudio.upsert({
          where: { paper_questionIndex: { paper, questionIndex } },
          create: {
            paper,
            questionIndex,
            contentHash,
            audioData: wav,
            mimeType: "audio/wav",
            voice,
          },
          update: {
            contentHash,
            audioData: wav,
            mimeType: "audio/wav",
            voice,
          },
        });

        created++;
        console.log(`  ✓ ${label} — saved ${(wav.length / 1024).toFixed(0)} KB (${model}, ${voice})`);
      } catch (err) {
        failed++;
        console.error(`  ✗ ${label} — ${err instanceof Error ? err.message : String(err)}`);
        console.error("    Stopping batch — re-run later to resume.");
        break;
      }

      await sleep(DELAY_BETWEEN_MS);
    }
  }

  const total = await prisma.tcfListeningAudio.count();
  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed} total_in_db=${total}/195`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
