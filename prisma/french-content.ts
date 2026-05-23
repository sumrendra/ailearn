/* eslint-disable no-irregular-whitespace */
/**
 * French Fundamentals — 6 lesson bodies.
 *
 * Designed for absolute beginners (A0 → A1 by end). Heavy on interactive
 * components, light on prose. Every lesson follows the same loop:
 *   1. Tiny conversational intro (why this matters)
 *   2. Vocab grid (click to hear)
 *   3. A grammar concept, explained simply
 *   4. Conversation scene to see it in context
 *   5. Practice — sentence builder + matching exercise
 *   6. "What you learned" tiny recap
 *
 * Audio is browser TTS (Web Speech API) — no audio files needed.
 */

export const FR_L1 = `# Bonjour! Your first words in French

Welcome. By the end of this lesson, you will be able to **say hello, introduce yourself, and politely say goodbye** in French. That's not nothing — that's the start of every conversation you'll ever have.

A small mental shift first: French is read **mostly** like English, but with a few tricks. Many letters at the end of words go silent. The "h" is *always* silent. Vowels often come out softer. Don't worry about the rules — you'll absorb them by listening.

Click any French word below to hear it spoken. Try repeating it out loud — yes, even right now, even if you feel silly. That's how this works.

\`\`\`french-vocab
Bonjour | Hello (good day) | bohn-zhoor
Salut | Hi (casual) | sah-loo
Bonsoir | Good evening | bohn-swahr
Au revoir | Goodbye | oh ruh-vwahr
Merci | Thank you | mehr-see
S'il vous plaît | Please (formal) | seel voo pleh
Oui | Yes | wee
Non | No | nohn
\`\`\`

## Two ways to say "hi"

French has a polite world and a casual world, and they don't mix. Use the right one or you'll sound weird.

| Situation | Use |
|-----------|-----|
| Stranger, shopkeeper, anyone older, work | **Bonjour** |
| Friends, family, kids, anyone you'd hug | **Salut** |
| After ~6pm (any context) | **Bonsoir** |

When in doubt, **say Bonjour**. It's never wrong.

## "I am..." — your first sentence

To introduce yourself, French uses a tiny verb: **être** (to be). For now, you only need one form:

> **Je suis** [your name].
> *zhuh swee* — "I am [your name]."

That's it. Try it: **Je suis Alex**. **Je suis Sarah**.

To ask someone *their* name, you say:

> **Comment vous appelez-vous?**
> *koh-mahn voo zah-play voo* — "What's your name?" (formal)

And they reply:

> **Je m'appelle Marie.**
> *zhuh mah-pell mah-ree* — "My name is Marie." (literally: "I call myself Marie")

You don't need to memorize the rule for now. Just recognize the pattern.

## A real conversation

Here's how it actually sounds. Tap any bubble to hear the line, or hit **Play all** to listen to the whole thing.

\`\`\`french-dialogue
title: First meeting at a café
scene: You sit down next to someone at a small table.
--
Marie | Bonjour! | Hello!
You | Bonjour! Je m'appelle Alex. | Hello! My name is Alex.
Marie | Enchantée. Je m'appelle Marie. | Nice to meet you. My name is Marie.
You | Enchanté! | Nice to meet you!
\`\`\`

> **Quick note on Enchanté:** Women say **Enchantée** (extra e), men say **Enchanté**. They sound identical — the spelling difference is a grammar thing you'll meet later.

## Your turn — build the sentence

\`\`\`french-sentence
prompt: Hello! My name is Alex.
answer: Bonjour! Je m'appelle Alex.
distractors: au revoir | merci | suis
hint: "My name is" uses "Je m'appelle" — literally "I call myself".
\`\`\`

## Match what you've learned

\`\`\`french-match
title: Greetings & basics
Bonjour | Hello
Au revoir | Goodbye
Merci | Thank you
S'il vous plaît | Please
Oui | Yes
Non | No
\`\`\`

## What you can do now

- Say hello (Bonjour / Salut / Bonsoir) and pick the right one
- Introduce yourself: **Je m'appelle [your name]**
- Say please, thank you, yes, no, and goodbye

Next lesson: **numbers and how to count**. You'll be able to order, pay, and ask for things by quantity.
`;

