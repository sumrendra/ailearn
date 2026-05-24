/* eslint-disable no-irregular-whitespace */
/**
 * Java Advanced — 10 lessons covering everything senior Java work touches
 * beyond the Java Complete + Frameworks foundation: security, reactive,
 * cloud, caching, messaging, GraphQL, native compilation, JVM tuning,
 * Project Loom in depth, modern internals.
 */

export const JA_L1 = `# Spring Security — the complete picture

Every serious Spring Boot app uses Spring Security. It's also the most-feared dependency in the ecosystem — partly because it's genuinely big, partly because tutorials confuse the model. This lesson is the **mental model** you can use to read any Spring Security codebase.

## The two questions Security answers

Every request, on every endpoint, asks two questions:
1. **Authentication** — who is making this request?
2. **Authorization** — are they allowed to do what they're trying to do?

Authentication is the harder one to implement; authorization is the harder one to design.

## The filter chain — what's actually running

Spring Security is, fundamentally, **a chain of servlet filters** that runs before your controllers. Each filter has one job. A simplified view of the chain:

\`\`\`
Request ──▶ [SecurityContextPersistenceFilter]   loads stored auth from session
        ──▶ [BearerTokenAuthenticationFilter]    extracts JWT, builds Authentication
        ──▶ [UsernamePasswordAuthenticationFilter] handles /login form posts
        ──▶ [ExceptionTranslationFilter]         turns auth exceptions into 401/403
        ──▶ [FilterSecurityInterceptor]          runs the @PreAuthorize checks
        ──▶ Your Controller
\`\`\`

You almost never write filters yourself. You configure which ones run and how. Understanding the chain lets you debug anything.

## A modern Spring Security 6+ config

The era of \`extends WebSecurityConfigurerAdapter\` is over. Modern config is a bean:

\`\`\`java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // unlocks @PreAuthorize / @PostAuthorize
public class SecurityConfig {

  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())                       // we're stateless API; no CSRF
      .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/public/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
      .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(jwtConverter())))
      .build();
  }
}
\`\`\`

Read it top-down: stateless, no CSRF, public paths, admin paths, everything else needs auth, validate JWT from \`Authorization: Bearer ...\`. Done.

## JWT vs session cookies — the modern choice

| | JWT | Session cookie |
|---|---|---|
| **State** | Stateless (token is the state) | Server holds session in memory/Redis |
| **Scale** | Trivial — no shared state across nodes | Need sticky sessions or shared session store |
| **Revoke** | Hard — need a blocklist | Easy — delete the session |
| **Size** | ~500 bytes-2KB per request | ~50 byte session ID |
| **Best for** | APIs, mobile apps, SPAs | Server-rendered web apps |

For a typical backend API: **JWT**. For a Thymeleaf-rendered admin panel: **sessions**. Hybrid is common — JWT for the public API, sessions for the admin UI.

## Method security — fine-grained authorization

\`\`\`java
@Service
public class OrderService {

  @PreAuthorize("hasRole('USER')")
  public List<Order> myOrders() { ... }

  // Express resource-level rules with SpEL
  @PreAuthorize("@orderPolicy.canRead(#orderId, authentication.principal)")
  public Order get(Long orderId) { ... }

  // After the method runs, filter the result
  @PostAuthorize("returnObject.ownerId == authentication.principal.id")
  public Order getOwn(Long id) { ... }
}
\`\`\`

The \`@orderPolicy.canRead(...)\` pattern is the right way to do non-trivial authorization. The policy lives in a bean, gets called via SpEL. Easy to test, easy to evolve.

## OAuth2 — when you don't want to manage passwords

If users log in via Google, GitHub, Microsoft etc., you don't need to handle passwords at all. Spring Security has first-class OAuth2 / OIDC support.

\`\`\`yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ...
            client-secret: ...
            scope: openid, profile, email
\`\`\`

Add the starter, drop these properties, and \`/oauth2/authorization/google\` is a working login link. User's email and profile flow back as a JWT.

## A killer interview question

\`\`\`java-quiz
level: tricky
q: A user logs in and gets a JWT. Five minutes later, the user is fired and you "revoke" their access in your admin panel. They keep making API calls successfully for another 55 minutes. Why?
options: There's a bug in your code | JWTs are stateless — the server has no record of them, so "revoking" doesn't affect existing tokens until they expire | The user has multiple JWTs | The JWT signing key was rotated incorrectly
correct: 1
explain: The stateless nature of JWT IS the design. The server doesn't store a list of "valid" tokens — it just validates the signature + expiry on each request. To revoke, you need (a) very short expiry + refresh tokens, OR (b) a revocation blocklist (which sort of defeats the statelessness). For Canadian PR-grade authorization where instant revocation matters, sessions with a real backing store often beat JWT. The "JWT vs sessions" debate isn't religious — it's about your revocation requirements.
\`\`\`

## What you can do now

- Read a Spring Security config and predict which requests will be blocked
- Choose between JWT and sessions based on revocation requirements
- Wire \`@PreAuthorize\` policies as bean-backed SpEL for non-trivial rules
- Add OAuth2 / OIDC providers without writing crypto code
- Debug "why is this returning 401" by reading the filter chain

Next: **Reactive Java** — WebFlux + Project Reactor, and when reactive still beats virtual threads.
`;

