/* eslint-disable no-irregular-whitespace */
/**
 * System Design — 6 lessons covering the interview framework, scalability,
 * databases at scale, async architecture, real-time/distributed concerns,
 * and the classic system design problems.
 *
 * Designed for senior+ interviews at scaled companies. Heavy on tradeoffs,
 * the kind of analysis senior interviewers want to see you do live.
 */

export const SD_L1 = `# The system-design interview — the framework

A system-design interview has nothing to do with code. **It tests whether you can scope a problem, reason about tradeoffs, and design something that would survive contact with real traffic.** Most candidates fail not because they don't know the technology — but because they jump to solutions without doing the upfront work.

This lesson is the framework. Use it on every problem and you'll pass.

## The 45-minute structure

A typical 45-minute interview:

| Time | What | What you actually do |
|------|------|----------------------|
| 0-5 min | **Clarify requirements** | Ask questions; don't assume |
| 5-10 min | **Estimate scale** | Back-of-envelope: QPS, storage, bandwidth |
| 10-15 min | **API design** | What endpoints exist; what they return |
| 15-25 min | **High-level architecture** | Diagram the major components |
| 25-40 min | **Deep dive** | The interviewer picks one area to drill on |
| 40-45 min | **Tradeoffs + extensions** | What you'd do differently with more time |

**The most common failure mode**: candidates spend 2 minutes on requirements, jump to "let me draw a load balancer." The senior interviewer is silently grading the upfront thinking — that's where you separate yourself.

## Step 1 — clarify requirements (the most undervalued step)

The interviewer says "design Twitter." Don't start drawing.

Ask:
- **Scope**: Tweets only? DMs? Search? Trends? Notifications?
- **Users**: How many DAU? Reads vs writes?
- **Read patterns**: Timeline (chronological? algorithmic?)? Profile views?
- **Write patterns**: Tweet rate? Likes/retweets rate?
- **Constraints**: Media (images/video)? Latency budget? Geographic distribution?
- **Non-functional**: Consistency model (eventually consistent OK)? Availability target?

The interviewer is loosely scripted; clarifying these gives you a **scoped, defensible problem** to solve. Without it, you're designing in fog.

## Step 2 — estimate scale (back of envelope)

Numbers ground the design. Even rough ones force you to confront reality.

\`\`\`
Twitter-like: 500M DAU
Tweet rate:   500M users × 0.5 tweets/day avg = 250M tweets/day
              ÷ 86400 seconds = ~2900 tweets/sec average
              Peak: 5-10× average = ~30K/sec peak

Read rate:    Each user reads 100 tweets/day → 50B reads/day
              = 580K reads/sec average, ~5M peak

Storage:      280 char tweet × ~500 bytes overhead = 1 KB/tweet
              250M tweets/day × 365 days = ~90 TB/year of tweet text
              Plus media (much bigger): 100 KB × 50M media tweets/day = 5 TB/day

Bandwidth:    5M reads/sec × 1 KB = 5 GB/sec read bandwidth
              30K writes/sec × 1 KB = 30 MB/sec write bandwidth
\`\`\`

Now the architecture follows:
- 580K reads/sec → can't hit DB on every read → must cache heavily
- 30 MB/sec writes → easy to handle in one DB region (but global distribution adds complexity)
- 90 TB/year → need to think about sharding & archival
- 5 GB/sec serving → CDN essential

**You don't need to memorize these.** Practice estimating powers-of-10 quickly. Be off by 2× — fine. Be off by 1000× — failed.

## Step 3 — API design

Sketch the public surface. Keeps you focused on what the system actually does.

\`\`\`
POST /tweet                    Body: text, replyTo?, media[]?
GET /timeline?cursor=...       Returns: list of tweets
POST /follow/{userId}
GET /user/{userId}/profile
GET /search?q=...
\`\`\`

Three things to call out:
- **Pagination** — cursor-based (not offset) for high-traffic feeds
- **Auth** — JWT in Authorization header (mention but don't dwell)
- **Idempotency keys** — for POST operations users might retry

## Step 4 — high-level architecture

Draw boxes:

\`\`\`
                ┌───────┐
                │  CDN  │  (static + media)
                └───┬───┘
                    │
[Client]──HTTPS──▶ [LB] ──▶ [API Gateway] ──▶ [Services]
                                                  │
                                                  ├──▶ [Cache: Redis]
                                                  ├──▶ [Sharded SQL/NoSQL]
                                                  └──▶ [Search: Elasticsearch]
                                                  │
                                                  └──▶ [Kafka] ──▶ [Async workers]
                                                                  ├─ Fan-out timeline
                                                                  ├─ Notifications
                                                                  └─ Analytics
\`\`\`

Call out the **why** for each box:
- "LB and gateway because we need health-checked routing and rate limiting"
- "Redis between services and DB to handle the 100:1 read:write ratio"
- "Sharded DB because 90TB doesn't fit on one box"
- "Kafka because fan-out is async — user posts a tweet, followers' timelines update eventually"

## Step 5 — deep dive (the section that wins or loses you the role)

The interviewer picks one corner: "Walk me through how a tweet appears in followers' timelines."

Discuss the tradeoffs:
- **Pull model**: when a user opens timeline, query DB for tweets from all followed users, sort. Simple. Tanks at scale (a celebrity user's followers all hit the same partition).
- **Push model** (fan-out-on-write): when a tweet is posted, immediately write it into every follower's precomputed timeline cache. Reads are O(1). Doesn't work for celebrities (writing into 100M timelines per tweet).
- **Hybrid**: push for normal users, pull for celebrities. Twitter actually does this.

The hybrid is the right answer. The path to it (acknowledging both extremes have problems, deriving the hybrid) is what gets graded.

## Step 6 — tradeoffs + extensions

"What would you add with more time?"
- Rate limiting per user
- Multi-region for latency
- Spam/abuse detection
- ML-ranked timelines (vs chronological)
- Real-time push (WebSocket / push notifications)

Pick 2-3. Show breadth. Don't try to design them; just call them out.

## What good looks like vs what bad looks like

| Good candidate | Bad candidate |
|---------------|---------------|
| Asks 5 clarifying questions before drawing | Starts drawing in 30 seconds |
| Does math out loud ("call it ~500K reads/sec") | Avoids numbers; vague at scale |
| Compares 2-3 approaches with explicit tradeoffs | States ONE design as if it's obvious |
| Notes assumptions ("assuming eventually consistent...") | Implicit assumptions buried in design |
| Uses real product names (Redis, Kafka, DynamoDB) | Says "a fast key-value store" abstractly |
| Goes deep on the interviewer's pick | Stays surface-level everywhere |

## A grounding interview check

\`\`\`java-quiz
level: medium
q: The interviewer asks "design Instagram." You have 45 minutes. You spend 3 minutes asking clarifying questions, then start drawing the architecture. What's most likely missing from your approach?
options: Nothing — you're moving efficiently | You skipped the scale estimation step — without it, your architecture decisions are vibes-based | You should have written code first | You should ask the interviewer what they want
correct: 1
explain: Skipping scale estimation is the #1 reason senior candidates fail mid-level interviews. WITHOUT numbers, every architectural decision is "I'd add a cache here" without justification. WITH numbers, you say "the read:write ratio is 100:1 at 500K reads/sec, so we MUST cache — DB alone would need 5x more hardware." The math turns hand-waving into engineering. Always do it before drawing. 3 minutes on requirements + 5 minutes on scale + 5 minutes on API = 13 minutes before any architecture diagram. That's the right pacing for a 45-min interview.
\`\`\`

## What you can do now

- Run the 6-step interview framework end-to-end
- Estimate scale roughly in 5 minutes (DAU → QPS → storage → bandwidth)
- Sketch APIs before architecture
- Justify architectural choices with the numbers you derived
- Recognize the difference between "good design candidate" and "I memorized boxes"

Next: **Scalability fundamentals** — load balancing, caching, CDNs. The actual techniques you draw boxes for.
`;

