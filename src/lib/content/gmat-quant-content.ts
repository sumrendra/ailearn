/* eslint-disable no-irregular-whitespace */
/**
 * GMAT Prep — quantitative reasoning deep dive.
 *
 * Curriculum (this file: lessons 5-7 of 10):
 *   5. Arithmetic & Number Properties
 *   6. Algebra & Word Problems
 *   7. Geometry, Counting, and Statistics
 *
 * Each lesson body targets 700-1100 words plus 6-9 interactive practice
 * problems. Quant lessons are the most problem-dense in the course; the
 * pedagogy is "see the pattern, then drill it."
 */

export const GMAT_L5 = `# Arithmetic & Number Properties

The single most important sentence in GMAT quant: **most of what looks like arithmetic is number-properties in disguise.** The question asks for a remainder, a units digit, whether something is divisible — and the student starts long-dividing. The high scorer notices the integer structure and is done in 30 seconds.

This lesson is about that shift. We'll do parity and divisibility, prime factorization (the master key), GCD/LCM (and the remainder archetype that lives on every test), fractions vs decimals vs ratios, and the percent traps test writers love.

## Parity and divisibility — the cheap wins

Integers come in two flavors and two only. The arithmetic of parity:

| Operation | Result |
|-----------|--------|
| even + even, odd + odd | even |
| even + odd | odd |
| even × anything | even |
| odd × odd | odd |

Notice multiplication is the asymmetric one — a single even factor makes the whole product even. That fact alone solves a surprising number of "could X be odd?" questions.

Divisibility rules worth memorizing cold:

| Divisor | Rule |
|---------|------|
| 2 | last digit is even |
| 3 | sum of digits divisible by 3 |
| 4 | last two digits divisible by 4 |
| 5 | last digit is 0 or 5 |
| 6 | divisible by 2 AND by 3 |
| 8 | last three digits divisible by 8 |
| 9 | sum of digits divisible by 9 |
| 11 | alternating sum of digits divisible by 11 |

> Memorize all eight. They look like trivia until you face a 7-digit number on a 2-minute clock.

## Prime factorization — the master key

Every positive integer has exactly one prime factorization. **2520 = 2³ × 3² × 5 × 7.** Once you have it, you can answer almost any divisibility, GCD, LCM, or "how many factors" question without thinking.

Number of factors? Add 1 to each exponent and multiply: (3+1)(2+1)(1+1)(1+1) = 48 factors.

Is 2520 divisible by 14? 14 = 2 × 7. Both primes are in the factorization with enough power. Yes.

Is it divisible by 16? 16 = 2⁴. We only have 2³. No.

\`\`\`excel-quiz
q: If n = 2⁴ × 3² × 5, how many positive factors does n have?
options: 12 | 20 | 24 | 30 | 32
correct: 3
explain: The factor-counting trick: add 1 to each prime exponent and multiply. (4+1)(2+1)(1+1) = 5 × 3 × 2 = 30. Answer (D). Why it works: every factor is built by choosing the 2-exponent (0 through 4 = 5 options), the 3-exponent (0,1,2 = 3 options), and the 5-exponent (0 or 1 = 2 options). This is the single highest-ROI number-properties fact on the GMAT.
\`\`\`

## GCD, LCM, and the remainder archetype

For positive integers a and b:

- **GCD(a,b)** = product of shared primes at the **lower** exponent
- **LCM(a,b)** = product of all primes at the **higher** exponent
- **a × b = GCD × LCM** (the identity that saves time when one is hard to compute)

Then there's the classic:

> "The remainder when N is divided by 12 is 7" → write N = 12k + 7 for some non-negative integer k. **Always rewrite remainder statements as equations.** The "k" makes the algebra possible.

\`\`\`java-quiz
q: When positive integer N is divided by 12, the remainder is 7. What is the remainder when N is divided by 4?
code: |
  N = 12k + 7
    = 4(3k) + 7
    = 4(3k + 1) + 3
options: 0 | 1 | 2 | 3 | Cannot be determined
correct: 3
explain: Write N = 12k + 7. Since 12 = 4 × 3, the first term is divisible by 4. Reduce the remainder: 7 = 4 + 3, so N = 4(3k + 1) + 3. Remainder is 3. Answer (D). The general trick: when the new divisor (4) divides the old divisor (12) evenly, the new remainder is just (old remainder) mod (new divisor).
level: medium
\`\`\`

\`\`\`excel-quiz
q: The LCM of two positive integers is 60 and their GCD is 6. If one of the integers is 12, what is the other?
options: 5 | 10 | 18 | 30 | 36
correct: 3
explain: Use the identity a × b = GCD × LCM. So 12 × b = 6 × 60 = 360, giving b = 30. Sanity check: GCD(12, 30) = 6 ✓, LCM(12, 30) = 60 ✓. Answer (D). Memorize the identity — it converts a structural problem into one-step arithmetic.
\`\`\`

## Fractions, decimals, percents — choose your weapon

The fluent test-taker switches freely. Rules of thumb:

- **Keep as a fraction** when you're going to multiply or divide later (cancellation is gold).
- **Convert to decimals** when the answer choices are decimals or when you're estimating size.
- **Multiply through by a common denominator** to clear fractions from an equation — almost always faster than working with thirds and sevenths.

Memorize these decimal equivalents — they appear constantly:

| Fraction | Decimal |
|----------|---------|
| 1/8 | 0.125 |
| 1/6 | 0.1667 |
| 1/4 | 0.25 |
| 1/3 | 0.333 |
| 3/8 | 0.375 |
| 5/8 | 0.625 |
| 5/6 | 0.833 |

## Percents — the trap garden

Three percent traps, in order of frequency:

**1. Successive percent changes don't add.** A 20% gain followed by a 20% loss is not zero. It's (1.20)(0.80) = 0.96, a 4% **loss**. Always multiply factors.

**2. "Of the original" vs "of the new."** "Sales rose 50% in March and another 20% in April" — that 20% is on the March number, not the original.

**3. The percent change formula.** Always (new − old) / old, never the other way. "X is what percent more than Y?" → (X − Y)/Y × 100.

\`\`\`excel-quiz
q: A stock falls 20% in January, then rises 25% in February. What is the net percent change?
options: -5% | 0% | +5% | +20% | +45%
correct: 1
explain: Start at 100. After Jan: 100 × 0.80 = 80. After Feb: 80 × 1.25 = 100. Net change: 0%. The "fair" pairing: (0.80)(1.25) = 1 exactly. The trap-pairing students miss: a 20% loss is NOT reversed by a 20% gain — it's reversed by a 25% gain. Answer (B). When the GMAT pairs percent moves to net zero, the percentages will always be of the (1 − x)(1 + y) = 1 family.
\`\`\`

\`\`\`excel-quiz
q: In a class, the ratio of boys to girls is 3 : 5. If there are 24 boys, how many students are in the class total?
options: 32 | 40 | 48 | 56 | 64
correct: 4
explain: Three parts = 24 boys, so one part = 8. Total parts = 3 + 5 = 8, total students = 8 × 8 = 64. Answer (E). The trap: choice (B) "40" is the number of girls only. Whenever a ratio problem gives you one count, immediately find the value of "one part" — every other quantity is a multiple of it.
\`\`\`

\`\`\`java-quiz
q: If x is a positive integer and 6x is a multiple of 8, which of the following must also be a multiple of 8?
code: |
  6x = 2 × 3 × x is a multiple of 8 = 2³.
  The factor "6" contributes only one 2.
  So x itself must contribute at least two factors of 2 → x is a multiple of 4.
options: x | 2x | 3x | 4x | 12x
correct: 1
explain: Since 6 contributes one factor of 2 and 6x must contain 2³, x must contribute at least 2² → x is a multiple of 4. Test the smallest such x = 4: then 2x = 8 ✓ (multiple of 8). But x = 4 itself is not a multiple of 8, so (A) fails. 3x = 12 is not a multiple of 8, so (C) fails. 12x = 48 is, but so is 2x = 8, and 2x is the *smallest* one that must hold. Answer (B) 2x. The discipline: for "must be" questions, find a counterexample for each wrong choice using the smallest x that satisfies the premise — and pick the *strongest* guaranteed conclusion.
level: hard
\`\`\`

\`\`\`excel-quiz
q: The product of three consecutive positive integers is always divisible by which of the following?
options: 4 | 5 | 6 | 7 | 9
correct: 2
explain: Among any 3 consecutive integers, one is divisible by 3 and at least one is even. So the product is divisible by 2 × 3 = 6. Counter-examples kill the others: 1×2×3 = 6 (not div by 4, 5, 7, or 9). Answer (C). Generalize: the product of k consecutive integers is always divisible by k! — a fact worth burning into memory.
\`\`\`

## What you can do now

- Use parity and divisibility rules without slowing down
- Prime-factorize any number ≤ 1000 and read its full structure off the factorization
- Translate remainder statements into N = dk + r equations
- Spot the three classic percent traps before stepping in
- See "is X divisible / how many factors / GCD" as one family of question, not three

Next: **Algebra & Word Problems** — clean translation, mechanical solving, and the work/rate/distance archetypes you'll see five times each on test day.
`;

