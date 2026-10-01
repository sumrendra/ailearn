/**
 * Core TCF lexique inclusion gates (authoring policy).
 * A new lemma must pass at least one:
 * 1. Appears in app mock corpus (reading/listening) or FEI sample-style usage
 * 2. Discourse / connector item required for Band C or EE/EO production
 * 3. Collocation anchor in a FEI theme with an exam-shaped example sentence (no copied leaked tests)
 *
 * Reject: IRCC/Express Entry/CRS/NCLC admin English headwords, duplicate EN keys, ultra-rare C2 without corpus hit.
 */

export const VOCAB_INCLUSION_RULES_VERSION = "2026-10-02";
