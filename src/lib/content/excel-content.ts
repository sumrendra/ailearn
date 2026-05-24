/* eslint-disable no-irregular-whitespace */
/**
 * Excel Mastery — 6 lesson bodies aimed at Business Analysts, QA engineers,
 * and Customer Success Managers. Practical, role-aware, lots of inline
 * formula playgrounds (powered by HyperFormula in the browser — real Excel
 * semantics, 380+ functions, no Microsoft account required).
 *
 * Curriculum:
 *   1. Cells, formulas, references — the foundation
 *   2. IF, COUNTIF, SUMIFS — conditional logic
 *   3. VLOOKUP and XLOOKUP — joining data across sheets
 *   4. Cleaning messy data — text functions
 *   5. Pivot tables — the killer skill for any analyst
 *   6. Conditional formatting + charts + dashboards
 */

export const XL_L1 = `# How Excel actually works — cells, formulas, references

Excel is the most-used analytics tool on the planet — and the one most people use *wrong*. They retype the same number in three places, then panic when one of them is stale. They format cells until their eyes hurt instead of letting formulas do the work.

This course fixes that. By the end of six lessons you'll handle the day-to-day Excel work of a **business analyst, QA engineer, or customer success manager** without thinking about it. Lesson 1 is the foundation: how the grid actually works.

## The three things that matter

| Concept | What it is | Why you care |
|---------|-----------|--------------|
| **Cell** | The box at column-letter + row-number (e.g. A1, D7) | Everything else references cells |
| **Formula** | Anything starting with \`=\`. Excel calculates it, you see the result. | The "spreadsheet" in spreadsheet |
| **Reference** | When a formula points at a cell (\`=A1+B1\`) | The thing that breaks when you copy formulas |

Type \`=2+2\` in a cell. Press Enter. You see \`4\`. That's Excel.

Type \`=A1+B1\` and Excel adds the values of A1 and B1. Change A1 — the result updates. **That's the magic.** Data and calculation, automatically connected.

## Your first formulas — try them now

Below is a live Excel sheet running in your browser. Click "Run" to evaluate the formula:

\`\`\`excel-formula
fixture: customers
hint: Sum the MRR (column D) for all 10 customers. Then try changing it to AVERAGE or MAX.
formula: =SUM(D2:D11)
\`\`\`

A few of the chips below the editor show the formulas you'll use most as an analyst. Click any of them to load it.

## Relative vs absolute references — the #1 thing beginners get wrong

When you type \`=A1+B1\` in cell C1 and then **copy it down** to C2, Excel automatically adjusts it to \`=A2+B2\`. This is called a **relative reference** — the formula shifts relative to where you paste it.

Useful 95% of the time. Disastrous the other 5%.

**Example disaster:** you have a total in D20 and you want to compute "% of total" in column E.
- \`=D2/D20\` looks right in row 2
- Copy it down — row 3 becomes \`=D3/D21\`, row 4 becomes \`=D4/D22\` — **D20 keeps sliding out**

The fix is a **dollar sign** (\`$\`) which locks part of the reference:

| You write | Behavior |
|-----------|----------|
| \`A1\` | Both column and row move (full relative) |
| \`$A1\` | Column locked, row moves |
| \`A$1\` | Row locked, column moves |
| \`$A$1\` | Fully absolute — never moves |

**For the % of total disaster above:** write \`=D2/$D$20\`. Now when you copy down, \`D20\` stays put.

Mnemonic: **the \`$\` locks what comes next.**

## A small quiz

\`\`\`excel-quiz
q: You write =A2*$B$1 in cell C2 and copy it down to C5. What does cell C5 contain?
options: =A5*$B$1 | =A2*$B$1 | =A5*$B$4 | =A2*$B$4
correct: 0
explain: $B$1 has both row and column locked with $, so it never moves. The A2 is fully relative, so it shifts down to A5 when you copy down 3 rows.
\`\`\`

## Cell ranges — the colon

A range is shorthand for a rectangle of cells:

| Notation | Meaning |
|----------|---------|
| \`A1:A10\` | A vertical strip — 10 cells from A1 down to A10 |
| \`A1:C1\` | A horizontal strip — 3 cells in row 1 |
| \`A1:C10\` | A 3-column × 10-row block |
| \`A:A\` | The entire column A (handy but slow on huge sheets) |
| \`1:1\` | The entire row 1 |

Most aggregate functions (\`SUM\`, \`AVERAGE\`, \`COUNT\`, \`MAX\`, \`MIN\`) take a range and return a single number. Try it:

\`\`\`excel-formula
fixture: customers
hint: The biggest MRR among the 10 customers.
formula: =MAX(D2:D11)
\`\`\`

## What you can do now

- Read a cell address (A1) and write a formula that references it
- Use \`SUM\`, \`AVERAGE\`, \`MIN\`, \`MAX\`, \`COUNT\` on a range
- Pick the right \`$\` placement so copy-down doesn't break your formulas
- Recognize when "the formula slid" is the actual bug

Next: **IF, COUNTIF, SUMIFS** — adding logic to your formulas. The functions that turn Excel from a calculator into an analysis tool.
`;

