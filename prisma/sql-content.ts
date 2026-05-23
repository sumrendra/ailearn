/* eslint-disable no-irregular-whitespace */
/**
 * SQL Mastery — 6 lesson bodies, rewritten in the same friendly beginner
 * voice as L1, with SqlPlayground blocks embedded throughout so learners
 * actually *run* the queries they're reading about.
 *
 * Existing L1 lives in seed.ts and is the template for the voice.
 */

export const SQL_L2 = `# Joins — combining two tables

In lesson 1, you queried one table at a time. Real questions almost never live in one table. "Show me orders **with the customer's name attached**" needs the \`orders\` table AND the \`customers\` table. **Joins** are how you stitch them together.

Don't worry about the formal definition. Think of it like this: a join is **"for each row on the left, find matching rows on the right, and glue them together."**

## See it with real data

Click "Run" to see how the orders table maps to customer names.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: Look at the result — every row now has both order info AND customer info attached.
SELECT
  o.id        AS order_id,
  o.total,
  c.name      AS customer_name,
  c.city
FROM orders o
JOIN customers c ON c.id = o.customer_id;
\`\`\`

That \`ON c.id = o.customer_id\` is the **glue**. It tells Postgres: "match orders to customers by their IDs." Without it, you'd get every order × every customer — a Cartesian explosion. Don't do that.

## The four flavors

There are four ways to handle missing matches. They sound technical but the difference is intuitive:

| Join type | What happens to rows with no match? |
|-----------|--------------------------------------|
| **INNER JOIN** (default) | Drop them. Only matched rows survive. |
| **LEFT JOIN** | Keep all rows from the **left** table, fill nulls on the right. |
| **RIGHT JOIN** | Keep all rows from the **right** table, fill nulls on the left. |
| **FULL JOIN** | Keep everything from both sides, fill nulls where unmatched. |

99% of the time you'll use **INNER** or **LEFT**. Let's see why you'd choose LEFT over INNER.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: This is INNER JOIN. Only customers WITH orders appear. Try switching JOIN to LEFT JOIN — you'll see customers with zero orders showing up too.
SELECT
  c.name,
  COUNT(o.id) AS order_count
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name;
\`\`\`

> **Try it:** change \`JOIN\` to \`LEFT JOIN\`. Did anyone with zero orders appear? That's the difference.

## The classic gotcha — filtering an outer join

This is the #1 mistake every SQL beginner makes. Look at this query:

\`\`\`sql
SELECT *
FROM orders o
LEFT JOIN refunds r ON r.order_id = o.id
WHERE r.status = 'pending';
\`\`\`

Looks fine, right? **It silently becomes an INNER JOIN.**

Why: rows from \`orders\` with no refund get \`NULL\` in the \`r.status\` column. Then your \`WHERE r.status = 'pending'\` filters them out — because \`NULL = anything\` is \`UNKNOWN\` in SQL, not \`TRUE\`. So unmatched rows die in the WHERE filter and you only see rows that *had* a refund.

**The fix:** move the predicate into the JOIN \`ON\` clause:

\`\`\`sql
LEFT JOIN refunds r ON r.order_id = o.id AND r.status = 'pending'
\`\`\`

Now non-matching rows still come through (with NULL refund columns intact).

## Your turn — try it

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: This query asks "what did every order contain?" — joining orders to order_items to products.
SELECT
  o.id           AS order_id,
  p.name         AS product,
  oi.quantity,
  oi.unit_price
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
ORDER BY o.id;
\`\`\`

This chains three joins. Read it like a sentence: "for each order, find its items, then find the product for each item." Each \`JOIN ... ON ...\` is one step in that chain.

## What you can do now

- Stitch two tables together with \`INNER JOIN\`
- Use \`LEFT JOIN\` when you want unmatched rows preserved
- Spot the "filtering an outer join in WHERE" trap and fix it
- Chain three or more joins to walk through related tables

Next: **how to summarize data** — counting, averaging, grouping. The questions you ask once your data starts adding up.
`;

