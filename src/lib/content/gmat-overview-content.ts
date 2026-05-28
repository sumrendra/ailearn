/* eslint-disable no-irregular-whitespace */
/**
 * GMAT Prep — overview, foundations, and section mindsets.
 *
 * Audience: working professionals preparing for MBA applications, studying in
 * 40-60 minute evening sessions. Sophisticated readers — no cheerleading.
 *
 * Curriculum (this file: lessons 1-4 of 10):
 *   1. GMAT 101 — what the test is, how scoring works
 *   2. The Quant Mindset — pattern recognition over computation
 *   3. The Verbal Mindset — read like a logician
 *   4. Data Insights — the new section nobody knows how to study
 *
 * Lessons 5-10 (Arithmetic, Algebra, Geometry, CR, RC, Test Day) live in
 * sibling files authored separately.
 */

export const GMAT_L1 = `# What the GMAT actually is (and isn't)

The GMAT you are studying for is almost certainly **not** the GMAT your manager took. In late 2023, GMAC retired the old format and replaced it with the **GMAT Focus Edition** — shorter, three sections, no essay, no Sentence Correction. If a prep book on your shelf was published before 2024, half of its strategy advice is now obsolete.

This lesson is the orientation. By the end you'll know exactly what the test measures, what a "good" score looks like by school tier, and — most importantly — the central thesis that the rest of this course is built on.

## The Focus Edition at a glance

Three sections, 45 minutes each, taken in any order you choose. Total seat time: about 2 hours 15 minutes including the optional break.

| Section | Questions | Time | What it measures |
|---------|-----------|------|------------------|
| **Quantitative Reasoning** | 21 | 45 min | Problem-solving with arithmetic, algebra, word problems. No geometry. |
| **Verbal Reasoning** | 23 | 45 min | Critical Reasoning + Reading Comprehension. **No Sentence Correction.** |
| **Data Insights** | 20 | 45 min | The new section. Data Sufficiency + four multi-format question types. |

Each section is **computer-adaptive at the question level** — get one right and the next is harder; get one wrong and the next is easier. The adaptive engine is also why you can no longer skip questions and come back: in the Focus Edition you may bookmark and revisit up to 3 questions per section at the end, but you cannot leave anything blank.

## Scoring — the numbers that matter

Two numbers come back:

- **Section scores**: 60-90 per section, in 1-point increments
- **Total score**: 205-805, in 10-point increments

A 645 today is roughly equivalent to a 700 on the old GMAT. The conversion isn't linear, and **comparing Focus scores to legacy scores is the single most common mistake applicants make**. When a school's website says "average GMAT 720" and the year is 2026, check whether they're reporting legacy, Focus, or a blended cohort.

Rough targets by school tier:

| Tier | Focus Edition target |
|------|-----------------------|
| M7 (HBS, Stanford, Wharton, Booth, Kellogg, MIT, Columbia) | 685+ |
| Top 15 | 645+ |
| Top 30 | 595+ |
| Solid placement | 555+ |

These are 80th-percentile-of-admits numbers, not floors. People get into HBS with 605s; they just don't get in *because* of the 605.

## The thesis of this course

Here is the single most important thing to internalize before you start grinding problems:

> **The GMAT is not a math test or a reading test. It is a pattern-recognition test with a stopwatch.**

The arithmetic on the quant section caps out at about pre-calculus level. The reading passages are shorter than a Wall Street Journal article. The test is hard not because the *content* is hard but because:

1. Every question is engineered to have a "trap answer" that's obvious if you don't read carefully
2. Every question rewards spotting the structure of the problem in 15 seconds and ignoring it in 90 if you can't
3. You have **roughly 2 minutes per question** with no calculator on quant

A strong test-taker isn't computing faster than a weak one. They're recognizing what type of problem they're looking at and applying a memorized approach. Lessons 2, 3, and 4 are about building that recognition for each section.

## What NOT to do (the anti-patterns)

Most of what self-studiers do wrong falls into three buckets:

> **Trap: grinding problems without analyzing them.** Doing 500 OG problems with the answer key open and feeling "studied" is the most common form of fake progress. The value is in the post-mortem — *why* was the trap answer tempting, *what* did you almost do — not in the rep count. Aim for 50 problems analyzed deeply, not 500 solved quickly.

> **Trap: memorizing formulas you won't recall under stress.** If you can't write down the formula for the volume of a sphere right now without thinking, don't bother memorizing it for the test. The GMAT rarely needs obscure formulas; it needs the four or five you'll use a hundred times. Focus there.

> **Trap: taking an official practice test in week one.** The two official Focus mocks are precious — there are only six of them total. Burning one before you know the strategy gives you a baseline score that says nothing about your ceiling. Take your first mock in week three at the earliest, after you've worked through the section mindsets.

## A suggested 8-week plan

Most working professionals can prep in 8 weeks at 8-12 hours/week. Adjust if your target is 685+ (add 2-4 weeks) or your starting diagnostic is below 500 (add 4-6 weeks).

\`\`\`
Week 1  ──  Foundations + diagnostic (free GMAC mini-quiz)
Week 2  ──  Quant: arithmetic, number properties
Week 3  ──  Quant: algebra, word problems  +  Official Mock #1
Week 4  ──  Verbal: Critical Reasoning
Week 5  ──  Verbal: Reading Comprehension  +  Official Mock #2
Week 6  ──  Data Insights: DS + Two-Part Analysis
Week 7  ──  Data Insights: MSR + Graphics + Table  +  Mock #3
Week 8  ──  Targeted review of weakest area, test-day rehearsal, Mock #4
\`\`\`

Notice what's not on the plan: a week dedicated to "memorizing formulas," a separate "essay prep" block (no essay in Focus Edition), or an early flood of full-length mocks.

## A short check-in

Before lesson 2 — make sure the basics actually landed.

\`\`\`excel-quiz
q: You are scheduling your GMAT and need to decide section order. Which constraint is true under the Focus Edition?
options: You must take Quant first, then Verbal, then Data Insights | You may take the three sections in any order you choose | You must take Data Insights last because it's the longest | The order is randomized by the test center
correct: 1
explain: Focus Edition lets you choose any order at the test center. Most high-scorers lead with their strongest section to build a buffer of correct early answers (the adaptive algorithm weights early questions slightly more), then save their weakest for last when they're still mentally fresh enough to handle it.
\`\`\`

\`\`\`excel-quiz
q: Which of the following is NO LONGER part of the GMAT under the Focus Edition?
options: Critical Reasoning | Reading Comprehension | Data Sufficiency | Sentence Correction | Problem Solving
correct: 3
explain: Sentence Correction was removed when the Focus Edition launched. If a prep resource is still drilling SC patterns, it's outdated. Data Sufficiency survived — it moved from the Quant section into Data Insights.
\`\`\`

\`\`\`excel-quiz
q: A friend tells you their GMAT score was a 720. They took the test in 2022. What is the most accurate response?
options: That's roughly equivalent to a 720 on the Focus Edition | That's roughly equivalent to a 665 on the Focus Edition | That's roughly equivalent to a 605 on the Focus Edition | Focus and legacy scores are not directly comparable; 720 legacy maps to roughly the same percentile as a 685 Focus
correct: 3
explain: The right framing is percentile, not point-for-point conversion. A legacy 720 was around the 94th percentile; a Focus 685 is around the same percentile. Schools that report blended averages are mixing these silently — be careful when benchmarking.
\`\`\`

\`\`\`excel-quiz
q: You finish your first 60-minute study session and feel productive because you solved 45 quant questions and got 38 right. Which assessment is most accurate?
options: Excellent rate — keep this pace | Solid accuracy; just add more volume next session | Almost certainly fake progress — you weren't analyzing, you were grinding | The rate is fine but you should have done timed sections instead
correct: 2
explain: 45 problems in 60 minutes is 80 seconds per problem with no analysis time. You can't have understood why each wrong answer was wrong or what the trap was. The GMAT rewards depth of post-mortem; this session built almost no transferable skill. The same hour spent on 12 problems, fully analyzed, would have been worth far more.
\`\`\`

## Where this leaves you

You know the format, the scoring, and the strategic posture: pattern recognition beats computation, depth beats volume, and the central question for every problem is "what *type* of problem is this?" rather than "what's the answer?"

Lessons 2, 3, and 4 build that recognition for each of the three sections in turn. Lesson 2 — the Quant Mindset — is next.
`;

