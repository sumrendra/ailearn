import type { TcfExamBand } from "@/lib/content/tcf-exam-lexique";

/** Exam-lexique topics (core path only — not optional theme decks). */
export type CoreVocabTopicId =
  | "daily-services"
  | "transport"
  | "housing"
  | "work"
  | "health"
  | "education"
  | "community"
  | "environment"
  | "media-society"
  | "argumentation";

export const CORE_VOCAB_TOPIC_TAG = "core-topic:";

export const CORE_VOCAB_TOPICS: {
  id: CoreVocabTopicId;
  titleEn: string;
  titleFr: string;
  emoji: string;
  blurbEn: string;
}[] = [
  {
    id: "daily-services",
    titleEn: "Daily services & forms",
    titleFr: "Services du quotidien",
    emoji: "🏪",
    blurbEn: "Hours, queues, payments, documents — typical Band A prompts.",
  },
  {
    id: "transport",
    titleEn: "Transport & mobility",
    titleFr: "Transport",
    emoji: "🚌",
    blurbEn: "Transit, delays, tickets, parking.",
  },
  {
    id: "housing",
    titleEn: "Housing & rent",
    titleFr: "Logement",
    emoji: "🏠",
    blurbEn: "Leases, landlords, utilities, maintenance.",
  },
  {
    id: "work",
    titleEn: "Work & employment",
    titleFr: "Travail",
    emoji: "💼",
    blurbEn: "Jobs, workplace rights, pay, training.",
  },
  {
    id: "health",
    titleEn: "Health & care",
    titleFr: "Santé",
    emoji: "🏥",
    blurbEn: "Clinic, symptoms, prescriptions, appointments.",
  },
  {
    id: "education",
    titleEn: "Education & training",
    titleFr: "Éducation",
    emoji: "🎓",
    blurbEn: "School, diplomas, courses, childcare.",
  },
  {
    id: "community",
    titleEn: "Community & integration",
    titleFr: "Vie en société",
    emoji: "🤝",
    blurbEn: "Orientation, volunteering, local services — everyday French, not immigration jargon.",
  },
  {
    id: "environment",
    titleEn: "Environment & climate",
    titleFr: "Environnement",
    emoji: "🌿",
    blurbEn: "Pollution, recycling, sustainability debates.",
  },
  {
    id: "media-society",
    titleEn: "Media & public life",
    titleFr: "Médias et société",
    emoji: "📰",
    blurbEn: "News, opinion, civic issues.",
  },
  {
    id: "argumentation",
    titleEn: "Argument & nuance",
    titleFr: "Argumentation",
    emoji: "🎯",
    blurbEn: "Formal register and opinion — Band C style.",
  },
];

const TOPIC_IDS = new Set<string>(CORE_VOCAB_TOPICS.map((t) => t.id));

export function isCoreVocabTopicId(id: string): id is CoreVocabTopicId {
  return TOPIC_IDS.has(id);
}

const KEYWORD_TOPICS: { topic: CoreVocabTopicId; re: RegExp }[] = [
  { topic: "transport", re: /bus|métro|metro|transit|train|correspondance|stationnement|parking|quai|billet|autobus|déviation|retard de service/i },
  { topic: "housing", re: /loyer|bail|locataire|logement|coloc|chauffage|entretien|dépôt|sous-lou/i },
  { topic: "health", re: /médic|santé|symptôme|ordonnance|clinique|pharmac|allerg|dosage|dossier médical|référence médicale|effet secondaire/i },
  { topic: "education", re: /école|diplôme|formation|cours|université|garderie|parental|enfant|étud/i },
  { topic: "work", re: /emploi|travail|salaire|employeur|convention collective|grief|licenci|embauche|curriculum|apprentissage|métier|harcèlement|normes d'emploi|assurance-emploi|heures supplémentaires|congé/i },
  { topic: "environment", re: /environnement|climat|recycl|pollution|durabilit|carbone|biodivers/i },
  { topic: "media-society", re: /média|presse|débat public|citoyen|droits de la personne|discrimin/i },
  { topic: "community", re: /communaut|bénévol|orientation|établissement|intégration|centre communautaire/i },
  { topic: "daily-services", re: /heure|ouverture|guichet|file d'attente|comptoir|facture|solde|retrait|épicerie|remboursement|copie|formulaire|rendez-vous|accueil|bibliothèque|clientèle|objets trouvés/i },
  { topic: "argumentation", re: /argument|rhétorique|nuance|épistém|biais|présupposition|compromis|subtilité|registre|polémique/i },
];

const MANUAL: Record<string, CoreVocabTopicId[]> = {
  "work permit": ["work"],
  "permanent residence": ["community"],
};

/** Tags to attach on each core flashcard (`core-topic:<id>`). */
export function coreTopicTagsForLemma(en: string, fr: string, band: TcfExamBand): string[] {
  const manual = MANUAL[en.toLowerCase()];
  if (manual?.length) {
    return manual.map((t) => `${CORE_VOCAB_TOPIC_TAG}${t}`);
  }

  const hay = `${en} ${fr}`.toLowerCase();
  const matched = new Set<CoreVocabTopicId>();
  for (const { topic, re } of KEYWORD_TOPICS) {
    if (re.test(hay)) matched.add(topic);
  }

  if (band === "c" && matched.size === 0) matched.add("argumentation");
  if (band === "a" && matched.size === 0) matched.add("daily-services");
  if (band === "b" && matched.size === 0) matched.add("work");

  return [...matched].map((t) => `${CORE_VOCAB_TOPIC_TAG}${t}`);
}

export function getCoreTopicMeta(id: CoreVocabTopicId) {
  return CORE_VOCAB_TOPICS.find((t) => t.id === id);
}