export const SD_L2 = `# Scalability — load balancing, caching, CDNs

In Lesson 1 you learned the interview framework. Now we cover **the actual techniques** that turn a single-server app into one that serves a billion requests. Each is a tool you'll reach for in every system-design interview.

## Vertical vs horizontal scaling

| | Vertical | Horizontal |
|---|---------|------------|
| What | Bigger machine | More machines |
| Easy? | Trivial — just rent more CPU | Requires stateless services + load balancing |
| Ceiling | Single-machine limit (cores, RAM, NIC) | Effectively unbounded |
| Fault tolerance | None — one box dies, you're down | High — N-1 boxes can fail |
| Cost curve | Exponential ($$$ for top-tier instances) | Roughly linear |

Modern answer: **scale horizontally**. Vertical is for stateful databases that are hard to split.

## Load balancing — the front door to horizontal scale

A **load balancer** sits in front of N service instances and routes incoming traffic.

\`\`\`
[Internet] ──▶ [LB] ──┬──▶ [Service Instance 1]
                     ├──▶ [Service Instance 2]
                     ├──▶ [Service Instance 3]
                     └──▶ [Service Instance N]
\`\`\`

Three levels:

| Level | What it sees | Examples |
|-------|-------------|----------|
| **L4 (transport)** | IP + port | AWS NLB, F5, HAProxy in TCP mode |
| **L7 (application)** | HTTP details (path, headers, cookies) | AWS ALB, Nginx, Envoy, HAProxy in HTTP mode |
| **DNS** | Just hands out IPs | Route 53, GeoDNS |

L7 is what most apps use. It can route \`/api/orders/*\` to one service pool, \`/api/users/*\` to another. It can stick a user's session to one backend. It does TLS termination.

### Routing algorithms

- **Round-robin** — next request goes to next backend. Simple, dumb, often fine.
- **Least connections** — backend with fewest open connections wins. Better for long-lived connections.
- **Consistent hashing** — same key always goes to same backend. Critical for cache-affinity (more on this below).
- **Weighted** — give bigger backends more traffic.
- **Latency-based** — pick the fastest-responding backend.

### Health checks

LB pings each backend every few seconds. Unhealthy backends are taken out of rotation; come back when they pass. **Critical** — without health checks, a dead backend keeps getting traffic.

## Caching — the single highest-leverage move

When read traffic dominates, caching changes the economics. Imagine:
- 1M req/sec reading from your DB → ~$$$ infrastructure
- 1M req/sec at 95% cache hit → 50K req/sec hitting DB → $$ infrastructure

Five places you can cache, in order of distance from the database:

\`\`\`
[Browser cache]
    │  HTTP cache headers; "max-age=300"
[CDN edge cache]
    │  POPs around the world; serve static/cacheable from nearest
[Reverse proxy cache]
    │  Varnish, Nginx with cache zones; in front of your service
[In-process cache]
    │  Caffeine (Java), per-instance memory; ultra-fast
[Distributed cache]
    │  Redis, Memcached; shared across instances
[Database]
\`\`\`

Each layer in front of the DB cuts traffic. **The art of scaling is layering caches.**

### The cache patterns

| Pattern | When to use |
|---------|-------------|
| **Cache-aside (lazy)** | Default. Read from cache; on miss, read DB and populate cache. |
| **Read-through** | Cache library handles the miss + DB fetch. Less common. |
| **Write-through** | Write goes to cache AND DB synchronously. Strong consistency. |
| **Write-behind** | Write goes to cache; DB updated async. Risky — losses possible. |
| **Cache invalidation** | On DB write, delete cache key. The hard one. |

**Cache invalidation is one of the two hard problems in computer science.** When the underlying data changes, how do you know to evict the cache? Three strategies:
- **TTL** — accept some staleness. Cache for 5 minutes. Simple. Works for many use cases.
- **Explicit invalidation** — on every write, delete the cache key. Coupling between writers and cache.
- **CDC** — listen to DB changes (Debezium); invalidate cache reactively. Most elegant, most complex.

### Cache stampede — the killer at scale

Hot cache key expires. 10,000 requests hit at once. All 10,000 miss, all 10,000 query the DB. DB falls over.

Fixes:
- **Probabilistic early expiration** — refresh slightly before TTL, only one request triggers it
- **Locking / single-flight** — only one request fetches; others wait
- **Stale-while-revalidate** — serve the stale value, refresh in background

## CDN — caching at the edge

A **Content Delivery Network** (Cloudflare, Akamai, Fastly, CloudFront) is a global network of edge servers. User in Tokyo hits the nearest Tokyo POP, not your origin in Virginia.

Two uses:

### Static asset CDN (the obvious one)
Images, CSS, JS, fonts. Cache forever (with content-hash filenames so updates invalidate naturally). **Origin gets ~0 traffic for static assets.**

### Dynamic content CDN (the underused one)
Even for dynamic API responses, CDNs can cache at the edge with short TTLs and clever cache keys.

\`\`\`
GET /api/trending  →  CDN caches for 30 sec
  → 100K req/sec at the edge become ~3K req/sec at origin (one per POP per 30s)
\`\`\`

For news feeds, search trends, popular products — CDN dynamic caching is a huge win.

## Database read replicas — scale reads

Most apps are read-heavy. A single DB instance can be the bottleneck even after caching.

\`\`\`
[Writes]──▶ [Primary]──replicates──▶ [Replica 1]
                              └──▶ [Replica 2]
                              └──▶ [Replica 3]

[Reads]──▶ [Replicas]  (round-robin)
\`\`\`

You scale reads by adding replicas. Writes still go to one primary (write scaling is harder — covered in Lesson 3 with sharding).

**Replica lag** — replicas are slightly behind the primary (typically <100ms). If a user writes then immediately reads, they might see stale data. Strategies:
- Route post-write reads to primary briefly ("read your own writes" via session pinning)
- Show optimistic UI for own writes
- Accept the eventual consistency for non-critical reads

## A scalability scenario

\`\`\`java-quiz
level: medium
q: An e-commerce site notices its product detail page is slow. They've added a Redis cache in front of the DB, but it doesn't help much. Investigating, they find 80% of product page views are for the top 100 products, but cache hit rate is only 60%. Why might that be?
options: Cache TTL is too short, evicting hot items too quickly | The cache isn't large enough — top 100 should always be hot | Cache stampedes — when a hot key expires, thousands of requests miss simultaneously and refill it | All of the above are plausible
correct: 3
explain: All three are common causes. Diagnosis steps: (1) Check the actual cache size — Redis maxmemory + eviction policy. If allkeys-lru and you're churning, hot items are getting evicted. (2) Check TTL — if 60s and pages get hit 100/sec, you'd see a 1-second miss window 60× per minute per product = 6000 misses per product per minute, fooling your cache hit rate. (3) Implement single-flight or stale-while-revalidate to avoid stampedes. The right fix combines: a) ensure cache size > hot working set, b) longer TTL for popular items, c) anti-stampede strategy. This is the kind of multi-cause diagnosis senior interviews probe for.
\`\`\`

## What you can do now

- Pick vertical scaling for stateful single-points; horizontal for everything else
- Pick L7 LB by default; understand the routing algorithms
- Layer caches: browser → CDN → reverse proxy → in-process → distributed → DB
- Design around cache invalidation strategy from the start (TTL / explicit / CDC)
- Defend against cache stampedes with single-flight or stale-while-revalidate
- Use CDN for both static AND short-TTL dynamic content
- Scale reads with replicas; understand the consistency tradeoff

Next: **Databases at scale** — SQL vs NoSQL, sharding, replication, the data-tier decisions that make or break system designs.
`;