export const JA_L2 = `# Reactive Java — WebFlux, Reactor, and when it still wins

Project Loom (virtual threads, Java 21) made reactive Java less essential for most apps. **But "less essential" isn't "obsolete."** This lesson covers reactive properly so you can pick the right tool — and read the substantial body of existing reactive Spring code in the wild.

## The reactive model

Imperative code does this:

\`\`\`java
User u = userService.findById(id);            // blocks
List<Order> orders = orderService.byUser(u);  // blocks
Account a = accountService.byUser(u);         // blocks
return new Profile(u, orders, a);
\`\`\`

Three sequential blocking calls. Total time = sum of all three.

Reactive (Reactor) flips the model — every operation returns a **publisher** (Mono = 0/1 value, Flux = 0-N values), nothing blocks until you ask for the result:

\`\`\`java
Mono<User> userMono = userService.findById(id);
return userMono.flatMap(u ->
  Mono.zip(
    orderService.byUser(u).collectList(),
    accountService.byUser(u),
    (orders, account) -> new Profile(u, orders, account)
  )
);
\`\`\`

The two downstream calls run in parallel. Total time = max(orders, account) + user, not sum.

## When reactive wins vs virtual threads

| Use case | Reactive (WebFlux) | Virtual threads (Boot 3.2+) |
|----------|---------------------|------------------------------|
| Many concurrent I/O calls | ✓ | ✓ |
| Parallel composition (zip, when) | ✓ Built-in | Manual orchestration |
| Backpressure across systems | ✓ Built-in | Hard |
| Streaming responses (SSE, gRPC streams) | ✓ Built-in | Possible but awkward |
| Code clarity | Steep learning curve | Looks like normal blocking code |
| Stack traces | Often inscrutable | Clean |
| Existing imperative codebase | Painful migration | Drop-in |

**Modern verdict:** for greenfield Boot 3.2+ Java 21 apps, virtual threads cover ~80% of reactive's use cases with vastly simpler code. Reactive wins for streaming + complex composition + huge fan-out scenarios.

## The core operators

\`\`\`java
Mono<User>.map(User::email)                     // sync transform
Mono<User>.flatMap(u -> emailService.send(u))  // async transform (returns Mono)
Flux<Order>.filter(o -> o.amount > 100)         // pass-through
Flux<Order>.window(Duration.ofSeconds(1))       // batch into time windows
Flux<Order>.parallel().runOn(Schedulers.boundedElastic())  // parallelize
Mono.zip(monoA, monoB, (a, b) -> ...)           // wait for BOTH
Mono.firstWithSignal(monoA, monoB)              // wait for FIRST
\`\`\`

The pattern recognition: **map** transforms a value; **flatMap** chains another publisher; **zip** joins multiple in parallel.

## Backpressure — the killer feature

If a Flux produces faster than its consumer can handle, what happens? **Backpressure** is reactive's answer.

\`\`\`java
flux.onBackpressureBuffer(1000)        // buffer up to 1000 ahead, drop after
    .onBackpressureDrop()              // discard newest
    .onBackpressureLatest()            // keep latest, drop interim
\`\`\`

This isn't a luxury feature — for any high-volume streaming pipeline, you need it. It's why message-driven systems (Kafka consumers, gRPC server streams) often use Reactor even when most of the app is imperative.

## WebFlux controller

\`\`\`java
@RestController
public class ProductsController {

  @GetMapping("/products/{id}")
  public Mono<Product> get(@PathVariable Long id) {
    return repo.findById(id);
  }

  // SSE stream of price updates
  @GetMapping(value = "/products/{id}/prices", produces = TEXT_EVENT_STREAM_VALUE)
  public Flux<PriceUpdate> priceStream(@PathVariable Long id) {
    return priceService.stream(id)
        .takeUntilOther(closedSignal);
  }
}
\`\`\`

Note: nothing in this controller blocks. The framework subscribes to your publisher and pushes data to the client as it arrives.

## R2DBC — reactive database access

JDBC blocks by definition. **R2DBC** is the reactive alternative — non-blocking from the driver up.

\`\`\`java
public interface ProductRepo extends ReactiveCrudRepository<Product, Long> {
  Flux<Product> findByCategory(String category);
}
\`\`\`

R2DBC has Postgres, MySQL, MariaDB, MSSQL drivers. **Big catch:** no JPA. No \`@Entity\`, no lazy loading, no Hibernate. Spring Data R2DBC is a much simpler mapping layer.

## A reactive interview gotcha

\`\`\`java-quiz
level: tricky
q: Why does this code do nothing?
code:
  Mono<String> result = userService.findById(id)
      .map(User::email);
  System.out.println("Done");
options: It works — output happens later | The lambda isn't called because nothing subscribed to the Mono. Reactive publishers are LAZY. | A bug in Reactor | Mono needs a Scheduler
correct: 1
explain: This is THE classic reactive bug. Building a publisher doesn't execute anything — it builds a recipe. The recipe runs when something subscribes. In a Spring WebFlux controller, the framework subscribes to whatever you return. In standalone code, you must call .subscribe(), .block(), or pass it into something that subscribes. Forgetting this leads to ghost code that compiles but never runs.
\`\`\`

## What you can do now

- Read a reactive pipeline and predict execution order
- Pick \`map\` vs \`flatMap\` correctly
- Use \`zip\` for parallel composition of independent calls
- Apply backpressure to streaming pipelines
- Choose reactive vs virtual threads based on use case (streaming + composition vs simplicity)
- Recognize "nothing happens" as the unsubscribed-Mono bug

Next: **Spring Cloud** — config server, service discovery, gateway, distributed config that scales beyond one app.
`;

export const JA_L3 = `# Spring Cloud — config, discovery, gateway, resilience at scale

Spring Cloud is the umbrella for "Spring at distributed-systems scale." It's a big surface area, but the **must-know pieces** are smaller than they look. This lesson covers what you actually use in modern Spring microservices.

## The five pieces that matter

| Piece | What it solves |
|---|---|
| **Spring Cloud Config** | Centralized config; per-environment overrides; live refresh |
| **Service Discovery** (Eureka, Consul, k8s) | "Where is the orders service?" answered dynamically |
| **Spring Cloud Gateway** | API gateway in Java (alternative to Kong/Envoy) |
| **Spring Cloud Stream** | Binder-abstracted messaging (Kafka, RabbitMQ, Pulsar) |
| **Spring Cloud Sleuth / OpenTelemetry** | Distributed tracing across services |

The rest (Hystrix, Ribbon, Zuul, Bus) is **deprecated or merged elsewhere**. Don't learn it for new code.

## Spring Cloud Config — centralized configuration

Each service stops carrying its own \`application.yml\`. Instead, configs live in a git repo, served by a Config Server.

\`\`\`
config-repo/
  application.yml              # shared defaults
  orders-service.yml           # orders-specific
  orders-service-prod.yml      # orders in production
\`\`\`

A service starts up, asks the Config Server "give me my config for profile=prod," gets the merged YAML. Change a value in git → push → \`/actuator/refresh\` → the service reloads without restart.

\`\`\`yaml
# bootstrap.yml in each service
spring:
  application:
    name: orders-service
  config:
    import: configserver:http://config-server:8888
\`\`\`

**Trade-off:** the config server becomes a critical dependency. It needs HA. Common alternative: **HashiCorp Vault** (secrets) + \`application.yml\` baked into images for everything else.

## Service discovery — Eureka vs Consul vs k8s

Three flavors:

| Tool | When |
|---|---|
| **Eureka** (Netflix OSS) | Greenfield Spring Cloud shops, no other infrastructure |
| **Consul** | Polyglot fleet; needs richer features (KV store, service mesh) |
| **Kubernetes DNS** | Anyone on k8s; the cluster IS your discovery |

For 95% of modern setups: **just use k8s**. Each service becomes a Service object; other services find it via DNS name. No extra component to operate.

\`\`\`java
// k8s-native: just hit the service DNS name
restClient.get().uri("http://orders-service:8080/orders/123")...
\`\`\`

## Spring Cloud Gateway — API gateway in Spring

Built on WebFlux. Routes, rewrites, rate limits, circuit breakers, security — all configured in YAML.

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: orders
          uri: lb://orders-service          # lb = use service discovery
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
            - name: CircuitBreaker
              args:
                name: ordersCircuit
                fallbackUri: forward:/fallback/orders
\`\`\`

If your stack is all-Java, Spring Cloud Gateway is a natural choice — you can write custom filters in Java/Reactor. Alternative when polyglot: Kong or Envoy.

## Spring Cloud Stream — declarative messaging

Stop writing producer/consumer code. Declare functions; let the binder wire them to Kafka/RabbitMQ.

\`\`\`java
@Configuration
public class OrderProcessing {

  // Consumer: receives orders, returns events
  @Bean
  public Function<Order, OrderProcessed> processOrder() {
    return order -> {
      // process
      return new OrderProcessed(order.id(), Instant.now());
    };
  }
}
\`\`\`

\`\`\`yaml
spring:
  cloud:
    stream:
      bindings:
        processOrder-in-0:
          destination: orders-input
        processOrder-out-0:
          destination: orders-output
\`\`\`

Switching from RabbitMQ to Kafka? **Just change the binder dependency.** The business logic doesn't change. This is great if you're not sure yet, or have legitimate reasons to change.

## Resilience4j — circuit breakers (Hystrix is dead)

Spring Cloud Circuit Breaker integrates Resilience4j as Spring beans:

\`\`\`java
@Bean
public Customizer<Resilience4JCircuitBreakerFactory> circuitBreakerConfig() {
  return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
      .timeLimiterConfig(TimeLimiterConfig.custom().timeoutDuration(Duration.ofSeconds(3)).build())
      .circuitBreakerConfig(CircuitBreakerConfig.ofDefaults())
      .build());
}
\`\`\`

\`\`\`java
@Service
public class RecommendationsService {
  @CircuitBreaker(name = "recs", fallbackMethod = "fallback")
  public List<Item> get(String userId) { ... }

  public List<Item> fallback(String userId, Throwable t) { return List.of(); }
}
\`\`\`

## Tracing — OpenTelemetry replaces Sleuth

Old: Spring Cloud Sleuth + Zipkin. New: **Micrometer Tracing + OpenTelemetry**. Auto-instrumented for HTTP, JDBC, Kafka, Reactor. We covered this in the Microservices course.

## A modern stack interview question

\`\`\`java-quiz
level: medium
q: You're building a new Spring microservices fleet on Kubernetes. Which Spring Cloud components do you NOT need?
options: All of them — k8s replaces Spring Cloud | Eureka and Spring Cloud Config — k8s does both better | None — Spring Cloud is always required | Spring Cloud Stream
correct: 1
explain: On k8s, service discovery comes free (Service DNS). For config, k8s ConfigMaps + Secrets + external secret managers (Vault, AWS Secrets Manager) often beat Spring Cloud Config — you don't add a separate config server. You DO still want Spring Cloud Gateway (if you don't use Envoy/Istio) and Spring Cloud Stream (if you want binder-portability). The mistake is reflexively adopting "all of Spring Cloud" when k8s already gives you half the pieces.
\`\`\`

## What you can do now

- Pick which Spring Cloud pieces you need based on your infrastructure
- Centralize config without rebuilding services for changes
- Route + rate-limit + circuit-break at the gateway layer
- Use Spring Cloud Stream to keep your messaging code portable
- Replace Sleuth with Micrometer Tracing + OpenTelemetry in modern apps

Next: **Caching strategies** — Caffeine, Redis, two-level caches, the invalidation patterns that don't burn you.
`;

