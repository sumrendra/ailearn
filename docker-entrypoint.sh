#!/bin/sh
set -e

if [ "${SKIP_DB_MIGRATE:-false}" = "true" ]; then
  echo "[entrypoint] SKIP_DB_MIGRATE=true — skipping prisma migrate deploy"
else
  echo "[entrypoint] Applying database migrations (prisma migrate deploy)…"
  attempts=0
  max_attempts=30
  until npx prisma migrate deploy; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge "$max_attempts" ]; then
      echo "[entrypoint] Migration failed after ${max_attempts} attempts — exiting"
      exit 1
    fi
    echo "[entrypoint] Database not ready (attempt ${attempts}/${max_attempts}), retrying in 2s…"
    sleep 2
  done
  echo "[entrypoint] Migrations complete"
fi

# Sync WAV files from persistent volume / bundled public dir → PostgreSQL (fast)
if [ "${SKIP_TCF_AUDIO_IMPORT:-false}" != "true" ]; then
  echo "[entrypoint] Importing TCF audio files to database…"
  npx tsx prisma/import-tcf-audio.ts || echo "[entrypoint] TCF audio import skipped or partial"
fi

# Background Gemini seed for any missing clips (resumable, respects API quota)
if [ "${DISABLE_TCF_AUDIO_SEED:-false}" != "true" ] && [ -n "$GEMINI_API_KEY" ]; then
  COUNT=$(npx tsx -e "
    import { PrismaClient } from '@prisma/client';
    import { PrismaPg } from '@prisma/adapter-pg';
    import { Pool } from 'pg';
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
    prisma.tcfListeningAudio.count().then(c => { console.log(c); return pool.end(); }).catch(() => process.exit(1));
  " 2>/dev/null || echo "0")

  if [ "$COUNT" -lt 195 ] 2>/dev/null; then
    echo "[entrypoint] TCF audio ${COUNT}/195 in DB — starting background seeder"
    sh /app/scripts/tcf-audio-background.sh &
  else
    echo "[entrypoint] TCF audio complete (${COUNT}/195)"
  fi
fi

exec "$@"
