/* eslint-disable no-irregular-whitespace */
/**
 * Microservices — 6 lessons. The patterns, the failures, the interviews.
 * Strong opinions, technology-current as of 2026.
 */

export const MS_L1 = `# Why microservices? (And when to NOT)

Half the senior backend interview questions you'll face involve microservices. **Most of them are actually testing whether you know when NOT to use them.** Microservices are a tool, not a virtue — used wrong, they replace one big bug with ten distributed ones.

This lesson sets the foundation: what microservices give you, what they cost, and how to know when the trade is worth it.

## What a microservice actually is

A microservice is:
- **A separately deployable unit** of code
- **Owning its own data** (no other service can read its DB directly)
- **Communicating only via APIs** (HTTP, gRPC, events)
- **Independent** — you can deploy, scale, rewrite, or roll back one service without touching others

That's it. "Micro" doesn't mean small lines-of-code — it means small **scope of responsibility**. A microservice can be 500 lines or 50,000.

## What microservices actually give you

1. **Independent deploy** — ship service A 10× a day without bothering service B
2. **Independent scale** — auto-scale just the recommendation service during peak
3. **Tech diversity** — recommender in Python, payments in Java, frontend in TypeScript
4. **Fault isolation** — recommender crashes don't crash checkout (if you designed it right)
5. **Team ownership** — clear boundary lines, less coordination overhead

That's the upside. Now the cost.

## What microservices actually cost

| Hidden cost | What it looks like |
|---|---|
| **Network everywhere** | Function calls now require HTTP/gRPC — latency, retries, timeouts, serialization overhead |
| **Distributed transactions** | "Move money from account A to account B" is one DB transaction in a monolith. Across two services, it's the **Saga pattern**, hours of design work, and edge cases for days |
| **Observability** | One log file → tracing across 10 services. You need OpenTelemetry, distributed tracing, structured logging — not optional |
| **Versioning** | Service A updates its API; service B is on the old client. Now you need backward compatibility and version negotiation |
| **Deploy infrastructure** | k8s, service mesh, secrets management, CI/CD per service, image registries — significant ops burden |
| **Local dev** | Run 10 services locally? Docker Compose for everything? Or shared dev environments with all the contention that brings? |

This is real. None of it is theoretical. **Every team that goes microservices pays all of these.**

## The "should I?" test

You should NOT go microservices if:
- Your team is < 10 engineers (you don't have enough people to own services)
- Your traffic is < 100 req/sec (monolith easily handles it)
- Your domain is simple (CRUD app, single business)
- You haven't shipped a stable monolith yet (you don't know what your bounded contexts are)

You SHOULD consider microservices if:
- You have 50+ engineers and they keep stepping on each other in one repo
- You have one service that must scale 100× more than others
- You have genuinely separable business domains (payments, search, ML serving)
- You have the ops investment for it (k8s, observability, CI/CD)

The honest answer: **most teams should start with a well-structured monolith and split out services only when there's clear pain.** "Modular monolith" — one deployable, internal module boundaries — is underrated.

## The modular monolith — the middle ground

Picture a single Spring Boot app with strict package boundaries:

\`\`\`
com.acme.shop
  ├── catalog
  │   ├── api          # public to other modules
  │   ├── internal     # private — enforced by ArchUnit tests
  │   └── persistence  # private
  ├── orders
  │   ├── api
  │   └── internal
  └── shipping
\`\`\`

Modules talk to each other via well-defined APIs. Each module has its own tables (no cross-module FKs). ArchUnit (or modulith libraries) enforces boundaries at build time. **Deploy as one app. Refactor to separate services later if needed.**

This pattern has eaten a lot of the "we need microservices!" conversations in the 2020s. You get clean architecture without the operational cost.

## Conway's Law — the constraint you don't notice

> "Organizations design systems that mirror their communication structures." — Melvin Conway, 1968

If your company has 3 teams, you'll end up with 3 systems, no matter what you intended. Microservices that don't align with team boundaries become **distributed monoliths** — coupled, unhappy, slow to deploy.

**Before drawing service boundaries, draw team boundaries.** Each service should have a clear owning team. Teams shouldn't share ownership of services (otherwise nothing gets done well).

## A grounding interview question

\`\`\`java-quiz
level: medium
q: A startup with 8 engineers has just raised funding and the CTO announces: "We're rewriting our Rails monolith as 12 microservices on Kubernetes." What's the most important concern to raise?
options: Kubernetes is overkill — use ECS | Rails is the wrong language for microservices | The team is too small to operate 12 independently deployed services with proper observability | They should use 15 microservices for better separation
correct: 2
explain: 8 engineers running 12 services means each engineer owns ~1.5 services. Each service needs deployment pipelines, dashboards, oncall, runbooks, schema migration, dependency upgrades. The team won't have time to BUILD anything — they'll spend all their time keeping the lights on. The right move for an 8-person team with a working monolith: keep it, refactor toward modules, split off only the ONE service that's actually causing pain (often a hotspot like search or ML inference). Microservices have an organizational floor before they pay off — usually around 30-50 engineers.
\`\`\`

## What you can do now

- Define a microservice precisely (deployable, own data, API-only, independent)
- Articulate the real costs (network, transactions, observability, ops)
- Recognize when a modular monolith beats microservices
- Apply Conway's Law before drawing service boundaries
- Push back on premature microservices in interviews — and explain WHY

Next: **Communication patterns** — sync vs async, REST vs gRPC vs events, and when each wins.
`;