export const FR_L2 = `# Numbers — count like a Parisian

You can already say hello. Now you'll be able to **count, tell prices, share your age, give a phone number, and order "two coffees, please"**. Numbers come up *every conversation*.

French numbers 1–20 are mostly easy. Then they get weird around 70. Don't panic — we'll cover 0–69 in this lesson and tackle the strange ones later when you actually need them.

## 0 to 10

\`\`\`french-vocab
zéro | zero | zay-roh
un | one | uhn
deux | two | duh
trois | three | trwah
quatre | four | kat-ruh
cinq | five | sank
six | six | sees
sept | seven | set
huit | eight | weet
neuf | nine | nuhf
dix | ten | dees
\`\`\`

Listen to each one carefully. The numbers **deux**, **trois**, **cinq**, **dix** are the ones English speakers most often mispronounce. Click them a few times.

## 11 to 20

11–16 each have their own word. 17, 18, 19 are "ten-seven", "ten-eight", "ten-nine".

\`\`\`french-vocab
onze | eleven | onz
douze | twelve | dooz
treize | thirteen | trez
quatorze | fourteen | kah-torz
quinze | fifteen | kanz
seize | sixteen | sehz
dix-sept | seventeen | dees-set
dix-huit | eighteen | dees-weet
dix-neuf | nineteen | dees-nuhf
vingt | twenty | van
\`\`\`

## 20 to 69 — the easy decades

The decade words you need: **vingt** (20), **trente** (30), **quarante** (40), **cinquante** (50), **soixante** (60).

To say a number like 23, you combine: **vingt-trois** (20-3). For *one* you use **et un** ("and one"):

> 21 = **vingt et un**
> 22 = **vingt-deux**
> 23 = **vingt-trois**
> 31 = **trente et un**
> 32 = **trente-deux**
> 45 = **quarante-cinq**
> 67 = **soixante-sept**

Just remember: **\`et un\` for 21, 31, 41, 51, 61**. Everywhere else, just hyphenate.

\`\`\`french-grammar
title: Building numbers 20–69
note: Pick a decade, then add the units. Use "et un" for X1 only.
headers: 0 (decade) | 1 (et un) | 5 (-cinq) | 9 (-neuf)
--
20s | vingt | vingt et un | vingt-cinq | vingt-neuf
30s | trente | trente et un | trente-cinq | trente-neuf
40s | quarante | quarante et un | quarante-cinq | quarante-neuf
50s | cinquante | cinquante et un | cinquante-cinq | cinquante-neuf
60s | soixante | soixante et un | soixante-cinq | soixante-neuf
\`\`\`

## Ordering coffee — numbers in action

\`\`\`french-dialogue
title: At a Parisian café
scene: You walk up to the counter.
--
Server | Bonjour! Vous désirez? | Hello! What would you like?
You | Deux cafés, s'il vous plaît. | Two coffees, please.
Server | Bien sûr. Cinq euros. | Of course. Five euros.
You | Voilà. Merci! | Here you go. Thank you!
\`\`\`

Notice the server says "**cinq** euros" — the **q** is pronounced before a vowel, but silent before "francs" or some other words. You're not expected to know the rules; just listen.

## Practice — translate

\`\`\`french-sentence
prompt: Three coffees, please.
answer: Trois cafés, s'il vous plaît.
distractors: deux | merci | bonjour
hint: "Three" = "trois", "coffees" = "cafés"
\`\`\`

\`\`\`french-sentence
prompt: Twenty-one euros.
answer: Vingt et un euros.
distractors: vingt-un | et | trente
hint: For "21" use "vingt et un" — don't hyphenate "et"
\`\`\`

## Match the number

\`\`\`french-match
title: Numbers you should know cold
sept | seven
treize | thirteen
vingt | twenty
quarante | forty
soixante | sixty
\`\`\`

## What you can do now

- Count from 0 to 69 in French
- Say "I would like 2 [thing]" → **Deux [thing], s'il vous plaît.**
- Understand a price like "vingt-trois euros"

Next: **how to greet, introduce, and ask basic questions** — putting your hello and your numbers together into actual conversations.
`;