export const JA_L4 = `# Caching — Caffeine, Redis, two-level patterns

Caching is one of the highest-leverage optimizations. It's also one of the easiest to get wrong — cache invalidation is genuinely one of the hardest problems in computer science. This lesson covers the patterns that work.

## The cache hierarchy

\`\`\`
[Browser cache]      ← HTTP cache headers
[CDN edge]           ← geo-distributed
[Reverse proxy]      ← Varnish/Nginx
[L1: in-process]     ← Caffeine — fastest, per-instance
[L2: distributed]    ← Redis — shared across instances
[Database]
\`\`\`

Each layer in front cuts traffic to the next. Your app code typically lives between L1 and the database.

## Spring Cache — declarative, swappable backend

\`\`\`java
@Configuration
@EnableCaching
public class CacheConfig {
  @Bean
  public CacheManager cacheManager() {
    return new CaffeineCacheManager("countries", "products");
  }
}

@Service
public class CountryService {

  @Cacheable("countries")
  public Country findByCode(String code) {
    return repo.findByCode(code).orElseThrow();
  }

  @CacheEvict(value = "countries", key = "#country.code")
  public void update(Country country) { repo.save(country); }
}
\`\`\`

Same code works with Redis if you swap the \`CacheManager\` bean. **The discipline:** annotate at the service layer, not the repository — service operations are what callers want to cache.

## Caffeine — the L1 cache

Caffeine is the modern in-process cache for the JVM. Bounded, expiring, async-loadable.

\`\`\`java
LoadingCache<String, Country> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(Duration.ofHours(1))
    .refreshAfterWrite(Duration.ofMinutes(15))   // refresh in background before expiry
    .recordStats()                                // exposed via /actuator/metrics
    .build(key -> repo.findByCode(key));
\`\`\`

The killer feature is \`refreshAfterWrite\` — it serves the existing entry while a background thread refreshes it. The user never sees a slow cold-load.

**Use Caffeine for:**
- Per-instance hot data (config, country lookups, top users)
- Idempotent loaders (the cache will call them on miss)
- Anything where ~50MB of memory pays for itself in saved DB hits

## Redis — the L2 cache

Caffeine is per-instance. With 10 app instances and a 1-hour TTL, each instance might independently cache the same entry, with stale views diverging.

**Redis** centralizes the cache. All instances hit one Redis cluster.

\`\`\`java
@Bean
public RedisCacheConfiguration cacheConfig() {
  return RedisCacheConfiguration.defaultCacheConfig()
      .entryTtl(Duration.ofHours(1))
      .disableCachingNullValues()
      .serializeValuesWith(SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
}
\`\`\`

Same \`@Cacheable\` annotations now hit Redis. Caches are consistent across all instances.

**Cost:** ~1ms Redis round-trip per read. For very hot data, this beats DB but loses to in-process.

## Two-level — Caffeine in front of Redis

The pattern that wins for serious traffic:

\`\`\`
read():
  1. Check Caffeine (microseconds, hit rate ~90%)
  2. On miss, check Redis (~1ms, hit rate ~99%)
  3. On miss, hit DB, populate both layers
  4. Return value
\`\`\`

Spring \`@Cacheable\` doesn't do this natively. You either:
- Use a library like Spring Cache Layered (community)
- Write a custom \`CacheManager\` that wraps both
- Use Caffeine + manual fallback to Redis

The patterns are well-documented; the key is **invalidation cascades**: when you evict from Redis, you need to evict from every Caffeine too (publish an invalidation message via Redis Pub/Sub).

## Invalidation strategies

The three options, increasing in correctness and complexity:

### TTL (just expire)
Simple. Accept some staleness. Caches refresh on TTL.
- Use when: data isn't catastrophically wrong if 5 minutes stale (product info, user profiles)

### Explicit invalidation (write-through)
On every write, evict the cache key. The next read repopulates.
- Use when: you can name all the keys a write affects (single-entity updates)

### CDC / event-based
Listen to database changes (Debezium); evict reactively.
- Use when: writes happen outside your app (other services, batch jobs, manual DB tweaks)

## Cache stampede — the classic production fire

Hot cache key expires. 10,000 concurrent requests miss. All 10,000 query the DB. DB falls over.

**Fixes** in order of completeness:

1. **Probabilistic early expiration** — refresh slightly before TTL, one request triggers it
2. **Single-flight (lock per key)** — only one request reloads; others wait
3. **Stale-while-revalidate** — serve the stale value, refresh in background

Caffeine's \`refreshAfterWrite\` IS stale-while-revalidate. That's why it's the default recommendation.

## A caching gotcha

\`\`\`java-quiz
level: tricky
q: A service has @Cacheable on a method. Inside the same class, another method calls it directly. The cache isn't being hit. Why?
code:
  @Service
  public class CountryService {
    @Cacheable("countries")
    public Country findByCode(String code) { ... }

    public List<Country> findByCodes(List<String> codes) {
      return codes.stream().map(this::findByCode).toList();
    }
  }
options: A bug in Spring Cache | Self-invocation bypasses the AOP proxy that implements @Cacheable | The cache name is wrong | Maps don't support method references
correct: 1
explain: This is the same proxy-bypass trap that bites @Transactional. Spring implements @Cacheable by wrapping the bean in a proxy. The proxy intercepts EXTERNAL calls and consults the cache; internal calls (this.findByCode) hit the original method directly, skipping the proxy. Fixes: (a) split into two beans; (b) inject self via @Autowired; (c) call via ApplicationContext.getBean(CountryService.class).findByCode(code). The proxy bypass is the #1 reason "my @Cacheable isn't working." Same root cause as the @Transactional self-invocation issue from Java Frameworks lesson 1.
\`\`\`

## What you can do now

- Pick L1 (Caffeine) vs L2 (Redis) vs both based on traffic + consistency needs
- Use \`refreshAfterWrite\` to avoid cold-load stalls
- Pick invalidation strategy: TTL, explicit, or CDC
- Defend against cache stampedes with single-flight or stale-while-revalidate
- Recognize the self-invocation proxy-bypass bug

Next: **Messaging in Spring** — Spring Kafka, Spring AMQP, error handling, retry topics. The patterns event-driven Spring apps live in.
`;

