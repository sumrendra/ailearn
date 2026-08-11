# AILearn — Codebase Reference

> **Purpose:** Single source of truth for AI agents and developers working on upgrades, bug fixes, and new features. Read this before making structural changes.
>
> **Last reviewed:** 2026-06-19

---

## 1. What this application is

**AILearn** is a personal, premium learning platform for technical and language skills. It combines:

- **Static curriculum in code** — 14 learning paths, ~92 lessons, flashcards, quizzes, achievements
- **Per-user state in PostgreSQL** — progress, XP, notes (schema only), flashcard reviews (schema only), interview/chat sessions (schema only)
- **AI-powered features** — tutor chat, mock interviews, adaptive quiz generation, TCF Canada writing/speaking evaluation
- **Rich interactive lesson blocks** — SQL playgrounds (PGlite), Excel (HyperFormula), French TTS, Java visualizers, AI diagrams

The app runs as a **Next.js App Router** site, deployable via **Docker** (standalone output) against an external PostgreSQL instance (often with pgvector on the host).

**Primary user persona (hard-coded in AI prompts):** Haril — senior Java engineer, Kafka/microservices background, transitioning into AI engineering. French/TCF Canada prep is a secondary track.

---

## 2. Tech stack (actual versions)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 16.2** (App Router) | `output: "standalone"` in `next.config.ts`. README still says Next 14 — outdated. |
| UI | React 19, TypeScript 5 | Mostly inline styles + CSS variables; Tailwind 4 imported in `globals.css` |
| Auth | **NextAuth v5 beta** (`next-auth@5`) | Credentials provider only; JWT sessions |
| Database | PostgreSQL 16 + **Prisma 7** | `@prisma/adapter-pg` + `pg` Pool — not the default Prisma engine |
| AI | Gemini (primary) → OpenRouter (secondary) → Anthropic (tertiary) | See `src/lib/ai.ts` |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` | Many ESM packages transpiled in `next.config.ts` |
| SQL lessons | `@electric-sql/pglite` | Client-side WASM Postgres |
| Excel lessons | `hyperformula` | Browser formula engine |
| Animation | `framer-motion` | Flashcards, practice UI |
| Icons | `lucide-react` | Path icons resolved via `learning-paths.ts` |
| Radix | Various `@radix-ui/*` | Dialogs, tabs, tooltips (sparse usage) |

**Agent rule:** This is **not** standard Next.js from training data. Check `node_modules/next/dist/docs/` before using Next APIs.

---

## 3. Architecture — the most important design decision

### Content-in-code, user-data-in-DB

As of migration `20260524060101_content_out_of_db`:

| Lives in **code** (`src/lib/content/`) | Lives in **database** (`prisma/schema.prisma`) |
|----------------------------------------|-----------------------------------------------|
| Learning paths, lessons, markdown bodies | `User`, auth tables |
| Flashcard definitions | `LessonProgress` (keyed by `lessonSlug`) |
| Static quiz questions | `FlashcardReview` (keyed by `cardKey`) — **schema only, no API yet** |
| Achievements catalog | `QuizAttempt`, `QuizAttemptQuestion` — **schema only, no API yet** |
| TCF papers (listening/reading/writing/speaking) | `Note` — **schema only, UI stub** |
| | `UserAchievement` — **schema only, no unlock logic** |
| | `InterviewSession`, `ChatSession` — **schema only, no persistence** |

**Stable keys:** Content references use string slugs/keys, not FK ids:

- Lessons: `lessonSlug` (e.g. `what-is-an-llm`)
- Flashcards: `cardKey` (e.g. `what-is-an-llm:1`)
- Quiz questions: `questionKey` (e.g. `what-is-an-llm:q1`)
- Achievements: `achievementSlug` (e.g. `first-lesson`)

**Implication for changes:**

- Adding a lesson = edit content files + optionally `paths.ts` — **no migration, no seed**
- Changing lesson slug = update DB rows for existing users OR accept orphaned progress
- `prisma db seed` is configured in `prisma.config.ts` but **`prisma/seed.ts` does not exist**

---

## 4. Directory map

```
ailearn/
├── prisma/
│   ├── schema.prisma          # User-scoped models only
│   ├── migrations/            # Includes content-out-of-DB migration
│   └── test-db.ts             # ⚠️ STALE — queries removed LearningPath/DailyChallenge tables
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root: fonts, ThemeProvider, AuthProvider, no-flash theme script
│   │   ├── page.tsx             # Redirects / → /dashboard
│   │   ├── globals.css          # Design system v2 (CSS variables, glass-pane, themes)
│   │   ├── (app)/               # Main shell: sidebar + canvas backdrop + command palette
│   │   ├── (auth)/              # Login / signup (minimal layout)
│   │   ├── api/                 # Route handlers (see §7)
│   │   └── preview/             # Dev/preview page
│   ├── auth.ts                  # NextAuth config (Credentials + PrismaAdapter)
│   ├── proxy.ts                 # Middleware replacement — currently no-op (guest access)
│   ├── components/
│   │   ├── ai/                  # TutorChat, InterviewMode
│   │   ├── conversation/        # Shared chat UI (MessageBubble, Composer, streaming)
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── diagrams/            # LLM/RAG/agent interactive diagrams
│   │   ├── excel/               # Formula playground, pivot, quiz
│   │   ├── french/              # Vocab, dialogue, grammar, sentence builder
│   │   ├── java/                # HashMap visualizer, collections, JavaQuiz
│   │   ├── layout/              # Sidebar, Topbar, Theme, CommandPalette, CanvasBackdrop
│   │   ├── learn/               # LessonViewer, PathCard, FlashcardReviewer, KnowledgeMap
│   │   ├── path-objects/        # Per-path decorative 3D/SVG hero components (13 of 14 paths)
│   │   ├── playground/          # SqlPlayground (PGlite)
│   │   └── practice/            # FlashcardDeck (SM-2 UI), PracticeStage, Kbd
│   ├── lib/
│   │   ├── content/             # ★ All curriculum data
│   │   ├── ai.ts                # Multi-provider AI abstraction
│   │   ├── prisma.ts            # Singleton Prisma client (pg adapter)
│   │   ├── learning-paths.ts    # Path presentation metadata (icons, colors, tiers)
│   │   ├── lesson-blocks.ts     # Parser for `@directive` lines in fenced blocks
│   │   ├── french-blocks.ts     # French interactive block parsers
│   │   ├── excel-blocks.ts      # Excel interactive block parsers
│   │   ├── java-blocks.ts       # Java quiz block parser
│   │   ├── sql-fixtures.ts      # PGlite seed schemas for SQL lessons
│   │   ├── excel-fixtures.ts    # Spreadsheet fixtures for Excel lessons
│   │   ├── french-tts.ts        # Browser SpeechSynthesis helper
│   │   └── utils.ts             # cn() etc.
│   └── types/
│       └── next-auth.d.ts       # Session.user.id augmentation
├── docker-compose.yml           # App container → host Postgres via host.docker.internal
├── Dockerfile                   # Multi-stage, standalone, includes prisma for runtime migrate
├── CODEBASE.md                  # This file
├── AGENTS.md                    # Next.js agent warning only
└── README.md                    # Quick start (partially outdated)
```

---

## 5. Learning paths (14 paths, ~92 lessons)

| # | Slug | Title | Lessons | Difficulty | PathObject component |
|---|------|-------|---------|------------|---------------------|
| 1 | `llm-foundations` | LLM Foundations | 6 | BEGINNER | `LLMFoundations` |
| 2 | `rag-vector-dbs` | RAG & Vector DBs | 6 | INTERMEDIATE | `RagVectorDbs` |
| 3 | `ai-agents` | AI Agents & Tool Use | 6 | ADVANCED | `AiAgents` |
| 4 | `sql-mastery` | SQL Mastery | 6 | INTERMEDIATE | `SqlMastery` |
| 5 | `french-fundamentals` | French Fundamentals | 6 | BEGINNER | `FrenchFundamentals` |
| 6 | `excel-mastery` | Excel Mastery | 6 | BEGINNER | `ExcelMastery` |
| 7 | `java-complete` | Java Complete | 8 | INTERMEDIATE | `JavaComplete` |
| 8 | `java-frameworks` | Java Frameworks | 6 | INTERMEDIATE | `JavaFrameworks` |
| 9 | `kafka-essentials` | Apache Kafka | 6 | INTERMEDIATE | `KafkaEssentials` |
| 10 | `microservices-architecture` | Microservices | 6 | ADVANCED | `MicroservicesArchitecture` |
| 11 | `system-design` | System Design | 6 | ADVANCED | `SystemDesign` |
| 12 | `java-advanced` | Java Advanced | 10 | ADVANCED | `JavaAdvanced` |
| 13 | `french-advanced` | French Advanced (TEF/TCF) | 10 | INTERMEDIATE | `FrenchAdvanced` |
| 14 | `gmat-prep` | GMAT Prep (Focus Edition) | 10 | INTERMEDIATE | **Missing** — no `PathObject` entry |

**Content file layout:**

- `src/lib/content/paths.ts` — aggregates all paths; imports lesson bodies from per-domain files
- Per-domain bodies: `ai-content.ts`, `sql-content.ts`, `french-content.ts`, `excel-content.ts`, `java-content.ts`, `java-frameworks-content.ts`, `kafka-content.ts`, `microservices-content.ts`, `system-design-content.ts`, `java-advanced-content.ts`, `french-advanced-content.ts`, `gmat-*.ts` (3 files)
- Public API: `src/lib/content/index.ts` — **always import from here**, not from internal files

**Presentation metadata:** `src/lib/learning-paths.ts` — `getPathMeta(slug)` returns icon, colors, gradient, tier. Adding a path requires entries in **both** `paths.ts` and `learning-paths.ts`, plus optionally `path-objects/`.

---

## 6. Routes and pages

### App shell (`src/app/(app)/layout.tsx`)

Server component that loads session, user XP/streak, all paths for CommandPalette, renders `AppSidebar` + `CanvasBackdrop` + `CommandPalette`.

### Main navigation (sidebar)

| Route | Purpose |
|-------|---------|
| `/dashboard` | Home — stats, recent activity, path progress, today's queue |
| `/learn` | Path catalog (bento grid) |
| `/learn/[slug]` | Single path detail + lesson list |
| `/lessons` | Flat lesson index |
| `/lessons/[slug]` | **Lesson reader** (`LessonViewer`) |
| `/flashcards` | Spaced repetition deck (`FlashcardDeck`) |
| `/quiz` | Quiz topic picker |
| `/quiz/generate` | AI-generated quiz session |
| `/tutor` | AI tutor chat |
| `/interview` | Mock AI interview |
| `/tcf` | TCF Canada hub |
| `/tcf/listening` | Listening practice (fixed paper) or exam mode (randomized draw) |
| `/tcf/reading` | Reading practice (fixed paper) or exam mode (randomized draw) |
| `/tcf/writing` | Writing tasks + AI eval |
| `/tcf/speaking` | Speaking tasks + audio AI eval |
| `/settings` | User settings |
| `/notes` | **Stub** — "coming soon" |
| `/challenge` | **Stub** — daily challenge disabled post-migration |
| `/search` | Lesson search UI |

### Auth routes (`src/app/(auth)/`)

| Route | Purpose |
|-------|---------|
| `/login` | Credentials sign-in |
| `/signup` | Registration → `POST /api/auth/signup` |

**Guest mode:** `src/proxy.ts` allows all routes without auth. Progress/XP APIs return 401 if not logged in; UI degrades gracefully for guests.

---

## 7. API routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/[...nextauth]` | * | — | NextAuth handlers |
| `/api/auth/signup` | POST | — | Create user (bcrypt password) |
| `/api/progress` | GET, POST | Required | Lesson progress read/write; awards XP on first completion |
| `/api/flashcards` | GET | — | Returns static cards from content (max 50); optional `?lesson=` filter |
| `/api/search` | GET | — | Full-text search over lesson titles/descriptions/content |
| `/api/tutor/chat` | POST | — | Non-streaming tutor (uses `generateAIChat`) |
| `/api/interview/chat` | POST | — | Non-streaming interviewer |
| `/api/quiz/generate` | POST | — | AI quiz JSON generation |
| `/api/tcf/listening/audio/[paper]/[question]` | GET | — | Serve pre-generated listening MP3 from volume |
| `/api/tcf/listening/audio/status` | GET | — | Audio readiness count per paper |
| `/api/tcf/tts` | POST | — | Legacy on-demand Gemini TTS fallback |
| `/api/tcf/writing` | POST | — | AI writing evaluation (French) |
| `/api/tcf/speaking` | POST | — | Audio → Gemini multimodal eval |

**Not implemented (but schema exists):**

- Flashcard review persistence (SM-2 → `FlashcardReview`)
- Quiz attempt recording (`QuizAttempt`)
- Notes CRUD (`Note`)
- Achievement unlocks (`UserAchievement`)
- Chat/interview session history (`ChatSession`, `InterviewSession`)

---

## 8. Lesson content system

### Markdown + fenced code blocks

Lessons are markdown strings in content files. `LessonViewer` uses `react-markdown` with a custom `pre` handler that maps **language tags** to React components:

| Fence language | Component | Parser |
|----------------|-----------|--------|
| `sql-playground` | `SqlPlayground` | `parseLessonBlock()` — supports `@fixture`, `@hint`, `@challenge` |
| `diagram-attention` | `AttentionVisualizer` | — |
| `diagram-embeddings` | `EmbeddingExplorer` | — |
| `diagram-tokenization` | `TokenizationVisualizer` | — |
| `diagram-rag` | `RAGFlowExplorer` | — |
| `diagram-agent-loop` | `AgentLoopInteractive` | — |
| `french-vocab` | `VocabList` | `parseFrenchVocab` |
| `french-sentence` | `SentenceBuilder` | `parseFrenchSentence` |
| `french-dialogue` | `ConversationScene` | `parseFrenchDialogue` |
| `french-match` | `MatchQuiz` | `parseFrenchMatch` |
| `french-grammar` | `GrammarTable` | `parseFrenchGrammar` |
| `excel-formula` | `FormulaPlayground` | `parseExcelFormula` |
| `excel-pivot` | `PivotSimulator` | `parseExcelPivot` |
| `excel-quiz` | `FormulaQuiz` | `parseExcelQuiz` |
| `java-hashmap` | `HashMapVisualizer` | — |
| `java-collections` | `CollectionsHierarchy` | — |
| `java-quiz` | `JavaQuiz` | `parseJavaQuiz` |
| *(anything else)* | `CodeBlock` | Syntax highlight via highlight.js |

**Adding a new interactive block type:**

1. Create component under `src/components/`
2. Add parser in `src/lib/*-blocks.ts` if needed
3. Register in `LessonViewer.tsx` `pre` handler
4. Use in lesson markdown content

### SQL playground internals

- PGlite loaded dynamically (WASM ~3MB)
- **Singleton per fixture** — multiple playgrounds on one page share DB state
- Fixtures defined in `src/lib/sql-fixtures.ts` (`ecommerce`, etc.)

---

## 9. AI layer (`src/lib/ai.ts`)

### Provider fallback chain

1. **Gemini** (`GEMINI_API_KEY`) — OpenAI-compatible endpoint at `generativelanguage.googleapis.com`
2. **OpenRouter** (`OPENROUTER_KEY`) — free-tier models
3. **Anthropic** (`ANTHROPIC_API_KEY`) — Claude 3.5 Sonnet/Haiku

### Functions

| Function | Streaming | Used by |
|----------|-----------|---------|
| `generateAIChat(messages, system, "tutor"\|"interview")` | No | Tutor, interview routes |
| `streamAIChat(...)` | Yes (SSE) | Available but tutor route uses non-streaming |
| `generateAIQuiz(title, content, difficulty, count)` | No | Quiz generator |

### Model selection

- Tutor: `gemini-3.5-flash` / `llama-3.3-70b-instruct:free` / `claude-3-5-sonnet-latest`
- Interview: `gemini-3.1-flash-lite` / `deepseek-v4-flash:free` / `claude-3-5-sonnet-latest`
- Quiz: `gemini-3.5-flash` / `deepseek-v4-flash:free` / `claude-3-5-haiku-latest`

TCF features use **Gemini directly** (not the shared fallback chain) for TTS, writing, and speaking eval.

---

## 10. Authentication

- **File:** `src/auth.ts`
- **Provider:** Credentials (email + bcrypt password)
- **Session:** JWT (not database sessions for auth flow, though Session model exists via adapter)
- **Adapter:** `PrismaAdapter` — supports future OAuth but none configured
- **Sign-up:** Separate `POST /api/auth/signup` then manual login

Environment: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_TRUST_HOST=true` in Docker.

---

## 11. Gamification (partial implementation)

### Implemented

- `User.xp` incremented on first lesson completion (`/api/progress`)
- `LessonProgress` tracks `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`
- Dashboard shows XP, level, streak from DB

### Schema present, logic missing or incomplete

- **`level`** — stored on User, never recalculated from XP
- **`currentStreak` / `longestStreak`** — stored, not updated by progress API
- **`streakFreezes`** — stored, unused
- **Achievements** — catalog in `content/achievements.ts`, no unlock checks
- **Daily challenges** — type exists in `content/types.ts`, page stubbed
- **Flashcard SM-2** — UI labels reference SM-2; `FlashcardDeck` tracks session stats only; `FlashcardReview` table unused
- **Quiz attempts** — not persisted

---

## 12. TCF Canada module

Separate from the `french-advanced` learning path — dedicated exam simulator.

- **Content:** `src/lib/content/tcf-*.ts` — listening, reading, writing, speaking per paper (`tcf-papers.ts` central registry, `PAPER_COUNT` papers)
- **Hub:** `/tcf` with CLB/NCLC reference table
- **Listening:** Pre-generated Edge TTS MP3 on server volume; served via `/api/tcf/listening/audio/[paper]/[question]` (metadata in `AudioAsset` table)
- **Reading:** Passages + MCQ from content lib
- **Writing:** `/api/tcf/writing` — AI scores against the FEI rubric; task 3 is the compare-two-viewpoints task
- **Speaking:** Records audio in browser → base64 → `/api/tcf/speaking` → Gemini multimodal JSON eval

### Exam fidelity

The mock exists to predict the official result, so three pieces deliberately
mirror FEI behaviour rather than being convenient:

| Concern | Module | Behaviour |
|---------|--------|-----------|
| Scoring | `tcf-program/scoring.ts` | Difficulty-weighted 0–699 barème. Q1–10 carry ~9% of the scale, Q20–39 ~71%; band weights sum to exactly 699. A flat `correct/39` overstates candidates who only clear the easy third. |
| Verdict | `tcf-program/readiness.ts` | Effective NCLC is the **lowest** section (IRCC rule), never an average. Each skill has a safety margin above the band floor, so a score exactly on the threshold reports `borderline`, not `ready`. |
| Item selection | `tcf-program/exam-draw.ts` | Exam mode draws 39 items from the whole pooled bank, stratified so each slot keeps the CEFR level its scoring band assumes, seeded so a sitting survives reloads. Practice mode serves a fixed paper for review. |

Because a drawn sitting spans several source papers, listening resolves audio
per item (`sourcePaper` / `sourceQuestionIndex`) and the readiness endpoint takes
`?papers=1,2,3`.

```bash
npm run tcf:verify-scoring   # scale integrity, weighting, NCLC boundary, verdicts
npm run tcf:verify-draw      # composition, uniqueness, ordering, determinism
npm run tcf:verify-mcq       # option-length and position bias vs official samples
```

MCQ options are normalised at load (`tcf-program/normalize-mcq.ts`) so no surface
heuristic — longest option, always B — beats reading the question.

French fundamentals lessons use **browser SpeechSynthesis** (`french-tts.ts`), not the listening audio API.

### Listening audio (volume + PostgreSQL metadata)

| Layer | Location |
|-------|----------|
| MP3 files | Server volume mounted at `/data/audio` (e.g. `/home/sumrendra/ailearn-audio` on labz-server) |
| Metadata | PostgreSQL `AudioAsset` (`namespace=tcf-listening`, `storagePath`, `contentHash`) |
| Local generate | `data/tcf-audio/p{N}/q{NN}.mp3` (gitignored) |

```bash
npm run generate:tcf-audio              # Edge TTS → data/tcf-audio/ (all papers)
npm run generate:tcf-audio -- --paper=1   # single paper
npm run upload:tcf-audio:server           # rsync MP3s + register metadata on labz-server
```

**Production env:** `AUDIO_ROOT=/data/audio`. Portainer bind mount: `/home/sumrendra/ailearn-audio:/data/audio:ro`

**Do not** use auto-migrate entrypoint on deploy — apply migrations via SSH script only.

### Adding a new TCF paper (all 4 modules)

One command generates listening, reading, writing, and speaking content, then audio + server upload:

```bash
# Generate manifest JSON only (review before emit)
npm run tcf:new-paper -- --paper=6 --theme="Immigration au Canada" --dry-run

# After editing content/tcf/manifests/paper-06.json if needed
npm run tcf:new-paper -- --paper=6 --from-manifest

# Full pipeline (Gemini text → TS files → Edge TTS → server upload)
npm run tcf:new-paper -- --paper=6 --theme="Immigration au Canada"
```

Pipeline scripts live in `scripts/tcf/`:

| Script | Role |
|--------|------|
| `generate-content.mts` | Gemini → manifest JSON |
| `validate-manifest.mts` | Schema + level-band checks |
| `emit-typescript.mts` | Manifest → `src/lib/content/tcf-*-pN.ts` |
| `register-paper.mts` | Updates `tcf-papers.ts` |
| `new-paper.mts` | Orchestrator |

Requires `GEMINI_API_KEY` for text generation; listening TTS uses free Edge TTS (no API key).

Papers may also be hand-authored, which is preferred when distractor quality
matters: generated options tend to make the correct answer the longest and most
detailed, which `normalize-mcq.ts` can only partly repair. Paper 6 was written by
hand. A hand-authored paper still needs registering and audio:

```bash
# after adding src/lib/content/tcf-{listening,reading,writing,speaking}-pN.ts
# and referencing them in tcf-papers.ts (+ PAPER_COUNT)
npm run generate:tcf-audio -- --paper=N   # Edge TTS → data/tcf-audio/pN/
npm run upload:tcf-audio:server -- --paper=N
```

`scripts/generate-tcf-audio.mts`, `scripts/upload-tcf-audio.mts` and
`scripts/upload-tcf-audio-server.sh` each list the listening papers explicitly —
add the new one to all three.

---

## 13. UI / design system

- **Tokens:** CSS variables in `globals.css` — `--bg-app`, `--accent`, `--text-primary`, etc.
- **Themes:** `data-theme="dark"` (default) | `"light"` — persisted in `localStorage` key `ailearn-theme`
- **No-flash:** Inline script in root layout sets theme before paint
- **Typography:** Inter (body) + Instrument Serif (display headings)
- **Layout pattern:** Frosted glass sidebar (`.glass-pane`), atmospheric mesh backdrop (`CanvasBackdrop`)
- **Styling approach:** Mostly inline `style={{}}` objects referencing CSS vars — not Tailwind utility classes in components
- **Command palette:** Cmd+K via `CommandPalette` — searches paths/lessons client-side

---

## 14. Database and Prisma

### Client setup (`src/lib/prisma.ts`)

Uses `@prisma/adapter-pg` with a `pg` Pool — required for Prisma 7 driver adapter pattern.

### Config (`prisma.config.ts`)

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations`
- Seed command points to missing `prisma/seed.ts`

### Running migrations

```bash
npx prisma migrate dev    # local
docker compose exec app npx prisma migrate deploy  # production container
```

### Docker database connection

`docker-compose.yml` connects to **host Postgres** via `host.docker.internal:5432` (not a bundled DB container). Default port mapping: host `3080` → container `3000`.

---

## 15. Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing |
| `NEXTAUTH_URL` | Yes | Auth callback base URL |
| `GEMINI_API_KEY` | For AI + TCF | Primary AI provider; TCF TTS/speaking |
| `OPENROUTER_KEY` | Optional | AI fallback |
| `ANTHROPIC_API_KEY` | Optional | AI tertiary fallback |
| `AUTH_TRUST_HOST` | Docker | Set to `"true"` in compose |

See `.env.local.example` for template.

---

## 16. Common development tasks

### Add a new learning path

1. Create lesson content file(s) in `src/lib/content/`
2. Add path entry to `PATHS` array in `paths.ts`
3. Add metadata to `META` in `learning-paths.ts`
4. (Optional) Create `src/components/path-objects/YourPath.tsx` and register in `path-objects/index.tsx`
5. Add flashcards to `flashcards.ts`, quiz questions to `quizzes.ts` if needed
6. No DB migration required

### Add a lesson to an existing path

1. Export content constant from domain file
2. Add lesson object to path's `lessons` array in `paths.ts`
3. Add flashcards/quizzes with matching `lessonSlug`

### Fix lesson progress not saving

- User must be logged in
- Check `/api/progress` response (401 = no session)
- Verify `lessonSlug` exists in `getLessonBySlug()`

### AI features returning 500

- Check at least one of `GEMINI_API_KEY`, `OPENROUTER_KEY`, `ANTHROPIC_API_KEY` is set
- Check Docker logs for `[AI Chat]` / `[AI Quiz]` provider fallback messages

### Build fails on Prisma

- `DATABASE_URL` needed at `prisma generate` time (Dockerfile uses dummy URL)
- Run `npx prisma generate` after schema changes

---

## 17. Known gaps, stubs, and stale files

| Item | Status |
|------|--------|
| `prisma/seed.ts` | Referenced in config, **missing** |
| `prisma/test-db.ts` | Queries **removed** `LearningPath` / `DailyChallenge` tables |
| `README.md` | Says Next.js 14; app uses **16** |
| `/notes` | UI placeholder; `Note` model unused |
| `/challenge` | Stubbed post content-out-of-DB migration |
| `gmat-prep` path | Content exists; no `PathObject` hero component |
| Flashcard SM-2 persistence | DB model exists; client doesn't POST reviews |
| Quiz attempt history | DB model exists; no write path |
| Achievements | Catalog only; no unlock engine |
| Streak / level calculation | Fields on User; not updated by app logic |
| Interview/chat history | Not persisted to `InterviewSession` / `ChatSession` |
| OAuth providers | Env placeholders only |
| Tests | No test suite in repo |
| `streamAIChat` | Implemented but tutor uses non-streaming `generateAIChat` |

---

## 18. File count snapshot

- ~159 TypeScript/TSX files under `src/`
- ~100 flashcard definitions
- ~91 static quiz questions
- 14 learning paths, ~92 lessons

---

## 19. Quick dependency graph

```
pages (app router)
  └─► src/lib/content/index.ts     (curriculum lookups)
  └─► src/lib/learning-paths.ts    (visual metadata)
  └─► src/auth.ts + prisma         (user state)
  └─► src/lib/ai.ts                (AI features)

LessonViewer
  └─► react-markdown
  └─► interactive components (diagrams, playgrounds, french, excel, java)
  └─► TutorChat (embedded slide-over)

Dashboard / Learn / Path pages
  └─► content + prisma.lessonProgress + getPathMeta
```

---

## 20. Conventions for agents

1. **Import content via** `@/lib/content` — never deep-import `paths.ts` from pages
2. **Minimize scope** — match existing inline-style patterns; don't refactor to Tailwind mid-task
3. **Slug stability** — treat lesson slugs as migration-sensitive identifiers
4. **Server vs client** — lesson pages split: server fetches progress, `LessonPageClient` / `LessonViewer` are client components
5. **Next.js 16** — read framework docs before using middleware, caching, or routing APIs
6. **No seed step** — content changes are code changes, not DB operations
7. **Guest-first** — features should degrade gracefully without login unless explicitly user-specific

---

*End of codebase reference. Update this file when making architectural changes.*
