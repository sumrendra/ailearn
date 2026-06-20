import type { WritingTask } from "./tcf-writing";

export const TCF_WRITING_P2: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Vous avez manqué votre cours de français la semaine dernière en raison d'un imprévu.",
    prompt: "Écrivez un message à votre professeur pour expliquer votre absence, vous excuser et lui demander les devoirs à rattraper.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Le blog de votre école de langues organise un débat en ligne sur l'utilisation des technologies dans l'apprentissage.",
    prompt: "Rédigez une contribution pour ce blog. Donnez votre opinion sur l'utilisation des applications et des outils numériques pour apprendre une langue. Appuyez-vous sur des exemples concrets.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Vous avez récemment acheté un appareil électronique qui s'est révélé défectueux. Vos tentatives de contact par téléphone ont été infructueuses.",
    prompt: "Rédigez une lettre de réclamation au service client de la société. Décrivez le problème, expliquez les démarches déjà effectuées et demandez une solution (remboursement ou échange).",
  },
];
