/* eslint-disable no-irregular-whitespace */
/**
 * French Advanced — 10 lessons taking learners from A2 to B2, the level
 * required for Canadian Permanent Residence (TEF Canada / TCF Canada,
 * NCLC 7 = CEFR B2).
 *
 * Sequel to French Fundamentals. Assumes A1: greetings, numbers, basic
 * present-tense verbs, articles, asking simple questions.
 *
 * Pedagogical approach:
 *  - Every grammar concept has a concrete exam-relevant motivation
 *  - Heavy use of the existing interactive components (french-vocab,
 *    french-sentence, french-dialogue, french-match, french-grammar)
 *  - Verb tables embedded for every major tense
 *  - TEF/TCF-specific lessons (4 of the 10) on exam structure and strategy
 */

export const FA_L1 = `# Past tenses — passé composé vs imparfait

The single most-tested grammar point on the TEF/TCF exam, and the one English speakers struggle with most. **Both translate to English "I did" or "I was doing"** — but in French they mean fundamentally different things. Master this and you've crossed the biggest A2 → B1 hurdle.

## The two tenses, side by side

\`\`\`french-grammar
title: Past tenses — quick reference
note: PC = passé composé (completed action). IMP = imparfait (background, habit, description).
headers: passé composé | imparfait
--
J'ai mangé | je mangeais
Tu as fini | tu finissais
Il/elle a vendu | il/elle vendait
Nous avons parlé | nous parlions
Vous avez choisi | vous choisissiez
Ils/elles ont attendu | ils/elles attendaient
\`\`\`

## When to use which — the four cases

### 1. **Passé composé** for a specific, completed action
> **J'ai visité Montréal en 2023.** — *I visited Montreal in 2023.*

A bounded event with a start and end. Often paired with time markers: \`hier\`, \`en 2023\`, \`pendant deux semaines\`.

### 2. **Imparfait** for a habit or repeated action
> **Quand j'étais petit, je jouais au foot tous les jours.** — *When I was little, I used to play soccer every day.*

The English "used to" or "would (often)" pattern. Time markers: \`souvent\`, \`toujours\`, \`d'habitude\`, \`quand j'étais...\`.

### 3. **Imparfait** for description (background) + **passé composé** for the event
> **Il pleuvait quand je suis sorti.** — *It was raining when I went out.*

This is the classic combo: imparfait sets the scene; passé composé is the action that happens in that scene.

### 4. **Imparfait** for ongoing state
> **À l'époque, j'habitais à Paris.** — *At the time, I lived in Paris.*

No bounded endpoint. Could have been a year, could have been ten — irrelevant.

\`\`\`french-vocab
hier | yesterday | yair
avant-hier | the day before yesterday | ah-vahn-tyair
la semaine dernière | last week | lah suh-men dair-nyair
le mois dernier | last month | luh mwah dair-nyay
l'année dernière | last year | lah-nay dair-nyair
il y a (deux ans) | (two years) ago | eel yah duh zahn
quand j'étais... | when I was... | kahn zhay-teh
d'habitude | usually | dah-bee-tood
souvent | often | soo-vahn
\`\`\`

## The killer practice — describing past events

\`\`\`french-dialogue
title: Talking about your weekend
scene: Two colleagues catching up Monday morning.
--
Marie | Salut! Tu as passé un bon weekend? | Hi! Did you have a good weekend?
You | Oui, très bon! Hier j'ai visité un musée. Il faisait beau. | Yes, very good! Yesterday I visited a museum. The weather was nice.
Marie | Quel musée? | Which museum?
You | Le musée des beaux-arts. Pendant que je regardais une exposition, j'ai rencontré un vieil ami. | The fine arts museum. While I was looking at an exhibition, I ran into an old friend.
Marie | Quelle coïncidence! | What a coincidence!
\`\`\`

Notice the dance: \`j'ai visité\` (one-shot action), \`il faisait beau\` (background), \`pendant que je regardais\` (ongoing) + \`j'ai rencontré\` (the event interrupting the ongoing).

## The plus-que-parfait — "had done"

For an action that happened **before another past action**:

> **Quand je suis arrivé, le train était déjà parti.** — *When I arrived, the train had already left.*

Formed: imparfait of \`avoir\` or \`être\` + past participle.

\`\`\`french-grammar
title: Plus-que-parfait — "had + done"
note: Stack two past tenses: an earlier past explaining what was true before the main past event.
headers: avoir verb | être verb
--
J'avais mangé | j'étais parti(e)
Tu avais fini | tu étais sorti(e)
Il avait vu | il était arrivé
Nous avions su | nous étions venu(e)s
Vous aviez voulu | vous étiez monté(e)(s)
Ils avaient pris | ils étaient devenu(e)s
\`\`\`

## Practice — translate

\`\`\`french-sentence
prompt: I was reading when my friend called me.
answer: Je lisais quand mon ami m'a appelé.
distractors: lisais | a lu | appelais
hint: Reading was the ongoing background (imparfait); the call was the interrupting event (passé composé).
\`\`\`

\`\`\`french-sentence
prompt: Last summer, we went to Quebec.
answer: L'été dernier, nous sommes allés au Québec.
distractors: allions | sommes parties | au
hint: "Allions" is imparfait (habit); for a specific trip, use passé composé with être for "aller". Note: "au" because Québec is masculine (le Québec).
\`\`\`

## A common exam trap

\`\`\`french-match
title: Match each sentence to the right tense
J'ai visité Paris en 2024 | passé composé (specific completed)
Je visitais Paris chaque été | imparfait (repeated/habit)
Quand j'étais petit, j'aimais le foot | imparfait (state in past)
Soudain, le téléphone a sonné | passé composé (sudden event)
Il faisait froid hier matin | imparfait (description)
\`\`\`

## What you can do now

- Pick passé composé vs imparfait based on the four-case rule
- Combine them to tell stories (imparfait background + passé composé event)
- Use plus-que-parfait for "had done" — earlier past stacked on later past
- Spot the time markers that signal each tense
- Pass the TEF/TCF questions that test past-tense distinction (and there are MANY)

Next: **Future tenses** — futur proche, futur simple, futur antérieur. The patterns for talking about what hasn't happened yet.
`;

