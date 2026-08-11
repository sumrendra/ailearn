/**
 * Register TCF listening MP3 metadata in PostgreSQL (files on volume, not BYTEA).
 *
 *   npm run upload:tcf-audio
 *   npm run upload:tcf-audio -- --paper=1
 *   npm run upload:tcf-audio:server   # rsync + this script on labz-server
 */

import { config } from "dotenv";
import fs from "node:fs/promises";
import { Pool } from "pg";
import type { TCFListeningQuestion } from "../src/lib/content/tcf-listening";
import { TCF_LISTENING } from "../src/lib/content/tcf-listening";
import { TCF_LISTENING_P2 } from "../src/lib/content/tcf-listening-p2";
import { TCF_LISTENING_P3 } from "../src/lib/content/tcf-listening-p3";
import { TCF_LISTENING_P4 } from "../src/lib/content/tcf-listening-p4";
import { TCF_LISTENING_P5 } from "../src/lib/content/tcf-listening-p5";
import { TCF_LISTENING_P6 } from "../src/lib/content/tcf-listening-p6";
import {
  TCF_LISTENING_NAMESPACE,
  TCF_LISTENING_VOICES,
  localListeningMp3Path,
  tcfListeningStoragePath,
} from "../src/lib/tcf-audio";
import { hashAudioScript, randomUUID } from "../src/lib/tcf-tts-server";

const PAPER_COUNT = 6;
const LISTENING_PAPERS: Record<number, TCFListeningQuestion[]> = {
  1: TCF_LISTENING,
  2: TCF_LISTENING_P2,
  3: TCF_LISTENING_P3,
  4: TCF_LISTENING_P4,
  5: TCF_LISTENING_P5,
  6: TCF_LISTENING_P6,
};

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const metadataOnly = args.includes("--metadata-only");
const paperArg = args.find((a) => a.startsWith("--paper="))?.split("=")[1]
  ?? (args.includes("--paper") ? args[args.indexOf("--paper") + 1] : undefined);
const papers = paperArg
  ? [parseInt(paperArg, 10)].filter((p) => p >= 1 && p <= PAPER_COUNT)
  : Array.from({ length: PAPER_COUNT }, (_, i) => i + 1);

const pool = new Pool({ connectionString });

async function getExisting(
  paper: number,
  questionIndex: number,
): Promise<{ contentHash: string; storagePath: string } | null> {
  const { rows } = await pool.query<{ contentHash: string; storagePath: string }>(
    `SELECT "contentHash", "storagePath"
     FROM "AudioAsset"
     WHERE namespace = $1 AND paper = $2 AND "questionIndex" = $3`,
    [TCF_LISTENING_NAMESPACE, paper, questionIndex],
  );
  return rows[0] ?? null;
}

async function upsertMetadata(
  paper: number,
  questionIndex: number,
  contentHash: string,
  storagePath: string,
  voice: string,
) {
  const now = new Date();
  await pool.query(
    `INSERT INTO "AudioAsset"
      (id, namespace, paper, "questionIndex", "contentHash", "storagePath", "mimeType", voice, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, 'audio/mpeg', $7, $8, $8)
     ON CONFLICT (namespace, paper, "questionIndex") DO UPDATE SET
      "contentHash" = EXCLUDED."contentHash",
      "storagePath" = EXCLUDED."storagePath",
      "mimeType" = EXCLUDED."mimeType",
      voice = EXCLUDED.voice,
      "updatedAt" = EXCLUDED."updatedAt"`,
    [randomUUID(), TCF_LISTENING_NAMESPACE, paper, questionIndex, contentHash, storagePath, voice, now],
  );
}

async function countAll(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM "AudioAsset" WHERE namespace = $1`,
    [TCF_LISTENING_NAMESPACE],
  );
  return Number(rows[0]?.count ?? 0);
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (const paper of papers) {
    const questions = LISTENING_PAPERS[paper];
    if (!questions?.length) continue;

    console.log(`\n── Paper ${paper} (${questions.length} questions) ──`);

    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const q = questions[questionIndex];
      const contentHash = hashAudioScript(q.audioScript);
      const storagePath = tcfListeningStoragePath(paper, questionIndex);
      const voice = TCF_LISTENING_VOICES[q.level] ?? TCF_LISTENING_VOICES.B1;
      const label = `P${paper} Q${questionIndex + 1}`;
      const localPath = localListeningMp3Path(paper, questionIndex);

      try {
        if (!metadataOnly) {
          await fs.access(localPath);
        }
      } catch {
        console.error(`  ✗ ${label} — missing file ${localPath}`);
        console.error("    Run: npm run generate:tcf-audio");
        break;
      }

      const existing = await getExisting(paper, questionIndex);
      if (existing && existing.contentHash === contentHash && existing.storagePath === storagePath && !force) {
        skipped++;
        console.log(`  ✓ ${label} — already registered`);
        continue;
      }

      await upsertMetadata(paper, questionIndex, contentHash, storagePath, voice);
      created++;
      if (metadataOnly) {
        console.log(`  ✓ ${label} — ${storagePath}`);
      } else {
        const stat = await fs.stat(localPath);
        console.log(`  ✓ ${label} — ${storagePath} (${(stat.size / 1024).toFixed(0)} KB)`);
      }
    }
  }

  const total = await countAll();
  console.log(`\nDone. registered=${created} skipped=${skipped} total_in_db=${total}/${PAPER_COUNT * 39}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
