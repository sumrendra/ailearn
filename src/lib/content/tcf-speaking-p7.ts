import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P7: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "L'examinateur vous pose des questions personnelles, sans préparation. Il s'agit de montrer que vous pouvez échanger naturellement avec une personne que vous ne connaissez pas.",
    prompt: "Parlez de votre implication dans la vie de votre quartier ou de votre communauté. Quelles activités ou services publics utilisez-vous le plus souvent ? Qu'est-ce qui vous surprend encore dans la vie civique au Canada ?",
    tips: [
      "Commencez à parler tout de suite : l'hésitation initiale coûte plus cher qu'une petite erreur",
      "Donnez un exemple précis plutôt qu'une description générale",
      "Terminez chaque idée par une raison : « parce que », « c'est pourquoi »",
    ],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Vous disposez de 2 minutes pour préparer, puis 3 minutes 30 d'échange. L'objectif est d'obtenir des informations dans une situation courante. Vous pouvez prendre de courtes notes.",
    prompt: "Vous venez d'arriver au Canada et vous devez obtenir votre numéro d'assurance sociale. Vous êtes au comptoir de Service Canada. Posez des questions sur les documents à fournir, les délais, la prise de rendez-vous en ligne et ce que vous pouvez faire en attendant la carte.",
    tips: [
      "Préparez cinq questions précises, pas un discours",
      "Utilisez le conditionnel pour rester poli : « pourriez-vous », « serait-il possible »",
      "Reformulez ce que l'on vous répond pour vérifier : « si je comprends bien… »",
      "N'oubliez pas de conclure en demandant une confirmation écrite",
    ],
  },
  {
    type: 3, label: "Expression d'un point de vue", prepSeconds: 180, recordSeconds: 270,
    context: "Vous exposez et défendez un point de vue de manière continue et structurée pendant 4 minutes 30.",
    prompt: "Certaines municipalités imposent une taxe locale supplémentaire pour financer des services communautaires, comme les bibliothèques ou les parcs. Pensez-vous que les citoyens devraient pouvoir voter sur ces taxes lors d'un référendum ? Développez votre position avec des arguments et des exemples concrets.",
    tips: [
      "Annoncez votre position dès la première phrase, puis annoncez votre plan",
      "Deux arguments développés valent mieux que cinq arguments énumérés",
      "Envisagez une objection et répondez-y : cela montre la nuance attendue au niveau B2",
      "Gardez trente secondes pour une conclusion qui reformule votre position",
    ],
  },
];
