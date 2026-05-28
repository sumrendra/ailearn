/* eslint-disable no-irregular-whitespace */
/**
 * GMAT Prep — verbal reasoning + test-day strategy.
 *
 * Curriculum (this file: lessons 8-10 of 10):
 *   8.  Critical Reasoning — find the assumption, weaken the argument
 *   9.  Reading Comprehension — speed without skimping
 *   10. Test Day Strategy & the Wrong-Answer Journal
 *
 * Lessons 1-7 live in sibling files (overview/mindsets/DI in one, quant in
 * the other). Path registration happens elsewhere.
 */

export const GMAT_L8 = `# Critical Reasoning — find the assumption, weaken the argument

Critical Reasoning is the highest-leverage section on the GMAT. There are roughly **eight question archetypes**, and almost every CR problem you ever see is a slight variant of one of them. Learn the eight, and the section stops feeling like a guessing game.

Most students attack CR question-by-question. The 740+ approach is to **identify the archetype in the first five seconds**, then run the playbook for that archetype. The stem itself tells you which one — your job is to recognize the signal and switch mode.

## The eight archetypes

| # | Archetype | Stem signal | What you're being asked |
|---|-----------|-------------|--------------------------|
| 1 | **Assumption** | "is required", "must be true for the argument" | The unstated bridge the argument depends on |
| 2 | **Strengthen** | "supports", "most strongly justifies" | Make the conclusion more likely |
| 3 | **Weaken** | "weakens", "casts doubt on", "undermines" | Make the conclusion less likely |
| 4 | **Flaw** | "vulnerable to criticism", "the reasoning is flawed" | Name the error the argument makes |
| 5 | **Inference** | "must be true", "is most strongly supported" | What logically *must follow* from the passage |
| 6 | **Paradox** | "explains", "resolves the apparent contradiction" | Reconcile two facts that seem to conflict |
| 7 | **Evaluate** | "would be most useful to investigate / determine" | What additional question would test the argument |
| 8 | **Bold-faced** | "the portions in boldface play what role" | Label each bolded statement (premise / conclusion / counterpoint) |

Each archetype has its own three-step framework and its own dominant wrong-answer trap. Walk through them deliberately the first time — then it becomes reflexive.

### 1. Assumption

**Framework.** (a) Find the conclusion. (b) Find the gap between the evidence and the conclusion. (c) Pick the choice that *patches* that gap.

**Trap.** The choice that *strengthens* the argument but isn't *required*. Assumption questions ask what the argument *needs* to survive — not what would make it more likely.

> **High-scorer technique — the negate test.** Take an answer choice and negate it. If the negation *destroys* the argument, the choice is the assumption. If the argument still holds after the negation, that choice is *not* required and is wrong. The negate test resolves about 80% of close calls in assumption questions. Use it religiously.

### 2. Strengthen

**Framework.** (a) Find the conclusion. (b) Identify the assumption. (c) Pick the choice that confirms the assumption or rules out an alternative explanation.

**Trap.** The choice that restates a premise. Premises are already true; "strengthening" them adds nothing. The right answer adds *new* support.

### 3. Weaken

**Framework.** (a) Find the conclusion. (b) Find the assumption. (c) Pick the choice that breaks the assumption or provides an *alternative cause* for the observed effect.

**Trap.** The choice that weakens a *premise* rather than the conclusion. A premise is taken as given — your job is to attack the inferential leap, not deny the data.

### 4. Flaw

**Framework.** Diagnose the move the argument makes. Map it onto one of the named fallacies (see below). Pick the choice that describes that move in abstract language.

**Trap.** The choice that describes a *real* logical fallacy that the argument *didn't actually commit*. Read every flaw answer with "did this argument actually do this?"

### 5. Inference

**Framework.** Treat the passage as facts. Read each answer with the test "must this be true given only what's stated?"

**Trap.** The choice that the *author* would agree with but the *text* doesn't directly support. The inference is what logically *follows*, not what the author *concluded*. Most students conflate the two.

### 6. Resolve the paradox

**Framework.** State the contradiction in your own words ("X went up but Y went down"). Pick the choice that explains how both can be true *simultaneously*.

**Trap.** The choice that resolves *half* the paradox. The correct answer addresses both sides.

### 7. Evaluate

**Framework.** Convert each answer choice into a yes/no question. The right answer is the one where *yes vs no* would change your confidence in the conclusion.

**Trap.** The choice that's *interesting* but doesn't actually affect the conclusion either way. "Variance test": if both answers to the question (yes / no) leave the argument equally strong, it's a wrong choice.

### 8. Bold-faced

**Framework.** Tag each bolded portion as one of: premise, intermediate conclusion, main conclusion, counter-premise, counter-conclusion. Then pick the answer whose labels match.

**Trap.** Confusing *intermediate* conclusion (a fact the argument derives, then uses) with the *main* conclusion (the thing the argument is ultimately defending).

## The fallacies the GMAT loves on Flaw questions

| Fallacy | What it looks like |
|---------|--------------------|
| **Correlation vs causation** | "X and Y both happened, so X caused Y." (Could be reverse causation, common cause, or coincidence.) |
| **Hasty generalization** | One case → broad rule. ("My friend who dropped out got rich, so dropping out works.") |
| **Ad hominem** | Attacking the *source* of an argument instead of its content. |
| **False dichotomy** | "Either X or Y" — when in reality there are other options. |
| **Equivocation** | Same word used with two different meanings in the same argument. |
| **Survivorship / selection bias** | Drawing conclusions from a non-random sample (only the successful ones got measured). |
| **Base-rate neglect** | Ignoring the underlying frequency. P(success \\| dropout) means nothing without P(success \\| graduate). |

The GMAT will not name the fallacy. It will *describe* it in abstract language ("draws a general conclusion from a sample that may not be representative"). Your job is to map the description back to the fallacy you spotted.

## Practice

\`\`\`excel-quiz
q: A new study found that employees who eat breakfast at the company cafeteria are 23% more productive than those who skip breakfast. The company concludes that providing free breakfast would raise overall productivity. Which assumption is the argument MOST dependent on?
options: Employees who eat at the cafeteria are not already more productive types | The cafeteria food is nutritionally superior to alternatives | Free breakfast is cheaper than the productivity gain it produces | Most employees do not currently eat breakfast elsewhere | Productivity is the company's primary metric of success
correct: 0
explain: This is a classic correlation-vs-causation argument. The conclusion assumes eating cafeteria breakfast CAUSES higher productivity. But it could be that high-productivity types are simply more likely to come in early enough to use the cafeteria — selection. (A) explicitly rules out that alternative explanation. Run the negate test: "Employees who eat at the cafeteria ARE already more productive types." The argument collapses entirely. That confirms (A). (B) and (D) are tempting strengtheners but not required. (C) is a separate cost question. (E) is out of scope. Answer (A).
\`\`\`

\`\`\`excel-quiz
q: Critics of the city's new bike-share program point out that fewer than 3% of residents have used it. The program manager responds that ridership grew 400% in the second year and projects continued growth. Which of the following, if true, would MOST WEAKEN the manager's projection?
options: Most bike-share users in other cities are tourists, not residents | The 400% growth came from a base of only 200 first-year riders | The city has invested $14M in bike infrastructure | A new subway line opens next year along the most popular bike-share route | Bike-share programs in colder climates show seasonal usage swings
correct: 3
explain: The manager's projection rests on the assumption that whatever caused year-two growth will continue. (D) introduces an alternative — a new subway along the most-used route directly substitutes for the bike-share's most popular use case. That breaks the projection's foundation. (B) is a real concern but the question asks about *projected growth*, not whether 400% is impressive. (A) is irrelevant to residents specifically. (C) is a sunk-cost issue, not a growth issue. (E) is too general — without knowing the city's climate, it doesn't bite. Answer (D). Weaken questions reward you for finding the *specific alternative cause* that breaks the chain.
\`\`\`

\`\`\`excel-quiz
q: Most successful tech CEOs were college dropouts. Therefore, dropping out of college is a good career strategy. Which of the following best identifies the flaw in this argument?
options: It assumes correlation implies causation | It draws a general conclusion from a biased sample of high-profile cases | It ignores the base rate of dropouts who do not become CEOs | It conflates "tech CEO" with "successful" | More than one of the above
correct: 4
explain: This argument is genuinely sloppy on multiple axes. (B) selection bias — we hear about Zuckerberg and Gates, not the millions of dropouts who didn't make it. (C) base-rate neglect — the right comparison isn't "what fraction of CEOs dropped out" but "P(success | dropout) vs P(success | graduate)." Both flaws are real and compounding. The GMAT loves "more than one of the above" answers when the argument layers multiple errors. Answer (E). When two answer choices both feel correct, re-read the stem — sometimes the test is acknowledging a multi-layered failure.
\`\`\`

\`\`\`excel-quiz
q: A pharmaceutical company's new drug reduced cholesterol in 87% of trial participants. The trial enrolled 1,200 patients across 6 sites. Therefore, the drug is effective for the general population. Which question would be MOST useful to evaluate the conclusion?
options: What was the cost per patient of the trial? | Were the trial participants representative of the general population on relevant characteristics? | How long did the trial last? | What was the placebo effect rate? | Did the 13% who did not respond have any adverse reactions?
correct: 1
explain: Evaluate questions work by variance: would different answers change the conclusion? (B) if YES (representative) — conclusion stands. If NO (e.g., trial enrolled only patients already on diet/exercise programs) — conclusion collapses. Maximum variance. (D) is plausible but a strong placebo response wouldn't necessarily invalidate the 87% — it would just question the mechanism. (C) and (E) are interesting but secondary. (A) is irrelevant to effectiveness. Answer (B). On every evaluate question, ask: "if I get yes vs no on this, does the argument move?"
\`\`\`

\`\`\`excel-quiz
q: A regional newspaper's circulation has dropped 40% over the last decade, yet its advertising revenue has held steady. Which of the following best explains the apparent discrepancy?
options: The newspaper has expanded its digital presence, where ad rates are similar to print | Advertising rates per reader have risen because the remaining subscribers are wealthier and more attractive to advertisers | The newspaper has reduced its publication frequency to cut costs | A major competitor newspaper shut down five years ago | Subscription prices have risen sharply over the same period
correct: 1
explain: The paradox: readers down 40%, ad revenue flat. To resolve, find something that makes "fewer readers" compatible with "same revenue." (B) does it cleanly — if each remaining reader is now worth ~67% more to advertisers (because they're a premium demographic), the math works out. (A) only resolves the paradox if you assume digital readers were not in the original circulation count — ambiguous. (C) explains cost, not revenue. (D) might explain why the *rest* of the readership is loyal, but doesn't explain revenue. (E) is about subscription, not ad revenue. Answer (B). Paradox questions reward the choice that resolves both sides of the contradiction simultaneously.
\`\`\`

\`\`\`excel-quiz
q: All software engineers who use static-typed languages produce fewer runtime bugs than those who use dynamically-typed languages. Maria is a software engineer. She produces few runtime bugs. Therefore, Maria uses a static-typed language. Which of the following MUST be true based on the passage?
options: Maria does not use a dynamically-typed language | Some dynamically-typed-language engineers produce many runtime bugs | The average static-typed-language engineer produces fewer bugs than the average dynamically-typed-language engineer | Maria's bug count is below average | Static-typed languages are objectively better
correct: 2
explain: Inference questions ask what MUST follow — not what the author concluded. The author's conclusion ("Maria uses static") is itself a logical error (affirming the consequent — Maria could produce few bugs for many reasons). So the conclusion is not "must be true." What MUST be true from the premise "All static-typed-language engineers produce fewer runtime bugs than dynamically-typed-language ones"? That static-typed-language engineers as a group produce fewer bugs than dynamically-typed-language ones — i.e., (C), which is essentially the premise restated. (A) and (D) overreach. (B) is not stated. (E) is a value judgment. Answer (C). The classic inference trap: confusing what the AUTHOR concluded with what MUST follow.
\`\`\`

\`\`\`excel-quiz
q: A startup founder argues: "Our competitor's app has 10 million users. They charge $5/month. So they are making $50M/month in revenue." The flaw in this reasoning is that it assumes:
options: All users are willing to pay the monthly fee | The competitor reports its revenue accurately | All 10 million users are paying subscribers | Monthly revenue is calculated correctly | The competitor's pricing has not changed recently
correct: 2
explain: Most apps with "10 million users" have a tiny paying fraction. Conflating users with paying subscribers is the unstated assumption. (C) names it directly. (A) is in the right direction but vaguer; the real flaw isn't "willing to pay" but "actually paying" — many users may have signed up under a free tier and never even been asked. (B), (D), (E) are unrelated. Answer (C). Flaw questions reward the precise diagnosis — "users" vs "paying users" is exactly the kind of conflation the test loves.
\`\`\`

## What you can do now

- Identify the archetype of any CR question from the stem in five seconds
- Run the negate test on assumption questions
- Distinguish *strengthen / weaken / assumption* from one another (they look similar; the right answer differs)
- Name the seven canonical fallacies the test recycles on flaw questions
- Stop mistaking *what the author concluded* for *what must be true* on inference questions

Next: **Reading Comprehension** — the section most candidates fear, attacked with structure instead of memorization.
`;

