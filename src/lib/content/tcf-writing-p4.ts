import { TASK3_PART_WORDS, type WritingTask } from "./tcf-writing";

export const TCF_WRITING_P4: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Votre ami(e) va déménager dans une nouvelle ville pour la première fois. Il/elle vous demande des conseils.",
    prompt: "Écrivez-lui un message avec vos meilleurs conseils pour bien s'installer. Parlez des démarches administratives, des ressources utiles et de la façon de rencontrer des gens.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Un magazine de voyage francophone cherche des contributeurs pour présenter des destinations dans le monde francophone.",
    prompt: "Rédigez un article recommandant une destination francophone (ville, région ou pays) que vous avez visitée ou qui vous inspire. Décrivez ce que les voyageurs francophones peuvent y découvrir.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Le bulletin de votre bibliothèque municipale publie deux avis sur la place du numérique dans les bibliothèques publiques.",
    prompt: "Rédigez un texte pour ce bulletin. Dans une première partie, comparez les deux points de vue exprimés ci-dessous (40 à 60 mots). Dans une seconde partie, prenez position sur la question et justifiez votre avis (80 à 120 mots).",
    partWords: TASK3_PART_WORDS,
    documents: [
      {
        label: "Document 1",
        author: "Léa Fontaine, bibliothécaire",
        text: "Une bibliothèque n'est plus seulement un dépôt de livres. Nos postes informatiques servent chaque jour à remplir des demandes d'immigration, à chercher un emploi, à joindre une famille restée loin. Les collections numériques permettent d'emprunter un roman en français à minuit, depuis un village qui n'a plus de librairie depuis vingt ans. Nos ateliers d'initiation affichent complet chaque semaine, y compris chez les plus de soixante ans. Pour beaucoup de nouveaux arrivants, c'est le premier lieu public où l'on ne leur demande rien et où l'on répond à leurs questions.",
      },
      {
        label: "Document 2",
        author: "Robert Chagnon, retraité et usager",
        text: "Chaque écran installé remplace des rayonnages. On réduit les acquisitions papier pour financer des licences numériques qui ne nous appartiennent jamais vraiment : le jour où l'éditeur retire un titre, il disparaît du catalogue et personne ne peut plus le lire. Les usagers de mon âge, eux, se retrouvent devant des bornes qu'ils ne savent pas utiliser, et le personnel disponible pour les aider diminue d'année en année. Une bibliothèque devrait rester un endroit où l'on entre pour prendre un livre sur une étagère, sans identifiant ni mot de passe.",
      },
    ],
  },
];
