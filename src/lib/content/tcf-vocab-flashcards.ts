/* eslint-disable no-irregular-whitespace */
import type { Flashcard } from "./types";

type VocabEntry = [string, string];

function themeCards(themeId: string, entries: VocabEntry[]): Flashcard[] {
  return entries.map(([front, back], i) => ({
    lessonSlug: `tcf-vocab-${themeId}`,
    key: `tcf-vocab-${themeId}:${i + 1}`,
    front,
    back,
    tags: ["TCF Canada", "Vocabulary", themeId],
  }));
}

const IMMIGRATION: VocabEntry[] = [
  ["Permanent residence (PR)", "**la résidence permanente (RP)** — *J'ai demandé la résidence permanente.*"],
  ["Citizenship", "**la citoyenneté** — *La citoyenneté canadienne exige 3 ans de RP.*"],
  ["Work permit", "**le permis de travail** — *Mon permis de travail expire en juin.*"],
  ["Express Entry", "**Entrée express** — *Entrée express utilise le système CRS.*"],
  ["Immigration application", "**la demande d'immigration** — *J'ai soumis ma demande d'immigration.*"],
  ["To integrate / integration", "**s'intégrer / l'intégration** — *L'intégration passe par le français.*"],
  ["Multiculturalism", "**le multiculturalisme** — *Le Canada valorise le multiculturalisme.*"],
  ["Refugee", "**le réfugié / la réfugiée** — *Les réfugiés ont des droits spécifiques.*"],
  ["Sponsor (family)", "**le parrainage familial** — *Le parrainage familial prend du temps.*"],
  ["Language test (TCF)", "**le test de langue** — *Le TCF Canada est un test de langue officiel.*"],
  ["NCLC level", "**le niveau NCLC** — *Il me faut le niveau NCLC 7.*"],
  ["Settlement services", "**les services d'établissement** — *Les services d'établissement aident les nouveaux arrivants.*"],
  ["To adapt", "**s'adapter** — *Il faut s'adapter au climat et à la culture.*"],
  ["Foreign credential recognition", "**la reconnaissance des diplômes étrangers** — *Ma reconnaissance des diplômes est en cours.*"],
  ["Provincial nominee program", "**le programme des candidats des provinces (PNP)** — *Le PNP est une voie vers la RP.*"],
];

const WORK: VocabEntry[] = [
  ["CV / résumé", "**le CV (curriculum vitæ)** — *Mettez à jour votre CV avant l'entrevue.*"],
  ["Job interview", "**l'entrevue d'embauche** — *L'entrevue d'embauche est demain matin.*"],
  ["Employer", "**l'employeur / l'employeuse** — *Mon employeur offre une formation.*"],
  ["Colleague", "**le collègue / la collègue** — *Mes collègues parlent français au bureau.*"],
  ["Salary", "**le salaire** — *Le salaire minimum varie par province.*"],
  ["Full-time / part-time", "**à temps plein / à temps partiel** — *Je cherche un emploi à temps plein.*"],
  ["Skills", "**les compétences** — *Mes compétences en informatique sont solides.*"],
  ["Experience", "**l'expérience** — *J'ai cinq ans d'expérience en gestion.*"],
  ["To apply (for a job)", "**postuler** — *J'ai postulé à trois postes cette semaine.*"],
  ["To hire", "**embaucher** — *L'entreprise embauche dix personnes.*"],
  ["Workplace", "**le milieu de travail** — *Un milieu de travail inclusif est important.*"],
  ["Remote work", "**le télétravail** — *Le télétravail est courant dans mon secteur.*"],
  ["Overtime", "**les heures supplémentaires** — *Les heures supplémentaires sont payées.*"],
  ["Union", "**le syndicat** — *Le syndicat négocie les conditions de travail.*"],
  ["Unemployment", "**le chômage** — *L'assurance-chômage aide entre deux emplois.*"],
];