export const JA_L5 = `# Spring Messaging — Kafka, RabbitMQ, error handling

Most production Spring apps eventually need messaging. Spring's messaging integrations are well-trodden but have gotchas — especially around error handling and retries. This lesson covers Spring Kafka and Spring AMQP (RabbitMQ) at production-grade.

## Spring Kafka — the modern default

\`\`\`java
@Configuration
public class KafkaConfig {

  @Bean
  public ProducerFactory<String, OrderEvent> producerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(BOOTSTRAP_SERVERS_CONFIG, "broker1:9092,broker2:9092");
    props.put(KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    props.put(VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    props.put(ACKS_CONFIG, "all");
    props.put(ENABLE_IDEMPOTENCE_CONFIG, true);
    return new DefaultKafkaProducerFactory<>(props);
  }

  @Bean
  public KafkaTemplate<String, OrderEvent> kafkaTemplate(ProducerFactory<String, OrderEvent> pf) {
    return new KafkaTemplate<>(pf);
  }
}

@Service
public class OrderPublisher {

  private final KafkaTemplate<String, OrderEvent> template;

  public CompletableFuture<SendResult<String, OrderEvent>> publish(Order order) {
    return template.send("orders", order.id().toString(), new OrderEvent(order));
  }
}
\`\`\`

For the consumer side:

\`\`\`java
@KafkaListener(topics = "orders", groupId = "billing-service")
public void processOrder(@Payload OrderEvent event,
                         @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                         Acknowledgment ack) {
  try {
    billing.charge(event);
    ack.acknowledge();        // manual commit AFTER processing
  } catch (Exception e) {
    // don't ack — message gets re-delivered
    throw e;
  }
}
\`\`\`

Set up the listener container factory with manual ack:

\`\`\`yaml
spring:
  kafka:
    consumer:
      enable-auto-commit: false
    listener:
      ack-mode: manual
\`\`\`

This is the **production-safe consumer pattern**: manual commit AFTER processing. Auto-commit is dangerous; we covered why in the Kafka course.

## Dead-letter topics — the right way

Poison messages will happen. A consumer that retries forever blocks the partition. Spring Kafka has built-in DLT support:

\`\`\`java
@Configuration
public class ErrorHandlingConfig {

  @Bean
  public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
    var recoverer = new DeadLetterPublishingRecoverer(template,
        (record, ex) -> new TopicPartition(record.topic() + ".DLT", record.partition()));

    return new DefaultErrorHandler(recoverer,
        new ExponentialBackOffWithMaxRetries(3));   // retry 3× with backoff
  }
}
\`\`\`

After 3 failed retries, the message goes to \`{topic}.DLT\` for human investigation. Combined with a DLT monitor that alerts when entries accumulate, you've covered the poison-message case.

## Spring AMQP — RabbitMQ in Spring

RabbitMQ is still the right choice for: smaller scale, classic work queues, complex routing topologies (topic exchanges).

\`\`\`java
@Configuration
public class RabbitConfig {

  @Bean
  public Queue ordersQueue() {
    return QueueBuilder.durable("orders")
        .withArgument("x-dead-letter-exchange", "orders-dlx")
        .build();
  }

  @Bean
  public TopicExchange ordersExchange() {
    return new TopicExchange("orders-exchange");
  }

  @Bean
  public Binding ordersBinding() {
    return BindingBuilder.bind(ordersQueue())
        .to(ordersExchange())
        .with("order.created.*");
  }
}

@Service
public class OrderListener {

  @RabbitListener(queues = "orders")
  public void handle(Order order) {
    // process; throwing routes to DLX
  }
}
\`\`\`

**Big difference from Kafka:** RabbitMQ consumers receive messages with prefetch, not pulled in batches. Throughput per consumer is lower, but the framework keeps the queue draining naturally.

## Retry topics — the pattern for transient failures

For transient failures (downstream timeout, rate limit), you don't want to fail to DLT immediately. You want to retry with backoff.

Spring Kafka supports this with annotations:

\`\`\`java
@RetryableTopic(
  attempts = "4",
  backoff = @Backoff(delay = 1000, multiplier = 2.0),
  autoCreateTopics = "true",
  dltStrategy = DltStrategy.FAIL_ON_ERROR
)
@KafkaListener(topics = "orders")
public void process(OrderEvent event) {
  // throws → re-published to orders-retry-0 with 1s delay
  //         then orders-retry-1 with 2s delay
  //         then orders-retry-2 with 4s delay
  //         then orders-dlt
}
\`\`\`

This automatically creates topics \`orders-retry-0\`, \`orders-retry-1\`, etc. — each with its own consumer that just waits the configured delay before re-publishing. **No additional infrastructure**, just topic conventions.

## When to pick which

| Use case | Pick |
|----------|------|
| High throughput, log-shaped (event streaming, analytics) | Kafka |
| Classic work queue (background jobs, task distribution) | RabbitMQ |
| Complex routing (topic exchanges, header routing) | RabbitMQ |
| Replay / time-travel requirements | Kafka |
| Smaller scale, simpler ops | RabbitMQ |
| Need to fan out to many consumers | Kafka |

Default to **Kafka** for greenfield event-driven; **RabbitMQ** when you specifically need its routing or you're at small scale.

## A messaging interview question

\`\`\`java-quiz
level: tricky
q: A Spring Kafka consumer has @Transactional on the listener method, calling a DB write + a downstream HTTP API. Sometimes the DB shows the write but the HTTP call wasn't made. What's likely happening?
options: Network blip | Spring Kafka can't honor @Transactional on a listener | The DB transaction commits BEFORE the HTTP call if you've used some specific listener patterns; the HTTP call happens outside the transaction | The Kafka client retries are misconfigured
correct: 2
explain: This is a subtle but important pattern. @Transactional on a Kafka listener creates DB-only transactional behavior — Kafka commit and HTTP calls are NOT in that transaction. If the listener processes (DB write succeeds), the @Transactional commits the DB. Then the HTTP call happens AFTER the transaction. If THAT throws, the listener method throws — Spring re-delivers the message → another DB write → potential duplicate. The fix: (a) use idempotency keys so re-deliveries are safe; (b) use the OUTBOX PATTERN — write the event to a DB outbox in the SAME transaction, let a separate process publish to Kafka. The lesson: distributed-system "transactions" don't exist by magic; you have to design for at-least-once with idempotency.
\`\`\`

## What you can do now

- Set up production-safe Spring Kafka producers (acks=all, idempotence) and consumers (manual commit)
- Configure DLT routing and retry topics with backoff
- Use Spring AMQP for classic work-queue + topic-exchange patterns
- Pick Kafka vs RabbitMQ based on shape of work
- Recognize the @Transactional-listener pitfall

Next: **GraphQL and WebSockets in Spring** — real-time APIs done the Spring way.
`;