export const XL_L2 = `# Conditional logic — IF, COUNTIF, SUMIFS

You can count things. Now count things **conditionally**. "How many customers in London?" "Total revenue from Enterprise plans?" "Bugs that are still open?" These are the formulas a Business Analyst, QA, or CSM uses every single day.

## IF — "do one thing if true, another if false"

The classic conditional:

\`\`\`
=IF(condition, value_if_true, value_if_false)
\`\`\`

Example: flag customers with low MRR.

\`\`\`excel-formula
fixture: customers
hint: Acme Corp has MRR = 4500, which is > 1000, so this returns "Big". Change 1000 to 5000 and see what happens.
formula: =IF(D2>1000,"Big","Small")
\`\`\`

You can nest IFs for multi-way logic, but past 2 levels it gets ugly. Use \`IFS\` instead (Excel 2019+):

\`\`\`
=IFS(D2>5000, "Enterprise", D2>1000, "Pro", TRUE, "Starter")
\`\`\`

Or the newer \`SWITCH\`. Or, often best: do the logic in a helper column and look it up.

## COUNTIF — "how many cells match this?"

\`\`\`
=COUNTIF(range, criterion)
\`\`\`

The bread-and-butter analyst formula. Examples:

\`\`\`excel-formula
fixture: customers
hint: How many of the 10 customers are based in London?
formula: =COUNTIF(B2:B11,"London")
\`\`\`

Criteria can be:
- A literal value: \`"London"\`, \`5000\`
- A comparison string: \`">1000"\`, \`"<>Pending"\`
- A wildcard: \`"*Corp*"\` matches anything containing "Corp"
- A cell reference: \`E1\` (where E1 contains the value to match)

## SUMIF — sum the matching ones

\`\`\`
=SUMIF(criterion_range, criterion, sum_range)
\`\`\`

If \`sum_range\` is omitted, Excel sums the matching cells in \`criterion_range\`. Usually you want a separate sum_range.

\`\`\`excel-formula
fixture: customers
hint: Total MRR from customers based in London — sum column D where column B equals "London".
formula: =SUMIF(B2:B11,"London",D2:D11)
\`\`\`

## SUMIFS / COUNTIFS — multiple conditions

When one condition isn't enough, the **plural-S** versions take multiple (criterion_range, criterion) pairs:

\`\`\`
=SUMIFS(sum_range, crit_range1, crit1, crit_range2, crit2, ...)
=COUNTIFS(crit_range1, crit1, crit_range2, crit2, ...)
\`\`\`

Note the argument order is different from SUMIF — **sum_range comes first** in SUMIFS. Trips everyone up.

\`\`\`excel-formula
fixture: customers
hint: Sum MRR for customers who are in London AND have an Enterprise plan.
formula: =SUMIFS(D2:D11,B2:B11,"London",C2:C11,"Enterprise")
\`\`\`

**The real BA use case:** "ARR from US-based Enterprise customers who renewed in Q3" — that's exactly the SUMIFS pattern. Three conditions, one number.

## QA use case: bug counts by severity + status

Switch fixtures to the bug tracker:

\`\`\`excel-formula
fixture: bugs
hint: How many bugs have severity = P1 AND status = Open?
formula: =COUNTIFS(C2:C11,"P1",E2:E11,"Open")
\`\`\`

This is the formula that drives every "open P1s by team" QA dashboard ever made.

## AVERAGEIF / AVERAGEIFS — same pattern

Average works the same way:

\`\`\`excel-formula
fixture: customers
hint: Average MRR among customers on the Pro plan.
formula: =AVERAGEIF(C2:C11,"Pro",D2:D11)
\`\`\`

## A small quiz

\`\`\`excel-quiz
q: You have a list of orders in column A and statuses in column B. Which formula counts how many orders are "Shipped"?
options: =COUNTIF(A:A,"Shipped") | =COUNTIF(B:B,"Shipped") | =SUMIF(B:B,"Shipped") | =IF(B:B="Shipped",1,0)
correct: 1
explain: COUNTIF needs the column that CONTAINS the criterion. Statuses are in column B, so we count B:B for "Shipped". Choice 1 counts the orders column (wrong column). Choice 3 would sum text values (zero). Choice 4 is invalid array logic.
\`\`\`

## What you can do now

- Use \`IF\` for one condition, \`IFS\` for several
- Count matching cells with \`COUNTIF\` and \`COUNTIFS\`
- Sum matching values with \`SUMIF\` and \`SUMIFS\` (mind the argument order!)
- Combine criteria for real analyst questions like "Open P1 bugs assigned to Alice"

Next: **VLOOKUP and XLOOKUP** — the formulas that join data across sheets. The most-asked-about Excel skill in job interviews.
`;