export const MS_L2 = `# Communication patterns — sync vs async

Once you have multiple services, the first question is: **how do they talk?** This isn't a syntax question — the answer reshapes your whole architecture. Pick wrong and you'll either pay for it in latency or in complexity. This lesson covers the three real patterns and when each wins.

## The two fundamental shapes

**Synchronous** — service A makes a request, waits for service B to respond.

\`\`\`
[A]  request──▶  [B]
[A]  ◀──response  [B]
\`\`\`

**Asynchronous** — service A drops an event somewhere; service B (or many services) pick it up later.

\`\`\`
[A]  ──event──▶  [Queue/Kafka]  ──▶  [B]
                                ──▶  [C]
                                ──▶  [D]
\`\`\`

That distinction drives everything below.

## Synchronous: REST, gRPC, GraphQL

### REST (HTTP + JSON)

The default. Every language has clients. Easy to debug (\`curl\` it). Cacheable. Well understood.

\`\`\`
GET /api/orders/123     200 OK { ... }
POST /api/orders        201 Created { ... }
\`\`\`

Strengths: ubiquity, tooling, browsers and humans can both call it. Weaknesses: JSON parsing is slow, no schema enforcement (without external help), versioning is awkward.

### gRPC

A binary protocol over HTTP/2 with protobuf schemas. Significantly faster than REST for service-to-service (smaller payloads, streaming support, built-in deadlines). Schemas are enforced — you can't accidentally send the wrong field type.

\`\`\`protobuf
service OrderService {
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc StreamOrders(StreamOrdersRequest) returns (stream Order);
}
\`\`\`

Strengths: type-safe, fast, bi-directional streaming, polyglot codegen. Weaknesses: browsers can't speak it directly (need gRPC-Web), debugging is harder than \`curl\`.

**Rule of thumb:** REST for external APIs (where ubiquity matters), gRPC for internal service-to-service (where speed and schema matter).

### GraphQL

A query language over a single endpoint. Clients ask for exactly the fields they want.

\`\`\`graphql
query { order(id: 123) { id, total, customer { name } } }
\`\`\`

Strengths: lets frontend teams move without backend changes (each query is custom). Weaknesses: harder to cache, hard to reason about performance (one query might trigger 50 DB queries via resolvers), N+1 problems by default (mitigate with DataLoader).

GraphQL has settled into being mostly a **frontend BFF (Backend-For-Frontend)** pattern, not a general inter-service comms layer.

## Asynchronous: events and queues

### Message queue (RabbitMQ, SQS)
Producer drops a message; one consumer takes it. Worker pattern.

### Event log (Kafka)
Producer publishes an event; many consumers read it independently.

### Pub/sub (Redis pub/sub, NATS, Google Pub/Sub)
Publisher pushes; subscribers receive in real-time. Usually no persistence.

The thing all three have in common: **the producer doesn't know who the consumer is, and the consumer isn't blocking the producer**.

## The killer trade-off: coupling vs latency

| | Sync (REST/gRPC) | Async (events) |
|---|---|---|
| Latency | Lower for single calls | Higher (queueing delay) |
| Producer waits? | YES | NO |
| If consumer is down? | Producer fails | Message buffered, processes later |
| Multiple consumers? | Producer calls each | Free — they all subscribe |
| Adding a new consumer | Producer code changes | Zero producer change |
| Debugging | Easy — request/response trace | Harder — find the trail |
| Order guarantee | Trivial — sequential calls | Per-partition only |
| Atomic operation across services? | No (use Sagas) | No (use Sagas) |

**The wisdom:**
- Use sync when the caller **genuinely needs** the response before continuing (auth, payment authorization)
- Use async when the caller **doesn't actually care** about the response right now (audit logging, notifications, downstream analytics)

## A common architecture pattern

\`\`\`
[Client]  ──HTTP──▶  [API Gateway]
                          │
                          │  sync REST/gRPC
                          ▼
                      [Order Service]  ──INSERT──▶  [Order DB]
                          │
                          │  async event "OrderPlaced"
                          ▼
                      [Kafka]  ──▶  [Inventory Service]    ← reserve stock
                              ──▶  [Email Service]         ← send confirmation
                              ──▶  [Analytics Service]     ← record sale
                              ──▶  [Shipping Service]      ← schedule pickup
\`\`\`

Order service does its own work synchronously (responds to the client fast), then fires an event. Downstream services pick it up and do their work async. **Each downstream service can fail or be slow without affecting the user's response.**

## The big async gotcha — eventual consistency

Async means **the world doesn't update instantly**. The user places an order; checkout returns 200 OK; for the next 200ms, the inventory service still shows the item in stock for someone else who's about to check out. **You can briefly oversell.**

You handle this either:
1. Architecturally — reserve stock during checkout (a sync call), confirm later
2. Probabilistically — accept the rare double-sell as a business cost
3. With idempotency + compensating actions — async reserve, refund if oversold

Most products tolerate eventual consistency for most things. **Banking transactions don't** — that's why payments often stay synchronous + transactional.

## A tricky communication interview question

\`\`\`java-quiz
level: tricky
q: A team has 12 microservices. Most are doing sync REST calls. They notice that when one slow service (let's call it Recommendations) degrades, the entire site times out. What's the architectural fix?
options: Add more replicas of Recommendations | Use a circuit breaker so the calling service fast-fails instead of waiting | Switch all communication to async | Use a CDN
correct: 1
explain: Adding replicas helps if Recommendations is overloaded, but doesn't fix the fundamental coupling: callers WAIT for Recommendations. A circuit breaker (Resilience4j, Hystrix) detects when Recommendations is failing and fast-fails subsequent calls (returns default/degraded response) WITHOUT waiting for a timeout. The site stays up; users see a "no recommendations available" graceful degradation instead of total failure. Switching everything to async is too drastic and changes the user experience for things that genuinely should be sync (e.g., the user clicking "buy" needs a synchronous response). Pattern: keep sync for high-value calls, add circuit breakers for the rest. We cover circuit breakers in detail in the next lesson.
\`\`\`

## What you can do now

- Pick REST vs gRPC vs GraphQL based on who calls and what matters
- Pick sync vs async based on whether the caller needs the response now
- Recognize the "everything-sync cascade failure" pattern and break it with circuit breakers
- Push messaging into the async path for things that don't NEED to be sync
- Accept eventual consistency as a deliberate design choice, not an accident

Next: **Resilience patterns** — circuit breakers, retries, bulkheads, and the libraries that implement them.
`;

