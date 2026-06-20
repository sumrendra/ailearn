# Portainer: TCF listening audio volume

## Deploy rule (important)

**Only use Portainer pull & redeploy** for `ailearn-app`. Do not run `docker run --name ailearn-app` manually.

Manual containers are **not** owned by the Portainer stack. The next stack deploy will fail with:

`container name "/ailearn-app" is already in use`

If that happens after a manual fix attempt:

```bash
docker stop ailearn-app && docker rm ailearn-app
```

Then **Portainer → Pull and redeploy** once. Do not recreate the container by hand.

---

## Stack settings

1. **Bind mount** on `ailearn-app`:
   - Host: `/home/sumrendra/ailearn-audio`
   - Container: `/data/audio`
   - Mode: read-only

2. **Environment variable:**
   - `AUDIO_ROOT=/data/audio`

3. Keep your existing `DATABASE_URL`, `NEXTAUTH_*`, `GEMINI_API_KEY`, etc.

4. **Remove** legacy settings if still present:
   - `TCF_AUDIO_DIR`
   - Volume `ai-learn_tcf-audio-data` → `/app/public/tcf-audio`

5. **No** `docker-entrypoint.sh` / auto `prisma migrate deploy` on start.

---

## Upload audio (from your Mac)

```bash
npm run upload:tcf-audio:server
```

Works even when `ailearn-app` is stopped for redeploy (uses `pgvector-db` + default `DATABASE_URL`).

---

## Verify (after redeploy)

```bash
curl -s "https://ailearn.sumrendralabz.biz/api/tcf/listening/audio/status?paper=1"
```

Expect: `"ready": true`, `"stored": 39`

Requires the **new image** (listening API routes) — push `main` and rebuild before this will pass.
