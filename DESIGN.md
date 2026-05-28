# AILearn — DESIGN.md

> Visual design language. Loaded by every `/impeccable` command. Source of truth for tokens, type, motion, surfaces. Update when the system changes, not for one-off component tweaks.

## North-star aesthetic

**Drenched dark, atmospheric, premium technical.** The canvas is the deepest near-black we can use without losing contrast; surfaces emerge from it in four layered elevations. A slow, almost-imperceptible gradient mesh drifts behind everything. A subtle animated grain layer sits above the mesh. Hairline borders, glow accents, frosted chrome. The product looks like it's lit by a single floor lamp in a dim room — not like a fluorescent classroom.

## Color system

All colors are HSL CSS custom properties. Light theme is a deliberate alternate, not a default.

### Canvas (dark — default)

| Token | Value | Purpose |
|---|---|---|
| `--bg-app` | `hsl(220 20% 4%)` | Deepest void. The stage. |
| `--bg-sunken` | `hsl(220 22% 3%)` | Inputs, code blocks, recessed surfaces |
| `--bg-surface` | `hsl(220 17% 7%)` | Primary surfaces |
| `--bg-elevated` | `hsl(220 16% 10%)` | Cards, modals |
| `--bg-overlay` | `hsl(220 15% 13%)` | Hover states, popovers |

### Text (dark)

| Token | Value | Purpose |
|---|---|---|
| `--text-primary` | `hsl(220 15% 96%)` | Body, headings |
| `--text-secondary` | `hsl(220 12% 72%)` | Subheadings, descriptions |
| `--text-tertiary` | `hsl(220 10% 52%)` | Metadata, captions |
| `--text-muted` | `hsl(220 8% 38%)` | Disabled, placeholder |

### Borders (dark — hairlines)

| Token | Value | Purpose |
|---|---|---|
| `--border-subtle` | `hsl(220 14% 14%)` | Barely-visible structure |
| `--border-default` | `hsl(220 14% 20%)` | Standard separation |
| `--border-strong` | `hsl(220 12% 32%)` | Emphasized borders, focus rings |

### Accent — violet

| Token | Value | Purpose |
|---|---|---|
| `--accent` | `hsl(258 92% 72%)` | Primary actions, links, brand |
| `--accent-hover` | `hsl(258 92% 76%)` | Hover state |
| `--accent-soft` | `hsl(258 60% 16%)` | Filled backgrounds, tags |
| `--accent-text` | `hsl(258 80% 80%)` | Inline text accent |
| `--accent-glow` | `hsl(258 100% 65% / 0.35)` | Glow rings, ambient lighting |

### Mesh palette (the gradient backdrop)

| Token | Value | Used in |
|---|---|---|
| `--mesh-violet` | `hsl(258 100% 60%)` | Primary mesh blob |
| `--mesh-teal` | `hsl(180 100% 50%)` | Secondary mesh blob |
| `--mesh-pink` | `hsl(330 100% 60%)` | Tertiary mesh blob (sparingly) |
| `--mesh-amber` | `hsl(40 100% 55%)` | Quaternary, warmth balance |

### Path identity (ambient only)

The 13 course paths each have their own color. In the redesign these colors are **ambient and indicative**, NEVER primary action backgrounds. Use them on:

- Path badge pill in topbar
- Progress fill in the slide-over
- Small dot indicators next to lesson titles
- The per-path tint applied to the gradient mesh on path-specific pages
- Hover glow color on a path's card on `/learn`

DO NOT use path colors on: primary buttons, "Mark complete" CTAs, links, accent text. Those are always `--accent` (violet).

### Semantic

| Token | Value |
|---|---|
| `--success` | `hsl(152 60% 60%)` |
| `--warning` | `hsl(30 95% 60%)` |
| `--danger` | `hsl(0 75% 62%)` |
| `--info` | `hsl(217 91% 70%)` |

## Typography

Three-font system. Loaded via `next/font/google`. Variable bindings exposed as CSS custom properties.

| Family | Use | Loaded as |
|---|---|---|
| **Inter** | Body, UI, prose body, labels | `--font-sans` |
| **Instrument Serif** | Chapter headings (lesson `<h1>`), hero display text (`.display-*` classes), editorial headings | `--font-display` |
| **JetBrains Mono** | Section overlines (small caps), code, numbers in metrics/dashboards, technical labels | `--font-mono` |

### Type scale

- Hero (`.display-xl`): `clamp(48px, 6vw, 84px) / 400 / -0.02em / Instrument Serif`
- Section head (`.display-lg`): `clamp(36px, 4.5vw, 56px) / 400 / -0.015em / Instrument Serif`
- Sub-section (`.display-md`): `clamp(28px, 3vw, 36px) / 400 / -0.01em / Instrument Serif`
- Card title (`.display-sm`): `22px / 700 / -0.015em / Inter`
- Body lead: `17px / 500 / 1.6 / Inter`
- Body: `15px / 400 / 1.6 / Inter`
- Caption: `12.5px / 500 / 1.5 / Inter`
- Overline (`.mono-overline`): `10.5px / 600 / 0.18em / uppercase / JetBrains Mono`
- Code inline: `0.88em / 500 / JetBrains Mono`