export const XL_L3 = `# Joining data — VLOOKUP, XLOOKUP, INDEX/MATCH

You have two sheets. Sheet 1 has customer names. Sheet 2 has their ARR. You need them in one place. **That's a lookup**, and it's what gets you hired.

## VLOOKUP — the classic

\`\`\`
=VLOOKUP(lookup_value, table_array, column_index, [exact_match])
\`\`\`

In English: "find this value in the **first column** of this table, then return the value from the *N*-th column of that table."

\`\`\`excel-formula
fixture: customers
hint: Find "Acme Corp" in the customer list and return the 4th column (MRR). FALSE means exact match.
formula: =VLOOKUP("Acme Corp",A2:D11,4,FALSE)
\`\`\`

Three rules that bite everyone:

1. **The lookup value MUST be in the first column** of the table_array. If it's in column 3, VLOOKUP won't find it.
2. **The column index is a number**, not a letter. Counting from the leftmost column of \`table_array\`.
3. **Always pass \`FALSE\` (or \`0\`)** as the 4th argument unless you're doing range-based lookups (you almost never are). Without it, VLOOKUP silently does an approximate match and returns wrong data.

\`\`\`excel-quiz
q: Your data has customer ID in column B and customer name in column A. You want to look up a name by ID. Will =VLOOKUP(123, A:B, 1, FALSE) work?
options: Yes, returns the name | No, ID isn't in the first column | Yes, but only with TRUE | No, must use 2 not 1
correct: 1
explain: VLOOKUP searches the leftmost column of the range you give it. Here that's column A (names), not IDs. You'd need to either reorder the data so ID comes first, or use INDEX/MATCH (or XLOOKUP) which doesn't have this constraint.
\`\`\`

## XLOOKUP — the modern replacement (Excel 2021+ / Microsoft 365)

\`\`\`
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
\`\`\`

The key win: **lookup_array and return_array are separate columns**. No "first column must contain the lookup value" rule. You can look up *left or right*.

\`\`\`excel-formula
fixture: customers
hint: Look up "Acme Corp" in column A, return the matching MRR from column D. No column counting, no left/right restriction.
formula: =XLOOKUP("Acme Corp",A2:A11,D2:D11)
\`\`\`

The optional 4th argument is what to return if nothing matches — usually nicer than \`#N/A\`:

\`\`\`
=XLOOKUP("Foo Corp", A2:A11, D2:D11, "Not found")
\`\`\`

**If your Excel supports XLOOKUP, use it.** It's cleaner, faster, and avoids every classic VLOOKUP bug.

## INDEX/MATCH — the timeless approach

Before XLOOKUP, the way around VLOOKUP's limitations was \`INDEX/MATCH\`:

\`\`\`
=INDEX(return_array, MATCH(lookup_value, lookup_array, 0))
\`\`\`

Read it inside-out:
- \`MATCH("Acme Corp", A2:A11, 0)\` returns the **position** of "Acme Corp" in A2:A11 (say, 1)
- \`INDEX(D2:D11, 1)\` returns the **1st value** in D2:D11

Combined: "find Acme Corp's position in A, return the value at that position in D."

\`\`\`excel-formula
fixture: customers
hint: INDEX/MATCH version of the same lookup. Same result as XLOOKUP, just more verbose.
formula: =INDEX(D2:D11,MATCH("Acme Corp",A2:A11,0))
\`\`\`

INDEX/MATCH still works on **every version of Excel** (XLOOKUP needs 2021+). For widely-shared spreadsheets, it's the safe choice.

## The N/A error and IFERROR

When a lookup fails, Excel returns \`#N/A\` — ugly in a dashboard. Wrap any lookup in \`IFERROR\` to handle it:

\`\`\`
=IFERROR(VLOOKUP("Foo", A:B, 2, FALSE), "Not found")
\`\`\`

XLOOKUP has this built-in as its 4th argument; the others need the wrapper.

## CSM use case: merge customer health into a renewal list

You have a list of accounts coming up for renewal. You also have a separate sheet with health scores. The lookup gives you health-on-the-renewal-list — the dashboard your VP wants.

\`\`\`excel-formula
fixture: customers
hint: Real CSM scenario — look up the health score for a specific account by name.
formula: =XLOOKUP("Cygnus LLC",A2:A11,E2:E11)
\`\`\`

Now you know who's at risk.

## What you can do now

- Use \`VLOOKUP\` (lookup must be in first column, exact match = \`FALSE\`)
- Use \`XLOOKUP\` when available — modern, flexible, no column-counting
- Fall back to \`INDEX/MATCH\` for older Excel or two-way lookups
- Wrap lookups in \`IFERROR\` to handle missing data gracefully

Next: **cleaning messy data** — TRIM, SUBSTITUTE, splitting names, extracting domains. The kind of work that fills 60% of an analyst's day.
`;