export const JA_L6 = `# GraphQL and WebSockets in Spring

Some APIs don't fit REST cleanly. **GraphQL** lets clients ask for exactly what they want. **WebSockets** push data to clients in real-time. Spring has first-class support for both — but the patterns matter as much as the code.

## Spring GraphQL — schema-first

Spring GraphQL (released 2022, replaced graphql-java-spring) is now the standard.

\`\`\`graphql
# schema.graphqls — placed in src/main/resources
type Query {
  product(id: ID!): Product
  products(category: String, limit: Int = 20): [Product]
}

type Product {
  id: ID!
  name: String!
  price: Float!
  reviews: [Review]
  similar: [Product]
}

type Review {
  rating: Int!
  text: String
  author: User
}
\`\`\`

Then the resolvers:

\`\`\`java
@Controller
public class ProductController {

  @QueryMapping
  public Product product(@Argument Long id) {
    return repo.findById(id).orElseThrow();
  }

  // Nested field resolver — called when client requests "reviews"
  @SchemaMapping(typeName = "Product", field = "reviews")
  public List<Review> reviews(Product product) {
    return reviewRepo.findByProductId(product.getId());
  }
}
\`\`\`

**Killer feature:** the client decides which fields to fetch. Mobile fetches only \`{ id, name, price }\`; web fetches more. **Same endpoint, no versioning gymnastics.**

## The N+1 problem in GraphQL

GraphQL's flexibility means it can trigger N+1 problems trivially. If a client asks for \`products(limit: 100) { reviews { rating } }\`, your resolver runs once for products (1 query), then once for each product's reviews (100 queries). **Disaster.**

The fix is **DataLoader**:

\`\`\`java
@Configuration
public class DataLoaderConfig {

  @Bean
  public BatchLoaderRegistry batchLoaderRegistry() {
    return new DefaultBatchLoaderRegistry();
  }

  @Bean
  public BatchLoader<Long, List<Review>> reviewsByProductLoader(ReviewRepo repo) {
    return ids -> Mono.fromCallable(() -> {
      Map<Long, List<Review>> grouped = repo.findByProductIdIn(ids)
          .stream().collect(groupingBy(Review::productId));
      return ids.stream().map(id -> grouped.getOrDefault(id, List.of())).toList();
    });
  }
}
\`\`\`

Now the GraphQL engine batches all \`reviews\` field requests into one query: \`findByProductIdIn(allIds)\`. 100 individual queries become 1.

**Without DataLoader, GraphQL at scale is a performance time bomb.** Every senior GraphQL implementer eventually learns this. Bake DataLoaders in from day one.

## Mutations

\`\`\`java
@MutationMapping
public Order placeOrder(@Argument @Valid OrderInput input, Authentication auth) {
  return orderService.create(input, auth.getName());
}
\`\`\`

Spring GraphQL integrates with Bean Validation (\`@Valid\` works), Spring Security (\`Authentication\` injection works), and \`@PreAuthorize\` (yes, on mutations).

## Subscriptions — GraphQL over WebSocket

\`\`\`graphql
type Subscription {
  orderStatusChanged(orderId: ID!): Order
}
\`\`\`

\`\`\`java
@SubscriptionMapping
public Flux<Order> orderStatusChanged(@Argument Long orderId) {
  return orderUpdates.stream()
      .filter(o -> o.getId().equals(orderId));
}
\`\`\`

Spring GraphQL handles the WebSocket protocol details. The client subscribes; your Flux pushes updates.

## WebSockets — the non-GraphQL path

For non-GraphQL real-time, Spring offers two layers:

### Plain WebSocket — low-level
\`\`\`java
@Configuration
@EnableWebSocket
public class WsConfig implements WebSocketConfigurer {
  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(new MyWsHandler(), "/ws/notifications");
  }
}
\`\`\`

You handle raw text/binary messages. Suited for custom protocols.

### STOMP — messaging protocol on top
\`\`\`java
@Configuration
@EnableWebSocketMessageBroker
public class StompConfig implements WebSocketMessageBrokerConfigurer {
  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic", "/queue");
    config.setApplicationDestinationPrefixes("/app");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws").withSockJS();
  }
}

@Controller
public class ChatController {
  @MessageMapping("/chat.send")
  @SendTo("/topic/messages")
  public Message send(Message msg) {
    return msg;
  }
}
\`\`\`

STOMP gives you pub/sub semantics (topics, queues) on top of WebSocket. **Most chat apps use STOMP** — much less code than raw WebSocket.

## Scaling WebSocket — the production reality

A WebSocket connection is **persistent and stateful**. 100K users = 100K open connections somewhere. Two scaling issues:

1. **Memory per connection**: ~few KB. 100K → 500MB+ per node.
2. **Pub/sub fanout**: when something needs to push to all users in topic X, you need to reach every node holding any of those connections.

The pattern: **a dedicated WebSocket fleet** + **Redis Pub/Sub** behind it.

\`\`\`
[REST services]──▶ publish to Redis Pub/Sub
                                 │
                                 ▼
[WS fleet node 1] ← subscribes ─┤
[WS fleet node 2] ← subscribes ─┤
[WS fleet node 3] ← subscribes ─┘
       │
       │ each node forwards to its connected users
       ▼
   [Browsers]
\`\`\`

Spring's STOMP supports an external broker (RabbitMQ, ActiveMQ): \`config.enableStompBrokerRelay(...)\`. Same idea — pub/sub fanout, but using STOMP-native infrastructure.

## A GraphQL trap

\`\`\`java-quiz
level: tricky
q: A GraphQL endpoint serves Product → reviews → author → friends → favoriteProducts. A malicious user submits a query nesting 20 levels deep. What happens?
options: GraphQL caps depth automatically | Your DB takes hundreds of queries; the request might never return | The query is rejected for being malformed | Spring rate-limits it
correct: 1
explain: GraphQL has no built-in depth limiting. A deeply nested query can blow up into exponential DB load (especially without DataLoader). Production GraphQL setups need: (a) query depth limit (e.g. max 7 levels via a plugin), (b) query complexity scoring (each field has a "cost"; reject queries exceeding budget), (c) persisted queries (only pre-approved query hashes accepted from clients). Without these, GraphQL is a foot-gun. The flexibility that makes GraphQL appealing IS the attack surface — you have to lock it down.
\`\`\`

## What you can do now

- Build a GraphQL API with Spring GraphQL — schema, query/mutation/subscription mappings
- Use DataLoader to defuse the N+1 trap (mandatory at any real scale)
- Pick STOMP over raw WebSocket for messaging-shaped real-time
- Scale WebSocket fleets with Redis Pub/Sub fanout
- Lock down GraphQL with depth/complexity limits + persisted queries

Next: **Native compilation** — GraalVM, Spring Native, AOT — getting Spring Boot to start in 50ms.
`;

export const JA_L7 = `# Native compilation — GraalVM, Spring Native, AOT

Spring Boot startup time is a long-standing meme: 5-30 seconds to boot a JVM app. **Native compilation** changes the game — your Boot app starts in **<100ms** and uses **a fraction of the memory**. This is the technology behind Spring's serverless / Lambda / edge-compute story.

## What GraalVM Native Image does

GraalVM is an alternative Java runtime. Its **native-image** tool performs ahead-of-time (AOT) compilation: it analyzes your entire codebase + dependencies, removes everything unreachable, and produces a single **native executable** — no JVM required.

\`\`\`
Spring Boot fat jar:  85 MB,  starts in 4-6s,  uses 350-500 MB RAM
GraalVM native image:  60 MB,  starts in 50ms, uses 80 MB RAM
\`\`\`

For long-running services on a beefy host, the JVM wins (JIT amortizes; peak throughput is higher). For:
- **Serverless** (Lambda, Cloud Run) — startup time is billable
- **Edge / IoT** — memory + binary size matter
- **CLIs and tools** — instant startup is non-negotiable
- **Scale-to-zero containers** — cold starts matter

...native wins.

## Spring Native (now Spring Boot AOT)

Spring Boot 3.0+ has first-class GraalVM support. Two flavors:

### JVM mode (default)
Normal Boot fat jar. Run with \`java -jar\`. Familiar.

### Native mode
\`\`\`bash
./mvnw -Pnative native:compile
./target/myapp        # Native binary, starts instantly
\`\`\`

Or build a native container image:
\`\`\`bash
./mvnw -Pnative spring-boot:build-image
docker run myapp:latest
\`\`\`

Spring Boot does **all the AOT processing automatically**: it analyzes reflection usage in Boot/Spring code, generates the GraalVM hints, packages everything. For a typical Boot app, **native works out of the box**.

## The constraints — what breaks

Native image makes a closed-world assumption. Things it can't handle at runtime:

| Pattern | Why it breaks | Workaround |
|---------|---------------|------------|
| Runtime reflection on classes not seen at build time | Native image stripped them | Register hints (\`@RegisterReflectionForBinding\`) |
| Dynamic class loading (\`Class.forName\` of a runtime string) | Class wasn't included | Avoid; or list classes via hints |
| Dynamic proxies (\`Proxy.newProxyInstance\`) | Interfaces need build-time registration | Same |
| \`MethodHandles\` against unknown methods | Same | Same |
| Resources loaded by name at runtime | Not packaged unless registered | List in hints |
| JNI calls | Need careful native-image config | Document & test |

Spring Boot AOT registers the hints for everything in the framework + most common libraries. Your **business code** is usually fine. Trouble spots: third-party libraries that use heavy reflection without GraalVM metadata.

## Writing hints when you must

\`\`\`java
@Configuration
@ImportRuntimeHints(MyRuntimeHints.class)
public class AppConfig {}

class MyRuntimeHints implements RuntimeHintsRegistrar {
  @Override
  public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
    hints.reflection()
        .registerType(MyJsonModel.class, MemberCategory.values());
    hints.resources()
        .registerPattern("config/*.yaml");
  }
}
\`\`\`

## CDS — the underrated middle ground

If native image's constraints scare you, **AppCDS (Class Data Sharing)** is the conservative win. Available in standard JVM, no GraalVM needed:

\`\`\`bash
# Generate the shared archive
java -XX:ArchiveClassesAtExit=app.jsa -jar app.jar

# Run with the archive
java -XX:SharedArchiveFile=app.jsa -jar app.jar
\`\`\`

Boot startup drops from 4s → 1.5s. Memory smaller. No code changes. **Worth doing on any JVM workload.**

Spring Boot 3.3+ supports it natively — \`./mvnw spring-boot:run\` can generate the CDS archive.

## Runtime cost of native

| Metric | JVM | Native |
|--------|-----|--------|
| **Startup** | 4-6s | 50ms |
| **Memory** | 350-500 MB | 80 MB |
| **Peak throughput** | 100% (baseline) | 70-90% (no JIT) |
| **Build time** | 20s | 3-5 minutes |
| **Binary size** | ~85 MB | ~60 MB |

The 70-90% throughput at runtime is the catch. JIT-compiled JVM code is often FASTER than native — Hotspot has 20+ years of optimization passes. **Native is slower per-request but faster to start.**

For sustained load with long-lived services: **JVM wins**. For elastic / serverless / cold-start-sensitive: **native wins**.

## A native interview question

\`\`\`java-quiz
level: tricky
q: A team converts their Spring Boot REST service to native image. Startup drops from 5s to 50ms. They roll it out to production. After a few days, p99 latency is up 30% and errors increase under load. What's likely happening?
options: GraalVM has bugs | The native image lacks JIT optimization — JIT-compiled code is faster than AOT for sustained workloads | Spring Native isn't production-ready | The Docker image is wrong
correct: 1
explain: Native is faster to start, slower per-request at peak load (no runtime profile-guided optimization). For a long-running service that processes thousands of requests/sec, the JIT eventually finds optimal compilations the AOT compiler couldn't. The right scenarios for native: serverless (where you pay for startup), scale-to-zero (cold starts), short-lived workloads (CLIs, batch jobs). For a long-running web service, the JVM is often the right call. Sometimes the answer is CDS (smaller startup win, full JIT benefit).
\`\`\`

## What you can do now

- Build a Boot app as a native image with \`./mvnw -Pnative native:compile\`
- Know which patterns break under native (reflection, dynamic loading)
- Write \`RuntimeHints\` for libraries that need them
- Use CDS as the conservative startup-win option on plain JVM
- Pick native vs JVM based on workload shape (cold-start sensitivity vs peak throughput)

Next: **JVM performance tuning** — GC algorithms, JIT, Java Flight Recorder, the tools you reach for when production gets slow.
`;