export const FR_L3 = `# Asking questions like a local

You can say hello and count. Time to **start conversations** — asking how someone is, where they're from, and what they're up to. Three small question words unlock most of daily French.

## The three you need first

\`\`\`french-vocab
Comment? | How? | koh-mahn
Où? | Where? | oo
Qu'est-ce que? | What? | kess-kuh
Pourquoi? | Why? | poor-kwah
Quand? | When? | kahn
Qui? | Who? | kee
\`\`\`

## "How are you?"

\`\`\`french-vocab
Comment ça va? | How are you? (casual) | koh-mahn sah vah
Comment allez-vous? | How are you? (formal) | koh-mahn tah-lay voo
Ça va bien, merci. | I'm fine, thanks. | sah vah byan mehr-see
Ça va. | I'm OK. | sah vah
Pas mal. | Not bad. | pah mahl
Et toi? | And you? (casual) | ay twah
Et vous? | And you? (formal) | ay voo
\`\`\`

**Important:** French has two "you" — **tu** (casual, one friend) and **vous** (formal OR plural). Don't accidentally **tu** a stranger or an older person. When in doubt, **vous**.

## Where are you from?

\`\`\`french-vocab
Vous êtes d'où? | Where are you from? (formal) | voo zet doo
Je suis de Paris. | I'm from Paris. | zhuh swee duh pah-ree
Je suis américain. | I'm American (male). | zhuh swee zah-may-ree-kan
Je suis américaine. | I'm American (female). | zhuh swee zah-may-ree-ken
Je suis anglais. | I'm English (male). | zhuh swee zahn-gleh
Je suis anglaise. | I'm English (female). | zhuh swee zahn-gleh-z
\`\`\`

> **Spot the pattern:** Female versions often add an **-e** at the end, and the previously-silent consonant before it becomes pronounced. "Anglais" (silent s) → "Anglaise" (the s now sounds like a z).

## Meeting someone — full dialogue

\`\`\`french-dialogue
title: On the train
scene: You're sitting across from a stranger. They speak first.
--
Stranger | Bonjour. Vous allez à Paris? | Hello. Are you going to Paris?
You | Oui. Et vous? | Yes. And you?
Stranger | Moi aussi. Vous êtes d'où? | Me too. Where are you from?
You | Je suis américain. Et vous? | I'm American. And you?
Stranger | Je suis de Lyon. Comment vous appelez-vous? | I'm from Lyon. What's your name?
You | Je m'appelle Alex. Enchanté! | My name is Alex. Nice to meet you!
\`\`\`

## Build the sentence

\`\`\`french-sentence
prompt: I'm from London.
answer: Je suis de Londres.
distractors: à | et | américain
hint: "I am" = "Je suis"; "from [city]" = "de [city]"
\`\`\`

\`\`\`french-sentence
prompt: How are you? (casual)
answer: Comment ça va?
distractors: vous | allez | bien
hint: Casual version uses "ça va" instead of "allez-vous"
\`\`\`

## Match

\`\`\`french-match
title: Question words
Comment? | How?
Où? | Where?
Pourquoi? | Why?
Quand? | When?
Qui? | Who?
\`\`\`

## What you can do now

- Ask how someone is, and respond
- Ask where they're from, and say where *you're* from
- Pick the right register (**tu** vs **vous**) for the person you're talking to
- Recognize the male/female adjective pattern (silent ending → spoken ending)

Next: **food and restaurants** — order anything, anywhere in France.
`;

