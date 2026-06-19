# AILearn — Personal AI Engineering Learning Platform

A premium, interactive learning platform for mastering AI technologies. Built for local Docker deployment with the ability to scale as a public web app.

## Features

- 🎓 **Learning paths** — LLM Foundations, RAG & Vector DBs, AI Agents (more coming)
- 🤖 **AI tutor** — Claude-powered chat tutor that knows you're a Java dev
- ⚡ **Spaced repetition flashcards** — SM-2 algorithm for long-term retention
- 🏆 **Mock interviews** — AI interviewer with scored feedback on every answer
- 🎯 **Adaptive quizzes** — AI-generated from any lesson, varying question types
- 🔥 **Streaks & XP** — Gamified progress with levels, achievements, and heatmap
- 🌙 **Dark/light mode** — Polished toggle with smooth transitions

## Quick start (Docker)

```bash
# 1. Enter the project directory
cd ailearn

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local — add your ANTHROPIC_API_KEY at minimum

# 3. Start everything (migrations run automatically on container start)
docker compose up -d --build

# 4. Open http://localhost:3080

# Optional: pre-generate TCF listening audio (one-time, needs GEMINI_API_KEY)
docker compose exec app npm run seed:tcf-audio -- --paper=1
```

**Production (Portainer on labz-server):** see [DEPLOYMENT.md](./DEPLOYMENT.md) — pull & redeploy applies migrations; run `seed:tcf-audio` once via container console.

## Local development (no Docker)

```bash
npm install
cp .env.local.example .env.local
# Configure DATABASE_URL and ANTHROPIC_API_KEY

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Database | PostgreSQL 16 + pgvector |
| ORM | Prisma 7 |
| AI | Anthropic Claude API |
| Docker | Docker Compose with hot reload |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Yes | Powers AI tutor, quiz gen, interviews |
| `NEXTAUTH_SECRET` | Yes | NextAuth signing secret |
| `NEXTAUTH_URL` | Yes | App URL (http://localhost:3000) |