export const FA_L2 = `# Future tenses — futur proche, futur simple, futur antérieur

French has three ways to talk about the future, and they're not interchangeable. Pick wrong on the TEF exam and the grader notices. This lesson covers all three with the contexts that matter.

## Futur proche — "I'm going to do X"

The everyday future. Used for plans, intentions, and things happening soon.

> **Je vais manger dans cinq minutes.** — *I'm going to eat in five minutes.*

Formed: \`aller\` (present) + infinitive.

\`\`\`french-grammar
title: Futur proche — aller + infinitive
note: The everyday "going to" future. Use for plans, near-term events, expressed intentions.
headers: aller | + infinitive
--
je vais | manger
tu vas | partir
il/elle va | finir
nous allons | étudier
vous allez | choisir
ils/elles vont | attendre
\`\`\`

## Futur simple — "I will do X"

The formal, distant future. Used in writing, predictions, formal speech, conditional consequences.

> **L'année prochaine, j'irai au Canada.** — *Next year, I will go to Canada.*

Formed: infinitive + endings. (Most verbs keep the full infinitive; some have irregular stems.)

\`\`\`french-grammar
title: Futur simple — regular endings
note: Most verbs: take the infinitive (drop -re for -re verbs), add these endings.
headers: -er verbs (parler) | -ir verbs (finir) | -re verbs (vendre)
--
je parlerai | je finirai | je vendrai
tu parleras | tu finiras | tu vendras
il/elle parlera | il/elle finira | il/elle vendra
nous parlerons | nous finirons | nous vendrons
vous parlerez | vous finirez | vous vendrez
ils/elles parleront | ils/elles finiront | ils/elles vendront
\`\`\`

## The irregular stems you MUST know

\`\`\`french-vocab
être → ser- | I will be → je serai | zhuh suh-ray
avoir → aur- | I will have → j'aurai | zhoh-ray
aller → ir- | I will go → j'irai | zhee-ray
faire → fer- | I will do → je ferai | zhuh fuh-ray
voir → verr- | I will see → je verrai | zhuh vair-ray
pouvoir → pourr- | I will be able → je pourrai | zhuh poor-ray
vouloir → voudr- | I will want → je voudrai | zhuh voo-dray
savoir → saur- | I will know → je saurai | zhuh soh-ray
venir → viendr- | I will come → je viendrai | zhuh vyan-dray
\`\`\`

These nine cover ~80% of the irregular futures you'll need. Memorize them cold.

## Futur antérieur — "I will have done X"

For an action that **will be completed before another future action**.

> **Quand tu arriveras, j'aurai déjà fini.** — *When you arrive, I will have already finished.*

Formed: futur simple of \`avoir\` or \`être\` + past participle.

\`\`\`french-grammar
title: Futur antérieur — "will have done"
note: Two future events. The futur antérieur happens FIRST, the futur simple happens SECOND.
headers: avoir verb | être verb
--
J'aurai fini | je serai parti(e)
Tu auras vu | tu seras arrivé(e)
Il aura mangé | il sera venu
Nous aurons su | nous serons sorti(e)s
Vous aurez compris | vous serez monté(e)(s)
Ils auront décidé | ils seront devenu(e)s
\`\`\`

> **Exam tip:** "quand," "dès que," "lorsque," "aussitôt que," and "une fois que" all trigger the futur antérieur for the earlier action.

## Picking the right tense — the decision flow

\`\`\`
Is the event happening soon (today, this week, planned)?
  YES → futur proche
  NO → Is it formal writing, prediction, or distant future?
    YES → futur simple
    Will it COMPLETE before another future event?
      YES → futur antérieur
\`\`\`

In conversational French, **futur proche** is far more common. In writing and the TEF exam (especially the writing section), **futur simple** dominates. Use both confidently.

## Si clauses — the three patterns

The conditional "if" sentences. **Memorize these three patterns**; they appear on every TEF.

| Pattern | If clause | Result clause | Meaning |
|---------|-----------|---------------|---------|
| **Real future** | si + présent | présent OR futur | If X happens, Y will happen |
| **Hypothetical present** | si + imparfait | conditionnel présent | If X were true, Y would happen |
| **Hypothetical past** | si + plus-que-parfait | conditionnel passé | If X had happened, Y would have happened |

\`\`\`french-vocab
Si je peux, j'irai. | If I can, I'll go. | (real future)
Si j'avais le temps, j'irais. | If I had time, I would go. | (hypothetical present)
Si j'avais su, je serais venu. | If I had known, I would have come. | (hypothetical past)
\`\`\`

We cover the conditional in detail in Lesson 4.

## Practice

\`\`\`french-dialogue
title: Planning a trip
scene: A friend asks about your upcoming vacation.
--
Friend | Tu pars en vacances bientôt? | Are you leaving on vacation soon?
You | Oui, je vais partir samedi. | Yes, I'm leaving Saturday.
Friend | Tu iras où? | Where will you go?
You | J'irai à Montréal. Je visiterai le Vieux-Port. | I'll go to Montreal. I'll visit the Old Port.
Friend | Tu seras parti combien de temps? | How long will you be gone?
You | Deux semaines. Quand je reviendrai, j'aurai vu toutes les attractions! | Two weeks. When I come back, I'll have seen all the attractions!
\`\`\`

Notice the mix: futur proche for the immediate ("je vais partir"), futur simple for the trip itself ("j'irai," "je visiterai"), futur antérieur for the completed-before-return ("j'aurai vu").

\`\`\`french-sentence
prompt: Tomorrow I will work all day.
answer: Demain je travaillerai toute la journée.
distractors: vais travailler | demain matin | la nuit
hint: "Demain" + a full-day activity → futur simple. "Toute la journée" = "all day".
\`\`\`

\`\`\`french-sentence
prompt: When I have finished, I will call you.
answer: Quand j'aurai fini, je t'appellerai.
distractors: finirai | finis | te appellerai
hint: "When + first event" with both in future → futur antérieur for the earlier event (j'aurai fini), futur simple for the later (je t'appellerai).
\`\`\`

## What you can do now

- Use futur proche for plans and near events
- Use futur simple for distant future, predictions, and writing
- Use futur antérieur after "quand," "dès que," "lorsque" for "will have done"
- Conjugate the nine irregular futur simple stems from memory
- Recognize the three si-clause patterns (only the first uses future; the others use conditional)

Next: **Pronouns** — the order rule (\`me/te/se/nous/vous → le/la/les → lui/leur → y → en\`) that strikes terror into French learners.
`;

export const FA_L3 = `# Pronouns — le, la, lui, en, y, and the killer order rule

French pronouns let you say sentences like "I gave it to her" as four little syllables: **Je le lui ai donné**. They also have a **strict ordering rule** that English speakers find baffling. Master this lesson and your French sounds dramatically more fluent.

## The six pronoun categories

| Type | Pronouns | What they replace |
|------|----------|-------------------|
| **Direct object** | me, te, se, le, la, nous, vous, les | The thing receiving the action |
| **Indirect object** | me, te, se, lui, nous, vous, leur | The person it's done TO/FOR |
| **Reflexive** | me, te, se, nous, vous, se | Same person as subject |
| **\`y\`** | y | Replaces \`à\` + thing/place |
| **\`en\`** | en | Replaces \`de\` + thing, or a quantity |
| **Disjunctive** | moi, toi, lui, elle, nous, vous, eux, elles | After prepositions, for emphasis |

## Direct vs indirect — the test

If the verb takes \`à\` before its object, the pronoun is **indirect** (lui, leur).
If the verb takes the object directly, the pronoun is **direct** (le, la, les).

\`\`\`
parler à quelqu'un  → indirect  → "Je lui parle." (I'm talking to him/her)
voir quelqu'un      → direct    → "Je le vois." (I see him)
donner X à quelqu'un → X is direct, person is indirect
                                 → "Je le lui donne." (I give it to him)
\`\`\`

\`\`\`french-grammar
title: Direct and indirect object pronouns
note: 1st/2nd persons (me, te, nous, vous) are the same for direct and indirect. 3rd person differs!
headers: Direct | Indirect
--
me (me) | me (to me)
te (you) | te (to you)
le / la (him / her / it) | lui (to him/her)
nous (us) | nous (to us)
vous (you) | vous (to you)
les (them) | leur (to them)
\`\`\`

## The pronoun \`y\` — replaces "à + place" or "à + thing"

> **Tu vas à Paris?** — *Are you going to Paris?*
> **Oui, j'y vais.** — *Yes, I'm going there.*

> **Tu penses à ton examen?** — *Are you thinking about your exam?*
> **Oui, j'y pense.** — *Yes, I'm thinking about it.*

> **Don't use "y" for people** — for people, use "à lui," "à elle," etc.

## The pronoun \`en\` — replaces "de + thing" or quantity

> **Tu veux du café?** — *Do you want some coffee?*
> **Oui, j'en veux.** — *Yes, I want some.*

> **Combien de livres as-tu?** — *How many books do you have?*
> **J'en ai trois.** — *I have three.* (note: \`en\` is required, plus the number!)

> **Tu reviens de Paris?** — *Are you coming back from Paris?*
> **Oui, j'en reviens.** — *Yes, I'm coming back from there.*

## The order rule

When you have multiple pronouns in one sentence, they go in this fixed order, before the verb:

\`\`\`
me                   le                lui                 y                en
te        before     la       before   leur     before              before
se                   les
nous
vous
\`\`\`

Mnemonic: **MTL** (me, te, nous, vous, se) → **LLL** (le, la, les) → **LL** (lui, leur) → **Y** → **EN**

\`\`\`french-vocab
Je le lui donne. | I give it to him/her. | (LLL + LL)
Tu m'en parles. | You're talking to me about it. | (MTL + EN)
Il nous les envoie. | He sends them to us. | (MTL + LLL)
Nous y allons. | We're going there. | (Y alone)
Elle leur en achète. | She buys some for them. | (LL + EN)
\`\`\`

## The exception — affirmative imperatives

In affirmative commands, pronouns come **AFTER** the verb, with a hyphen, AND the order changes for some:

> **Donne-le-moi!** — *Give it to me!* (direct before indirect)
> **Donne-m'en!** — *Give me some!* (m' = elision before en)

Not: \`*me donne-le\`. The order flips for affirmative imperatives only. Negative imperatives use the normal order:

> **Ne me le donne pas!** — *Don't give it to me!*

\`\`\`french-match
title: Pronoun gymnastics — match
Je le vois. | I see him.
Je lui parle. | I'm talking to him.
J'y vais. | I'm going there.
J'en veux. | I want some.
Je le lui donne. | I give it to him.
Donne-le-moi! | Give it to me!
\`\`\`

## Position of pronouns in compound tenses

Pronouns sit **between the subject and the auxiliary** (avoir/être), not before the past participle.

> **Je l'ai vu.** — *I saw him.* (not *J'ai le vu*)
> **Nous y sommes allés.** — *We went there.* (not *Nous sommes y allés*)

## Practice — describe relationships

\`\`\`french-dialogue
title: Office discussion
scene: Talking about who did what.
--
Marie | Tu as parlé à Sophie? | Did you talk to Sophie?
You | Oui, je lui ai parlé hier. | Yes, I talked to her yesterday.
Marie | Tu lui as donné le rapport? | Did you give her the report?
You | Oui, je le lui ai donné. | Yes, I gave it to her.
Marie | Parfait. Et le client, tu en as des nouvelles? | Perfect. And the client, have you got news about them?
You | Oui, j'en aurai demain. | Yes, I'll have some tomorrow.
\`\`\`

\`\`\`french-sentence
prompt: I gave it to them.
answer: Je le leur ai donné.
distractors: ai donné | l' | les
hint: "It" = "le" (direct), "to them" = "leur" (indirect). Order: le before leur (LLL → LL).
\`\`\`

\`\`\`french-sentence
prompt: I'm thinking about it.
answer: J'y pense.
distractors: en | le | à
hint: "Penser à quelque chose" → replace "à + thing" with "y". "Penser à quelqu'un" would use "à elle/lui".
\`\`\`

## A TEF-style gotcha

\`\`\`french-match
title: Direct or indirect? Match the verb to the pronoun type
téléphoner à quelqu'un | indirect (lui)
voir quelqu'un | direct (le)
parler à quelqu'un | indirect (lui)
attendre quelqu'un | direct (le)
demander à quelqu'un | indirect (lui)
écouter quelqu'un | direct (l')
\`\`\`

A trap on the exam: verbs that take \`à\` (téléphoner à, parler à, demander à) feel like they should be direct because the English equivalent has no preposition ("phone someone"). They're indirect in French. Memorize them.

## What you can do now

- Pick direct (le, la, les) vs indirect (lui, leur) by testing for \`à\`
- Use \`y\` for places and "à + things"; \`en\` for quantities and "de + things"
- Apply the order rule: MTL → LLL → LL → Y → EN
- Handle the imperative exception (affirmative reverses order; negative keeps it)
- Recognize the verbs that take \`à\` (téléphoner, parler, demander, etc.) and use lui/leur

Next: **Conditional mood** — "would" / "could" / "should." Plus the three si-clause patterns mastered cold.
`;

