/* eslint-disable no-irregular-whitespace */
import type { TcfUnit } from "@/lib/tcf-program/types";

const TCF_C01 = `# Le subjonctif présent — doubt, necessity, emotion

The **subjonctif** is the B1→B2 dividing line. TCF Canada tests it in reading, writing task 3, and speaking tasks 2–3. Most triggers are a finite list — learn them and you're set.

## What is the subjunctive?

Indicative = facts. Subjunctive = non-facts: wishes, doubts, emotions, necessities.

> **Indicative:** Il vient. — *He's coming.* (fact)
> **Subjunctive:** Je veux qu'il vienne. — *I want him to come.* (wish)

Almost always follows **que** + a triggering expression.

## Regular conjugation

Stem = **ils form of present** minus **-ent** + subjunctive endings.

\`\`\`french-grammar
title: Present subjunctive — regular endings
note: Stem = ils-form minus -ent. Endings: e, es, e, ions, iez, ent.
headers: parler (parl-) | finir (finiss-) | vendre (vend-)
--
que je parle | que je finisse | que je vende
que tu parles | que tu finisses | que tu vendes
qu'il/elle parle | qu'il/elle finisse | qu'il/elle vende
que nous parlions | que nous finissions | que nous vendions
que vous parliez | que vous finissiez | que vous vendiez
qu'ils/elles parlent | qu'ils/elles finissent | qu'ils/elles vendent
\`\`\`

## The 9 essential irregulars

\`\`\`french-grammar
title: Essential irregular subjunctives
note: Drill these nine — they cover 90% of subjunctive you'll encounter.
headers: être | avoir | faire | aller
--
que je sois | que j'aie | que je fasse | que j'aille
que tu sois | que tu aies | que tu fasses | que tu ailles
qu'il/elle soit | qu'il/elle ait | qu'il/elle fasse | qu'il/elle aille
que nous soyons | que nous ayons | que nous fassions | que nous allions
que vous soyez | que vous ayez | que vous fassiez | que vous alliez
qu'ils/elles soient | qu'ils/elles aient | qu'ils/elles fassent | qu'ils/elles aillent
\`\`\`

Plus: **pouvoir** → que je puisse; **savoir** → que je sache; **vouloir** → que je veuille; **venir** → que je vienne.

## Trigger categories

### Necessity
**Il faut que...**, **il est nécessaire que...**, **il vaut mieux que...**

### Wishes
**Je veux que...**, **j'aimerais que...**, **je préfère que...**

### Doubt
**Je doute que...**, **je ne crois pas que...**, **il est possible que...**

### Emotion
**Je suis content(e) que...**, **j'ai peur que...**, **c'est dommage que...**

### Conjunctions
**bien que**, **pour que**, **avant que**, **sans que**, **à condition que**

\`\`\`french-sentence
prompt: I want you to come tomorrow.
answer: Je veux que tu viennes demain.
distractors: viens | vienne | venu
hint: "Je veux que" triggers subjunctive. Venir → que tu viennes.
\`\`\`

\`\`\`french-sentence
prompt: I'm happy that you're here.
answer: Je suis content(e) que tu sois là.
distractors: es | étais | sois là
hint: Emotion → subjunctive. Être → que tu sois.
\`\`\`
`;

const TCF_C02 = `# Ordre des pronoms — the killer rule

When multiple pronouns appear in one sentence, they follow a **fixed order** before the verb. This is tested in TCF reading and distinguishes B2 speakers in production.

\`\`\`
me / te / se / nous / vous  →  le / la / les  →  lui / leur  →  y  →  en
\`\`\`

Mnemonic: **MTL** → **LLL** → **LL** → **Y** → **EN**

\`\`\`french-vocab
Je le lui donne. | I give it to him/her. | (le + lui)
Tu m'en parles. | You're talking to me about it. | (m' + en)
Il nous les envoie. | He sends them to us. | (nous + les)
Nous y allons. | We're going there. | (y alone)
Elle leur en achète. | She buys some for them. | (leur + en)
\`\`\`

## Affirmative imperative exception

In affirmative commands, pronouns come **AFTER** the verb with hyphens — and order changes:

> **Donne-le-moi!** — *Give it to me!* (direct before indirect)
> **Donne-m'en!** — *Give me some!*

Negative imperatives keep normal order: **Ne me le donne pas!**

## Compound tenses

Pronouns sit **between subject and auxiliary**:

> **Je l'ai vu.** (not *J'ai le vu*)
> **Nous y sommes allés.** (not *Nous sommes y allés*)

\`\`\`french-sentence
prompt: I gave it to them.
answer: Je le leur ai donné.
distractors: ai donné | l' | les
hint: le (direct) before leur (indirect). Both before auxiliary ai.
\`\`\`

\`\`\`french-match
title: Pronoun gymnastics
Je le vois. | I see him.
Je lui parle. | I'm talking to him.
J'y vais. | I'm going there.
J'en veux. | I want some.
Je le lui donne. | I give it to him.
Donne-le-moi! | Give it to me!
\`\`\`
`;

