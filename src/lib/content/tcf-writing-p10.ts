import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P10: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un ami vient d'arriver au Canada et vous écrit. Il a entendu parler du festival d'hiver de votre ville et du programme de bénévolat à la bibliothèque. Il vous demande si ces activités l'aideraient à rencontrer des gens et à mieux s'intégrer.",
    prompt: "Répondez à votre ami. Décrivez une activité de loisir ou culturelle que vous avez essayée, expliquez ce qu'elle vous a apporté sur le plan social, et donnez-lui un conseil concret pour commencer sans se sentir isolé.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Vous avez participé comme bénévole à une soirée bilingue organisée par votre centre communautaire (musique, ateliers, collation). L'organisatrice vous demande un retour écrit pour améliorer la prochaine édition.",
    prompt: "Rédigez votre retour. Présentez ce qui a bien fonctionné pour favoriser les échanges entre participants, signalez une difficulté rencontrée (langue, horaire, accueil), et proposez une amélioration précise pour la prochaine soirée.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le journal culturel de votre ville publie deux prises de position sur l'obligation pour les associations sportives locales d'offrir des créneaux gratuits aux nouveaux résidents.",
    prompt: "Rédigez un texte pour ce journal. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Amina Diallo, coordinatrice d'intégration",
        text: "Le sport est souvent le premier lieu où un nouvel arrivant prononce le nom de quelqu'un en dehors du travail. Des séances gratuites pendant trois mois réduisent la barrière financière et signalent que le club veut accueillir. Ce n'est pas du charité : ces joueurs paieront peut-être une licence l'année suivante et deviendront bénévoles. Sans geste visible, beaucoup restent des spectateurs de la vie locale.",
      },
      {
        label: "Document 2",
        author: "Robert Gagnon, président de ligue régionale de hockey",
        text: "Nos clubs vivent déjà de cotisations serrées et d'heures de glace coûteuses. Imposer des créneaux gratuits sans compensation provinciale oblige les familles inscrites à payer plus ou à réduire l'entraînement des jeunes. L'intégration passe aussi par des partenariats ciblés — cours d'initiation, prêt d'équipement — plutôt qu'une règle unique qui fragilise des associations déjà fragiles.",
      },
    ],
  },
];
