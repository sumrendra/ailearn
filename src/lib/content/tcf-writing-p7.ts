import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P7: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un ami qui prépare sa demande de citoyenneté canadienne vous écrit. Il vous demande comment s'est passée votre cérémonie d'accueil des citoyens et ce que vous avez retenu de cette journée.",
    prompt: "Répondez à votre ami. Décrivez un moment marquant de la cérémonie, expliquez ce que la citoyenneté représente pour vous, et donnez-lui un conseil pour bien se préparer au test.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Vous avez participé à une journée portes ouvertes organisée par votre centre communautaire pour présenter les services municipaux aux nouveaux résidents. L'animateur vous demande un retour écrit.",
    prompt: "Rédigez votre retour. Présentez les activités auxquelles vous avez participé, indiquez ce qui vous a le plus aidé à comprendre la vie civique locale, et proposez une amélioration pour la prochaine édition.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le journal en ligne de votre ville publie deux prises de position sur le vote par correspondance aux élections municipales.",
    prompt: "Rédigez un texte pour ce journal. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Nadia Chartrand, présidente d'association de quartier",
        text: "Le vote par correspondance a doublé la participation dans notre arrondissement. Les parents avec jeunes enfants, les personnes âgées et ceux qui travaillent de nuit peuvent enfin voter sans se déplacer. Les fraudes invoquées restent exceptionnelles là où les enveloppes sont numérotées et vérifiées. Refuser ce mode revient à exclure silencieusement une partie des citoyens qui paient leurs impôts comme les autres.",
      },
      {
        label: "Document 2",
        author: "Marc-André Lefebvre, ancien président de bureau de scrutin",
        text: "Le scrutin secret suppose une cabine où personne ne voit votre choix. À la maison, un conjoint, un employeur ou un proche peut influencer ou observer le bulletin. Le vote par correspondance complique aussi le dépouillement et allonge les délais, au moment où les citoyens veulent des résultats rapides et transparents. La présence au bureau de vote reste le garant de l'égalité devant l'urne.",
      },
    ],
  },
];