const TCF_C03 = `# Conditionnel passé — what would have been

The **conditionnel passé** describes things that could have happened but didn't. It pairs with plus-que-parfait in si clauses and appears in B2 writing and speaking.

## Formation

Conditionnel présent of \`avoir\`/\`être\` + past participle.

\`\`\`french-grammar
title: Conditionnel passé — "would have done"
note: Stack onto plus-que-parfait in hypothetical past si clauses.
headers: avoir verb | être verb
--
J'aurais fait | je serais venu(e)
Tu aurais dit | tu serais parti(e)
Il aurait pu | il serait arrivé
Nous aurions su | nous serions allé(e)s
Vous auriez voulu | vous seriez sorti(e)(s)
Ils auraient cru | ils seraient resté(e)s
\`\`\`

## The third si clause

\`\`\`
Si + PLUS-QUE-PARFAIT → CONDITIONNEL PASSÉ
Si j'avais su, je ne serais pas venu.
\`\`\`

\`\`\`french-dialogue
title: Regrets and hypotheticals
scene: Discussing a missed opportunity.
--
Ami | Tu regrettes de ne pas être venu à la conférence? | Do you regret not coming to the conference?
You | Oui, j'aurais appris beaucoup. Si j'avais su que c'était gratuit, je serais venu. | Yes, I would have learned a lot. If I'd known it was free, I would have come.
Ami | Tu aurais pu t'inscrire en ligne. | You could have registered online.
You | C'est vrai. J'aurais dû vérifier le site plus tôt. | True. I should have checked the site earlier.
\`\`\`

\`\`\`french-sentence
prompt: I would have helped you if you had asked.
answer: Je t'aurais aidé(e) si tu avais demandé.
distractors: aiderais | t'aiderais | demandais
hint: Result = conditionnel passé; si clause = plus-que-parfait.
\`\`\`
`;

const TCF_C04 = `# Accord du participe passé — the agreement rules

Past participle agreement is a B2 grammar point tested in TCF writing and reading. Three main cases: with **être**, with **avoir** + preceding direct object, and with **reflexive** verbs.

## With être — always agrees with subject

> **Elle est partie.** (feminine)
> **Ils sont arrivés.** (masculine plural)
> **Elles sont venues.** (feminine plural)

## With avoir — agrees if direct object precedes

> **La lettre que j'ai écrite** — *The letter I wrote* (letter = feminine → écrite)
> **J'ai écrit une lettre** — no agreement (object follows)

\`\`\`french-grammar
title: Participle agreement with avoir
note: Agreement ONLY when the direct object comes BEFORE the verb phrase.
headers: Object position | Agreement?
--
J'ai mangé une pomme. | No (object after)
La pomme que j'ai mangée. | Yes (object before — que = la pomme)
Les livres que j'ai lus. | Yes (masculine plural)
\`\`\`

## Reflexive verbs (se)

Ask: is **se** a direct object? If yes, agree.

> **Elle s'est lavée.** (she washed herself — se = direct → agreement)
> **Elle s'est lavé les mains.** (hands = direct object after → no agreement on lavé)

\`\`\`french-sentence
prompt: The books I read were interesting.
answer: Les livres que j'ai lus étaient intéressants.
distractors: lu | lus | lues
hint: "Les livres" precedes → masculine plural agreement: lus.
\`\`\`

\`\`\`french-match
title: Agreement or not?
Elle est partie. | Yes (être verb)
J'ai fini mon travail. | No (object after)
La décision que nous avons prise. | Yes (object before)
Il s'est coupé le doigt. | No (doigt follows)
\`\`\`
`;

const TCF_C05 = `# Relatives avancées — dont, où, lequel

Beyond **qui** and **que**, B2 TCF texts use **dont**, **où**, and **lequel** — especially in formal writing and reading parts 3–4.

## Dont — whose / of which / about which

Replaces **de + noun** (never a subject or direct object).

> **L'homme dont je parle** — *The man I'm talking about*
> **La ville dont je suis originaire** — *The city I'm from*
> **J'ai trois amis, dont deux sont francophones.** — *I have three friends, two of whom are francophone.*

## Où — where / when

> **La maison où j'habite** — *The house where I live*
> **L'année où je suis arrivé** — *The year I arrived*

## Lequel / laquelle / lesquels / lesquelles

Used after prepositions when **qui/que** won't work:

> **Le projet sur lequel nous travaillons** — *The project we're working on*
> **La question à laquelle je réponds** — *The question I'm answering*

\`\`\`french-grammar
title: Relative pronoun picker
note: Ask what role the relative plays and what preposition is needed.
headers: Function | Pronoun
--
Subject | qui
Direct object | que
de + noun | dont
Place / time | où
After preposition + thing | lequel/laquelle
\`\`\`

\`\`\`french-sentence
prompt: The city I'm from is in Quebec.
answer: La ville dont je suis originaire est au Québec.
distractors: que | où | de laquelle
hint: "Être originaire de" → dont replaces de + city.
\`\`\`
`;