export const FR_L4 = `# At the restaurant — order anything

You walk into a Parisian bistro. The waiter approaches. *Bonjour, messieurs-dames.* You panic. **Not anymore.** After this lesson you'll be ordering wine, asking for the bill, and complimenting the food like you've done it a hundred times.

## Restaurant vocabulary

\`\`\`french-vocab
le menu | the menu | luh muh-noo
la carte | the menu (food list) | lah kart
l'entrée | starter | lahn-tray
le plat | main course | luh plah
le dessert | dessert | luh deh-sehr
l'eau | water | loh
le vin | wine | luh van
le pain | bread | luh pan
le café | coffee | luh kah-fay
l'addition | the bill | lah-dee-syohn
\`\`\`

> **Tiny shock:** in France, **menu** often means the *fixed-price meal*, while **carte** means the *full list of dishes*. Ask for "**la carte**" if you want to choose.

## "Le" and "La" — French has gendered nouns

Every French noun is either **masculine** (uses **le**) or **feminine** (uses **la**). There's no logic — **le pain** (bread, masculine), **la table** (table, feminine), **le café** (masculine), **la baguette** (feminine).

Before vowels and silent h, both shrink to **l'**: **l'eau**, **l'addition**.

\`\`\`french-grammar
title: The three articles
note: You'll learn to feel masculine/feminine over time. For now: memorize the article with each new noun.
headers: Masculine | Feminine | Before vowel/h
--
"the" | le pain | la table | l'eau
"a/an" | un café | une baguette | un ami
"some" | du pain | de la salade | de l'eau
\`\`\`

## "I would like" — your magic phrase

For ordering anything politely, use:

> **Je voudrais...** *(zhuh voo-dray)* — "I would like..."

Combine it with **un**, **une**, or **du / de la** depending on what you want:

> Je voudrais **un** café. *(a coffee)*
> Je voudrais **une** baguette. *(a baguette — feminine)*
> Je voudrais **du** pain. *(some bread — masculine)*
> Je voudrais **de la** salade. *(some salad — feminine)*
> Je voudrais **de l'**eau. *(some water — vowel start)*

The waiter will think you're charming. Mission accomplished.

## A complete meal

\`\`\`french-dialogue
title: Lunch at the bistro
scene: The waiter has brought you the menu.
--
Waiter | Bonjour. Vous avez choisi? | Hello. Have you chosen?
You | Oui. Je voudrais la salade, s'il vous plaît. | Yes. I'd like the salad, please.
Waiter | Et comme plat? | And for the main?
You | Le poulet, s'il vous plaît. | The chicken, please.
Waiter | Et à boire? | And to drink?
You | Un verre de vin rouge et de l'eau. | A glass of red wine and some water.
Waiter | Très bien. Merci. | Very good. Thank you.
\`\`\`

## Asking for the bill

When you're done:

> **L'addition, s'il vous plaît.** *(lah-dee-syohn seel voo pleh)*

That's it. You won't be charged a tip — it's included by law in France. Round up to the nearest euro if you want to be generous.

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
le menu | the menu
l'addition | the bill
\`\`\`

## What you can do now

- Read a French menu and recognize the sections
- Order a starter, a main, a drink — politely
- Pick **le** vs **la** vs **l'** for common items
- Ask for the bill

Next: **getting around** — directions, transport, "where is the metro station?"
`;

