import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P9: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un ami qui vient d'obtenir son permis de conduire au Québec vous écrit. Il hésite entre acheter une voiture ou compter sur le transport en commun et le vélo pour ses déplacements quotidiens.",
    prompt: "Répondez à votre ami. Décrivez comment vous vous déplacez en ville, expliquez un avantage et un inconvénient de chaque option, et donnez-lui un conseil adapté à un budget serré.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Votre immeuble a organisé une réunion sur la sécurité des piétons et des cyclistes autour du quartier. Le syndic vous demande un compte rendu écrit pour les résidents absents.",
    prompt: "Rédigez votre compte rendu. Présentez les problèmes signalés, résumez les solutions proposées par les participants, et indiquez les prochaines étapes annoncées par la ville ou le syndic.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le journal en ligne de votre ville publie deux prises de position sur l'instauration d'une zone à faibles émissions au centre-ville, limitant la circulation des véhicules les plus polluants.",
    prompt: "Rédigez un texte pour ce journal. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Dr. Amélie Fortin, pneumologue à l'hôpital régional",
        text: "Les enfants qui habitent près des axes très fréquentés présentent plus d'asthme et d'infections respiratoires. Une zone à faibles émissions n'est pas une mesure contre les automobilistes : c'est une mesure pour que les trottoirs et les arrêts d'autobus redeviennent respirables. Les villes européennes qui l'ont testée n'ont pas vu leur commerce s'effondrer ; elles ont vu les déplacements à pied et à vélo augmenter.",
      },
      {
        label: "Document 2",
        author: "Karim El Mansouri, président d'une association de commerçants",
        text: "Nos clients viennent souvent en voiture, surtout en hiver et la nuit. Exclure certains véhicules, c'est exclure des familles qui n'ont pas les moyens de renouveler leur auto. Avant de restreindre la circulation, la municipalité devrait améliorer le stationnement, allonger les heures de transport en commun et compenser les commerces qui perdront des clients pendant les travaux.",
      },
    ],
  },
];
