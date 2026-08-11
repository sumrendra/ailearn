import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P3: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un(e) nouveau(elle) collègue vient de rejoindre votre équipe. Vous souhaitez l'accueillir chaleureusement.",
    prompt: "Envoyez-lui un message pour l'inviter à un déjeuner d'équipe que vous organisez la semaine prochaine. Donnez les détails pratiques et expliquez pourquoi c'est une bonne occasion pour faire connaissance.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Un magazine en ligne francophone publie des guides sur les villes canadiennes pour les nouveaux arrivants.",
    prompt: "Rédigez un article sur une ville canadienne que vous connaissez bien. Présentez ses atouts, sa vie culturelle et les ressources utiles pour les francophones qui s'y installent.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "La revue d'une université canadienne publie deux avis sur l'enseignement à distance dans les programmes universitaires.",
    prompt: "Rédigez un texte destiné à cette revue. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Nadia Belhadj, étudiante en master",
        text: "Les cours à distance ont ouvert l'université à des gens qui en étaient tout simplement exclus : parents seuls, salariés à temps plein, personnes vivant loin des grandes villes. Pouvoir réécouter un cours magistral autant de fois que nécessaire aide énormément quand le français n'est pas votre langue maternelle et que le professeur parle vite. J'ai suivi deux sessions entières en ligne tout en travaillant de nuit, ce qui aurait été impossible autrement. Les examens sont restés les mêmes et les corrections aussi sévères. La souplesse ne réduit pas les exigences, elle les rend atteignables.",
      },
      {
        label: "Document 2",
        author: "Philippe Caron, professeur",
        text: "Ce que l'écran fait disparaître, c'est tout ce qui entoure le cours : la question posée en sortant de l'amphithéâtre, le travail improvisé à trois dans un couloir, le sentiment d'appartenir à une promotion. Dans mes groupes, les abandons sont sensiblement plus nombreux à distance, surtout en première année et surtout chez les étudiants étrangers. Ceux qui décrochent ne préviennent personne : ils cessent simplement de se connecter. Les plus fragiles sont précisément ceux que l'isolement décourage. La technologie complète utilement un cursus, elle ne le remplace pas.",
      },
    ],
  },
];
