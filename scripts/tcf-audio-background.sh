#!/bin/sh
# Fill missing TCF listening audio in the background (Gemini TTS → files + DB).
# Started by docker-entrypoint when DB count < 195. Uses a lock to avoid duplicates.

LOCK_FILE="/tmp/tcf-audio-seed.lock"
LOG_FILE="/tmp/tcf-audio-seed.log"

if [ -z "$GEMINI_API_KEY" ]; then
  echo "[tcf-audio-bg] GEMINI_API_KEY not set — skipping background seed"
  exit 0
fi

if [ "${DISABLE_TCF_AUDIO_SEED:-false}" = "true" ]; then
  echo "[tcf-audio-bg] DISABLE_TCF_AUDIO_SEED=true — skipping"
  exit 0
fi

# flock may be unavailable on alpine — fall back to mkdir lock
if mkdir "$LOCK_FILE" 2>/dev/null; then
  trap 'rmdir "$LOCK_FILE" 2>/dev/null' EXIT
  echo "[tcf-audio-bg] Starting background seed (log: $LOG_FILE)"
  cd /app
  npm run seed:tcf-audio >> "$LOG_FILE" 2>&1
  echo "[tcf-audio-bg] Finished"
else
  echo "[tcf-audio-bg] Another seed process is already running"
fi