export const MS_L3 = `# Resilience — circuit breakers, retries, bulkheads

A monolith fails the way one program fails: an exception, a crash, you fix it. **A distributed system fails in many simultaneous, partial, weird ways** — and your service has to keep running through them. This lesson is the toolkit.

## The fundamental rule of distributed systems

**Anything you call over the network WILL fail eventually.** Not "might." Will. Networks partition, services restart, garbage collectors pause, instances get killed by k8s. Your code's job is to keep working anyway.

The four core resilience patterns:

| Pattern | Solves |
|---------|--------|
| **Timeout** | Caller doesn't wait forever |
| **Retry** | Transient failures don't surface as errors |
| **Circuit breaker** | Failing service doesn't drag down the caller |
| **Bulkhead** | One slow dependency doesn't exhaust all threads |

## Timeouts — the simplest discipline

Every external call MUST have a timeout. Default JDK HTTP client timeout? **Infinite.** Default Spring \`RestTemplate\`? **Infinite.** A misconfigured caller can hang on a dead dependency forever.

\`\`\`java
WebClient client = WebClient.builder()
    .clientConnector(new ReactorClientHttpConnector(
        HttpClient.create().responseTimeout(Duration.ofSeconds(3))
    ))
    .build();
\`\`\`

Set timeouts for: connect, read, total request. Set them to **just slightly more than your service's own SLO**. If you promise users 500ms responses, downstream calls should time out at ~400ms — fast-fail and return degraded response.

## Retries — the right way

If a call fails with a transient error (5xx, network), retry it. Sometimes. Carefully.

\`\`\`java
// Resilience4j
Retry retry = Retry.of("inventory", RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofMillis(100))
    .intervalFunction(IntervalFunction.ofExponentialBackoff(100, 2.0))
    .retryExceptions(IOException.class, TimeoutException.class)
    .build());

inventoryClient.callDecorated(Retry.decorateSupplier(retry, supplier));
\`\`\`

Key rules:
- **Only retry idempotent operations.** Retrying a non-idempotent POST can charge a customer twice.
- **Exponential backoff with jitter.** Without jitter, all clients retry simultaneously — a "thundering herd" that DDoSes the recovering service.
- **Cap total attempts.** 3-5 is usually right; more is just delaying failure.

## Circuit breakers — fail-fast when downstream is sick

The pattern: track failures over a window. If failure rate crosses a threshold, **open the circuit** — fast-fail all subsequent calls without even attempting them. After a cool-down, try one request; if it succeeds, close the circuit.

\`\`\`java
CircuitBreaker cb = CircuitBreaker.of("recommendations", CircuitBreakerConfig.custom()
    .failureRateThreshold(50)              // open if > 50% fail
    .slowCallRateThreshold(50)             // or > 50% are slow
    .slowCallDurationThreshold(Duration.ofSeconds(2))
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .slidingWindowSize(20)                 // last 20 calls
    .build());

String result = cb.executeSupplier(() -> recommendationsClient.getFor(userId));
\`\`\`

Three states:

\`\`\`
   CLOSED ──(failures cross threshold)──▶ OPEN
      ▲                                     │
      │ (test call succeeds)                │ (wait window)
      │                                     ▼
   HALF_OPEN ◀─────(test single call)───── (try a request)
\`\`\`

When the circuit is OPEN, calls fail instantly. Combine with a **fallback**:

\`\`\`java
String recs;
try {
  recs = cb.executeSupplier(() -> recommendationsClient.getFor(userId));
} catch (CallNotPermittedException | Exception e) {
  recs = "[]";  // fallback — empty recommendations
}
\`\`\`

The site stays up. Users see no recommendations briefly. Better than 30-second page loads.

## Bulkheads — isolating failure domains

If you have a single thread pool for all outgoing calls, **one slow dependency can saturate it**. Every call to anything starts queueing behind your slow downstream.

The fix: separate thread pools per dependency (the **bulkhead** pattern).

\`\`\`java
Bulkhead bulkhead = Bulkhead.of("inventory", BulkheadConfig.custom()
    .maxConcurrentCalls(10)
    .maxWaitDuration(Duration.ofMillis(50))
    .build());

inventoryClient.callDecorated(Bulkhead.decorateSupplier(bulkhead, supplier));
\`\`\`

Now only 10 threads can be blocked on the inventory service at once. If 50 requests pile up, the extra 40 fail fast — and your service continues handling other work normally.

Spring's reactive (WebFlux) or virtual threads largely sidestep this, since you're not blocking OS threads. But for traditional Spring MVC, bulkheads are essential at scale.

## Resilience4j — the modern toolkit

\`\`\`java
@CircuitBreaker(name = "recommendations", fallbackMethod = "fallback")
@Retry(name = "recommendations")
@TimeLimiter(name = "recommendations")
public CompletableFuture<List<Item>> getRecommendations(String userId) {
  return CompletableFuture.supplyAsync(() -> client.getFor(userId));
}

public CompletableFuture<List<Item>> fallback(String userId, Throwable t) {
  return CompletableFuture.completedFuture(List.of());
}
\`\`\`

Resilience4j is the spiritual successor to Netflix Hystrix (now in maintenance mode). It's the standard in modern Spring Boot apps for these patterns.

## Service mesh — when patterns move out of code

Modern infrastructure (Istio, Linkerd, Consul Connect) implements timeouts, retries, circuit breakers, **and** mTLS, traffic routing, observability — all in a sidecar proxy. Your code makes a normal HTTP call; the mesh intercepts it.

Trade-off:
- **In-code (Resilience4j)** — explicit, testable, fully under your control. Recommended for small fleets.
- **Service mesh** — central control plane, applies uniformly to all services, no code change. Recommended for big fleets where you can't trust every team to do resilience right.

Most teams adopt a service mesh once they have >50 services or strict security requirements (mTLS everywhere).

## A real-world resilience question

\`\`\`java-quiz
level: tricky
q: Your service makes a sync HTTP call to a downstream API. The API responds in 100ms on a good day. You've set a 5-second timeout and 3 retries with exponential backoff (100ms, 200ms, 400ms). What's the worst-case wait for a single user request when the API is completely down?
options: 5 seconds | 5.7 seconds | 15 seconds | 15.7 seconds
correct: 3
explain: Worst case: 3 attempts × 5 seconds each (each hits the timeout because the API is dead) = 15 seconds. Plus the backoff between attempts: 100 + 200 + 400 = 700ms. Total = 15.7 seconds. A user waits 15+ seconds for a request that's certain to fail. The right design: lower the timeout to something matching your SLO (200-500ms), AND wrap it in a circuit breaker so subsequent requests fast-fail. Then the user gets a graceful "couldn't load this section" in 200ms while the circuit is open.
\`\`\`

## What you can do now

- Set explicit timeouts on EVERY external call
- Retry only idempotent ops, with exponential backoff and jitter
- Use circuit breakers + fallbacks for non-critical sync calls
- Use bulkheads (or virtual threads) to isolate slow dependencies
- Consider a service mesh once you have >50 services

Next: **API gateways and the BFF pattern** — how requests actually flow from clients to your services.
`;

