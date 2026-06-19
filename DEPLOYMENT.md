# Deployment — HomeLabz / Portainer

Container **`ailearn-app`** on **labz-server** (`192.168.1.4:3080`), database **`ailearn`** on shared **pgvector-db**.

## Redeploy (Portainer)

1. Push to the Git branch Portainer watches.
2. **Pull and redeploy**.

**Everything below runs automatically** — no manual migration or seed commands.

### On every container start

| Step | What happens |
|------|----------------|
| 1 | `prisma migrate deploy` |
| 2 | Import WAV files from persistent volume → PostgreSQL |
| 3 | If audio &lt; 195/195 and `GEMINI_API_KEY` is set → **background seeder** starts (app does not wait) |
| 4 | Next.js starts |

### Portainer stack — add persistent volume (one-time)

In your stack compose, ensure the app service has:

```yaml
services:
  app:
    # ... existing config ...
    environment:
      TCF_AUDIO_DIR: /app/public/tcf-audio
      GEMINI_API_KEY: ${GEMINI_API_KEY}   # required for auto-seed
    volumes:
      - tcf-audio-data:/app/public/tcf-audio

volumes:
  tcf-audio-data:
```

Without this volume, audio is still seeded to the DB but **re-generates after redeploy** if the DB is wiped. With the volume, WAV files survive redeploys and re-import in seconds.

### Logs to expect

```
[entrypoint] Migrations complete
[entrypoint] Importing TCF audio files to database…
[import-tcf-audio] imported=0 skipped=0 missing_files=195 total_in_db=0/195
[entrypoint] TCF audio 0/195 in DB — starting background seeder
[tcf-audio-bg] Starting background seed (log: /tmp/tcf-audio-seed.log)
```

Background progress:

```bash
docker exec ailearn-app tail -f /tmp/tcf-audio-seed.log
docker exec ailearn-app sh -c 'ls public/tcf-audio/1/ 2>/dev/null | wc -l'
```

Gemini free tier ≈ **10 TTS/day** → full library (~195 clips) fills over **~3 weeks** in the background. Listening exams use stored audio as each paper completes; until then, browser voice is used as fallback.

### Disable automation (optional)

| Variable | Effect |
|----------|--------|
| `DISABLE_TCF_AUDIO_SEED=true` | No background Gemini seed |
| `SKIP_TCF_AUDIO_IMPORT=true` | Skip file → DB import |
| `SKIP_DB_MIGRATE=true` | Skip migrations |

---

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `postgresql://admin:<pw>@host.docker.internal:5432/ailearn` |
| `GEMINI_API_KEY` | For auto-seed | Background TTS generation |
| `NEXTAUTH_URL` | Yes | `https://ailearn.sumrendralabz.biz` |
| `NEXTAUTH_SECRET` | Yes | Auth secret |
| `AUTH_TRUST_HOST` | Yes | `true` |
| `TCF_AUDIO_DIR` | Auto-set | `/app/public/tcf-audio` |

---

## Manual override (rare)

Force re-seed everything:

```bash
docker exec ailearn-app npm run seed:tcf-audio -- --force
```

Import files only (no API):

```bash
docker exec ailearn-app npm run db:import-tcf-audio
```

Check status:

```bash
curl -s "https://ailearn.sumrendralabz.biz/api/tcf/listening/audio/status?paper=1"
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No `[entrypoint]` lines in logs | Old image — pull & redeploy latest |
| Background seed not starting | Set `GEMINI_API_KEY` in Portainer stack |
| Seed log shows 429 | Normal on free tier — wait, seeder resumes on next redeploy |
| Listening uses browser voice | Paper not fully seeded yet — check status API |

Homelab reference: `/Users/Shared/Claude/HomeLabz/AGENTS.md`
