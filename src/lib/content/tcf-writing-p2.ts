import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

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
    context: "Un site d'information consacre un dossier à la réparation des appareils électroniques. Deux lecteurs y répondent de façon opposée.",
    prompt: "Rédigez une contribution pour ce site. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Sonia Berger, ingénieure",
        text: "Nous avons pris l'habitude de jeter un appareil dès qu'il tombe en panne, souvent pour une pièce à quelques euros. Obliger les fabricants à fournir des pièces détachées pendant dix ans changerait complètement la donne. Les ateliers de réparation créeraient des emplois locaux, difficilement délocalisables, et les montagnes de déchets électroniques que nous exportons diminueraient nettement. Un téléphone réparé deux fois, c'est aussi deux appareils qui n'ont pas été fabriqués, avec tout ce que cela suppose de métaux extraits. Réparer coûte presque toujours moins cher que remplacer, à condition que la pièce existe encore.",
      },
      {
        label: "Document 2",
        author: "Julien Roy, commerçant",
        text: "Imposer dix ans de pièces détachées paraît généreux, mais quelqu'un paiera la facture. Stocker des composants pour des modèles disparus coûte cher, et ce coût se retrouvera dans le prix d'achat, y compris pour les clients qui gardent leur appareil trois ans. Dans ma boutique, une réparation atteint parfois la moitié du prix du neuf, pour un appareil moins performant et bien moins économe en énergie. Les clients renoncent alors et achètent quand même. Mieux vaudrait investir dans des filières de recyclage réellement efficaces.",
      },
    ],
  },
];
