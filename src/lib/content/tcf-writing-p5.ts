import type { WritingTask } from "./tcf-writing";

export const TCF_WRITING_P5: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Vous souhaitez rejoindre un groupe d'échange linguistique en ligne pour pratiquer votre français avec des natifs.",
    prompt: "Rédigez un message de présentation pour la page d'inscription du groupe. Présentez-vous, expliquez votre niveau et vos objectifs, et dites pourquoi vous souhaitez participer.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Le blog communautaire de votre ville publie des articles sur l'environnement local. Vous avez remarqué un problème dans votre quartier.",
    prompt: "Rédigez un billet de blog sur un problème environnemental local (déchets, pollution, manque d'espaces verts…). Décrivez le problème, ses causes et proposez des solutions concrètes.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Vous avez trouvé une offre d'emploi pour un poste de conseiller(ère) clientèle dans une entreprise bilingue qui valorise les compétences en français.",
    prompt: "Rédigez une lettre de motivation formelle pour ce poste. Présentez vos compétences linguistiques et professionnelles, expliquez votre intérêt pour ce rôle et démontrez votre adéquation au profil recherché.",
  },
];
