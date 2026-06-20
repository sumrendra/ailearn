import type { WritingTask } from "./tcf-writing";

export const TCF_WRITING_P3: WritingTask[] = [
  {
    type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
    context: "Un(e) nouveau(elle) collègue vient de rejoindre votre équipe. Vous souhaitez l'accueillir chaleureusement.",
    prompt: "Envoyez-lui un message pour l'inviter à un déjeuner d'équipe que vous organisez la semaine prochaine. Donnez les détails pratiques et expliquez pourquoi c'est une bonne occasion pour faire connaissance.",
  },
  {
    type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
    context: "Un magazine en ligne francophone publie des guides sur les villes canadiennes pour les nouveaux arrivants.",
    prompt: "Rédigez un article sur une ville canadienne que vous connaissez bien. Présentez ses atouts, sa vie culturelle et les ressources utiles pour les francophones qui s'y installent.",
  },
  {
    type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
    context: "Vous venez d'être admis dans une université canadienne. Vous souhaitez obtenir des informations sur les services d'accompagnement linguistique.",
    prompt: "Écrivez une lettre formelle au Bureau des étudiants internationaux pour demander des renseignements sur les services de soutien en français disponibles pour les étudiants non-natifs.",
  },
];
