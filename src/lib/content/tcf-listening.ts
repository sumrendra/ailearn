/**
 * TCF Canada — Compréhension Orale (Listening) question bank.
 *
 * 39 questions mirroring the real exam's three-band structure:
 *   Q 1–10   A1–A2  everyday situations, simple vocabulary
 *   Q 11–25  B1–B2  interviews, news, workplace, daily life
 *   Q 26–39  C1–C2  debates, academic lectures, complex argument
 *
 * audioScript is read aloud by browser TTS (french-tts.ts).
 * Questions and options are in French, as in the real exam.
 * Explanations are in English for the learner's benefit.
 */

export type TCFLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface TCFListeningQuestion {
  id: number;
  level: TCFLevel;
  topic: string;
  audioScript: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const TCF_LISTENING: TCFListeningQuestion[] = [
  // ──────────────────────────────────────────────────────────────
  // A1 – A2  (Q 1–10) — simple, everyday French
  // ──────────────────────────────────────────────────────────────
  {
    id: 1,
    level: "A1",
    topic: "Au café",
    audioScript:
      "Bonjour! Je voudrais un café et un croissant, s'il vous plaît. — Très bien. Vous payez comment? — Par carte, s'il vous plaît. — Voilà. Bonne journée! — Merci, bonne journée!",
    question: "Comment cette personne paie-t-elle?",
    options: ["En espèces", "Par carte", "Par chèque", "Elle ne paie pas"],
    correctIndex: 1,
    explanation: "The customer asks to pay 'par carte' (by card).",
  },
  {
    id: 2,
    level: "A1",
    topic: "Annonce de magasin",
    audioScript:
      "Bienvenue au magasin Carrefour. Notre magasin est ouvert du lundi au vendredi, de neuf heures à vingt heures, et le samedi de dix heures à dix-huit heures. Le dimanche, notre magasin est fermé.",
    question: "Quand le magasin est-il fermé?",
    options: ["Le lundi", "Le vendredi soir", "Le samedi", "Le dimanche"],
    correctIndex: 3,
    explanation: "The announcement says the store is 'fermé' (closed) on Sunday (le dimanche).",
  },
  {
    id: 3,
    level: "A1",
    topic: "Météo",
    audioScript:
      "Bonjour. La météo pour aujourd'hui: il fait beau et chaud à Paris, avec vingt-cinq degrés. Mais attention, demain il va pleuvoir. N'oubliez pas votre parapluie!",
    question: "Quel temps fait-il aujourd'hui à Paris?",
    options: ["Il pleut", "Il neige", "Il fait beau et chaud", "Il y a du vent"],
    correctIndex: 2,
    explanation: "The forecast says 'il fait beau et chaud' (sunny and warm) today, with 25 degrees. It will rain tomorrow.",
  },
  {
    id: 4,
    level: "A1",
    topic: "Annonce en gare",
    audioScript:
      "Attention s'il vous plaît. Le train pour Lyon partira du quai numéro sept, à quinze heures vingt. Ce train est en retard de dix minutes. Nous vous prions d'excuser ce retard.",
    question: "De quel quai part le train pour Lyon?",
    options: ["Quai 3", "Quai 5", "Quai 7", "Quai 9"],
    correctIndex: 2,
    explanation: "The announcement says the train for Lyon departs from platform 7 (quai numéro sept).",
  },
  {
    id: 5,
    level: "A1",
    topic: "Message téléphonique",
    audioScript:
      "Bonjour, c'est Marie. Je t'appelle pour te dire que je suis libre samedi soir. Est-ce que tu veux venir dîner chez moi? Appelle-moi quand tu peux. À bientôt!",
    question: "Pourquoi Marie téléphone-t-elle?",
    options: [
      "Pour annuler un rendez-vous",
      "Pour inviter quelqu'un à dîner",
      "Pour demander de l'aide",
      "Pour donner son adresse",
    ],
    correctIndex: 1,
    explanation: "Marie calls to invite someone to dinner at her place on Saturday evening.",
  },
  {
    id: 6,
    level: "A1",
    topic: "Au supermarché",
    audioScript:
      "Excusez-moi, où se trouvent les yaourts, s'il vous plaît? — Les yaourts sont au rayon produits laitiers, à droite après les caisses, au fond du magasin. — Merci beaucoup! — De rien!",
    question: "Où sont les yaourts?",
    options: [
      "À l'entrée du magasin",
      "À gauche des caisses",
      "Au fond, à droite après les caisses",
      "Au rayon fruits et légumes",
    ],
    correctIndex: 2,
    explanation: "The employee says the yogurts are in the dairy aisle, to the right after the checkouts, at the back of the store.",
  },
  {
    id: 7,
    level: "A1",
    topic: "Rendez-vous médical",
    audioScript:
      "Cabinet médical du docteur Dupont. Bonjour. — Bonjour, je voudrais prendre un rendez-vous, s'il vous plaît. — Bien sûr. Êtes-vous un nouveau patient? — Oui, c'est la première fois. — D'accord. Mardi à onze heures, ça vous convient? — Oui, parfait, merci!",
    question: "Quand est le rendez-vous?",
    options: ["Lundi à 10h", "Mardi à 11h", "Mercredi à 11h", "Jeudi à 9h"],
    correctIndex: 1,
    explanation: "The appointment is set for Tuesday (mardi) at eleven o'clock (onze heures).",
  },
  {
    id: 8,
    level: "A2",
    topic: "À l'hôtel",
    audioScript:
      "Bonsoir monsieur. — Bonsoir. J'ai une réservation au nom de Martin. — Oui, une chambre double pour trois nuits, du vingt au vingt-trois juin. C'est bien ça? — Oui, c'est exact. Voici votre clé. Vous êtes en chambre quarante-deux, au quatrième étage.",
    question: "Combien de nuits M. Martin va-t-il rester à l'hôtel?",
    options: ["1 nuit", "2 nuits", "3 nuits", "4 nuits"],
    correctIndex: 2,
    explanation: "The receptionist confirms a reservation for 'trois nuits' (three nights), from June 20 to 23.",
  },
  {
    id: 9,
    level: "A2",
    topic: "Au restaurant",
    audioScript:
      "Bonsoir. Vous avez réservé? — Oui, pour deux personnes au nom de Lebrun. — Très bien. Voici vos menus. Aujourd'hui, notre plat du jour est un saumon grillé avec des légumes de saison. Et comme dessert, nous avons une tarte tatin maison. — Parfait, nous allons réfléchir.",
    question: "Quel est le plat du jour?",
    options: ["Un steak frites", "Un poulet rôti", "Un saumon grillé", "Un bœuf bourguignon"],
    correctIndex: 2,
    explanation: "The waiter says the daily special is 'un saumon grillé avec des légumes de saison' (grilled salmon with seasonal vegetables).",
  },
  {
    id: 10,
    level: "A2",
    topic: "À la bibliothèque",
    audioScript:
      "Bonjour. Je cherche des livres pour apprendre le français. Est-ce que vous avez des manuels pour les débutants? — Oui, nos livres de langues sont au premier étage, section F. Vous pouvez emprunter jusqu'à quatre livres pour une durée de trois semaines. L'inscription est gratuite.",
    question: "Où se trouvent les livres de langues?",
    options: [
      "Au rez-de-chaussée",
      "Au premier étage",
      "Au deuxième étage",
      "Au sous-sol",
    ],
    correctIndex: 1,
    explanation: "The librarian says the language books are on the first floor ('premier étage'), section F.",
  },

  // ──────────────────────────────────────────────────────────────
  // B1 – B2  (Q 11–25) — intermediate, news, workplace, immigration
  // ──────────────────────────────────────────────────────────────
  {
    id: 11,
    level: "B1",
    topic: "Entretien d'embauche",
    audioScript:
      "Bonjour Monsieur Tremblay. Vous postulez pour le poste de comptable. Vous avez trois ans d'expérience dans ce domaine, c'est bien ça? — En fait, j'ai cinq ans d'expérience. J'ai travaillé deux ans dans une banque à Paris et ensuite trois ans dans une PME ici à Montréal. — Très bien. Et pourquoi souhaitez-vous changer d'emploi? — Je cherche de nouvelles responsabilités et un meilleur équilibre travail-vie personnelle.",
    question: "Combien d'années d'expérience M. Tremblay a-t-il?",
    options: ["Trois ans", "Quatre ans", "Cinq ans", "Six ans"],
    correctIndex: 2,
    explanation: "M. Tremblay corrects the interviewer: he has five years of experience ('cinq ans') — two years at a bank in Paris and three years at a SME in Montreal.",
  },
  {
    id: 12,
    level: "B1",
    topic: "Rapport radio: logement",
    audioScript:
      "Trouver un appartement à Montréal n'est pas facile pour les nouveaux arrivants. Les loyers ont augmenté de trente pour cent en cinq ans. Les experts conseillent de commencer les recherches au moins deux mois avant l'arrivée et de contacter directement les propriétaires. Les quartiers comme Rosemont et Verdun sont populaires pour leur accessibilité.",
    question: "De combien les loyers ont-ils augmenté en cinq ans à Montréal?",
    options: ["10 %", "20 %", "30 %", "40 %"],
    correctIndex: 2,
    explanation: "The radio report says rents have increased by 30% ('trente pour cent') in five years.",
  },
  {
    id: 13,
    level: "B1",
    topic: "Apprendre le français",
    audioScript:
      "Ça fait combien de temps que tu apprends le français? — Ça fait presque deux ans. Au début, c'était vraiment difficile, surtout la prononciation. Maintenant, je me débrouille bien à l'oral, mais l'écrit reste compliqué — les accents, les conjugaisons. Je prends des cours deux fois par semaine et j'essaie de regarder des films en français.",
    question: "Qu'est-ce que cette personne trouve encore difficile en français?",
    options: ["La prononciation", "L'oral", "L'écrit", "La compréhension orale"],
    correctIndex: 2,
    explanation: "The speaker says they manage well orally now, but writing ('l'écrit') remains complicated — accents and conjugations are still challenging.",
  },
  {
    id: 14,
    level: "B1",
    topic: "Résidence permanente",
    audioScript:
      "Bonjour, j'aimerais des informations sur la résidence permanente. — Bien sûr. Pour le programme des travailleurs qualifiés, vous devez avoir au moins un an d'expérience de travail au Canada, un niveau de français de CLB sept au minimum. Une offre d'emploi n'est pas obligatoire mais est un atout important. Le traitement des dossiers prend entre six et dix-huit mois.",
    question: "Quel est le niveau minimum de français requis pour le programme des travailleurs qualifiés?",
    options: ["CLB 5", "CLB 6", "CLB 7", "CLB 8"],
    correctIndex: 2,
    explanation: "The immigration officer specifies a minimum French level of CLB 7 ('CLB sept au minimum') for the skilled worker program.",
  },
  {
    id: 15,
    level: "B1",
    topic: "Journal radio",
    audioScript:
      "La ville de Québec a annoncé aujourd'hui un investissement de cinquante millions de dollars pour améliorer les transports en commun. Ce projet prévoit la construction de trois nouvelles lignes de bus et l'achat de vingt autobus électriques. Les travaux devraient commencer en mars et se terminer avant la fin de l'année prochaine.",
    question: "Quel est le montant de l'investissement annoncé par la ville de Québec?",
    options: [
      "5 millions de dollars",
      "15 millions de dollars",
      "50 millions de dollars",
      "500 millions de dollars",
    ],
    correctIndex: 2,
    explanation: "The news report says Quebec City announced an investment of 50 million dollars ('cinquante millions de dollars') to improve public transit.",
  },
  {
    id: 16,
    level: "B1",
    topic: "Réunion de travail",
    audioScript:
      "Bon, j'ouvre la réunion. L'ordre du jour d'aujourd'hui, c'est la présentation du nouveau projet clientèle. Nous avons trois semaines pour finaliser notre proposition. Sophie, pouvez-vous nous présenter le budget? — Bien sûr. Nous avons alloué soixante pour cent du budget à la phase de développement et vingt pour cent à la communication. Le reste est encore à définir.",
    question: "Quel pourcentage du budget est alloué au développement?",
    options: ["20 %", "40 %", "60 %", "80 %"],
    correctIndex: 2,
    explanation: "Sophie says 60% ('soixante pour cent') of the budget has been allocated to the development phase.",
  },
  {
    id: 17,
    level: "B1",
    topic: "Consultation médicale",
    audioScript:
      "Docteur, je me sens très fatigué depuis quelques semaines. — Est-ce que vous dormez suffisamment? — Environ six heures par nuit. — C'est un peu peu — idéalement sept à neuf heures. Mangez-vous équilibré? — Pas vraiment. — Je vais vous prescrire une prise de sang pour vérifier votre bilan. En attendant, essayez de dormir plus et de manger plus de légumes.",
    question: "Quelle analyse le médecin prescrit-il?",
    options: ["Une radiographie", "Une prise de sang", "Une analyse d'urine", "Une IRM"],
    correctIndex: 1,
    explanation: "The doctor says 'je vais vous prescrire une prise de sang' (I'll prescribe a blood test) to check the patient's health panel.",
  },
  {
    id: 18,
    level: "B2",
    topic: "Radio: marché immobilier",
    audioScript:
      "Les nouvelles données montrent que le marché immobilier canadien reste l'un des plus difficiles d'accès pour les jeunes ménages. À Toronto et Vancouver, le prix médian d'une maison dépasse maintenant le million de dollars. Les experts s'accordent à dire que sans une augmentation significative de l'offre de logements abordables et une régulation plus stricte des investissements étrangers, la situation ne pourra que s'aggraver.",
    question: "Selon les experts, qu'est-ce qui est nécessaire pour améliorer la situation immobilière?",
    options: [
      "Augmenter les taux d'intérêt",
      "Augmenter l'offre de logements abordables et réguler les investissements étrangers",
      "Interdire l'immigration",
      "Réduire les taxes foncières",
    ],
    correctIndex: 1,
    explanation: "Experts say two things are needed: a significant increase in affordable housing supply and stricter regulation of foreign investments.",
  },
  {
    id: 19,
    level: "B2",
    topic: "Semaine de quatre jours",
    audioScript:
      "De plus en plus d'entreprises adoptent la semaine de travail de quatre jours sans réduction de salaire. Des études menées en Islande et en Grande-Bretagne montrent que cette mesure améliore le bien-être des employés sans diminuer la productivité — dans certains cas, elle l'augmente même. Cependant, certains secteurs comme la santé ou le commerce de détail restent difficiles à adapter à ce nouveau modèle.",
    question: "Que montrent les études sur la semaine de quatre jours?",
    options: [
      "La productivité diminue significativement",
      "Les salaires doivent être réduits",
      "Le bien-être s'améliore sans perte de productivité",
      "Seuls les bureaux peuvent l'adopter",
    ],
    correctIndex: 2,
    explanation: "Studies show that a 4-day work week improves employee well-being without reducing productivity — and in some cases actually increases it.",
  },
  {
    id: 20,
    level: "B2",
    topic: "Réforme scolaire",
    audioScript:
      "Le gouvernement provincial a annoncé une réforme du système scolaire qui vise à réduire le décrochage scolaire, actuellement estimé à quinze pour cent chez les garçons. Parmi les mesures proposées: l'introduction obligatoire de l'enseignement des langues autochtones dans les écoles primaires, une augmentation des ressources pour les élèves en difficulté, et une réforme de l'évaluation pour réduire la pression des examens.",
    question: "Quel est le taux de décrochage scolaire chez les garçons mentionné?",
    options: ["5 %", "10 %", "15 %", "20 %"],
    correctIndex: 2,
    explanation: "The report says the school dropout rate for boys is currently estimated at 15% ('quinze pour cent').",
  },
  {
    id: 21,
    level: "B2",
    topic: "Service clientèle",
    audioScript:
      "Bonjour, service clientèle de Télétron. — Bonjour, ma facture de ce mois est beaucoup plus élevée que d'habitude. J'ai été facturé deux cent quarante euros alors que mon forfait mensuel est de soixante euros. — Je vois qu'il y a eu des frais de dépassement de données. Votre forfait couvre cinq gigaoctets, et vous en avez utilisé seize ce mois-ci. — Ah, je ne savais pas. — Je peux vous offrir un avoir de cinquante euros comme geste commercial.",
    question: "Pourquoi la facture est-elle plus élevée ce mois-ci?",
    options: [
      "Le forfait a été modifié",
      "Il y a eu un dépassement de données",
      "Des services supplémentaires ont été ajoutés",
      "Il y a une erreur de facturation",
    ],
    correctIndex: 1,
    explanation: "The agent explains there were 'frais de dépassement de données' (data overage charges). The plan covers 5 GB but the customer used 16 GB this month.",
  },
  {
    id: 22,
    level: "B2",
    topic: "Intégration professionnelle",
    audioScript:
      "Tu as fait comment pour trouver du travail quand tu es arrivé? — Ça n'a pas été simple. Mon diplôme n'était pas reconnu ici, alors j'ai dû passer par une évaluation de mes compétences. Ça m'a pris six mois. Ensuite, j'ai fait un cours de mise à niveau pour m'adapter aux pratiques locales. C'est seulement après ça que j'ai trouvé un emploi dans mon domaine. Mais ça valait le coup — je gagne mieux ma vie qu'avant.",
    question: "Qu'a dû faire cette personne pour travailler dans son domaine au Canada?",
    options: [
      "Refaire ses études complètes",
      "Passer une évaluation et un cours de mise à niveau",
      "Changer de profession",
      "Attendre deux ans",
    ],
    correctIndex: 1,
    explanation: "The person had to go through a skills assessment ('évaluation de ses compétences') and then a bridging course ('cours de mise à niveau') before finding work in their field.",
  },
  {
    id: 23,
    level: "B2",
    topic: "Conseil universitaire",
    audioScript:
      "Pour votre mémoire de master, je vous conseille vivement de choisir un sujet précis plutôt qu'un sujet trop général. Beaucoup d'étudiants font l'erreur de vouloir tout aborder et finissent par manquer de profondeur. La clé, c'est de délimiter clairement votre corpus et votre problématique. N'hésitez pas à me consulter avant de finaliser votre sujet — c'est à cette étape que la plupart des difficultés peuvent être évitées.",
    question: "Quelle erreur courante le professeur mentionne-t-il?",
    options: [
      "Choisir un sujet trop précis",
      "Manquer de sources bibliographiques",
      "Vouloir traiter un sujet trop vaste",
      "Ne pas consulter le professeur",
    ],
    correctIndex: 2,
    explanation: "The professor says many students make the mistake of wanting to cover everything ('tout aborder') and end up lacking depth. The key is to define a clear scope.",
  },
  {
    id: 24,
    level: "B2",
    topic: "IA et médecine",
    audioScript:
      "Les partisans de l'intelligence artificielle dans les soins de santé affirment qu'elle permettra de diagnostiquer des maladies avec une précision supérieure à celle des médecins humains. Leurs opposants, en revanche, s'inquiètent de la déshumanisation des soins et du risque de biais algorithmiques qui pourraient affecter certaines populations plus que d'autres.",
    question: "Quelle est la principale préoccupation des opposants à l'IA médicale?",
    options: [
      "Le coût élevé des technologies",
      "La déshumanisation des soins et les biais algorithmiques",
      "Le manque de précision des diagnostics",
      "La formation insuffisante des médecins",
    ],
    correctIndex: 1,
    explanation: "Opponents worry about the dehumanization of care ('déshumanisation des soins') and the risk of algorithmic biases that could affect certain populations disproportionately.",
  },
  {
    id: 25,
    level: "B2",
    topic: "Crise climatique",
    audioScript:
      "Selon un nouveau rapport climatique, nous avons moins de sept ans pour réduire de manière significative nos émissions de gaz à effet de serre si nous voulons limiter le réchauffement planétaire à 1,5 degré Celsius. Le rapport souligne que les technologies nécessaires existent déjà, mais que c'est la volonté politique et les investissements qui font défaut.",
    question: "Selon le rapport, qu'est-ce qui manque pour résoudre la crise climatique?",
    options: [
      "Les technologies nécessaires",
      "Les données scientifiques",
      "La volonté politique et les investissements",
      "Le temps pour agir",
    ],
    correctIndex: 2,
    explanation: "The report emphasizes that necessary technologies already exist, but what's lacking is political will ('volonté politique') and investment.",
  },

  // ──────────────────────────────────────────────────────────────
  // C1 – C2  (Q 26–39) — advanced, academic, abstract
  // ──────────────────────────────────────────────────────────────
  {
    id: 26,
    level: "C1",
    topic: "Neurolinguistique et bilinguisme",
    audioScript:
      "Les recherches en neurolinguistique ont profondément remis en question le mythe du bilinguisme comme simple addition de deux compétences linguistiques. Loin d'être une superposition de deux systèmes distincts, le cerveau bilingue développe une architecture cognitive unique, caractérisée par une interactivité constante entre les deux langues. Ce qu'on appelle le code-switching n'est pas une défaillance, mais l'expression d'une compétence sophistiquée.",
    question: "Que remet en question la neurolinguistique contemporaine?",
    options: [
      "L'existence du bilinguisme chez les enfants",
      "L'idée que le bilinguisme est une simple addition de deux langues",
      "L'importance du code-switching",
      "La possibilité d'apprendre une troisième langue",
    ],
    correctIndex: 1,
    explanation: "Recent neurolinguistics challenges the myth that bilingualism is a simple addition of two linguistic competences. The bilingual brain develops a unique cognitive architecture with constant interaction between both languages.",
  },
  {
    id: 27,
    level: "C1",
    topic: "Politique linguistique québécoise",
    audioScript:
      "La politique linguistique québécoise repose sur un principe fondamental: la langue française constitue non seulement un outil de communication, mais le vecteur d'une identité culturelle irréductible. La Charte de la langue française vise à assurer la primauté du français dans l'espace public, non par exclusion des autres langues, mais pour garantir la vitalité d'une communauté dont la survie culturelle a été historiquement menacée.",
    question: "Selon cet extrait, quel est le principal objectif de la politique linguistique québécoise?",
    options: [
      "Interdire l'usage de l'anglais en public",
      "Protéger l'identité culturelle francophone",
      "Favoriser le bilinguisme généralisé",
      "Attirer davantage d'immigrants francophones",
    ],
    correctIndex: 1,
    explanation: "Quebec language policy aims to ensure the primacy of French to guarantee the vitality of a community whose cultural survival has been historically threatened — it's about cultural identity, not exclusion.",
  },
  {
    id: 28,
    level: "C1",
    topic: "Intégration et identité",
    audioScript:
      "L'intégration des immigrants ne peut se réduire à une simple acquisition de compétences linguistiques et professionnelles. Elle implique un processus beaucoup plus complexe de négociation identitaire: un réajustement constant entre le maintien de son héritage culturel d'origine et l'adoption progressive des codes et valeurs de la société d'accueil. Ceux qui réussissent le mieux ne sont pas ceux qui effacent leur identité d'origine, mais ceux qui parviennent à articuler une identité hybride cohérente.",
    question: "Selon cet extrait, qui réussit le mieux l'intégration?",
    options: [
      "Ceux qui abandonnent complètement leur culture d'origine",
      "Ceux qui refusent d'adopter la culture d'accueil",
      "Ceux qui développent une identité hybride cohérente",
      "Ceux qui maîtrisent parfaitement la langue d'accueil",
    ],
    correctIndex: 2,
    explanation: "Those who succeed best at integration are not those who erase their original identity, but those who manage to articulate a coherent hybrid identity ('identité hybride cohérente').",
  },
  {
    id: 29,
    level: "C1",
    topic: "Conférence scientifique",
    audioScript:
      "Les données épidémiologiques récentes révèlent une corrélation significative entre les niveaux de pollution atmosphérique urbaine et l'augmentation des cas de troubles cognitifs chez les personnes âgées. Si cette corrélation s'avérait causale — ce qui reste à établir rigoureusement — elle imposerait une révision urgente des normes environnementales. Nos travaux préliminaires suggèrent que même des expositions à des niveaux réputés acceptables peuvent avoir des effets cumulatifs non négligeables.",
    question: "Quelle précision importante le chercheur apporte-t-il concernant la corrélation observée?",
    options: [
      "Elle est définitivement prouvée",
      "Elle n'est pas fiable",
      "Son caractère causal reste à établir rigoureusement",
      "Elle ne concerne que les zones rurales",
    ],
    correctIndex: 2,
    explanation: "The researcher carefully notes that while a significant correlation exists, whether it's causal remains to be rigorously established — an important scientific caveat.",
  },
  {
    id: 30,
    level: "C1",
    topic: "Essai sur l'éducation",
    audioScript:
      "L'obsession contemporaine pour la mesure des performances éducatives — ces classements internationaux qui suscitent des comparaisons permanentes entre systèmes scolaires — tend à réduire l'éducation à ses seules dimensions quantifiables. Ce faisant, elle risque d'occulter ce qui fait l'essence même d'une éducation réussie: la capacité à former des esprits critiques, créatifs et capables de s'adapter à un monde en constante transformation.",
    question: "Quelle est la critique principale faite aux classements scolaires internationaux?",
    options: [
      "Ils sont trop coûteux à réaliser",
      "Ils favorisent les pays riches",
      "Ils réduisent l'éducation aux seules dimensions mesurables",
      "Ils ne sont pas assez fréquents",
    ],
    correctIndex: 2,
    explanation: "The critic argues that the obsession with measuring educational performance reduces education to only its quantifiable dimensions, risking to obscure what truly matters: critical thinking, creativity, and adaptability.",
  },
  {
    id: 31,
    level: "C1",
    topic: "Urbanisation et vulnérabilité",
    audioScript:
      "Les métropoles du vingt et unième siècle font face à un défi paradoxal: plus elles croissent, plus elles génèrent les conditions de leur propre vulnérabilité. La densification excessive crée des zones de fracture sociale, surcharge les infrastructures existantes et amplifie les risques climatiques. La question n'est plus de savoir si on doit urbaniser, mais comment urbaniser intelligemment.",
    question: "Quel paradoxe lié à la croissance des métropoles est évoqué?",
    options: [
      "Les villes attirent de moins en moins de population",
      "La croissance urbaine génère sa propre vulnérabilité",
      "L'urbanisation améliore toujours les conditions de vie",
      "Les villes n'ont plus les ressources pour se développer",
    ],
    correctIndex: 1,
    explanation: "The paradox is that the more cities grow, the more they create the conditions of their own vulnerability — overcrowding leads to social fragmentation, infrastructure overload, and amplified climate risks.",
  },
  {
    id: 32,
    level: "C2",
    topic: "Démocratie délibérative",
    audioScript:
      "La question de la légitimité démocratique dans des sociétés pluralistes ne peut être résolue par le seul principe majoritaire. Habermas nous a montré que la légitimité d'une norme dépend moins de son adoption formelle par une majorité que de la qualité délibérative du processus qui y a conduit. Une démocratie saine exige des espaces publics où des arguments contradictoires peuvent se confronter librement.",
    question: "Selon Habermas, de quoi dépend principalement la légitimité d'une norme?",
    options: [
      "Du nombre de personnes qui l'approuvent",
      "De la qualité du processus délibératif",
      "De son ancienneté dans le système juridique",
      "De sa conformité aux traités internationaux",
    ],
    correctIndex: 1,
    explanation: "Habermas argues that the legitimacy of a norm depends less on its formal adoption by a majority and more on the deliberative quality ('qualité délibérative') of the process that led to it.",
  },
  {
    id: 33,
    level: "C2",
    topic: "Fait francophone nord-américain",
    audioScript:
      "Il serait réducteur d'appréhender le fait francophone nord-américain comme une simple résistance culturelle à l'anglophonie dominante. La vitalité contemporaine du français au Québec et en Acadie tient moins à un réflexe défensif qu'à une créativité culturelle authentique — une façon particulière d'habiter le monde et de le nommer qui a su se renouveler sans se trahir. Ce qui se joue ici n'est pas une survivance mais une affirmation.",
    question: "Selon cet extrait, comment faut-il comprendre la vitalité du français en Amérique du Nord?",
    options: [
      "Comme une résistance à la domination anglophone",
      "Comme une créativité culturelle authentique plutôt qu'une résistance défensive",
      "Comme un déclin inévitable face à l'anglais",
      "Comme un phénomène limité au Québec",
    ],
    correctIndex: 1,
    explanation: "French vitality in North America should be understood not as defensive resistance but as authentic cultural creativity — a particular way of inhabiting and naming the world that has renewed itself without betraying itself.",
  },
  {
    id: 34,
    level: "C2",
    topic: "Tocqueville et la démocratie",
    audioScript:
      "La tension constitutive des sociétés libérales entre liberté individuelle et cohésion collective n'est pas une pathologie qu'il conviendrait de guérir, mais une condition structurelle dont les démocraties doivent apprendre à tirer parti. Ce qu'Alexis de Tocqueville nommait le despotisme doux des sociétés démocratiques — cette tendance des individus à se replier sur la sphère privée au détriment de l'engagement civique — demeure une menace aussi réelle aujourd'hui qu'au dix-neuvième siècle.",
    question: "Qu'est-ce que Tocqueville appelait le despotisme doux?",
    options: [
      "Le gouvernement autoritaire qui s'ignore",
      "La tendance des individus à se replier sur la sphère privée",
      "L'exploitation économique des classes populaires",
      "La censure douce des médias",
    ],
    correctIndex: 1,
    explanation: "Tocqueville's 'soft despotism' refers to the tendency of individuals to retreat into the private sphere at the expense of civic engagement — still as relevant today as in the 19th century.",
  },
  {
    id: 35,
    level: "C2",
    topic: "Immigration et finances publiques",
    audioScript:
      "Les études longitudinales les plus récentes remettent en cause le mythe de l'immigrant qui pèserait sur les systèmes sociaux des pays d'accueil. À l'échelle d'une génération, les descendants d'immigrants contribuent en moyenne davantage aux finances publiques qu'ils n'en bénéficient. La question de l'immigration n'est donc pas une question économique dont la réponse serait négative — c'est une question de gestion de la transition et de justice distributive.",
    question: "Que montrent les études longitudinales sur les descendants d'immigrants?",
    options: [
      "Ils représentent un fardeau économique durable",
      "Ils contribuent davantage aux finances publiques qu'ils n'en bénéficient",
      "Ils s'intègrent rarement au marché du travail",
      "Ils retournent généralement dans leur pays d'origine",
    ],
    correctIndex: 1,
    explanation: "Studies show that descendants of immigrants contribute on average more to public finances than they benefit from them — debunking the myth of immigrants as a burden on host countries.",
  },
  {
    id: 36,
    level: "C2",
    topic: "IA générative et droit d'auteur",
    audioScript:
      "L'essor des systèmes d'intelligence artificielle générative soulève une question philosophique que nos catégories juridiques peinent encore à saisir: celle de l'attribution d'une production intellectuelle lorsque les frontières entre création humaine et génération algorithmique deviennent indiscernables. Le droit d'auteur tel qu'il existe suppose une intentionnalité créatrice que les machines n'ont pas — du moins pas au sens où nous l'entendons.",
    question: "Quelle question philosophique centrale la montée de l'IA générative soulève-t-elle?",
    options: [
      "Comment réglementer l'accès aux IA?",
      "Comment attribuer une production intellectuelle quand création humaine et algorithmique deviennent indiscernables?",
      "Peut-on faire confiance aux IA pour des décisions importantes?",
      "L'IA va-t-elle remplacer tous les emplois créatifs?",
    ],
    correctIndex: 1,
    explanation: "The key philosophical question is about the attribution of intellectual production when the boundaries between human creation and algorithmic generation become indistinguishable — current copyright law assumes a creative intentionality that machines lack.",
  },
  {
    id: 37,
    level: "C2",
    topic: "Révolution tranquille",
    audioScript:
      "La Révolution tranquille des années soixante ne peut se comprendre sans mesurer l'ampleur de ce qu'elle a rompu: une société canadienne-française longtemps structurée autour de l'Église catholique, dont l'emprise couvrait non seulement le domaine spirituel mais l'éducation, la santé, et l'organisation politique et économique. En l'espace d'une décennie, le Québec a entrepris une sécularisation accélérée et nationalisé ses ressources naturelles.",
    question: "Qu'est-ce qui, selon cet extrait, a été principalement rompu par la Révolution tranquille?",
    options: [
      "L'union entre le Québec et le reste du Canada",
      "L'emprise de l'Église catholique sur la société québécoise",
      "Le lien entre le Québec et la France",
      "L'économie agricole traditionnelle",
    ],
    correctIndex: 1,
    explanation: "The Quiet Revolution broke with a society long structured around the Catholic Church, whose grip covered not just the spiritual domain but education, health, and much of the political and economic organization.",
  },
  {
    id: 38,
    level: "C2",
    topic: "Bourdieu: langue et pouvoir",
    audioScript:
      "Bourdieu nous a appris à regarder la langue non comme un simple moyen de communication mais comme un champ de luttes symboliques où se jouent des rapports de domination. La compétence linguistique n'est pas qu'une capacité technique — elle est aussi un capital social dont la distribution inégale perpétue des hiérarchies sociales. Dans le contexte canadien, maîtriser le français et l'anglais, c'est occuper une position de pouvoir au sein d'un espace social stratifié.",
    question: "Quelle est la thèse principale de Bourdieu sur la langue?",
    options: [
      "La langue est avant tout un outil de communication efficace",
      "La langue est un champ de luttes symboliques lié à des rapports de domination",
      "La langue devrait être enseignée de façon plus technique",
      "Les langues minoritaires sont condamnées à disparaître",
    ],
    correctIndex: 1,
    explanation: "Bourdieu's thesis is that language is not just communication but a field of symbolic struggles ('luttes symboliques') where power relations play out, with linguistic competence as unequally distributed social capital.",
  },
  {
    id: 39,
    level: "C2",
    topic: "Francophonie internationale",
    audioScript:
      "Ce qu'on nomme parfois la solidarité francophone ne saurait se réduire à une solidarité linguistique. Elle implique une vision du monde dans laquelle la diversité culturelle n'est pas une menace mais une ressource, dans laquelle le dialogue entre civilisations est préféré à la confrontation, et dans laquelle la dignité des peuples à décider de leur propre avenir culturel est reconnue comme un droit fondamental. C'est cette vision que tente d'incarner l'Organisation internationale de la Francophonie.",
    question: "Sur quel principe fondamental repose la vision francophone internationale selon cet extrait?",
    options: [
      "La promotion exclusive de la langue française",
      "La solidarité économique entre pays francophones",
      "La diversité culturelle comme ressource et le droit des peuples à leur autodétermination culturelle",
      "La résistance à l'hégémonie anglophone",
    ],
    correctIndex: 2,
    explanation: "The francophone vision rests on viewing cultural diversity as a resource, preferring dialogue over confrontation, and recognizing each people's right to decide their own cultural future as a fundamental right.",
  },
];

export function estimateCLBFromListening(correct: number): {
  clb: string;
  cefr: string;
  description: string;
  score699: number;
} {
  const pct = correct / 39;
  // Linear approximation of 0-699 TCF scale (actual uses IRT)
  const score699 = Math.round(pct * 699);
  // Thresholds derived from official IRCC NCLC→TCF equivalency table
  // NCLC 7 = 458/699 (listening) = 65.5% → minimum for most PR streams
  if (pct >= 0.906)
    return { clb: "NCLC 11–12", cefr: "C2", description: "Near-native proficiency", score699 };
  if (pct >= 0.787)
    return { clb: "NCLC 9–10", cefr: "C1", description: "Advanced proficiency", score699 };
  if (pct >= 0.720)
    return { clb: "NCLC 8", cefr: "B2+", description: "Upper-intermediate", score699 };
  if (pct >= 0.655)
    return { clb: "NCLC 7", cefr: "B2", description: "Intermediate — PR threshold", score699 };
  if (pct >= 0.516)
    return { clb: "NCLC 6", cefr: "B1+", description: "Lower-intermediate", score699 };
  if (pct >= 0.259)
    return { clb: "NCLC 5", cefr: "A2+", description: "Elementary", score699 };
  if (pct >= 0.143)
    return { clb: "NCLC 4", cefr: "A2", description: "Basic", score699 };
  return { clb: "Below NCLC 4", cefr: "A1", description: "Beginner", score699 };
}