export const FA_L4 = `# Conditional mood — wishes, possibilities, "if I were..."

The conditional ("would do") is everywhere in B1/B2 French. Polite requests, hypothetical situations, the famous **si** clauses. This lesson gives you the conjugations + the three si patterns that come up on every TEF exam.

## Conditionnel présent — "would do"

Formation: same stem as **futur simple** + endings of **imparfait**.

\`\`\`french-grammar
title: Conditionnel présent — "would" + verb
note: Stem = futur simple stem. Endings = imparfait endings. Easy combo to remember!
headers: -er (parler) | -ir (finir) | irregular (être)
--
je parlerais | je finirais | je serais
tu parlerais | tu finirais | tu serais
il/elle parlerait | il/elle finirait | il/elle serait
nous parlerions | nous finirions | nous serions
vous parleriez | vous finiriez | vous seriez
ils/elles parleraient | ils/elles finiraient | ils/elles seraient
\`\`\`

The irregular stems from Lesson 2 (ser-, aur-, ir-, fer-, verr-, pourr-, voudr-, saur-, viendr-) carry over to the conditional too.

## Three main uses

### 1. Polite requests — the daily use
> **Je voudrais un café, s'il vous plaît.** — *I would like a coffee, please.* (much politer than "je veux")
> **Pourriez-vous m'aider?** — *Could you help me?*
> **Auriez-vous une question?** — *Would you have a question?*

In the TEF speaking section, using conditional automatically bumps your formality score.

### 2. Hypothetical statements
> **À ta place, j'irais au Canada.** — *In your place, I would go to Canada.*
> **Sans toi, je serais perdu.** — *Without you, I would be lost.*

### 3. Reported speech (in the past)
When you report what someone SAID about a future event:
> **Direct:** Marie a dit: "Je viendrai demain." — *Marie said: "I will come tomorrow."*
> **Reported:** Marie a dit qu'elle viendrait demain. — *Marie said she would come tomorrow.*

Futur simple → conditionnel présent when reported in the past. Same shift in English ("will" → "would").

## Conditionnel passé — "would have done"

For the past hypothetical: things that could have happened but didn't.

Formation: conditionnel présent of \`avoir\` or \`être\` + past participle.

\`\`\`french-grammar
title: Conditionnel passé — "would have done"
note: Used for things that could have happened differently. Stack onto plus-que-parfait in si clauses.
headers: avoir verb | être verb
--
J'aurais fait | je serais venu(e)
Tu aurais dit | tu serais parti(e)
Il aurait pu | il serait arrivé
Nous aurions su | nous serions allé(e)s
Vous auriez voulu | vous seriez sorti(e)(s)
Ils auraient cru | ils seraient resté(e)s
\`\`\`

> **J'aurais voulu être un artiste.** — *I would have liked to be an artist.* (Charles Aznavour song — also a perfect example sentence.)

## The three si clauses — drilled cold

THE most-tested grammar pattern on TEF. Memorize as three equations:

\`\`\`
Si + PRÉSENT,          → FUTUR or PRÉSENT       (real possibility)
Si + IMPARFAIT,        → CONDITIONNEL PRÉSENT    (hypothetical present)
Si + PLUS-QUE-PARFAIT, → CONDITIONNEL PASSÉ      (hypothetical past)
\`\`\`

\`\`\`french-grammar
title: The three si clauses
note: Match the tense in the IF clause with the tense in the result clause. There's no flexibility — these pairings are fixed.
headers: Si clause | Result clause | Example
--
Si + présent | + futur / présent | Si tu viens, on mange.
Si + imparfait | + conditionnel présent | Si j'étais riche, j'achèterais un château.
Si + plus-que-parfait | + conditionnel passé | Si j'avais su, je ne serais pas venu.
\`\`\`

**Critical:** the \`si\` clause NEVER uses \`futur\` or \`conditionnel\`. You'd never say \`*si je serais\`. It's a grammatical error that immediately marks you as a beginner.

## A TEF-typical scenario

\`\`\`french-dialogue
title: Discussing hypotheticals
scene: A career conversation with a friend.
--
Friend | Qu'est-ce que tu ferais si tu gagnais à la loterie? | What would you do if you won the lottery?
You | Si je gagnais, j'arrêterais de travailler et je voyagerais. | If I won, I would stop working and I would travel.
Friend | Où irais-tu en premier? | Where would you go first?
You | Au Japon. J'y serais déjà allé si j'avais eu le temps. | To Japan. I would have already gone if I had had the time.
Friend | Tu pourrais y aller cette année! | You could go there this year!
\`\`\`

Three si-clauses used naturally: hypothetical present ("si je gagnais... j'arrêterais"), past hypothetical ("j'y serais allé si j'avais eu"). Plus polite conditional ("tu pourrais").

\`\`\`french-sentence
prompt: If I were rich, I would buy a house in Quebec.
answer: Si j'étais riche, j'achèterais une maison au Québec.
distractors: serai | serais | achète
hint: Hypothetical present: si + imparfait ("si j'étais"), then conditionnel présent ("j'achèterais").
\`\`\`

\`\`\`french-sentence
prompt: I would have helped you if you had asked.
answer: Je t'aurais aidé si tu avais demandé.
distractors: aiderais | t'aiderais | demandais
hint: Hypothetical past: result = conditionnel passé ("je t'aurais aidé"), si clause = plus-que-parfait ("si tu avais demandé").
\`\`\`

## Polite request drill

\`\`\`french-match
title: Match the plain to the polite
Je veux un café. | Je voudrais un café.
Tu peux m'aider? | Pourrais-tu m'aider?
Vous avez le temps? | Auriez-vous le temps?
Je sais que c'est compliqué. | Je saurais que c'est compliqué.
Donnez-moi une minute. | Pourriez-vous me donner une minute?
\`\`\`

In Canadian workplace French (relevant for PR scenarios), the conditional is the **default** for any request. "Je voudrais" is almost obligatory over "je veux."

## What you can do now

- Conjugate conditionnel présent for regular and irregular verbs
- Use conditional for polite requests (key for TEF speaking score)
- Distinguish hypothetical present ("would do") from hypothetical past ("would have done")
- Apply the three si-clause patterns cold — never \`si + futur\` or \`si + conditionnel\`
- Use conditional for reported speech of future events

Next: **The subjunctive** — French's grammatical mood for doubt, wishes, necessity. The B1/B2 dividing line.
`;

