# AILearn — PRODUCT.md

> Strategic design context. Loaded by every `/impeccable` command. Update when the product changes; don't update for surface tweaks.

## Register

**Product.** AILearn is an application surface — app shell, content navigation, in-session reading, practice tools. The marketing/landing presence is minimal by design; the product *is* the experience. When a task touches a marketing-adjacent surface (the `/learn` hero, the `/dashboard` greeting), treat it as a product surface with editorial polish, not as a campaign page.

## Users

Self-directed adult learners with a technical background. Software engineers, ML practitioners, career-switchers building toward technical roles. They are not students in a classroom; they are professionals carving out 20-60 minute focused sessions in evenings and on weekends.

**State of mind on most visits:** focused, slightly tired (sessions are after-hours), motivated by a specific gap they want to close ("I need to actually understand transformers" or "I have a SQL interview Thursday"). Not exploring leisurely. Not cheerful. Calm intent.

**They do NOT want:**
- Cheerful gamification that infantilizes them
- Stock photos of smiling people at laptops
- "Congratulations on completing your first lesson!" energy
- Linear/forced progression that ignores their existing knowledge

**They DO want:**
- A serious tool that respects their time
- Premium feel that signals "this is worth my evening"
- Clear, opinionated content (not "here are 5 perspectives on…")
- Atmosphere that supports long-form deep work

## Purpose

Help technical adults actually learn the things they're trying to learn — LLMs, RAG, agents, system design, SQL, French, Java — through interactive lessons, spaced practice, and an AI tutor that knows the curriculum. The product wins when a learner finishes a 40-minute session feeling they understand something they didn't 40 minutes ago.

## Brand personality (3 words)

**Quiet · technical · premium.**

- *Quiet*: doesn't shout for attention, doesn't gamify, doesn't celebrate. Confident enough to be calm.
- *Technical*: speaks the language of the audience. Doesn't dumb down. Code, math, diagrams are first-class citizens.
- *Premium*: feels expensive but not ostentatious. The way a good piece of software feels (Linear, Notion, Things), not the way a marketing site feels.

## Anchor references

The look and feel should sit in conversation with:

1. **vercel.com** — dark canvas, gradient mesh, sharp hairlines, premium silence
2. **OpenAI Platform docs + playground** — dense technical surfaces, controlled violet/teal accents, generous code real estate
3. **midjourney.com (community / explore)** — image-led depth, ambient glow as lighting, layered translucency
4. **Arc browser (arc.net)** — for the chrome treatment (rail, command palette, frosted surfaces)
5. **Linear** — for product polish standards (motion, state coverage, keyboard-first)

## Anti-references

The look and feel should explicitly NOT resemble:

- **Skillshare, Udemy, Coursera** — cheerful, busy, course-marketplace aesthetic
- **Khan Academy** — well-meaning but visually loud, designed for children
- **Default v0 / shadcn templates** — generic SaaS purple, indistinguishable from a thousand other AI apps
- **Duolingo** — confetti, mascots, anthropomorphized friction

If a redesigned surface feels closer to any of the anti-references than to the anchors, the design is wrong.

## Strategic principles

1. **Reading is a first-class state.** Most other learning platforms treat lessons as content that lives between navigation. AILearn treats the lesson as the destination; chrome recedes during reading.

2. **Path identity is ambient, not chrome.** Each of the 13 courses has its own color, but those colors live in backgrounds, progress fills, and small dots — never on primary actions. "Mark complete" is always violet across all 13 paths.

3. **Don't waste motion.** Atmospheric motion (mesh drift, grain shimmer) runs slowly and forever. Functional motion (state changes) is sharp and brief. No animation that exists only to demonstrate that we know how to animate.

4. **Keyboard before mouse.** A power learner will use AILearn from a keyboard. Every primary action has a shortcut. Every modal dismisses with Esc. The help overlay is one keystroke (`?`) away.

5. **Optional difficulty.** The product offers no congratulations a learner didn't earn, no "great job!" copy, no celebratory copy generally. XP, streaks, and gamification exist but are presented as facts (3,400 XP · 7-day streak) not as cheerleading.

## Accessibility commitments

- WCAG AA on all primary surfaces (contrast, keyboard, semantics)
- Respect `prefers-reduced-motion` for all atmospheric layers
- Respect `prefers-color-scheme: light` as an opt-in (dark is the default, but light is a fully designed alternate, not a degraded one)
- Touch targets ≥ 40px on interactive elements
- Focus-visible never hidden behind hover styles

## Tech context

Next.js 16 / React 19 / TypeScript / Tailwind v4 / Prisma 7 / NextAuth v5. Inline styles dominate (~1500 occurrences) but CSS custom-property tokens are well-structured. Designs target inline-styles-with-tokens, NOT a Tailwind class refactor (that's a separate effort).
