# AILearn Redesign — Master Brief (Wave Plan)

> The brief produced by `/impeccable shape` for the full-platform redesign. Confirmed by the project owner before execution begins. Update only when the wave plan or visual direction changes; per-surface briefs are separate.

## Confirmation log

- **Aesthetic lane:** Futuristic / generative (Midjourney, OpenAI, ai.meta.com, vercel.com hero)
- **Color strategy:** Drenched dark
- **Scope:** All surfaces, executed in waves
- **Per-path SVG hero objects:** Yes — ship them
- **Animated grain overlay:** Yes — add it
- **Confirmation:** "Confirmed — proceed with Wave 1"

See PRODUCT.md for register, audience, anchor refs, anti-refs. See DESIGN.md for tokens, type, motion, surfaces, iconography.

## Wave plan

| Wave | Scope | Deliverables | Definition of done |
|---|---|---|---|
| **1. Foundation** | Dark tokens, atmospheric layer (mesh + grain), frosted shell, command palette, login/signup | New dark token set in `globals.css`; `<CanvasBackdrop />` component mounted in root layout; `.glass-pane`, `.canvas-mesh`, `.canvas-grain`, `.glow-ring`, `.mono-overline`, `.hairline-*` utility classes; Sidebar + IconRail + Topbar redesigned as frosted chrome; CommandPalette redesigned with glow + mono input; Login + Signup pages redesigned around the canvas mesh | Every page renders dark by default; topbar/sidebar feel like glass on void; command palette glows; login is a hero moment |
| **2. Entry surfaces** | `/learn` hero + path cards + 8 SVG path objects + per-path mesh tint; `/dashboard` reframed as "studio" with mono numerals | `LearnHero` redesigned (asymmetric, generative SVG object on right); `PathCard` redesigned (glow-ring hover, path-color dot, tinted mesh on hover); 8 hand-authored SVG path objects in `src/components/path-objects/`; `DashboardStudio` component replacing greeting | The first surface a user sees matches the brief's anchor references; per-path identity is ambient |
| **3. Reading surface** | `/lessons/[slug]` re-tuned for dark canvas; TOC rail; code-block artifact treatment; blockquote refinement | LessonViewer scroll container uses canvas mesh; TOC sticks as rail; code blocks get header strip + copy/run; chapter h1 retuned for dark | Lesson reader is the calmest, most reading-friendly surface in the product |
| **4. Practice cluster** | `/quiz`, `/flashcards`, `/tutor`, `/interview` | Per-surface shape pass; redesign Quiz card UI, Flashcards deck UI, Tutor chat surface, Interview practice surface | Practice surfaces match the rest of the platform |

## Wave 1 — Foundation: detailed scope

This file is the input to the in-flight Wave 1 execution.

### 1.1 Tokens (globals.css)

Rewrite the `:root` and `[data-theme="dark"]` blocks to match DESIGN.md. Key shifts:

- Default theme: change from light to dark (`:root` carries the dark values; `[data-theme="light"]` provides the opt-in alternative).
- Deeper canvas: `--bg-app` goes to `hsl(220 20% 4%)` (was 99%).
- Add `--bg-overlay`, `--accent-soft`, `--accent-glow`, `--mesh-violet/teal/pink/amber` (raw colors, not pre-alpha'd).
- Hairline highlight tokens: `--hairline-top`, `--hairline-bottom`.
- Frosted glass tokens: `--glass-bg`, `--glass-border`, `--glass-blur` re-tuned for the dark canvas.

### 1.2 Atmospheric layer

Two new utility classes + one component:

- `.canvas-mesh` — fixed full-viewport gradient mesh, 40s drift, blurred. Tints per path via `--mesh-tint` CSS variable.
- `.canvas-grain` — fixed grain overlay using SVG `feTurbulence` data-URL, animated by `background-position`.
- `<CanvasBackdrop tint?={pathColor} />` — React component that mounts both layers; accepts an optional tint to bias the mesh toward a path color.

Mounted in `src/app/(app)/layout.tsx` so every authenticated page gets the backdrop. Auth pages mount it separately.

### 1.3 Frosted shell

- `Sidebar` + `IconRail` get `.glass-pane` treatment with hairline highlight along the inner edge.
- `Topbar` gets scroll-aware opacity (CSS custom property `--scroll-y` driven by JS).
- Both components recede during reading by reducing opacity when `data-reading-mode="true"` on a parent (lesson reader sets this).

### 1.4 Command palette

- Cmd+K opens. 640px wide, center-screen.
- `.glass-pane` background with `box-shadow: 0 0 80px var(--accent-glow)` for the ambient glow.
- Input uses `font-mono`, no border, large size.
- Results grouped by section with mono overlines ("Lessons", "Paths", "Settings").
- Keyboard navigation: arrow keys + Enter, Esc dismiss.

### 1.5 Login / Signup

- Full-viewport canvas mesh background, hero-level.
- Card centered, 420px wide, `.glass-pane` treatment, hairline highlight.
- Brand mark in Instrument Serif at large size above the form.
- Inputs are sunken (`--bg-sunken`) with hairline borders.
- Primary button is `var(--accent)` with subtle glow ring on hover.

## Definition of done — Wave 1

Wave 1 ships when:

1. Every page in the app renders dark by default. Light mode opt-in still works but is no longer the new-user default.
2. Atmospheric layer (mesh + grain) is visible on at least the lesson reader, /learn, /dashboard, login.
3. Sidebar, IconRail, Topbar look like frosted glass on the canvas.
4. Command palette opens with Cmd+K, glows, navigates by keyboard.
5. Login + Signup feel like the front door of a premium product.
6. `npx tsc --noEmit` clean. `npx next build` clean. No console errors.
7. PRODUCT.md, DESIGN.md, BRIEF.md committed at project root.
8. A single PR description summarizes what Wave 1 changed, with screenshots if reasonable.

## What's NOT in scope for Wave 1

- Per-path SVG hero objects (Wave 2)
- LearnHero / PathCard / DashboardStudio redesign (Wave 2)
- LessonViewer content treatment (Wave 3 — Wave 1 only changes the backdrop it sits on)
- Practice cluster (Wave 4)
- Migrating inline styles to Tailwind classes (separate effort, not part of redesign)

## Open follow-ups

- Decide light-mode aesthetic in Wave 2 once we see dark in production.
- Decide whether to add per-path generative motion (orbiting particles for ML paths, e.g.) — Wave 2 finding.
- Verify dark canvas contrast on real LCD vs OLED via user testing during Wave 1 review.
