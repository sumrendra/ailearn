/**
 * Import bundled / volume-persisted WAV files into TcfListeningAudio.
 * Fast and idempotent — safe to run on every container start.
 */

import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { LISTENING_PAPERS, PAPER_COUNT } from "../src/lib/content/tcf-papers";
import { hashAudioScript } from "../src/lib/tcf-tts-server";

config({ path: ".env.local" });
config({ path: ".env" });

const AUDIO_ROOT = process.env.TCF_AUDIO_DIR ?? join(process.cwd(), "public/tcf-audio");

function wavPath(paper: number, questionIndex: number) {
  return join(AUDIO_ROOT, String(paper), `${questionIndex}.wav`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("[import-tcf-audio] DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  let imported = 0;
  let skipped = 0;
  let missing = 0;

  try {
    for (let paper = 1; paper <= PAPER_COUNT; paper++) {
      const questions = LISTENING_PAPERS[paper];
      if (!questions) continue;

      for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
        const path = wavPath(paper, questionIndex);
        if (!existsSync(path)) {
          missing++;
          continue;
        }

        const q = questions[questionIndex];
        const contentHash = hashAudioScript(q.audioScript);
        const audioData = readFileSync(path);

        const existing = await prisma.tcfListeningAudio.findUnique({
          where: { paper_questionIndex: { paper, questionIndex } },
        });

        if (existing?.contentHash === contentHash && existing.audioData.length === audioData.length) {
          skipped++;
          continue;
        }

        await prisma.tcfListeningAudio.upsert({
          where: { paper_questionIndex: { paper, questionIndex } },
          create: {
            paper,
            questionIndex,
            contentHash,
            audioData,
            mimeType: "audio/wav",
            voice: "bundled",
          },
          update: {
            contentHash,
            audioData,
            mimeType: "audio/wav",
            voice: "bundled",
          },
        });
        imported++;
      }
    }

    const total = await prisma.tcfListeningAudio.count();
    console.log(
      `[import-tcf-audio] imported=${imported} skipped=${skipped} missing_files=${missing} total_in_db=${total}/195`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("[import-tcf-audio]", e);
  process.exit(1);
});