const HOUSING: VocabEntry[] = [
  ["Rent", "**le loyer** — *Le loyer augmente chaque année.*"],
  ["Landlord", "**le propriétaire / la propriétaire** — *Le propriétaire répare la chaufferie.*"],
  ["Tenant", "**le locataire / la locataire** — *Les locataires ont des droits.*"],
  ["Lease", "**le bail** — *Lisez le bail avant de signer.*"],
  ["Utilities", "**les services publics** — *Les services publics incluent l'électricité et l'eau.*"],
  ["Neighbourhood", "**le quartier** — *Ce quartier est proche du métro.*"],
  ["Apartment", "**l'appartement** — *Je cherche un appartement de deux chambres.*"],
  ["Mortgage", "**l'hypothèque** — *L'hypothèque est un engagement sur 25 ans.*"],
  ["To move in", "**emménager** — *Nous emménageons le premier du mois.*"],
  ["Furniture", "**les meubles** — *Les meubles d'occasion coûtent moins cher.*"],
  ["Heating", "**le chauffage** — *Le chauffage est inclus dans le loyer.*"],
  ["Parking", "**le stationnement** — *Le stationnement est payant en ville.*"],
  ["Roommate", "**le colocataire / la colocataire** — *Mon colocataire parle trois langues.*"],
  ["Housing crisis", "**la crise du logement** — *La crise du logement touche les grandes villes.*"],
  ["Sublet", "**la sous-location** — *La sous-location nécessite l'accord du propriétaire.*"],
];

const HEALTH: VocabEntry[] = [
  ["Doctor", "**le médecin / la médecin** — *Prenez rendez-vous avec un médecin.*"],
  ["Symptoms", "**les symptômes** — *Décrivez vos symptômes à l'infirmière.*"],
  ["Health insurance card", "**la carte d'assurance maladie** — *Présentez votre carte d'assurance maladie.*"],
  ["Pharmacy", "**la pharmacie** — *La pharmacie est ouverte jusqu'à 21 h.*"],
  ["Prescription", "**l'ordonnance** — *Cette ordonnance est valable un an.*"],
  ["Emergency room", "**la salle d'urgence** — *Allez à la salle d'urgence si c'est grave.*"],
  ["Mental health", "**la santé mentale** — *La santé mentale compte autant que la santé physique.*"],
  ["Appointment", "**le rendez-vous** — *Mon rendez-vous est à 14 h 30.*"],
  ["Pain", "**la douleur** — *J'ai une douleur à l'épaule depuis trois jours.*"],
  ["Allergy", "**l'allergie** — *J'ai une allergie aux arachides.*"],
  ["Vaccine", "**le vaccin** — *Le vaccin contre la grippe est gratuit.*"],
  ["Clinic", "**la clinique** — *La clinique sans rendez-vous ferme à 20 h.*"],
  ["To recover", "**guérir / se rétablir** — *Il se rétablit lentement après l'opération.*"],
  ["Stress", "**le stress** — *Le stress au travail affecte le sommeil.*"],
  ["Healthy lifestyle", "**un mode de vie sain** — *Un mode de vie sain inclut l'exercice.*"],
];

const EDUCATION: VocabEntry[] = [
  ["Diploma", "**le diplôme** — *Mon diplôme est reconnu au Québec.*"],
  ["University", "**l'université** — *L'université offre des cours en français.*"],
  ["Training course", "**la formation** — *Je suis une formation en comptabilité.*"],
  ["Equivalence (credentials)", "**l'équivalence** — *L'équivalence de mon diplôme prend six mois.*"],
  ["Student", "**l'étudiant / l'étudiante** — *Les étudiants internationaux paient des frais plus élevés.*"],
  ["Scholarship", "**la bourse** — *J'ai obtenu une bourse d'études.*"],
  ["Exam", "**l'examen** — *L'examen final compte pour 40 %.*"],
  ["To graduate", "**obtenir son diplôme** — *Elle obtiendra son diplôme en mai.*"],
  ["Research", "**la recherche** — *La recherche en IA progresse vite.*"],
  ["Professor", "**le professeur / la professeure** — *Le professeur explique clairement.*"],
  ["Homework", "**les devoirs** — *Les devoirs sont dus vendredi.*"],
  ["Adult education", "**la formation pour adultes** — *La formation pour adultes est subventionnée.*"],
  ["Literacy", "**l'alphabétisation** — *L'alphabétisation ouvre des portes.*"],
  ["Distance learning", "**l'apprentissage à distance** — *L'apprentissage à distance demande de la discipline.*"],
  ["Certificate", "**le certificat** — *Ce certificat est valable deux ans.*"],
];

