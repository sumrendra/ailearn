import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P8: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Une amie vient d'avoir un bébé au Québec. Elle vous écrit pour savoir comment vous avez organisé vos congés parentaux et la garde de votre enfant quand vous êtes retournée au travail.",
    prompt: "Répondez à votre amie. Expliquez comment vous avez partagé les congés, décrivez la solution de garde que vous avez trouvée, et donnez-lui un conseil pratique pour les premières semaines.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Vous avez accompagné un parent âgé dans une démarche auprès d'un centre communautaire pour obtenir de l'aide à domicile. L'animateur du programme vous demande un retour écrit pour améliorer l'accueil des familles.",
    prompt: "Rédigez votre retour. Décrivez les étapes vécues, indiquez ce qui a bien fonctionné ou posé problème, et proposez une amélioration concrète pour les prochains usagers.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le site d'information familiale de votre province publie deux prises de position sur la gratuité des services de garde pour les enfants de moins de six ans.",
    prompt: "Rédigez un texte pour ce site. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Karine Morin, présidente d'association de parents",
        text: "La garde à dix dollars par jour a changé la vie de milliers de familles. Les mères ne renoncent plus à un emploi faute de place en garderie, et les enfants fréquentent des milieux de qualité dès la petite enfance. Financer ces places par l'impôt, c'est investir dans l'égalité des sexes et dans la réussite scolaire future. Les listes d'attente persistent, mais baisser le tarif n'est pas un luxe : c'est une condition pour que le congé parental ait un sens réel au retour au travail.",
      },
      {
        label: "Document 2",
        author: "Philippe Arsenault, économiste",
        text: "Subventionner massivement les CPE revient à favoriser un seul modèle de garde, souvent urbain et institutionnel. Les familles rurales et les horaires atypiques dépendent encore de garderies en milieu familial ou de proches, mal rémunérés. Une politique équitable devrait plutôt verser une aide directe aux parents, qu'ils choisissent une place subventionnée, une gardienne à domicile ou un congé prolongé. Sans cette flexibilité, on confond gratuité et justice sociale.",
      },
    ],
  },
];