export const MS_L4 = `# API gateways and BFF pattern

When you have 30 services, you can't expose them all directly to clients. That's a security disaster, a routing nightmare, and a versioning maze. **An API gateway is the front door** to your microservices. This lesson covers what a gateway does, the BFF pattern, and the choices that matter.

## What a gateway does

A single entry point that handles:
- **Routing** — \`/api/orders/*\` → orders service; \`/api/users/*\` → users service
- **Authentication** — validate the JWT once, propagate identity to downstream services
- **Rate limiting** — protect downstream services from abuse
- **TLS termination** — clients connect over HTTPS; internal traffic can be HTTP
- **Aggregation** (sometimes) — one client call → calls to multiple backend services, aggregated response
- **Caching** — return cached responses for hot read paths
- **Logging + metrics** — central place to see request volume

\`\`\`
                                          ┌──▶ [orders service]
[Client] ─HTTPS─▶ [API Gateway] ─────────┼──▶ [users service]
                  (TLS, auth, RL,         ├──▶ [inventory service]
                   routing, logging)      └──▶ [payments service]
\`\`\`

## The popular gateway options

| Gateway | Best for | Notes |
|---------|----------|-------|
| **Spring Cloud Gateway** | JVM teams already on Spring | Reactive, code-config, full control |
| **Kong** | Polyglot teams | Plugin ecosystem, OSS or enterprise |
| **AWS API Gateway** | AWS-native | Managed, integrates with Lambda |
| **Envoy** | Service-mesh teams | Powers Istio + Consul; also standalone |
| **Nginx + Lua / OpenResty** | Teams comfortable with Nginx | Battle-tested, fast |
| **Traefik** | k8s teams | Auto-discovery from k8s annotations |

For a Spring shop: **Spring Cloud Gateway**. For a k8s shop: **Envoy via Istio** or **Traefik**. For everyone else: **Kong** is usually a safe bet.

## A Spring Cloud Gateway example

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: orders
          uri: http://orders-service:8080
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: ordersCircuit
                fallbackUri: forward:/fallback/orders
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
\`\`\`

This says: route \`/api/orders/*\` to the orders service, strip the path prefix, wrap in a circuit breaker, and rate-limit at 100 req/sec sustained / 200 burst. Done in YAML.

## BFF — Backend For Frontend

Different clients need different shapes of data. The mobile app wants compact JSON tuned for slow networks. The web app wants richer responses. The smart TV app has its own quirks.

If you serve all of them from one API:
- You add bloat the mobile app doesn't need
- You couple mobile release cycles to backend releases
- Versioning becomes a permanent headache

**BFF pattern:** one gateway-like service **per client type**.

\`\`\`
[iOS app]  ──▶ [Mobile BFF]  ──┐
[Web app]  ──▶ [Web BFF]    ──┼──▶ [orders, users, inventory, payments services]
[TV app]   ──▶ [TV BFF]     ──┘
\`\`\`

Each BFF:
- Owned by the frontend team for that platform
- Aggregates calls to underlying services
- Tailors response shape to its specific client
- Can be in any language (often JavaScript/TypeScript for web/mobile teams)

BFFs let your frontend teams move fast without coordinating with every backend team.

## Authentication — JWT propagation

The typical flow:
1. Client logs in, gets a JWT (signed by your auth service)
2. Client sends JWT in \`Authorization: Bearer <token>\` on every request
3. Gateway **validates the JWT signature**, extracts user identity
4. Gateway adds a header like \`X-User-Id: 12345\` and forwards to backend services
5. Backend services trust the header (because they're behind the gateway, only accessible via it)

Backend services **don't re-validate the JWT** — that's the gateway's job. They trust the gateway. Critical: lock down the network so backend services only accept traffic from the gateway.

## Rate limiting strategies

- **Per-user** — prevent one user from monopolizing the API
- **Per-IP** — basic anti-DDoS
- **Per-endpoint** — heavy endpoints (search) get tighter limits
- **Per-service-target** — protect a fragile downstream

Algorithms: **token bucket** (allows bursts) or **leaky bucket** (smooth rate). Modern gateways do both via Redis-backed counters.

## The gateway as a bottleneck

A gateway sits in the path of EVERY request. Implications:
- **High availability is non-negotiable** — gateway down = everything down. Run multiple instances behind a load balancer.
- **Scale carefully** — at 100K req/sec, your gateway might need beefier instances than your services
- **Avoid heavy logic in the gateway** — keep it as a thin router + auth/rate-limit layer. Business logic belongs in services.

## Aggregation — be careful here

It's tempting to have the gateway combine multiple backend calls:

\`\`\`
GET /api/orders/123/full-detail
  → [gateway]
       ├──▶ orders.get(123)
       ├──▶ users.get(orderObj.userId)
       └──▶ inventory.list(orderObj.itemIds)
  ← combined JSON
\`\`\`

This works but blurs responsibility (now the gateway has business knowledge). **Often a BFF is the better home for aggregation**, since BFFs are owned by frontend teams and the aggregation logic IS frontend logic ("show order detail page").

## A gateway interview question

\`\`\`java-quiz
level: medium
q: A team adds JWT validation in every microservice "for defense in depth." Each service decodes and verifies the JWT signature on every request. What's the main downside?
options: It's more secure, no downside | JWT validation is fast, so no perf impact | Auth logic duplicated across services — when the rotation policy changes, every service must update; mistakes in any one service create security holes | JWTs can't be validated server-side
correct: 2
explain: Defense in depth sounds good, but for JWT validation specifically it usually means: every service implements crypto-sensitive code, every team needs the public key, key rotation requires every service to redeploy. Centralizing validation in the gateway has one team owning it, one code path to audit. Backend services receive a trusted X-User-Id header from the gateway and reject any request not coming through the gateway (network-level enforcement). That's the right model. Reserve in-service auth checks for AUTHORIZATION (does this user have permission to do this specific thing) — which is the service's domain knowledge.
\`\`\`

## What you can do now

- Pick a gateway product that fits your stack
- Set up routing, rate limiting, and circuit breakers as declarative config
- Validate JWT once at the gateway, propagate user identity as headers
- Build BFFs for each client type when frontend complexity demands it
- Avoid heavy logic in the gateway (it's a router, not a service)

Next: **Distributed data** — sagas, the outbox pattern, CDC, and the patterns that handle transactions across services.
`;

