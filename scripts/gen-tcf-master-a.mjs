import fs from "fs";
import path from "path";

const ROOT = path.join(import.meta.dirname, "..");
const existing = new Set(
  JSON.parse(fs.readFileSync("/tmp/band-a-en.json", "utf8")).map((s) => s.toLowerCase()),
);

/** @type {[string, string, string][]} */
const ROWS = [];

function add(en, fr, exampleFr) {
  ROWS.push([en, fr, exampleFr]);
}

// --- Time, calendar, numbers (1–80) ---
add("Midnight", "minuit", "La bibliothèque ferme à minuit le vendredi.");
add("Noon sharp", "midi pile", "Le déjeuner est servi à midi pile.");
add("Half past two", "deux heures et demie", "Le cours reprend à deux heures et demie.");
add("Quarter past nine", "neuf heures quinze", "Le bus part à neuf heures quinze.");
add("Quarter to six", "six heures moins le quart", "Nous arrivons à six heures moins le quart.");
add("On the dot", "à l'heure exacte", "Soyez à l'heure exacte pour l'examen.");
add("Fortnight", "la quinzaine", "La quinzaine commence lundi prochain.");
add("Weekday", "un jour de semaine", "Le service est ouvert chaque jour de semaine.");
add("Public holiday eve", "la veille du jour férié", "La veille du jour férié, les magasins ferment tôt.");
add("Alarm clock", "le réveil", "Réglez le réveil à six heures trente.");
add("Wall clock", "l'horloge murale", "L'horloge murale est en retard de cinq minutes.");
add("Digital display", "l'affichage numérique", "L'affichage numérique indique la prochaine rame.");
add("Spring season", "le printemps", "Au printemps, les journées s'allongent.");
add("Autumn season", "l'automne", "En automne, les feuilles tombent dans le parc.");
add("Daybreak", "l'aube", "Nous partons à l'aube pour éviter la chaleur.");
add("Sunset", "le coucher du soleil", "Le coucher du soleil est magnifique sur la plage.");
add("Early morning", "le petit matin", "Le petit matin est calme dans le quartier.");
add("Late evening", "la fin de soirée", "La fin de soirée est réservée aux adultes.");
add("Once a week", "une fois par semaine", "Le marché a lieu une fois par semaine.");
add("Twice a month", "deux fois par mois", "Je paie le loyer deux fois par mois par erreur non.");
add("Every other day", "un jour sur deux", "L'infirmière passe un jour sur deux.");
add("From time to time", "de temps en temps", "De temps en temps, le train arrive en avance.");
add("On time", "à l'heure", "Le colis est arrivé à l'heure prévue.");
add("Behind schedule", "en retard sur l'horaire", "Le chantier est en retard sur l'horaire.");
add("Ahead of schedule", "en avance sur l'horaire", "Les travaux sont en avance sur l'horaire.");
add("Local time", "l'heure locale", "L'heure locale est affichée à l'aéroport.");
add("Duration", "la durée", "La durée du film est de deux heures.");
add("A moment", "un instant", "Un instant, je vérifie votre dossier.");
add("A pause", "une pause", "Faites une pause de dix minutes.");
add("A century", "un siècle", "Ce bâtiment date du siècle dernier.");
add("A decade", "une décennie", "Une décennie s'est écoulée depuis l'ouverture.");
add("A dozen", "une douzaine", "J'achète une douzaine d'œufs.");
add("A pair", "une paire", "J'ai besoin d'une paire de gants.");
add("Half a dozen", "une demi-douzaine", "Prenez une demi-douzaine de croissants.");
add("Even number", "le nombre pair", "Choisissez un nombre pair sur le formulaire.");
add("Odd number", "le nombre impair", "Votre place est un nombre impair.");
add("To count", "compter", "Comptez jusqu'à vingt avant de commencer.");
add("To add", "additionner", "Additionnez les deux montants sur la facture.");
add("To subtract", "soustraire", "Soustrayez la réduction du total.");
add("Percent", "le pour cent", "Une réduction de dix pour cent est appliquée.");
add("Fraction", "la fraction", "Indiquez la fraction sur la ligne pointillée.");
add("Average", "la moyenne", "La moyenne des notes est affichée en bas.");
add("Subtotal", "le sous-total", "Le sous-total apparaît avant les taxes.");
add("Approximately", "environ", "Le trajet dure environ quarante minutes.");
add("Exactly", "exactement", "Le prix est exactement quinze euros.");
add("More than", "plus de", "Il reste plus de cinq places.");
add("Less than", "moins de", "L'attente est de moins de dix minutes.");
add("At least", "au moins", "Réservez au moins deux jours à l'avance.");
add("At most", "au plus", "Le bagage pèse au plus vingt kilos.");
add("Equal to", "égal à", "Le montant doit être égal à zéro.");
add("Zero balance", "le solde zéro", "Le solde zéro est requis pour fermer le compte.");
add("One thousand", "mille", "Le loyer est de mille dollars par mois.");
add("First floor (EU)", "le rez-de-chaussée", "L'accueil se trouve au rez-de-chaussée.");
add("Second floor (EU)", "le premier étage", "Mon bureau est au premier étage.");
add("Third in line", "troisième dans la file", "Vous êtes troisième dans la file.");
add("The previous day", "la veille", "Inscrivez-vous la veille de la visite.");
add("The following day", "le lendemain", "Le lendemain, le bureau rouvre à huit heures.");
add("Soon", "bientôt", "Le médecin vous recevra bientôt.");
add("Recently", "récemment", "J'ai récemment changé d'adresse.");
add("Already", "déjà", "Avez-vous déjà rempli le formulaire?");
add("Still waiting", "toujours en attente", "Je suis toujours en attente d'une réponse.");
add("Not yet", "pas encore", "Le dossier n'est pas encore complet.");
add("Never", "jamais", "Ne quittez jamais vos bagages sans surveillance.");
add("Always", "toujours", "Fermez toujours la porte derrière vous.");
add("Sometimes", "parfois", "Parfois, le guichet ferme plus tôt.");
add("Often", "souvent", "Ce bus passe souvent en retard.");
add("Rarely", "rarement", "Le train est rarement à l'heure l'hiver.");
add("Seldom", "guère", "On trouve guère de places le samedi.");
add("Yesterday morning", "hier matin", "Hier matin, la ligne était coupée.");
add("Tomorrow afternoon", "demain après-midi", "Demain après-midi, le cours est annulé.");
add("This weekend", "ce week-end", "Ce week-end, le musée est gratuit.");
add("Next month", "le mois prochain", "Le renouvellement est prévu le mois prochain.");
add("Last year", "l'année dernière", "L'année dernière, les tarifs ont augmenté.");
add("Annual event", "l'événement annuel", "L'événement annuel attire beaucoup de visiteurs.");
add("Daily rate", "le tarif journalier", "Le tarif journalier inclut le petit-déjeuner.");
add("Hourly wage", "le salaire horaire", "Le salaire horaire est affiché sur l'affiche.");
add("Per person", "par personne", "Le prix est de vingt dollars par personne.");
add("Per night", "par nuit", "La chambre coûte quatre-vingts euros par nuit.");
add("Free of charge", "gratuit", "L'entrée est gratuite pour les enfants.");
add("Fixed price", "le prix fixe", "Le menu est à prix fixe le midi.");