export const JA_L8 = `# JVM performance — GC, JIT, JFR

A production Spring app at high QPS lives or dies on JVM tuning. This lesson is the toolkit: which GC to pick, how JIT actually works, how to read a Java Flight Recorder profile, the flags that matter.

## The garbage collector landscape (2026)

| Collector | Pauses | Throughput | Best for |
|-----------|--------|------------|----------|
| **G1** (default) | 10-200ms | High | General purpose, 4-64 GB heaps |
| **ZGC** | <1ms | Very high | Low-latency services, huge heaps (TB) |
| **Shenandoah** | <10ms | High | Similar to ZGC; Red Hat's option |
| **Parallel** | Long (seconds) | Highest | Batch workloads where pauses don't matter |
| **Serial** | Long, single-threaded | Low | Tiny heaps (<100 MB), single-core machines |

**The 2026 default:** G1. **For low latency:** ZGC (production-ready since Java 15, generational since 21 — much improved).

## Picking GC: the decision tree

\`\`\`
Is p99 latency tightly constrained (<50ms)?
  YES → ZGC
  NO → Is heap > 32 GB?
    YES → ZGC (G1 starts to struggle at huge heaps)
    NO → G1
\`\`\`

To pick: \`-XX:+UseG1GC\`, \`-XX:+UseZGC\`. Boot 3.x picks G1 by default on most JDKs.

## The flags that actually matter

\`\`\`bash
java \
  -Xms2g -Xmx2g                            # heap (-Xms == -Xmx prevents resizing)
  -XX:+UseZGC                              # low-latency collector
  -XX:MaxGCPauseMillis=100                 # G1 only: target pause
  -XX:+HeapDumpOnOutOfMemoryError          # always
  -XX:HeapDumpPath=/var/log/heapdumps      # always
  -XX:+ExitOnOutOfMemoryError              # die fast on OOM
  -XX:NativeMemoryTracking=summary         # exposes via jcmd
  -XX:+FlightRecorder                      # JFR ready to attach
  -Xlog:gc*:file=/var/log/gc.log:tags,uptime,level
  -jar app.jar
\`\`\`

Set heap equal min/max so the JVM doesn't waste cycles resizing. Always heap-dump on OOM (you need it to debug). Set the GC log to file — you'll want it later.

## How JIT actually works

The JVM starts in **interpreted mode** — slow but instantaneous. As methods get called repeatedly, they cross thresholds:

- **C1 (Client compiler)** — fast compilation, good code. Kicks in around 1500 invocations.
- **C2 (Server compiler)** — slower compilation, great code. Kicks in around 10000.
- **Graal JIT** (replaces C2, optional) — written in Java, often produces better code, especially for modern patterns.

**Tiered compilation** runs both: code is interpreted → C1 → C2 (or Graal). After warmup, hot methods are fully optimized.

**Cold-start gotcha:** the first thousand requests are slow because JIT hasn't kicked in. This is why benchmarks need warmup; why Lambda functions feel slow on the first invocation (often combined with JVM init).

## Java Flight Recorder — the production profiler

JFR is built into the JDK. Negligible overhead (~1-2%). Always-on capable.

\`\`\`bash
# Start recording from outside
jcmd <pid> JFR.start name=production filename=record.jfr maxsize=200m maxage=1h

# Check status
jcmd <pid> JFR.check

# Dump current recording
jcmd <pid> JFR.dump name=production filename=record.jfr

# Stop
jcmd <pid> JFR.stop name=production
\`\`\`

Open \`record.jfr\` in **JDK Mission Control** (JMC). You get:
- CPU sampling by method
- Memory allocation by call site
- GC pauses + reasons
- Lock contention
- I/O latency
- Method timing

This is the **#1 tool to learn for serious JVM performance work.** A 5-minute JFR recording from production tells you exactly where time goes.

## A production performance pattern

The diagnostic order when "app is slow":

1. **JFR for 60 seconds** during peak load
2. In JMC, check the **CPU tab**: where's the JIT-compiled code spending time?
3. Check **GC tab**: are pauses elevated? Is allocation rate high?
4. Check **Threads tab**: any threads in BLOCKED state for long?
5. Check **Lock contention**: any heavily-contended monitors?

Most "the app is slow" mysteries get solved in 10 minutes with JFR + JMC.

## Memory leaks — the workflow

OOMs hit; you have heap dumps from \`-XX:+HeapDumpOnOutOfMemoryError\`.

\`\`\`bash
# Analyze with the standard tool
jhsdb hsdb --hprof=heapdump.hprof

# Better: Eclipse Memory Analyzer (MAT) — gives "leak suspect" reports
# Open the .hprof in MAT, click "Leak Suspects" → it tells you what's holding memory
\`\`\`

Common culprits:
- ThreadLocal not cleaned up in thread-pool environments
- Caches without size limit
- Listeners registered but never removed
- Static fields holding references

## NMT — Native Memory Tracking

When the JVM itself uses too much memory (not the heap), NMT tells you why:

\`\`\`bash
java -XX:NativeMemoryTracking=summary -jar app.jar

# Then from outside:
jcmd <pid> VM.native_memory summary
\`\`\`

Categories: Java Heap, Class metadata, Thread stacks, Code cache, GC structures, Compiler, Internal, Symbol. Surprises are common — class metadata in microservices with lots of generated classes, code cache in long-running apps, thread stacks if you have 5000 platform threads.

## A performance interview question

\`\`\`java-quiz
level: tricky
q: Your Spring Boot service runs fine for hours, then suddenly has high p99 latency for 30 seconds, then recovers. JFR shows the spikes coincide with "Long GC pauses." You've been on G1. What's the most likely cause and fix?
options: Memory leak — restart fixes it temporarily | The heap is too big, GC has to clean up too much | The heap might be undersized causing frequent GC pressure, or you have an allocation spike from a particular operation. Tune heap + switch to ZGC for the latency profile | JIT is recompiling
correct: 2
explain: Periodic latency spikes lasting tens of seconds, correlated with GC, are classic GC pressure. Two angles: (a) heap pressure (undersized heap → frequent collections; oversized heap → longer pauses when they happen). Profile allocation rate via JFR. (b) GC algorithm choice — G1 has occasional full GCs that pause 100-500ms+. For latency-critical services, ZGC's <1ms pauses solve this entirely. The right fix is BOTH: right-size the heap, and pick the GC that matches your latency requirements. Switching from G1 to ZGC is a single flag change and often the most impactful one-line perf improvement you'll make.
\`\`\`

## What you can do now

- Pick GC based on latency requirements (G1 default, ZGC for low latency)
- Set the right JVM flags from day one
- Read GC logs to know when collection becomes the bottleneck
- Profile production with JFR + JMC
- Diagnose memory leaks from heap dumps via MAT
- Use NMT to track non-heap memory usage

Next: **Project Loom advanced** — virtual threads in depth, structured concurrency, scoped values.
`;