export const XL_L4 = `# Cleaning messy data — text functions

Real data is messy. Names have stray spaces. Emails are mixed case. Phone numbers are formatted four different ways. CSVs from sales tools have leading zeros stripped. **Cleaning data is half the job.** Excel has surprisingly powerful tools for it.

## TRIM — kill stray whitespace

The #1 silent data killer is extra spaces. \`"London "\` (with trailing space) is NOT equal to \`"London"\` in Excel — even though they look identical.

\`\`\`
=TRIM(text) — removes leading, trailing, and double internal spaces
\`\`\`

Always TRIM imported data **before** comparing or looking it up. Otherwise your VLOOKUPs will silently fail half the time.

## Case functions — UPPER, LOWER, PROPER

\`\`\`
=UPPER("alice")     → "ALICE"
=LOWER("ALICE")     → "alice"
=PROPER("alice smith") → "Alice Smith"
\`\`\`

Combine with TRIM for the canonical cleanup: \`=PROPER(TRIM(A2))\`.

## LEFT, RIGHT, MID — slicing strings

\`\`\`
=LEFT(text, n)         — first n characters
=RIGHT(text, n)        — last n characters
=MID(text, start, n)   — n characters starting at position 'start' (1-indexed)
\`\`\`

Get the first 3 chars of a SKU? \`=LEFT(A2, 3)\`. Get the last 4 digits of a credit card? \`=RIGHT(A2, 4)\`.

## FIND and SEARCH — locate substrings

\`\`\`
=FIND(needle, haystack) — returns the position. Case-SENSITIVE. Errors if not found.
=SEARCH(needle, haystack) — same but case-INSENSITIVE. Use SEARCH 95% of the time.
\`\`\`

Combine with \`LEFT\` to extract the username from an email:

\`\`\`
=LEFT(A2, SEARCH("@", A2) - 1)
\`\`\`

Translation: "everything before the @ symbol." This kind of compound formula is the *real* Excel skill — knowing which functions to chain.

## SUBSTITUTE — find-and-replace inside a formula

\`\`\`
=SUBSTITUTE(text, old_text, new_text, [nth_occurrence])
\`\`\`

Clean up a phone number? \`=SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(A2, "-", ""), "(", ""), ")", "")\` strips dashes and parens.

## CONCAT and TEXTJOIN — combining strings

\`\`\`
=CONCAT(A2, " ", B2)              — joins values; old-school
=A2 & " " & B2                    — same thing with the & operator (shorter)
=TEXTJOIN(", ", TRUE, A2:A10)     — joins a range with a delimiter; TRUE skips blanks
\`\`\`

TEXTJOIN is the magic for "all email addresses, comma-separated" — perfect for "send this to..." emails.

## A real cleanup challenge

You receive a CSV from sales. The "City" column has values like \`" london"\`, \`"London"\`, \`"LONDON "\`. Your VLOOKUPs are returning \`#N/A\` for half the rows. **Solution:**

\`\`\`
=PROPER(TRIM(A2))
\`\`\`

Pasted in a helper column. Now every variant becomes \`"London"\`. Use *that* column for your VLOOKUPs.

## Splitting a full name into first and last

The textbook problem. \`"Alice Smith"\` → \`"Alice"\` and \`"Smith"\`.

- First name: \`=LEFT(A2, SEARCH(" ", A2) - 1)\`
- Last name: \`=MID(A2, SEARCH(" ", A2) + 1, LEN(A2))\`

(Excel 365 has a shortcut: **Text-to-Columns** wizard or **TEXTSPLIT** function. But the formula approach works everywhere.)

\`\`\`excel-quiz
q: What does =LEFT("alice@example.com", SEARCH("@", "alice@example.com") - 1) return?
options: alice@ | alice | example | @example.com
correct: 1
explain: SEARCH("@", ...) returns 6 (position of @). Subtract 1 to get 5. LEFT takes the first 5 characters: "alice".
\`\`\`

## QA use case — extracting test IDs

Your bug titles look like \`"TC-1042: Login fails on Safari"\`. You want a column with just the test case ID.

\`\`\`
=LEFT(A2, SEARCH(":", A2) - 1)
\`\`\`

Result: \`"TC-1042"\`. Now you can VLOOKUP into your test plan sheet.

## Find & Replace — the GUI alternative

Ctrl-H (or Cmd-Shift-H on Mac) opens **Find and Replace**. Don't underestimate it — for one-shot cleanups, it's faster than writing formulas. Replace all \`"  "\` (double space) with \`" "\` (single space). Replace all \`"#REF!"\` with empty.

But for *repeating* cleanups, formulas win because they re-run automatically when data changes.

## What you can do now

- Strip whitespace with \`TRIM\`; normalize case with \`UPPER\` / \`LOWER\` / \`PROPER\`
- Slice strings with \`LEFT\`, \`RIGHT\`, \`MID\`
- Find substrings with \`FIND\` (case-sensitive) and \`SEARCH\` (case-insensitive)
- Replace text inside formulas with \`SUBSTITUTE\`
- Chain functions together — extract domain from email, split full name, etc.

Next: **pivot tables** — the single most important Excel skill for a Business Analyst.
`;

