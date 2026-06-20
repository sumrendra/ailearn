import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P5: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "Questions sur vos expériences culturelles.",
    prompt: "Parlez d'une tradition ou d'une fête culturelle qui est importante pour vous. Comment la célébrez-vous ? Est-ce que ces traditions ont évolué depuis votre installation au Canada ?",
    tips: ["Utilisez un vocabulaire précis et varié", "Partagez des anecdotes personnelles", "Comparez avec des expériences ici au Canada"],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Interaction dans un contexte scolaire.",
    prompt: "Votre enfant rencontre des difficultés dans son école. Simulez un entretien avec l'enseignant(e). Décrivez les problèmes observés à la maison, posez des questions sur le comportement en classe, et discutez de solutions possibles pour aider votre enfant.",
    tips: ["Montrez votre implication parentale", "Posez des questions ouvertes", "Cherchez des solutions collaboratives"],
  },
  {
    type: 3, label: "Monologue d'opinion", prepSeconds: 180, recordSeconds: 270,
    context: "3 min de préparation, puis 4,5 min d'exposé — sujet environnemental et citoyen.",
    prompt: "Pensez-vous que chaque individu peut faire une différence significative face aux changements climatiques, ou s'agit-il uniquement d'une responsabilité gouvernementale et industrielle ? Défendez votre position.",
    tips: ["Utilisez les 3 min de préparation pour noter vos idées clés", "Donnez des exemples concrets d'actions individuelles", "Montrez que vous êtes conscient des enjeux globaux", "Concluez avec une position claire et nuancée"],
  },
];