const TCF_C06 = `# Registre formel — letters, emails, vous

TCF **writing task 3** and **speaking task 3** require **soutenu** register. Casual French costs marks — this lesson covers the formal half.

## Tu vs vous for Canada

- **Vous** = default for strangers, work, officials, exam scenarios
- **Tu** = friends, family, peers in casual contexts

**For TCF Canada, default to vous** in formal tasks.

## Polite formulations

\`\`\`french-grammar
title: Plain → polite (soutenu)
headers: Casual | Polite
--
Je veux un café. | Je voudrais un café, s'il vous plaît.
Tu peux m'aider? | Pourriez-vous m'aider?
Je veux savoir si... | Je souhaiterais savoir si...
Donne-moi le rapport. | Pourriez-vous me transmettre le rapport?
\`\`\`

\`\`\`french-vocab
souhaiter | to wish / want (formal) | soo-eh-tay
veuillez | please (formal imperative) | vuh-yay
ci-joint | enclosed | see-zhwan
dans l'attente de | awaiting | dahn lah-tahnt duh
cordialement | sincerely | kor-dyahl-mahn
veuillez agréer | please accept (closing) | vuh-yay ah-gray-ay
\`\`\`

## Formal letter structure

\`\`\`
Objet: Demande d'information
Madame, Monsieur,
Je me permets de vous contacter au sujet de...
Je souhaiterais...
Dans l'attente de votre réponse, je vous remercie de votre attention.
Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.
\`\`\`

\`\`\`french-sentence
prompt: I would like to know if it is possible to take the test in May.
answer: Je souhaiterais savoir s'il est possible de passer l'examen en mai.
distractors: veux | sais | si c'est
hint: Formal "want to know" → souhaiter savoir. "Pass an exam" → passer un examen.
\`\`\`
`;

const TCF_C07 = `# Argumentation — structure pour le B2

TCF **writing task 2** (article) and **task 3** (letter) require structured argumentation. B2 connectors and nuanced positions are the score boosters for NCLC 7.

## The four argument moves

1. **State position** — selon moi, à mon avis, je suis convaincu(e) que
2. **Give reasons** — tout d'abord, de plus, par exemple
3. **Acknowledge counter** — certes, cependant, néanmoins
4. **Conclude** — en conclusion, pour conclure

\`\`\`french-grammar
title: B2 connectors by function
headers: Function | Connector
--
Add | de plus / en outre / par ailleurs
Concede | certes / il est vrai que
Counter | cependant / néanmoins / toutefois
Cause (formal) | étant donné que / en raison de
Consequence | par conséquent / de ce fait / dès lors
Example | notamment / par exemple
Conclude | en conclusion / pour conclure
\`\`\`

## Nuanced vs absolute

\`\`\`french-grammar
title: Absolute → nuanced (B2)
headers: Too absolute | B2 nuanced
--
C'est très bien. | Cela présente de nombreux avantages.
C'est faux. | Cette affirmation me semble discutable.
C'est impossible. | Cela paraît difficile à réaliser.
\`\`\`

\`\`\`french-sentence
prompt: Although the project is expensive, I believe it will be profitable.
answer: Bien que le projet soit coûteux, je crois qu'il sera rentable à long terme.
distractors: malgré que | est | sera rentable
hint: "Although" + verb → bien que + SUBJUNCTIVE.
\`\`\`
`;

const TCF_C08 = `# Pièges du subjonctif — espérer, penser, croire

The subjunctive triggers are a list — but so are the **exceptions**. TCF multiple-choice questions love these traps.

\`\`\`french-match
title: Subjunctive or indicative?
Il faut que... | subjunctive
J'espère que... | INDICATIVE (espérer keeps indicative!)
Bien que... | subjunctive
Je suis sûr(e) que... | indicative (certainty)
Je doute que... | subjunctive
Je pense que... (affirmative) | indicative
Je ne pense pas que... | subjunctive
Je crois que... (affirmative) | indicative
Je ne crois pas que... | subjunctive
\`\`\`

## Key traps

### Espérer — always indicative
> **J'espère qu'il vient.** ✓ (NOT *vienne*)

### Penser / croire — indicative affirmative, subjunctive negative
> **Je pense qu'il vient.** ✓
> **Je ne pense pas qu'il vienne.** ✓

### Après "que" with certainty verbs
> **Il est évident que...** → indicative
> **Il est possible que...** → subjunctive

\`\`\`french-sentence
prompt: I hope he comes tomorrow.
answer: J'espère qu'il vient demain.
distractors: vienne | viendra | viendrait
hint: Espérer → indicative, never subjunctive.
\`\`\`

\`\`\`french-sentence
prompt: I don't think she is ready.
answer: Je ne pense pas qu'elle soit prête.
distractors: est | était | sera
hint: Negative penser → subjunctive. Être → qu'elle soit.
\`\`\`
`;