export const SD_L3 = `# Databases at scale — SQL, NoSQL, sharding

The database is usually the hardest part of a scaled system. Get it wrong and no amount of caching or load-balancing rescues you. This lesson covers the choices: SQL vs NoSQL, replication, sharding, and the patterns that survive at billion-row scale.

## SQL vs NoSQL — the religious war

Honest framing: **the technology matters less than the access pattern.**

| If you... | Pick |
|----------|------|
| Need ad-hoc queries, joins, transactions | SQL (Postgres, MySQL) |
| Have a clear key-value access pattern and need extreme scale | Key-value (DynamoDB, Cassandra, ScyllaDB) |
| Have document-shaped data and flexible schema | Document (MongoDB, Couchbase) |
| Need wide-row time-series at huge scale | Wide-column (Cassandra, Bigtable) |
| Need graph traversal (social networks, recommendations) | Graph (Neo4j, AWS Neptune) |

**Default to SQL.** Postgres specifically. It's grown to handle 10TB tables, JSONB for schema-less columns, pgvector for AI. The vast majority of "we need NoSQL" turns out to be solvable in Postgres with proper indexes + read replicas + sharding.

Reach for NoSQL when you have:
- A clearly key-value or wide-row access pattern (Cassandra for time-series)
- Genuinely planetary scale (>10TB hot data, >100K writes/sec sustained)
- A team that can operate the chosen NoSQL competently

## CAP theorem — the framing every system has

Three properties of distributed databases, **pick two when there's a partition**:

- **Consistency** — every read sees the latest write
- **Availability** — every request gets a response
- **Partition tolerance** — system continues despite network splits

Since network partitions WILL happen, you really pick C vs A. Examples:
- **CP** (chooses consistency) — Cassandra in QUORUM mode, MongoDB, Postgres with synchronous replicas
- **AP** (chooses availability) — Cassandra in default mode, DynamoDB
- **CA** — only single-node systems (no partitions to worry about); not really a distributed option

**Real systems aren't binary.** Most NoSQL DBs let you choose per-operation: Cassandra has ONE/QUORUM/ALL consistency levels. Pick stronger for writes that matter; weaker for reads that don't.

## Replication — same data, multiple copies

Two reasons to replicate:
1. **Availability** — if primary dies, a replica takes over
2. **Scale reads** — replicas serve read traffic

Two modes:
- **Synchronous** — primary waits for replica ACK before committing. No data loss on primary failure. Slower writes.
- **Asynchronous** — primary commits immediately; replicas catch up. Fast writes. Potential data loss on failure.

Postgres lets you mix: one synchronous replica for safety, plus several asynchronous for read scale.

## Sharding — splitting one DB into many

Replication scales reads. **Sharding scales writes** by splitting data across multiple primary DBs.

\`\`\`
[Single primary DB]
       │
       │  Shard by hash(userId) % 4
       ▼
┌──────┬──────┬──────┬──────┐
│Shard0│Shard1│Shard2│Shard3│
└──────┴──────┴──────┴──────┘
\`\`\`

Each shard holds 1/4 of the data, handles 1/4 of the writes. You can scale by adding shards.

### Sharding strategies

| Strategy | Pros | Cons |
|----------|------|------|
| **Hash-based** (\`hash(userId) % N\`) | Even distribution | Hard to add shards (rebalances everything) |
| **Range-based** (e.g. userId 0-1M → shard 0) | Easy to add shards | Hot shards (recent users have all the activity) |
| **Geographic** (e.g. EU users → EU shard) | Low latency for regional users | Cross-region queries are slow |
| **Consistent hashing** | Adding shards moves only ~1/N of data | More complex; some imbalance |

**Consistent hashing is the modern default** for hash-based sharding. Used by Cassandra, DynamoDB, sharded Redis.

### The sharding tax

Sharding sounds great until you try to:
- **Join across shards** — generally not possible. Denormalize.
- **Transaction across shards** — need a distributed transaction or saga (slow + complex).
- **Aggregate query** ("total revenue") — must query every shard and combine.
- **Re-shard** — moving data between shards while the system runs is hard.

**Shard late.** Many companies that talked about sharding in 2015 are running unsharded Postgres with read replicas in 2026, because vertical scaling caught up with their needs. Only shard when you actually can't fit on one primary.

## Sharding key — the critical choice

The shard key determines distribution. Pick wrong and you can't fix it without a massive migration.

**Good shard keys**:
- High cardinality (lots of unique values)
- Even distribution (no hot keys)
- Aligns with your most-common query (so a single query hits one shard)

For Twitter-like: \`userId\` is usually right. For multi-tenant SaaS: \`tenantId\`. For time-series: a combination of \`(metricName, timestampBucket)\`.

## Eventual consistency — the bargain you make

Most large-scale NoSQL is eventually consistent: a write becomes visible to all readers... eventually. Usually within milliseconds, but no guarantee.

User experience patterns to mask this:
- **Optimistic UI** — show success immediately, reconcile later
- **Read-your-writes** — pin the user to the same replica briefly after writes
- **Causal consistency** — track happens-before relationships; serve a consistent view per session

DynamoDB has "consistent reads" you can opt into (costs 2× the units). Cassandra's QUORUM. Use them for the operations that need it; live with eventual for the rest.

## A practical "database choice" question

\`\`\`java-quiz
level: tricky
q: An e-commerce startup is designing a new product catalog. Read-heavy (100K req/sec at peak). 10M products. Each product is updated maybe once a day. The team is small (4 engineers). What's the right database choice?
options: DynamoDB — built for read-heavy at scale | Cassandra — same reason | Postgres with caching + read replicas | Shard MongoDB across 8 instances
correct: 2
explain: A 4-engineer team should pick the simplest thing that works. 10M products × ~1KB = 10GB — fits in RAM on a single Postgres instance. 100K req/sec is high but completely cacheable for an essentially-static catalog (write rate is 10M/day = 116 writes/sec, perfectly fine for Postgres). A Postgres primary + 3 read replicas + Redis cache solves this cleanly with one technology the team already knows. DynamoDB and Cassandra are right when you outgrow Postgres — premature here, and they add operational burden a 4-person team can't afford. The interview answer is always "pick the simplest thing that handles 10× your expected load, then revisit when reality exceeds expectations."
\`\`\`

## Polyglot persistence

Real systems often use multiple databases for different jobs:
- **Postgres** — primary transactional data
- **Redis** — sessions, caches, rate-limit counters
- **Elasticsearch** — full-text search, log indexing
- **S3** — files, blob storage, infrequently-accessed data
- **TimescaleDB / InfluxDB** — time-series metrics
- **Neo4j** — social graph

Each component is good at one thing. Resist the urge to make Postgres do everything OR to use 10 different databases when 2 would suffice.

## What you can do now

- Pick SQL by default; reach for NoSQL only with a specific reason
- Articulate CAP tradeoffs per operation (not per system)
- Scale reads with replicas; scale writes with sharding
- Pick a shard key that's high-cardinality and aligned with queries
- Recognize when sharding is premature (it usually is)
- Combine databases polyglot-style for distinct workloads

Next: **Async architecture** — queues, event streaming, CQRS — when blocking RPCs aren't enough.
`;

