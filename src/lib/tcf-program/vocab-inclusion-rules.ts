/**
 * TCF Canada core lexicon — scope (not limited to in-app mock papers).
 *
 * French has tens of thousands of lemmas in general dictionaries; TCF/NCLC 7 does
 * not require memorizing all of them. This product maintains a **high-probability
 * exam lexicon** sized for autonomous B2 prep (~3k lemmas + discourse items):
 *
 * Sources (priority order):
 * 1. FEI TCF skill descriptors — text types & domains (official)
 * 2. DELF B2 thematic lexique (Hachette FLE / same CEFR band as TCF items)
 * 3. FLELex-style CEFR grading — textbook frequency at A1–B2 (UCLouvain resource)
 * 4. In-app mock corpus — validation & gap-fill when papers 11–40 land (not the ceiling)
 *
 * Reject: IRCC pipeline English labels, duplicate EN headwords, ultra-rare C2-only jargon.
 */

export const VOCAB_INCLUSION_RULES_VERSION = "2026-10-02-v2";

export const TCF_LEXICON_TARGET_LEMMAS = 2500;

/** Approximate receptive vocabulary by CEFR (pedagogical estimates, not FEI policy). */
export const CEFR_RECEPTIVE_LEXICON_ESTIMATES = {
  A2: 1000,
  B1: 2000,
  B2: 3500,
  note: "TCF core deck targets high-probability subset of B1–B2 thematic + discourse lemmas.",
} as const;