### Hierarchy rules

1. Display serif on chapter/hero/section heads ONLY. Markdown body h2-h4 stay Inter.
2. Mono on overlines and numbers ONLY. Never running text.
3. Never use `font-weight: 700+` on Instrument Serif (single-weight face; browser synth-bold looks terrible).

## Surfaces & elevation

Five surface levels from deepest to highest:

1. **Canvas** (`--bg-app`) — the void
2. **Sunken** (`--bg-sunken`) — DEEPER than canvas; inputs and code feel recessed
3. **Surface** (`--bg-surface`) — primary
4. **Elevated** (`--bg-elevated`) — cards, modals
5. **Overlay** (`--bg-overlay`) — hover states, popovers

Elevation is communicated by background hue, NOT by box-shadows. Shadows are reserved for atmospheric depth (modal drops, hero glow) — they are deep, soft, and rare. Hairline highlight (1px solid `hsl(0 0% 100% / 0.04)` along the top of elevated surfaces) replaces traditional drop-shadow elevation.

## Atmosphere

Two always-on layers behind every page, mounted at the root layout:

### Canvas mesh (`.canvas-mesh`)

Fixed-position SVG/CSS gradient mesh, `position: fixed; inset: 0; z-index: -2`. Four radial gradients (violet, teal, pink, amber) at low opacity, blurred 80px, drifting on a 40-second loop via `@keyframes mesh-drift`. On path-specific pages, the dominant gradient tints toward the path's color. Pauses respecting `prefers-reduced-motion`.

### Grain overlay (`.canvas-grain`)

Fixed-position grain texture, `position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0.04`. CSS-only: an SVG filter `<feTurbulence>` data-URL. Animates very slowly via `background-position` over 8 seconds. Disabled when `prefers-reduced-motion`.

## Chrome — the frosted shell

### Topbar / Sidebar

`.glass-pane` utility. Background: `hsl(220 17% 7% / 0.6)`; backdrop-filter: `saturate(180%) blur(16px)`; border: `1px solid hsl(0 0% 100% / 0.06)`. Sits ABOVE atmospheric layers but BELOW content modals.

Topbar scroll behavior: opacity transitions from `0` at scrollY=0 (canvas shows through fully) to `0.85` at scrollY=120 (committed frost). Implemented via CSS `var(--scroll-y)` + JS.

### Command palette

Center-screen overlay. `glass-pane` background. 640px wide. Subtle violet glow around the panel (`box-shadow: 0 0 80px var(--accent-glow)`). Mono input. Section overlines.

## States

- **Hover (cards):** glow ring via `outline: 1px solid var(--accent); outline-offset: -1px;` + 200ms `box-shadow: 0 0 60px var(--accent-glow)`. NO transform (no translate, no scale).
- **Focus-visible:** `outline: 2px solid var(--accent); outline-offset: 3px;` — never replaces hover.
- **Active:** brief 80ms inset shadow.
- **Loading:** skeleton with shimmer on `--bg-overlay`.
- **Empty:** real written copy + next-action button, never "Nothing to show yet."

## Motion budget

| Type | Duration | Easing | Use |
|---|---|---|---|
| Atmospheric (mesh, grain) | 8s–40s | `ease-in-out` | Always-on, slow, ignorable |
| Functional (state change) | 150–250ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Hover, focus, modal open |
| Brief (active, click) | 80ms | `ease-out` | Press feedback |
| Page transition | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Route changes |

All atmospheric layers respect `prefers-reduced-motion`.

## Iconography

- **Lucide React** is the canonical icon set. Already imported.
- Sizing: 14px (inline), 16px (button), 20px (card), 24px+ (hero).
- Stroke width: 2 (default), 2.5 (emphasis). Never 1.5 (feels fragile on dark canvas).
- Path-color: `currentColor` so icons inherit text color. Override only for semantic state (`var(--success)` on a check).
- NO emoji as icons. NO mixing Lucide with another set.

## Spacing & radii

Use the existing scale (`--space-1` through `--space-16`, `--radius-xs` through `--radius-full`). No hardcoded pixels in new code; if a value isn't in the scale, the scale needs to grow, not the component.

## Per-surface contracts

### Lesson reader (`/lessons/[slug]`)
- Reading column max-width 720px, centered
- TOC + diagram float as right rail, 280px wide, sticks under topbar
- Chapter `<h1>` in Instrument Serif at `clamp(40px, 5vw, 64px)`, weight 400, eased tracking
- Code blocks are surfaces with their own elevation, header strip, copy/run buttons
- Reading-progress bar at top, 2px, violet, ALWAYS-visible

### Learn (`/learn`)
- Hero: asymmetric (left copy block, right generative SVG path-object)
- Path cards: large, single-elevation, glow-ring hover, path color as small dot + tinted mesh on hover
- Section overlines in mono (`Foundation` / `Specialization` / `Advanced`)

### Dashboard (`/dashboard`)
- "Studio" framing — recent sessions, current streak, next lesson queued
- Stats use mono numerals + faint hairline borders
- No greeting card; the user opened the app, they know who they are

### Quiz / Flashcards / Tutor / Interview
- Documented per Wave 4 shape pass