export const SD_L4 = `# Async architecture — queues, event streaming, CQRS

When sync calls aren't enough — too slow, too coupled, too fragile — you reach for **async architecture**. This lesson covers the patterns: message queues, event streaming, CQRS, event sourcing. Not all of them at once — each solves a specific kind of problem.

## When async wins

Async is the right tool when:
- The caller doesn't need to know the answer right now (notifications, audit logging)
- The work is slow and shouldn't block the user (video transcoding, ML inference)
- Multiple consumers care about the same event (analytics + ML + notifications)
- You need to absorb spikes (queue acts as a buffer)
- You need to decouple producer and consumer evolution

Async is the wrong tool when:
- The user is waiting for the result (return it synchronously)
- The operation MUST be ordered globally
- Eventual consistency isn't acceptable for that data

## Pattern 1: Job queues (the simplest)

Producer writes a job; one worker picks it up and processes it.

\`\`\`
[Web request] ──▶ [Enqueue "send-welcome-email"] ──▶ [Return 200 OK to user]
                                                              │
[Worker pool] ◀──── pull jobs ──── [Redis / SQS / Postgres queue]
\`\`\`

Use cases: sending emails, generating PDFs, image resizing, scheduled work.

Implementation choices:
- **Redis-backed**: Sidekiq, BullMQ, RQ — fast, simple, no extra infra if you have Redis
- **Postgres-backed**: Use SKIP LOCKED (covered in the SQL course). Surprisingly capable up to ~10K jobs/sec.
- **AWS SQS / GCP Tasks**: managed, no ops, slightly higher latency

For most teams, **don't introduce Kafka for job queues**. Pick a queue.

## Pattern 2: Event streaming (Kafka)

Producer publishes an event; many consumers each get their own copy.

\`\`\`
[User signs up] ──▶ [publish "UserCreated"] ──▶ [Kafka]
                                                  │
                                                  ├──▶ [Email service]      ← send welcome
                                                  ├──▶ [CRM service]         ← create record
                                                  ├──▶ [Analytics service]   ← record signup
                                                  └──▶ [Recommendation service] ← initialize prefs
\`\`\`

Use cases: cross-service notifications, event-driven workflows, anything where the producer doesn't know all the consumers.

We covered Kafka in detail in the Kafka course; the system-design view is:
- Producer service emits domain events ("OrderPlaced," "UserCreated," "PaymentReceived")
- Every other service that cares subscribes independently
- New services can be added later without touching the producer
- **Outbox pattern** (covered in microservices course) makes event emission reliable

## Pattern 3: CQRS — separate write and read models

**Command Query Responsibility Segregation**: writes go to one model, reads come from a different (optimized) model. Bridged by events.

\`\`\`
[Command: PlaceOrder] ──▶ [Write Model — normalized SQL]
                                  │
                                  │ event: OrderPlaced
                                  ▼
                            [Projection workers]
                                  │
                                  ▼
                          [Read Model — denormalized, fast]
                                  │
[Query: OrderDetail] ──▶ ─────────┘
\`\`\`

Why bother?
- Writes are simple (one normalized model)
- Reads are pre-computed in the shape the UI needs (no joins, no aggregation at query time)
- Read model can be sharded / replicated differently than write model
- You can have multiple read models for different use cases (one for the API, one for analytics, one for search)

CQRS shines when reads and writes have **wildly different patterns** (1000:1 read:write ratio, or complex read aggregations).

**Costs**:
- Two models to keep in sync (eventually consistent)
- More moving parts (projection workers, event log)
- Devs have to think about which model to query

CQRS is **overused**. Most apps don't need it. Reach for it when read model complexity is genuinely killing you.

## Pattern 4: Event sourcing

**Event sourcing** is CQRS taken further: instead of storing current state, you store every event that produced it. The "current state" is computed by replaying events.

\`\`\`
Account events:
  AccountCreated(id=42)
  Deposited(id=42, amount=100)
  Deposited(id=42, amount=50)
  Withdrew(id=42, amount=30)

Current balance = sum = 120  (replayed from events)
\`\`\`

Compared to traditional state-based storage where you'd just have a \`balance\` field.

Benefits:
- **Complete audit log** — you have every change, forever
- **Time travel** — "what did this account look like on Jan 5?"
- **Easy new views** — build a new projection by replaying events
- **Debugging gold** — production bug? Replay events on staging to reproduce

Costs:
- **Hard to enforce business rules at write time** (need to load all events to validate)
- **Schema evolution is brutal** (events live forever; renaming a field is painful)
- **Most teams aren't ready** — operational complexity, mental model shift

Event sourcing is a small niche where it shines (finance, audit-required systems). For most apps, **just use CQRS without event sourcing** — separate read/write models, but keep the write model state-based.

## When to choose what

| Need | Pattern |
|------|---------|
| Background job ("send this email") | Job queue (Redis/SQS/Postgres) |
| Cross-service notification | Event streaming (Kafka) |
| 1000:1 read:write ratio, complex queries | CQRS |
| Audit log / time-travel requirement | Event sourcing |
| Strict ordering + complex coordination | Saga (covered in microservices) |
| One operation across services | Outbox pattern (microservices course) |

## A real interview scenario

\`\`\`java-quiz
level: tricky
q: An interviewer asks "design a flight booking system." After scoping requirements, a candidate proposes Kafka + CQRS + event sourcing for everything. What's likely wrong with this approach?
options: Nothing — these are best-practice patterns | Overengineering. Most of the system fits a normal CRUD app with Postgres; Kafka/CQRS/ES add complexity that doesn't pay off until the system actually needs them | Should also add a saga orchestrator | Should use NoSQL instead
correct: 1
explain: The interviewer is testing whether you can match patterns to needs, not just recite buzzwords. Flight booking is mostly: search flights (read-heavy, cacheable), create booking (transactional, single-DB), payment (sync, transactional). A Postgres-backed monolith or 2-3 services with sync REST handles 90% of it. Event sourcing for booking history? Maybe — but justify with a specific need (regulator wants the audit trail), don't reflex. Senior interviewers prefer "I'd use Postgres unless we hit a specific limit" over "I'd build distributed event-sourced CQRS." Always argue for simplicity first.
\`\`\`

## The async UI experience

Async architecture surfaces in UI:
- **Optimistic updates** — show the result immediately; reconcile if it fails
- **"Processing..." states** — make the async-ness visible to user
- **Progress notifications** — push updates as the async work progresses
- **Email confirmations** — for slow async ops, send when done

The most underrated frontend pattern: **idempotency keys**. The client generates a unique ID per attempted operation. If they retry (lost connection), the server recognizes the same key and doesn't double-process.

## What you can do now

- Pick async only when sync genuinely doesn't fit
- Use a job queue for simple background work — not Kafka
- Use Kafka when many consumers care about events
- Use CQRS when read patterns are wildly different from write patterns
- Use event sourcing rarely and with strong justification
- Push back on overengineering in interviews — simpler is better

Next: **Real-time and distributed** — WebSockets, push notifications, geo-distribution, the patterns for "always-on" systems.
`;