export const GMAT_L2 = `# The Quant Mindset: Pattern recognition over computation

Look at a 700-level GMAT quant problem and time yourself solving it by brute algebra. You'll usually finish in three to four minutes. You have two. The test isn't asking whether you *can* solve it — it's asking whether you can spot a shortcut that turns four minutes into ninety seconds.

This is the single insight that separates the 80th-percentile quant scorer from the 95th:

> **The GMAT rewards spotting the structure of a problem, not grinding the arithmetic of one.**

This lesson is about the four mindset shifts and the trap catalog that, together, account for the majority of quant points left on the table by smart test-takers.

## Shift 1: Number sense

Before you compute anything, estimate the answer's order of magnitude. If a problem asks for the value of an expression and the answer choices are 0.03, 0.3, 3, 30, and 300, you've cut your work in half by knowing it's "around 3" — you don't need to compute precisely.

Number sense also catches stupid errors. If you compute that a 12% discount on a $200 item gives a final price of $238, your number sense should scream before your pencil writes the next line. The GMAT loves to put answer choices that match common errors (forgetting to subtract from 100%, doubling instead of halving). Estimation kills these on contact.

> **High-scorer secret:** On any quant problem, glance at the answer choices *before* you start solving. They tell you the scale, the form (integer? fraction? variable expression?), and often the right approach.

## Shift 2: Plug in numbers

When a problem is purely about variables — "if x and y are positive integers..." — pick concrete numbers and test the answer choices.

\`\`\`excel-quiz
q: If x and y are positive integers and x > y, which of the following must be true?
options: x - y is positive | x/y is greater than 1 | xy is greater than y | x² > y² | All of the above
correct: 4
explain: Plug x = 2, y = 1. (A) 2-1=1, positive — true. (B) 2/1 = 2 > 1 — true. (C) 2·1=2 > 1 — true. (D) 4 > 1 — true. So far all four hold. The lesson: when "all of the above" is offered, you must verify each candidate with at least two different plug-ins (try also x = 3, y = 2 for confirmation). The pattern here is that "positive integers" with x > y is a very constrained domain — most relationships you'd guess actually do hold. Answer (E).
\`\`\`

Three rules for plugging in:

1. **Pick easy numbers** (2, 3, 5, 10) — but never 0 or 1, which behave strangely
2. **If the problem says "integer," don't plug in 7.5.** If it says "positive," don't plug in -3. Stay inside the domain.
3. **Test edge cases when the answer is "must be true."** Plug in fractions if the problem allows non-integers. Plug in negatives if signed values are in scope.

The third rule is where students lose points. "Must be true" means *for every legal value*, not just the easy one you picked.

## Shift 3: Back-solve from answer choices

When a problem has numeric answer choices and a single unknown, solving the problem is often slower than testing the answers. Start with answer (C) — the middle value. If it works, great. If it doesn't, you usually know whether to try a larger or smaller answer next.

\`\`\`excel-quiz
q: A jar contains red and blue marbles in a 3:5 ratio. After 6 red marbles are added, the new ratio is 1:1. How many blue marbles are in the jar?
options: 10 | 12 | 15 | 18 | 20
correct: 2
explain: Back-solve from (C) = 15 blue. If blue is 15 and original ratio was 3:5, original red was 9. Add 6 → 15 red, 15 blue. Ratio is 1:1. Match. Done in 20 seconds without writing a single equation. The algebraic approach (3k + 6 = 5k → k = 3 → blue = 15) takes ~60 seconds and offers more chances to slip. Back-solving is structurally faster when the answer choices are nice numbers.
\`\`\`

Back-solving wins whenever:
- The problem has a single unknown
- Answer choices are integers or simple fractions
- The algebra would require multiple steps

It loses when the answers are ugly (irrational, very large) or when the problem has multiple unknowns.

## Shift 4: Elimination by parity, magnitude, and sign

Even when you can't solve a problem fully, you can usually rule out 2-3 answer choices without computing.

| Signal | Rules out |
|--------|-----------|
| Result must be **even** | Any odd answer choice |
| Result must be a **fraction less than 1** | Any answer ≥ 1 |
| Result must be **negative** | Any positive answer |
| Result is a **probability** | Any answer outside [0, 1] |
| Result is a **count of people** | Any non-integer, any negative |

A 70-second elimination plus a guess between the two remaining is worth more than a 3-minute attempt at full computation. Especially in the back half of the section when time pressure mounts.

## The GMAT trap menu

These five traps account for a stunning percentage of missed quant questions. Internalize them now.

### Trap 1: "Positive" doesn't mean "integer greater than 1"

When a problem says "x is positive," x can be 0.5, or 7, or 0.0001. If you assumed integer, you've been quietly losing points on number-properties questions. **Read carefully**: "positive integer" is different from "positive number" is different from "positive real."

### Trap 2: Integer vs. real number

If the problem doesn't say "integer," don't assume it. Many "must be true" questions hinge on whether x can be a fraction.

### Trap 3: Percent increases are not symmetric with percent decreases

A 50% increase followed by a 50% decrease does **not** return to the original. (100 → 150 → 75.) This is the most-tested word-problem trap in GMAT history.

\`\`\`excel-quiz
q: A stock rises 25% in January, then falls 20% in February. What is its net change over the two months?
options: It is up 5% | It is unchanged | It is down 5% | It is down 4% | Cannot be determined
correct: 1
explain: Start with $100. After January: $125. After February: $125 × 0.80 = $100. Net change: zero. The trap is to add or subtract percentages directly (+25% − 20% = +5%); the right move is to multiply growth factors (1.25 × 0.80 = 1.00). Percentage problems live or die on whether you treat them multiplicatively. Answer (B).
\`\`\`

### Trap 4: Inclusive vs. exclusive boundaries

"x is between 3 and 7" — does that include 3 and 7, or not? Read the inequality symbol. "3 < x < 7" is exclusive; "3 ≤ x ≤ 7" is inclusive. The number of integers in each is different (3 vs. 5). This trap shows up constantly in counting problems and inequalities.

### Trap 5: "Must be true" vs. "Could be true"

- **Must be true** = true for every legal value. One counterexample kills it.
- **Could be true** = true for at least one legal value. One example confirms it.
- **Could be false** = false for at least one legal value (which is a much weaker condition than "must be false").

\`\`\`excel-quiz
q: If n is an integer and n² is divisible by 12, which of the following MUST be true?
options: n is divisible by 12 | n is divisible by 6 | n is divisible by 4 | n is divisible by 3 | n is divisible by 2
correct: 1
explain: For n² to be divisible by 12 = 4·3, n² needs at least two factors of 2 and one factor of 3. Since 3 is prime, n itself must contain a factor of 3 (you can't get a 3 in n² unless 3 is in n). For the factor of 2: n² having two 2s only requires n to have one 2. So n must be divisible by 2 and by 3, hence by 6. Answer (B). Trap: (A) and (C) are tempting but stronger than required. (D) and (E) each capture only half the requirement.
\`\`\`

\`\`\`excel-quiz
q: If x and y are positive numbers and xy = 1, which of the following COULD be true?
options: x + y < 2 | x = y = 1 | x > 1 and y > 1 | x and y are both integers greater than 1 | None of the above could be true
correct: 1
explain: By AM-GM, x + y ≥ 2√(xy) = 2, with equality iff x = y = 1. So (A) is impossible (strictly less than 2 cannot hold), and (B) is the unique equality case — it's the one that could be true. (C) would force xy > 1, contradiction. (D) would force xy ≥ 4. Tricky: "could be true" with a single equality case as the answer. Answer (B).
\`\`\`

## Where this leaves you

Three principles, five traps. Carry them into every quant problem from this point forward. When you miss a problem in practice, your post-mortem should sort it into one of these buckets: which shift did I miss, or which trap did I fall into? If you can't classify the miss, you're not learning from it.

Lesson 3 moves to the Verbal section — and a parallel shift in mindset.
`;