export const JA_L9 = `# Project Loom advanced — virtual threads, structured concurrency, scoped values

Virtual threads (Java 21) are the biggest concurrency change in 20 years. The basics are simple — replace your thread pool with virtual threads and I/O-bound code scales effortlessly. The **advanced patterns** are where you separate seasoned engineers.

## Virtual thread internals — what's really happening

A virtual thread is:
- A regular \`Thread\` instance to your code (\`thread.getName()\`, \`Thread.currentThread()\`, etc. all work)
- Underneath: a continuation that the JVM can park and unpark
- Scheduled by a small pool of **carrier threads** (default: \`Runtime.availableProcessors()\` platform threads)

When a virtual thread does blocking I/O, the JVM intercepts the syscall, parks the continuation, and releases the carrier. When I/O completes, the JVM schedules the continuation onto any available carrier (possibly different from before).

\`\`\`
1000 virtual threads → 8 carrier threads (one per CPU core)

A virtual thread blocks on a DB call:
  → JVM parks the continuation (stack copied off the carrier)
  → Carrier picks up the next runnable virtual thread
  → When DB responds, the continuation is unparked, rescheduled
\`\`\`

This is why you can have **millions** of virtual threads where you'd have thousands of platform threads.

## The pinning trap — when virtual threads stop working

Virtual threads can't be moved off their carrier while inside a \`synchronized\` block. The carrier is "pinned" — until \`synchronized\` exits, the JVM can't unpark another virtual thread on that carrier.

If 10 virtual threads all enter \`synchronized\` and then do blocking I/O, you've effectively reduced your concurrency to your carrier-thread count.

\`\`\`java
// ❌ Pins
public synchronized String fetch(String url) {
  return httpClient.send(url, ...).body();   // blocks while pinned
}

// ✅ Use ReentrantLock instead
private final ReentrantLock lock = new ReentrantLock();
public String fetch(String url) {
  lock.lock();
  try {
    return httpClient.send(url, ...).body();   // can park; carrier released
  } finally {
    lock.unlock();
  }
}
\`\`\`

**Java 24+** removes most pinning cases (synchronized + Object.wait/notify no longer pin), but at the time of writing many JDKs are still on 21 LTS. Audit your code for synchronized blocks that contain I/O.

## ScopedValue — the ThreadLocal replacement

ThreadLocal has two problems for virtual threads:
1. **Memory** — millions of virtual threads × ThreadLocal values = blowup
2. **Leakage** — values inherited via \`InheritableThreadLocal\` cause subtle bugs

**ScopedValue** (preview in 21, stable in 24+) is bound for the duration of a structured operation, then automatically cleared.

\`\`\`java
private static final ScopedValue<User> CURRENT_USER = ScopedValue.newInstance();

public Response handle(Request req) {
  User user = authenticate(req);
  return ScopedValue.where(CURRENT_USER, user).call(() -> {
    return processRequest(req);    // anywhere in here can read CURRENT_USER.get()
  });
}

// In some deep utility:
public void log(String msg) {
  logger.info("user={} msg={}", CURRENT_USER.get(), msg);
}
\`\`\`

The binding is **immutable** within the scope. No accidental mutation. Auto-cleaned when the scope exits.

## Structured Concurrency — the killer pattern

The problem with raw \`CompletableFuture.allOf(...)\`: if one task errors, the others keep running. No cancellation, no cleanup.

**Structured Concurrency** (preview in 21, stable 24+) treats a group of concurrent tasks as one unit:

\`\`\`java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
  Subtask<User> userTask = scope.fork(() -> fetchUser(id));
  Subtask<List<Order>> ordersTask = scope.fork(() -> fetchOrders(id));
  Subtask<Account> accountTask = scope.fork(() -> fetchAccount(id));

  scope.join();              // wait for all (or first failure)
  scope.throwIfFailed();     // re-throws if any task failed

  return new Profile(
    userTask.get(),
    ordersTask.get(),
    accountTask.get()
  );
}
// When the scope exits (normally or by exception),
// ALL forked tasks are guaranteed to be complete or cancelled.
\`\`\`

Key properties:
- All children complete before the parent returns
- If one throws, the rest are **cancelled**
- No orphan tasks running in the background
- Stack traces include parent context (vs. random worker threads)

This is what asynchronous code SHOULD look like. **Far easier to reason about than CompletableFuture chains.**

## Picking a strategy

\`StructuredTaskScope\` has variants:

| Variant | Behavior |
|---------|----------|
| \`ShutdownOnFailure\` | First failure cancels siblings |
| \`ShutdownOnSuccess\` | First success cancels siblings (use for "race") |
| Custom \`StructuredTaskScope\` | Define your own join policy |

## Virtual threads + Spring Boot

\`\`\`yaml
spring:
  threads:
    virtual:
      enabled: true       # Boot 3.2+; uses virtual threads for Tomcat, @Async, ...
\`\`\`

That's it. Every Tomcat request handler runs on its own virtual thread. \`@Async\` methods spawn virtual threads. Scheduled tasks run on virtual threads. Your code stays exactly the same.

**Don't use** with reactive stack (WebFlux) — pick one model. Mixing is confusing and the throughput floor is similar.

## A subtle virtual-thread question

\`\`\`java-quiz
level: tricky
q: You launch 1,000,000 virtual threads, each one reads from a different REST API. Total elapsed time?
options: ~1 million × per-request latency = hours | Roughly the slowest single request | Depends on the API throttling | Compilation error
correct: 1
explain: The whole point of virtual threads for I/O: they don't consume a carrier while blocked. All 1M virtual threads can be "in flight" concurrently. Total time ≈ slowest individual request (assuming the APIs themselves can handle the parallel load). With platform threads you'd OOM trying to create 1M threads. With virtual threads it's no problem. Note: this is also why virtual threads can OVERWHELM downstream services — you now have effectively unbounded concurrency. Reach for a Semaphore or rate limiter if you need to throttle. The carrier limits you used to have implicitly are gone.
\`\`\`

## What you can do now

- Replace \`synchronized\` with \`ReentrantLock\` for any block containing I/O
- Use \`ScopedValue\` instead of \`ThreadLocal\` in virtual-thread-heavy code
- Group related concurrent work with \`StructuredTaskScope\`
- Enable virtual threads in Spring Boot with one config flag
- Recognize that virtual threads remove your implicit concurrency cap — add explicit rate limiting

Next: **Modern Java internals** — Foreign Function & Memory API, Vector API, sealed classes as protocols, pattern matching deep dive.
`;