export const SD_L5 = `# Real-time and distributed — push, geo, distributed coordination

Some systems can't poll. Chat, live scores, multiplayer games, collaborative editing — you need **the server pushing to the client** in real-time. And once you're global, you need to think about **distributing your system across regions**. This lesson covers both.

## Real-time delivery — three options

### 1. Polling
Client asks server "anything new?" every N seconds. Simple, awful.

\`\`\`
Client every 5s:  GET /messages?since=12345
Server:           returns []
                  returns []
                  returns [{newMessage}]
\`\`\`

Costs: 99% of requests return nothing. Latency = polling interval / 2. Scales badly.

### 2. Long polling
Client requests; server holds the connection open until there's something to send.

\`\`\`
Client:  GET /messages?since=12345
Server:  ...waits...
         ...30s later, new message arrives, responds with it
Client:  immediately reconnects
\`\`\`

Better than polling. Hacky — burns connections, doesn't scale to millions.

### 3. WebSocket / Server-Sent Events
A persistent connection. Server pushes whenever it has something.

\`\`\`
Client: ws://server/chat   (one-time handshake)
[bidirectional, persistent message stream]
Server: ── "new message"
Server: ── "user typing"
Client: ── "user sent"
Server: ── "delivered"
\`\`\`

WebSockets are bi-directional. **Server-Sent Events (SSE)** is one-way (server → client) over plain HTTP — simpler, works with normal load balancers, perfectly fine when you don't need client → server pushing.

**Default to SSE** if you only need server-push. **Use WebSockets** for true bi-directional (chat, games, multi-cursor collaborative editing).

## The scaling problem with persistent connections

A normal HTTP server handles 10K concurrent requests easily because each is short. WebSocket connections live for **hours**. 1M users → 1M open connections → memory + file descriptor pressure.

Patterns:
- **Dedicated WebSocket layer** — separate fleet just for WS connections, scaled independently
- **One connection per user, multiplexed by topic** — instead of 5 connections for chat + notifications + presence, one with subprotocols
- **Pub/sub backend** — when a message needs to be pushed to a user, a backend service publishes to a pub/sub channel; the WS server holding that user's connection receives it and forwards

\`\`\`
[Microservice publishes "new-message-for-user-42"]
                    │
                    ▼
              [Redis pub/sub / Kafka]
                    │
                    ▼
            [WebSocket fleet, instances 1..N]
                    │  (instance knowing user-42's connection forwards)
                    ▼
              [User 42's browser]
\`\`\`

Common backbones: **Redis pub/sub** (simple, in-memory, fast), **Kafka** (durable, replayable), **NATS** (lightweight pub/sub).

## Push notifications (mobile, browser)

For notifications when the user **isn't actively connected** — phone in pocket, browser tab closed:

- **iOS**: APNs (Apple Push Notification service)
- **Android**: FCM (Firebase Cloud Messaging)
- **Web**: Web Push API (works in Chrome, Firefox, Safari)

You hit the platform's push gateway; it delivers to the device. **Latency**: usually seconds. **Reliability**: best-effort — not guaranteed.

Architecture:
\`\`\`
[Backend event: "message for user 42"]
                  │
                  ▼
        [Notification service]
                  │  (looks up user 42's device tokens)
                  ▼
      [APNs / FCM / Web Push]
                  │
                  ▼
            [User's device]
\`\`\`

The notification service is a fan-out point: one logical event → potentially multiple platforms per user (phone + tablet + web).

## Geographic distribution

Your users are in Tokyo. Your server is in Virginia. Best case: 150ms round-trip — feels sluggish for an interactive app.

The solutions in increasing order of complexity:

### 1. CDN for static + cacheable dynamic
Already covered in Lesson 2. Serves up to 70% of read traffic from local POPs. Huge win, low effort.

### 2. Multi-region read replicas
Run read replicas in each major region. Reads served locally; writes still go to one primary.

\`\`\`
Primary (Virginia) ──replicates──▶ Replica (Tokyo, Frankfurt, São Paulo)
[Tokyo users]
  reads ──▶ Tokyo replica         (fast)
  writes ──▶ Virginia primary     (slow — but writes are rarer)
\`\`\`

Cost: write latency for non-US users. For read-heavy apps, often acceptable.

### 3. Multi-region active-active (the hard one)
Multiple primaries, multiple regions, each accepting writes. **Hard.**

Two coordination strategies:
- **Conflict-free Replicated Data Types (CRDTs)** — design data structures that merge automatically (Riak, some Redis ops). Limited to specific data shapes.
- **Last-writer-wins** — accept that concurrent writes to the same key can clobber each other. DynamoDB Global Tables. Cassandra in multi-DC mode.

\`\`\`
Tokyo user writes ──▶ Tokyo primary  ──replicates──▶ Virginia primary
Virginia user writes (concurrent) ──▶ Virginia primary
                                              │
                                              ▼
                                    Conflict! Resolve somehow.
\`\`\`

Most teams **don't need active-active**. Multi-region read replicas + write routing to the primary region handles 90% of needs.

## Distributed locking — the dangerous tool

Sometimes you need: "only one process can do X at a time, globally." A cron job that should run on one server. A scheduled task that mustn't double-fire.

The naive approach: \`SET key value NX EX 60\` in Redis. If the SET succeeds, you got the lock. Release with DEL.

**Two huge problems**:
1. **What if the process dies before releasing?** TTL handles it, but TTL is wall-clock. If processing takes longer than TTL, the lock expires, another process grabs it, and now TWO processes are working.
2. **Network partitions** — your process thinks it has the lock; meanwhile the Redis node it talked to is partitioned away from the rest; another process gets the lock from another node.

The famously messy debate around Redis-based distributed locks (Redlock) has settled into: **don't rely on distributed locks for correctness**. They're hints — fine for "probably only one cron runs" — bad for "money correctness depends on this."

For correctness-critical exclusion:
- Use a real consensus system (ZooKeeper, etcd, Consul)
- Use database row locks (\`SELECT FOR UPDATE\`)
- Design the operation to be idempotent, so duplicate processing is harmless

## Idempotency keys — the underrated cross-cutting pattern

For any "expensive" operation (charge a card, send an email, create a resource), the client generates a unique key per attempt:

\`\`\`
POST /charge
Idempotency-Key: c4f1-789-xyz
Body: { amount: 100, ... }
\`\`\`

Server:
- Looks up the key in a short-TTL cache
- If found, returns the previous response
- If not, processes the request and stores the response with the key

Result: retries are safe. Network blips don't cause double charges. Mobile users on flaky networks can mash a button without consequences.

**Use idempotency keys for all non-trivial POSTs.** Stripe, Square, Plaid all do this. Bake it into your API design.

## A real-time scenario

\`\`\`java-quiz
level: tricky
q: A team building a live-chat app uses WebSockets. Users complain that messages sometimes show up out of order. Investigating, they find that messages from User A reach the chat in this order: msg1, msg3, msg2 — even though A sent them 1, 2, 3 in order. What's the most likely cause?
options: WebSocket doesn't guarantee order | The backend processes messages asynchronously across multiple workers, each completing at different speeds | TCP doesn't guarantee order | The clock is skewed
correct: 1
explain: WebSocket DOES guarantee order on a single connection (it's TCP underneath). The reordering is happening server-side: the WS server receives msg1, msg2, msg3 in order, but forwards each to a pub/sub backend, and async workers process them in parallel. msg2 might involve more work (e.g., a slow DB lookup) and finish AFTER msg3. Fix options: (1) process messages from the same user sequentially (key by senderId, route to one worker), (2) timestamp messages on the server before fanning out, let the client sort, (3) use a single worker per chat room (limits horizontal scale). The lesson: distributed systems' "happens-before" is a real thing you have to design for.
\`\`\`

## What you can do now

- Pick polling / long-polling / SSE / WebSocket based on direction + scale
- Architect WebSocket fleets behind a pub/sub backbone
- Use push notifications (APNs/FCM/Web Push) for offline reach
- Layer geo-distribution: CDN → read replicas → active-active (last resort)
- Avoid distributed locks for correctness — use consensus systems or idempotency
- Add idempotency keys to all non-trivial POST endpoints

Next: **Classic system design problems** — applying the toolkit to "design Twitter," "design Uber," "design a URL shortener."
`;

