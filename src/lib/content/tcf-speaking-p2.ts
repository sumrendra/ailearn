import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P2: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "Questions personnelles sur vos loisirs et activités préférées.",
    prompt: "Quelles sont vos activités préférées le week-end ? Comment avez-vous découvert ces loisirs ? Est-ce que ces activités ont changé depuis votre arrivée au Canada ?",
    tips: ["Soyez précis et concret", "Parlez au passé, présent et futur", "Exprimez vos émotions et préférences"],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Situation professionnelle simulée.",
    prompt: "Vous venez de commencer un nouveau travail. Votre responsable vous demande de vous présenter à l'équipe lors d'une réunion. Présentez-vous, parlez de votre parcours professionnel, de vos compétences et de ce que vous espérez apporter à l'équipe.",
    tips: ["Structurez votre présentation", "Mettez en valeur vos points forts", "Adaptez le registre au contexte professionnel"],
  },
  {
    type: 3, label: "Monologue d'opinion", prepSeconds: 180, recordSeconds: 270,
    context: "3 min de préparation, puis 4,5 min d'exposé — sujet de société, donnez votre avis argumenté.",
    prompt: "Selon vous, quel est l'impact des réseaux sociaux sur l'apprentissage des langues ? Sont-ils plutôt un outil utile ou une distraction ? Justifiez votre réponse avec des exemples.",
    tips: ["Utilisez les 3 min de préparation pour noter vos idées clés", "Présentez les deux côtés avant de conclure", "Utilisez des expressions d'opinion : À mon avis, Je pense que…", "Gardez un fil directeur clair"],
  },
];