export const FR_L5 = `# Getting around — directions and transport

You're in Paris, late for dinner, and your phone died. You need to ask a stranger where the metro is. **After this lesson, you can.**

## Vocabulary — places and transport

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

## "Where is...?"

The magic phrase:

> **Où est...?** *(oo eh)* — "Where is...?"

Combine with anywhere you need to go:

> **Où est le métro?** — Where's the metro?
> **Où est la gare?** — Where's the train station?
> **Où sont les toilettes?** — Where's the bathroom? (plural — note **sont** not **est**)

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

> **Don't mix up:** "à droite" = on the right, but "tout droit" = straight ahead. They sound similar — listen carefully!

## Lost in Paris

\`\`\`french-dialogue
title: Asking for directions
scene: You stop a friendly-looking person on the sidewalk.
--
You | Pardon, où est le métro, s'il vous plaît? | Excuse me, where is the metro, please?
Local | Tout droit, puis à gauche. C'est à deux minutes. | Straight ahead, then on the left. It's two minutes away.
You | Merci beaucoup! | Thank you very much!
Local | Je vous en prie. | You're welcome.
\`\`\`

> "**Je vous en prie**" is the polite "you're welcome." Casual version: **"De rien"** (it's nothing).

## Numbers in directions

Combine your numbers from Lesson 2 with directions:

> **À cinq minutes.** — Five minutes away.
> **La troisième rue à droite.** — The third street on the right.

You don't need to memorize "troisième" yet — just recognize that **-ième** added to a number means "Nth" (third, fourth, etc.).

## Practice

\`\`\`french-sentence
prompt: Where is the bathroom, please?
answer: Où sont les toilettes, s'il vous plaît?
distractors: est | la | un
hint: "Toilettes" is plural, so use "sont" not "est"
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

- Ask where any place is — metro, hotel, bathroom, anything
- Understand the directions someone gives you
- Combine numbers with directions ("five minutes away")
- Sound polite when you stop someone on the street

Next: **time, days, and making plans** — the last big building block.
`;

export const FR_L6 = `# Time, days, and making plans

The final piece. After this lesson, you'll **tell time, name the days of the week, talk about today/tomorrow/yesterday, and arrange to meet someone.**

## The days of the week

\`\`\`french-vocab
lundi | Monday | luhn-dee
mardi | Tuesday | mar-dee
mercredi | Wednesday | mehr-kruh-dee
jeudi | Thursday | zhuh-dee
vendredi | Friday | vahn-druh-dee
samedi | Saturday | sahm-dee
dimanche | Sunday | dee-mahnsh
\`\`\`

> **Heads up:** French days of the week are **not capitalized**. "Lundi" only gets a capital letter at the start of a sentence.

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

**The pattern:** **Il est** + [number] + **heures**. For half past: add **et demie**. For quarter past: **et quart**. For quarter to: **moins le quart**.

> Most of France uses the **24-hour clock** for anything written down — "15h30" means 3:30 PM. In speech, people use 12-hour with context.

## Making a plan

\`\`\`french-dialogue
title: Arranging dinner with a friend
scene: A casual conversation with a friend.
--
You | Tu es libre ce soir? | Are you free tonight?
Friend | Oui, pourquoi? | Yes, why?
You | On va au restaurant? À huit heures? | Shall we go to a restaurant? At eight?
Friend | Bonne idée! Où ça? | Good idea! Where?
You | Le bistro près de la gare. | The bistro near the train station.
Friend | Parfait. À ce soir! | Perfect. See you tonight!
\`\`\`

> "**On va au restaurant?**" literally means "One goes to the restaurant?" — in French, "on" is the everyday way to say "we" in casual speech.

## "See you..." farewells

\`\`\`french-vocab
À demain | See you tomorrow | ah duh-man
À ce soir | See you tonight | ah suh swahr
À bientôt | See you soon | ah byan-toh
À la prochaine | Until next time | ah lah pro-shen
À tout à l'heure | See you later (today) | ah toot ah luhr
\`\`\`

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
- Tell time (with the 12-hour clock)
- Talk about today, tomorrow, this weekend
- Arrange to meet a friend and say goodbye properly

## You're A1!

If you finished all six lessons, you've covered the **A1 (beginner) syllabus** of European French. You can:

- Greet people and introduce yourself
- Count and handle money
- Ask basic questions
- Order food and ask for the bill
- Ask for directions
- Tell time and make plans

That's enough to **survive a week in Paris on your own**. From here, build vocabulary by topic (work, family, weather, hobbies), and start watching short French videos with subtitles. Bonne continuation! 🇫🇷
`;