export const GMAT_L6 = `# Algebra & Word Problems

Algebra on the GMAT is rarely about hard manipulation. It's about **translation**. A sentence in English becomes one or two equations. Then a 10-second mechanical step solves them. Most wrong answers happen at the translation step, not the arithmetic step.

This lesson covers: linear equations and systems, inequalities (and the sign-flip), absolute value (always two cases), exponents and roots (the rules that actually get tested), quadratics (factor or formula), functions (just substitution), and the four word-problem archetypes that reappear endlessly.

## Translate first, solve second

A discipline:

> Read the sentence. Name the unknowns explicitly (let x = age now, y = price per shirt). Write each English clause as one equation. Only then start solving.

The translation cheat sheet:

| English | Algebra |
|---------|---------|
| "is", "equals", "results in" | = |
| "more than", "greater by" | + |
| "less than", "fewer than" | − (and **reverse order** — "5 less than x" is x − 5) |
| "of", "times", "product" | × |
| "per", "for each", "ratio of" | ÷ |
| "twice", "doubled" | 2× |
| "consecutive integers" | n, n+1, n+2, … |
| "consecutive even/odd" | n, n+2, n+4, … |

The "less than" reversal is the trap. "5 less than x" is **x − 5**, not 5 − x. Read it as "I started with x and lost 5."

## Linear equations and systems

Single variable: isolate. Two variables, two equations: **substitution** when one variable is already isolated, **elimination** when coefficients are clean. Three unknowns, two equations: usually impossible (unless the question only asks for a combination like x + y + z that the equations happen to determine).

\`\`\`excel-quiz
q: If 3x + 2y = 16 and x − y = 2, what is the value of x + y?
options: 2 | 3 | 4 | 5 | 6
correct: 4
explain: From x − y = 2, write x = y + 2. Substitute into the first: 3(y + 2) + 2y = 16 → 5y + 6 = 16 → y = 2. Then x = 4, so x + y = 6. Answer (E) 6. The shortcut to know: for a 2×2 system, always check whether the target combination (x + y, x − y, xy) can be read off by a single scaling-and-adding step before grinding through substitution. Here 1×(first) + 1×(3 × second) = 3x + 2y + 3x − 3y = 6x − y = 16 + 6 = 22 — not as clean as substitution this time.
\`\`\`

\`\`\`java-quiz
q: At a bakery, 3 muffins and 2 scones cost $11. 5 muffins and 4 scones cost $20. What is the price of one scone?
code: |
  3m + 2s = 11
  5m + 4s = 20
  Multiply the first by 2: 6m + 4s = 22.
  Subtract the second: m = 2.
  Then 3(2) + 2s = 11 → s = 2.50.
options: $1.50 | $2.00 | $2.50 | $3.00 | $3.50
correct: 2
explain: Standard elimination. Scale the first equation to match the scone coefficient in the second, subtract, solve for m, back-substitute. Answer (C) $2.50. The structural move: when one variable's coefficients differ by a clean factor (2 in this case), scaling-and-subtracting is faster than full substitution.
level: easy
\`\`\`

## Inequalities — the sign-flip trap

Inequalities behave like equations with one exception: **multiplying or dividing both sides by a negative flips the inequality**. Forget this once and you'll lose a whole question.

If x is a variable that *could* be negative, you cannot multiply through by x without splitting into cases. This is the single most-tested inequality trap.

Compound inequalities (a < x < b) — operate on all three parts simultaneously.

## Absolute value — always two cases

\`|x| = 5\` means **x = 5 or x = −5**. Never one case alone. The same logic extends:

\`|x − 3| < 7\` means \`−7 < x − 3 < 7\`, i.e. \`−4 < x < 10\`.

\`|x − 3| > 7\` means \`x − 3 > 7\` OR \`x − 3 < −7\` — i.e. \`x > 10\` OR \`x < −4\`. (Note the OR vs AND distinction by inequality direction.)

\`\`\`excel-quiz
q: If |2x − 6| ≤ 10, what is the range of x?
options: x ≤ 8 | −2 ≤ x ≤ 8 | x ≥ −2 | −8 ≤ x ≤ 2 | 0 ≤ x ≤ 8
correct: 1
explain: |2x − 6| ≤ 10 → −10 ≤ 2x − 6 ≤ 10 → −4 ≤ 2x ≤ 16 → −2 ≤ x ≤ 8. Answer (B). The "≤" gives an AND interval; "≥" or ">" would give an OR union. Train yourself to write the unwrapped inequality before solving — the algebra is then routine.
\`\`\`

## Exponents — the four rules they test

> Same base, multiplying: aᵐ × aⁿ = aᵐ⁺ⁿ
> Same base, dividing: aᵐ ÷ aⁿ = aᵐ⁻ⁿ
> Power of a power: (aᵐ)ⁿ = aᵐⁿ
> Fractional exponent: a^(1/n) = ⁿ√a, and a^(m/n) = (ⁿ√a)ᵐ

Other facts: a⁰ = 1 (for a ≠ 0), a⁻ⁿ = 1/aⁿ. The GMAT loves "rewrite everything as the same base" problems — 8ˣ = 2³ˣ; 27ˣ = 3³ˣ; 1/4 = 2⁻².

\`\`\`java-quiz
q: If 2^(x+3) = 8^(x−1), what is x?
code: |
  Rewrite right side with base 2:
  8^(x−1) = (2³)^(x−1) = 2^(3x−3)
  So: x + 3 = 3x − 3
       6 = 2x → x = 3
options: 1 | 2 | 3 | 4 | 6
correct: 2
explain: The single most important exponent move: get a common base. 8 = 2³, so 8^(x−1) = 2^(3x−3). With matching bases, equate the exponents: x + 3 = 3x − 3, giving x = 3. Answer (C). Whenever exponential equations appear, the first instinct should be "what base is hiding?"
level: medium
\`\`\`

## Roots — the √x² subtlety

\`√(x²) = |x|\`, **not x**. If x could be negative, √(x²) returns the positive version. This is the test writer's favorite roots trap.

Rationalize denominators when you see √2 below the bar:

\`1/√2 = √2/2\` (multiply top and bottom by √2)

## Quadratics — factor first

For ax² + bx + c = 0, the order of attack:

1. **Factor** if you can spot two numbers that multiply to ac and add to b.
2. **Difference of squares**: a² − b² = (a − b)(a + b). Memorize cold.
3. **Quadratic formula** as last resort: x = (−b ± √(b² − 4ac)) / 2a. The discriminant b² − 4ac tells you how many real solutions: positive → 2, zero → exactly 1 (the parabola just touches), negative → 0 real solutions.

\`\`\`excel-quiz
q: For what value of k does the equation x² + kx + 25 = 0 have exactly one real solution?
options: 5 only | 10 only | -10 only | 10 or -10 | 5 or -5
correct: 3
explain: Exactly one solution → discriminant = 0 → k² − 4(1)(25) = 0 → k² = 100 → k = ±10. Answer (D). The trap: students forget that k² = 100 has two solutions, not one. Whenever you square-root in an algebra problem, ask "do I need both signs?" — for "value of k" questions on the GMAT, the answer is almost always yes.
\`\`\`

## Word-problem archetypes

**Work/rate.** Combined rate = sum of individual rates. If A alone does the job in 6 hours and B in 12, together they do 1/6 + 1/12 = 3/12 = 1/4 of the job per hour → 4 hours together.

**Distance = rate × time.** Round trips, two trains, "what's the average speed" — almost always solved by writing two D=RT equations and equating one of the three variables.

**Mixture.** "How much 20% solution should I add to 10 liters of 60% to get a 30% mix?" — use total-acid equations: (0.20)x + (0.60)(10) = (0.30)(x + 10).

**Profit.** Revenue − cost = profit. Markup is on cost. Margin is on revenue. The two are not the same.

\`\`\`java-quiz
q: Train A leaves Station X at 60 mph. Train B leaves Station Y, 270 miles away, traveling toward A at 75 mph. How many hours until they meet?
code: |
  Combined closing rate = 60 + 75 = 135 mph.
  Distance / rate = 270 / 135 = 2 hours.
options: 1.5 | 2 | 2.5 | 3 | 3.5
correct: 1
explain: When two objects move toward each other, their closing speed is the sum of their speeds. Distance to close (270) divided by combined rate (135) = 2 hours. Answer (B). The general formula: t = D / (r₁ + r₂) when moving toward each other, t = D / (r₁ − r₂) when in the same direction.
level: easy
\`\`\`

\`\`\`excel-quiz
q: Alice can finish a job in 4 hours. Bob can finish the same job in 6 hours. They work together for 1 hour, then Bob leaves. How long does Alice need to finish the remaining work?
options: 1 hour | 1 hour 40 min | 2 hours | 2 hours 20 min | 3 hours
correct: 3
explain: Combined rate = 1/4 + 1/6 = 5/12 of the job per hour. After 1 hour together: 5/12 done, so 7/12 remains. Alice alone at rate 1/4 needs (7/12) ÷ (1/4) = 7/12 × 4 = 28/12 = 7/3 hours = 2 hours 20 minutes. Answer (D). The discipline: always express rates as "fraction of job per unit time" before adding, then use (remaining work) ÷ (rate) for the final stretch.
\`\`\`

## What you can do now

- Translate English word problems into equations cleanly, separating translation from solving
- Solve 2×2 linear systems with elimination or substitution by reflex
- Handle inequalities with the sign-flip rule and absolute value with two-case logic
- Manipulate exponents by finding a common base; recognize when (aᵐ)ⁿ vs aᵐ × aⁿ
- Factor quadratics or use the discriminant when factoring isn't obvious
- Set up work, distance, and mixture problems with the standard archetypes

Next: **Geometry, Counting, and Statistics** — the "everything else" lesson, which tests the same six figures and four archetypes over and over.
`;