export const SQL_L3 = `# Counting, summing, grouping — answering "how many" questions

You can query rows. You can join tables. Now you need to **summarize**. "How many orders does each customer have?" "What's the total revenue per city?" These are **aggregation** questions and SQL has gorgeous tools for them.

## Counting things

The simplest aggregate: \`COUNT(*)\`.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: COUNT(*) returns one row with the total. Try replacing * with the actual count of customers in different cities.
SELECT COUNT(*) AS total_orders FROM orders;
\`\`\`

One number. But what if I want a count **per customer**? Add \`GROUP BY\`.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: GROUP BY collapses rows into groups. Then COUNT counts within each group.
SELECT
  customer_id,
  COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
\`\`\`

That's the pattern: **what you GROUP BY shows once. What you AGGREGATE summarizes within each group.**

## The other aggregates

| Function | What it does |
|----------|--------------|
| \`COUNT(*)\` | Count rows (including nulls) |
| \`COUNT(col)\` | Count non-null values |
| \`SUM(col)\` | Add them up |
| \`AVG(col)\` | Average |
| \`MIN(col)\` | Smallest |
| \`MAX(col)\` | Largest |

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: All five aggregates in one query — total revenue, biggest order, average order, etc.
SELECT
  COUNT(*)         AS orders,
  SUM(total)       AS revenue,
  AVG(total)       AS avg_order,
  MIN(total)       AS smallest,
  MAX(total)       AS biggest
FROM orders;
\`\`\`

## Grouping by combinations

You can GROUP BY more than one column. Each unique combination becomes a row.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: Group by city to see revenue and order count per city. Add ORDER BY revenue DESC at the end to sort.
SELECT
  c.city,
  COUNT(o.id)   AS orders,
  SUM(o.total)  AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.city;
\`\`\`

> **Try it:** add \`ORDER BY revenue DESC\` to the end. Which city is the biggest?

## WHERE vs HAVING — the one that confuses everyone

Both filter. The difference:

- **WHERE** filters **rows** before grouping
- **HAVING** filters **groups** after aggregating

If you want "only customers who placed more than 2 orders," you can't use WHERE — the count doesn't exist row-by-row, only after grouping. You need HAVING:

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: HAVING filters AFTER the aggregate is computed. WHERE would error if you tried COUNT(*) > 2.
SELECT
  customer_id,
  COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;
\`\`\`

## A more interesting question

Let's combine everything: "For each city, what's the average order value, but only for cities with at least 2 orders?"

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: All four clauses working together: JOIN to bring tables together, WHERE filters rows, GROUP BY collapses, HAVING filters the groups.
SELECT
  c.city,
  ROUND(AVG(o.total), 2) AS avg_order,
  COUNT(*)               AS orders
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.city
HAVING COUNT(*) >= 1
ORDER BY avg_order DESC;
\`\`\`

## What you can do now

- Count, sum, average any column
- Group results by one or more columns
- Use \`HAVING\` to filter groups after aggregation
- Combine JOIN + WHERE + GROUP BY + HAVING + ORDER BY into a single answer

Next: **performance** — making queries that run fast on big tables. You'll meet the magic word: **index**.
`;

