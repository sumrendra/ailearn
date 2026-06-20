import type { WritingTask } from "./tcf-writing";

export const TCF_WRITING_P4: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Votre ami(e) va déménager dans une nouvelle ville pour la première fois. Il/elle vous demande des conseils.",
    prompt: "Écrivez-lui un message avec vos meilleurs conseils pour bien s'installer. Parlez des démarches administratives, des ressources utiles et de la façon de rencontrer des gens.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Un magazine de voyage francophone cherche des contributeurs pour présenter des destinations dans le monde francophone.",
    prompt: "Rédigez un article recommandant une destination francophone (ville, région ou pays) que vous avez visitée ou qui vous inspire. Décrivez ce que les voyageurs francophones peuvent y découvrir.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Votre bibliothèque municipale souhaite élargir ses activités pour mieux servir les nouveaux arrivants francophones.",
    prompt: "Rédigez une lettre au directeur de la bibliothèque pour proposer la création d'un club de lecture en français destiné aux immigrants. Présentez les objectifs, le fonctionnement proposé et les bénéfices pour la communauté.",
  },
];
