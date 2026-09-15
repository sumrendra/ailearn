import type { Flashcard } from "./types";
import type { VocabItem } from "@/components/french/VocabList";
import type { MatchPair } from "@/components/french/MatchQuiz";
import { BATCH2_A, BATCH2_B, BATCH2_C } from "./tcf-exam-lexique-batch2";
import { BATCH3_A, BATCH3_B, BATCH3_C } from "./tcf-exam-lexique-batch3";
import { BATCH4_A, BATCH4_B, BATCH4_C } from "./tcf-exam-lexique-batch4";
import {
  CORE_VOCAB_TOPIC_TAG,
  coreTopicTagsForLemma,
  isCoreVocabTopicId,
  type CoreVocabTopicId,
} from "@/lib/tcf-program/vocab-core-topics";

export type TcfExamBand = "a" | "b" | "c";

type LemmaRow = [en: string, fr: string, exampleFr: string];

function mergeLemmaRows(base: LemmaRow[], extra: LemmaRow[]): LemmaRow[] {
  const seen = new Set(base.map((r) => r[0].toLowerCase()));
  const out = [...base];
  for (const row of extra) {
    const key = row[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function bandCards(band: TcfExamBand, rows: LemmaRow[]): Flashcard[] {
  return rows.map(([front, fr, exampleFr], i) => ({
    lessonSlug: `tcf-lexique-${band}`,
    key: `tcf-lemma-${band}:${i + 1}`,
    front,
    back: `**${fr}** — *${exampleFr}*`,
    tags: ["TCF Canada", "Lexique", band, ...coreTopicTagsForLemma(front, fr, band)],
  }));
}

const BAND_A: LemmaRow[] = [
  ["Opening hours", "les heures d'ouverture", "Les heures d'ouverture sont de 9 h à 17 h."],
  ["Closed on Monday", "fermé le lundi", "Le bureau est fermé le lundi."],
  ["Schedule / timetable", "l'horaire", "Consultez l'horaire des autobus."],
  ["Ticket (transit)", "le billet", "Achetez un billet avant de monter."],
  ["Platform (train)", "le quai", "Le train part du quai numéro 3."],
  ["Delay", "le retard", "Le train a trente minutes de retard."],
  ["Appointment", "le rendez-vous", "J'ai un rendez-vous à 14 h."],
  ["To register", "s'inscrire", "Il faut s'inscrire en ligne."],
  ["Form", "le formulaire", "Remplissez le formulaire en majuscules."],
  ["Signature", "la signature", "Votre signature doit être identique."],
  ["Deadline", "la date limite", "La date limite est le 15 mars."],
  ["Fee", "les frais", "Les frais sont payables par carte."],
  ["Receipt", "le reçu", "Conservez le reçu pour vos dossiers."],
  ["Entrance", "l'entrée", "L'entrée se trouve côté rue."],
  ["Exit", "la sortie", "La sortie est indiquée en vert."],
  ["Elevator", "l'ascenseur", "L'ascenseur est en panne aujourd'hui."],
  ["Floor (building)", "l'étage", "Le service se trouve au deuxième étage."],
  ["Parking", "le stationnement", "Le stationnement est gratuit une heure."],
  ["Discount", "la réduction", "Une réduction est offerte aux étudiants."],
  ["Sale", "la promotion", "La promotion se termine dimanche."],
  ["Size (clothing)", "la taille", "Quelle taille portez-vous?"],
  ["Exchange / return", "l'échange", "L'échange est possible sous quatorze jours."],
  ["Menu", "le menu", "Le menu du jour coûte douze dollars."],
  ["Reservation", "la réservation", "J'ai une réservation au nom de Singh."],
  ["Weather forecast", "les prévisions météo", "Les prévisions annoncent de la pluie."],
  ["Temperature", "la température", "La température descend sous zéro ce soir."],
  ["Map", "le plan / la carte", "Prenez un plan à l'accueil."],
  ["Direction", "la direction", "La direction est indiquée par des flèches."],
  ["Emergency", "l'urgence", "Composez le 911 en cas d'urgence."],
  ["Lost item", "objet perdu", "Les objets perdus sont à l'accueil."],
  ["ID card", "la carte d'identité", "Présentez une pièce d'identité valide."],
  ["Phone number", "le numéro de téléphone", "Laissez votre numéro de téléphone."],
  ["Email address", "l'adresse courriel", "Confirmez votre adresse courriel."],
  ["Website", "le site Web", "Les renseignements sont sur le site Web."],
  ["Instructions", "les consignes", "Suivez les consignes affichées."],
];

const BAND_B: LemmaRow[] = [
  ["Job offer", "l'offre d'emploi", "J'ai reçu une offre d'emploi intéressante."],
  ["Cover letter", "la lettre de motivation", "Joignez une lettre de motivation."],
  ["Reference", "la référence", "Mes anciens employeurs serviront de références."],
  ["Probation period", "la période d'essai", "La période d'essai dure trois mois."],
  ["Benefits", "les avantages sociaux", "Les avantages sociaux incluent l'assurance dentaire."],
  ["Pension plan", "le régime de retraite", "Le régime de retraite est contributif."],
  ["Union", "le syndicat", "Le syndicat négocie la convention collective."],
  ["Strike", "la grève", "La grève perturbe les services publics."],
  ["Layoff", "la mise à pied", "La mise à pied touche vingt employés."],
  ["Tenant rights", "les droits du locataire", "Les droits du locataire sont protégés par la loi."],
  ["Eviction", "l'expulsion", "L'expulsion exige une décision du tribunal."],
  ["Lease renewal", "le renouvellement du bail", "Le renouvellement du bail est automatique."],
  ["Mortgage", "l'hypothèque", "Le taux d'hypothèque a augmenté."],
  ["Property tax", "l'impôt foncier", "L'impôt foncier est payable en deux versements."],
  ["Childcare", "la garde d'enfants", "La garde d'enfants coûte cher en ville."],
  ["School board", "la commission scolaire", "La commission scolaire gère les écoles locales."],
  ["Tuition fees", "les frais de scolarité", "Les frais de scolarité augmentent chaque année."],
  ["Scholarship", "la bourse d'études", "Elle a obtenu une bourse d'études."],
  ["Vaccination", "la vaccination", "La vaccination est recommandée avant le voyage."],
  ["Waiting list", "la liste d'attente", "Le délai sur la liste d'attente est long."],
  ["Specialist", "le spécialiste", "Votre médecin vous référera à un spécialiste."],
  ["Prescription renewal", "le renouvellement d'ordonnance", "Demandez le renouvellement d'ordonnance en ligne."],
  ["Recycling", "le recyclage", "Le recyclage est obligatoire dans ce quartier."],
  ["Compost", "le compost", "Le bac de compost est ramassé le jeudi."],
  ["Carbon footprint", "l'empreinte carbone", "Réduisons notre empreinte carbone."],
  ["Renewable energy", "l'énergie renouvelable", "L'énergie renouvelable crée des emplois."],
  ["Public transit", "le transport en commun", "Le transport en commun est subventionné."],
  ["Traffic jam", "embouteillage", "Un embouteillage bloque l'autoroute."],
  ["Carpool", "le covoiturage", "Le covoiturage réduit les coûts."],
  ["Data privacy", "la protection des données", "La protection des données est encadrée par la loi."],
  ["Cybersecurity", "la cybersécurité", "La cybersécurité est une priorité pour l'entreprise."],
  ["Misinformation", "la désinformation", "La désinformation circule sur les réseaux."],
  ["Social network", "le réseau social", "Il évite les réseaux sociaux au travail."],
  ["Press release", "le communiqué de presse", "Le communiqué de presse sera diffusé demain."],
  ["Editorial", "l'éditorial", "L'éditorial critique la réforme proposée."],
  ["Poll / survey", "le sondage", "Le sondage place le parti en tête."],
  ["Turnout (election)", "la participation électorale", "La participation électorale a augmenté."],
  ["Candidate", "le candidat / la candidate", "La candidate présente son programme."],
  ["Coalition", "la coalition", "Une coalition gouverne la province."],
  ["Budget deficit", "le déficit budgétaire", "Le déficit budgétaire doit être réduit."],
  ["Inflation", "l'inflation", "L'inflation affecte le pouvoir d'achat."],
  ["Interest rate", "le taux d'intérêt", "Le taux d'intérêt influence l'immobilier."],
  ["Consumer rights", "les droits du consommateur", "Les droits du consommateur permettent un remboursement."],
  ["Warranty", "la garantie", "La garantie couvre deux ans."],
  ["Supply chain", "la chaîne d'approvisionnement", "La chaîne d'approvisionnement est perturbée."],
  ["Remote work policy", "la politique de télétravail", "La politique de télétravail est révisée."],
  ["Work-life balance", "l'équilibre travail-vie", "L'équilibre travail-vie est essentiel."],
  ["Harassment", "le harcèlement", "Le harcèlement au travail est interdit."],
  ["Whistleblower", "le lanceur d'alerte", "Le lanceur d'alerte est protégé par la loi."],
];

const BAND_C: LemmaRow[] = [
  ["Ambivalence", "l'ambivalence", "Son ambivalence reflète la complexité du dossier."],
  ["Nuance", "la nuance", "Il faut saisir la nuance de l'argument."],
  ["Paradox", "le paradoxe", "Le paradoxe mérite une analyse approfondie."],
  ["Underlying assumption", "l'hypothèse sous-jacente", "L'hypothèse sous-jacente n'est pas démontrée."],
  ["Implication", "l'implication", "Quelle implication tirez-vous de ce passage?"],
  ["Counter-argument", "le contre-argument", "Le contre-argument affaiblit la thèse initiale."],
  ["To substantiate", "étayer", "Les auteurs étayent leur propos par des données."],
  ["To refute", "réfuter", "Il tente de réfuter l'analyse précédente."],
  ["To concede", "concéder", "Il concède un point sans abandonner sa position."],
  ["To advocate", "préconiser", "Elle préconise une réforme graduelle."],
  ["To undermine", "saper", "Cette mesure pourrait saper la confiance publique."],
  ["To exacerbate", "exacerber", "La crise exacerbe les inégalités existantes."],
  ["To mitigate", "atténuer", "Des politiques visent à atténuer les effets."],
  ["To streamline", "rationaliser", "Il faut rationaliser les procédures administratives."],
  ["Accountability", "la responsabilisation", "La responsabilisation des élus est exigée."],
  ["Transparency", "la transparence", "La transparence renforce la légitimité."],
  ["Governance", "la gouvernance", "Une bonne gouvernance repose sur des règles claires."],
  ["Sovereignty", "la souveraineté", "Le débat touche la souveraineté culturelle."],
  ["Secularism", "la laïcité", "La laïcité structure le débat public."],
  ["Multilateralism", "le multilatéralisme", "Le multilatéralisme facilite les accords."],
  ["Populism", "le populisme", "Le populisme simplifie des enjeux complexes."],
  ["Polarization", "la polarisation", "La polarisation complique le compromis."],
  ["Consolidation", "la consolidation", "La consolidation des acquis reste fragile."],
  ["Divergence", "la divergence", "Une divergence persiste entre les régions."],
  ["Consensus", "le consensus", "Le consensus demeure hors de portée."],
  ["Ethical dilemma", "le dilemme éthique", "Le dilemme éthique divise les experts."],
  ["Precedent", "le précédent", "Ce précédent oriente les décisions futures."],
  ["Jurisdiction", "la compétence juridictionnelle", "La compétence juridictionnelle est contestée."],
  ["Arbitration", "l'arbitrage", "L'arbitrage évite un procès long."],
  ["Red tape", "la bureaucratie", "La bureaucratie freine l'innovation."],
  ["Stakeholder", "la partie prenante", "Chaque partie prenante doit être consultée."],
  ["Trade-off", "le compromis", "Toute réforme implique un compromis."],
  ["Sustainability", "la durabilité", "La durabilité guide les investissements."],
  ["Intergenerational equity", "l'équité intergénérationnelle", "L'équité intergénérationnelle est au cœur du débat."],
  ["Systemic bias", "le biais systémique", "Le biais systémique demande des correctifs structurels."],
  ["Epistemological", "épistémologique", "La question épistémologique sous-tend la polémique."],
  ["Rhetoric", "la rhétorique", "Sa rhétorique persuade sans convaincre."],
  ["Subtlety", "la subtilité", "La subtilité du texte échappe au lecteur pressé."],
];

const FULL_BAND_A = mergeLemmaRows(mergeLemmaRows(mergeLemmaRows(BAND_A, BATCH2_A), BATCH3_A), BATCH4_A);
const FULL_BAND_B = mergeLemmaRows(mergeLemmaRows(mergeLemmaRows(BAND_B, BATCH2_B), BATCH3_B), BATCH4_B);
const FULL_BAND_C = mergeLemmaRows(mergeLemmaRows(mergeLemmaRows(BAND_C, BATCH2_C), BATCH3_C), BATCH4_C);

export const EXAM_LEXIQUE_FLASHCARDS: Flashcard[] = [
  ...bandCards("a", FULL_BAND_A),
  ...bandCards("b", FULL_BAND_B),
  ...bandCards("c", FULL_BAND_C),
];

export function getExamLemmaFlashcards(band?: TcfExamBand): Flashcard[] {
  if (!band) return EXAM_LEXIQUE_FLASHCARDS;
  return EXAM_LEXIQUE_FLASHCARDS.filter((c) => c.tags.includes(band));
}

export function getExamLemmaFlashcardsForCoreTopic(topicId: CoreVocabTopicId): Flashcard[] {
  const needle = `${CORE_VOCAB_TOPIC_TAG}${topicId}`;
  return EXAM_LEXIQUE_FLASHCARDS.filter((c) => c.tags.includes(needle));
}

export function getCoreTopicCardCounts(): Record<CoreVocabTopicId, number> {
  const ids = [
    "daily-services",
    "transport",
    "housing",
    "work",
    "health",
    "education",
    "community",
    "environment",
    "media-society",
    "argumentation",
  ] as const;
  const counts = Object.fromEntries(ids.map((id) => [id, 0])) as Record<CoreVocabTopicId, number>;
  for (const card of EXAM_LEXIQUE_FLASHCARDS) {
    for (const tag of card.tags) {
      if (!tag.startsWith(CORE_VOCAB_TOPIC_TAG)) continue;
      const id = tag.slice(CORE_VOCAB_TOPIC_TAG.length);
      if (isCoreVocabTopicId(id)) counts[id] += 1;
    }
  }
  return counts;
}

export type { CoreVocabTopicId };
export { isCoreVocabTopicId };

export interface TcfContextPack {
  id: string;
  title: string;
  subtitle: string;
  band: TcfExamBand;
  excerptFr: string;
  items: VocabItem[];
}

function packToFlashcards(pack: TcfContextPack): Flashcard[] {
  return pack.items.map((item, i) => ({
    lessonSlug: `tcf-pack-${pack.id}`,
    key: `tcf-pack-${pack.id}:${i + 1}`,
    front: item.en,
    back: item.example
      ? `**${item.fr}** — *${item.example.fr}*`
      : `**${item.fr}**`,
    tags: ["TCF Canada", "Lexique", "pack", pack.band],
  }));
}

export const TCF_CONTEXT_PACKS: TcfContextPack[] = [
  {
    id: "p6-work-orientation",
    title: "Premier emploi au Canada",
    subtitle: "Paper 6 · vie professionnelle",
    band: "b",
    excerptFr:
      "Le centre d'orientation propose des ateliers de CV et des simulations d'entrevue. Les participants apprennent à valoriser leurs compétences transférables.",
    items: [
      { fr: "l'orientation professionnelle", en: "career guidance", example: { fr: "L'orientation professionnelle est gratuite.", en: "Career guidance is free." } },
      { fr: "les compétences transférables", en: "transferable skills", example: { fr: "Mettez en avant vos compétences transférables.", en: "Highlight your transferable skills." } },
      { fr: "la simulation d'entrevue", en: "mock interview", example: { fr: "La simulation d'entrevue dure trente minutes.", en: "The mock interview lasts thirty minutes." } },
      { fr: "valoriser", en: "to showcase / highlight", example: { fr: "Valorisez votre expérience à l'étranger.", en: "Showcase your experience abroad." } },
      { fr: "le réseautage", en: "networking", example: { fr: "Le réseautage ouvre des portes.", en: "Networking opens doors." } },
      { fr: "la période d'adaptation", en: "adjustment period", example: { fr: "Prévoyez une période d'adaptation.", en: "Allow an adjustment period." } },
    ],
  },
  {
    id: "p6-housing-lease",
    title: "Signer un bail",
    subtitle: "Paper 6 · logement",
    band: "b",
    excerptFr:
      "Avant de signer, vérifiez les clauses sur le dépôt de garantie et les réparations. Le locataire doit respecter le règlement de l'immeuble.",
    items: [
      { fr: "le dépôt de garantie", en: "security deposit", example: { fr: "Le dépôt de garantie est remboursable.", en: "The security deposit is refundable." } },
      { fr: "le règlement de l'immeuble", en: "building bylaws", example: { fr: "Le règlement interdit les animaux.", en: "The bylaws prohibit pets." } },
      { fr: "une clause", en: "a clause", example: { fr: "Lisez chaque clause attentivement.", en: "Read each clause carefully." } },
      { fr: "les réparations", en: "repairs", example: { fr: "Qui paie les réparations?", en: "Who pays for repairs?" } },
      { fr: "le propriétaire", en: "landlord", example: { fr: "Le propriétaire doit prévenir vingt-quatre heures à l'avance.", en: "The landlord must give twenty-four hours notice." } },
      { fr: "respecter", en: "to comply with", example: { fr: "Respectez les heures de tranquillité.", en: "Comply with quiet hours." } },
    ],
  },
  {
    id: "p7-civic-vote",
    title: "Participer à une élection",
    subtitle: "Paper 7 · citoyenneté",
    band: "b",
    excerptFr:
      "Les citoyens canadiens reçoivent une carte d'électeur. Il est possible de voter par anticipation ou par procuration si l'on est absent le jour du scrutin.",
    items: [
      { fr: "la carte d'électeur", en: "voter information card", example: { fr: "Présentez votre carte d'électeur.", en: "Present your voter information card." } },
      { fr: "le jour du scrutin", en: "polling day", example: { fr: "Le jour du scrutin est le 20 octobre.", en: "Polling day is October 20." } },
      { fr: "voter par anticipation", en: "to vote in advance", example: { fr: "Je vais voter par anticipation.", en: "I will vote in advance." } },
      { fr: "la procuration", en: "proxy vote", example: { fr: "La procuration nécessite un formulaire.", en: "A proxy vote requires a form." } },
      { fr: "le bureau de vote", en: "polling station", example: { fr: "Mon bureau de vote est à l'école.", en: "My polling station is at the school." } },
      { fr: "le scrutin", en: "the ballot / vote", example: { fr: "Le scrutin est secret.", en: "The ballot is secret." } },
    ],
  },
  {
    id: "p7-public-service",
    title: "Service Canada",
    subtitle: "Paper 7 · services publics",
    band: "a",
    excerptFr:
      "Pour obtenir un numéro d'assurance sociale, apportez votre permis de séjour et une preuve d'adresse. Le guichet ouvre à huit heures trente.",
    items: [
      { fr: "le numéro d'assurance sociale", en: "Social Insurance Number", example: { fr: "Demandez votre numéro d'assurance sociale.", en: "Apply for your Social Insurance Number." } },
      { fr: "une preuve d'adresse", en: "proof of address", example: { fr: "Une facture d'électricité sert de preuve d'adresse.", en: "An electricity bill serves as proof of address." } },
      { fr: "le guichet", en: "service counter", example: { fr: "Le guichet ferme à seize heures.", en: "The counter closes at four p.m." } },
      { fr: "le permis de séjour", en: "residence permit", example: { fr: "Votre permis de séjour doit être valide.", en: "Your residence permit must be valid." } },
      { fr: "faire la file", en: "to queue / wait in line", example: { fr: "Il faut faire la file à l'entrée.", en: "You must queue at the entrance." } },
    ],
  },
  {
    id: "p4-media-debate",
    title: "Débat médiatique",
    subtitle: "Paper 4 · opinion",
    band: "c",
    excerptFr:
      "L'auteur dénonce une généralisation hâtive et invite le lecteur à distinguer corrélation et causalité dans les statistiques citées.",
    items: [
      { fr: "une généralisation hâtive", en: "a hasty generalization", example: { fr: "Évitez une généralisation hâtive.", en: "Avoid a hasty generalization." } },
      { fr: "la corrélation", en: "correlation", example: { fr: "La corrélation ne prouve pas la causalité.", en: "Correlation does not prove causation." } },
      { fr: "la causalité", en: "causality", example: { fr: "La causalité reste discutée.", en: "Causality remains debated." } },
      { fr: "dénoncer", en: "to denounce", example: { fr: "Il dénonce le sensationalisme.", en: "He denounces sensationalism." } },
      { fr: "distinguer", en: "to distinguish", example: { fr: "Distinguez les faits des opinions.", en: "Distinguish facts from opinions." } },
      { fr: "citer", en: "to cite", example: { fr: "Citez vos sources.", en: "Cite your sources." } },
    ],
  },
  {
    id: "p5-environment-policy",
    title: "Politique environnementale",
    subtitle: "Paper 5 · argumentation",
    band: "c",
    excerptFr:
      "Les défenseurs plaident pour des incitatifs fiscaux, tandis que les opposants estiment que la réglementation suffit sans subventions supplémentaires.",
    items: [
      { fr: "un incitatif fiscal", en: "a tax incentive", example: { fr: "Un incitatif fiscal encourage l'investissement vert.", en: "A tax incentive encourages green investment." } },
      { fr: "la réglementation", en: "regulation", example: { fr: "La réglementation se durcit.", en: "Regulation is tightening." } },
      { fr: "une subvention", en: "a subsidy", example: { fr: "La subvention sera réduite.", en: "The subsidy will be reduced." } },
      { fr: "plaider pour", en: "to argue for", example: { fr: "Ils plaident pour une transition graduelle.", en: "They argue for a gradual transition." } },
      { fr: "estimer que", en: "to consider that", example: { fr: "Elle estime que le délai est trop court.", en: "She considers the timeline too short." } },
      { fr: "les opposants", en: "opponents", example: { fr: "Les opposants brandissent le coût.", en: "Opponents raise the cost." } },
    ],
  },
  {
    id: "p8-daycare-waitlist",
    title: "Liste d'attente en garderie",
    subtitle: "Paper 8 · famille",
    band: "b",
    excerptFr:
      "Les parents déposent une demande en ligne et reçoivent un numéro de priorité. La place en garderie subventionnée peut prendre plusieurs mois.",
    items: [
      { fr: "la garderie subventionnée", en: "subsidized daycare", example: { fr: "La garderie subventionnée coûte moins cher.", en: "Subsidized daycare costs less." } },
      { fr: "le congé parental", en: "parental leave", example: { fr: "Le congé parental dure douze mois.", en: "Parental leave lasts twelve months." } },
      { fr: "la place en garderie", en: "daycare spot", example: { fr: "Une place en garderie s'est libérée.", en: "A daycare spot opened up." } },
      { fr: "le numéro de priorité", en: "priority number", example: { fr: "Votre numéro de priorité est affiché en ligne.", en: "Your priority number is shown online." } },
      { fr: "déposer une demande", en: "to submit an application", example: { fr: "Déposez une demande avant la rentrée.", en: "Submit an application before the school year." } },
    ],
  },
  {
    id: "p9-transit-pass",
    title: "Abonnement transport",
    subtitle: "Paper 9 · mobilité",
    band: "a",
    excerptFr:
      "Pour obtenir la carte mensuelle, présentez une pièce d'identité et une photo. La correspondance vers la ligne orange est indiquée au quai.",
    items: [
      { fr: "l'abonnement mensuel", en: "monthly pass", example: { fr: "L'abonnement mensuel coûte cent vingt dollars.", en: "The monthly pass costs one hundred twenty dollars." } },
      { fr: "la ligne de métro", en: "metro line", example: { fr: "Prenez la ligne de métro orange.", en: "Take the orange metro line." } },
      { fr: "un retard de service", en: "a service delay", example: { fr: "Un retard de service est annoncé.", en: "A service delay has been announced." } },
      { fr: "le billet électronique", en: "electronic ticket", example: { fr: "Scannez le billet électronique à l'entrée.", en: "Scan the electronic ticket at the gate." } },
      { fr: "le quai", en: "platform", example: { fr: "Attendez sur le quai numéro deux.", en: "Wait on platform number two." } },
    ],
  },
  {
    id: "p10-winter-festival",
    title: "Festival d'hiver",
    subtitle: "Paper 10 · culture",
    band: "b",
    excerptFr:
      "Le festival propose des sculptures de glace, des concerts en plein air et des activités pour familles. Portez des vêtements chauds et des bottes.",
    items: [
      { fr: "en plein air", en: "outdoors", example: { fr: "Le concert en plein air commence à dix-neuf heures.", en: "The outdoor concert starts at seven p.m." } },
      { fr: "le bénévolat", en: "volunteering", example: { fr: "Le bénévolat renforce le lien social.", en: "Volunteering strengthens social ties." } },
      { fr: "la sculpture de glace", en: "ice sculpture", example: { fr: "La sculpture de glace est éclairée le soir.", en: "The ice sculpture is lit up at night." } },
      { fr: "les vêtements chauds", en: "warm clothing", example: { fr: "Apportez des vêtements chauds.", en: "Bring warm clothing." } },
      { fr: "l'intégration sociale", en: "social integration", example: { fr: "L'intégration sociale passe par la participation.", en: "Social integration comes through participation." } },
    ],
  },
];

const PACK_FLASHCARDS = TCF_CONTEXT_PACKS.flatMap(packToFlashcards);

export function getPackFlashcards(packId: string): Flashcard[] {
  return PACK_FLASHCARDS.filter((c) => c.lessonSlug === `tcf-pack-${packId}`);
}

export function getContextPack(packId: string): TcfContextPack | undefined {
  return TCF_CONTEXT_PACKS.find((p) => p.id === packId);
}

export function contextPackMatchPairs(pack: TcfContextPack): MatchPair[] {
  return pack.items.map((i) => ({ fr: i.fr, en: i.en }));
}

export const ALL_TCF_LEXIQUE_FLASHCARDS: Flashcard[] = [...EXAM_LEXIQUE_FLASHCARDS, ...PACK_FLASHCARDS];

export const EXAM_BAND_META: { id: TcfExamBand; title: string; cefr: string; blurb: string; count: number }[] = [
  { id: "a", title: "Bande A — repères du quotidien", cefr: "A1–A2", blurb: "Horaires, formulaires, transports, consignes d'examen (Q1–10).", count: FULL_BAND_A.length },
  { id: "b", title: "Bande B — vie au Canada", cefr: "B1–B2", blurb: "Travail, logement, santé, société (Q11–29).", count: FULL_BAND_B.length },
  { id: "c", title: "Bande C — argumentation", cefr: "C1–C2", blurb: "Opinion, nuance, registre formel (Q30–39).", count: FULL_BAND_C.length },
];