const ENVIRONMENT: VocabEntry[] = [
  ["Pollution", "**la pollution** — *La pollution de l'air augmente en été.*"],
  ["Recycling", "**le recyclage** — *Le recyclage est obligatoire dans ma ville.*"],
  ["Climate change", "**les changements climatiques** — *Les changements climatiques menacent les écosystèmes.*"],
  ["Renewable energy", "**l'énergie renouvelable** — *L'énergie renouvelable crée des emplois.*"],
  ["Carbon footprint", "**l'empreinte carbone** — *Réduisez votre empreinte carbone.*"],
  ["Sustainable development", "**le développement durable** — *Le développement durable équilibre économie et écologie.*"],
  ["Deforestation", "**la déforestation** — *La déforestation accélère l'érosion.*"],
  ["Biodiversity", "**la biodiversité** — *La biodiversité est en déclin.*"],
  ["Waste", "**les déchets** — *Triez vos déchets correctement.*"],
  ["Greenhouse gases", "**les gaz à effet de serre** — *Les gaz à effet de serre réchauffent la planète.*"],
  ["To protect the environment", "**protéger l'environnement** — *Chacun peut protéger l'environnement.*"],
  ["Drought", "**la sécheresse** — *La sécheresse affecte l'agriculture.*"],
  ["Flood", "**l'inondation** — *Les inondations coûtent des milliards.*"],
  ["Public transit", "**le transport en commun** — *Le transport en commun réduit les émissions.*"],
  ["Ecology", "**l'écologie** — *L'écologie étudie les relations entre les êtres vivants.*"],
];

const TECHNOLOGY: VocabEntry[] = [
  ["Internet", "**l'Internet** — *L'accès à l'Internet est essentiel.*"],
  ["Artificial intelligence", "**l'intelligence artificielle (IA)** — *L'IA transforme le marché du travail.*"],
  ["Data privacy", "**la protection des données** — *La protection des données est encadrée par la loi.*"],
  ["Cybersecurity", "**la cybersécurité** — *La cybersécurité protège les entreprises.*"],
  ["Smartphone", "**le téléphone intelligent** — *Mon téléphone intelligent sert aussi de portefeuille.*"],
  ["Software", "**le logiciel** — *Ce logiciel est gratuit et open source.*"],
  ["To download", "**télécharger** — *Téléchargez l'application officielle.*"],
  ["Password", "**le mot de passe** — *Choisissez un mot de passe fort.*"],
  ["Social network", "**le réseau social** — *Les réseaux sociaux influencent l'opinion.*"],
  ["Innovation", "**l'innovation** — *L'innovation stimule la croissance économique.*"],
  ["Digital divide", "**la fracture numérique** — *La fracture numérique touche les régions rurales.*"],
  ["Algorithm", "**l'algorithme** — *L'algorithme recommande du contenu similaire.*"],
  ["Cloud computing", "**l'informatique en nuage** — *L'informatique en nuage réduit les coûts.*"],
  ["Screen time", "**le temps d'écran** — *Limitez le temps d'écran des enfants.*"],
  ["Automation", "**l'automatisation** — *L'automatisation remplace certains emplois répétitifs.*"],
];

const MEDIA: VocabEntry[] = [
  ["News", "**les nouvelles / l'actualité** — *Je lis l'actualité chaque matin.*"],
  ["Journalist", "**le journaliste / la journaliste** — *La journaliste enquête sur la corruption.*"],
  ["Social media", "**les médias sociaux** — *Les médias sociaux diffusent l'information vite.*"],
  ["Public opinion", "**l'opinion publique** — *L'opinion publique influence les politiques.*"],
  ["Fake news", "**les fausses nouvelles** — *Vérifiez les sources face aux fausses nouvelles.*"],
  ["Press freedom", "**la liberté de la presse** — *La liberté de la presse est un pilier démocratique.*"],
  ["Documentary", "**le documentaire** — *Le documentaire traite de l'immigration.*"],
  ["To broadcast", "**diffuser** — *La chaîne diffuse le débat en direct.*"],
  ["Censorship", "**la censure** — *La censure limite la liberté d'expression.*"],
  ["Headline", "**le titre / la manchette** — *La manchette résume l'article.*"],
  ["Interview", "**l'interview / l'entrevue** — *L'entrevue dure vingt minutes.*"],
  ["Advertising", "**la publicité** — *La publicité cible les jeunes consommateurs.*"],
  ["Editorial", "**l'éditorial** — *L'éditorial critique la réforme.*"],
  ["Source (reliable)", "**la source fiable** — *Citez une source fiable dans votre essai.*"],
  ["Misinformation", "**la désinformation** — *La désinformation se propage rapidement en ligne.*"],
];