export const FA_L5 = `# The subjunctive — doubt, necessity, emotion

The **subjonctif** (subjunctive) terrifies French learners. Good news: most native speakers use only the **present subjunctive**, and the **triggers** that demand it are a finite list. This lesson covers what you need for B2 / TEF.

## What is the subjunctive?

Most French sentences use the **indicative** mood — stating facts. The subjunctive is for **non-facts**: things that might not happen, wishes, doubts, emotions, necessities.

> **Indicative:** Il vient. — *He's coming.* (fact)
> **Subjunctive:** Je veux qu'il vienne. — *I want him to come.* (wish)

The subjunctive almost always follows **"que"** + a triggering expression.

## The 20-verb subjunctive conjugation toolkit

For most regular verbs, take the **ils form of present indicative**, drop **-ent**, add subjunctive endings.

\`\`\`french-grammar
title: Present subjunctive — regular endings
note: Stem = ils-form of present minus -ent. Endings: e, es, e, ions, iez, ent.
headers: parler (ils parlent → parl-) | finir (ils finissent → finiss-) | vendre (ils vendent → vend-)
--
que je parle | que je finisse | que je vende
que tu parles | que tu finisses | que tu vendes
qu'il/elle parle | qu'il/elle finisse | qu'il/elle vende
que nous parlions | que nous finissions | que nous vendions
que vous parliez | que vous finissiez | que vous vendiez
qu'ils/elles parlent | qu'ils/elles finissent | qu'ils/elles vendent
\`\`\`

## The irregular subjunctives you MUST know

\`\`\`french-grammar
title: The 9 essential irregular subjunctives
note: These nine verbs cover 90% of the subjunctive you'll encounter. Drill them.
headers: être | avoir | faire | aller
--
que je sois | que j'aie | que je fasse | que j'aille
que tu sois | que tu aies | que tu fasses | que tu ailles
qu'il/elle soit | qu'il/elle ait | qu'il/elle fasse | qu'il/elle aille
que nous soyons | que nous ayons | que nous fassions | que nous allions
que vous soyez | que vous ayez | que vous fassiez | que vous alliez
qu'ils/elles soient | qu'ils/elles aient | qu'ils/elles fassent | qu'ils/elles aillent
\`\`\`

Plus: **pouvoir** → que je puisse; **savoir** → que je sache; **vouloir** → que je veuille; **venir** → que je vienne; **prendre** → que je prenne.

## The trigger list

The subjunctive shows up after specific phrases. Here are the categories that cover ~95% of subjunctive use.

### Necessity
- **Il faut que...** — *It's necessary that...*
- **Il est nécessaire que...**
- **Il est important que...**
- **Il vaut mieux que...** — *It's better that...*

> **Il faut que tu viennes.** — *You have to come.*

### Wishes and orders
- **Je veux que...** — *I want that...*
- **J'aimerais que...** — *I would like that...*
- **Je préfère que...**

> **Je veux qu'elle réussisse.** — *I want her to succeed.*

### Doubt and uncertainty
- **Je doute que...** — *I doubt that...*
- **Je ne crois pas que...** — *I don't think that...*
- **Je ne pense pas que...**
- **Il est possible que...** — *It's possible that...*

> **Je doute qu'il vienne.** — *I doubt he'll come.*

### Emotion
- **Je suis content(e) que...** — *I'm happy that...*
- **J'ai peur que...** — *I'm afraid that...*
- **C'est dommage que...** — *It's a shame that...*

> **Je suis content que tu sois là.** — *I'm happy you're here.*

### Specific conjunctions
- **bien que** / **quoique** — *although*
- **pour que** / **afin que** — *so that*
- **avant que** — *before*
- **sans que** — *without*
- **à condition que** — *provided that*

> **Je travaille pour qu'elle puisse étudier.** — *I work so she can study.*

## When NOT to use the subjunctive

**Important:** \`espérer que\` (to hope) uses the **indicative**, not subjunctive (unlike many European languages):

> **J'espère qu'il vient.** — *I hope he comes.* (NOT \`vienne\`)

\`Penser que\` and \`croire que\` use indicative in the affirmative, subjunctive only when negated:

> **Je pense qu'il vient.** (indicative, affirmative)
> **Je ne pense pas qu'il vienne.** (subjunctive, negated)

## Practice

\`\`\`french-dialogue
title: Boss giving instructions
scene: Manager debriefing a project.
--
Boss | Il faut que vous finissiez ce rapport avant vendredi. | You need to finish this report before Friday.
You | Bien sûr. Je veux que ce soit parfait. | Of course. I want it to be perfect.
Boss | Bien que ce soit difficile, je suis sûr que vous y arriverez. | Although it's difficult, I'm sure you'll succeed.
You | Merci. Je vous appellerai dès que j'aurai terminé. | Thank you. I'll call you as soon as I've finished.
\`\`\`

Notice: \`il faut que vous finissiez\` (necessity → subjunctive), \`je veux que ce soit\` (wish → subjunctive), \`bien que ce soit\` (concession → subjunctive). Then \`dès que j'aurai terminé\` uses **futur antérieur** (not subjunctive) because "dès que" is temporal, not subjunctive-triggering.

\`\`\`french-sentence
prompt: I want you to come tomorrow.
answer: Je veux que tu viennes demain.
distractors: vienne | viens | venu
hint: "Je veux que" triggers subjunctive. "Venir" subjunctive: que je vienne, que tu viennes, qu'il/elle vienne...
\`\`\`

\`\`\`french-sentence
prompt: I'm happy that you're here.
answer: Je suis content que tu sois là.
distractors: es | étais | sois là.
hint: "Je suis content que" = emotion → subjunctive. "Être" subjunctive: sois, sois, soit, soyons, soyez, soient.
\`\`\`

## A B2-level discrimination drill

\`\`\`french-match
title: Subjunctive or indicative? Match the trigger
Il faut que... | subjunctive
J'espère que... | INDICATIVE (espérer keeps indicative!)
Bien que... | subjunctive
Je suis sûr que... | indicative (certainty → indicative)
Je doute que... | subjunctive
Je pense que... (affirmative) | indicative
Je ne pense pas que... | subjunctive
\`\`\`

The subjunctive distinguishes a B2 speaker from a B1 one on the TEF exam. **Drill the triggers** until they're automatic.

## What you can do now

- Conjugate present subjunctive for regular verbs + the nine essential irregulars
- Recognize the trigger list (il faut, je veux, je doute, bien que, pour que, etc.)
- Avoid the espérer-trap (espérer takes indicative)
- Switch penser/croire to subjunctive only in the negative

Next: **Formal register and business communication** — vous form, "auriez-vous," workplace French. Essential for the TEF expression écrite section.
`;

