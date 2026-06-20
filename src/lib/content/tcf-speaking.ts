export interface SpeakingTask {
  type: 1 | 2 | 3;
  label: string;
  prepSeconds: number;
  recordSeconds: number;
  context: string;
  prompt: string;
  tips: string[];
}

export const TCF_SPEAKING: SpeakingTask[] = [
  {
    type: 1, label: "Entretien guidé", prepSeconds: 0, recordSeconds: 120,
    context: "L'examinateur vous pose des questions personnelles sur votre vie quotidienne et vos expériences.",
    prompt: "Parlez de votre routine quotidienne au Canada. Comment se passe votre journée typique ? Qu'est-ce que vous aimez ou n'aimez pas dans votre vie ici ?",
    tips: ["Répondez spontanément", "Développez vos réponses avec des détails", "Utilisez des connecteurs : parce que, donc, cependant"],
  },
  {
    type: 2, label: "Jeu de rôle", prepSeconds: 120, recordSeconds: 210,
    context: "Vous devez simuler une interaction dans une situation de la vie quotidienne.",
    prompt: "Vous êtes dans une épicerie et vous cherchez des produits spécifiques. L'employé(e) ne parle pas très bien votre langue maternelle. Simulez la conversation : demandez où trouver les produits, demandez les prix, et demandez si l'épicerie propose des produits biologiques.",
    tips: ["Utilisez des formules de politesse", "Posez des questions claires", "Réagissez naturellement aux imprévus"],
  },
  {
    type: 3, label: "Monologue d'opinion", prepSeconds: 180, recordSeconds: 270,
    context: "Vous disposez de 3 minutes de préparation, puis 4,5 minutes pour exposer et défendre votre point de vue sur un sujet général.",
    prompt: "Pensez-vous que les grandes villes sont un meilleur endroit pour s'installer en tant que nouvel immigrant qu'une ville de taille moyenne ? Développez votre point de vue avec des arguments et des exemples.",
    tips: ["Utilisez les 3 min de préparation pour noter vos idées clés", "Annoncez votre position clairement dès le début", "Donnez 2-3 arguments structurés avec exemples", "Concluez en reformulant votre opinion"],
  },
];
