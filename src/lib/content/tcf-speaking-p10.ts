import type { SpeakingTask } from "./tcf-speaking";

export const TCF_SPEAKING_P10: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "L'examinateur vous pose des questions personnelles, sans préparation. Il s'agit de montrer que vous pouvez échanger naturellement avec une personne que vous ne connaissez pas.",
    prompt: "Parlez de vos loisirs et de votre vie sociale au Canada. Quelles activités culturelles ou sportives pratiquez-vous ? Avez-vous déjà participé à un festival, à une bibliothèque ou à du bénévolat ? Qu'est-ce qui vous a le plus aidé à vous sentir intégré ?",
    tips: [
      "Choisissez un exemple précis (un match, une soirée, une formation) plutôt qu'une liste vague",
      "Expliquez comment vous avez rencontré des gens : « c'est là que j'ai connu… »",
      "Si une activité a été difficile au début, dites ce qui vous a encouragé à continuer",
    ],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Vous disposez de 2 minutes pour préparer, puis 3 minutes 30 d'échange. L'objectif est d'obtenir des informations dans une situation courante. Vous pouvez prendre de courtes notes.",
    prompt: "Vous souhaitez devenir bénévole à la bibliothèque municipale pour animer un club de lecture en français. Vous êtes à l'accueil du service des loisirs. Posez des questions sur les conditions (disponibilités, formation, public visé), les documents à fournir et la façon dont cette activité peut vous aider à mieux connaître le quartier.",
    tips: [
      "Préparez des questions sur l'horaire, la durée de l'engagement et la formation offerte",
      "Demandez qui participe au club et si l'accueil est bilingue",
      "Terminez en demandant la prochaine étape : entrevue, formulaire, date de début",
    ],
  },
  {
    type: 3, label: "Expression d'un point de vue", prepSeconds: 180, recordSeconds: 270,
    context: "Vous exposez et défendez un point de vue de manière continue et structurée pendant 4 minutes 30.",
    prompt: "Certaines villes canadiennes investissent beaucoup dans les festivals d'hiver (patinoires, spectacles, marchés) pour animer la vie locale et attirer les familles. Pensez-vous que ces événements contribuent réellement à l'intégration sociale des nouveaux résidents, ou qu'ils restent surtout destinés aux habitants déjà installés ? Développez votre position avec des arguments et des exemples.",
    tips: [
      "Annoncez votre position dès l'introduction et annoncez deux arguments",
      "Illustrez avec un festival réel ou une situation hivernale concrète",
      "Envisagez l'argument inverse (coût, froid, barrière culturelle) puis répondez-y",
      "Concluez en reliant loisirs et sentiment d'appartenir à la communauté",
    ],
  },
];