export const JA_L10 = `# Modern Java internals — FFM, Vector API, sealed protocols

Java is evolving faster in the 2020s than it has at any point since 1.5. This lesson covers four under-appreciated modern features that change what's possible: **Foreign Function & Memory API** (replaces JNI), **Vector API** (SIMD), **sealed classes as protocols**, and the **deep pattern-matching switch**.

## Foreign Function & Memory API (FFM) — the JNI replacement

Calling C from Java used to require **JNI** — clunky, slow, error-prone, requires C glue code. **FFM** (stable in Java 22) lets you call native libraries directly from Java with zero boilerplate.

\`\`\`java
import java.lang.foreign.*;

void main() throws Throwable {
  // Look up the libc strlen function
  Linker linker = Linker.nativeLinker();
  SymbolLookup stdlib = linker.defaultLookup();

  MethodHandle strlen = linker.downcallHandle(
      stdlib.find("strlen").orElseThrow(),
      FunctionDescriptor.of(ValueLayout.JAVA_LONG, ValueLayout.ADDRESS)
  );

  try (Arena arena = Arena.ofConfined()) {
    MemorySegment hello = arena.allocateUtf8String("Hello, world!");
    long length = (long) strlen.invoke(hello);
    System.out.println("Length: " + length);   // 13
  }
}
\`\`\`

No C compile step. No platform-specific shared library you build. Direct call from Java to native function.

**Use cases:**
- Calling existing C libraries (image processing, ML inference, hardware access)
- Performance-critical inner loops where pure Java is too slow
- Operating system APIs not exposed by the JDK

The \`Arena\` API replaces the unsafe Java \`Cleaner\` pattern: explicit memory lifetime, freed when the arena closes.

## Vector API — SIMD for the masses

CPUs have had SIMD (Single Instruction, Multiple Data) instructions for decades — SSE, AVX-2, AVX-512. The JIT uses them automatically in some cases, but you couldn't TARGET them from Java code. The **Vector API** (incubator, stabilizing) lets you.

\`\`\`java
import jdk.incubator.vector.*;

static final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;

void dotProduct(float[] a, float[] b, float[] result) {
  int i = 0;
  int upperBound = SPECIES.loopBound(a.length);
  for (; i < upperBound; i += SPECIES.length()) {
    var va = FloatVector.fromArray(SPECIES, a, i);
    var vb = FloatVector.fromArray(SPECIES, b, i);
    va.mul(vb).intoArray(result, i);
  }
  // Tail: process the remaining elements
  for (; i < a.length; i++) {
    result[i] = a[i] * b[i];
  }
}
\`\`\`

On AVX-512 CPUs, \`SPECIES_PREFERRED\` is 16 floats per operation — 16× the work in roughly the same time. Critical for numerical computing, ML inference, image/audio processing in pure Java.

The Vector API is still in incubator (Java 22+) but is the **path to competitive numerics in Java** without dropping to C or relying on libraries like ND4J.

## Sealed classes as protocols — algebraic data types

We covered sealed classes in Java Complete. The advanced use is **modeling protocols**:

\`\`\`java
sealed interface ApiResult<T> permits Success, Error, Loading {}
record Success<T>(T value)        implements ApiResult<T> {}
record Error<T>(String message)   implements ApiResult<T> {}
record Loading<T>()               implements ApiResult<T> {}

// Pattern-matching switch handles every case exhaustively
String render(ApiResult<User> r) {
  return switch (r) {
    case Success<User>(User u)       -> "Welcome, " + u.name();
    case Error<User>(String msg)     -> "Error: " + msg;
    case Loading<User>()             -> "Loading…";
  };
}
\`\`\`

Add a new case to the sealed interface → every switch in your codebase fails to compile until you handle it. **Type-safe exhaustiveness across boundaries** — the discriminated union of TypeScript / Rust / Kotlin, in pure Java.

## Pattern matching for switch — the deep features

Java 21+ pattern-matching switch goes well beyond simple type matching:

\`\`\`java
String describe(Object obj) {
  return switch (obj) {
    case null                                  -> "nothing";
    case Integer i when i < 0                  -> "negative " + i;
    case Integer i                             -> "integer " + i;
    case String s when s.isEmpty()             -> "empty string";
    case String s                              -> "string of length " + s.length();
    case Point(int x, int y) when x == y       -> "diagonal at " + x;
    case Point(int x, int y)                   -> "point (" + x + ", " + y + ")";
    case int[] arr when arr.length > 0         -> "non-empty int[] of " + arr.length;
    case int[] arr                             -> "empty int[]";
    default                                    -> obj.getClass().getName();
  };
}
\`\`\`

Five features in this one switch:
- **Null patterns** — \`case null\` (no NPE)
- **Type patterns with binding** — \`case Integer i\` (no cast needed)
- **Guard clauses** — \`when\` after a pattern
- **Record patterns** — \`case Point(int x, int y)\` destructures
- **Array patterns** (proposed Java 24+) — \`case int[] arr\`

This is the **gateway to Rust-like exhaustive matching in Java**. It dramatically reduces visitor-pattern boilerplate.

## Stream Gatherers — Java 22+

Stream operations were a closed set (filter, map, reduce, collect). **Gatherers** let you write custom intermediate operations with state.

\`\`\`java
// Custom gatherer: keep only items > previous
import java.util.stream.*;

Stream.of(1, 3, 2, 4, 6, 5, 8)
    .gather(Gatherers.fold(
        () -> Integer.MIN_VALUE,
        (max, next) -> next > max ? next : max
    ))
    .toList();  // [1, 3, 4, 6, 8]
\`\`\`

Or use \`Gatherers.windowFixed(3)\` to chunk into windows of 3, \`Gatherers.scan(...)\` for running aggregates. Filling a long-standing gap in the Streams API.

## A modern-Java interview question

\`\`\`java-quiz
level: tricky
q: A team needs to call a high-performance C library for image processing from their Spring Boot service. In Java 22+, what's the recommended approach?
options: Write a JNI wrapper | Use FFM (Foreign Function & Memory API) to call the library directly from Java | Spawn a subprocess and pipe data | Use JNA (Java Native Access)
correct: 1
explain: FFM (stable in Java 22) is the modern replacement for JNI. No C glue code needed; call native functions directly from Java with type-safe descriptors. Arena-managed native memory replaces the error-prone unsafe Cleaner pattern. Better performance than JNA (no reflective overhead) and dramatically less ceremony than JNI. JNI is now legacy; new code should use FFM unless you need to support pre-Java-22 JDKs. This is one of the biggest "modernization" wins available — entire classes of "we wrote a separate native service for this" can collapse back into the main app.
\`\`\`

## You've finished Java Advanced

Across ten lessons: Spring Security, reactive Java, Spring Cloud, caching, messaging, GraphQL + WebSockets, native compilation, JVM performance tuning, Project Loom advanced, and modern Java internals.

This is the **complete senior Java toolkit** as of 2026. Combined with Java Complete + Frameworks, you have the working knowledge to:
- Architect Spring-based systems from a fresh repo to production
- Diagnose performance issues with the right tools (JFR, MAT, NMT)
- Pick between sync / reactive / virtual threads correctly per use case
- Use modern Java features (records, sealed, pattern matching, FFM) idiomatically
- Reason about distributed system patterns (saga, outbox, circuit breakers) in code

What's left when you want more depth:
- **Project Leyden** (~2026/27) — even further AOT specialization for JVM apps
- **Project Babylon** — programmable Java code reflection for ML/GPU compilation
- **Domain-specific** — fintech (auditing, ledgers), gaming (low-GC, zero-allocation patterns), HFT (off-heap, kernel bypass)

But what you have now is more than enough to be the senior Java engineer in any room.
`;
