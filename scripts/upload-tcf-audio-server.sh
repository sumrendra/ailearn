#!/usr/bin/env bash
# Rsync TCF listening MP3s to labz-server volume + register metadata in PostgreSQL.
# Does NOT restart or modify the ailearn container.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOMELABZ="${HOMELABZ:-/Users/Shared/Claude/HomeLabz}"
SSH_KEY="${SSH_KEY:-$HOMELABZ/keys/homelabz_ed25519}"
KNOWN_HOSTS="${KNOWN_HOSTS:-$HOMELABZ/keys/known_hosts}"
REMOTE="${REMOTE:-sumrendra@192.168.1.4}"
REMOTE_AUDIO_ROOT="${REMOTE_AUDIO_ROOT:-/home/sumrendra/ailearn-audio}"
# Default ailearn DB on labz-server (used when ailearn-app is stopped for Portainer redeploy)
REMOTE_DATABASE_URL="${REMOTE_DATABASE_URL:-postgresql://admin:epaps0991g@127.0.0.1:5432/ailearn}"
REMOTE_DIR="/tmp/ailearn-tcf-upload-$$"
LOCAL_AUDIO="${ROOT}/data/tcf-audio"

if [[ ! -d "$LOCAL_AUDIO" ]]; then
  echo "Missing $LOCAL_AUDIO — run: npm run generate:tcf-audio"
  exit 1
fi

ssh_cmd() {
  ssh -i "$SSH_KEY" -o UserKnownHostsFile="$KNOWN_HOSTS" "$REMOTE" "$@"
}

echo "==> Ensuring AudioAsset table exists (pgvector-db)…"
ssh_cmd "docker exec -i pgvector-db psql -U admin -d ailearn" < "$ROOT/prisma/migrations/20260620000000_audio_asset/migration.sql"

echo "==> Ensuring server audio directory exists…"
ssh_cmd "mkdir -p '$REMOTE_AUDIO_ROOT/tcf'"

echo "==> Rsyncing MP3 files to $REMOTE_AUDIO_ROOT/tcf/…"
rsync -avz --progress \
  -e "ssh -i $SSH_KEY -o UserKnownHostsFile=$KNOWN_HOSTS" \
  "$LOCAL_AUDIO/" \
  "$REMOTE:$REMOTE_AUDIO_ROOT/tcf/"

echo "==> Registering metadata in PostgreSQL…"
REMOTE_ARGS="$*"
ssh_cmd "mkdir -p '$REMOTE_DIR'"
tar -czf /tmp/ailearn-tcf-upload.tgz \
  -C "$ROOT" \
  scripts/upload-tcf-audio.mts \
  scripts/tcf-push-package.json \
  src/lib/tcf-audio.ts \
  src/lib/tcf-tts-server.ts \
  src/lib/content/tcf-listening.ts \
  src/lib/content/tcf-listening-p2.ts \
  src/lib/content/tcf-listening-p3.ts \
  src/lib/content/tcf-listening-p4.ts \
  src/lib/content/tcf-listening-p5.ts \
  src/lib/content/tcf-listening-p6.ts \
  src/lib/content/tcf-listening-p7.ts \
  src/lib/content/tcf-listening-p8.ts \
  src/lib/content/tcf-listening-p9.ts \
  src/lib/content/tcf-listening-p10.ts \
  src/lib/content/tcf-listening-p7.ts
scp -i "$SSH_KEY" -o UserKnownHostsFile="$KNOWN_HOSTS" /tmp/ailearn-tcf-upload.tgz "$REMOTE:$REMOTE_DIR/bundle.tgz"
rm -f /tmp/ailearn-tcf-upload.tgz

ssh_cmd "set -e
  cd '$REMOTE_DIR'
  tar -xzf bundle.tgz
  cp scripts/tcf-push-package.json package.json
  if docker inspect ailearn-app >/dev/null 2>&1; then
    docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' ailearn-app | grep '^DATABASE_URL=' > .env.upload
  else
    echo 'DATABASE_URL=$REMOTE_DATABASE_URL' > .env.upload
  fi
  docker run --rm \
    --network host \
    --user node \
    -v '$REMOTE_DIR':/work \
    -w /work \
    --env-file .env.upload \
    node:22-bookworm-slim \
    bash -c 'npm install --silent 2>/dev/null && npx tsx scripts/upload-tcf-audio.mts --metadata-only ${REMOTE_ARGS}'
  docker run --rm -v '$REMOTE_DIR':/work alpine rm -rf /work 2>/dev/null || true
"

echo "==> Complete. Ensure ailearn-app mounts $REMOTE_AUDIO_ROOT:/data/audio:ro"
