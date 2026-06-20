export interface WritingTask {
  type: 1 | 2 | 3;
  register: string;
  minWords: number;
  maxWords: number;
  timeMin: number;
  context: string;
  prompt: string;
}

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
    context: "Votre ville souhaite développer de nouveaux espaces verts. La mairie a lancé un appel à propositions des citoyens.",
    prompt: "Écrivez une lettre au maire pour proposer la création d'un jardin communautaire dans votre quartier. Exposez les bénéfices pour les résidents et demandez le soutien de la municipalité.",
  },
];
