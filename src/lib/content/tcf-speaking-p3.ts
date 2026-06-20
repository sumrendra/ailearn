import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P3: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "Questions sur votre expérience d'immigration et d'intégration.",
    prompt: "Comment s'est passée votre arrivée au Canada ? Quelles ont été les principales difficultés que vous avez rencontrées ? Comment avez-vous surmonté ces obstacles ?",
    tips: ["Racontez votre histoire personnelle", "Montrez votre capacité à réfléchir sur vos expériences", "Utilisez les temps du passé correctement"],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Interaction dans un contexte administratif.",
    prompt: "Vous devez appeler la clinique médicale pour prendre un rendez-vous. La réceptionniste vous informe que le premier rendez-vous disponible est dans 3 semaines, mais vous avez besoin de voir un médecin plus tôt. Simulez la conversation et essayez de trouver une solution.",
    tips: ["Expliquez clairement votre situation", "Soyez poli mais assertif", "Proposez des alternatives si nécessaire"],
  },
  {
    type: 3, label: "Monologue d'opinion", prepSeconds: 180, recordSeconds: 270,
    context: "3 min de préparation, puis 4,5 min d'exposé — question sur l'éducation et la société.",
    prompt: "Êtes-vous pour ou contre l'enseignement bilingue obligatoire dans les écoles primaires canadiennes ? Défendez votre position en vous appuyant sur des arguments concrets.",
    tips: ["Utilisez les 3 min de préparation pour noter vos idées clés", "Définissez clairement votre position dès le début", "Anticipez et réfutez les contre-arguments", "Terminez par une conclusion forte"],
  },
];
