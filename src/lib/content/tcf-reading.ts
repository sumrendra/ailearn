/**
 * TCF Canada — Compréhension Écrite (Reading) question bank.
 *
 * 39 questions mirroring the real exam's three-band structure:
 *   Q 1–10   A1–A2  signs, notices, short emails, ads
 *   Q 11–25  B1–B2  articles, formal letters, news reports
 *   Q 26–39  C1–C2  editorials, academic texts, essays
 *
 * passage is the French text displayed on screen.
 * Questions and options are in French, as in the real exam.
 * Explanations are in English for the learner's benefit.
 */

import type { TCFLevel } from "./tcf-listening";
export type { TCFLevel };

export interface TCFReadingQuestion {
  id: number;
  level: TCFLevel;
  passageType: string;
  passage: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const TCF_READING: TCFReadingQuestion[] = [
  // ──────────────────────────────────────────────────────────────
  // A1 – A2  (Q 1–10)
  // ──────────────────────────────────────────────────────────────
  {
    id: 1,
    level: "A1",
    passageType: "Panneau",
    passage:
      "PHARMACIE DE GARDE\nOuverte 24h/24\nTél : 01 42 55 78 90\nPour urgences médicales : appelez le 15",
    question: "À quelle heure cette pharmacie est-elle ouverte?",
    options: [
      "De 8h à 20h",
      "De 9h à 22h",
      "24 heures sur 24",
      "De 7h à minuit",
    ],
    correctIndex: 2,
    explanation: "The sign says 'Ouverte 24h/24' — open 24 hours a day.",
  },
  {
    id: 2,
    level: "A1",
    passageType: "Annonce",
    passage:
      "APPARTEMENT À LOUER\n2 pièces — 45 m²\nQuartier Plateau-Mont-Royal, Montréal\nLoyer : 1 200 $ par mois, charges comprises\nDisponible : 1er septembre\nContact : Marie Bélanger — 514-555-0192",
    question: "Quand l'appartement est-il disponible?",
    options: [
      "Immédiatement",
      "Le 1er juillet",
      "Le 1er août",
      "Le 1er septembre",
    ],
    correctIndex: 3,
    explanation: "The ad says 'Disponible : 1er septembre' — available from September 1st.",
  },
  {
    id: 3,
    level: "A1",
    passageType: "Message",
    passage:
      "Bonjour Luca,\nJe suis désolée, je ne peux pas venir à la réunion de demain. Je suis malade. Est-ce que tu peux m'envoyer les notes après?\nMerci!\nSophie",
    question: "Pourquoi Sophie ne peut-elle pas venir à la réunion?",
    options: [
      "Elle est en voyage",
      "Elle est malade",
      "Elle a un autre rendez-vous",
      "Elle a oublié",
    ],
    correctIndex: 1,
    explanation: "Sophie says 'Je suis malade' — she is sick.",
  },
  {
    id: 4,
    level: "A1",
    passageType: "Menu",
    passage:
      "MENU DU JOUR — 12h–14h\nEntrée + Plat : 14 €\nPlat + Dessert : 14 €\nEntrée + Plat + Dessert : 18 €\nBoisson non comprise",
    question: "Combien coûte le menu complet (entrée + plat + dessert)?",
    options: ["12 €", "14 €", "16 €", "18 €"],
    correctIndex: 3,
    explanation: "The full menu (entrée + plat + dessert) costs 18 €, as shown in the last line.",
  },
  {
    id: 5,
    level: "A2",
    passageType: "Courriel",
    passage:
      "De : Direction\nÀ : Tout le personnel\nObjet : Fermeture exceptionnelle\n\nBonjour à tous,\n\nNous vous informons que les bureaux seront fermés le vendredi 14 juillet en raison du jour férié national. Le travail reprendra normalement le lundi 17 juillet.\n\nMerci de votre compréhension.\nLa Direction",
    question: "Pourquoi les bureaux sont-ils fermés le 14 juillet?",
    options: [
      "Pour des travaux de rénovation",
      "En raison d'un jour férié national",
      "À cause d'une grève",
      "Pour une réunion annuelle",
    ],
    correctIndex: 1,
    explanation: "The email says the offices will be closed 'en raison du jour férié national' — due to the national holiday.",
  },
  {
    id: 6,
    level: "A2",
    passageType: "Petite annonce",
    passage:
      "COURS DE FRANÇAIS\nPour débutants et niveau intermédiaire\nPetits groupes (6 personnes max.)\nLundi et mercredi, 18h00–20h00\nCentre culturel Alliance Française\nPrix : 150 € par mois\nInscriptions ouvertes jusqu'au 30 août",
    question: "Combien de personnes maximum peuvent participer à ces cours?",
    options: ["4 personnes", "6 personnes", "8 personnes", "10 personnes"],
    correctIndex: 1,
    explanation: "The ad specifies 'Petits groupes (6 personnes max.)' — small groups of a maximum of 6 people.",
  },
  {
    id: 7,
    level: "A2",
    passageType: "Règlement",
    passage:
      "BIBLIOTHÈQUE MUNICIPALE\nRègle importante :\nLes téléphones portables doivent être mis en mode silencieux à l'intérieur de la bibliothèque.\nLes boissons sont autorisées dans la salle de lecture mais la nourriture est interdite.\nMerci de respecter le silence.",
    question: "Qu'est-ce qui est interdit dans la bibliothèque?",
    options: [
      "Les téléphones portables",
      "Les boissons",
      "La nourriture",
      "Les enfants",
    ],
    correctIndex: 2,
    explanation: "The sign says 'la nourriture est interdite' — food is not allowed. Drinks are permitted but food is forbidden.",
  },
  {
    id: 8,
    level: "A2",
    passageType: "Lettre",
    passage:
      "Montréal, le 10 mars 2025\n\nMadame, Monsieur,\n\nNous avons bien reçu votre dossier de candidature pour le poste d'assistant administratif. Après examen, nous avons le regret de vous informer que votre candidature n'a pas été retenue.\n\nNous vous souhaitons bonne chance dans vos recherches.\n\nCordialement,\nService des ressources humaines",
    question: "Quel est le but de cette lettre?",
    options: [
      "Inviter la personne à un entretien",
      "Confirmer une embauche",
      "Informer que la candidature n'a pas été retenue",
      "Demander des documents supplémentaires",
    ],
    correctIndex: 2,
    explanation: "The letter says 'votre candidature n'a pas été retenue' — the application was not selected.",
  },
  {
    id: 9,
    level: "A2",
    passageType: "Programme",
    passage:
      "FESTIVAL DES CULTURES DU MONDE — Parc Lafontaine\nVendredi 20 juin : Concerts de jazz, 19h–23h (entrée libre)\nSamedi 21 juin : Spectacles de danse, 14h–18h, puis repas multiculturel, 19h–22h\nDimanche 22 juin : Marché artisanal, 10h–17h\nToutes les activités sont gratuites sauf le repas (25 $ par personne).",
    question: "Quelle activité est payante lors de ce festival?",
    options: [
      "Les concerts de jazz",
      "Les spectacles de danse",
      "Le repas multiculturel",
      "Le marché artisanal",
    ],
    correctIndex: 2,
    explanation: "The program states 'Toutes les activités sont gratuites sauf le repas (25 $ par personne)' — all activities are free except the multicultural meal.",
  },
  {
    id: 10,
    level: "A2",
    passageType: "Courriel",
    passage:
      "De : Pierre Morin\nObjet : Déménagement\n\nSalut!\n\nJe voulais te dire que j'ai enfin trouvé un appartement! Je déménage le week-end du 5–6 juillet. Est-ce que tu es disponible pour m'aider? En échange, je t'offre le repas et quelques bières.\n\nFais-moi signe!\nPierre",
    question: "Qu'est-ce que Pierre propose en échange de l'aide pour son déménagement?",
    options: [
      "De l'argent",
      "Un weekend de vacances",
      "Un repas et des boissons",
      "De l'aider à son tour",
    ],
    correctIndex: 2,
    explanation: "Pierre offers 'le repas et quelques bières' — a meal and some beers — in exchange for help moving.",
  },

  // ──────────────────────────────────────────────────────────────
  // B1 – B2  (Q 11–25)
  // ──────────────────────────────────────────────────────────────
  {
    id: 11,
    level: "B1",
    passageType: "Article",
    passage:
      "Le nombre de nouveaux arrivants francophones au Canada a augmenté de 40 % en cinq ans, selon un rapport publié par Immigration, Réfugiés et Citoyenneté Canada. Cette croissance est notamment due au programme des travailleurs qualifiés qui accorde un bonus de points aux candidats ayant de bonnes compétences en français. Les provinces comme le Nouveau-Brunswick, l'Ontario et le Manitoba cherchent activement à attirer des immigrants francophones pour soutenir leurs communautés de langue française.",
    question: "Selon l'article, quelle est la principale raison de l'augmentation des immigrants francophones?",
    options: [
      "La hausse des salaires au Canada",
      "Un programme qui favorise les candidats francophones",
      "La popularité de la culture québécoise",
      "La diminution du coût de la vie au Canada",
    ],
    correctIndex: 1,
    explanation: "The article attributes the growth notably to a skilled worker program that awards bonus points to candidates with good French skills.",
  },
  {
    id: 12,
    level: "B1",
    passageType: "Courriel professionnel",
    passage:
      "De : Département RH\nObjet : Formation obligatoire — Sécurité informatique\n\nBonjour,\n\nNous vous rappelons que la formation en ligne sur la sécurité informatique est obligatoire pour tous les employés. Vous avez jusqu'au 31 octobre pour la compléter. Cette formation prend environ deux heures.\n\nPour accéder à la formation, connectez-vous au portail RH avec vos identifiants habituels et cliquez sur «Formations obligatoires».\n\nTout employé n'ayant pas complété la formation à la date limite sera convoqué pour une séance en présentiel.\n\nCordialement,\nDépartement RH",
    question: "Que se passe-t-il si un employé ne complète pas la formation avant la date limite?",
    options: [
      "Il reçoit un avertissement écrit",
      "Il est convoqué pour une séance en présentiel",
      "Il doit refaire la formation en ligne",
      "Son accès au portail est bloqué",
    ],
    correctIndex: 1,
    explanation: "The email states that any employee who has not completed the training by the deadline will be called in for an in-person session ('séance en présentiel').",
  },
  {
    id: 13,
    level: "B1",
    passageType: "Article de magazine",
    passage:
      "La cuisine québécoise, longtemps méconnue hors de la province, connaît un renouveau remarquable. De nombreux chefs québécois réinterprètent les recettes traditionnelles — comme la tourtière, les cretons ou le sirop d'érable — en les adaptant aux tendances gastronomiques contemporaines. Ce mouvement culinaire attire l'attention des médias internationaux et contribue à valoriser l'identité culturelle du Québec sur la scène mondiale.",
    question: "Qu'est-ce que les chefs québécois font avec les recettes traditionnelles?",
    options: [
      "Ils les abandonnent pour adopter la cuisine française",
      "Ils les conservent sans modification",
      "Ils les réinterprètent selon les tendances contemporaines",
      "Ils les gardent secrètes",
    ],
    correctIndex: 2,
    explanation: "The article says many Quebec chefs 'réinterprètent' (reinterpret) traditional recipes by adapting them to contemporary gastronomic trends.",
  },
  {
    id: 14,
    level: "B1",
    passageType: "Offre d'emploi",
    passage:
      "RECHERCHE : Développeur web (H/F)\nEntreprise : TechMontréal inc.\nLieu : Montréal (télétravail partiel possible)\nProfil recherché :\n— Bac+3 en informatique ou équivalent\n— 2 ans d'expérience minimum en développement web\n— Maîtrise de React et Node.js\n— Bilinguisme français-anglais requis\n\nSalaire : à partir de 65 000 $ par an\nEnvoyer CV et lettre de motivation à : rh@techmontreal.ca",
    question: "Quelle compétence linguistique est exigée pour ce poste?",
    options: [
      "Le français uniquement",
      "L'anglais uniquement",
      "Le bilinguisme français-anglais",
      "Une troisième langue",
    ],
    correctIndex: 2,
    explanation: "The job posting states 'Bilinguisme français-anglais requis' — French-English bilingualism is required.",
  },
  {
    id: 15,
    level: "B1",
    passageType: "Lettre aux parents",
    passage:
      "Chères familles,\n\nNous vous informons que l'école sera fermée le jeudi 23 et le vendredi 24 novembre pour permettre la tenue des journées pédagogiques. Les élèves seront accueillis normalement à partir du lundi 27 novembre.\n\nDe plus, nous vous rappelons que les inscriptions pour les activités parascolaires du prochain trimestre sont ouvertes jusqu'au 15 novembre. Les formulaires sont disponibles au secrétariat ou sur notre site web.\n\nCordialement,\nLa Direction",
    question: "Jusqu'à quelle date les inscriptions aux activités parascolaires sont-elles ouvertes?",
    options: ["Le 23 novembre", "Le 24 novembre", "Le 15 novembre", "Le 27 novembre"],
    correctIndex: 2,
    explanation: "The letter says extra-curricular activity registrations are open until November 15 ('jusqu'au 15 novembre').",
  },
  {
    id: 16,
    level: "B2",
    passageType: "Article de presse",
    passage:
      "La pénurie de médecins de famille touche aujourd'hui plus de six millions de Canadiens qui n'ont pas accès à un médecin régulier. Pour pallier ce manque, plusieurs provinces ont autorisé les infirmières praticiennes à prendre en charge des patients sans supervision médicale directe. Ces professionnelles de santé peuvent désormais diagnostiquer certaines maladies courantes, renouveler des ordonnances et orienter les patients vers des spécialistes. Les médecins traditionnels, toutefois, expriment des réserves quant à la sécurité de cette approche pour les cas complexes.",
    question: "Quelle mesure a été prise pour faire face à la pénurie de médecins de famille?",
    options: [
      "Ouvrir davantage de facultés de médecine",
      "Recruter des médecins étrangers",
      "Autoriser les infirmières praticiennes à traiter des patients sans supervision directe",
      "Créer de nouveaux hôpitaux dans les régions rurales",
    ],
    correctIndex: 2,
    explanation: "Several provinces have authorized nurse practitioners ('infirmières praticiennes') to manage patients without direct medical supervision — a response to the family doctor shortage.",
  },
  {
    id: 17,
    level: "B2",
    passageType: "Chronique",
    passage:
      "La question du télétravail divise encore les entreprises canadiennes. D'un côté, des études montrent que les employés en télétravail sont en moyenne 13 % plus productifs et rapportent un meilleur équilibre vie professionnelle-vie personnelle. De l'autre, des dirigeants soulignent que le travail en présentiel favorise la créativité collective, le mentorat informel et le sentiment d'appartenance à l'entreprise. La réalité, comme souvent, se trouve sans doute entre les deux : un modèle hybride bien pensé semble offrir le meilleur des deux mondes.",
    question: "Quel avantage du télétravail est mentionné dans cet article?",
    options: [
      "Une meilleure créativité collective",
      "Un sentiment d'appartenance renforcé",
      "Une productivité accrue de 13 %",
      "Un meilleur mentorat informel",
    ],
    correctIndex: 2,
    explanation: "Studies show that remote workers are on average 13% more productive ('13 % plus productifs') and report a better work-life balance.",
  },
  {
    id: 18,
    level: "B2",
    passageType: "Rapport",
    passage:
      "Selon le dernier rapport du Commissariat aux langues officielles du Canada, l'usage du français dans les milieux de travail fédéraux a reculé dans plusieurs régions, y compris au Québec. Le rapport pointe notamment la croissance des communications numériques en anglais — courriels, plateformes de collaboration, logiciels — comme facteur principal de ce recul. Il recommande l'obligation pour les entreprises de fournir des outils de travail en français et de former les gestionnaires à l'utilisation des deux langues officielles.",
    question: "Selon le rapport, quelle est la principale cause du recul du français dans les milieux de travail fédéraux?",
    options: [
      "Le refus des employés d'utiliser le français",
      "La croissance des communications numériques en anglais",
      "Le manque de formation en langue française",
      "L'absence de politique linguistique nationale",
    ],
    correctIndex: 1,
    explanation: "The report identifies the growth of digital communications in English — emails, collaboration platforms, software — as the main factor behind the decline of French in federal workplaces.",
  },
  {
    id: 19,
    level: "B2",
    passageType: "Article économique",
    passage:
      "L'économie circulaire, qui vise à réduire les déchets en gardant les produits et matériaux en usage le plus longtemps possible, représente selon une étude récente une opportunité économique de 4,5 milliards de dollars par an pour l'industrie canadienne. Ce modèle s'oppose à l'économie linéaire traditionnelle — extraire, fabriquer, jeter — et repose sur trois principes : concevoir sans déchets ni pollution, garder les produits et matériaux en usage, et régénérer les systèmes naturels.",
    question: "Sur combien de principes l'économie circulaire repose-t-elle selon cet article?",
    options: ["Deux", "Trois", "Quatre", "Cinq"],
    correctIndex: 1,
    explanation: "The article says the circular economy rests on three principles ('trois principes'): designing without waste, keeping products in use, and regenerating natural systems.",
  },
  {
    id: 20,
    level: "B2",
    passageType: "Éditorial",
    passage:
      "Il serait tentant de voir dans la montée des populismes en Occident un simple rejet émotionnel de l'élite. Mais cette lecture réductrice occulte les causes structurelles du phénomène: la désindustrialisation, la stagnation des salaires réels pour les classes moyennes et populaires, et un sentiment croissant que les institutions démocratiques ne répondent plus aux besoins concrets des citoyens ordinaires. Traiter les symptômes sans s'attaquer aux causes profondes reviendrait à appliquer un pansement sur une fracture.",
    question: "Quelle lecture du populisme l'auteur critique-t-il?",
    options: [
      "Celle qui voit le populisme comme un phénomène économique",
      "Celle qui réduit le populisme à un simple rejet émotionnel de l'élite",
      "Celle qui associe le populisme à la montée du nationalisme",
      "Celle qui explique le populisme par les réseaux sociaux",
    ],
    correctIndex: 1,
    explanation: "The author criticizes the reductive reading that sees populism as merely an emotional rejection of the elite, arguing it obscures the structural causes.",
  },
  {
    id: 21,
    level: "B2",
    passageType: "Courriel",
    passage:
      "De : Marie-Claude Fontaine\nObjet : Demande de délai — dossier de candidature\n\nMadame, Monsieur,\n\nJe me permets de vous contacter au sujet de mon dossier de demande de résidence permanente, déposé le 3 janvier dernier. Le délai de traitement indiqué sur votre site est de six mois, soit jusqu'au 3 juillet.\n\nOr, je dois prendre une décision concernant mon emploi actuel avant le 15 juin. Serait-il possible d'obtenir une mise à jour sur l'état d'avancement de mon dossier avant cette date?\n\nJe vous remercie d'avance pour votre aide.\n\nCordialement,\nMarie-Claude Fontaine",
    question: "Pourquoi Marie-Claude Fontaine contacte-t-elle ce service?",
    options: [
      "Pour annuler sa demande de résidence permanente",
      "Pour obtenir des informations sur son dossier avant une date importante",
      "Pour corriger une erreur dans ses documents",
      "Pour demander un remboursement de frais",
    ],
    correctIndex: 1,
    explanation: "She needs to make a decision about her job before June 15 and is asking for an update on her file's progress before that date.",
  },
  {
    id: 22,
    level: "B2",
    passageType: "Article de société",
    passage:
      "Les jeunes Canadiens de la génération Z montrent une relation au travail fondamentalement différente de celle de leurs aînés. Selon une enquête récente, 68 % d'entre eux considèrent le sens de leur travail plus important que le salaire, et 74 % affirment qu'ils quitteraient un emploi si les valeurs de l'entreprise ne correspondaient pas aux leurs. Cette évolution pousse les employeurs à repenser leur marque employeur et à communiquer davantage sur leur impact social et environnemental.",
    question: "Que montre l'enquête sur les jeunes travailleurs de la génération Z?",
    options: [
      "Ils privilégient avant tout un salaire élevé",
      "Ils accordent plus d'importance au sens de leur travail qu'au salaire",
      "Ils préfèrent le télétravail à tout autre avantage",
      "Ils restent longtemps dans la même entreprise",
    ],
    correctIndex: 1,
    explanation: "68% of Gen Z workers consider the meaning of their work more important than salary ('plus important que le salaire').",
  },
  {
    id: 23,
    level: "B2",
    passageType: "Lettre de lecteur",
    passage:
      "Monsieur le Rédacteur en chef,\n\nVotre récent article sur la hausse des frais de scolarité universitaires présentait les arguments des gouvernements favorables à cette hausse, mais omettait de mentionner les données montrant que les pays où l'université est gratuite ou peu coûteuse obtiennent de meilleurs résultats en termes de mobilité sociale et d'innovation économique. Il me semblerait utile d'équilibrer le traitement de ce sujet dans vos prochains numéros.\n\nCordialement,\nUn lecteur engagé",
    question: "Quelle critique ce lecteur adresse-t-il au journal?",
    options: [
      "L'article était trop court",
      "L'article ne présentait qu'un seul point de vue sur la hausse des frais",
      "Le journal ne traite jamais de sujets éducatifs",
      "Les données citées étaient incorrectes",
    ],
    correctIndex: 1,
    explanation: "The reader criticizes the article for only presenting arguments in favor of tuition fee increases, while omitting data showing the benefits of low-cost or free university education.",
  },
  {
    id: 24,
    level: "B2",
    passageType: "Brochure touristique",
    passage:
      "Le Vieux-Québec, inscrit au patrimoine mondial de l'UNESCO depuis 1985, est la seule ville fortifiée au nord du Mexique. Ses ruelles pavées, ses fortifications du XVIIe siècle et son architecture à l'européenne lui confèrent un charme unique en Amérique du Nord. Les visiteurs peuvent explorer le Château Frontenac, symbole de la ville, la Plaine d'Abraham, théâtre de la célèbre bataille de 1759, et le quartier du Petit-Champlain, l'un des plus anciens quartiers commerciaux du continent.",
    question: "Quelle distinction UNESCO le Vieux-Québec a-t-il obtenu?",
    options: [
      "Meilleure destination touristique d'Amérique",
      "Patrimoine mondial depuis 1985",
      "Site historique national depuis 1975",
      "Réserve culturelle internationale",
    ],
    correctIndex: 1,
    explanation: "Old Quebec has been a UNESCO World Heritage Site ('inscrit au patrimoine mondial de l'UNESCO') since 1985.",
  },
  {
    id: 25,
    level: "B2",
    passageType: "Document officiel",
    passage:
      "La Loi sur les langues officielles du Canada reconnaît le français et l'anglais comme les deux langues officielles du pays. Elle oblige le gouvernement fédéral à offrir ses services dans les deux langues dans les régions désignées bilingues. Les Canadiens ont le droit de travailler dans la langue officielle de leur choix dans les institutions fédérales. La loi a été renforcée en 2023 par des amendements visant à mieux protéger le français, notamment au Québec et dans les communautés francophones hors Québec.",
    question: "Qu'ont obtenu les Canadiens grâce à la Loi sur les langues officielles concernant le travail dans les institutions fédérales?",
    options: [
      "Le droit de refuser de parler anglais",
      "Le droit de travailler dans la langue officielle de leur choix",
      "L'obligation de parler les deux langues",
      "Une prime de bilinguisme automatique",
    ],
    correctIndex: 1,
    explanation: "The law gives Canadians the right to work in the official language of their choice ('dans la langue officielle de leur choix') in federal institutions.",
  },

  // ──────────────────────────────────────────────────────────────
  // C1 – C2  (Q 26–39)
  // ──────────────────────────────────────────────────────────────
  {
    id: 26,
    level: "C1",
    passageType: "Essai",
    passage:
      "La notion de «capital culturel» forgée par Pierre Bourdieu permet de comprendre pourquoi le système éducatif, malgré ses ambitions méritocratiques, reproduit souvent les inégalités sociales plutôt qu'il ne les corrige. Les élèves issus de milieux favorisés arrivent à l'école dotés d'un ensemble de codes, de références et de dispositions cognitives qui correspondent précisément à ce que l'institution valorise. L'école ne crée pas ces avantages — elle les reconnaît et les récompense, transformant un privilège social en mérite individuel apparent.",
    question: "Comment Bourdieu explique-t-il la reproduction des inégalités par l'école?",
    options: [
      "L'école favorise délibérément les enfants riches",
      "Les enseignants font preuve de discrimination",
      "L'école valorise les codes et dispositions que les élèves favorisés possèdent déjà",
      "Les programmes scolaires sont conçus par des élites",
    ],
    correctIndex: 2,
    explanation: "Bourdieu argues that school values the codes, references and cognitive dispositions that privileged students already possess when they arrive, transforming social privilege into apparent individual merit.",
  },
  {
    id: 27,
    level: "C1",
    passageType: "Extrait littéraire",
    passage:
      "Elle était revenue dans la maison de son enfance après vingt ans d'absence. Tout était à la fois identique et méconnaissable — le même papier peint à fleurs, mais passé; les mêmes meubles, mais rapetissés par le temps ou par sa propre croissance. Elle comprit alors que le retour n'est jamais un retour au même, mais un face-à-face avec le fossé entre ce qu'on était et ce qu'on est devenu. La nostalgie, réalisa-t-elle, n'est pas un sentiment pour le passé mais pour le soi qu'on a perdu.",
    question: "Quelle réflexion le retour dans la maison d'enfance provoque-t-il chez la narratrice?",
    options: [
      "La joie de retrouver ses souvenirs intacts",
      "La tristesse face à la dégradation de la maison",
      "La prise de conscience que le retour révèle le fossé entre passé et présent de soi",
      "Le désir de recommencer une nouvelle vie",
    ],
    correctIndex: 2,
    explanation: "The return makes her realize that going back is not a return to the same, but a confrontation with the gap between who she was and who she has become — nostalgia is for the lost self, not the past.",
  },
  {
    id: 28,
    level: "C1",
    passageType: "Analyse politique",
    passage:
      "La montée en puissance des algorithmes dans la formation de l'opinion publique soulève des questions fondamentales pour les démocraties libérales. Les «chambres d'écho» créées par les plateformes numériques ne sont pas un phénomène accidentel: elles résultent de modèles économiques qui maximisent l'engagement en exposant les utilisateurs à des contenus confirmant leurs croyances existantes. En polarisant l'espace public, ces mécanismes fragilisent les conditions mêmes du débat démocratique, qui suppose la rencontre d'opinions divergentes dans un espace commun.",
    question: "Pourquoi l'auteur considère-t-il les «chambres d'écho» numériques comme un problème démocratique?",
    options: [
      "Elles réduisent la participation électorale",
      "Elles exposent les utilisateurs à des opinions fausses",
      "Elles fragmentent l'espace public et empêchent la rencontre d'opinions divergentes",
      "Elles permettent aux gouvernements de surveiller les citoyens",
    ],
    correctIndex: 2,
    explanation: "Echo chambers fragment public space and undermine the very conditions for democratic debate, which requires the encounter of divergent opinions in a shared space.",
  },
  {
    id: 29,
    level: "C1",
    passageType: "Article scientifique",
    passage:
      "Les recherches sur le microbiome intestinal ont révolutionné notre compréhension du lien entre alimentation et santé mentale. L'axe intestin-cerveau, longtemps négligé par la médecine conventionnelle, constitue un système de communication bidirectionnel complexe. Des études récentes suggèrent que certaines bactéries intestinales produisent des précurseurs de neurotransmetteurs — dont la sérotonine — affectant directement l'humeur, l'anxiété et la cognition. Ces découvertes ouvrent des perspectives thérapeutiques inédites pour le traitement des troubles dépressifs.",
    question: "Quelle découverte concernant l'axe intestin-cerveau est mentionnée dans cet article?",
    options: [
      "L'intestin produit directement des hormones cérébrales",
      "Des bactéries intestinales produisent des précurseurs de neurotransmetteurs affectant l'humeur",
      "La dépression est essentiellement causée par une mauvaise alimentation",
      "Le microbiome intestinal remplace les traitements antidépresseurs",
    ],
    correctIndex: 1,
    explanation: "Studies suggest that certain gut bacteria produce neurotransmitter precursors — including serotonin — directly affecting mood, anxiety and cognition.",
  },
  {
    id: 30,
    level: "C1",
    passageType: "Commentaire culturel",
    passage:
      "Le roman québécois contemporain se caractérise par une exploration remarquable des identités plurielles et des appartenances multiples. Des auteurs comme Kim Thúy, Dany Laferrière et Akira Mizubayashi incarnent une littérature de l'entre-deux, où les langues, les cultures et les histoires personnelles s'interpénètrent. Cette écriture de la traversée — ni nostalgie du pays quitté ni célébration naïve du pays d'accueil — offre peut-être la représentation la plus juste de l'expérience migratoire contemporaine.",
    question: "Comment l'auteur caractérise-t-il l'écriture des auteurs migrants contemporains?",
    options: [
      "Une nostalgie du pays d'origine",
      "Une célébration du pays d'accueil",
      "Une littérature de l'entre-deux, entre cultures, langues et histoires personnelles",
      "Un rejet de l'identité d'origine",
    ],
    correctIndex: 2,
    explanation: "The author describes this writing as 'littérature de l'entre-deux' — a literature of the in-between, where languages, cultures and personal histories interpenetrate, neither nostalgic nor naively celebratory.",
  },
  {
    id: 31,
    level: "C1",
    passageType: "Rapport économique",
    passage:
      "La transition énergétique représente à la fois le plus grand défi et la plus grande opportunité économique du vingt-et-unième siècle pour le Canada. Avec ses ressources naturelles abondantes, ses capacités hydroélectriques et son réseau universitaire de recherche, le pays est particulièrement bien positionné pour développer une économie verte compétitive. Toutefois, la dépendance structurelle aux hydrocarbures dans certaines provinces crée des tensions politiques qui ralentissent la mise en œuvre de politiques climatiques cohérentes à l'échelle nationale.",
    question: "Selon ce rapport, quel obstacle principal freine la transition énergétique au Canada?",
    options: [
      "Le manque de ressources naturelles",
      "L'insuffisance des recherches universitaires",
      "La dépendance aux hydrocarbures dans certaines provinces créant des tensions politiques",
      "L'absence de politique énergétique fédérale",
    ],
    correctIndex: 2,
    explanation: "The structural dependence on hydrocarbons in certain provinces creates political tensions that slow down the implementation of coherent climate policies at the national level.",
  },
  {
    id: 32,
    level: "C1",
    passageType: "Analyse historique",
    passage:
      "La Conquête britannique de 1760 et ses conséquences sur le développement du Canada francophone font l'objet d'interprétations historiographiques divergentes. Pour certains historiens nationalistes québécois, la Conquête constitue un «trauma fondateur» qui explique les inégalités économiques et culturelles persistantes entre francophones et anglophones. Pour d'autres, cette lecture téléologique occulte la complexité des dynamiques sociales internes à la société canadienne-française et surévalue l'impact de la discontinuité politique de 1760.",
    question: "Quel débat historiographique cet extrait expose-t-il?",
    options: [
      "Si la Conquête de 1760 a eu lieu ou non",
      "Si la Conquête constitue un trauma fondateur ou si cette lecture est trop simpliste",
      "Si les Français auraient dû défendre le Canada plus vigoureusement",
      "Si le Canada aurait dû rester une colonie française",
    ],
    correctIndex: 1,
    explanation: "The extract presents a debate between historians who see the Conquest as a founding trauma explaining persistent inequalities, and those who consider this teleological reading too simplistic.",
  },
  {
    id: 33,
    level: "C2",
    passageType: "Essai philosophique",
    passage:
      "La conception rawlsienne de la justice comme équité repose sur une expérience de pensée célèbre: le «voile d'ignorance». Derrière ce voile, les individus ignorent leur position sociale future et sont donc incités à concevoir des principes de justice qui seraient acceptables quelle que soit la place qu'ils occuperaient dans la société. Ce dispositif procédural vise à neutraliser les biais liés aux intérêts particuliers et à simuler une impartialité radicale. Ses critiques, notamment communautariens et féministes, contestent toutefois l'idée que l'on puisse abstraire les individus de leurs appartenances concrètes sans appauvrir la délibération morale.",
    question: "Quelle est la critique principale adressée à l'expérience de pensée rawlsienne du voile d'ignorance?",
    options: [
      "Elle favorise les individus les plus riches",
      "Elle est impossible à réaliser concrètement",
      "Elle abstrait les individus de leurs appartenances concrètes, appauvrissant la délibération morale",
      "Elle ne tient pas compte des différences culturelles",
    ],
    correctIndex: 2,
    explanation: "Communitarian and feminist critics contest the idea that one can abstract individuals from their concrete social ties without impoverishing moral deliberation.",
  },
  {
    id: 34,
    level: "C2",
    passageType: "Critique littéraire",
    passage:
      "L'œuvre d'Anne Hébert occupe une place singulière dans la littérature québécoise: celle d'une écrivaine qui a su, avant beaucoup d'autres, représenter l'enfermement psychologique des femmes dans une société patriarcale et catholique. Dans «Kamouraska», le récit fragmenté mime le travail de la mémoire traumatique: la linéarité narrative est brisée, les temporalités se superposent, et la voix narrative oscille entre lucidité et délire. Cette forme n'est pas un ornement stylistique — elle est l'inscription dans la langue même de l'expérience dissociative du trauma.",
    question: "Pourquoi l'auteur de cet article considère-t-il la forme narrative fragmentée de «Kamouraska» significative?",
    options: [
      "Parce qu'elle rend le roman plus difficile à lire",
      "Parce qu'elle reflète le style de l'époque",
      "Parce qu'elle inscrit dans la langue même l'expérience dissociative du trauma",
      "Parce qu'elle permet de raconter plusieurs histoires simultanément",
    ],
    correctIndex: 2,
    explanation: "The fragmentary form is not a stylistic ornament — it inscribes in the language itself the dissociative experience of trauma, mirroring how traumatic memory works.",
  },
  {
    id: 35,
    level: "C2",
    passageType: "Analyse sociologique",
    passage:
      "La précarisation du travail ne concerne plus seulement les travailleurs peu qualifiés. Elle touche désormais des catégories professionnelles qui se croyaient à l'abri: journalistes, chercheurs, juristes, professionnels de la santé. Cette «précarité des qualifiés» constitue un phénomène structurellement différent de la précarité traditionnelle: elle coexiste avec un niveau d'éducation élevé, des aspirations professionnelles fortes, et un accès difficile à un statut correspondant aux investissements consentis. Elle génère ainsi une frustration spécifique — ce que certains sociologues appellent le «déclassement ressenti».",
    question: "Qu'est-ce que les sociologues appellent le «déclassement ressenti»?",
    options: [
      "La perte réelle de statut social due au chômage",
      "La frustration des qualifiés dont le statut ne correspond pas à leurs investissements éducatifs",
      "Le sentiment d'infériorité des travailleurs manuels",
      "La comparaison négative avec les générations précédentes",
    ],
    correctIndex: 1,
    explanation: "'Déclassement ressenti' describes the specific frustration of highly-educated professionals whose professional status does not correspond to the educational investments they have made.",
  },
  {
    id: 36,
    level: "C2",
    passageType: "Théorie politique",
    passage:
      "La notion de «démocratie illibérale», popularisée par Viktor Orbán et reprise par d'autres dirigeants populistes, constitue une contradiction dans les termes pour les théoriciens libéraux classiques. Pour eux, la démocratie sans libéralisme — sans protection des droits fondamentaux, sans séparation des pouvoirs, sans presse libre — n'est pas une démocratie atypique mais une autocratie qui emprunte le langage de la légitimité populaire pour masquer sa nature. Le suffrage universel n'est pas une condition suffisante de la démocratie; il en est une condition nécessaire mais non suffisante.",
    question: "Pourquoi les théoriciens libéraux classiques rejettent-ils la notion de «démocratie illibérale»?",
    options: [
      "Parce qu'une démocratie ne peut exister sans économie de marché",
      "Parce qu'une démocratie sans protections libérales est, selon eux, une autocratie déguisée",
      "Parce que le suffrage universel est incompatible avec le libéralisme",
      "Parce que cette notion est trop vague pour être utile",
    ],
    correctIndex: 1,
    explanation: "For classical liberal theorists, democracy without liberalism — without fundamental rights, separation of powers, free press — is not an atypical democracy but an autocracy using the language of popular legitimacy.",
  },
  {
    id: 37,
    level: "C2",
    passageType: "Philosophie du langage",
    passage:
      "Wittgenstein, dans ses Recherches philosophiques, remet en cause l'idée cartésienne d'un langage purement privé. L'argument est célèbre: si les mots tiraient leur sens d'expériences intérieures purement subjectives, aucune correction ne serait possible et la notion même de «suivre une règle» perdrait son sens. Le langage est fondamentalement public — il vit dans les pratiques sociales, dans ce que Wittgenstein appelle les «jeux de langage». Cette thèse a des implications profondes pour l'épistémologie, l'éthique et la philosophie de l'esprit.",
    question: "Quel argument Wittgenstein avance-t-il contre l'idée d'un langage purement privé?",
    options: [
      "Un langage privé serait trop complexe à apprendre",
      "Sans dimension publique, aucune correction ne serait possible et suivre une règle n'aurait plus de sens",
      "Les langues privées n'ont jamais existé dans l'histoire",
      "Un langage privé ne pourrait pas exprimer les émotions",
    ],
    correctIndex: 1,
    explanation: "Wittgenstein argues that if words derived their meaning from purely subjective inner experiences, no correction would be possible and the notion of 'following a rule' would lose its meaning — language must be fundamentally public.",
  },
  {
    id: 38,
    level: "C2",
    passageType: "Éditorial complexe",
    passage:
      "Les sociétés libérales démocratiques font face à un paradoxe profond: les mêmes libertés fondamentales qui constituent leur essence — liberté d'expression, liberté de réunion, pluralisme politique — peuvent être instrumentalisées par des acteurs qui ont pour objectif déclaré de les abolir. Ce que Karl Popper nommait le «paradoxe de la tolérance»: une société qui tolère l'intolérance de manière illimitée finit par perdre sa tolérance. La réponse institutionnelle à ce paradoxe — jusqu'où peut-on limiter les libertés pour protéger la liberté? — reste l'un des problèmes non résolus de la théorie démocratique.",
    question: "En quoi consiste le «paradoxe de la tolérance» selon Popper?",
    options: [
      "La tolérance rend les sociétés vulnérables aux crises économiques",
      "Une société qui tolère l'intolérance sans limites risque de perdre sa propre tolérance",
      "Les sociétés tolérantes sont moins efficaces politiquement",
      "La tolérance et la liberté d'expression sont incompatibles",
    ],
    correctIndex: 1,
    explanation: "Popper's paradox of tolerance states that a society which tolerates intolerance without limit will eventually lose its tolerance — the very freedoms that define liberal democracy can be used to abolish them.",
  },
  {
    id: 39,
    level: "C2",
    passageType: "Résumé académique",
    passage:
      "Cette étude examine les mécanismes par lesquels les représentations médiatiques de l'immigration construisent des cadres interprétatifs qui orientent la perception publique. En mobilisant l'analyse de cadrage (framing analysis) et la théorie de l'agenda-setting, nous montrons que la surreprésentation des discours sécuritaires dans les médias généralistes canadiens de 2010 à 2020 a contribué à une perception déformée des risques associés à l'immigration, sans lien avec les données empiriques disponibles. Ces résultats soulignent la responsabilité éditoriale des médias dans la formation d'une opinion publique éclairée.",
    question: "Quelle est la conclusion principale de cette étude sur les médias et l'immigration?",
    options: [
      "Les médias canadiens sont généralement équilibrés dans leur couverture de l'immigration",
      "La surreprésentation des discours sécuritaires a créé une perception déformée des risques liés à l'immigration",
      "Le public canadien est bien informé sur les questions d'immigration",
      "L'analyse de cadrage n'est pas adaptée à l'étude des médias",
    ],
    correctIndex: 1,
    explanation: "The study shows that the overrepresentation of security discourses in mainstream Canadian media from 2010 to 2020 contributed to a distorted perception of immigration-related risks, unsupported by available empirical data.",
  },
];

export function estimateCLBFromReading(correct: number): {
  clb: string;
  cefr: string;
  description: string;
} {
  const pct = correct / 39;
  if (pct >= 0.92)
    return { clb: "CLB 12", cefr: "C2", description: "Near-native proficiency" };
  if (pct >= 0.79)
    return { clb: "CLB 10–11", cefr: "C1", description: "Advanced proficiency" };
  if (pct >= 0.67)
    return { clb: "CLB 8–9", cefr: "B2", description: "Upper-intermediate" };
  if (pct >= 0.54)
    return { clb: "CLB 7", cefr: "B1+", description: "Intermediate — PR threshold" };
  if (pct >= 0.41)
    return { clb: "CLB 6", cefr: "B1", description: "Lower-intermediate" };
  if (pct >= 0.28)
    return { clb: "CLB 5", cefr: "A2+", description: "Elementary" };
  if (pct >= 0.15)
    return { clb: "CLB 4", cefr: "A2", description: "Basic" };
  return { clb: "Below CLB 4", cefr: "A1", description: "Beginner" };
}