export const MS_L5 = `# Distributed data — sagas, outbox, CDC

The single hardest problem in microservices: **doing one logical operation that involves two services**. In a monolith, it's one DB transaction. Across services, that simple operation becomes one of the most interview-asked patterns: the **Saga**. This lesson covers it, plus the outbox pattern and change data capture — the trio that makes distributed data tractable.

## The fundamental problem

Move money: debit account A in the Payments service, credit account B in the Ledger service. **You can't do this in one DB transaction** — they're separate databases.

Naive approach:

\`\`\`java
@Transactional
void transfer(Long from, Long to, Money amt) {
  paymentsClient.debit(from, amt);        // HTTP call
  ledgerClient.credit(to, amt);           // HTTP call
}
\`\`\`

If the second call fails (network, ledger service down, etc.) — you've debited A but never credited B. **Money disappeared.** And rolling back the local @Transactional doesn't help; you've already made the HTTP call to debit.

## Saga — distributed transactions, the right way

A **saga** is a sequence of local transactions, where each step has a **compensating action** that undoes its effects.

\`\`\`
Transfer saga:
  1. Debit A           → compensate: Credit A back
  2. Credit B          → compensate: Debit B back
  3. Mark complete     → compensate: nothing (or "log failure")

If step 2 fails: run step 1's compensation.
If step 3 fails: run step 2's compensation, then step 1's.
\`\`\`

Two orchestration styles:

### Orchestration-based saga
A central **saga orchestrator** drives the steps:

\`\`\`java
@Service
class TransferOrchestrator {
  void start(TransferRequest req) {
    try {
      paymentsClient.debit(req.from, req.amount);
      ledgerClient.credit(req.to, req.amount);
      log.info("transfer complete");
    } catch (Exception e) {
      paymentsClient.creditBack(req.from, req.amount);  // compensate
      throw new TransferFailedException(e);
    }
  }
}
\`\`\`

Pros: easy to reason about, easy to debug (one place has the flow). Cons: orchestrator is coupled to all participants.

### Choreography-based saga
No central orchestrator. Each service reacts to events:

\`\`\`
Payments service:
  receive "TransferRequested" → debit → publish "AmountDebited"

Ledger service:
  receive "AmountDebited" → credit → publish "AmountCredited"

If credit fails, Ledger publishes "CreditFailed" →
Payments listens, runs compensation, publishes "AmountReversed"
\`\`\`

Pros: loosely coupled, naturally async. Cons: hard to see the whole flow; debugging requires log-correlation across services.

**Orchestration is the safer default.** Use choreography only when you have very mature observability (distributed tracing, event lineage).

## The Outbox Pattern — the killer fix

The naive saga has a sneaky bug. Consider:

\`\`\`java
@Transactional
void debit(Long account, Money amt) {
  accountRepository.debit(account, amt);          // DB write
  kafka.send("AmountDebited", new Event(...));   // event publish
}
\`\`\`

What if the DB commits succeed but the Kafka publish fails? **The DB has the debit, but no event was emitted** — the credit will never happen.

What if Kafka succeeds but the DB transaction rolls back? **The event is out claiming a debit that didn't happen** — the credit happens against nothing.

**The Outbox Pattern fixes this:**

\`\`\`java
@Transactional
void debit(Long account, Money amt) {
  accountRepository.debit(account, amt);
  outboxRepository.save(new OutboxEvent("AmountDebited", payload));  // SAME transaction
}
\`\`\`

You write the event to an **outbox table** in the same DB transaction as your business change. Then a **separate background process** reads the outbox and publishes events to Kafka. If Kafka is down, events accumulate; when it recovers, they get published.

**This is the single most important pattern in event-driven microservices.** It guarantees: "if the business change happened, the event will eventually fire" with no message loss.

## CDC — Change Data Capture

Reading the outbox table on a timer works. **Reading it via the database's transaction log** is way better — that's CDC.

\`\`\`
Postgres WAL ─────▶  [Debezium]  ─────▶  Kafka
              (logical decoding)

Every INSERT/UPDATE/DELETE in the outbox table becomes a Kafka message.
\`\`\`

[Debezium](https://debezium.io/) is the standard. It reads Postgres's logical replication slot, MySQL's binlog, MongoDB's oplog, and converts row changes into Kafka events with **exactly-once delivery semantics**.

The architecture:

\`\`\`
[Your service]  ──INSERT into outbox──▶  [Postgres]
                                              │
                                              │  (WAL streaming)
                                              ▼
                                          [Debezium]  ──events──▶  [Kafka]
\`\`\`

You never write to Kafka directly. You write to your DB (in your normal transactions). Debezium streams the changes. Your business logic stays purely transactional; the messaging is decoupled.

## When NOT to use a saga

Sagas have real cost (compensation logic, intermediate states). Skip them when:
- Your operation doesn't actually need to span services — keep it in one service
- The operation is read-only — no compensations needed
- You can use a single source of truth (e.g., publish event from owning service, let others react)

**The most common mistake:** writing sagas for operations that should just live in one service. If transferring money between accounts is core to your business, **all account operations should probably be in the Accounts service** — no saga needed.

## Eventual consistency UX

When you go async, the user sees **stale state briefly**. Patterns to mask it:

1. **Optimistic UI** — show the success state immediately; reconcile if it fails
2. **Polling** — frontend polls for updated state every few seconds after the action
3. **Server-Sent Events / WebSocket** — push the eventual state to the frontend when it arrives
4. **"Processing..." state** — explicit user feedback that something is in-flight

The right choice depends on how often things fail (rare = optimistic UI) and how visible the state is.

## A saga interview question

\`\`\`java-quiz
level: tricky
q: A bank's transfer flow uses a saga: Debit A → Credit B. Step 2 fails because Ledger service is down. The compensation runs and re-credits A. Three days later, the Ledger service is back, and they want to know: should the transfer just complete (Credit B) now, OR should the user re-initiate it?
options: Complete it — the request was already accepted | Re-initiate it — three days is too long | Depends on business rules. The saga should have a clear "abandoned" state after compensation; resuming a compensated saga is generally NOT what you want | Resume automatically with no user action
correct: 2
explain: Once compensation runs, the saga is "rolled back" — for the user, it failed. Silently completing it three days later violates user expectation (they might have made other arrangements). The right design: saga state machine has CREATED, IN_PROGRESS, COMPLETED, COMPENSATING, COMPENSATED, FAILED. Once in COMPENSATED, the saga is dead. The user must re-initiate. If a saga is COMPENSATING and gets stuck (because the compensation also failed), THAT needs operator attention — but the rollback state is final once entered. This is the kind of edge-case thinking that gets you senior offers.
\`\`\`

## What you can do now

- Recognize when a single operation spans services (Saga territory)
- Pick orchestration over choreography by default
- Implement the Outbox Pattern to guarantee event publication
- Use CDC (Debezium) to remove the outbox poller from your service
- Push back on premature sagas — many "saga" operations should live in one service

Next: **Observability** — without it, microservices are unrunnable. Distributed tracing, structured logs, metrics, and OpenTelemetry.
`;