export const GMAT_L7 = `# Geometry, Counting, and Statistics

These three topics together appear on about a third of GMAT quant questions, yet each gets less prep than algebra or arithmetic. Good news: the test writers are deeply unoriginal here. **Geometry recycles six figures. Statistics recycles four archetypes. Counting recycles three patterns.** Recognize the shape, recall the formula, finish.

## Geometry — the six figures

**Triangles.** Two special right triangles appear constantly:

| Triangle | Sides (ratio) |
|----------|---------------|
| 30-60-90 | 1 : √3 : 2 |
| 45-45-90 | 1 : 1 : √2 |
| 3-4-5 (and 6-8-10, 9-12-15) | Pythagorean |
| 5-12-13 (and 10-24-26) | Pythagorean |

> Memorize all four. The GMAT will not give you a right triangle whose sides are 7, 11.4, 13.4 — it will give you 3-4-5 or 5-12-13 in disguise.

For any triangle: angles sum to 180°. Area = (1/2) × base × height. Two sides sum > third (the triangle inequality).

**Quadrilaterals.** Square: A = s². Rectangle: A = lw. Parallelogram: A = bh. Trapezoid: A = (b₁ + b₂)/2 × h.

**Circles.** C = 2πr. A = πr². For an arc subtending angle θ (degrees): arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². An **inscribed angle** is half the central angle subtending the same arc. A triangle inscribed in a semicircle (one side = diameter) is right-angled — extremely high-yield fact.

**Coordinate plane.** Slope = (y₂ − y₁) / (x₂ − x₁). Distance = √((x₂−x₁)² + (y₂−y₁)²). Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2). Parallel lines: same slope. Perpendicular lines: slopes multiply to −1.

**Solids.** Cube volume = s³, surface area = 6s². Rectangular box: V = lwh. Cylinder: V = πr²h, lateral surface = 2πrh. Sphere: V = (4/3)πr³, surface = 4πr².

\`\`\`java-quiz
q: In a right triangle ABC with the right angle at B, AB = 9 and BC = 12. What is the length of the median from B to the hypotenuse AC?
code: |
  AC² = 9² + 12² = 81 + 144 = 225 → AC = 15
  (This is a 3-4-5 triangle scaled by 3.)
  Median from right angle to hypotenuse = AC/2 = 7.5.
options: 6 | 7.5 | 9 | 10.5 | 13.5
correct: 1
explain: A classic GMAT geometry fact: in a right triangle, the median from the right angle to the hypotenuse equals half the hypotenuse. AC = 15 (3-4-5 scaled by 3). Median = 7.5. Answer (B). Memorize this — it appears unannounced on hard geometry problems and saves a coordinate-geometry slog.
level: hard
\`\`\`

\`\`\`excel-quiz
q: A circular pizza of radius 8 inches is cut into 6 equal slices. What is the area of one slice, in square inches?
options: 8π/3 | 16π/3 | 32π/3 | 64π/3 | 16π
correct: 2
explain: Total area = π(8)² = 64π. One slice = 64π/6 = 32π/3. Answer (C). The slice is a sector with central angle 60°, so area = (60/360) × 64π = 64π/6. Whenever you see "equal slices/sectors" think (θ/360) × πr².
\`\`\`

\`\`\`excel-quiz
q: Line L passes through (2, 3) and is perpendicular to the line y = (1/2)x + 4. What is the equation of line L?
options: y = -2x + 7 | y = 2x − 1 | y = (1/2)x + 2 | y = -(1/2)x + 4 | y = -2x − 1
correct: 0
explain: Perpendicular slopes multiply to −1. Given slope 1/2, perpendicular slope = −2. Use point-slope: y − 3 = −2(x − 2) → y = −2x + 7. Answer (A). Quick check: at x = 2, y = 3 ✓. The trap: choice (D) reverses the slope incorrectly; perpendicular is the **negative reciprocal**, not the negative.
\`\`\`

## Counting and probability — three patterns

**Multiplication principle.** If event A has m outcomes and event B has n, then A-then-B has m × n. (Permutations of "first letter, then digit" passwords, menu choices, etc.)

**Permutations** (order matters): n objects in order → n!. Choose k from n in order → n!/(n−k)!.

**Combinations** (order doesn't matter): choose k from n → C(n,k) = n! / (k!(n−k)!). The number C(n,k) reads "n choose k."

> If the question says "team", "committee", or "group" → combinations. If it says "arrangement", "lineup", "ranking" → permutations. That one rule decides 90% of GMAT counting problems.

**Complementary counting.** When "at least one" is hard, compute "none" and subtract from total. P(at least one) = 1 − P(none).

**Conditional probability.** P(A given B) = P(A and B) / P(B). Reduces the sample space to just the B-world.

\`\`\`excel-quiz
q: In how many ways can a committee of 3 be chosen from a group of 8 people?
options: 24 | 48 | 56 | 168 | 336
correct: 2
explain: "Committee" → order doesn't matter → combinations. C(8,3) = 8! / (3! × 5!) = (8 × 7 × 6) / (3 × 2 × 1) = 336/6 = 56. Answer (C). Choice (E) 336 is the permutation answer (P(8,3) = 8 × 7 × 6) — the trap for students who forget that a committee has no internal ranking.
\`\`\`

\`\`\`java-quiz
q: A bag contains 4 red marbles and 6 blue marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?
code: |
  P(first red) = 4/10 = 2/5
  P(second red | first red) = 3/9 = 1/3
  P(both red) = 2/5 × 1/3 = 2/15
options: 1/15 | 2/15 | 4/25 | 1/5 | 2/9
correct: 1
explain: Without replacement → second draw's probability changes after the first. Multiply the conditional probabilities: 4/10 × 3/9 = 12/90 = 2/15. Answer (B). The trap: choice (C) 4/25 is the *with-replacement* answer (4/10)² — always read carefully whether replacement happens.
level: medium
\`\`\`

\`\`\`excel-quiz
q: A fair coin is flipped 4 times. What is the probability of getting at least one head?
options: 1/16 | 1/8 | 1/2 | 7/8 | 15/16
correct: 4
explain: Complementary counting wins. P(at least 1 head) = 1 − P(no heads) = 1 − P(all tails) = 1 − (1/2)⁴ = 1 − 1/16 = 15/16. Answer (E). The general lesson: whenever a problem says "at least one," reach for the complement before enumerating cases. The direct approach (exactly 1 + exactly 2 + ... ) requires four separate computations; the complement requires one.
\`\`\`

## Statistics — four archetypes

**Mean vs median vs mode.** In a symmetric distribution they coincide. In a skewed distribution: the **median is the robust one** (unaffected by extreme outliers); the mean gets pulled toward the tail.

A GMAT favorite: "if I add a value much larger than the existing data, what happens?" The mean rises; the median changes by at most one position; the mode is unchanged unless the new value equals an existing one.

**Standard deviation as spread.** You almost never compute SD numerically on the GMAT. You reason about it:

- Adding a constant c to every value: mean shifts by c, **SD unchanged**.
- Multiplying every value by c: mean × c, **SD × |c|**.
- Adding values closer to the mean: SD decreases.
- Adding values far from the mean: SD increases.

**Weighted averages.** If group A has mean μ_A and size n_A, and group B has mean μ_B and size n_B, the combined mean is (n_A μ_A + n_B μ_B) / (n_A + n_B) — **not** (μ_A + μ_B)/2.

**Range and IQR.** Range = max − min. The simplest spread measure; gets mentioned occasionally.

\`\`\`excel-quiz
q: The mean of five numbers is 12. If a sixth number, 18, is added to the set, what is the new mean?
options: 12 | 13 | 14 | 15 | 18
correct: 1
explain: Original total = 5 × 12 = 60. New total = 60 + 18 = 78. New mean = 78/6 = 13. Answer (B). The discipline: never average means directly — always recover totals from (count × mean) and re-divide. This is the single most useful statistics move on the GMAT.
\`\`\`

\`\`\`java-quiz
q: A class has 20 students with an average test score of 75. Another class has 30 students with an average of 85. What is the combined average score for all 50 students?
code: |
  Total points class 1: 20 × 75 = 1500
  Total points class 2: 30 × 85 = 2550
  Combined total: 4050
  Combined mean: 4050 / 50 = 81
options: 78 | 80 | 81 | 82 | 83
correct: 2
explain: Weighted average — class 2 has more weight (30 vs 20), so the combined mean lies closer to 85 than to 75. Compute totals, sum, divide by total count: 81. Answer (C). The trap: students average the two means → (75 + 85)/2 = 80 → wrong, because the classes are unequal in size. (B) 80 is the trap choice.
level: medium
\`\`\`

\`\`\`excel-quiz
q: A data set has mean 50 and standard deviation 8. If 5 is added to every value, what are the new mean and standard deviation?
options: mean 50, SD 8 | mean 55, SD 8 | mean 55, SD 13 | mean 50, SD 13 | mean 55, SD 40
correct: 1
explain: Adding a constant shifts every value by the same amount — the mean shifts by 5 (50 → 55), but the **spread doesn't change**. SD stays 8. Answer (B). The conceptual fact: SD measures how spread out the values are around their mean; translating the whole data set doesn't change spread. Contrast with multiplying by 2, which would double both mean and SD.
\`\`\`

## What you can do now

- Recognize the six recurring geometry figures and recall their formulas without hesitation
- Use the 30-60-90, 45-45-90, 3-4-5, and 5-12-13 triangles as drop-in shortcuts
- Distinguish permutations vs combinations from the question's phrasing
- Reach for complementary counting on "at least one" problems
- Reason about how mean, median, and SD respond to data transformations without computing
- Set up weighted averages by recovering totals from (count × mean)

You now have the structural toolkit for GMAT quant. The next three lessons turn to Verbal — Critical Reasoning, Reading Comprehension, and Test-Day strategy. The skills transfer: clean translation, pattern recognition, and not falling for the trap choice are still the game.
`;
