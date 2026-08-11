import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P5: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Vous souhaitez rejoindre un groupe d'échange linguistique en ligne pour pratiquer votre français avec des natifs.",
    prompt: "Rédigez un message de présentation pour la page d'inscription du groupe. Présentez-vous, expliquez votre niveau et vos objectifs, et dites pourquoi vous souhaitez participer.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Le blog communautaire de votre ville publie des articles sur l'environnement local. Vous avez remarqué un problème dans votre quartier.",
    prompt: "Rédigez un billet de blog sur un problème environnemental local (déchets, pollution, manque d'espaces verts…). Décrivez le problème, ses causes et proposez des solutions concrètes.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Un magazine économique publie deux témoignages sur le télétravail dans les entreprises bilingues.",
    prompt: "Rédigez un texte pour ce magazine. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Karim Haddad, directeur des ressources humaines",
        text: "Depuis que nous recrutons sans condition de lieu, nos candidatures francophones ont doublé. Un conseiller peut vivre à Rimouski et servir une clientèle de Montréal sans que personne y perde quoi que ce soit. Les employés récupèrent en moyenne une heure de transport par jour et notre taux de départ a nettement baissé, ce qui nous évite de reformer sans cesse de nouvelles recrues. Nos bureaux coûtent moins cher, et cette économie finance directement de la formation linguistique. Nos indicateurs de satisfaction client n'ont pas bougé : rien de tout cela ne s'est fait au détriment du service.",
      },
      {
        label: "Document 2",
        author: "Christine Ouellet, chef d'équipe",
        text: "Pour un employé qui apprend encore le français, le télétravail est une épreuve. Dans un bureau, il entend la langue toute la journée, corrige un mot au passage, ose poser une question à voix basse à son voisin. En visioconférence, il écoute et se tait, parce que interrompre douze personnes demande un courage que peu ont. Les nouveaux mettent bien plus de temps à devenir autonomes, et un malentendu qui se réglait en trente secondes prend maintenant trois courriels. Ce que nous économisons en loyer, nous le perdons en apprentissage.",
      },
    ],
  },
];