export const MS_L6 = `# Observability — tracing, logs, metrics, OpenTelemetry

In a monolith, "I'll grep the log" is a real strategy. In microservices, that one user request touches 12 services across 5 hosts. Without observability, **you literally cannot debug.** This lesson is the toolkit and the patterns that make distributed systems operable.

## The three pillars (and the synthesizer)

| Pillar | Question it answers | Tools |
|--------|---------------------|-------|
| **Logs** | What happened? | ELK, Loki, Splunk, Datadog Logs |
| **Metrics** | How is the system behaving overall? | Prometheus, Datadog, NewRelic |
| **Traces** | What did this specific request do? | Jaeger, Tempo, Honeycomb, Datadog APM |
| **OpenTelemetry** | The unifying standard | OTel SDK + OTel Collector |

All three matter. Traces are the killer feature for microservices.

## Distributed tracing — see the whole request

A trace shows one request's journey through every service:

\`\`\`
[Trace: bf2c91a3]  POST /api/orders     (total: 423ms)
  ├─ [Gateway]              23ms
  ├─ [OrderService]        387ms
  │   ├─ [InventoryService]   45ms
  │   ├─ [PaymentService]    198ms
  │   │   └─ [StripeAPI]      174ms     ← slow!
  │   └─ [DB INSERT]            12ms
  └─ [Gateway response]      13ms
\`\`\`

The slow Stripe call is **visible in one glance**. Without tracing, you'd grep logs across 4 services and try to correlate by timestamp. With tracing, the answer is the first thing you see.

Each call gets a **span**. The whole tree of spans is a **trace**, identified by a **trace ID** propagated across services via HTTP headers (W3C \`traceparent\` is the standard).

## OpenTelemetry — the standard

OpenTelemetry (OTel) is **the** open-source observability standard. It includes:
- **SDKs** in every language — instrumented to emit spans, metrics, and logs
- **Auto-instrumentation** — agents that automatically instrument HTTP clients, JDBC, Kafka, etc. without code changes
- **Collector** — central agent that receives OTel data and exports to your backend (Jaeger, Tempo, Datadog, etc.)

For Java + Spring Boot 3:

\`\`\`yaml
# Boot 3 includes Micrometer Tracing — wires to OTel out of the box
management:
  tracing:
    sampling:
      probability: 0.1    # trace 10% of requests in prod
  otlp:
    tracing:
      endpoint: http://otel-collector:4318/v1/traces
\`\`\`

\`\`\`xml
<!-- pom.xml -->
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
\`\`\`

Done. Spring Boot's auto-instrumentation now emits spans for every HTTP request and every WebClient call, propagates trace headers between services, and exports to your collector.

For polyglot services: each language has its own OTel SDK. The trace context (\`traceparent\` header) is the same across all of them.

## Sampling — don't trace everything

Tracing every request gets expensive (storage, network, CPU). Two approaches:

### Head-based sampling
Decide at the entry point: "trace this request." All downstream spans for this request are traced. Simple but biased — you can't recover spans for an interesting request you didn't pick.

\`\`\`
sampling.probability: 0.1   # 10% of requests
\`\`\`

### Tail-based sampling
Buffer ALL spans for a request. After the request completes, decide: "this one had an error" or "it took >1s" → keep it; otherwise → discard.

Requires a more sophisticated collector setup. **Worth it.** You always capture errors and slow requests, paying storage cost only for the interesting ~5%.

## Structured logging

Logs as text are unsearchable in microservices. **Structured logs as JSON** are queryable.

\`\`\`json
{
  "timestamp": "2026-05-24T18:32:14Z",
  "level": "INFO",
  "service": "order-service",
  "trace_id": "bf2c91a3...",
  "user_id": "u_12345",
  "order_id": "o_98765",
  "message": "Order placed",
  "duration_ms": 423
}
\`\`\`

Three keys to include in EVERY log:
1. \`trace_id\` — correlate to the trace
2. \`service\` — what service
3. \`user_id\` (or some logical entity) — find all logs for one user

Spring Boot 3 with Micrometer Tracing auto-includes trace_id and span_id in your logs via MDC. Configure the layout once:

\`\`\`xml
<encoder class="net.logstash.logback.encoder.LogstashEncoder">
  <includeMdcKeyName>traceId</includeMdcKeyName>
  <includeMdcKeyName>spanId</includeMdcKeyName>
</encoder>
\`\`\`

Now in Loki / ELK, you can filter to one trace and see logs across every service that handled that request.

## Metrics — the system view

Logs are per-event. Traces are per-request. **Metrics are per-second** — aggregate counters and gauges.

\`\`\`java
@Service
class OrderService {
  private final Counter orders;
  private final Timer creationTime;

  OrderService(MeterRegistry registry) {
    this.orders = registry.counter("orders.created");
    this.creationTime = registry.timer("orders.create.duration");
  }

  Order create(...) {
    return creationTime.record(() -> {
      Order o = doCreate();
      orders.increment();
      return o;
    });
  }
}
\`\`\`

Spring Boot + Micrometer exposes \`/actuator/prometheus\`. Prometheus scrapes; Grafana visualizes; you build dashboards.

**The four golden signals to track per service** (Google SRE book):
1. **Latency** — request duration (p50, p95, p99)
2. **Traffic** — requests per second
3. **Errors** — error rate
4. **Saturation** — resource use (CPU, memory, DB pool, queue depth)

## SLOs — the right alerting target

Don't alert on "latency > 200ms" — that fires constantly. Alert on **SLO burn rate**:

\`\`\`
SLO: 99% of requests in <500ms over a 30-day window
   = "budget" for 1% slow requests = 4 hours of slowness per month

Alert when burn rate is fast enough to exhaust the budget early.
\`\`\`

This is the discipline that separates teams who get paged for real problems from teams who tune out alerts.

## A tracing interview question

\`\`\`java-quiz
level: medium
q: A trace shows a request taking 2 seconds, with most time in a single span: "GET /api/customer-profile." But when you check that endpoint directly with curl, it returns in 50ms. What's likely happening?
options: The trace is wrong — wait it out | The span includes time waiting for a thread in a saturated pool — the actual work was fast, but the request waited 1.95s before being processed | Network congestion in the cluster | Slow garbage collection
correct: 1
explain: A span that "takes 2 seconds" includes everything from when the request was sent to when the response arrived. If the upstream service's thread pool is saturated, the request waits in queue before any work begins. The actual processing time (visible if you instrument it as a separate span) might be 50ms. Lesson: tracing shows you END-TO-END time, which includes queue waits. To diagnose: add finer-grained spans inside the service, or look at the service's queue-depth metric. Or move to virtual threads / a bigger pool. This question separates "uses tracing" from "understands tracing."
\`\`\`

## You've finished Microservices

Six lessons in: you can articulate when to use microservices (and when not), pick communication patterns, build in resilience, place an API gateway, design distributed data flows, and instrument the whole thing observably.

This is the working backend architect's toolkit for 2026. Combine it with the Spring Frameworks course (build the services) and the Kafka course (the async backbone) and you've got the JVM half of modern distributed systems.

What's next when you want more: **System Design** — putting this toolkit to work answering "design Twitter" / "design Uber" interview prompts.
`;