const TCF_C09 = `# Marqueurs discursifs — le vocabulaire du B2

Discourse markers signal argument structure. TCF writing rubrics explicitly reward 5–7 sophisticated connectors used correctly.

\`\`\`french-vocab
en outre | furthermore | an ootr
par ailleurs | moreover / on another note | par ah-yuhr
néanmoins | nevertheless | nay-ahn-mwan
toutefois | however (formal) | toot-fwah
en revanche | on the other hand | ahn ruh-vahnsh
étant donné que | given that | ay-tahn duh-nay kuh
dès lors | therefore / hence | day lor
c'est-à-dire | that is to say | say ah deer
il convient de | it is appropriate to | eel kon-vyan duh
\`\`\`

\`\`\`french-match
title: Connector function
de plus | adds information
cependant | introduces counter-argument
par conséquent | introduces consequence
notamment | gives an example
en conclusion | concludes
par ailleurs | adds (formal)
étant donné que | gives a cause (formal)
\`\`\`

\`\`\`french-sentence
prompt: Furthermore, it is undeniable that the situation has changed.
answer: De plus, il est indéniable que la situation a changé.
distractors: en plus | indéniablement | a changée
hint: "Furthermore" = de plus. Certainty → indicative after "il est indéniable que".
\`\`\`

**Target:** Use 7+ different connectors in writing tasks 2 and 3. Plan them before you write.
`;

const TCF_C10 = `# Compréhension orale québécoise — accents et vocabulaire

TCF Canada uses **standard French** and **Québécois French**. Some listening items specifically test Canadian vocabulary and pronunciation patterns.

## Québécois pronunciation notes

- **Tu** can sound like "tsu" (affrication before i/u)
- **Pas** sometimes shortens to "pa"
- **Toi/moi** can sound like "twé/mwé"

## Essential Québécois vocabulary

\`\`\`french-vocab
char | car (not voiture) | shar
magasiner | to shop | mah-gah-zee-nay
dépanneur | convenience store | day-pah-nuhr
fin de semaine | weekend | fan duh suh-men
job (féminin!) | job (la job) | jahb
liqueur | soft drink | lee-ker
prendre une marche | to go for a walk | prahn-druh oon marsh
courriel | email | koo-ryel
\`\`\`

If you hear **char** — they mean car. **Magasiner** — shopping, not "to magazine."

\`\`\`french-dialogue
title: At the dépanneur (Québec)
scene: Buying snacks at a convenience store.
--
Clerk | Bonjour! Vous magasinez pour la fin de semaine? | Hi! Shopping for the weekend?
You | Oui, je cherche des liqueurs et des collations. | Yes, I'm looking for soft drinks and snacks.
Clerk | C'est au fond, à gauche. Vous prenez la job de soir? | They're at the back, left. You work the evening shift?
You | Non, je rentre chez moi en char. | No, I'm driving home.
\`\`\`

**Practice:** Listen to Radio-Canada (ICI Première) for 15 min daily — real Québécois at natural speed.
`;

const TCF_C11 = `# Compréhension orale B2 — interviews et débats

Questions 20–30 on TCF listening hit B2: radio interviews, debates, news segments. Two listens — first for gist, second for detail.

## Audio types at B2

| Type | Length | Challenge |
|------|--------|-----------|
| Radio interviews | 2–3 min | Multiple speakers, opinions |
| Debates | 2–3 min | Contrasting viewpoints |
| News segments | 2–3 min | Fast pace, formal vocabulary |

## Listen-for landmarks

- **Negations** — easy to miss ("ne...pas," "ne...jamais")
- **Time markers** — hier, demain, l'année prochaine
- **Numbers 70–99** — drill soixante-dix, quatre-vingt-treize
- **Connectors** — néanmoins, cependant signal opinion shifts

\`\`\`french-vocab
soixante-dix | 70 | swah-sahnt-dees
quatre-vingt-quatre | 84 | kat-ruh-van-katr
quatre-vingt-treize | 93 | kat-ruh-van-trez
quatre-vingt-dix-huit | 98 | kat-ruh-van-dees-weet
\`\`\`

## Protocol

1. Pre-read all questions + options
2. First listen: topic, speakers, main point
3. Mark obvious answers
4. Second listen: uncertain questions only
5. Jot numbers/dates immediately when heard

**Practice:** Focus on listening questions 20–30 in the app. Flag anything over 2 minutes and return.
`;