export const GMAT_L9 = `# Reading Comprehension — speed without skimping

Most candidates dread RC because they read for *content*. The GMAT tests *structure*. That single shift — from "what does the passage say" to "how is the passage organized" — converts a feared section into a tractable one.

You don't have time to deeply absorb every sentence. A 350-word science passage at 7 minutes total (read + answer 3 questions) gives you about 2-3 minutes of reading. That's roughly 110 words/minute *with comprehension* — half your normal pace. Reading slower than that, you'll run out of time. Reading faster than that, you'll miss the structure. The solution isn't to read faster — it's to read *differently*.

## The four RC question types

| Type | Stem signal | How to attack |
|------|-------------|---------------|
| **Main idea / Primary purpose** | "The author's primary purpose is", "best summarizes the passage" | Live in the first and last sentences; pick the choice that captures *scope* without overreach |
| **Detail / Specific fact** | "According to the passage", "The author states that" | Go back and find the line — don't trust memory |
| **Inference** | "The passage implies / suggests", "the author would most likely agree" | One step beyond what's stated, but no further |
| **Attitude / Tone** | "The author's attitude toward X is best described as" | Look for evaluative words ("unfortunately", "remarkably", "yet"); ignore content |

About 40% of RC questions are details — easy if you know the technique below. About 30% are inference. About 20% main-idea. About 10% tone/structure.

## The argument-mapping technique

Don't read the passage. **Map** it.

1. **Read paragraph 1 carefully** — 60-90 seconds. This sets up the topic, the author's stance, and the structure of what follows.
2. For **each subsequent paragraph**, spend 20-30 seconds asking *one question:* "What role does this paragraph play in the argument?" Possible answers:
   - Introduces evidence for the main claim
   - Presents a counter-argument
   - Concedes a limitation
   - Provides historical context
   - Offers a competing theory
3. **Write a one-line tag** next to each paragraph in your scratch. Something like:
   - P1: Topic + author's claim — gene editing is closer than people think
   - P2: Counter — critics raise ethics concerns
   - P3: Author's rebuttal — concerns overblown for somatic edits
   - P4: Hedged conclusion — germline still controversial
4. **Now you have a map.** When a question asks "what's the primary purpose," you read your tags, not the passage.

This is the single biggest unlock in RC. You're not reading less — you're reading *for a different signal*.

## The structural signposts

The GMAT writes its passages with obvious transition words. Train yourself to slow down at:

| Word | Signal |
|------|--------|
| **However / Yet / But** | Author is about to disagree with what came before |
| **Therefore / Thus / Hence** | A conclusion is being drawn |
| **Despite / Although / While** | A concession is being made |
| **For example / For instance** | Detail, usually skippable on first pass |
| **In contrast / Conversely** | Comparison being drawn |
| **Notably / Significantly** | The author is flagging *their* emphasis |

These words tell you where the argument is going. A single \`however\` mid-passage often signals the most important sentence in the entire piece.

> **High-scorer technique — first-and-last.** In any RC passage, the *primary purpose* almost always lives in the first paragraph's last sentence, the last paragraph's first sentence, or both. If you only had time to read two sentences, those are the two. Most main-idea questions can be answered from these alone.

## Topic types you'll see

| Topic | Frequency | What to expect |
|-------|-----------|----------------|
| **Science** (biology, physics, astronomy) | ~30% | Dense, jargon-heavy, but well-structured. The structure is your friend; ignore the technical terms. |
| **Humanities** (art, literature, history) | ~25% | Author has a clear opinion. Find it. |
| **Social science** (economics, sociology) | ~25% | Often "competing theories." Map who said what. |
| **Business** (management, finance) | ~20% | Familiar territory for most candidates. Don't get lazy — the test loves traps in this area. |

You don't need domain knowledge for any of them. In fact, *prior knowledge can hurt* — the passage's claims may contradict what you "know," and you'll pick the answer that matches reality instead of the passage. Trust the text, not your background.

## The four wrong-answer patterns in RC

This is what every RC trap looks like, in priority order:

| Pattern | What it sounds like |
|---------|---------------------|
| **Extreme language** | "always", "never", "all", "none", "must" — the passage rarely supports universal claims |
| **Out of scope** | Introduces a topic the passage didn't address |
| **Half-right** | Correct on the first half, wrong on the second (or vice versa) — the trap that gets the most candidates |
| **Opposite** | Says the *reverse* of what the passage says — the classic "I misread one word" trap |

Train yourself to read every answer choice with these four traps in mind. The right answer is almost always *understated* — it says less than you think it should.

## Practice — a science passage

\`\`\`java-quiz
q: The primary purpose of the passage is to:
code: |
  PASSAGE (full):

  For decades, neuroscientists assumed that adult brains do not generate new
  neurons — a doctrine known as the "no new neurons" rule. In the 1990s,
  research by Elizabeth Gould and others provided evidence of adult
  neurogenesis in the hippocampus, the brain's memory center. Critics
  initially dismissed the findings, citing methodological concerns about the
  thymidine analog used to label new cells.

  Yet by the 2000s, multiple independent labs had replicated the result using
  different techniques, including post-mortem carbon-14 dating that traced
  the birth dates of individual neurons. The consensus shifted. Today, adult
  hippocampal neurogenesis is broadly accepted, though estimates of its rate
  vary widely — from 700 new neurons per day to nearly zero, depending on
  which study one cites.

  This uncertainty has practical consequences. If neurogenesis is robust,
  therapies that stimulate it could address depression and cognitive decline.
  If it is negligible, decades of related research may need to be reframed.
  The methodological debate, in other words, is not academic.
options: refute the "no new neurons" doctrine | summarize the history of a scientific controversy and explain its stakes | propose a new therapy based on neurogenesis research | argue that recent studies have settled the debate about adult neurogenesis | criticize the methodology of early neurogenesis research
correct: 1
explain: Map the structure: P1 sets up the old doctrine and the early challenge. P2 traces how the consensus shifted. P3 names the remaining uncertainty AND why it matters. That's a *summary plus stakes* structure — exactly (B). (A) is what the AUTHOR'S CITED SCIENTISTS did, not what the passage does. (C) is out of scope — no therapy is proposed. (D) is opposite — the passage says estimates "vary widely" and the debate is unsettled. (E) is half-right — the methodology critique is mentioned but isn't the passage's purpose. Answer (B). Primary-purpose questions reward the choice that captures both *what's covered* and *why it matters*, without overreach.
\`\`\`

\`\`\`java-quiz
q: According to the passage, which of the following is true about the carbon-14 dating method?
code: |
  (Same passage as above.)
options: It was the original method used to discover adult neurogenesis | It produced estimates of about 700 new neurons per day | It was used to replicate earlier findings using a different technique | It has resolved the debate about the rate of adult neurogenesis | It was criticized for methodological flaws
correct: 2
explain: This is a detail question — go back to the passage. The text says "multiple independent labs had replicated the result using different techniques, INCLUDING post-mortem carbon-14 dating." (C) matches exactly. (A) is wrong — the thymidine analog was the original (P1). (B) — 700/day is *one* estimate's number but the passage doesn't attribute it to carbon-14. (D) — opposite; the debate persists. (E) — the THYMIDINE method was criticized, not carbon-14. Answer (C). Detail questions punish memory; reward returning to the text.
\`\`\`

\`\`\`java-quiz
q: The author's attitude toward the current state of adult neurogenesis research is best described as:
code: |
  (Same passage as above.)
options: dismissive | enthusiastic | skeptical of all findings | engaged but cautious | hostile to the original "no new neurons" doctrine
correct: 3
explain: Attitude questions reward tracking evaluative words. P3 uses "uncertainty has practical consequences" and "not academic" — the author cares, takes it seriously, but acknowledges the open questions. That's "engaged but cautious." (A) and (E) are too negative. (B) overshoots — there's no celebration. (C) is too strong — the author accepts the consensus shift, just not the rate. Answer (D). On tone questions, the right answer is almost always more moderate than the extreme-sounding options.
\`\`\`

## Practice — a business passage

\`\`\`java-quiz
q: The author's primary purpose in the passage is to:
code: |
  PASSAGE EXCERPT (paragraph 2 of 3):

  Critics of the new monetary policy point to historical examples of similar
  interventions that led to inflation. Yet these critics overlook a critical
  factor: today's globalized supply chains absorb price pressure in ways
  that closed economies of the past could not. The Federal Reserve has
  tools its predecessors lacked, and the structural differences merit a
  fresh analysis, not reflexive comparison to the 1970s.
options: refute a historical claim about inflation | compare two economic eras | defend a controversial monetary policy on its merits | introduce a counter-argument to the critics' position | resolve a paradox in macroeconomic theory
correct: 3
explain: The paragraph's structure is "critics say X — BUT they overlook Y — SO we should think fresh." That's a counter-argument structure (against the critics' historical analogy). It is NOT defending the policy directly — the author argues the critics are wrong, not that the policy is right. It is NOT comparing eras — it's saying the eras are NOT comparable. The trap is (C): tempting, but the paragraph defends a fresh ANALYSIS, not the policy itself. Answer (D). When you see "Yet / However / But" mid-paragraph, the author is signaling a counter-argument structure ~80% of the time.
\`\`\`

\`\`\`java-quiz
q: It can be inferred from the passage that the author would most likely agree with which of the following?
code: |
  (Same business passage as above.)
options: The monetary policy is certain to avoid inflation | Historical analogies are useless in economic analysis | The Federal Reserve has unlimited tools to manage inflation | Differences in economic structure between eras affect what historical comparisons can teach | The 1970s should not be studied at all by modern economists
correct: 3
explain: Inference: one step beyond what's stated, no further. The author argues that "structural differences merit a fresh analysis." (D) restates this in inference form. (A) overreaches — author says critics are wrong, not that inflation is impossible. (B) extreme — author criticizes a SPECIFIC historical comparison, not all historical analysis. (C) extreme — "unlimited" is unsupported. (E) extreme — the issue is "reflexive" comparison, not all study. Answer (D). On inference questions, extreme language is almost always wrong.
\`\`\`

\`\`\`java-quiz
q: A short passage from a humanities essay reads: "The Romantic painters rejected the Enlightenment's faith in reason. Yet their rejection was itself a deeply rational act — a calculated repositioning of art as a counterweight to industrial rationalism." The most likely purpose of the word "Yet" in the second sentence is to:
code: |
  (Inline excerpt above.)
options: introduce a chronological shift | signal a contrast with the immediately preceding claim | introduce a digression | concede the validity of the Enlightenment | summarize the Romantics' philosophy
correct: 1
explain: The first sentence: Romantics REJECTED reason. The second: their rejection was itself RATIONAL. That's a direct contrast — "Yet" pivots from "they rejected X" to "they used X to do so." (A) is wrong — no time shift. (C) is wrong — the second sentence develops the argument, not digresses. (D) is wrong — the author isn't conceding the Enlightenment's value, just noting a structural irony. (E) is wrong — one sentence isn't a summary. Answer (B). "Yet" / "However" / "But" almost always signal contrast with the immediately preceding statement.
\`\`\`

## What you can do now

- Map a passage by paragraph role instead of reading every sentence equally
- Read first-and-last sentences as the highest-information real estate
- Spot the four wrong-answer patterns (extreme, out-of-scope, half-right, opposite) on every choice
- Distinguish the four question types and switch attack mode accordingly
- Resist filling in your own knowledge — trust the passage

Next: **test-day strategy** — converting everything you've learned into a score.
`;

