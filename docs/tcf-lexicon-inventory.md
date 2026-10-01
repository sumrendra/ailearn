# TCF core lexicon inventory (AILearn)

**As of October 2026.** This is what is in the app — not limited to the 10 in-repo mock papers.

## Scope

| Concept | Size | Role |
|---------|------|------|
| General French dictionary | ~50k+ lemmas | Not flashcard-able |
| CEFR B2 receptive estimate | ~3k–3.7k lemmas | Full proficiency band |
| **AILearn core path (`EXAM_LEXIQUE_FLASHCARDS`)** | **~2,500** cards (see live count in app) | Curated TCF/NCLC 7 lexicon |
| Product target | **2,500** | `TCF_LEXICON_TARGET_LEMMAS` |

**NCLC 7** still requires **exam scores in four skills**; this deck is the structured lexicon spine, plus lessons, mocks, tutor, grammar.

## How lemmas are sourced (priority)

1. **FEI TCF** — text types & domains (announcements, work, society, argumentation)
2. **DELF B2 thematic lexique** (Hachette FLE — same CEFR band as most TCF items)
3. **FLE / textbook frequency logic** (FLELex methodology — CEFR-graded receptive lists)
4. **In-app mocks (p1–p10)** — gap mining only (`scripts/mine-tcf-vocab-candidates.mts`), not the ceiling

## Files merged into core (bands A → B → C)

| Layer | Files | Purpose |
|-------|--------|---------|
| Base | `tcf-exam-lexique.ts` (`BAND_A/B/C`) | Original exam-shaped seed |
| Batch 2–5 | `tcf-exam-lexique-batch2.ts` … `batch5.ts` | Thematic expansion, IRCC cull |
| Batch 6–7 | `batch6.ts`, `batch7.ts` | Mock-aligned + theme gap fill |
| **Master A/B/C** | `tcf-exam-lexique-master-a/b/c.ts` | **+1,750 external-theme lemmas** (A1–B2 + discourse) |

Merge rules: one English headword globally; band A wins over B over C.

## Optional (not core path)

| Deck | Count | Notes |
|------|------:|-------|
| Context packs | 9 packs × ~5–6 words | In `TCF_CONTEXT_PACKS` |
| Theme decks | 10 × 15 | `tcf-vocab-flashcards.ts` — optional browse |

## Tooling

```bash
npx tsx scripts/vocab-audit.mts              # dupes + banned IRCC patterns
npx tsx scripts/analyze-tcf-vocab-coverage.mts # mock overlap (sanity check)
npx tsx scripts/mine-tcf-vocab-candidates.mts  # when papers 11–40 arrive
```

## When you add papers 11–40

Run mining; add lemmas that pass `vocab-inclusion-rules.ts`. Do **not** replace master lists — extend them.