export const FA_L6 = `# Formal register — business French, polite formulations, written correspondence

The TEF exam tests **register** explicitly: writing section A is a formal letter or email; section B is a formal opinion piece. Speaking with a friend is one French; writing to a Canadian government office is another. This lesson covers the formal half.

## The three registers

| Register | Used with | Example |
|----------|-----------|---------|
| **Familier** (casual) | Friends, family, kids | Salut! Ça va? |
| **Standard / courant** | Neutral / everyday | Bonjour, comment allez-vous? |
| **Soutenu** (formal) | Business, exams, officials | Bonjour, j'espère que vous allez bien. |

The TEF expects standard-to-soutenu in writing. Casual French is for the speaking section in informal scenarios; soutenu is required for letters.

## Tu vs vous — the rule for Canada

- **Vous** = default for any stranger, any older person, any work context, any official scenario
- **Tu** = friends, family, peers your own age in casual contexts, kids

Canadian French (especially Québécois) is **slightly more "tu"-friendly** than European French, but **for the TEF exam, default to vous**. Using "tu" inappropriately costs marks.

## Polite formulations — the staple swaps

\`\`\`french-grammar
title: Plain → polite
note: Memorize these. The conditional is the everyday polite tool.
headers: Casual | Polite (soutenu)
--
Je veux un café. | Je voudrais un café, s'il vous plaît.
Tu peux m'aider? | Pourriez-vous m'aider?
T'as une minute? | Auriez-vous une minute?
Je sais que... | Je saurais que... (less common; usually "je suis informé que")
Donne-moi le rapport. | Pourriez-vous me transmettre le rapport?
Je veux savoir si... | Je souhaiterais savoir si...
\`\`\`

\`\`\`french-vocab
souhaiter | to wish / want (formal) | soo-eh-tay
remercier | to thank | ruh-mair-syay
solliciter | to request | so-lee-see-tay
prier de | to ask / beg (formal request) | pree-ay duh
veuillez | please (formal imperative of "vouloir") | vuh-yay
joindre | to attach / enclose | zhwan-druh
ci-joint / ci-dessous | enclosed / below | see-zhwan / see-duh-soo
en pièce jointe | as an attachment | ahn pyess zhwant
dans l'attente de... | awaiting... | dahn lah-tahnt duh
cordialement | sincerely (less formal) | kor-dyahl-mahn
veuillez agréer... | please accept... | vuh-yay ah-gray-ay
\`\`\`

## The structure of a formal letter / email

\`\`\`
[Your address — top right, multi-line]

[Recipient's address — left]

[Date and place — right, after Recipient]
Montréal, le 15 mai 2026

[Subject line]
Objet: Demande d'information

[Salutation — formal]
Madame, Monsieur,

[Opening paragraph — why writing]
Je me permets de vous contacter au sujet de...

[Body — develop request / argument]
Je souhaiterais...

[Closing paragraph — what you expect]
Dans l'attente de votre réponse, je vous remercie de votre attention.

[Closing formula — match the formality]
Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

[Your full name]
Signature: Alex Martin
\`\`\`

This is the **TEF Section A** format expected. Score points by hitting every section.

## The closing formula — choose the right one

This is the most-tested part of formal-letter formality. Pick by recipient:

\`\`\`french-grammar
title: French letter closings — match the formality
note: The longer / more elaborate, the more formal. Match recipient!
headers: Closing | When to use
--
Cordialement, | Standard professional email
Bien cordialement, | Slightly warmer (still pro)
Sincères salutations, | Formal letter to a known contact
Je vous prie d'agréer, Madame, mes salutations distinguées. | Letter to authority (gov office, formal request)
Veuillez agréer, Monsieur le Directeur, l'expression de mes sentiments respectueux. | Most formal — gov, official, very senior
\`\`\`

The full "Je vous prie d'agréer, [title], l'expression de mes [salutations distinguées / sentiments les meilleurs / hommages respectueux]" is **the** classic formal French ending. It feels overdone to anglophones — but it's expected. The TEF writing rubric explicitly tests this.

## A model TEF letter

\`\`\`french-dialogue
title: Letter requesting information from a Canadian language school
scene: Writing to a CEGEP about French immersion classes.
--
You | Objet : Demande d'information sur les cours de français | Subject: Request for information on French courses
You | Madame, Monsieur, | Madam, Sir,
You | Je me permets de vous contacter afin d'obtenir des renseignements sur vos cours de français langue seconde. | I'm writing to obtain information about your French as a second language courses.
You | En effet, je prépare le TEF Canada dans le cadre de ma demande de résidence permanente, et je souhaiterais améliorer mon niveau d'expression orale. | I'm preparing the TEF Canada as part of my permanent residence application, and I would like to improve my speaking level.
You | Pourriez-vous me faire parvenir le programme détaillé des cours d'avant l'été 2026, ainsi que les modalités d'inscription ? | Could you send me the detailed program of courses before summer 2026, as well as the enrollment procedures?
You | Dans l'attente de votre réponse, je vous remercie de votre attention. | Awaiting your reply, I thank you for your attention.
You | Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées. | Please accept, Madam, Sir, my distinguished greetings.
\`\`\`

This letter hits every TEF writing rubric: clear subject line, formal salutation, motivation, specific request, polite closing, formal sign-off. Practice writing variants until this structure is automatic.

## Practice — formality swap

\`\`\`french-sentence
prompt: I want to know if it's possible to take the test in May.
answer: Je souhaiterais savoir s'il est possible de passer l'examen en mai.
distractors: veux | sais | si c'est
hint: "Want to know" → "souhaiter savoir". "It is possible that" → "il est possible que". "Pass an exam" → "passer un examen".
\`\`\`

\`\`\`french-sentence
prompt: Could you please send me your reply by Friday?
answer: Pourriez-vous me faire parvenir votre réponse avant vendredi?
distractors: pouvez | envoyer | s'il vous plaît
hint: "Could you" → "pourriez-vous"; "send" formally = "faire parvenir"; "by" = "avant" for deadlines.
\`\`\`

## Common business vocabulary

\`\`\`french-vocab
le client / la cliente | the client | klee-yahn
le fournisseur | the supplier | foor-nees-er
le contrat | the contract | kon-trah
l'entretien | the meeting / interview | lahn-truh-tyan
le compte rendu | the report (of a meeting) | kont rahn-doo
la facture | the invoice | fak-toor
le devis | the quote / estimate | duh-vee
le délai | the deadline | day-lay
échéance | due date / deadline | ay-shay-ahnss
prestation | service (provided) | pres-tah-syohn
\`\`\`

## What you can do now

- Pick tu vs vous correctly for Canadian contexts (default vous in formal/professional)
- Swap casual phrasing for soutenu using conditional and "souhaiter" / "prier"
- Structure a formal letter / email to TEF standards
- Choose the right closing formula by recipient formality
- Use core business vocabulary in writing

Next: **Argumentation and connectors** — the discourse markers that turn B1 writing into B2 writing for TEF section B.
`;