export const SQL_L4 = `# Performance — why your query is slow

Your query works. On 10 rows it returns instantly. On 10 million rows it takes 40 seconds. What changed? **The query is the same — but Postgres now has to look at every single row.** This lesson is about making it not do that.

## EXPLAIN — see what Postgres is actually doing

Before you can fix slow queries, you have to **read** them. Postgres has a magic command: \`EXPLAIN\`.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: EXPLAIN doesn't run the query — it shows you the PLAN Postgres would use. Look for "Seq Scan" (slow on big tables) vs "Index Scan" (fast).
EXPLAIN
SELECT * FROM orders WHERE customer_id = 1;
\`\`\`

You'll see something like \`Seq Scan on orders\`. That means Postgres reads **every row** to find the matches. Fine for 10 rows. Disaster for 10 million.

## Indexes — the magic word

An **index** is like the index at the back of a book. Instead of reading the whole book to find every mention of "Postgres," you flip to the index, find "Postgres → pages 47, 102, 211," and jump straight there.

In Postgres, you create one with:

\`\`\`sql
CREATE INDEX ON orders (customer_id);
\`\`\`

After that, \`WHERE customer_id = ?\` becomes a near-instant lookup regardless of table size.

> **The catch:** indexes take space, and they slow down writes (every INSERT/UPDATE has to update the index too). Don't index everything. Index the columns you actually filter or join on.

## When indexes don't help — silently

These look fine but defeat the index:

\`\`\`sql
-- ❌ Function on the column
WHERE LOWER(email) = 'foo@example.com'
-- Index on (email) is useless. Solution: index on LOWER(email).

-- ❌ Leading wildcard
WHERE name LIKE '%smith'
-- B-tree indexes can't search backward. Use a GIN/trigram index for this.

-- ❌ Implicit type cast
WHERE varchar_col = 123
-- Postgres might cast every row to int. Quote it: WHERE varchar_col = '123'.
\`\`\`

If your EXPLAIN shows \`Seq Scan\` when you expected an index lookup, suspect one of these.

## Composite indexes — order matters

An index on \`(customer_id, status)\` covers:
- \`WHERE customer_id = ? AND status = ?\` — yes, perfect
- \`WHERE customer_id = ?\` — yes, the index is sorted by customer_id first
- \`WHERE status = ?\` — **no!** Status isn't the leading column

**The rule:** **equality columns first, range or sort columns last.**

## Partial indexes — index only what matters

If 99% of your rows have \`status = 'completed'\` but you mostly query the 1% pending, don't index everything:

\`\`\`sql
CREATE INDEX ON orders (created_at) WHERE status = 'pending';
\`\`\`

Tiny index, super fast lookups, no cost on the 99% of writes that touch completed rows. Massive wins for skewed data.

## See it in action

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: EXPLAIN ANALYZE actually RUNS the query and shows real timing. The numbers in parentheses tell you exactly how many rows each step processed.
EXPLAIN ANALYZE
SELECT * FROM order_items WHERE order_id = 1;
\`\`\`

Read the output bottom-up. Each line is a step in the plan. The numbers in parens are *cost estimate / actual rows*. If those are wildly different, your stats are stale (run \`ANALYZE\`).

## The optimization loop

1. **Slow query?** Run \`EXPLAIN ANALYZE\` first. Always.
2. **Find the worst node** — biggest \`actual rows × loops\`, or the obvious \`Seq Scan\` on a big table.
3. **Hypothesis** — missing index, stale stats, wrong join order, too-many-rows-returned?
4. **Test the fix** — add the index, rewrite the query, whatever.
5. **Re-run \`EXPLAIN ANALYZE\`** — did the plan actually change?

Optimization without measurement is guessing.

## What you can do now

- Read an EXPLAIN plan and spot \`Seq Scan\` vs \`Index Scan\`
- Pick which columns to index, and in what order (equality first)
- Use partial indexes for skewed data
- Recognize patterns that secretly defeat indexes

Next: **transactions** — what happens when two people try to write to the same row at the same time. Concurrency is where databases get scary.
`;