export const GMAT_L10 = `# Test Day Strategy & the Wrong-Answer Journal

You've done the content. You know quant. You know the eight CR archetypes. You've mapped a hundred RC passages. The last lesson is about the part most candidates underprepare for: **showing up.** Test day is its own skill, and even strong candidates lose 30-50 points to avoidable execution errors.

This lesson covers (1) the 24 hours before the test, (2) pacing under pressure, (3) the CAT mechanic on the Focus Edition, and (4) the single highest-ROI study practice — the wrong-answer journal.

## The night before

Do **not** study new material. If you don't know it by now, you won't learn it tonight, and trying to will erode your sleep and your confidence. Acceptable activities:

- A light review of your wrong-answer journal (15-30 minutes max)
- Re-reading the eight CR archetypes
- Looking at your pacing benchmarks

Unacceptable activities:

- A full practice test
- Cramming new formulas
- Reading forum threads about the test

**Eat dinner like a normal evening.** No experimental food. Hydrate normally. Lay out clothes, ID, water bottle, snacks. Set two alarms. Sleep eight hours if you can — six minimum.

## The morning of

- **Calories.** You're running a 2-hour cognitive marathon. Eat protein + complex carbs. Skip sugary breakfast — the crash hits 90 minutes in, right when you're starting Verbal.
- **Light cardio.** A 15-minute walk raises your heart rate and clears mental fog. Not a workout — a walk.
- **Arrive 30 minutes early.** Not 60 (too much sitting around). Not 10 (cortisol spike). Thirty minutes is the right buffer for parking, check-in, and one bathroom visit.
- **Bring water and a small snack** for the optional 10-minute break.

## The first five minutes of each section

A slow read of the first question is **investment, not lost time**. The first question on the Focus Edition is weighted heavily by the adaptive algorithm — it sets your starting difficulty band. Spend an extra 20 seconds. Get it right.

After the first question, settle into your pace.

## Pacing benchmarks

| Section | Total time | Questions | Per question |
|---------|-----------|-----------|--------------|
| **Data Insights** | 45 min | 20 | ~2:15 |
| **Quantitative** | 45 min | 21 | ~2:08 |
| **Verbal** | 45 min | 23 | ~1:55 |

**Pacing rules:**

- If a question goes 30 seconds over its budget, **flag and move**. The Focus Edition lets you return.
- Missing one question by 30 seconds is much better than missing five in a panic at the end.
- At the section midpoint, do a time check. If you're 2 minutes behind, **the next 5 questions get a shorter budget** — don't try to make it up on one.
- Save the last 2 minutes for flagged questions. *Don't* just bulk-answer the unanswered ones — go back to your flagged ones in order of "most likely to gain a point from extra time."

## The CAT mechanic (Focus Edition)

The GMAT Focus Edition is **section-adaptive with review**. Inside a section, the test serves harder questions if you're doing well, easier ones if you're not. Your score depends on the *difficulty* of the questions you got right, not just the count.

**Critical difference from the old GMAT:** the Focus Edition allows you to **review and change up to three answers per section** before submitting. This changes strategy:

- **Flag any question** you're not 90%+ confident on. Move on.
- At the end of the section, return to your flagged questions in order.
- **Change an answer only if** you have new information from a *specific* re-read — never on a vibe.

The "harder if you do well" mechanic means:

- Don't panic if questions feel hard — that's a *good* sign.
- Don't celebrate if questions feel easy — that's a *bad* sign.
- The candidate scoring 745 thinks the test is brutal. The candidate scoring 545 thinks it was "not bad." Calibrate accordingly.

> **High-scorer technique — the flag budget.** Decide in advance how many questions you'll let yourself flag per section (3-5 is a good range). When you hit the cap, you *must* commit on subsequent questions. This prevents the trap of flagging everything and panicking in review.

## The wrong-answer journal

If you take only one practice from this entire course, take this one.

For *every* question you get wrong (and every question you got right but weren't sure about), write four things:

| Field | What goes in it |
|-------|-----------------|
| **The trap** | What did the wrong answer choice *look like* that made me pick it? What pattern did the test exploit? |
| **My decision process** | What did I actually think when I chose? Where did I go wrong — the read, the setup, the math, the elimination? |
| **The actual reasoning** | What's the right way to solve this? Walk through it in 3-4 sentences. |
| **The pattern to remember** | One sentence — the rule, archetype, or trap to internalize. |

A template:

\`\`\`
Q23 (Data Sufficiency, geometry, hard)
Trap: I picked C (both needed) because each statement alone "didn't feel like enough."
Decision: I didn't actually test whether (1) alone fully determined the angle.
Reasoning: Statement (1) says the triangle is isoceles AND gives one angle. With
  isoceles + one angle, all three angles are determined. (1) alone is sufficient.
  The right answer is A.
Pattern: On DS, "doesn't feel like enough" is not a test. Run the actual logic.
\`\`\`

**Review the journal weekly.** After 4-6 weeks, you'll notice patterns — *you always pick the wrong answer when there's a "Yet" mid-paragraph*; *you always rush DS statement (2) because you're tired*; *you always miss percent-change problems with negative bases*. Those patterns are gold. They're the specific corrections that move your score, not generic studying.

> **Mental model — a wrong answer is information, not a verdict.** Every wrong answer in practice tells you a specific thing about how the test is built and how your brain reacts under pressure. The candidate who treats wrong answers as data outscores the one who treats them as failures. Always.

## Score targets and recovery

You will have a section that goes badly. Maybe the first 5 questions felt hard and you panicked. Maybe you blanked on a formula. **The most important skill on test day is recovering from a bad stretch without spiraling.** A 30-second reset between questions — close your eyes, breathe, remind yourself "next question is independent" — buys back more points than any content review.

The candidates who score in the top decile aren't necessarily the smartest. They're the most *composed*. Composure is a trainable skill — every practice test is reps.

## Diagnostic practice

These problems are framed as test-day diagnostics: would you flag, commit, or skip?

\`\`\`excel-quiz
q: You're 18 minutes into the Verbal section, halfway through the question count, and the clock shows 27 minutes remaining. A Critical Reasoning question is taking you 2:45 with no clear answer between two choices. What's the right move?
options: Take another 30 seconds — you're so close | Commit to your best guess and flag for review | Skip without answering and return at the end | Eliminate the two unlikely choices and guess between the remaining four | Pick the longest answer (statistically more likely on hard questions)
correct: 1
explain: You're already 45 seconds over budget. You're at the midpoint with no time buffer. The Focus Edition lets you flag and return — use it. Commit to your best guess (you're between two choices, so it's a coin flip with information), flag, move on. (A) is the trap — "so close" is what gets you in trouble. (C) — you cannot skip without answering on the GMAT; everything must be answered before submitting. (D) doesn't apply — you've already narrowed to two. (E) is the kind of folklore that costs people points. Answer (B). The right execution is "guess from your narrowed set, flag, move."
\`\`\`

\`\`\`excel-quiz
q: On the Data Insights section, you encounter a Multi-Source Reasoning prompt with three tabs of data. The first question takes you 3:20 because you had to read all three tabs. The remaining 2 questions on the same prompt should take approximately:
options: 3 minutes each, since they share the same complex setup | About 1 minute each, since the setup work is already done | The same 2:15 average as any other DI question | At least 2:30 each, since they reference the data | Skip them — the setup cost is too high
correct: 1
explain: The setup cost (reading all three tabs) is sunk for questions 2 and 3 on the same prompt. They will mostly require *lookups* in the data you already understand — much faster. Plan to make up the time deficit here. Many candidates panic after the slow Q1 and rush Q2/Q3, missing easy points. (A) and (D) overshoot. (C) ignores that setup time is amortized. (E) is the worst — Multi-Source questions have the *highest reward-per-second* ratio AFTER the setup. Answer (B). Strategically, Multi-Source prompts are "spend up front, harvest after."
\`\`\`

\`\`\`excel-quiz
q: You finish the Quant section with 4 minutes remaining and 3 flagged questions. The optimal use of those 4 minutes is to:
options: Re-attempt all 3 flagged questions equally | Recheck the question you were LEAST confident on first | Recheck the question you were MOST confident on first | Spend all 4 minutes on the hardest flagged question | Submit early to save mental energy for Verbal
correct: 1
explain: Diminishing returns — you can change at most 3 answers, but the change has to be informed. The flagged question where you're LEAST confident is the one where any new insight has the biggest expected value (you're closer to a coin flip — even a small new observation flips the answer). Starting with most-confident wastes time on questions you'd likely keep anyway. (A) splits time too thin. (D) puts all your eggs in one basket. (E) — Verbal energy is real but 4 minutes of recovery in the break is more efficient than skipping review. Answer (B). Review highest-EV-per-minute first, always.
\`\`\`

\`\`\`excel-quiz
q: It's the morning of the test and you wake up at 6 AM for an 8 AM exam. Your normal coffee makes you jittery on test days. The right choice is:
options: Drink your normal coffee — consistency matters | Skip coffee entirely — caffeine adds anxiety | Drink half your normal amount | Switch to green tea for moderate caffeine | Take a caffeine pill for precise dosing
correct: 2
explain: Total novelty (skipping coffee if you normally drink it) introduces withdrawal headache risk and breaks routine. Total normalcy (full dose) adds jitter you've already identified as a problem. Half-dose is the calibrated answer — caffeine without overshoot. (B) is the wrong direction if you normally drink coffee. (D) introduces a novel substance on the worst possible day — never experiment on test day. (E) — same problem; if you haven't taken caffeine pills before in practice, today isn't the day. Answer (C). Test day rule: dial the *intensity* of your normal routine, never substitute the *substance* of it.
\`\`\`

\`\`\`excel-quiz
q: You finish your test and the screen displays a score lower than your practice average. Your first action should be to:
options: Cancel the score immediately — never let a bad result on record | Accept the score and analyze what went wrong on the way home | Decide based on whether you have the option to retake and the timeline of your application | Argue with the test center about technical issues | Schedule a retake on the spot for the next available date
correct: 2
explain: Score cancel/accept decisions depend on your application timeline, target programs' score policies, and how many retakes you've already used. Some programs only see your highest score; others see all. Some give you a window to cancel later (24-hour review). Reflexive cancellation can hurt — a "below-average" score can still be in the target band for many programs. Conversely, accepting a score significantly below target may not serve you either. (A) and (E) are reflexive. (B) avoids the strategic question. (D) is unhelpful unless there really was a technical issue. Answer (C). The right framing: this is a strategic decision about your application, not an emotional one about your performance.
\`\`\`

## What you can do now

- Execute the night-before and morning-of routines without improvising
- Hold a pacing budget under pressure and recover from time loss
- Use the flag-and-return mechanic the Focus Edition gives you
- Keep a wrong-answer journal that compounds over weeks
- Treat a hard-feeling test as a *signal of good performance*, not a verdict

## The whole course

| Lesson | Focus |
|--------|-------|
| 1-2 | Overview + the right mindsets |
| 3-4 | Data Insights — graphs, tables, multi-source |
| 5-7 | Quant — arithmetic, algebra, geometry, DS |
| 8 | Critical Reasoning — the eight archetypes |
| 9 | Reading Comprehension — structure over content |
| 10 | Test day + the wrong-answer journal |

You have the content. You have the strategy. You have the journal. The rest is practice tests, calibrated review, and showing up rested. The test does not reward the candidate who studied longest. It rewards the one who studied *correctly* and arrived *composed*.

Good luck. And remember: a wrong answer is information, not a verdict.
`;
