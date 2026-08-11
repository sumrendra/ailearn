import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P6: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un ami qui vit en France vous écrit : il envisage de s'installer au Canada et vous demande comment se sont passés vos premiers mois là-bas.",
    prompt: "Répondez à votre ami. Racontez-lui une difficulté que vous avez rencontrée à votre arrivée, comment vous l'avez surmontée, et donnez-lui un conseil concret.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Vous avez participé à un programme de jumelage entre nouveaux arrivants et résidents de longue date. L'organisme vous demande un témoignage pour son rapport annuel.",
    prompt: "Rédigez votre témoignage. Racontez le déroulement du jumelage, ce qu'il vous a apporté concrètement, et suggérez une amélioration pour les prochaines éditions.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le magazine de votre municipalité publie deux avis sur l'accueil des travailleurs étrangers temporaires dans les petites villes.",
    prompt: "Rédigez un texte pour ce magazine. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Hélène Dubois, mairesse d'une commune rurale",
        text: "Sans ces travailleurs, notre usine agroalimentaire aurait fermé et le village aurait perdu son école. Ils occupent des postes que personne ici ne veut plus, ils louent des logements restés vides depuis des années et leurs enfants remplissent les classes. Ceux qui restent finissent par acheter une maison et ouvrir un commerce. Notre commune ne se contente pas de les accueillir : elle leur doit sa survie démographique et économique.",
      },
      {
        label: "Document 2",
        author: "Serge Painchaud, syndicaliste",
        text: "Personne ne conteste l'utilité de ces travailleurs. Le problème tient au statut qu'on leur impose. Un permis lié à un seul employeur place le salarié dans une dépendance totale : contester ses conditions de travail, c'est risquer de perdre son droit de séjour. On obtient ainsi une main-d'œuvre qui ne se plaint jamais, et cela finit par tirer vers le bas les conditions de tous. Accueillons-les, mais autrement.",
      },
    ],
  },
];