const CULTURE: VocabEntry[] = [
  ["Heritage", "**le patrimoine** — *Le patrimoine culturel doit être préservé.*"],
  ["Festival", "**le festival** — *Le festival de jazz attire des visiteurs.*"],
  ["Tourism", "**le tourisme** — *Le tourisme soutient l'économie locale.*"],
  ["Museum", "**le musée** — *Le musée est gratuit le premier dimanche.*"],
  ["Tradition", "**la tradition** — *Cette tradition remonte au XIXe siècle.*"],
  ["Cultural diversity", "**la diversité culturelle** — *La diversité culturelle enrichit la société.*"],
  ["To visit", "**visiter** — *Nous visitons le Vieux-Québec ce week-end.*"],
  ["Monument", "**le monument** — *Le monument commémore les victimes.*"],
  ["Cuisine", "**la cuisine** — *La cuisine québécoise mélange influences françaises et autochtones.*"],
  ["Art exhibition", "**l'exposition d'art** — *L'exposition d'art ouvre demain.*"],
  ["National holiday", "**la fête nationale** — *La fête nationale du Québec est le 24 juin.*"],
  ["Custom", "**la coutume** — *Chaque culture a ses coutumes.*"],
  ["To discover", "**découvrir** — *J'ai découvert un quartier historique.*"],
  ["Performance", "**la représentation** — *La représentation commence à 20 h.*"],
  ["Souvenir", "**le souvenir** — *J'ai acheté un souvenir pour ma famille.*"],
];

const ECONOMY: VocabEntry[] = [
  ["Price", "**le prix** — *Le prix de l'épicerie a augmenté.*"],
  ["Budget", "**le budget** — *Notre budget mensuel est serré.*"],
  ["Consumer rights", "**les droits du consommateur** — *Connaissez vos droits du consommateur.*"],
  ["Inflation", "**l'inflation** — *L'inflation réduit le pouvoir d'achat.*"],
  ["Tax", "**l'impôt / la taxe** — *L'impôt sur le revenu est progressif.*"],
  ["To save money", "**économiser** — *J'économise pour l'acompte d'une maison.*"],
  ["Discount", "**la réduction / le rabais** — *Il y a une réduction de 20 % aujourd'hui.*"],
  ["Receipt", "**le reçu** — *Gardez le reçu pour le retour.*"],
  ["Debt", "**la dette** — *La dette étudiante est un défi pour les jeunes.*"],
  ["Economy", "**l'économie** — *L'économie canadienne dépend des ressources naturelles.*"],
  ["Purchase", "**l'achat** — *Cet achat était nécessaire.*"],
  ["Refund", "**le remboursement** — *Demandez un remboursement sous 30 jours.*"],
  ["Interest rate", "**le taux d'intérêt** — *Le taux d'intérêt affecte les prêts hypothécaires.*"],
  ["Cost of living", "**le coût de la vie** — *Le coût de la vie est élevé à Toronto.*"],
  ["Warranty", "**la garantie** — *L'appareil est sous garantie deux ans.*"],
];

export const TCF_VOCAB_FLASHCARDS: Flashcard[] = [
  ...themeCards("immigration", IMMIGRATION),
  ...themeCards("work", WORK),
  ...themeCards("housing", HOUSING),
  ...themeCards("health", HEALTH),
  ...themeCards("education", EDUCATION),
  ...themeCards("environment", ENVIRONMENT),
  ...themeCards("technology", TECHNOLOGY),
  ...themeCards("media", MEDIA),
  ...themeCards("culture", CULTURE),
  ...themeCards("economy", ECONOMY),
];

export function getTcfVocabFlashcardsForTheme(themeId: string): Flashcard[] {
  return TCF_VOCAB_FLASHCARDS.filter((c) => c.tags.includes(themeId));
}