// Load part 2 from companion file if present
const { addPart2 } = await import("./gen-tcf-master-a-part2.mjs");
addPart2(add);
const { addPart3 } = await import("./gen-tcf-master-a-part3.mjs");
addPart3(add);

const seen = new Set();
const out = [];
for (const [en, fr, ex] of ROWS) {
  const key = en.toLowerCase();
  if (existing.has(key) || seen.has(key)) {
    console.error("DUPE skip:", en);
    continue;
  }
  seen.add(key);
  out.push([en, fr, ex]);
}

if (out.length !== 500) {
  console.error(`Expected 500 rows, got ${out.length} (raw ${ROWS.length})`);
  process.exit(1);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
const lines = out.map(([en, fr, ex]) => `  ["${esc(en)}", "${esc(fr)}", "${esc(ex)}"],`);

const body = `import type { LemmaRow } from "./tcf-exam-lexique-batch2";

/** Master A — A1–A2 lexique: services, forms, time, numbers, shopping, transport, communication. */
export const MASTER_A: LemmaRow[] = [
${lines.join("\n")}
];
`;

const dest = path.join(ROOT, "src/lib/content/tcf-exam-lexique-master-a.ts");
fs.writeFileSync(dest, body);
console.log("Wrote", out.length, "rows to", dest);