export const FA_L7 = `# Argumentation — connectors and B2-level structure

TEF/TCF Section B (Expression écrite) asks you to express an opinion on a topic. Scorers grade on **structure, vocabulary, register, and grammatical complexity**. The single biggest score booster is using **B2-level connectors** — the discourse markers that signal sophisticated argumentation. This lesson covers them.

## The four argument moves

Most argumentative writing involves four moves:

1. **State your position**
2. **Give reasons / examples**
3. **Acknowledge counter-arguments**
4. **Conclude / call to action**

Each move has its signature connectors.

## Connectors — the B2 vocabulary

\`\`\`french-grammar
title: Connectors by argumentative function
note: These appear constantly in TEF scoring rubrics. Use 5-7 of them in your essay.
headers: Function | Connector | Example
--
Add information | de plus / en outre | De plus, le coût est important.
Add (formal) | par ailleurs | Par ailleurs, il faut considérer...
Concede | certes / il est vrai que | Certes, le projet est ambitieux.
But (counter) | cependant / néanmoins | Cependant, les bénéfices l'emportent.
But (informal) | mais / pourtant | Mais ce n'est pas tout.
Cause | car / parce que / puisque | Puisque vous l'avez demandé...
Cause (formal) | en raison de / étant donné que | Étant donné que la situation a changé...
Consequence | par conséquent / donc | Par conséquent, je propose...
Consequence (formal) | de ce fait / dès lors | Dès lors, il convient d'agir.
Example | par exemple / notamment | Notamment dans le cas de...
Reformulate | autrement dit / c'est-à-dire | C'est-à-dire que nous devons changer.
Sequence | tout d'abord / ensuite / enfin | Tout d'abord, ensuite, enfin...
Conclude | en conclusion / pour conclure | En conclusion, je soutiens que...
\`\`\`

## Express your opinion — useful phrases

\`\`\`french-vocab
selon moi | in my opinion | suh-lon mwah
à mon avis | in my view | ah mohn ah-vee
je pense que | I think that | zhuh pahnss kuh
je crois que | I believe that | zhuh krwah kuh
je suis convaincu(e) que | I'm convinced that | zhuh swee kon-van-koo kuh
j'estime que | I consider that (formal) | zhes-teem kuh
il me semble que | it seems to me that | eel muh sahmbl kuh
il est indéniable que | it is undeniable that | eel et an-day-nyabl kuh
on peut affirmer que | one can affirm that | on puh ah-fer-may kuh
\`\`\`

## Strong vs nuanced

A B2 essay shows the writer can hold **nuanced positions**. Avoid speaking in absolutes.

\`\`\`french-grammar
title: Absolute → nuanced
note: B2 writing avoids absolutes and shows balanced reasoning.
headers: Beginner (too absolute) | B2 (nuanced)
--
C'est très bien. | Cela présente de nombreux avantages.
Je n'aime pas ça. | Je suis réservé(e) à ce sujet.
C'est faux. | Cette affirmation me semble discutable.
Tout le monde est d'accord. | La plupart des gens semblent partager cet avis.
C'est impossible. | Cela paraît difficile à réaliser.
\`\`\`

## A model TEF Section B response

**Topic:** "Pensez-vous que le télétravail soit l'avenir du travail?"

> **Introduction.** Le télétravail s'est généralisé depuis la pandémie de 2020, et la question de savoir s'il représente l'avenir du travail divise la société. À mon avis, le télétravail constitue effectivement une évolution majeure, mais il ne remplacera pas totalement le travail au bureau.

> **Premier argument (avantages).** Tout d'abord, le télétravail offre une flexibilité considérable. De plus, il réduit le temps perdu dans les transports et permet un meilleur équilibre entre vie professionnelle et vie personnelle. Par exemple, de nombreuses études montrent que les télétravailleurs déclarent un niveau de satisfaction supérieur.

> **Concession + nuance.** Cependant, il serait naïf de ne voir que les avantages. Certes, le télétravail convient à certaines tâches, mais il limite les interactions spontanées et peut affaiblir la culture d'entreprise. Par ailleurs, tous les métiers ne s'y prêtent pas.

> **Conclusion.** En conclusion, je crois que l'avenir du travail sera **hybride** : un mélange de présentiel et de distanciel. Cette approche permettra de tirer parti des avantages des deux modèles tout en limitant leurs inconvénients respectifs.

This is roughly 200-250 words — typical TEF Section B length. Notice: 7+ different connectors, nuanced position (not pure pro/con), specific examples, conclusion that goes beyond restating the intro.

## Practice — connector identification

\`\`\`french-match
title: Connector function — match
de plus | adds information
cependant | introduces counter-argument
par conséquent | introduces consequence
notamment | gives an example
en conclusion | concludes
par ailleurs | adds (formal)
étant donné que | gives a cause (formal)
\`\`\`

## Practice — write a paragraph

\`\`\`french-sentence
prompt: Although the project is expensive, I believe it will be profitable in the long term.
answer: Bien que le projet soit coûteux, je crois qu'il sera rentable à long terme.
distractors: malgré que | est | sera rentable
hint: "Although" + verb → "Bien que" + SUBJUNCTIVE. "I believe that" → "je crois que" + indicative. "Long term" → "à long terme".
\`\`\`

\`\`\`french-sentence
prompt: Furthermore, it is undeniable that the situation has changed.
answer: De plus, il est indéniable que la situation a changé.
distractors: en plus | indéniablement | a changée
hint: "Furthermore" formally = "De plus" or "Par ailleurs"; "It is undeniable that" = "il est indéniable que" (indicative — certainty); past tense "has changed" = passé composé "a changé".
\`\`\`

## The TEF Section B scoring rubric (simplified)

Scorers look at:
1. **Adequacy** — did you address the question?
2. **Structure** — intro, body, conclusion clearly delineated?
3. **Connectors** — at least 5-7 sophisticated connectors used correctly?
4. **Vocabulary** — varied; uses precise B2-level words?
5. **Grammar** — correct verb tenses; subjunctive after triggers; agreement?
6. **Register** — consistent formal tone throughout?

**Memorize 7-10 connectors and 5-7 opinion phrases.** Drop them into your essay deliberately. Score points.

## What you can do now

- Use 5-7 B2-level connectors per essay
- Express opinions in nuanced (not absolute) terms
- Structure an argumentative essay with intro, two-sided body, conclusion
- Pick connectors by their argumentative function (add, concede, conclude, etc.)
- Pass the TEF Section B writing rubric

Next: **TEF/TCF reading comprehension strategies** — how to handle the section that loses most candidates time.
`;