export const SQL_L5 = `# Transactions — when two things happen at once

So far every query we ran was alone. In production, **thousands** of queries are running simultaneously. What happens when two users try to buy the last item at the same time? Or transfer money to the same account?

This lesson is about **transactions** — the mechanism that prevents your database from becoming a mess under concurrent access.

## What's a transaction?

A transaction is a group of statements that either **all succeed** or **all fail together**. Think of transferring $100 from account A to account B:

\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

If the server crashes between those two UPDATEs, you don't want $100 to vanish from one account and never appear in the other. The transaction guarantees: **either both updates happen, or neither does**. That's the **A** in ACID — atomicity.

## The lost-update bug — the classic concurrency disaster

Imagine two users both try to add $20 to a shared account that has $100:

\`\`\`
User A reads balance: 100
User B reads balance: 100
User A calculates: 100 + 20 = 120
User B calculates: 100 + 20 = 120
User A writes: 120
User B writes: 120  ← overwrites A's write!
Final: 120 (should be 140)
\`\`\`

**One of the $20 additions vanished.** This is the classic "lost update" bug, and it's caused millions of dollars of bugs in production systems.

## Three ways to fix it

### Fix 1: Atomic update (best)

Don't read-then-write. Express the change as a single operation that happens **inside** the database:

\`\`\`sql
UPDATE accounts SET balance = balance + 20 WHERE id = 1;
\`\`\`

No read-modify-write race. The database does the addition atomically.

### Fix 2: Pessimistic locking — SELECT FOR UPDATE

If you really need to read first (maybe to validate), lock the row:

\`\`\`sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- ...other transactions wanting to modify this row now WAIT...
UPDATE accounts SET balance = 120 WHERE id = 1;
COMMIT;
\`\`\`

Other transactions block until you COMMIT or ROLLBACK. Safe but can cause queues to build up under heavy load.

### Fix 3: Optimistic concurrency — version columns

Add a \`version\` column. On update, check it still matches what you read:

\`\`\`sql
UPDATE accounts
SET balance = 120, version = version + 1
WHERE id = 1 AND version = 7;
\`\`\`

If \`rowCount = 0\`, someone else updated between your read and write. Retry. Best for low-contention workloads.

## Try it yourself

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: Increment the total of order #1 by 10, atomically. No read-modify-write — just one statement.
UPDATE orders SET total = total + 10 WHERE id = 1 RETURNING id, total;
\`\`\`

Run it twice — see the value go up by 20 total. Atomic. No race.

## SKIP LOCKED — a hidden gem

When you have a queue of jobs and multiple workers, you want each worker to grab a different job:

\`\`\`sql
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;
\`\`\`

\`SKIP LOCKED\` means: "if another transaction has already locked this row, **skip it and try the next one**." Multiple workers grab different jobs without blocking each other. This is how you build a scalable job queue in pure Postgres — no Redis, no RabbitMQ.

## What you can do now

- Group statements into a transaction with \`BEGIN; ... COMMIT;\`
- Recognize the lost-update bug and pick the right fix (atomic > optimistic > pessimistic, in that preference order)
- Use \`SELECT ... FOR UPDATE\` to lock rows safely
- Build a job queue with \`SKIP LOCKED\`

Next: **the advanced features** — recursive queries, JSON columns, and pgvector for AI. The stuff that makes Postgres a one-stop shop.
`;

