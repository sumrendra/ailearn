/* eslint-disable no-irregular-whitespace */
/**
 * TCF Canada — Foundation Track A, Part 2 (units 11–20).
 *
 * Zero-French learners building survival French through A2 grammar.
 * Units 11–13 adapt FR_L4–L6 with TCF Canada / settlement context.
 * Units 14–19 introduce core A2 grammar before the listening checkpoint.
 */

import type { TcfUnit } from "@/lib/tcf-program/types";

export const TRACK_A_PART2: TcfUnit[] = [
  {
    slug: "tcf-a11-restaurant",
    trackId: "foundation",
    order: 11,
    title: "At the restaurant — le, la, and ordering",
    description:
      "Order food politely, read a menu, and pick le vs la for common dishes. TCF listening loves café and restaurant scenes.",
    content: `# At the restaurant — order with confidence

You land in Montréal, find a bistro on Rue Sainte-Catherine, and the server says *Bonjour!* Your phone is at 3%. **After this unit, you can order without it.**

TCF listening questions 1–10 often drop you in a café, a grocery store, or a restaurant. The vocabulary here is not tourist French — it's **exam French you'll hear on test day**.

## Restaurant vocabulary

\`\`\`french-vocab
le menu | the set meal (fixed price) | luh muh-noo
la carte | the menu (à la carte list) | lah kart
l'entrée | starter | lahn-tray
le plat | main course | luh plah
le dessert | dessert | luh deh-sehr
l'eau | water | loh
le vin | wine | luh van
le pain | bread | luh pan
le café | coffee | luh kah-fay
l'addition | the bill | lah-dee-syohn
\`\`\`

> **Canada tip:** In Québec you'll also hear **le déjeuner** (breakfast), **le dîner** (lunch), and **le souper** (dinner). In France those words shift — don't panic on the exam; context and time of day tell you which meal they mean.

## "Le" and "La" — gendered nouns in action

You met articles in Unit 6. Here they matter at the table: every noun is **masculine** (**le**) or **feminine** (**la**). No logic — **le pain**, **la table**, **le café**, **la soupe**.

Before a vowel or silent **h**, both shrink to **l'**: **l'eau**, **l'addition**, **l'entrée**.

\`\`\`french-grammar
title: Articles at the table
note: Memorize each new noun with its article. On TCF listening, gender rarely changes the meaning — but it helps you recognize words in fast speech.
headers: Masculine (le) | Feminine (la) | Before vowel/h (l')
--
"the" | le pain, le plat | la carte, la soupe | l'eau, l'addition
"a/an" | un café | une salade | un ami
"some" | du pain | de la salade | de l'eau
\`\`\`

## "I would like" — your ordering phrase

For anything polite at a table:

> **Je voudrais...** *(zhuh voo-dray)* — "I would like..."

Combine with **un**, **une**, **du**, **de la**, or **de l'**:

> Je voudrais **un** café. *(masculine)*
> Je voudrais **une** soupe. *(feminine)*
> Je voudrais **du** pain. *(some bread)*
> Je voudrais **de la** salade. *(some salad)*
> Je voudrais **de l'**eau. *(some water)*

## Lunch at a Montréal bistro

\`\`\`french-dialogue
title: Ordering lunch
scene: A server brings la carte. You need to eat before your appointment.
--
Server | Bonjour. Vous avez choisi? | Hello. Have you chosen?
You | Oui. Je voudrais la soupe, s'il vous plaît. | Yes. I'd like the soup, please.
Server | Et comme plat? | And for the main?
You | Le poulet, s'il vous plaît. | The chicken, please.
Server | Et à boire? | And to drink?
You | Un verre de jus et de l'eau. | A glass of juice and some water.
Server | Très bien. Merci. | Very good. Thank you.
\`\`\`

## Asking for the bill

When you're done:

> **L'addition, s'il vous plaît.** *(lah-dee-syohn seel voo pleh)*

In Canada, tipping around 15–20% is normal at sit-down restaurants. On the exam, they usually just test whether you understood the total and how someone pays.

## TCF relevance

Listening band A1–A2 loves: **Je voudrais**, **s'il vous plaît**, **l'addition**, prices, and payment method (**par carte**, **en espèces**). Train your ear for **un/une/du/de la** — they fly past in native speech.

## Practice

\`\`\`french-sentence
prompt: I would like a coffee, please.
answer: Je voudrais un café, s'il vous plaît.
distractors: une | la | et
hint: "Coffee" is masculine — "un café"
\`\`\`

\`\`\`french-sentence
prompt: I would like some bread.
answer: Je voudrais du pain.
distractors: le | un | de la
hint: "Some" for masculine nouns = "du"
\`\`\`

## Match

\`\`\`french-match
title: At the table
le pain | the bread
le vin | the wine
l'eau | the water
le menu | the set meal
l'addition | the bill
\`\`\`

## What you can do now

- Read a French menu and spot starters, mains, drinks
- Order politely with **Je voudrais**
- Pick **le** vs **la** vs **l'** for common items
- Ask for the bill — a classic TCF listening beat

Next: **getting around** — metro, bus, and asking strangers for directions.
`,
    estimatedMins: 20,
    xpReward: 60,
    cefrBand: "A1",
    grammarTopics: ["articles-le-la"],
    vocabThemes: ["daily-life", "food"],
    prerequisites: ["tcf-a10-adjectives"],
  },
  {
    slug: "tcf-a12-directions",
    trackId: "foundation",
    order: 12,
    title: "Directions and transport",
    description:
      "Ask where things are, understand left/right/straight, and navigate metro, bus, and train stations.",
    content: `# Getting around — directions and transport

Your phone dies on the way to a TCF prep class. A stranger on the sidewalk becomes your GPS. **After this unit, you can ask — and understand the answer.**

TCF listening often tests **Où est...?**, station names, and direction phrases. These appear in announcements, street conversations, and "lost tourist" scenarios.

## Places and transport

\`\`\`french-vocab
le métro | the subway | luh may-troh
le bus | the bus | luh boos
le train | the train | luh tran
la gare | the train station | lah gar
l'aéroport | the airport | lah-ay-roh-por
le taxi | the taxi | luh tahk-see
la rue | the street | lah roo
le quartier | the neighborhood | luh kar-tyay
l'hôtel | the hotel | loh-tel
le restaurant | the restaurant | luh res-toh-rahn
les toilettes | the bathroom | lay twah-let
\`\`\`

> **Québec note:** Montréal's subway is **le métro**. In smaller cities you'll hear **l'autobus** as often as **le bus**. Both are fair game on the exam.

## "Where is...?"

> **Où est...?** *(oo eh)* — "Where is...?" (singular)
> **Où sont...?** *(oo sohn)* — "Where are...?" (plural)

> **Où est le métro?** — Where's the metro?
> **Où est la gare?** — Where's the train station?
> **Où sont les toilettes?** — Where's the bathroom?

## Directions you'll hear

\`\`\`french-vocab
à gauche | on the left | ah gohsh
à droite | on the right | ah drwaht
tout droit | straight ahead | too drwah
ici | here | ee-see
là-bas | over there | lah-bah
près de | near | preh duh
loin de | far from | lwan duh
à côté de | next to | ah koh-tay duh
en face de | across from | ahn fahs duh
\`\`\`

> **Ear trap:** **à droite** (on the right) vs **tout droit** (straight ahead). They sound similar — listen for **tout**.

## Lost in Montréal

\`\`\`french-dialogue
title: Asking for directions
scene: You stop someone near a metro entrance.
--
You | Pardon, où est le métro, s'il vous plaît? | Excuse me, where is the metro, please?
Local | Tout droit, puis à gauche. C'est à deux minutes. | Straight ahead, then on the left. It's two minutes away.
You | Merci beaucoup! | Thank you very much!
Local | Je vous en prie. | You're welcome.
\`\`\`

Casual version of "you're welcome": **De rien** *(duh ryen)* — "it's nothing."

## Numbers in directions

Combine your numbers from Unit 4:

> **À cinq minutes.** — Five minutes away.
> **La troisième rue à droite.** — The third street on the right.

You don't need every ordinal yet — just recognize **-ième** as "Nth" (troisième = third).

## TCF relevance

Station announcements love: **quai**, **retard**, **prochain arrêt**, **à droite/à gauche**. Even if you miss one word, catching **métro**, **gare**, or a number often gets you the right answer.

## Practice

\`\`\`french-sentence
prompt: Where is the bathroom, please?
answer: Où sont les toilettes, s'il vous plaît?
distractors: est | la | un
hint: "Toilettes" is plural — use "sont" not "est"
\`\`\`

\`\`\`french-sentence
prompt: The hotel is on the right.
answer: L'hôtel est à droite.
distractors: à gauche | la | tout droit
hint: "On the right" = "à droite"
\`\`\`

## Match

\`\`\`french-match
title: Directions
à gauche | on the left
à droite | on the right
tout droit | straight ahead
près de | near
en face de | across from
\`\`\`

## What you can do now

- Ask where any place is — metro, hotel, bathroom
- Understand basic directions in fast speech
- Combine numbers with location ("two minutes", "third street")
- Sound polite when stopping someone on the street

Next: **time, days, and making plans** — appointments, schedules, and meet-ups.
`,
    estimatedMins: 20,
    xpReward: 60,
    cefrBand: "A1",
    grammarTopics: ["directions"],
    vocabThemes: ["daily-life", "transport"],
    prerequisites: ["tcf-a11-restaurant"],
  },
  {
    slug: "tcf-a13-time-plans",
    trackId: "foundation",
    order: 13,
    title: "Time, days, and making plans",
    description:
      "Name the days, tell time, talk about today and tomorrow, and arrange to meet someone.",
    content: `# Time, days, and making plans

Your immigration medical is **mardi à onze heures**. Your friend's text says **demain soir**. If you can't read time and days, you miss appointments — and TCF listening points.

This unit covers the schedule vocabulary that shows up in phone messages, clinic bookings, and casual plans.

## Days of the week

\`\`\`french-vocab
lundi | Monday | luhn-dee
mardi | Tuesday | mar-dee
mercredi | Wednesday | mehr-kruh-dee
jeudi | Thursday | zhuh-dee
vendredi | Friday | vahn-druh-dee
samedi | Saturday | sahm-dee
dimanche | Sunday | dee-mahnsh
\`\`\`

> French days are **not capitalized** unless they start a sentence: **lundi**, not **Lundi**.

## Today, tomorrow, yesterday

\`\`\`french-vocab
aujourd'hui | today | oh-zhoor-dwee
demain | tomorrow | duh-man
hier | yesterday | yair
maintenant | now | man-tuh-nahn
ce matin | this morning | suh mah-tan
ce soir | tonight / this evening | suh swahr
ce week-end | this weekend | suh week-end
\`\`\`

## Telling time

\`\`\`french-vocab
Quelle heure est-il? | What time is it? | kell uhr eh-teel
Il est trois heures. | It is three o'clock. | eel eh trwah zuhr
Il est trois heures et demie. | It is three thirty. | eel eh trwah zuhr ay duh-mee
Il est midi. | It is noon. | eel eh mee-dee
Il est minuit. | It is midnight. | eel eh mee-nwee
\`\`\`

**Pattern:** **Il est** + number + **heures**. Half past: **et demie**. Quarter past: **et quart**. Quarter to: **moins le quart**.

Canada uses the **24-hour clock** in writing (**15h30** = 3:30 PM). In speech, people often use 12-hour with context.

\`\`\`french-grammar
title: Telling time — core pattern
note: "Il est" + hour + "heures". Add "et demie" for :30, "et quart" for :15, "moins le quart" for :45.
headers: On the hour | Half past | Quarter past | Quarter to
--
3:00 | Il est trois heures. | Il est trois heures et demie. | Il est trois heures et quart. | Il est quatre heures moins le quart.
8:00 | Il est huit heures. | Il est huit heures et demie. | Il est huit heures et quart. | Il est neuf heures moins le quart.
\`\`\`

## Arranging dinner

\`\`\`french-dialogue
title: Making plans with a friend
scene: You text a friend you met at a settlement workshop.
--
You | Tu es libre ce soir? | Are you free tonight?
Friend | Oui, pourquoi? | Yes, why?
You | On va au restaurant? À huit heures? | Shall we go to a restaurant? At eight?
Friend | Bonne idée! Où ça? | Good idea! Where?
You | Le bistro près de la gare. | The bistro near the train station.
Friend | Parfait. À ce soir! | Perfect. See you tonight!
\`\`\`

> **On va...?** uses **on** ("one/we") — everyday French for "shall we?"

## "See you..." farewells

\`\`\`french-vocab
À demain | See you tomorrow | ah duh-man
À ce soir | See you tonight | ah suh swahr
À bientôt | See you soon | ah byan-toh
À la prochaine | Until next time | ah lah pro-shen
À tout à l'heure | See you later (today) | ah toot ah luhr
\`\`\`

## TCF relevance

Medical appointments, store hours, and phone messages are listening staples. Lock in **mardi**, **onze heures**, **demain**, **ce soir** — exam scripts recycle them constantly.

## Practice

\`\`\`french-sentence
prompt: What time is it?
answer: Quelle heure est-il?
distractors: comment | le | où
hint: "What time" = "Quelle heure"
\`\`\`

\`\`\`french-sentence
prompt: See you tomorrow!
answer: À demain!
distractors: ce soir | aujourd'hui | hier
hint: "Tomorrow" = "demain"
\`\`\`

## Match

\`\`\`french-match
title: Time words
aujourd'hui | today
demain | tomorrow
hier | yesterday
maintenant | now
ce soir | tonight
\`\`\`

## What you can do now

- Name every day of the week
- Tell time on the 12-hour clock
- Talk about today, tomorrow, this weekend
- Arrange a meet-up and say goodbye properly

You've built the **A1 survival kit**. Next up: grammar that unlocks **talking about plans and the past** — where TCF A2 really starts.
`,
    estimatedMins: 22,
    xpReward: 65,
    cefrBand: "A1",
    grammarTopics: ["time-plans"],
    vocabThemes: ["daily-life", "scheduling"],
    prerequisites: ["tcf-a12-directions"],
  },
  {
    slug: "tcf-a14-futur-proche",
    trackId: "foundation",
    order: 14,
    title: "Futur proche — going to do",
    description:
      "Express near-future plans with aller + infinitive. Essential for talking about what you're about to do in Canada.",
    content: `# Futur proche — "I'm going to..."

**Next week I am going to open a bank account.** In French, that's not the formal future tense — it's **futur proche**: everyday plans, intentions, and things happening soon.

Immigration life runs on plans: **Je vais chercher un appartement**, **Nous allons visiter l'école**. TCF speaking and writing at A2 expect you to talk about what's coming up.

## The pattern: aller + infinitive

> **Je vais + [verb in infinitive form]**

English "going to" maps almost perfectly:

> **Je vais manger.** — I'm going to eat.
> **Je vais étudier le français.** — I'm going to study French.
> **Nous allons déménager.** — We're going to move.

\`\`\`french-grammar
title: Futur proche — aller + infinitive
note: Conjugate "aller" in the present, then drop any subject pronoun on the second verb — it stays in the infinitive.
headers: aller (present) | + infinitive | Example
--
je vais | parler | Je vais parler au conseiller.
tu vas | chercher | Tu vas chercher un travail?
il/elle va | s'inscrire | Elle va s'inscrire au cours.
nous allons | visiter | Nous allons visiter Montréal.
vous allez | déménager | Vous allez déménager quand?
ils/elles vont | arriver | Ils vont arriver demain.
\`\`\`

## Settlement plans vocabulary

\`\`\`french-vocab
déménager | to move (house) | day-may-nah-zhay
s'inscrire | to register / sign up | san-skreer
chercher | to look for | sehr-shay
trouver | to find | troo-vay
commencer | to start | koh-mahn-say
finir | to finish | fee-neer
préparer | to prepare | pray-pah-ray
rencontrer | to meet | rahn-kohn-tray
\`\`\`

## Planning your first week

\`\`\`french-dialogue
title: Talking about next steps
scene: A settlement worker asks about your plans.
--
Worker | Qu'est-ce que vous allez faire cette semaine? | What are you going to do this week?
You | Je vais ouvrir un compte bancaire et chercher un logement. | I'm going to open a bank account and look for housing.
Worker | Et pour le français? | And for French?
You | Je vais commencer un cours lundi. Nous allons aussi visiter l'école des enfants. | I'm going to start a class Monday. We're also going to visit the children's school.
Worker | Excellent. Vous allez bien vous intégrer. | Excellent. You're going to integrate well.
\`\`\`

## Futur proche vs present

Sometimes French uses present for "near future" in casual speech (**Je pars demain**). On the exam, **aller + infinitive** is the safe, clear choice when the question tests "going to."

## TCF relevance

Oral tasks often ask: **Qu'est-ce que vous allez faire...?** Writing prompts mention future plans (job search, studies, moving). Master **je vais / nous allons / vous allez**.

## Practice

\`\`\`french-sentence
prompt: I'm going to study French.
answer: Je vais étudier le français.
distractors: étudie | aller | étudierai
hint: Futur proche = "je vais" + infinitive "étudier"
\`\`\`

\`\`\`french-sentence
prompt: We are going to move next month.
answer: Nous allons déménager le mois prochain.
distractors: déménageons | allons déménagerons | déménager
hint: "Nous allons" + infinitive — only one conjugated verb
\`\`\`

## Match

\`\`\`french-match
title: Settlement verbs
déménager | to move (house)
s'inscrire | to register
chercher | to look for
commencer | to start
rencontrer | to meet
\`\`\`

## What you can do now

- Talk about plans with **je vais / nous allons + infinitive**
- Discuss settlement steps: bank, housing, school, French class
- Recognize futur proche in listening scripts about schedules

Next: **passé composé** — what you *did*, not what you're *going to do*.
`,
    estimatedMins: 20,
    xpReward: 70,
    cefrBand: "A2",
    grammarTopics: ["futur-proche"],
    vocabThemes: ["immigration", "daily-life"],
    prerequisites: ["tcf-a13-time-plans"],
  },
  {
    slug: "tcf-a15-passe-compose",
    trackId: "foundation",
    order: 15,
    title: "Passé composé — what you did",
    description:
      "Introduce the completed past with avoir. Talk about specific actions you finished — yesterday, last week, already.",
    content: `# Passé composé — completed actions in the past

**Yesterday I opened my bank account.** That's a finished event — start, end, done. French puts that in **passé composé** (PC), not the present.

This is your first past tense. We start with **avoir** as the helper verb — it covers most verbs you'll need at A2.

## How passé composé is built

> **avoir (present) + past participle**

For regular **-er** verbs, the past participle ends in **-é**:

> **parler** → **parlé** → J'**ai parlé** (I spoke / I have spoken)
> **manger** → **mangé** → Tu **as mangé**
> **étudier** → **étudié** → Elle **a étudié**

\`\`\`french-grammar
title: Passé composé with avoir
note: Most verbs use "avoir". The past participle agrees in number/gender only with "être" verbs (next level). With avoir, no agreement for now.
headers: Subject | avoir (present) | past participle (-er → -é)
--
je | ai | parlé
tu | as | mangé
il/elle | a | étudié
nous | avons | travaillé
vous | avez | choisi
ils/elles | ont | regardé
\`\`\`

## Time markers for completed actions

\`\`\`french-vocab
hier | yesterday | yair
la semaine dernière | last week | lah suh-men dair-nyair
le mois dernier | last month | luh mwah dair-nyay
l'année dernière | last year | lah-nay dair-nyair
déjà | already | day-zhah
soudain | suddenly | soo-dan
\`\`\`

When you see **hier**, **la semaine dernière**, or a specific date → think **passé composé**.

## Your first week in Canada

\`\`\`french-dialogue
title: What did you do last week?
scene: A neighbour makes small talk in the hallway.
--
Neighbour | Alors, vous avez bien déménagé? | So, did you move in OK?
You | Oui! Hier j'ai visité le quartier et j'ai acheté des provisions. | Yes! Yesterday I explored the neighbourhood and bought groceries.
Neighbour | Et la banque? | And the bank?
You | J'ai ouvert un compte lundi. J'ai aussi téléphoné à l'école. | I opened an account Monday. I also called the school.
Neighbour | Vous avez travaillé dur! | You've worked hard!
\`\`\`

## Irregular past participles — learn these first

\`\`\`french-vocab
avoir → eu | had | oo
être → été | been | ay-tay
faire → fait | done / made | fay
prendre → pris | taken | pree
voir → vu | seen | voo
mettre → mis | put | mee
\`\`\`

> **J'ai eu** / **J'ai fait** / **J'ai pris** — drill these cold. They appear in listening and speaking constantly.

## TCF relevance

**Qu'est-ce que vous avez fait...?** is a speaking classic. Listening scripts recount weekend activities, appointments completed, purchases made. **Hier j'ai...** is your template.

## Practice

\`\`\`french-sentence
prompt: Yesterday I studied French.
answer: Hier j'ai étudié le français.
distractors: étudiais | ai étudie | étudier
hint: Specific yesterday → passé composé: "j'ai" + past participle "étudié"
\`\`\`

\`\`\`french-sentence
prompt: We bought groceries last week.
answer: Nous avons acheté des provisions la semaine dernière.
distractors: achetons | avons acheter | achetions
hint: "Acheter" → past participle "acheté"
\`\`\`

## Match

\`\`\`french-match
title: Past participles
parlé | spoke
mangé | ate
fait | done / made
vu | seen
pris | taken
\`\`\`

## What you can do now

- Form passé composé with **avoir + -é** (regular -er verbs)
- Use **hier**, **la semaine dernière** with completed actions
- Handle common irregular participles: **fait, vu, pris, eu**
- Answer "What did you do...?" in speaking practice

Next: **imparfait** — the other past tense, for background and habits.
`,
    estimatedMins: 22,
    xpReward: 75,
    cefrBand: "A2",
    grammarTopics: ["passe-compose"],
    vocabThemes: ["immigration", "daily-life"],
    prerequisites: ["tcf-a14-futur-proche"],
  },
  {
    slug: "tcf-a16-imparfait",
    trackId: "foundation",
    order: 16,
    title: "Imparfait — habits and background",
    description:
      "Describe ongoing past states, repeated habits, and scene-setting with imparfait. Different from passé composé.",
    content: `# Imparfait — background, habits, and "used to"

**When I was in my home country, I worked in IT.** That's not one finished event — it's a period, a habit, a background state. French uses **imparfait** (IMP).

English often uses the same words for both past tenses ("I was working" vs "I worked"). French splits them sharply. This unit covers imparfait alone; the next unit combines both.

## How imparfait is formed

Take the **nous** form of the present tense, drop **-ons**, add imparfait endings:

> **parler** → nous parl**ons** → parl- + **ais** → **je parlais**
> **finir** → nous finiss**ons** → finiss- + **ais** → **je finissais**

\`\`\`french-grammar
title: Imparfait endings (all verb types)
note: One set of endings for -er, -ir, and -re verbs. Stem = nous-present minus "-ons".
headers: je | tu | il/elle | nous | vous | ils/elles
--
-ais | -ais | -ait | -ions | -iez | -aient
\`\`\`

Examples:

> **je parlais** — I was speaking / I used to speak
> **il faisait** — it was (weather) / he was doing
> **nous habitions** — we were living / we used to live

## When to use imparfait — three cases

### 1. Habit or repeated action
> **Quand j'étais jeune, je jouais au foot.** — When I was young, I used to play soccer.

### 2. Ongoing background / description
> **Il faisait froid.** — It was cold.
> **La maison était grande.** — The house was big.

### 3. Ongoing state with no clear end
> **J'habitais à Mumbai.** — I lived in Mumbai (for a period — no specific move date).

\`\`\`french-vocab
quand j'étais... | when I was... | kahn zhay-teh
d'habitude | usually | dah-bee-tood
souvent | often | soo-vahn
toujours | always | too-zhoor
parfois | sometimes | par-fwah
à l'époque | at the time | ah lay-pok
\`\`\`

## Life before and after

\`\`\`french-dialogue
title: Talking about your old life
scene: Conversation at a community centre French class.
--
Classmate | Vous faisiez quoi dans votre pays? | What did you do in your country?
You | J'étais ingénieur. Je travaillais dans une grande entreprise. | I was an engineer. I worked at a big company.
Classmate | Et votre famille? | And your family?
You | Mes enfants allaient à l'école près de la maison. Nous parlions anglais à la maison. | My children went to school near the house. We spoke English at home.
Classmate | Et maintenant? | And now?
You | Maintenant j'étudie le français tous les jours! | Now I study French every day!
\`\`\`

> **J'étais** is imparfait of **être** — irregular but essential: **j'étais, tu étais, il était, nous étions, vous étiez, ils étaient**.

## Imparfait vs passé composé — quick preview

| Imparfait | Passé composé |
|-----------|---------------|
| I **was living** in Mumbai (period) | I **moved** to Canada in 2024 (event) |
| It **was raining** (background) | I **left** at 8 (event) |
| I **used to play** tennis (habit) | I **played** a match yesterday (one time) |

Full combo rules come in the next unit.

## TCF relevance

Speaking tasks ask about life **before** Canada — imparfait territory. Descriptions in listening (**il faisait beau**, **la boutique était fermée**) often set the scene before a passé composé action.

## Practice

\`\`\`french-sentence
prompt: When I was young, I lived in a small town.
answer: Quand j'étais jeune, j'habitais dans une petite ville.
distractors: ai habité | habite | étais habité
hint: Ongoing past state → imparfait: "j'habitais"
\`\`\`

\`\`\`french-sentence
prompt: It was cold yesterday morning.
answer: Il faisait froid hier matin.
distractors: a fait | fait | faisait froid
hint: Weather description → imparfait: "il faisait"
\`\`\`

## Match

\`\`\`french-match
title: Imparfait signals
d'habitude | usually
souvent | often
quand j'étais | when I was
à l'époque | at the time
il faisait | it was (weather)
\`\`\`

## What you can do now

- Form imparfait from the nous-present stem
- Describe past habits and ongoing states
- Set scene with weather and descriptions (**il faisait**, **c'était**)
- Talk about your life before immigration

Next: **combining** imparfait and passé composé — the storytelling duo.
`,
    estimatedMins: 22,
    xpReward: 75,
    cefrBand: "A2",
    grammarTopics: ["imparfait"],
    vocabThemes: ["immigration", "daily-life"],
    prerequisites: ["tcf-a15-passe-compose"],
  },
  {
    slug: "tcf-a17-pc-vs-imp-light",
    trackId: "foundation",
    order: 17,
    title: "Past tenses — scene + event (light)",
    description:
      "Combine imparfait (background) with passé composé (event). A preview before the Bridge track deep dive.",
    content: `# Past tenses — scene + event (light version)

Real stories use **two past tenses at once**. The weather **was** bad (imparfait). You **missed** the bus (passé composé). This combo appears everywhere — conversations, TCF listening, and your eventual Bridge unit on past tenses.

This is the **light** version: one core rule, one dialogue, enough to start combining. The Bridge track goes deeper (four cases, plus-que-parfait, exam traps).

## The one rule to internalize

> **Imparfait = the scene. Passé composé = what happened in it.**

Think of imparfait as the movie backdrop — weather, feelings, what was ongoing. Passé composé is the plot point — the phone rang, you arrived, you decided.

\`\`\`french-grammar
title: Scene + event — quick picker
note: Ask: "Was this ongoing/background?" → imparfait. "Was this a completed event?" → passé composé.
headers: Signal words | Tense | Example
--
hier, soudain, déjà | passé composé | Hier j'ai raté le bus.
d'habitude, souvent, quand j'étais | imparfait | Je prenais le métro tous les jours.
pendant que, quand (+ ongoing) | imparfait + PC | Pendant que je marchais, j'ai vu un ami.
\`\`\`

## Classic combo examples

> **Il pleuvait quand je suis sorti.** — It was raining when I went out.
> **Je regardais la télé quand il a téléphoné.** — I was watching TV when he called.
> **Nous parlions français quand le cours a commencé.** — We were speaking French when the class started.

**Pendant que** + imparfait ... **passé composé** is the pattern to recognize in listening.

## A rainy Monday

\`\`\`french-dialogue
title: A story with both tenses
scene: You explain why you were late to your French class.
--
You | Désolé, je suis en retard. Il pleuvait et j'ai raté le bus. | Sorry, I'm late. It was raining and I missed the bus.
Teacher | Ce n'est pas grave. Vous attendiez longtemps? | It's OK. Were you waiting long?
You | Oui, j'attendais à l'arrêt. Puis un ami est passé en voiture et m'a conduit ici. | Yes, I was waiting at the stop. Then a friend drove by and brought me here.
Teacher | Quelle chance! Asseyez-vous. | Lucky! Take a seat.
\`\`\`

Notice: **il pleuvait** (background), **j'ai raté** (event), **j'attendais** (ongoing wait), **est passé / m'a conduit** (events).

## Your immigration story — template

> **Avant, je travaillais comme [job]. En [year], j'ai décidé de immigrer au Canada. Quand je suis arrivé(e), il faisait encore froid!**

Imparfait for old life; passé composé for the decision and arrival.

## TCF relevance

You won't get the full four-case drill yet — that's Bridge. But listening band A2 already mixes tenses in narratives. Train your ear: **-ais/-ait** (imparfait) vs **ai/as/a + participle** (passé composé).

## Practice

\`\`\`french-sentence
prompt: I was reading when my friend called.
answer: Je lisais quand mon ami a téléphoné.
distractors: ai lu | lisais | téléphonait
hint: Reading = ongoing (imparfait); the call = event (passé composé)
\`\`\`

\`\`\`french-sentence
prompt: It was sunny when we arrived.
answer: Il faisait beau quand nous sommes arrivés.
distractors: a fait | faisait | sommes arrivé
hint: Weather = imparfait; arrival = passé composé (être verb — note "arrivés" with nous)
\`\`\`

## Match

\`\`\`french-match
title: Which tense?
J'ai ouvert un compte lundi. | passé composé (specific event)
J'habitais à Delhi avant. | imparfait (past state)
Il pleuvait quand je suis parti. | both — scene + event
Je prenais le bus tous les jours. | imparfait (habit)
Soudain, le téléphone a sonné. | passé composé (sudden event)
\`\`\`

## What you can do now

- Combine imparfait (scene) + passé composé (event) in one sentence
- Use **pendant que** + imparfait with a passé composé interrupt
- Tell a short immigration or daily-life story with both tenses
- Recognize the combo in A2 listening scripts

Next: **direct object pronouns** — replace **le pain** with **le**.
`,
    estimatedMins: 22,
    xpReward: 80,
    cefrBand: "A2",
    grammarTopics: ["pc-vs-imp-light"],
    vocabThemes: ["daily-life", "immigration"],
    prerequisites: ["tcf-a16-imparfait"],
  },
  {
    slug: "tcf-a18-pronouns-cod",
    trackId: "foundation",
    order: 18,
    title: "Direct object pronouns — le, la, les",
    description:
      "Replace objects with le, la, les before the verb. Stop repeating nouns in every sentence.",
    content: `# Direct object pronouns — le, la, les

**I bought the bread. I ate the bread.** Sounds robotic. French says: **J'ai acheté le pain. Je l'ai mangé.** — **le** replaces **le pain** (masculine direct object).

These tiny words (**le, la, les**) sit **before the conjugated verb** (or before **avoir** in passé composé). They're everywhere in native speech and TCF listening.

## What is a direct object?

The thing directly receiving the action — no "to" or "for" in between:

> Je mange **le pain**. (I eat the bread — bread = direct object)
> Je regarde **la télé**. (I watch TV)
> J'achète **les livres**. (I buy the books)

## The pronouns

| Replaces | Pronoun | Example |
|----------|---------|---------|
| masculine singular (le pain) | **le** | Je **le** mange. |
| feminine singular (la soupe) | **la** | Je **la** mange. |
| plural (les livres) | **les** | Je **les** achète. |

Before a vowel: **l'** → **Je l'ai mangé.** (m or f — sounds the same)

\`\`\`french-grammar
title: Placement — where the pronoun goes
note: In present: before the verb. In passé composé: before "avoir" (the helper), not before the participle.
headers: Tense | Placement | Example
--
Present | pronoun + verb | Je le vois.
Passé composé | pronoun + avoir + participle | Je l'ai vu.
Negative | ne + pronoun + verb + pas | Je ne le vois pas.
\`\`\`

## At the market

\`\`\`french-dialogue
title: Shopping without repeating nouns
scene: You're at the market with a friend.
--
Friend | Tu aimes ces pommes? | Do you like these apples?
You | Oui, je les achète. | Yes, I'm buying them.
Friend | Et le fromage? | And the cheese?
You | Je le prends aussi. Ma femme l'adore. | I'm getting that too. My wife loves it.
Friend | Tu l'as déjà goûté? | Have you already tasted it?
You | Non, mais je vais le goûter ce soir. | No, but I'm going to taste it tonight.
\`\`\`

## Past participle agreement — don't overthink yet

With **avoir**, the participle usually **does not** agree with the object:

> Je l'ai mangé. (it = le pain, masculine — but no extra -e)

With **être** verbs, agreement matters more (Bridge track). For now: focus on **placement** and **le/la/les**.

## TCF relevance

Fast speech drops nouns: **Tu le veux?** **Je l'ai fait.** **On les a vus.** Missing the pronoun = missing the answer in listening.

## Practice

\`\`\`french-sentence
prompt: I eat it. (the soup — feminine)
answer: Je la mange.
distractors: le | les | mange la
hint: "La soupe" → feminine direct object = "la"
\`\`\`

\`\`\`french-sentence
prompt: I bought them. (the books — plural)
answer: Je les ai achetés.
distractors: les ai acheté | le ai achetés | ai les achetés
hint: Plural object = "les" before "ai"
\`\`\`

## Match

\`\`\`french-match
title: Pronoun replacement
le pain → Je ... mange. | le
la soupe → Je ... mange. | la
les livres → J'... ai lus. | les
le fromage → Je ... prends. | le
\`\`\`

## What you can do now

- Replace masculine, feminine, and plural direct objects with **le, la, les**
- Place pronouns before the verb (and before **avoir** in passé composé)
- Understand fast speech that drops repeated nouns

Next: **reflexive verbs** — **se lever**, **se coucher**, and your morning routine.
`,
    estimatedMins: 20,
    xpReward: 75,
    cefrBand: "A2",
    grammarTopics: ["pronouns-cod"],
    vocabThemes: ["daily-life"],
    prerequisites: ["tcf-a17-pc-vs-imp-light"],
  },
  {
    slug: "tcf-a19-reflexive",
    trackId: "foundation",
    order: 19,
    title: "Reflexive verbs — daily routine",
    description:
      "Describe your morning with se lever, se laver, s'habiller. Reflexive verbs for actions you do to yourself.",
    content: `# Reflexive verbs — your daily routine

**I get up. I wash. I get dressed.** In French, these use **reflexive** verbs — the action reflects back on the subject. The extra **se** (myself/yourself) is built into the verb.

Daily routine vocab is gold for TCF speaking: describe **your typical day**, a common A2 prompt.

## The pattern: se + verb

Infinitive: **se lever** (to get up), **se laver** (to wash oneself), **s'habiller** (to get dressed).

\`\`\`french-grammar
title: Present tense — reflexive verbs
note: Reflexive pronoun (me/te/se/nous/vous/se) + verb. Before vowel: m'/t'/s'.
headers: Pronoun | se lever | se laver | s'habiller
--
je | me lève | me lave | m'habille
tu | te lèves | te laves | t'habilles
il/elle | se lève | se lave | s'habille
nous | nous levons | nous lavons | nous habillons
vous | vous levez | vous lavez | vous habillez
ils/elles | se lèvent | se lavent | s'habillent
\`\`\`

## Morning routine vocabulary

\`\`\`french-vocab
se réveiller | to wake up | suh ray-vay-yay
se lever | to get up | suh luh-vay
se laver | to wash (oneself) | suh lah-vay
se brosser les dents | to brush one's teeth | suh broh-say lay dahn
se doucher | to shower | suh doo-shay
s'habiller | to get dressed | sah-bee-yay
se coucher | to go to bed | suh koo-shay
s'endormir | to fall asleep | zahn-dor-meer
\`\`\`

## A weekday morning

\`\`\`french-dialogue
title: Describing your routine
scene: Your French teacher asks about a typical workday.
--
Teacher | Décrivez votre journée typique. | Describe your typical day.
You | Je me réveille à six heures. Je me lève et je me douche. | I wake up at six. I get up and I shower.
Teacher | Et ensuite? | And then?
You | Je me habille — pardon — **je m'habille** et je prends le petit-déjeuner. Je me brosse les dents avant de sortir. | I get dressed and I have breakfast. I brush my teeth before leaving.
Teacher | À quelle heure vous couchez-vous? | What time do you go to bed?
You | Je me couche vers vingt-deux heures. | I go to bed around ten PM.
\`\`\`

> **Je m'habille** — the **me** drops to **m'** before a vowel. Same for **je m'endors** (I fall asleep).

## Reflexive in passé composé

Reflexive verbs use **être** (not avoir) in passé composé:

> **Je me suis levé(e).** — I got up.
> **Elle s'est couchée.** — She went to bed.

Add **-e** for feminine, **-s** for plural subject. Don't stress agreement yet — recognize the **me suis / s'est** pattern.

## TCF relevance

**Décrivez votre journée** is a speaking staple. Listening scripts describe someone's routine (alarm, shower, commute). Lock in **se lever, se coucher, s'habiller**.

## Practice

\`\`\`french-sentence
prompt: I get up at seven o'clock.
answer: Je me lève à sept heures.
distractors: me lever | lève me | je lève
hint: Reflexive = "je me" + "lève"
\`\`\`

\`\`\`french-sentence
prompt: She gets dressed quickly.
answer: Elle s'habille vite.
distractors: se habille | l'habille | habille
hint: "S'habiller" — elle + s' + habille
\`\`\`

## Match

\`\`\`french-match
title: Morning routine
se réveiller | to wake up
se lever | to get up
se doucher | to shower
s'habiller | to get dressed
se coucher | to go to bed
\`\`\`

## What you can do now

- Describe your daily routine with reflexive verbs
- Conjugate **se lever, se laver, s'habiller, se coucher** in the present
- Recognize reflexive passé composé with **être** (**je me suis levé**)
- Handle a "typical day" speaking prompt

Next: **A2 checkpoint** — your first TCF listening drill strategy.
`,
    estimatedMins: 22,
    xpReward: 80,
    cefrBand: "A2",
    grammarTopics: ["reflexive-verbs"],
    vocabThemes: ["daily-life"],
    prerequisites: ["tcf-a18-pronouns-cod"],
  },
  {
    slug: "tcf-a20-a2-checkpoint",
    trackId: "foundation",
    order: 20,
    title: "A2 checkpoint — listening strategy",
    description:
      "How TCF listening works at A1/A2, what to listen for, and your first practice drill. Then head to the listening module.",
    content: `# A2 checkpoint — your first listening strategy

You've built **20 units** of Foundation French: greetings to reflexive verbs, present to past tenses. Time to see how that knowledge maps to a **real TCF Canada listening task**.

This unit is strategy, not new grammar. You'll learn how the exam is structured, what A1/A2 questions sound like, and how to use what you already know.

## How TCF listening is structured

TCF Canada **Compréhension orale** has **39 questions** in three bands:

| Questions | Level | What you'll hear |
|-----------|-------|------------------|
| 1–10 | A1–A2 | Short everyday scenes: café, store, weather, appointments |
| 11–25 | B1–B2 | Interviews, news, workplace — you'll get here in Bridge |
| 26–39 | C1–C2 | Debates, lectures — NCLC 7 territory, much later |

**Right now, own questions 1–10.** That's your Foundation payoff.

## What A1/A2 listening actually tests

No tricks at this level. Scripts reuse the vocabulary you've studied:

- **Ordering food** — *Je voudrais*, *l'addition*, *par carte*
- **Directions** — *Où est*, *à droite*, *tout droit*, *le métro*
- **Time and appointments** — *mardi*, *onze heures*, *demain*
- **Shopping and prices** — numbers, *combien*, *à gauche / au fond*
- **Phone messages** — *Je t'appelle pour*, *est-ce que tu es libre*

You don't need to catch every word. You need **one anchor** — a number, a day, a place, a payment method.

## The 4-step drill method

### 1. Read the question first
The question tells you what to hunt for: *Quand est le rendez-vous?* → listen for a **day** and **time**.

### 2. Listen for signal words
| If the question asks... | Listen for... |
|------------------------|---------------|
| When? | *lundi, demain, à huit heures* |
| Where? | *à droite, quai 7, au fond* |
| How much / how many? | numbers, *euros, dollars* |
| Why? | *parce que, pour, afin de* |

### 3. Eliminate wrong answers before the audio ends
If you hear **mardi** and one option says **mercredi**, cross it off immediately.

### 4. Replay once — same anchor
Second listen: don't restart from zero. Confirm the one word or number you caught.

\`\`\`french-grammar
title: Foundation listening toolkit
note: These structures appear repeatedly in questions 1–10. Recognize them in fast speech.
headers: Topic | Key phrases | Unit
--
Restaurant | Je voudrais, l'addition, par carte | Unit 11
Directions | Où est, à droite, tout droit | Unit 12
Time | mardi, demain, Il est... heures | Unit 13
Plans | Je vais + infinitive | Unit 14
Past events | Hier j'ai..., la semaine dernière | Unit 15–17
\`\`\`

## Mini practice — think before you click

Read this script (as if you heard it). Then answer the question.

> **Script:** *Bonjour! Je voudrais un café et un croissant, s'il vous plaît. — Très bien. Vous payez comment? — Par carte, s'il vous plaît. — Voilà. Bonne journée!*

**Question:** *Comment cette personne paie-t-elle?*

Options: En espèces · **Par carte** · Par chèque · Elle ne paie pas

You caught **par carte** — that's a real TCF A1 question pattern.

\`\`\`french-sentence
prompt: What two things does the customer order?
answer: Un café et un croissant.
distractors: un thé | l'addition | par carte
hint: Listen for "Je voudrais" + the items right after
\`\`\`

## Match your units to exam topics

\`\`\`french-match
title: Unit → listening topic
Unit 11 — Restaurant | café, ordering, bill
Unit 12 — Directions | métro, gare, à droite
Unit 13 — Time | rendez-vous, jours, heures
Unit 15 — Passé composé | Hier j'ai..., weekend stories
Unit 19 — Reflexive | daily routine descriptions
\`\`\`

## Your practice assignment

Head to the **TCF Listening** module. Start with **questions 1–10** (A1–A2 band):

1. Read the question before playing audio
2. Use the 4-step method above
3. After each question, read the explanation — even when you're right
4. Revisit any question where you missed the **signal word**, not just the answer

**Target:** 7/10 or better on questions 1–10 before moving to Bridge track units.

## What you've built (Units 1–20)

- Survival French: greet, count, ask questions, order food, get directions, make plans
- Core grammar: articles, être/avoir, -er verbs, negation, adjectives
- A2 tenses: futur proche, passé composé, imparfait, scene + event combo
- Pronouns: le/la/les (direct objects), reflexive daily routine
- **First exam skill:** A1/A2 listening strategy

## Foundation complete — what's next

**Bridge track** picks up with deeper past-tense rules, more pronouns, and listening bands 11–25. Your NCLC journey is long — but you're no longer at zero.

**Go practice listening now.** That's where Foundation meets the real test.
`,
    estimatedMins: 18,
    xpReward: 100,
    cefrBand: "A2",
    grammarTopics: ["listening-strategy"],
    vocabThemes: ["exam-prep"],
    prerequisites: ["tcf-a19-reflexive"],
    practiceModule: "listening",
    practiceHint:
      "Start with questions 1–10 (A1–A2 band). Read each question before playing audio, then use the 4-step method from this unit.",
  },
];
