import type { GrammarTopic } from "./types";

/** 56 grammar topics for mastery map — ids referenced in unit metadata */
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // A1
  { id: "sounds-basic", label: "French sounds & spelling", cefr: "A0", category: "other", unitSlug: "tcf-a02-sounds", prerequisiteIds: [] },
  { id: "greetings", label: "Greetings & introductions", cefr: "A1", category: "other", unitSlug: "tcf-a03-greetings", prerequisiteIds: ["sounds-basic"] },
  { id: "numbers", label: "Numbers & quantities", cefr: "A1", category: "other", unitSlug: "tcf-a04-numbers", prerequisiteIds: ["greetings"] },
  { id: "tu-vs-vous", label: "Tu vs vous", cefr: "A1", category: "other", unitSlug: "tcf-a05-questions", prerequisiteIds: ["greetings"] },
  { id: "articles-def", label: "Articles (le, la, un, du)", cefr: "A1", category: "syntax", unitSlug: "tcf-a06-articles", prerequisiteIds: ["greetings"] },
  { id: "present-etre", label: "Present: être & avoir", cefr: "A1", category: "tenses", unitSlug: "tcf-a07-etre-avoir", prerequisiteIds: ["articles-def"] },
  { id: "present-er", label: "Present: -er verbs", cefr: "A1", category: "tenses", unitSlug: "tcf-a08-er-verbs", prerequisiteIds: ["present-etre"] },
  { id: "negation-basic", label: "Negation (ne…pas)", cefr: "A1", category: "syntax", unitSlug: "tcf-a09-negation", prerequisiteIds: ["present-er"] },
  { id: "questions-basic", label: "Questions (est-ce que)", cefr: "A1", category: "syntax", unitSlug: "tcf-a09-negation", prerequisiteIds: ["negation-basic"] },
  { id: "adjectives-agreement", label: "Adjective agreement", cefr: "A1", category: "syntax", unitSlug: "tcf-a10-adjectives", prerequisiteIds: ["present-er"] },
  { id: "prepositions-place", label: "Prepositions (place)", cefr: "A1", category: "syntax", unitSlug: "tcf-a12-directions", prerequisiteIds: ["adjectives-agreement"] },
  { id: "time-expressions", label: "Time & dates", cefr: "A1", category: "other", unitSlug: "tcf-a13-time-plans", prerequisiteIds: ["numbers"] },
  // A2
  { id: "futur-proche", label: "Futur proche", cefr: "A2", category: "tenses", unitSlug: "tcf-a14-futur-proche", prerequisiteIds: ["present-er"] },
  { id: "passe-compose", label: "Passé composé", cefr: "A2", category: "tenses", unitSlug: "tcf-a15-passe-compose", prerequisiteIds: ["present-etre"] },
  { id: "imparfait", label: "Imparfait", cefr: "A2", category: "tenses", unitSlug: "tcf-a16-imparfait", prerequisiteIds: ["passe-compose"] },
  { id: "pc-vs-imp", label: "PC vs imparfait", cefr: "A2", category: "tenses", unitSlug: "tcf-b01-pc-vs-imp", prerequisiteIds: ["imparfait"] },
  { id: "pronouns-cod", label: "COD pronouns (le, la, les)", cefr: "A2", category: "pronouns", unitSlug: "tcf-a18-pronouns-cod", prerequisiteIds: ["passe-compose"] },
  { id: "reflexive", label: "Reflexive verbs", cefr: "A2", category: "tenses", unitSlug: "tcf-a19-reflexive", prerequisiteIds: ["present-er"] },
  { id: "futur-simple", label: "Futur simple", cefr: "A2", category: "tenses", unitSlug: "tcf-b02-futur-simple", prerequisiteIds: ["futur-proche"] },
  { id: "conditional-present", label: "Conditionnel présent", cefr: "A2", category: "mood", unitSlug: "tcf-b03-conditional", prerequisiteIds: ["futur-simple"] },
  // B1
  { id: "si-clauses", label: "Si clauses (3 patterns)", cefr: "B1", category: "syntax", unitSlug: "tcf-b04-si-clauses", prerequisiteIds: ["conditional-present", "imparfait"] },
  { id: "pronouns-coi", label: "COI pronouns (lui, leur)", cefr: "B1", category: "pronouns", unitSlug: "tcf-b05-pronouns-coi", prerequisiteIds: ["pronouns-cod"] },
  { id: "pronouns-y-en", label: "Y & en", cefr: "B1", category: "pronouns", unitSlug: "tcf-b06-y-en", prerequisiteIds: ["pronouns-coi"] },
  { id: "relative-qui-que", label: "Relative pronouns (qui, que)", cefr: "B1", category: "pronouns", unitSlug: "tcf-b07-relative", prerequisiteIds: ["pronouns-cod"] },
  { id: "comparatives", label: "Comparatives & superlatives", cefr: "B1", category: "syntax", unitSlug: "tcf-b08-comparatives", prerequisiteIds: ["adjectives-agreement"] },
  { id: "plus-que-parfait", label: "Plus-que-parfait", cefr: "B1", category: "tenses", unitSlug: "tcf-b09-pqp", prerequisiteIds: ["passe-compose", "imparfait"] },
  { id: "connectors-b1", label: "Logical connectors", cefr: "B1", category: "syntax", unitSlug: "tcf-b10-connectors", prerequisiteIds: ["pc-vs-imp"] },
  { id: "subjunctive-present", label: "Subjonctif présent", cefr: "B1", category: "mood", unitSlug: "tcf-c01-subjunctive", prerequisiteIds: ["connectors-b1"] },
  // B2
  { id: "pronoun-order", label: "Pronoun order rule", cefr: "B2", category: "pronouns", unitSlug: "tcf-c02-pronoun-order", prerequisiteIds: ["pronouns-y-en", "pronouns-coi"] },
  { id: "conditional-past", label: "Conditionnel passé", cefr: "B2", category: "mood", unitSlug: "tcf-c03-conditional-past", prerequisiteIds: ["conditional-present", "plus-que-parfait"] },
  { id: "participle-agreement", label: "Past participle agreement", cefr: "B2", category: "syntax", unitSlug: "tcf-c04-participle-agreement", prerequisiteIds: ["passe-compose"] },
  { id: "relative-advanced", label: "Relative (dont, lequel)", cefr: "B2", category: "pronouns", unitSlug: "tcf-c05-relative-advanced", prerequisiteIds: ["relative-qui-que"] },
  { id: "formal-register", label: "Formal register & letters", cefr: "B2", category: "other", unitSlug: "tcf-c06-formal", prerequisiteIds: ["conditional-present"] },
  { id: "argumentation", label: "Argumentation connectors", cefr: "B2", category: "syntax", unitSlug: "tcf-c07-argumentation", prerequisiteIds: ["connectors-b1"] },
  { id: "subjunctive-traps", label: "Subjunctive vs indicative", cefr: "B2", category: "mood", unitSlug: "tcf-c08-subjunctive-traps", prerequisiteIds: ["subjunctive-present"] },
  { id: "discourse-markers", label: "Opposition & concession", cefr: "B2", category: "syntax", unitSlug: "tcf-c09-discourse", prerequisiteIds: ["argumentation"] },
  { id: "futur-anterieur", label: "Futur antérieur", cefr: "B2", category: "tenses", unitSlug: "tcf-c17-futur-anterieur", prerequisiteIds: ["futur-simple", "passe-compose"] },
  { id: "concordance", label: "Concordance des temps", cefr: "B2", category: "tenses", unitSlug: "tcf-c17-futur-anterieur", prerequisiteIds: ["subjunctive-present", "conditional-past"] },
];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}