const TCF_C12 = `# Compréhension écrite B2 — articles et argumentation

TCF reading questions 25–35 test B2: opinion pieces, argumentative articles, literary excerpts. Inference questions dominate.

## Question types at B2

### Inference (most common)
> *"Que peut-on déduire de cet article?"*

Combine information across sentences — answer isn't stated directly.

### Author's position
> *"Quelle est l'opinion de l'auteur?"*

Look for opinion markers: selon moi, il me semble, je suis convaincu.

### Vocabulary in context
> *"Dans ce contexte, 'précaire' signifie..."*

All four options related — only one fits the specific context.

## Worked example

> *"Bien que les chiffres indiquent une augmentation de l'emploi, plusieurs économistes restent sceptiques. Néanmoins, le gouvernement maintient sa position."*

**Question:** Position du gouvernement?
- **Correct:** Il est en désaccord avec les économistes (néanmoins = contrast)
- **Trap:** Option that inverts who said what

\`\`\`french-sentence
prompt: According to the text, what is the author's main argument?
answer: Selon le texte, l'argument principal de l'auteur est...
distractors: Selon moi | le texte dit | l'auteur pense
hint: Reading comp — cite "selon le texte" not your own opinion.
\`\`\`

**Time budget:** ~1.5 min per B2 question. Flag and move on at 2 min.
`;

const TCF_C13 = `# Écriture — tâche 2 (article semi-formel)

**Task 2:** 120–150 words, **semi-formal register**, 20 minutes. Write an article for a newsletter, blog, or community publication.

## Format

| Element | Detail |
|---------|--------|
| Register | Semi-formal (vous acceptable, professional tone) |
| Length | 120–150 words |
| Time | 20 minutes |
| Structure | Intro → development → conclusion |

## Model opening

**Prompt:** *Rédigez un article sur un événement communautaire récent.*

> **Titre : Une journée mémorable au festival de quartier**
>
> La semaine dernière, notre quartier a organisé son festival annuel. Cet événement a rassemblé plus de 500 résidents et a permis de renforcer les liens entre voisins.
>
> Tout d'abord, les activités pour enfants ont connu un grand succès. De plus, les stands de produits locaux ont attiré de nombreux visiteurs. Certes, la météo n'était pas idéale, mais cela n'a pas diminué l'enthousiasme des participants.
>
> En conclusion, ce festival démontre l'importance des événements communautaires. J'encourage tous les résidents à participer l'année prochaine.

\`\`\`french-sentence
prompt: Furthermore, this event benefited the whole neighbourhood.
answer: De plus, cet événement a profité à tout le quartier.
distractors: en plus | a bénéficié | du quartier
hint: "Furthermore" formally = de plus. "Benefit" → profiter à.
\`\`\`

**Rubric focus:** 5+ connectors, PC/imparfait for past events, semi-formal throughout.
`;

const TCF_C14 = `# Écriture — tâche 3 (lettre formelle)

**Task 3:** 120–180 words, **formal register**, 25 minutes. Letter to an authority — mayor, director, government office.

## Must-haves for full marks

1. **Objet:** line with clear subject
2. **Madame, Monsieur,** (or titled recipient)
3. Opening: **Je me permets de vous contacter...**
4. Body: motivation + specific request/argument
5. Closing: **Dans l'attente de votre réponse...**
6. Sign-off: **Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.**

## Model excerpt

> Objet : Proposition de jardin communautaire
>
> Madame, Monsieur,
>
> Je me permets de vous écrire afin de proposer la création d'un jardin communautaire dans le parc du quartier Saint-Roch. En effet, de nombreux résidents ont exprimé le souhait de disposer d'espaces verts partagés.
>
> Tout d'abord, un tel projet favoriserait la cohésion sociale. De plus, il permettrait aux familles d'accéder à des produits frais à moindre coût. Bien que l'investissement initial puisse sembler élevé, je suis convaincu(e) que les bénéfices à long terme justifient cette démarche.
>
> Je souhaiterais donc obtenir votre soutien pour mener une étude de faisabilité. Dans l'attente de votre réponse, je vous remercie de votre attention.
>
> Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

\`\`\`french-sentence
prompt: Could you please send me your reply by Friday?
answer: Pourriez-vous me faire parvenir votre réponse avant vendredi?
distractors: pouvez | envoyer | s'il vous plaît
hint: Formal "could you" → pourriez-vous. "Send" formally = faire parvenir.
\`\`\`
`;

const TCF_C15 = `# Expression orale — tâche 2 (interaction)

**Speaking task 2:** Structured interaction — convince, negotiate, or solve a problem with the examiner. ~5 minutes including prep.

## Structure that scores

1. **État de la situation** — describe current state
2. **Proposition** — what you suggest (use subjunctive: je propose que...)
3. **Arguments** — tout d'abord, de plus
4. **Concession** — certes, il est vrai que
5. **Réponse** — cependant, néanmoins
6. **Appel à l'action** — que diriez-vous de...?

\`\`\`french-dialogue
title: Convincing a colleague about renewable energy
scene: TCF speaking task 2 scenario.
--
You | Actuellement, notre bureau consomme beaucoup d'électricité. | Currently our office uses a lot of electricity.
You | Je propose que nous passions à l'énergie renouvelable. | I propose we switch to renewable energy.
You | Tout d'abord, cela réduirait notre empreinte carbone. | First, it would reduce our carbon footprint.
You | De plus, à long terme, les coûts seraient inférieurs. | Moreover, long-term costs would be lower.
You | Certes, l'investissement initial est élevé. | Certainly the initial investment is high.
You | Cependant, plusieurs aides financières sont disponibles. | However, several financial aids are available.
You | Que diriez-vous d'organiser une réunion avec un installateur? | What would you say to organizing a meeting with an installer?
\`\`\`

**Score boost:** subjunctive (je propose que), conditional (réduirait), connectors, vous form.
`;

