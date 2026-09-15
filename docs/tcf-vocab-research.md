# TCF Canada vocabulary research (B2 vs exam-priority)

**As of September 2026.** This doc separates three layers learners confuse:

1. **NCLC / CLB 7** — an immigration **score band**, not a word list.
2. **CEFR B2** — broad proficiency (~thousands of lemmas in real life).
3. **TCF Canada exam-priority lexique** — what actually pays off on **this** test’s recurring themes and formats.

---

## 1. What official sources say

### NCLC 7 / CLB 7 (IRCC + TCF scores)

- **No minimum vocabulary count** is published by IRCC or France Éducation international (FEI).
- NCLC 7 is reached with **minimum TCF Canada scores in each skill** (not averaged): listening ≥458, reading ≥453, writing ≥10/20, speaking ≥10/20 on the current IRCC conversion tables.
- Sources: [IRCC language requirements](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements/language-testing.html), FEI [TCF Canada](https://www.france-education-international.fr/test/tcf-canada?langue=en).

### CEFR B2 (general French)

- FEI **does not publish a fixed B2 word list** for DELF/TCF; descriptors require **broad, active vocabulary** adapted to topic, plus connectors and argumentation (see DELF B2 candidate manual, FEI DELF B2 page).
- Research and courseware **estimates** for B2 French vary by counting method, commonly **~2,000–4,000 lemmas** (Meara & Milton band ~3,250–3,750 for B2 in several languages) up to **~4,000–5,000** with strong thematic control in prep materials — **not** an exam checklist.

### TCF Canada content (FEI candidate manual / test page)

The test assesses **general French** through varied **concrete and abstract** material, including:

| Skill | Typical material (paraphrased from FEI) |
|-------|----------------------------------------|
| **Listening** | Conversations, interviews, phone calls, announcements, radio/TV on current affairs, work/personal topics, discourse at normal speed |
| **Reading** | Ads, brochures, menus/timetables, correspondence, workplace/everyday texts, opinion articles, longer factual/literary/specialist passages |
| **Writing / Speaking** | Structured argument, opinion, narrative — **lexical range and connectors** scored explicitly |

**Implication:** TCF rewards **thematic clusters + discourse words** (connectors, opinion phrases, collocations), not random rare lemmas.

---

## 2. What prep literature converges on (non-official)

Several TCF prep providers (not FEI) converge on **~8–10 recurring domains**:

| Priority | Domain | Typical on TCF? |
|----------|--------|----------------|
| High | Work & employment | Very frequent (Q11–29 band) |
| High | Housing & daily life | Very frequent |
| High | Education & training | Frequent |
| High | Health & wellbeing | Frequent |
| High | Environment & climate | Frequent in reading/writing |
| Medium | Technology & digital | Frequent |
| Medium | Media, society, citizenship (general) | Frequent |
| Medium | Culture, leisure, transport | Frequent in A/B items |
| Medium | Economy & consumption | Frequent |
| Lower | Niche legal/immigration admin English labels | **Poor ROI** for TCF (removed from our core path) |

Some blogs propose **~600 “strategic” lemmas** covering a large share of **their** item banks; that number is **marketing heuristic**, not FEI policy. Our app target of **1,000 exam-priority lemmas** is a **content product goal**: deeper than a minimal deck, still far smaller than full B2.

---

## 3. B2 words you can skip for TCF-only prep

Examples of **B2/C1 vocabulary with low TCF ROI** if they never appear in exam-style themes:

- Highly specialized academic fields (e.g. epistemology jargon **unless** practiced for Band C reading style).
- Rare literary/archaic lexis not used in brochures, news, or workplace French.
- **Immigration pipeline English headwords** (Express Entry, CRS, proof of funds) — French may appear in life in Canada, but English admin labels are not what TCF tests.
- Ultra-niche labour-law terms (grievance, constructive dismissal) — occasional in society texts; **deprioritized** in our core list.

**Keep:** connectors, opinion frames, high-frequency society/environment/work/housing/health collocations, **Band C nuance** words that match FEI “abstract subjects” reading descriptors.

---

## 4. This codebase today

| Metric | Value |
|--------|------:|
| Core lemmas in app | **528** (bands A/B/C merged) |
| Product target | **1,000** exam-priority |
| Gap to target | **472** to author |
| Optional packs + theme decks | +200 (separate from core path) |
| Mock papers in repo | Reading/listening **p1–p10** (partial corpus) |

Run coverage against mocks:

```bash
npx tsx scripts/analyze-tcf-vocab-coverage.mts
```

**Important:** Mock token frequency is dominated by grammar words (`pour`, `dans`, …). The script surfaces **content lemmas** in mocks that are **not** yet in the core list — useful for **batch authoring**, not for claiming “85% of all French.”

---

## 5. Recommended authoring order (next 472 words)

1. **Mine mocks** — add lemmas with high frequency in `tcf-reading*.ts` / `tcf-listening*.ts` not already in core (see analysis script output).
2. **Fill FEI theme gaps** — under-tagged topics in `vocab-core-topics.ts` (e.g. technology, media-society) using collocations from Radio-Canada / official FEI **sample exercises**, not random B2 lists.
3. **Band balance** — maintain A (forms/schedules), B (life/work/society), C (connectors + abstract nouns) consistent with question difficulty bands.
4. **Do not** import entire third-party “1,673 B2 words” lists wholesale — filter each row for **TCF theme + production usefulness**.

---

## 6. How learners should think about “enough words”

| Goal | Rough size | Role of AILearn core deck |
|------|------------|---------------------------|
| Pass NCLC 7 | **Scores**, not word count | Deck accelerates **thematic recognition** in CO/CE + phrases for EE/EO |
| B2 in the wild | **~3k–4k+** active lemmas | Deck is **subset**; mocks, reading, tutor, grammar tracks supply the rest |
| TCF-only efficiency | **~600–1,200** high-yield lemmas + connectors | Our **1,000 target** sits in this band |

---

## References

- France Éducation international — [TCF Canada](https://www.france-education-international.fr/test/tcf-canada?langue=en), [TCF candidate manual (PDF)](https://www.france-education-international.fr/document/manuelcandidattoutes20dc3a9clinaisonsi)
- IRCC — [Language test equivalency charts](https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/standard-requirements/language-requirements/test-equivalency-charts.html)
- CEFR vocabulary size discussions — Meara & Milton bands (summarized in language-learning literature); FEI **Inventaire linguistique** for CEFR descriptors (not a flashcard list)