export const SD_L6 = `# Classic system design problems — applied

Five lessons of frameworks and techniques. Now we put it together on three problems that come up in **every** senior system-design interview. The structure is the framework from Lesson 1 — clarify, estimate, API, architecture, deep-dive, tradeoffs.

## Problem 1: URL shortener (TinyURL, bit.ly)

The "easy" one. Don't underestimate it — it tests whether you can do the basics cleanly.

### Clarify
- Read:write ratio? **100:1** typically (URLs are created once, accessed many times)
- Custom slugs? **Yes, optionally** (premium feature)
- Analytics? **Click counts at minimum**
- Link lifetime? **Permanent unless deleted**

### Estimate
- 100M URLs created/month = ~40 URLs/sec
- 10B clicks/month = ~4000 redirects/sec, peak 20K/sec
- Storage: 100M × ~500 bytes = 50 GB/month — modest

### API
\`\`\`
POST /shorten      { url, customSlug? }  → { shortUrl }
GET  /:slug        → 302 redirect to original URL
GET  /:slug/stats  → { clicks, geo, referrers }
\`\`\`

### Generate the short slug — the design decision

Three approaches:

| Method | Pros | Cons |
|--------|------|------|
| **Random** (base62 of 6+ chars) | Simple | Collision-checking on every insert |
| **Hash of URL** | Same URL → same slug | Collision handling; can't have multiple shortened versions |
| **Counter** (base62 of monotonic ID) | No collisions, ordered | Predictable (bad for privacy) |

**Pragmatic answer**: counter-based, but assign in chunks per host to avoid contention.

\`\`\`
DB has a counter. Each host claims 10,000 IDs at a time (atomic INCRBY).
Host increments locally for each new URL within its range.
When range exhausts, claim next 10,000.
\`\`\`

Result: zero per-write DB hit for ID generation (after the bulk claim), no collisions ever.

### Architecture

\`\`\`
[Browser]
   │
   │  GET /abc123
   ▼
[CDN / LB]
   │
   ▼
[Redirect Service]  ──read cache──▶  [Redis]  ──miss──▶  [Postgres]
   │
   │  302 + Location: https://example.com/...
   ▼
[Browser fetches the actual URL]

[Async path]
[Redirect Service] ──publishes "ClickEvent"──▶  [Kafka]
                                                    │
                                                    ▼
                                              [Analytics aggregator]
                                                    │
                                                    ▼
                                              [Stats DB / clickhouse]
\`\`\`

### Deep dive: handling 20K reads/sec

- Cache hit rate should be 99%+ (URLs map immutably, no invalidation)
- Redis TTL infinite, eviction LRU
- DB: Postgres with index on slug. 50GB fits comfortably.
- Read replicas if needed (probably not at this scale)

### Tradeoffs called out
- Could use DynamoDB for guaranteed scale — overkill for 4K req/sec
- Could shard Postgres at 100B URLs — defer until you actually have the data

## Problem 2: News feed (Twitter, Instagram)

### Clarify
- Follower distribution? **Power-law** — some users have millions of followers
- Timeline order? **Reverse-chronological + algorithm-ranked options**
- Read-write ratio? **Massive read-heavy** (100M tweets/day, 50B reads)

### Estimate (covered in Lesson 1)
- 30K tweets/sec peak write
- 5M timeline reads/sec peak
- 90TB/year tweets, 100s of TB/year media

### The core question: timeline generation

Two extremes:

**Pull (fan-out-on-read)**:
- When user opens timeline, query "tweets from everyone I follow, ORDER BY time DESC LIMIT 100"
- Pros: trivial write path (just insert tweet)
- Cons: terrible read path (expensive query per view; gets worse with more follows)

**Push (fan-out-on-write)**:
- When a user tweets, immediately push the tweet into every follower's precomputed timeline cache
- Pros: O(1) read (cache lookup)
- Cons: brutal write fan-out for celebrities. Taylor Swift tweets → 100M cache writes.

**Hybrid (the real answer)**:
- Push for **regular users** (most followers have <1000 follow lists; cheap to fan out)
- Pull for **celebrities** (>X followers — pull their tweets at read time)
- On timeline read: load pre-pushed tweets + pull celebrity tweets, merge by timestamp

\`\`\`
User opens timeline:
  1. Read pre-pushed tweets from [Redis cache "timeline:userId"]  ← O(1)
  2. Query celebrity tweets the user follows (small list)         ← O(N celebs)
  3. Merge by timestamp, return top 100                           ← O(N log N)
\`\`\`

### Architecture sketch

\`\`\`
[Tweet write] → [Tweet service] → [Postgres + Cassandra]
                       │
                       ▼
                  [Kafka: "TweetPosted"]
                       │
                       ▼
           ┌───────┴───────┐
           │               │
[Fan-out worker]    [Search indexer]
  (push to followers     (write to ES)
   if not celebrity)

[Timeline read] → [Timeline service] → [Redis: precomputed]
                       │
                       └──▶ [Tweet service: celebrity tweets only]
                       │
                       └──▶ merge + rank + return
\`\`\`

### Tradeoffs called out
- Eventual consistency on timeline (your new tweet might take 1-2s to appear in followers' timelines)
- Storage: each user has a precomputed timeline cache (~MB per user × 100M = TB)
- Cache TTL: short for active users, longer for inactive

## Problem 3: Uber / ride-sharing

The dynamic-matching killer.

### Clarify
- Geographic scope? **Global, sharded by city**
- Real-time matching latency? **<3 seconds rider → driver assignment**
- ETA estimates? **Yes — affects user trust**

### Estimate
- 5M active drivers globally at peak
- 100M rides/day = ~1200 ride requests/sec average, ~5000 peak
- Driver location updates: every 4 seconds × 5M drivers = 1.25M updates/sec

### The core challenges

1. **Real-time location tracking** — 1.25M updates/sec is firehose
2. **Spatial queries** — "find 10 drivers within 2km of this point" — fast
3. **Matching** — assign rider to driver, both updated atomically
4. **ETA** — accurate estimates require real-time traffic data

### Architecture: geo-sharding

**Shard by city.** Each city is mostly self-contained (drivers don't cross cities mid-ride). Per-city services handle:
- Location updates from that city's drivers
- Ride requests from that city's riders
- Matching within the city

\`\`\`
[Driver app]──location update──▶  [Per-city Location Service]
                                              │
                                              ▼
                                  [Geo-index: H3 / S2 cells in Redis]

[Rider requests ride]──▶  [Per-city Match Service]
                              │
                              │  query: nearby drivers (Redis geo)
                              │  filter: not busy, accepts ride type
                              ▼
                          [Choose driver, lock both atomically]
                              │
                              ▼
                          [Notify driver app via WebSocket]
\`\`\`

### Spatial indexing: H3 / S2

Don't use lat/lng directly. Use a **hierarchical hex grid** like Uber's H3 or Google's S2:

\`\`\`
Earth divided into ~120 hexagons at level 0
Each subdivided into 7 children at level 1
... and so on, down to ~1m hexes at level 15
\`\`\`

Query "drivers near this point" becomes "drivers in these 7 hexagons" — O(1) Redis lookup.

### Real-time updates
- Driver app → WebSocket → Location service
- Rider app gets driver position via WebSocket (push)
- Backend uses pub/sub (Redis or Kafka) to broadcast updates

### Deep dive: surge pricing

- Listen to demand vs supply by hexagon
- Compute multiplier in real-time (every few seconds)
- Show rider the multiplier; they accept or wait

This is essentially CQRS: the write path captures every request and driver location; a real-time aggregator updates a "current surge" read model.

## Patterns that come up in EVERY problem

The toolkit you should reach for:

| Need | Pattern |
|------|---------|
| Fast read at scale | Cache (Redis) layer |
| Static content delivery | CDN |
| Cross-service event reaction | Kafka |
| Single-service background work | Queue (Redis/SQS) |
| Multi-region | Read replicas + CDN |
| Operation that spans services | Saga + outbox |
| Hot path with many readers | Precompute + cache |
| Async-friendly user feedback | Optimistic UI |
| Avoid double-processing on retry | Idempotency keys |

## A meta interview question

\`\`\`java-quiz
level: tricky
q: An interviewer asks you to "design Instagram." You spend 5 min clarifying, 5 min on estimation, and start drawing architecture. You add a load balancer, a service tier, Postgres, Redis, S3 for media, and a CDN. The interviewer asks: "How would you handle the photo feed for a user with 1M followers?" What's the MOST important thing to do?
options: Defend your existing design — it's correct | Recognize this is the celebrity/fan-out problem and discuss the push vs pull tradeoff | Add more Redis | Suggest using NoSQL
correct: 1
explain: The interviewer just dropped a deep-dive question. They've moved past "do you know the patterns" to "do you understand the failure modes of the patterns you proposed." The right move: explicitly invoke the framework from Lesson 1 — "good question, this is the fan-out problem. Two extremes: fan-out-on-write (push) and fan-out-on-read (pull). Push is great for normal users but breaks for a 1M-follower account because every post is 1M cache writes. Pull is fine for celebrities but expensive at read time. The hybrid: push for users with <X followers, pull for celebrities; merge at read time." That ANALYSIS — articulating the tradeoff, then deriving the hybrid — is what gets you the offer. Just saying "use a cache" loses the room.
\`\`\`

## You've finished System Design

Six lessons. You can now:
- Run the 6-step interview framework end-to-end
- Estimate scale (DAU → QPS → storage → bandwidth) on the fly
- Layer caches, load-balance, use CDNs effectively
- Pick the right database (and avoid premature sharding)
- Choose async patterns thoughtfully (jobs vs streams vs CQRS)
- Handle real-time, push, and geo-distribution
- Apply all of the above to canonical problems

The skill compounds. Practice on 10 system design problems from interview question lists and you'll have built the muscle memory to recognize patterns instantly. The first 10 are hard; by the 30th, you're recognizing the variant on the URL-shortener or news-feed problems and adapting quickly.

What's left when you want more:
- **Designing for Geographic Replication** (Spanner, CockroachDB)
- **ML system design** (model serving, feature stores, online learning)
- **Specialized domains** — payments systems, ad tech, real-time bidding, blockchain — each has its own classic problems

For now, you have the toolkit. Go ace the interview.
`;