const TCF_C16 = `# Expression orale — tâche 3 (point de vue)

**Speaking task 3:** Express and defend your opinion on a societal topic. ~4–5 minutes. Tests argumentation, nuance, and formal register.

## Approach

1. **State position** clearly (30 sec)
2. **Two arguments** with examples (2 min)
3. **Acknowledge other side** (30 sec)
4. **Conclude** with nuance (30 sec)

## Useful phrases

\`\`\`french-vocab
selon moi | in my opinion | suh-lon mwah
je suis convaincu(e) que | I'm convinced that | zhuh swee kon-van-koo
il me semble que | it seems to me | eel muh sahmbl
d'un côté... de l'autre | on one hand... on the other | dun kot... duh lotr
en définitive | ultimately | ahn day-fee-neetiv
\`\`\`

## Sample topic

> *"Pensez-vous que le télétravail soit l'avenir du travail?"*

> À mon avis, le télétravail constitue une évolution majeure, mais il ne remplacera pas totalement le bureau. D'un côté, il offre flexibilité et équilibre vie pro/perso. De l'autre, il limite les interactions spontanées. En définitive, l'avenir sera hybride.

\`\`\`french-sentence
prompt: In my opinion, social media has both positive and negative effects.
answer: À mon avis, les médias sociaux ont des effets à la fois positifs et négatifs.
distractors: Selon moi les | effets positifs | et négatif
hint: "À mon avis" + plural "effets" + "positifs et négatifs".
\`\`\`

**Avoid:** long silences, switching to English, tu in formal scenario.
`;

const TCF_C17 = `# Futur antérieur — will have done

The **futur antérieur** describes an action that **will be completed before another future action**. Tested in B2 reading and writing.

## Formation

Futur simple of \`avoir\`/\`être\` + past participle.

\`\`\`french-grammar
title: Futur antérieur — "will have done"
note: Futur antérieur happens FIRST; futur simple happens SECOND.
headers: avoir verb | être verb
--
J'aurai fini | je serai parti(e)
Tu auras vu | tu seras arrivé(e)
Il aura mangé | il sera venu
Nous aurons su | nous serons sorti(e)s
\`\`\`

## Triggers

After **quand**, **dès que**, **lorsque**, **aussitôt que**, **une fois que** — the **earlier** future action takes futur antérieur:

> **Quand j'aurai fini, je t'appellerai.**
> **Dès que tu seras arrivé(e), nous commencerons.**

\`\`\`french-sentence
prompt: When I have finished, I will call you.
answer: Quand j'aurai fini, je t'appellerai.
distractors: finirai | finis | te appellerai
hint: "When + first event" in future → futur antérieur for earlier (j'aurai fini).
\`\`\`

\`\`\`french-dialogue
title: Exam preparation timeline
scene: Planning before TCF Canada.
--
You | Quand j'aurai terminé le cours B2, je passerai le TCF Canada. | When I've finished the B2 course, I'll take TCF Canada.
Ami | Tu auras étudié combien de temps? | How long will you have studied?
You | J'aurai étudié environ six mois. Dès que j'aurai reçu mes résultats, je soumettrai ma demande de RP. | I'll have studied about six months. As soon as I receive my results, I'll submit my PR application.
\`\`\`
`;

const TCF_C18 = `# Point de contrôle B2 — êtes-vous prêt pour NCLC 7?

This checkpoint reviews everything in Track C. **NCLC 7 = CEFR B2** — the Express Entry threshold (+136 CRS points with English).

## Self-assessment checklist

### Grammar
- [ ] Subjunctive after all major triggers (and exceptions: espérer, penser+)
- [ ] Pronoun order: MTL → LLL → LL → Y → EN
- [ ] Conditionnel passé + si clause type 3
- [ ] Participle agreement (être, avoir+preceding object, reflexive)
- [ ] Futur antérieur after quand/dès que

### Production
- [ ] Writing task 1: informal, 80 words, PC/imparfait
- [ ] Writing task 2: semi-formal article, 5+ connectors
- [ ] Writing task 3: formal letter with full closing formula
- [ ] Speaking task 1: 5 varied polite questions
- [ ] Speaking task 2: convince with subjunctive + conditional
- [ ] Speaking task 3: nuanced opinion with concession

### Comprehension
- [ ] Listening Q20–30: interviews, debates
- [ ] Reading Q25–35: inference, author position
- [ ] Québécois vocabulary recognized

## NCLC score targets

| TCF score | NCLC | CEFR |
|-----------|------|------|
| 310–348 | 7 | B2 |
| 349–370 | 8 | B2+ |
| 371+ | 9+ | C1 |

\`\`\`french-match
title: B2 readiness — match skill to practice
Subjonctif après "il faut que" | Grammar drill
Lettre avec formule de politesse | Writing task 3
Interview radio B2 | Listening Q20–30
Article avec 7 connecteurs | Writing task 2
Opinion nuancée à l'oral | Speaking task 3
\`\`\`

**Next step:** Move to Track D (Exam Mastery) for timing, mocks, and test-day protocol.
`;