export const SQL_L6 = `# Postgres beyond the basics — CTEs, JSON, and AI

You've built solid SQL skills. This last lesson covers the **power tools** — the features that turn Postgres from "a database" into "a general-purpose data platform." We'll see why people are dropping their separate analytics warehouses, search engines, and vector databases in favor of just running everything in Postgres.

## CTEs — name your subqueries

A **Common Table Expression** is a named subquery. Read it like a paragraph: "first, get the recent orders; then, sum them up; finally, filter to the big spenders."

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: Each WITH ... AS (...) is a named step. Much more readable than nesting subqueries.
WITH big_orders AS (
  SELECT customer_id, total
  FROM orders
  WHERE total > 100
),
spending AS (
  SELECT customer_id, SUM(total) AS spent
  FROM big_orders
  GROUP BY customer_id
)
SELECT c.name, s.spent
FROM customers c
JOIN spending s ON s.customer_id = c.id
ORDER BY s.spent DESC;
\`\`\`

CTEs are pure readability — they don't change what's possible, they just keep complex queries comprehensible. Use them liberally.

## Recursive CTEs — walk a tree

If you have hierarchical data (org chart, comment threads, category trees), recursive CTEs let you walk them in pure SQL.

\`\`\`sql
WITH RECURSIVE descendants AS (
  -- Base case: start with row id=1
  SELECT id, name, parent_id, 1 AS depth
  FROM categories WHERE id = 1

  UNION ALL

  -- Recursive case: anyone whose parent is already in the set
  SELECT c.id, c.name, c.parent_id, d.depth + 1
  FROM categories c
  JOIN descendants d ON c.parent_id = d.id
)
SELECT * FROM descendants;
\`\`\`

Same shape works for org charts, dependency graphs, comment threads, bill-of-materials.

## JSON — when you don't want a fixed schema

Some columns are just too variable to make their own table. Maybe it's an event log where every event type has different fields. **JSONB** to the rescue.

\`\`\`sql
ALTER TABLE events ADD COLUMN payload JSONB;

-- Insert some flexibly-shaped data
INSERT INTO events (payload) VALUES
  ('{"type": "signup", "user_id": 42}'),
  ('{"type": "purchase", "user_id": 42, "amount": 99.99, "items": [1, 5]}');

-- Query into the JSON
SELECT payload->>'user_id' AS user_id, payload->>'type' AS type
FROM events
WHERE payload @> '{"type": "signup"}';
\`\`\`

| Operator | Meaning |
|----------|---------|
| \`->\` | Get JSON value at key |
| \`->>\` | Get value as text |
| \`@>\` | Left contains right (great with a GIN index) |
| \`?\` | Key exists |

Use JSONB for **truly flexible** data. Don't use it for things that should be real columns — you lose type safety and query performance.

## pgvector — Postgres for AI

If you're building anything AI-flavored — semantic search, RAG, recommendations — you need a vector database. **Or do you?** \`pgvector\` puts vector search **inside Postgres**, so you don't need a separate system.

\`\`\`sql
CREATE EXTENSION vector;

CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT,
  embedding VECTOR(1536)        -- 1536-dim vector (OpenAI ada-002)
);

-- Create an HNSW index for fast approximate nearest-neighbor search
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Find the 5 most semantically similar documents to a query embedding
SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM documents
ORDER BY embedding <=> $1
LIMIT 5;
\`\`\`

The \`<=>\` operator is cosine distance — what you want for modern text embeddings. There's also \`<->\` (Euclidean) and \`<#>\` (dot product) for other models.

## The Postgres-for-everything stack

For an AI app, here's what pgvector + JSONB + full-text search lets you do, all in **one database**:

- **Document storage** in TEXT columns
- **Metadata** in JSONB columns (filterable with GIN)
- **Semantic search** with pgvector embeddings + HNSW
- **Keyword search** with built-in full-text indexes
- **All in one transaction**, with one backup, one set of access controls

It's hard to overstate how much complexity this removes from a typical AI stack.

\`\`\`sql-playground
-- @fixture: ecommerce
-- @hint: A real-world UPSERT pattern. ON CONFLICT handles the "create or update" case in one round trip.
INSERT INTO customers (id, name, email, city)
VALUES (1, 'Alice Updated', 'alice@new.com', 'Paris')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    email = EXCLUDED.email;

SELECT * FROM customers WHERE id = 1;
\`\`\`

\`ON CONFLICT ... DO UPDATE\` is the clean way to say "create the row if it doesn't exist, otherwise update it." \`EXCLUDED\` refers to the values you tried to insert.

## What you've learned across this course

If you've made it through all six lessons:
- **Lesson 1:** Think in sets, not loops. Read SQL clauses in execution order, not write order.
- **Lesson 2:** Stitch tables with JOINs. Watch out for the LEFT-JOIN-in-WHERE trap.
- **Lesson 3:** Summarize with COUNT/SUM/AVG and GROUP BY. Use HAVING to filter groups.
- **Lesson 4:** Read EXPLAIN plans. Index the columns you filter on. Equality first in composite indexes.
- **Lesson 5:** Wrap concurrent work in transactions. Prefer atomic updates; use FOR UPDATE when you must read-then-write.
- **Lesson 6:** Reach for CTEs, JSONB, and pgvector when you need more than basic CRUD.

That's most of what you need to use Postgres confidently in production. The remaining frontier is operations — backups, replication, vacuum tuning — but as the engineer who *writes* the queries, you now have the toolkit. Bonne continuation!
`;
