import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P8: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "L'examinateur vous pose des questions personnelles, sans préparation. Il s'agit de montrer que vous pouvez échanger naturellement sur votre vie familiale et vos habitudes au Canada.",
    prompt: "Parlez de la place de la famille dans votre quotidien depuis votre installation au Canada. Comment organisez-vous le travail, les études ou les loisirs avec les responsabilités familiales ? Qu'est-ce qui vous a le plus surpris concernant les services pour les enfants ou les personnes âgées ?",
    tips: [
      "Commencez à parler tout de suite : l'hésitation initiale coûte plus cher qu'une petite erreur",
      "Donnez un exemple précis (école, garderie, visite chez un proche) plutôt qu'une généralité",
      "Terminez chaque idée par une raison : « parce que », « c'est pourquoi »",
    ],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Vous disposez de 2 minutes pour préparer, puis 3 minutes 30 d'échange. Vous devez obtenir des informations dans une situation courante. Vous pouvez prendre de courtes notes.",
    prompt: "Vous cherchez une place en garderie pour votre enfant de dix-huit mois. Vous êtes à l'accueil d'un centre de la petite enfance. Posez des questions sur les critères d'inscription, les frais, les horaires, la liste d'attente et les documents à fournir.",
    tips: [
      "Préparez cinq questions précises, pas un discours",
      "Utilisez le conditionnel pour rester poli : « pourriez-vous », « serait-il possible »",
      "Reformulez ce que l'on vous répond pour vérifier : « si je comprends bien… »",
      "Demandez comment être informé quand une place se libère",
    ],
  },
  {
    type: 3, label: "Expression d'un point de vue", prepSeconds: 180, recordSeconds: 270,
    context: "Vous exposez et défendez un point de vue de manière continue et structurée pendant 4 minutes 30.",
    prompt: "Dans plusieurs provinces, les proches qui s'occupent d'une personne âgée à domicile reçoivent peu ou pas de compensation, alors que les résidences privées coûtent très cher. Pensez-vous que l'État devrait mieux rémunérer l'aide familiale non professionnelle ? Développez votre position avec des arguments et des exemples concrets.",
    tips: [
      "Annoncez votre position dès la première phrase, puis annoncez votre plan",
      "Deux arguments développés valent mieux que cinq arguments énumérés",
      "Envisagez une objection (coût, équité entre familles) et répondez-y",
      "Gardez trente secondes pour une conclusion qui reformule votre position",
    ],
  },
];