export const XL_L5 = `# Pivot tables — the analyst's superpower

A pivot table is **drag, drop, get answer**. You point Excel at messy raw data and ask "summarize this by City and Plan, showing total MRR" — and Excel just does it. Without writing a single formula.

If you learn one thing from this entire course, **learn pivot tables.** They turn a 10-minute SUMIFS-and-COUNTIFS slog into 30 seconds of clicking. Every business analyst job interview tests this.

## What a pivot table actually is

Take this raw data:

| Customer | City | Plan | MRR |
|----------|------|------|-----|
| Acme | NY | Enterprise | 4500 |
| Beta | London | Pro | 1200 |
| ... | ... | ... | ... |

A pivot table reorganizes it into a *summary view*:

| | Enterprise | Pro | Starter |
|---|---|---|---|
| **London** | 11700 | 1200 | 0 |
| **New York** | 12500 | 0 | 200 |
| **Berlin** | 0 | 2400 | 0 |
| **Paris** | 0 | 1500 | 200 |

Three "axes" of a pivot:
- **Rows** — what you list down the side (City)
- **Columns** — what you list across the top (Plan)
- **Values** — what gets aggregated in each cell (SUM of MRR)

Optionally a fourth: **Filter** — narrows the whole pivot to e.g. one quarter.

## Try it — build a pivot live

Below is a simulator. Click field names to add them to Rows/Columns/Values. Watch the result update.

\`\`\`excel-pivot
fixture: customers
rows: City
cols: Plan
values: MRR:sum
\`\`\`

Try these tweaks:
- Remove "Plan" from Columns and add it to Rows instead. See the difference.
- Add "Name" to Values with COUNT aggregator — now you also see *how many customers* per City × Plan combo.
- Reset and put "Health" in Rows, "City" in Columns, COUNT of Name in Values. That's a "customer health by city" view.

## Picking the aggregator

For numeric Value fields:
- **SUM** — adds them up (revenue, MRR, count of bugs)
- **AVERAGE** — useful for ratios (avg order value, avg days open)
- **MIN / MAX** — earliest date, biggest deal
- **COUNT** — number of non-empty rows (regardless of value)

For text Value fields, only COUNT really makes sense.

## CSM use case — health by region

\`\`\`excel-pivot
fixture: customers
rows: City
cols: Health
values: Name:count
\`\`\`

That's a "customer-count by city × health-status" matrix — the visual you put in your QBR slide deck.

## QA use case — open bugs by severity per assignee

\`\`\`excel-pivot
fixture: bugs
rows: Assignee
cols: Severity
values: ID:count
\`\`\`

That's the dashboard every QA lead lives in.

## In real Excel — the workflow

1. Click anywhere inside your data (Excel auto-detects the range).
2. **Insert → PivotTable** (Mac: ⌘⇧⏎ key combo, or the ribbon).
3. Choose "New worksheet" so it doesn't clobber your raw data.
4. The PivotTable Fields panel appears on the right.
5. **Drag fields** into Rows / Columns / Values / Filters.
6. Click any Value field → "Value Field Settings" to change SUM ↔ AVERAGE ↔ COUNT.
7. **Pivot updates live** as you change the layout.

## Date grouping — the killer feature

If you put a *date* column in Rows, Excel will let you **group by Month, Quarter, Year** with right-click → Group. Suddenly daily transaction data becomes monthly revenue with two clicks. There is no formula that does this as cleanly.

## Slicers — the dashboard primitive

Click your pivot, then **PivotTable Analyze → Insert Slicer**. Pick a field (say, "City"). You get clickable city buttons that filter the whole pivot. Multiple pivots on one sheet, one slicer — instant dashboard.

## The biggest pivot table trap

**You changed the source data but the pivot didn't update.** Right-click any pivot cell → **Refresh**. Or click PivotTable Analyze → Refresh. Pivots cache their source. If you forget, you'll show stale numbers in a meeting. It happens to everyone once.

\`\`\`excel-quiz
q: You want a pivot table showing "average days bugs are open, by severity." Which Field placement is correct?
options: Rows = Days Open, Values = Severity (count) | Rows = Severity, Values = Days Open (avg) | Rows = Severity, Columns = Days Open | Rows = Assignee, Values = Severity (avg)
correct: 1
explain: "By severity" → Severity goes in Rows (one row per severity level). "Average days open" → the numeric field "Days Open" goes in Values, with AVG as the aggregator. Choice 1 has them swapped. Choice 3 would create a column for every distinct day value.
\`\`\`

## What you can do now

- Build a pivot from scratch by dragging Rows / Columns / Values
- Pick the right aggregator (SUM / COUNT / AVG / MIN / MAX) for the question
- Group dates by Month or Quarter for trend views
- Add slicers for instant filtering
- Refresh when source data changes (the #1 pivot bug)

Next: **conditional formatting, charts, and putting it all together** — making your analysis look like a dashboard, not a spreadsheet.
`;

