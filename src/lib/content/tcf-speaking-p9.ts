import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P9: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "L'examinateur vous pose des questions personnelles, sans préparation. Il s'agit de montrer que vous pouvez échanger naturellement avec une personne que vous ne connaissez pas.",
    prompt: "Parlez de vos déplacements au quotidien. Comment vous rendez-vous au travail, aux courses ou à l'école ? Qu'est-ce qui vous plaît ou vous gêne dans la vie urbaine ou rurale de votre région ?",
    tips: [
      "Commencez à parler tout de suite : l'hésitation initiale coûte plus cher qu'une petite erreur",
      "Donnez un exemple précis plutôt qu'une description générale",
      "Terminez chaque idée par une raison : « parce que », « c'est pourquoi »",
    ],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Vous disposez de 2 minutes pour préparer, puis 3 minutes 30 d'échange. L'objectif est d'obtenir des informations dans une situation courante. Vous pouvez prendre de courtes notes.",
    prompt: "Vous venez de déménager dans une grande ville canadienne et vous devez vous abonner au transport en commun. Vous êtes au guichet de la régie. Posez des questions sur les types de laissez-passer, les tarifs réduits, les horaires le soir et le week-end, et la procédure en cas de carte perdue.",
    tips: [
      "Préparez cinq questions précises, pas un discours",
      "Utilisez le conditionnel pour rester poli : « pourriez-vous », « serait-il possible »",
      "Reformulez ce que l'on vous répond pour vérifier : « si je comprends bien… »",
      "N'oubliez pas de conclure en demandant une confirmation écrite ou un reçu",
    ],
  },
  {
    type: 3, label: "Expression d'un point de vue", prepSeconds: 180, recordSeconds: 270,
    context: "Vous exposez et défendez un point de vue de manière continue et structurée pendant 4 minutes 30.",
    prompt: "Certaines municipalités construisent de nouveaux quartiers denses près des stations de métro ou de train, avec peu de stationnement pour les voitures. Pensez-vous que les villes devraient privilégier ce modèle plutôt que l'étalement des banlieues ? Développez votre position avec des arguments et des exemples concrets.",
    tips: [
      "Annoncez votre position dès la première phrase, puis annoncez votre plan",
      "Deux arguments développés valent mieux que cinq arguments énumérés",
      "Envisagez une objection et répondez-y : cela montre la nuance attendue au niveau B2",
      "Gardez trente secondes pour une conclusion qui reformule votre position",
    ],
  },
];