export const GMAT_L3 = `# The Verbal Mindset: Read like a logician, not a writer

The Focus Edition's Verbal section is two question types: **Critical Reasoning** (CR) and **Reading Comprehension** (RC). Sentence Correction is gone. This is good news for non-native English speakers and bad news for anyone who built their prep around grammar rules — the test now leans almost entirely on logic.

Here is the central shift:

> **Stop reading for content. Start reading for argument structure.**

When you read the morning news, you read for *what happened*. When you read on the GMAT, you read for *what claim is being made and what evidence supports it*. These are different cognitive modes. Most test-takers default to the first; high scorers train themselves into the second.

## The argument: conclusion vs. premise

Every GMAT argument has the same skeleton:

- **Premises** — the facts the argument takes as given
- **Conclusion** — the claim the author wants you to accept
- **Assumption** — the unstated bridge between premises and conclusion

The single most-tested distinction on Verbal is "which sentence is the conclusion?" If you can't identify it, you can't strengthen or weaken the argument, you can't spot the flaw, and you can't pick the right inference.

Conclusions usually live near the end of a CR stimulus, often signaled by **therefore, thus, hence, so, it follows that, clearly, in conclusion**. Premises often follow **because, since, given that, due to**. But the test writers know you know this and sometimes hide the conclusion in the middle of the paragraph. The reliable test: *which sentence is the one all the others are trying to support?*

\`\`\`java-quiz
q: Read the argument and identify the conclusion.
code: |
  Recent studies show that adults who consume more than three cups of
  coffee daily report higher productivity at work. Researchers tracked
  500 office workers over six months and found a strong correlation
  between coffee intake and self-reported output. The lead researcher
  concluded that drinking more coffee improves workplace productivity,
  and therefore companies should provide unlimited coffee to employees.
options: Adults who drink more than 3 cups of coffee report higher productivity | Researchers tracked 500 office workers over six months | There is a strong correlation between coffee intake and self-reported output | Drinking more coffee improves workplace productivity | Companies should provide unlimited coffee to employees
correct: 4
explain: The conclusion is the final action recommendation — companies should provide unlimited coffee. Everything else, including "drinking coffee improves productivity," is in service of that policy recommendation. Trap: (D) reads like a conclusion in isolation (it has the structure of a claim) but it's actually a sub-conclusion used to support (E). Always ask "what is the final thing the author wants you to accept?" — that's the real conclusion. Answer (E).
level: medium
\`\`\`

## Hedge words are never accidental

GMAT writers choose words with a lawyer's precision. The difference between **some**, **most**, and **all** is the difference between a right answer and a trap answer.

| Word | Logical force |
|------|---------------|
| All / every / always | Universal — one counterexample kills it |
| Most | Strictly more than half |
| Some / at least one | Existence — one example confirms it |
| Suggests / indicates | Weak — compatible with the conclusion being false |
| Proves / demonstrates | Strong — claims the conclusion follows necessarily |

When a stimulus says "studies suggest X" and an answer choice says "studies prove X," the answer is wrong — it overstates the evidence. This is so consistent it functions as a rule.

> **Trap warning:** Answer choices that introduce universal quantifiers ("all," "every," "never") when the stimulus used "some" or "most" are almost always wrong. The opposite — softening "all" to "some" — is almost always safe.

\`\`\`java-quiz
q: Consider the argument and select the answer that the argument's reasoning most directly supports.
code: |
  Some employees who attended the new training program reported an
  increase in their monthly sales figures. The company is therefore
  considering rolling out the program to all sales staff next quarter.
options: All employees who attend the training program will see sales increases | Most employees who attend the training program will see sales increases | At least some employees may experience improved sales after attending the training program | The training program is the sole cause of the reported sales increases | Without the training program, employee sales would have decreased
correct: 2
explain: The stimulus uses "some" — a pure existence claim. The only answer that doesn't add unwarranted force is (C). (A) and (B) inflate "some" to "all" and "most." (D) claims sole causation, never supported by correlation alone. (E) is a counterfactual nowhere implied. The discipline is to match the quantifier strength of the stimulus exactly. Answer (C).
level: medium
\`\`\`

## Inference vs. assumption — the most-confused pair

These two question types look similar and are tested differently. Get the distinction wrong and you'll consistently miss 700-level questions.

| Question type | What you're looking for |
|---------------|------------------------|
| **Inference / "must be true"** | What follows *from* the premises. The conclusion is irrelevant. |
| **Assumption** | What the argument *needs* to be true for its conclusion to hold. The conclusion is central. |

Inference questions reward sticking close to what's explicitly stated; the right answer is often almost a paraphrase. Assumption questions reward identifying the unstated bridge — what you'd have to add to make the argument airtight.

The classic assumption trap: an answer choice that's *consistent* with the argument but isn't *necessary* for it. The test for whether something is a real assumption is the **Negation Test** — negate the answer choice, and if the argument falls apart, it was an assumption. If the argument still works, it wasn't.

\`\`\`java-quiz
q: Identify the assumption the argument requires.
code: |
  The city's new bike-share program has been a success: ridership has
  doubled in six months. The city should therefore expand the program
  by adding 200 new docking stations next year.
options: Some current riders use the bike-share program more than once a week | The doubled ridership reflects increased demand rather than a temporary novelty effect | Bike-share programs have succeeded in other cities of similar size | The city has the budget to add 200 docking stations | No alternative transportation policy would be more cost-effective
correct: 1
explain: Negation test on (B): if doubled ridership is *not* increased demand but a novelty effect, then expansion is unjustified — the argument collapses. So (B) is required. (A) is consistent but unnecessary. (C) is supporting evidence the argument doesn't use. (D) is a practical prerequisite for the action but not an assumption of the *reasoning*. (E) is a "no better alternative" trap — assumptions don't need to rule out unrelated alternatives. Answer (B).
level: hard
\`\`\`

## Reading Comprehension: map the argument in 90 seconds

Half of all RC questions can be answered without re-reading the passage *if* you mapped the argument structure on the first pass. The other half need you to find a specific detail — but with a good map you know exactly which paragraph to scan.

Here's the discipline. After each paragraph, ask one question: **what role does this paragraph play in the overall argument?** Possible answers, in rough order of frequency:

1. Introduces the phenomenon to be explained
2. Presents the conventional/old view
3. Presents the author's new view (often signaled by "however," "but," "yet")
4. Provides supporting evidence
5. Considers a counterargument
6. Concludes / states implications

For a typical 3-paragraph RC passage, your first-pass map should be five to seven words total. "P1: phenomenon. P2: old view. P3: author challenges + evidence." That's it. When the question asks "the author's primary purpose," you don't need to re-read — you wrote it down.

> **High-scorer secret:** Don't read RC passages line-by-line. Read for the *function* of each paragraph, not the content. Most test-takers spend 3-4 minutes reading the passage and 1-2 minutes per question. Flip that ratio: 90 seconds on the passage building the map, then attack the questions with the map in hand.

## Detail questions: trust the passage, not your memory

When a question asks "according to the passage, X is..." the right answer is *in the passage*, often as a near-paraphrase of a specific sentence. The trap answer paraphrases something that *sounds* right but isn't actually said.

Two disciplines:

1. **Locate the sentence.** If the question references "X," scan the map, find the paragraph that discussed X, and re-read that sentence.
2. **Beware "extreme" trap answers.** If the passage says "the new method is sometimes faster," an answer that says "the new method is generally faster" is wrong by quantifier inflation. Same trap as in CR.

\`\`\`excel-quiz
q: A Critical Reasoning question stem reads: "Which of the following, if true, most weakens the argument?" Your job is to find an answer that:
options: Contradicts a premise of the argument | Provides an alternative explanation for the phenomenon the conclusion addresses | States that the conclusion is false | Strengthens the opposing view stated in the passage | Identifies a logical fallacy in the argument
correct: 1
explain: Weaken questions reward finding an answer that undermines the link between premises and conclusion — usually by introducing an alternative explanation, attacking the analogy/sample, or showing the assumption fails. (A) is wrong because you typically cannot contradict a premise; premises are taken as given. (C) is a trap — the right answer rarely flatly denies the conclusion; it makes it less likely. (D) confuses the passage with a debate. (E) sounds clinical but isn't how weaken answers are usually phrased. Answer (B).
\`\`\`

\`\`\`excel-quiz
q: A passage's first paragraph describes a long-held scientific theory; the second paragraph begins "However, recent fossil discoveries suggest…" Without reading further, what is the most likely role of paragraph 3?
options: It restates the original theory in more detail | It provides additional evidence for the original theory | It elaborates on the implications of the new evidence, or proposes an alternative theory | It introduces a third, unrelated phenomenon | It summarizes the author's personal opinion of the field
correct: 2
explain: The "old view → new evidence" structure is one of the most common RC patterns. Paragraph 3 almost always either elaborates the new view, develops its implications, or weighs the two views against each other. Recognizing this pattern lets you predict where the passage is going and read more efficiently. Answer (C).
\`\`\`

## Where this leaves you

CR and RC look like reading tests. They aren't. They are tests of whether you can hold an argument in your head as a structured object — premises, conclusion, assumption, hedge — rather than as a stream of sentences. Train that on every practice question and your verbal score moves more than any vocabulary drill ever will.

Lesson 4 covers the section most test-takers under-prepare for: Data Insights.
`;