export const XL_L6 = `# Visualizing — conditional formatting, charts, dashboards

You can crunch numbers. Now you need to **present them**. A polished dashboard moves stakeholders to action; a wall of numbers gets ignored. This last lesson is about making your analysis *seen*.

## Conditional formatting — make the data tell its own story

Conditional formatting colors cells based on their values. Without writing a formula. Use cases:

| Pattern | Use case |
|---------|----------|
| **Color scale** (red → yellow → green) | MRR rankings, health scores |
| **Data bars** (in-cell bar chart) | Quick "who's biggest" visual |
| **Icon sets** (▲/▬/▼ or traffic lights) | Trend at a glance, status |
| **Highlight cells > X** | Flag big deals, overdue items |
| **Top/bottom N** | "Top 10 customers" automatically |

How: **Home → Conditional Formatting** → pick a rule. Excel applies it to your selection. Update the data, the colors update.

**The pro move:** use a **formula-based rule** for things like "highlight the entire row if column E = 'Red'." Conditional formatting becomes its own programming language.

## Charts — pick the right one

Excel has 20+ chart types. Most of them you should never use. The rules:

| Question | Chart |
|----------|-------|
| How does X compare across categories? | **Bar / Column** |
| How does X change over time? | **Line** |
| How do parts contribute to a whole? | **Stacked bar** (NOT pie — pies are hard to read) |
| Two related variables? | **Scatter** |
| Pattern in a 2D matrix? | **Heatmap** (formatted table) |

**Never use:** 3D charts (visually misleading), pie charts with more than 4-5 slices, stacked area charts unless you really know what you're doing.

**Best practice:** label your axes, use a title that's a sentence not a noun (\`"MRR grew 23% YoY"\` not \`"MRR by Quarter"\`), and remove every gridline / border / shadow that isn't essential.

## Building a one-page dashboard

The recipe:

1. **Sheet 1: Raw data.** Untouched. Never edit by hand.
2. **Sheet 2: Pivots + helper formulas.** Calculation layer.
3. **Sheet 3: Dashboard.** Charts and big numbers. Linked to Sheet 2.

The reason: when the raw data refreshes, the pivots and dashboard re-flow automatically. No re-creating charts.

## Big-number tiles

Stakeholders want one number, big and bold:

\`\`\`
[ ARR ]
$1.2M
↑ 14% YoY
\`\`\`

In Excel: a cell with a formula (\`=SUM(...)\` or \`=GETPIVOTDATA(...)\`) styled at 36pt font, centered, with a small label above. Surround with a thin border. Stack 4-6 of these across the top of your dashboard.

## CSM use case — renewal risk dashboard

The structure your VP will love:

1. **Top row:** big numbers — ARR up for renewal this quarter, count of accounts, % at risk
2. **Middle:** Pivot showing accounts by renewal month × health status
3. **Bottom:** Top 10 at-risk accounts (filtered list, conditional formatting on health)

One page, scannable in 10 seconds.

## BA use case — operational metrics

- KPI tiles: orders today, revenue today, conversion rate
- Trend lines: 30-day revenue, 30-day signups
- Pivot: revenue by product category
- Slicer: region, so the VP can click and the whole dashboard re-filters

## QA use case — defect dashboard

- Tiles: open bugs, open P1 bugs, avg days open
- Chart: bugs open vs closed over time (line)
- Pivot: open bugs by assignee × severity
- Heatmap of bugs by component × severity

## Things that make a dashboard look professional

- **One header font, one body font.** Don't mix.
- **Three colors max** + neutrals. Pick a "this is good" green and a "this is bad" red, use them sparingly.
- **Numbers right-aligned, headers centered, text left-aligned.** Always.
- **Round numbers** — \`$1.2M\` not \`$1,247,308.42\`. (Use \`=ROUND\` or cell formatting.)
- **Add tiny context labels** — "vs last quarter", "trailing 30 days" — so a number isn't ambiguous.
- **No grid lines.** View → uncheck Gridlines.

## When to leave Excel

Excel is amazing at:
- Quick analyses up to a few hundred thousand rows
- One-off dashboards for a small team
- Prototyping a dashboard before building it elsewhere

Excel is NOT good at:
- Multi-million row datasets (use Power Query / a database / BigQuery)
- Real-time dashboards (use Looker, Tableau, Metabase)
- Long-term maintained reporting (becomes a maintenance nightmare)
- Anything multiple people edit simultaneously (Sheets is better here)

Knowing when to graduate from Excel is itself an Excel skill.

## What you've learned — the whole course

| Lesson | Skill |
|--------|-------|
| 1 | The grid, formulas, the \`$\` reference trick |
| 2 | IF, COUNTIF, SUMIFS — conditional logic |
| 3 | VLOOKUP, XLOOKUP, INDEX/MATCH — joining data |
| 4 | TRIM, SUBSTITUTE, LEFT/RIGHT/MID — cleaning |
| 5 | Pivot tables — drag-drop summaries |
| 6 | Conditional formatting + charts + dashboards |

That's the working analyst's Excel toolkit. With these you can do 90% of what a Business Analyst, QA engineer, or CSM does in a typical week — confidently, fast, and without copying-and-pasting numbers between three places.

The remaining 10% is **Power Query** (transforming data) and **macros / VBA** (automating repetitive tasks). Worth learning once you've internalized everything in this course. Until then, **build dashboards, look at real data, ask real questions.** That's how Excel sticks.
`;