export const TRACK_C: TcfUnit[] = [
  {
    slug: "tcf-c01",
    trackId: "b2",
    order: 1,
    title: "Subjonctif présent",
    description: "Doubt, necessity, emotion — the B1→B2 dividing line with the essential trigger list.",
    content: TCF_C01,
    estimatedMins: 30,
    xpReward: 90,
    cefrBand: "B2",
    grammarTopics: ["subjonctif-present"],
    vocabThemes: ["necessity", "emotion"],
    prerequisites: [],
  },
  {
    slug: "tcf-c02",
    trackId: "b2",
    order: 2,
    title: "Ordre des pronoms",
    description: "MTL → LLL → LL → Y → EN — the fixed pronoun order rule and imperative exception.",
    content: TCF_C02,
    estimatedMins: 24,
    xpReward: 80,
    cefrBand: "B2",
    grammarTopics: ["pronoun-order"],
    vocabThemes: ["everyday-french"],
    prerequisites: ["tcf-c01"],
  },
  {
    slug: "tcf-c03",
    trackId: "b2",
    order: 3,
    title: "Conditionnel passé",
    description: "Would have done — hypothetical past and the third si-clause pattern.",
    content: TCF_C03,
    estimatedMins: 22,
    xpReward: 75,
    cefrBand: "B2",
    grammarTopics: ["conditionnel-passe", "si-clauses"],
    vocabThemes: ["hypotheticals"],
    prerequisites: ["tcf-c01"],
  },
  {
    slug: "tcf-c04",
    trackId: "b2",
    order: 4,
    title: "Accord du participe passé",
    description: "Agreement with être, avoir + preceding object, and reflexive verbs.",
    content: TCF_C04,
    estimatedMins: 24,
    xpReward: 80,
    cefrBand: "B2",
    grammarTopics: ["participe-passe-accord"],
    vocabThemes: ["grammar-precision"],
    prerequisites: ["tcf-c02"],
  },
  {
    slug: "tcf-c05",
    trackId: "b2",
    order: 5,
    title: "Relatives avancées",
    description: "Dont, où, lequel — relative pronouns for B2 reading and formal writing.",
    content: TCF_C05,
    estimatedMins: 22,
    xpReward: 75,
    cefrBand: "B2",
    grammarTopics: ["relatives-dont", "relatives-ou", "relatives-lequel"],
    vocabThemes: ["formal-writing"],
    prerequisites: ["tcf-c02"],
  },
  {
    slug: "tcf-c06",
    trackId: "b2",
    order: 6,
    title: "Registre formel",
    description: "Vous, souhaiter, letter structure — soutenu French for writing task 3.",
    content: TCF_C06,
    estimatedMins: 26,
    xpReward: 85,
    cefrBand: "B2",
    grammarTopics: ["formal-register"],
    vocabThemes: ["business-french", "correspondence"],
    prerequisites: ["tcf-c03"],
  },
  {
    slug: "tcf-c07",
    trackId: "b2",
    order: 7,
    title: "Argumentation B2",
    description: "Four argument moves, B2 connectors, and nuanced positions for NCLC 7 writing.",
    content: TCF_C07,
    estimatedMins: 28,
    xpReward: 90,
    cefrBand: "B2",
    grammarTopics: ["argumentation"],
    vocabThemes: ["connectors", "opinions"],
    prerequisites: ["tcf-c01", "tcf-c06"],
  },
  {
    slug: "tcf-c08",
    trackId: "b2",
    order: 8,
    title: "Pièges du subjonctif",
    description: "Espérer, penser, croire — the exceptions TCF multiple-choice loves.",
    content: TCF_C08,
    estimatedMins: 20,
    xpReward: 75,
    cefrBand: "B2",
    grammarTopics: ["subjonctif-traps"],
    vocabThemes: ["grammar-precision"],
    prerequisites: ["tcf-c01"],
  },
  {
    slug: "tcf-c09",
    trackId: "b2",
    order: 9,
    title: "Marqueurs discursifs",
    description: "B2 discourse markers — en outre, néanmoins, étant donné que, dès lors.",
    content: TCF_C09,
    estimatedMins: 22,
    xpReward: 80,
    cefrBand: "B2",
    grammarTopics: ["discourse-markers"],
    vocabThemes: ["connectors"],
    prerequisites: ["tcf-c07"],
  },
  {
    slug: "tcf-c10",
    trackId: "b2",
    order: 10,
    title: "Oral québécois",
    description: "Québécois accent patterns and vocabulary — char, magasiner, dépanneur.",
    content: TCF_C10,
    estimatedMins: 24,
    xpReward: 80,
    cefrBand: "B2",
    grammarTopics: ["quebecois-listening"],
    vocabThemes: ["quebec-french"],
    prerequisites: ["tcf-c02"],
    practiceModule: "listening",
    practiceHint: "Listen for Québécois vocabulary in B2 listening items.",
  },
  {
    slug: "tcf-c11",
    trackId: "b2",
    order: 11,
    title: "Compréhension orale B2",
    description: "Interviews, debates, news — strategies for listening questions 20–30.",
    content: TCF_C11,
    estimatedMins: 28,
    xpReward: 85,
    cefrBand: "B2",
    grammarTopics: ["listening-b2"],
    vocabThemes: ["news", "interviews"],
    prerequisites: ["tcf-c10"],
    practiceModule: "listening",
    practiceHint: "Complete B2 listening questions (Q20–30) — two listens, pre-read questions.",
  },
  {
    slug: "tcf-c12",
    trackId: "b2",
    order: 12,
    title: "Compréhension écrite B2",
    description: "Inference, author position, vocabulary in context — reading questions 25–35.",
    content: TCF_C12,
    estimatedMins: 28,
    xpReward: 85,
    cefrBand: "B2",
    grammarTopics: ["reading-b2"],
    vocabThemes: ["articles", "argumentation"],
    prerequisites: ["tcf-c09"],
    practiceModule: "reading",
    practiceHint: "Practice B2 reading — focus on inference questions and connector landmarks.",
  },
  {
    slug: "tcf-c13",
    trackId: "b2",
    order: 13,
    title: "Écriture — tâche 2",
    description: "Semi-formal article: 120–150 words, newsletter/community format, 20 minutes.",
    content: TCF_C13,
    estimatedMins: 30,
    xpReward: 90,
    cefrBand: "B2",
    grammarTopics: ["writing-task-2"],
    vocabThemes: ["community", "events"],
    prerequisites: ["tcf-c07"],
    practiceModule: "writing",
    practiceHint: "Write a task 2 article with 5+ connectors and semi-formal register.",
  },
  {
    slug: "tcf-c14",
    trackId: "b2",
    order: 14,
    title: "Écriture — tâche 3",
    description: "Formal letter: objet line, closing formula, 120–180 words, 25 minutes.",
    content: TCF_C14,
    estimatedMins: 32,
    xpReward: 95,
    cefrBand: "B2",
    grammarTopics: ["writing-task-3"],
    vocabThemes: ["correspondence", "formal-requests"],
    prerequisites: ["tcf-c06", "tcf-c07"],
    practiceModule: "writing",
    practiceHint: "Write a task 3 letter with full Je vous prie d'agréer closing.",
  },
  {
    slug: "tcf-c15",
    trackId: "b2",
    order: 15,
    title: "Expression orale — tâche 2",
    description: "Structured interaction: convince, negotiate, subjunctive + conditional.",
    content: TCF_C15,
    estimatedMins: 28,
    xpReward: 90,
    cefrBand: "B2",
    grammarTopics: ["speaking-task-2"],
    vocabThemes: ["persuasion", "workplace"],
    prerequisites: ["tcf-c07"],
    practiceModule: "speaking",
    practiceHint: "Practice speaking task 2 — use je propose que + certes/cependant structure.",
  },
  {
    slug: "tcf-c16",
    trackId: "b2",
    order: 16,
    title: "Expression orale — tâche 3",
    description: "Defend an opinion: nuanced position, concession, formal phrases.",
    content: TCF_C16,
    estimatedMins: 28,
    xpReward: 90,
    cefrBand: "B2",
    grammarTopics: ["speaking-task-3"],
    vocabThemes: ["opinions", "society"],
    prerequisites: ["tcf-c07", "tcf-c15"],
    practiceModule: "speaking",
    practiceHint: "Practice speaking task 3 — state position, two arguments, concession, conclude.",
  },
  {
    slug: "tcf-c17",
    trackId: "b2",
    order: 17,
    title: "Futur antérieur",
    description: "Will have done — quand/dès que triggers for the earlier future action.",
    content: TCF_C17,
    estimatedMins: 22,
    xpReward: 75,
    cefrBand: "B2",
    grammarTopics: ["futur-anterieur"],
    vocabThemes: ["future-plans"],
    prerequisites: ["tcf-c03"],
  },
  {
    slug: "tcf-c18",
    trackId: "b2",
    order: 18,
    title: "Point de contrôle B2",
    description: "Self-assessment for NCLC 7 readiness — grammar, production, and comprehension checklist.",
    content: TCF_C18,
    estimatedMins: 30,
    xpReward: 100,
    cefrBand: "B2",
    grammarTopics: ["b2-checkpoint"],
    vocabThemes: ["exam-readiness"],
    prerequisites: ["tcf-c11", "tcf-c12", "tcf-c13", "tcf-c14", "tcf-c15", "tcf-c16"],
  },
];