export const GMAT_L4 = `# Data Insights: The new section nobody knows how to study

If the Quant section is the GMAT's heart and Verbal is its lungs, Data Insights is its newly-grafted limb — the section grafted onto the Focus Edition in 2023 and still poorly understood by most prep books. Half the official guide questions for DI didn't exist three years ago.

This matters for one reason: **DI is the section that separates 645 from 705.** Most test-takers grind quant and verbal but treat DI as an afterthought. The top scorers don't. If you're aiming above the 80th percentile, DI is where the marginal hour pays best.

## The five question types

DI is 20 questions in 45 minutes. About 2 minutes 15 seconds per question — but the time budget is uneven across question types. Multi-Source Reasoning eats 4 minutes; a Graphics question goes by in 90 seconds.

| Type | Format | Time | Frequency |
|------|--------|------|-----------|
| **Data Sufficiency (DS)** | Classic GMAT — two statements, fixed answer choices | 2 min | ~6 per test |
| **Two-Part Analysis (TPA)** | Two related quantities to find from a single setup | 2.5 min | ~4 per test |
| **Multi-Source Reasoning (MSR)** | 3 tabs of mixed text/tables, then 3 questions about them | 4 min/set | ~2 sets |
| **Graphics Interpretation (GI)** | Chart with two dropdown fill-in-the-blank statements | 1.5 min | ~4 per test |
| **Table Analysis (TA)** | Sortable table with 3 true/false sub-questions | 2.5 min | ~3 per test |

DS migrated here from the old Quant section. The other four are native to DI.

## Data Sufficiency: the framework that ends the guessing

DS gives you a question, two statements, and five fixed answer choices:

| | Answer |
|---|--------|
| **A** | Statement (1) alone is sufficient; (2) alone is not |
| **B** | Statement (2) alone is sufficient; (1) alone is not |
| **C** | Both together are sufficient, but neither alone is |
| **D** | Each alone is sufficient |
| **E** | Together they are still not sufficient |

Memorize those — you cannot afford to re-read them on test day. The decision tree:

\`\`\`
1. Evaluate Statement (1) alone.
     Sufficient?  →  YES: answer is A or D, move to step 2
                  →  NO : answer is B, C, or E, move to step 3
2. Evaluate Statement (2) alone.
     Sufficient?  →  YES: answer is D
                  →  NO : answer is A
3. Evaluate Statement (2) alone.
     Sufficient?  →  YES: answer is B
                  →  NO : combine them, answer is C or E
\`\`\`

This is the **12-style decision tree** because most prep books print it on page 12 of the DS chapter. Internalize it; do not improvise.

> **Trap warning:** "Sufficient" means *a definite, unique answer is determined* — not "I have some information." A statement that pins x ∈ {3, 7} is *not* sufficient for "what is x?" because the answer isn't unique. The most common DS mistake is calling something sufficient when it merely narrows the range.

\`\`\`java-quiz
q: Data Sufficiency. Is x > 5?
code: |
  (1) x² > 25
  (2) x > -10
options: (A) Statement (1) alone is sufficient, but (2) alone is not | (B) Statement (2) alone is sufficient, but (1) alone is not | (C) Both together are sufficient, but neither alone is | (D) Each statement alone is sufficient | (E) Neither sufficient, even together
correct: 4
explain: (1) x² > 25 means x > 5 OR x < -5. Insufficient — x could be 10 (yes) or -10 (no). (2) x > -10. Insufficient — x could be 100 (yes) or 0 (no). Together: x² > 25 AND x > -10. That still allows x = 10 (yes) or x = -7 (no — since -7 < -10 is false, but -7 satisfies both: -7² = 49 > 25, and -7 > -10). So together, x could be 10 (answer: yes) or -7 (answer: no). Not sufficient. Answer (E). The trap: students see "x² > 25" and rush to x > 5, forgetting the negative branch. Always remember that x² > c gives TWO ranges, not one.
level: hard
\`\`\`

\`\`\`java-quiz
q: Data Sufficiency. A box contains red, blue, and green marbles. What is the probability of drawing a blue marble at random?
code: |
  (1) There are twice as many blue marbles as red marbles.
  (2) The ratio of red to green marbles is 1:3.
options: (A) Statement (1) alone is sufficient | (B) Statement (2) alone is sufficient | (C) Both together are sufficient | (D) Each alone is sufficient | (E) Neither sufficient, even together
correct: 2
explain: (1) blue = 2 red. We don't know green, so the fraction of blue can vary. Insufficient. (2) red:green = 1:3. Says nothing about blue. Insufficient. Together: let red = 1k, blue = 2k, green = 3k. Total = 6k. Blue/total = 2k/6k = 1/3. Sufficient — the unknown k cancels out. Answer (C). The key insight: in ratio problems, the absolute counts don't matter as long as the ratios are pinned. Recognizing that pattern lets you skip the algebra.
level: medium
\`\`\`

## Two-Part Analysis: two unknowns, one shared setup

TPA gives you a scenario and asks you to pick two quantities from a single list of options — one for column A, one for column B. The shared option list is the trap: the same value is often "right" in one column but wrong in the other, and the test rewards distinguishing them.

Strategy: solve for the two quantities separately. Don't try to pick them in parallel. And read the column headers carefully — they're often subtly different ("maximum" vs. "minimum," "before tax" vs. "after tax").

## Multi-Source Reasoning: three tabs, three questions, one stopwatch

MSR is the most time-pressured format on the test. You'll see three tabs — a memo, a table, and a chart, or similar — and then three questions about the combined information. Total budget: about 12 minutes for the set (4 per question on average).

The discipline: **don't try to absorb all three tabs before reading the questions.** Skim tab 1 to get the topic, glance at tabs 2 and 3 for structure (what kind of data is in each?), then go to the first question. Most questions need only one or two of the tabs; the question tells you where to look.

> **High-scorer secret:** MSR rewards "lazy reading" — finding the minimum information needed to answer each question, not understanding the full scenario. The set isn't a comprehension test; it's a research task.

\`\`\`excel-quiz
q: For Multi-Source Reasoning, what's the most efficient first move when a new set appears?
options: Read each of the three tabs carefully, taking notes on each | Skim the headings of all three tabs to understand the structure, then go to the first question | Skip immediately to the third question, which is usually the easiest | Spend 90 seconds reading tab 1 carefully, then move on
correct: 1
explain: MSR questions almost always reference specific data points that live in one or two tabs. Reading everything carefully wastes the time you need for the questions. The right move is a 30-second structural scan ("tab 1 is a memo about Q4 results, tab 2 is a revenue table, tab 3 is a competitor chart"), then attack the first question and let it tell you where to look. Answer (B).
\`\`\`

## Graphics Interpretation: read the chart, fill in the blanks

GI shows you a chart (scatterplot, bar chart, line graph) and asks you to complete two dropdown sentences. The dropdowns often offer trap options that match common misreadings of the chart — confusing the axis units, mistaking correlation for slope, or reversing which variable is independent.

Three disciplines:

1. **Read the axes first.** Units, scale (linear vs. log), starting point. A chart starting at y = 50 instead of 0 makes small differences look huge — the test will exploit this.
2. **Beware aggregate vs. per-unit.** "Total sales" and "average sales per store" tell different stories. The dropdowns will offer both phrasings; pick the one that matches what the chart actually shows.
3. **For scatterplots, find the correlation direction and rough strength before reading the options.** Then match.

\`\`\`excel-quiz
q: A scatterplot shows employee tenure (x-axis, years) versus annual salary (y-axis, thousands of dollars) for 80 employees at a company. The points cluster along an upward-sloping line, but with significant vertical spread at each x value. Which statement is best supported by the chart?
options: Tenure causes salary to increase | Longer tenure is associated with higher salary, but tenure does not uniquely determine salary | All employees with longer tenure earn more than all employees with shorter tenure | Employee skill is the missing variable | The relationship between tenure and salary is perfectly linear
correct: 1
explain: The chart shows correlation (upward slope) with noise (vertical spread). The honest read: positive association, not a deterministic relationship. (A) overreaches into causation, which scatterplots cannot establish. (C) is too strong — vertical spread means there's overlap. (D) imports outside information not in the chart. (E) is false because of the spread. Answer (B). The pattern: GI rewards the most-restrained reading of the chart, never the most-dramatic one.
\`\`\`

\`\`\`excel-quiz
q: A line chart shows monthly revenue for two products, A and B, over 12 months. Both lines trend upward. Product A starts at $50K and ends at $80K. Product B starts at $20K and ends at $50K. Which conclusion is most strongly supported?
options: Product A grew faster than Product B | Product B grew faster than Product A | Both products grew at the same rate | Product A is more profitable than Product B | Product B will overtake Product A next year
correct: 1
explain: A grew by $30K on a base of $50K → 60% growth. B grew by $30K on a base of $20K → 150% growth. B grew faster in percentage terms. The trap (A) is to focus on absolute dollar growth (both gained $30K, so it looks tied — but A is the bigger product) or on ending value. (D) confuses revenue with profit. (E) extrapolates beyond the data. Answer (B). The pattern: when growth is the question, percentage almost always beats absolute change.
\`\`\`

## Table Analysis: sort, scan, decide

TA presents a sortable table and three true/false sub-questions. Sorting is your friend — sort the relevant column, then sub-questions about extremes ("which entity has the highest X?") become single-row reads.

The discipline: **don't waste sorts.** Read all three sub-questions first, plan which sorts you'll need, then execute. Sorting back and forth between columns burns time.

## Where this leaves you

DI is the section where strategy matters most because most test-takers don't have one. Memorize the DS answer choices and decision tree. Practice the "lazy reading" discipline on MSR. Read graphics axes before the data. These three habits alone move DI scores by 5-8 points in our experience — more than any other section's marginal strategy.

That closes the orientation. Lessons 5 through 10 dive into specific quant topics, verbal question patterns, and test-day operational details. By the time you reach lesson 10, the mindset you've built in these four should feel automatic.
`;
