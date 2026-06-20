import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P4: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "Questions sur vos projets et ambitions au Canada.",
    prompt: "Quels sont vos projets professionnels ou personnels pour les prochaines années ? Comment le Canada vous aide-t-il à réaliser ces objectifs ? Y a-t-il des défis que vous anticipez ?",
    tips: ["Parlez du futur avec assurance", "Reliez vos réponses à des expériences passées", "Montrez votre motivation"],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Situation dans un contexte de service à la clientèle.",
    prompt: "Vous avez loué un appartement et vous découvrez que le chauffage est en panne depuis deux jours en hiver. Appelez le propriétaire pour lui signaler le problème, expliquer la situation et demander une solution rapide.",
    tips: ["Soyez factuel et précis", "Exprimez l'urgence sans être agressif", "Proposez une solution ou demandez un délai précis"],
  },
  {
    type: 3, label: "Monologue d'opinion", prepSeconds: 180, recordSeconds: 270,
    context: "3 min de préparation, puis 4,5 min d'exposé — sujet culturel et social.",
    prompt: "Dans quelle mesure pensez-vous que les immigrants devraient adopter la culture du pays d'accueil tout en préservant leur propre culture ? Y a-t-il un équilibre possible ? Donnez votre avis argumenté.",
    tips: ["Utilisez les 3 min de préparation pour noter vos idées clés", "Nuancez votre position", "Utilisez des exemples tirés de votre expérience", "Abordez la question sous différents angles"],
  },
];