export const FA_L8 = `# TEF/TCF reading — strategies for compréhension écrite

The reading section of TEF/TCF tests **comprehension speed + precision**. You have 60 minutes for ~50 questions across documents of increasing complexity. This lesson covers the exam-taking strategy, not just the language.

## What you'll see on the exam

| Section | Source documents | Question count | Difficulty |
|---------|------------------|----------------|------------|
| Part 1 | Practical documents (forms, ads, schedules) | ~10 | A1-A2 |
| Part 2 | Short factual texts (notices, brochures) | ~10 | A2-B1 |
| Part 3 | Articles, opinion pieces | ~15 | B1-B2 |
| Part 4 | Literary or argumentative excerpts | ~15 | B2-C1 |

The difficulty curve is real. **Spend less time on early questions** — they're quick wins. **Save your time budget for parts 3-4.**

## The three question types

### Type 1: Direct information
> *"Selon le document, quel est le prix du billet d'entrée?"*

Answer is **stated explicitly** in the text. Scan for keywords from the question.

### Type 2: Inference
> *"Que peut-on déduire de cet article concernant la politique du gouvernement?"*

Answer requires combining information across multiple sentences. The text doesn't say it directly — you reason it out.

### Type 3: Vocabulary / structure
> *"Dans la phrase 'Le projet a été abandonné', le mot 'abandonné' signifie..."*

Tests vocabulary in context. The four options will all be related; only one fits the specific context.

## The scan-then-read strategy

**Don't read the document fully before looking at questions.** Time wasted.

1. **Skim the document** (10-20 seconds) — title, headings, first sentence of each paragraph
2. **Read the question + 4 options** carefully
3. **Identify a keyword** from the question (usually a noun or specific term)
4. **Scan the document** for that keyword
5. **Read carefully around the match** to find the answer
6. **Eliminate wrong options** then confirm the right one

For 15-question sections, this method is far faster than reading the whole document first.

## The "almost-right" trap

Wrong options on TEF reading are designed to be **plausible**. Common traps:

| Trap | What it looks like |
|------|-------------------|
| **Mentioned but irrelevant** | Information appears in the text but doesn't answer THIS question |
| **Slightly altered** | One word changed from the original — false |
| **Overgeneralized** | Text says "many"; option says "all" |
| **Negation flip** | Text says "rarely"; option says "often" |
| **Time-confused** | Text describes past; option uses present tense |

Read both the text and the option **very carefully** for these substitutions.

## Vocabulary to recognize fast

Words you should INSTANTLY recognize as connectors / structure markers (no looking up):

\`\`\`french-vocab
par contre | however | par kontr
en revanche | on the other hand | ahn ruh-vahnsh
toutefois | however (formal) | toot-fwah
en effet | indeed | ahn eh-fay
en réalité | in reality | ahn ray-ah-lee-tay
voire | even / or even | vwar
notamment | notably | no-tah-mahn
néanmoins | nevertheless | nay-ahn-mwan
\`\`\`

These appear constantly in TEF texts. Each signals what's coming — concession, agreement, contradiction, example. **Train your eye to pause on them.**

## A worked example

> **Text (simplified):**
> *"Bien que les chiffres officiels indiquent une augmentation de l'emploi, plusieurs économistes restent sceptiques. Ils soulignent que cette croissance repose principalement sur des emplois précaires et à temps partiel. Néanmoins, le gouvernement maintient sa position et présente ces statistiques comme un succès de sa politique."*

> **Question:** Que peut-on dire de la position du gouvernement?
> A) Il reconnaît la précarité des nouveaux emplois.
> B) Il est en désaccord avec les économistes.
> C) Il critique les statistiques officielles.
> D) Il propose de nouvelles mesures économiques.

**Analysis:**
- A is wrong: the text says economists point out precarity; nothing says the government agrees.
- **B is correct**: "néanmoins, le gouvernement maintient" = "nevertheless, the government maintains" — this directly contradicts the economists' skepticism.
- C is wrong: the government uses the statistics as a success, doesn't criticize them.
- D is wrong: not mentioned.

The key connector was \`néanmoins\` — it signaled the government's position contrasts with what came before.

## Time management

For a 60-minute, 50-question test:
- **~1 minute per early question** (parts 1-2)
- **~1.5 minutes per harder question** (parts 3-4)
- **5 minutes** at end to review flagged questions

If a question takes more than 2 minutes, **flag it and move on**. Coming back with fresh eyes often makes the answer obvious.

## Practice — read this short text and answer

\`\`\`french-dialogue
title: Practice text (B1 level)
scene: Read carefully then check your understanding.
--
Text | Le télétravail s'est généralisé pendant la pandémie de 2020. Toutefois, depuis 2024, de nombreuses entreprises rappellent leurs employés au bureau. Selon une étude récente, 60% des dirigeants estiment que la présence physique favorise la créativité. Néanmoins, les employés restent largement favorables au modèle hybride, qui combine travail à distance et présentiel. | Telework became widespread during the 2020 pandemic. However, since 2024, many companies have been calling their employees back to the office. According to a recent study, 60% of executives believe that physical presence promotes creativity. Nevertheless, employees remain largely in favor of the hybrid model, which combines remote and in-office work.
Question | Que peut-on déduire? | What can one deduce?
Option A | Les employés et les dirigeants ont la même opinion sur le télétravail. | Employees and executives have the same opinion on telework.
Option B | Les dirigeants et les employés ne sont pas d'accord sur le format de travail idéal. | Executives and employees disagree on the ideal work format.
Option C | Le télétravail va disparaître en 2026. | Telework will disappear in 2026.
Option D | 60% des employés préfèrent le bureau. | 60% of employees prefer the office.
\`\`\`

**Correct answer:** B. The text says executives favor physical presence (60% of them) while employees favor hybrid — a clear disagreement. Trap: D inverts who the 60% refers to.

## What you can do now

- Scan-then-read instead of full-read-first for time efficiency
- Spot the three question types (direct, inference, vocabulary in context)
- Recognize the "almost-right" answer patterns
- Use connectors as comprehension landmarks
- Manage time (1-1.5 min per question; flag and move on if stuck)

Next: **Listening comprehension** — accents, fast speech, news broadcasts. The hardest section for most candidates.
`;

export const FA_L9 = `# TEF/TCF listening — accents, fast speech, news

For most candidates, listening is the hardest section — you can't re-read what you've heard. This lesson covers strategies + the accent variants you'll encounter on TEF/TCF Canada.

## Test structure

| Section | Audio type | Length | Difficulty |
|---------|-----------|--------|------------|
| Part 1 | Short conversations / announcements | 30s-1 min | A1-A2 |
| Part 2 | Longer dialogues, voicemails | 1-2 min | A2-B1 |
| Part 3 | Radio interviews, debates | 2-3 min | B1-B2 |
| Part 4 | News broadcasts, lectures | 3-5 min | B2-C1 |

You hear each audio **twice**. Use the first listen to **get the gist**; use the second to **catch details**.

## The accents you'll hear

TEF/TCF Canada uses primarily **standard European French** + **Québécois French**. Some questions specifically test understanding of Canadian French.

### Standard European French
- Clear, neutral pronunciation
- Slower speech in test audio (~150 words/min vs ~190 in natural speech)
- The accent you've probably been learning

### Québécois French
- Vowels: **tu** sounds more like "tsue" (affrication of t/d before i/u)
- **Pas** sometimes shortens to "pa"
- **Toi/moi** can sound like "twé/mwé"
- Vocabulary differences: \`char\` (car) instead of \`voiture\`, \`magasiner\` (to shop) instead of \`faire les courses\`

### Useful: Belgian / Swiss / African French
Mostly slight intonation differences. Vocabulary like Belgian \`septante\` (70) vs French \`soixante-dix\`. Rarely critical for TEF.

## Québécois vocabulary worth knowing

\`\`\`french-vocab
char | car | shar
piasse | dollar (slang) | pyahss
magasiner | to shop | mah-gah-zee-nay
prendre une marche | to go for a walk | prahn-druh oon marsh
chum / blonde | boyfriend / girlfriend | shum / blohnd
liqueur | soft drink | lee-ker
dépanneur | convenience store | day-pah-nuhr
chum de fille | female friend | shum duh fee
fin de semaine | weekend (NOT "week-end") | fan duh suh-men
job (feminine!) | job (la job, not le job) | jahb
\`\`\`

If you hear "char" — they mean car, not chariot. If you hear "magasiner" — they mean shopping, not "to magazine" something.

## The fast-speech challenges

Native fast speech has **reductions** that don't appear in textbooks. Train your ear:

\`\`\`french-grammar
title: How fast speech actually sounds
note: The left column is what's written. The right is what you'll hear in natural speech.
headers: Written | Spoken / fast
--
Je ne sais pas | "Chépas" / "Shay pas"
Il y a | "Y'a"
Tu as | "T'as"
Tu es | "T'es"
Qu'est-ce que tu | "Kestu" / "Keske tu"
Il faut que | "Faut que"
Je ne sais pas ce que | "Sais pas c'que"
Ce n'est pas | "C'est pas"
Je suis | "J'suis" / "Chuis"
\`\`\`

These are not slang — they're **normal speed** native speech. The TEF audio is somewhat slower than this, but exam tests at B2 will use some of these reductions.

## The scan-and-listen technique

Before the audio starts (you usually get 15-20 seconds):

1. **Read the questions** + all options
2. **Identify keywords** to listen for
3. **Predict** what the audio might say

While listening:

1. **First pass:** capture the gist (topic, speakers, main point)
2. **Mark obvious answers** during first pass
3. **Second pass:** focus on questions you weren't sure about
4. **Pay attention to negations and time markers** — easy to miss

## Numbers and dates — the silent killer

Numbers are tested heavily on listening tests. They're easy to mishear under speed:

\`\`\`french-vocab
soixante-douze | 72 | swah-sahnt-dooz
soixante-dix-sept | 77 | swah-sahnt-dees-set
quatre-vingt-quatre | 84 | kat-ruh-van-katr
quatre-vingt-treize | 93 | kat-ruh-van-trez
quatre-vingt-dix-huit | 98 | kat-ruh-van-dees-weet
\`\`\`

French numbers above 70 are notoriously hard for English speakers. Drill these.

## A practice scenario

\`\`\`french-dialogue
title: Voicemail message (TEF-style)
scene: A friend leaves you a message about a weekend plan.
--
Friend | Salut, c'est Marc. | Hi, it's Marc.
Friend | Je t'appelle parce que je voudrais qu'on se voie samedi. | I'm calling because I'd like us to see each other Saturday.
Friend | Je dois t'avouer que je voudrais aussi te demander un service. | I have to admit I'd also like to ask you a favor.
Friend | Bref, peux-tu me rappeler dès que possible? Mon numéro c'est le 06 78 92 34 51. | Anyway, can you call me back as soon as possible? My number is 06 78 92 34 51.
Friend | À bientôt! | See you soon!
\`\`\`

Typical TEF questions on a voicemail like this:
- *Pourquoi Marc appelle-t-il?* → for two reasons: voir, demander un service
- *Quand veut-il vous voir?* → samedi
- *Quel est son numéro?* → 06 78 92 34 51 (test of number listening)

Strategy: jot down numbers immediately when you hear them.

## Listening practice resources

For self-prep beyond this course:
- **TV5 Monde Apprendre** — free TEF/TCF practice videos at B1-B2 level
- **RFI (Radio France Internationale)** — "Journal en français facile" — news at slowed speed with transcripts
- **France Inter / Radio Canada** — real news at full speed for comprehension stretch
- **YouTube: Easy French** — street interviews at natural pace with subtitles

## What you can do now

- Pre-read questions before the audio plays
- Use first-pass for gist, second-pass for details
- Recognize Québécois vocabulary differences for Canada tests
- Decode fast-speech reductions ("chuis," "y'a," "kestu")
- Catch numbers 70-99 reliably under time pressure

Next: **TEF expression écrite + orale (writing + speaking)** — the final exam-strategy lesson.
`;

