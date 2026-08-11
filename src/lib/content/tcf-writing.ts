/**
 * One of the two ~90-word opposing texts shown for task 3. The candidate first
 * compares them, then argues their own position (FEI task 3 specification).
 */
export interface WritingDocument {
  label: string;
  author: string;
  text: string;
}

export interface WritingTask {
  type: 1 | 2 | 3;
  register: string;
  minWords: number;
  maxWords: number;
  timeMin: number;
  context: string;
  prompt: string;
  /** Task 3 only: the two viewpoints to compare. */
  documents?: [WritingDocument, WritingDocument];
  /** Task 3 only: official split of the total word count. */
  partWords?: {
    comparison: { min: number; max: number };
    position: { min: number; max: number };
  };
}

/** FEI splits task 3 into 40–60 words of comparison then 80–120 of argument. */
export const TASK3_PART_WORDS = {
  comparison: { min: 40, max: 60 },
  position: { min: 80, max: 120 },
} as const;

export const TCF_WRITING: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Votre ami(e) français(e) vous a envoyé un message pour vous demander comment se passe votre apprentissage du français au Canada.",
    prompt: "Répondez à votre ami(e). Parlez-lui de vos progrès, d'une expérience récente en français et de vos objectifs.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Vous faites partie de l'association de votre quartier. La présidente vous demande d'écrire un article pour la newsletter mensuelle.",
    prompt: "Rédigez un article sur un événement communautaire récent auquel vous avez participé. Décrivez l'événement, son intérêt pour le quartier et encouragez la participation future.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le journal de votre ville publie deux témoignages sur les jardins communautaires dans les quartiers résidentiels. La rédaction invite les lecteurs à réagir.",
    prompt: "Rédigez un texte pour la rubrique « Opinions » du journal. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Amélie Tremblay, urbaniste",
        text: "Transformer un terrain vague en jardin communautaire change la vie d'un quartier. Les résidents se rencontrent, échangent des semences et des conseils, et finissent par se connaître. Là où il y avait un espace abandonné, on trouve des légumes frais et des enfants qui apprennent d'où vient leur nourriture. Ces jardins réduisent aussi les îlots de chaleur en été et absorbent une partie des eaux de pluie. Dans les quartiers que j'ai étudiés, les familles nouvellement arrivées y nouent leurs premiers liens. Pour un coût modeste, la municipalité obtient un lieu de vie qui appartient réellement à ses habitants.",
      },
      {
        label: "Document 2",
        author: "Marc Lavoie, conseiller municipal",
        text: "L'idée séduit, mais la réalité déçoit souvent. Un jardin communautaire exige un arrosage régulier, une gestion des parcelles et un arbitrage constant entre voisins. Après deux saisons, l'enthousiasme retombe, les bénévoles se lassent et la ville hérite d'un terrain mal entretenu qu'elle doit remettre en état à ses frais. Ces espaces profitent en outre à une minorité de résidents, ceux qui ont le temps de jardiner, alors que le même budget financerait un parc ouvert à tous. Avant de multiplier les projets, il faudrait évaluer honnêtement ceux qui existent déjà.",
      },
    ],
  },
];