export const FA_L10 = `# TEF/TCF writing + speaking — the production sections

TEF and TCF both test **production** — making French, not just understanding it. Writing (expression écrite) and speaking (expression orale) are scored by humans with strict rubrics. This lesson is the strategic guide.

## TEF Expression écrite — two sections

### Section A — Continue a text / write an account (60 min, ~200 words)

You receive the **first part of a news story** and must write the rest in the same style. Or you describe an event you witnessed/experienced.

**The rubric tests:**
- Maintain narrative style (passé composé + imparfait, third person if the source is third person)
- Vocabulary appropriate to the topic
- Coherent structure (introduction → development → conclusion)
- Correct grammar (especially past-tense distinction)

**Strategy:**
- Read the source paragraph carefully → identify tense, register, person
- Plan briefly: what happens next, how does it end
- Write — aim for the word count (going under loses points)
- Re-read for: verb tenses, subject-verb agreement, accents

### Section B — Express an opinion (60 min, ~200 words)

You're given a controversial topic and must argue your position. We covered this in Lesson 7. Key reminders:
- 7+ connectors used correctly
- Nuanced position (not absolute)
- Clear intro / two-sided body / conclusion
- Formal register throughout

## The scoring rubric — explicitly

The TEF writing rubric scores on:

| Criterion | Weight | What to do |
|-----------|--------|------------|
| Adequation (did you do the task?) | 25% | Address the prompt directly |
| Cohérence (logical structure) | 25% | Intro / body / conclusion + connectors |
| Lexique (vocabulary) | 20% | Avoid repetition; use precise words |
| Morphosyntaxe (grammar) | 20% | Verb tenses, agreement, subjunctive after triggers |
| Sociolinguistique (register) | 10% | Consistent formal tone |

**Word count matters.** Section A: ~80-100 words required (varies). Section B: ~80-100 words. Going significantly under = points lost. Going over by 10-20% is fine.

## TEF Expression orale — three sections (15 min total)

### Section A — Request information (5 min)
Examiner gives you a situation: *"You want to enroll in a French course at a community center. Ask 5 questions."*

You ask the examiner questions. Tests **interrogative forms** and **politeness**.

\`\`\`
Bonjour, je voudrais m'inscrire à vos cours de français.
Auriez-vous des informations sur les niveaux disponibles?
Quels sont les horaires des cours du soir?
Le tarif est-il dégressif pour les inscriptions multiples?
Faut-il passer un test de niveau avant l'inscription?
Y a-t-il une période d'essai gratuite?
\`\`\`

**Score boost:** use \`auriez-vous,\` \`pourriez-vous,\` \`y a-t-il,\` \`combien de\` — varied interrogative structures, all in vous form.

### Section B — Argue a position (10 min total, 5 min spoken)

Examiner gives a scenario where you must **convince** them of something: *"Convince your colleague to switch to renewable energy at the office."*

Tests: argumentation, conditional, formal register, vocabulary range.

\`\`\`
- État de la situation: "Actuellement, notre bureau consomme beaucoup d'électricité..."
- Proposition: "Je propose que nous passions à l'énergie renouvelable, notamment solaire."
- Argument 1: "Tout d'abord, cela réduirait notre empreinte carbone."
- Argument 2: "De plus, à long terme, les coûts seraient inférieurs."
- Concession: "Certes, l'investissement initial est élevé."
- Réponse à la concession: "Cependant, plusieurs aides financières sont disponibles."
- Appel à l'action: "Que diriez-vous d'organiser une réunion avec un installateur?"
\`\`\`

This structure scores: argumentation + connectors + subjunctive (que nous passions, que diriez-vous) + conditional (réduirait, seraient) + conclusion that invites response.

## Common TEF speaking errors that cost points

| Error | Fix |
|-------|-----|
| **Code-switching to English** when stuck | Pause; restate in simpler French |
| **Tu instead of vous** in formal scenario | Train to default to vous; conscious effort |
| **Anglicisms** ("le marketing" → use "la commercialisation" in formal) | Pre-learn formal equivalents |
| **Mispronouncing -e endings** | Practice "elle parle" vs "elles parlent" — silent |
| **Wrong gender** in pronoun ("le voiture") | Always memorize gender with the noun |
| **Missing liaison** | "les enfants" sounds "lez-ahn-fahn" (s pronounced as z) |
| **Avoiding subjunctive** | Force yourself to use 2-3 instances; "il faut que," "je veux que" |

## Score targets for Canadian PR

| TEF score | NCLC | CEFR | Sufficient for |
|-----------|------|------|----------------|
| 263-309 | 5 | B1 | Some PNP streams, French-speaking community immigration |
| 310-348 | 7 | B2 | **Express Entry main pool (target for most PR applicants)** |
| 349-370 | 8 | B2+ | Maximum points in Express Entry CRS |
| 371-393 | 9 | C1 | Even more CRS points |
| 394+ | 10 | C2 | Maximum possible |

For Express Entry, **NCLC 7 across all four skills = +136 CRS points** (assuming you also have English). This is often the difference between getting an Invitation to Apply and waiting another year. **NCLC 7 is the realistic target.**

## A practice prompt — write your response

> **Prompt (Section B style):**
> Certains pensent que les médias sociaux ont un impact négatif sur la jeunesse. D'autres y voient un outil positif. Qu'en pensez-vous? Justifiez votre opinion en 80-100 mots.

Spend 5 minutes drafting in your head:
1. Position (e.g., "Les médias sociaux ont des effets ambivalents...")
2. Argument 1 + example
3. Argument 2 / counter-argument acknowledged
4. Conclusion

Then write it out. Self-grade against the rubric: did you use 5+ connectors? Did you use subjunctive (e.g., "bien que" + subjunctive)? Did you maintain formal register?

## Final exam-day tips

- **Eat a real breakfast.** Brain function depends on glucose.
- **Read every instruction twice** — slowing down here saves time later
- **Manage time per section** — set a watch alarm for budget overruns
- **Skip and return** if stuck on a question; don't lose 5 minutes on a 1-mark question
- **In speaking: keep talking.** Long silences signal panic. Better to say something imperfect than nothing.

## You've finished French Advanced

10 lessons covering passé composé, imparfait, the three future tenses, pronouns and their order, conditional, subjunctive, formal register, B2 argumentation, reading strategy, listening strategy, and writing + speaking technique.

This is the **complete TEF/TCF Canada PR prep toolkit** for written language. The next step is **immersion practice**: French podcasts (Radio Canada, France Inter), French novels at B1-B2 level (Maupassant short stories, modern children's literature), and ideally a conversation partner for spoken practice.

A few free resources to extend this:
- **TV5 Monde Apprendre** — free graded videos with TEF/TCF-style questions
- **Bonjour de France** — free B1/B2 exercises
- **Mango Languages** (free via many Canadian libraries) — structured speaking practice
- **CIEP / France Éducation International** — official TCF prep materials

**Bonne chance pour votre examen et votre projet de PR canadienne!**
`;
