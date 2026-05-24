/* eslint-disable no-irregular-whitespace */
/**
 * Java Frameworks — 6 lessons covering Spring, Spring Boot, JPA, and Hibernate.
 * Designed as a sequel to Java Complete: assumes you know the language, focuses
 * on the frameworks that 95% of production Java jobs use.
 */

export const JF_L1 = `# Spring Core — DI, IoC, and the bean container

Open any Java job posting in 2026 and you'll see "Spring" listed. Not because Spring is fashionable — because **Spring runs more enterprise Java than every other framework combined**. Banks, e-commerce, healthcare, government — chances are the system at your next interview is built on Spring.

This lesson covers the **one idea** that makes Spring Spring: **Inversion of Control**.

## The problem Spring solves

Before Spring, instantiating an object that depended on other objects was your problem:

\`\`\`java
public class OrderService {
  private final PaymentGateway gateway = new StripeGateway();
  private final InventoryClient inventory = new InventoryClient(
      new HttpClient(),
      new Config("inventory.url=...")
  );
  private final NotificationService notifier = new EmailService(
      new SmtpClient(...)
  );
  // ...
}
\`\`\`

Look what happened:
- \`OrderService\` knows it uses **Stripe** specifically. Switching to PayPal means rewriting code.
- It has to know how to construct **everything its dependencies need**, recursively.
- It's untestable — you can't pass a mock \`PaymentGateway\` because the field is \`final\` and constructed inline.

## Inversion of Control — the fix

The fix is dead simple: **stop creating your dependencies. Receive them instead.**

\`\`\`java
@Service
public class OrderService {
  private final PaymentGateway gateway;
  private final InventoryClient inventory;
  private final NotificationService notifier;

  public OrderService(PaymentGateway gateway, InventoryClient inventory, NotificationService notifier) {
    this.gateway = gateway;
    this.inventory = inventory;
    this.notifier = notifier;
  }
}
\`\`\`

Now \`OrderService\` declares: *"I need a PaymentGateway, an InventoryClient, and a NotificationService — give them to me."* It doesn't care which implementation. Tests pass mocks. Production passes real ones. **That's IoC.**

The "container" — Spring's \`ApplicationContext\` — is the thing that creates the wiring. You tell it what objects exist and what they need; Spring assembles the graph.

## Three ways to declare a bean

| | How | When to use |
|---|-----|-------------|
| \`@Component\` (+ \`@Service\`, \`@Repository\`, \`@Controller\`) | Annotate the class, Spring discovers it | 95% of cases — your own classes |
| \`@Bean\` in a \`@Configuration\` class | Method returns the bean | Third-party classes you can't annotate |
| Programmatic registration | \`context.registerBean(...)\` | Conditional / dynamic wiring |

**Rule of thumb**: prefer constructor injection (above), use \`@Component\` / \`@Service\` / \`@Repository\` on your own classes, use \`@Bean\` for things like \`RestTemplate\`, \`ObjectMapper\`, or third-party clients.

## The bean lifecycle

When Spring boots, every singleton bean goes through:

\`\`\`
1. Instantiate (call the constructor — DI happens here)
2. Properties set (@Value, @Autowired field/setter — discouraged but still works)
3. Aware callbacks (BeanNameAware, ApplicationContextAware — rare)
4. BeanPostProcessor.postProcessBeforeInitialization
5. @PostConstruct method runs
6. InitializingBean.afterPropertiesSet
7. Custom init-method
8. BeanPostProcessor.postProcessAfterInitialization  ← AOP proxies wrapped here
9. READY to use
... time passes ...
10. @PreDestroy on shutdown
11. DisposableBean.destroy
12. Custom destroy-method
\`\`\`

Steps 4 and 8 are where Spring **wraps your bean in a proxy** for AOP — @Transactional, @Cacheable, @Async all work this way. That's why these annotations don't work on self-invocations (\`this.someAnnotatedMethod()\` bypasses the proxy).

## Constructor vs field vs setter injection — the interview question

\`\`\`java-quiz
level: tricky
q: Which injection style does the Spring team officially recommend, and why?
options: Field injection (@Autowired on field) — most concise | Setter injection — most flexible | Constructor injection — explicit, testable, supports final fields | Method injection — most powerful
correct: 2
explain: Constructor injection has won. It (1) makes dependencies explicit in the signature — easy to spot when a class has too many; (2) supports final fields, which makes the object truly immutable; (3) makes the class trivially testable in plain Java (no Spring needed for unit tests); (4) fails fast at startup if a required dependency is missing. Field injection is concise but hides dependencies and prevents final. Setter is for optional deps only. Since Spring 4.3, single-constructor classes don't even need @Autowired — Spring figures it out.
\`\`\`

## Bean scope — singleton vs prototype vs request

\`\`\`java
@Component                              // default — one instance per container
@Component @Scope("prototype")          // new instance every time you ask
@Component @Scope("request")            // one per HTTP request (web apps only)
@Component @Scope("session")            // one per HTTP session
\`\`\`

99% of beans are singletons. Use prototype only when each user genuinely needs their own state instance. **Mixing scopes is dangerous** — a singleton holding a prototype reference keeps the same prototype forever (it was injected once). Spring has a \`@Lookup\` workaround but you usually just shouldn't.

## Profiles — environment-specific wiring

\`\`\`java
@Service
@Profile("prod")
public class StripePaymentGateway implements PaymentGateway { ... }

@Service
@Profile("test")
public class FakePaymentGateway implements PaymentGateway { ... }
\`\`\`

Run with \`-Dspring.profiles.active=prod\` and the prod bean wins. Profile is the cleanest way to swap implementations between dev / test / staging / prod.

## What you can do now

- Explain Inversion of Control in one sentence (and why your dependencies should be received, not created)
- Pick constructor injection by default
- Know the bean lifecycle well enough to debug @PostConstruct / @PreDestroy timing
- Use \`@Profile\` for environment-specific implementations
- Understand why self-invocation breaks @Transactional/@Cacheable (proxy bypass)

Next: **Spring Boot** — the layer that turns "Spring" from "configuration nightmare" into "java -jar and go."
`;

export const JF_L2 = `# Spring Boot — autoconfiguration and starters

Pre-2014 Spring was infamous: you'd spend two days wiring an XML config just to print "hello world." **Spring Boot is what fixed that.** It's the same Spring underneath — same beans, same DI — but with a layer of conventions that gets you to a running server in 5 lines.

## What Spring Boot actually does

Three big things:

1. **Starters** — curated dependency bundles. Add \`spring-boot-starter-web\` to your build and you get Spring MVC, Jackson, Tomcat, validation, logging — versions pre-matched.
2. **Auto-configuration** — when Spring Boot sees Tomcat on the classpath, it auto-configures a web server. Sees Hibernate? Configures a JPA EntityManager. Sees Kafka? Sets up KafkaTemplate. **Conventions > configuration.**
3. **Production-ready features** — Actuator (health/metrics endpoints), profile-driven config, externalized configuration, embedded server (no WAR deployment).

## A minimal Spring Boot app

\`\`\`java
@SpringBootApplication
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}

@RestController
class HelloController {
  @GetMapping("/hello")
  public String hello() { return "Hello, world"; }
}
\`\`\`

That's the full app. \`@SpringBootApplication\` is shorthand for three annotations:
- \`@Configuration\` — this class declares beans
- \`@EnableAutoConfiguration\` — turn on the autoconfig magic
- \`@ComponentScan\` — scan this package and subpackages for @Component, @Service, etc.

## How auto-configuration actually works

Look at \`spring-boot-autoconfigure-*.jar\` — it contains dozens of \`*AutoConfiguration\` classes, each annotated with \`@Conditional\`:

\`\`\`java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)          // only if a DB driver is on classpath
@ConditionalOnMissingBean(DataSource.class)    // unless user defined their own
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
  @Bean
  public DataSource dataSource(DataSourceProperties props) {
    return DataSourceBuilder.create()
        .url(props.getUrl())
        .username(props.getUsername())
        .password(props.getPassword())
        .build();
  }
}
\`\`\`

The \`@ConditionalOn*\` annotations are the magic. Spring Boot effectively says *"if you have a DB driver, and you haven't defined your own DataSource bean, here's one configured from your application.properties."*

This is why **Spring Boot feels like magic**: it's actually 100+ defensive @Conditional configurations running at startup, each filling in defaults if you didn't override.

## application.properties / application.yml

The single config file:

\`\`\`yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/myapp
    username: \${DB_USER}        # env var substitution
    password: \${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate         # never 'update' in prod!
server:
  port: 8080
logging:
  level:
    com.myapp: DEBUG
\`\`\`

**Precedence** (most to least important):
1. Command-line args: \`--server.port=9000\`
2. \`SPRING_APPLICATION_JSON\` env var
3. Environment variables: \`SERVER_PORT=9000\`
4. \`application-{profile}.yml\` (e.g. \`application-prod.yml\`)
5. \`application.yml\`
6. \`@PropertySource\` files
7. Default values

## Profile-specific configs

\`\`\`
application.yml             # always loaded
application-dev.yml         # loaded when --spring.profiles.active=dev
application-prod.yml        # loaded when SPRING_PROFILES_ACTIVE=prod
\`\`\`

Profile-specific overrides win. Common pattern: \`application.yml\` has sensible defaults + dev settings, \`application-prod.yml\` overrides the prod-specific stuff (DB pool size, log level, etc.).

## @ConfigurationProperties — type-safe config

Instead of scattering \`@Value("\${myapp.api.timeout}")\` everywhere:

\`\`\`java
@ConfigurationProperties(prefix = "myapp.api")
public record ApiConfig(String url, Duration timeout, int retries) {}

// In application.yml
myapp:
  api:
    url: https://api.example.com
    timeout: 5s
    retries: 3
\`\`\`

Spring auto-binds your config into the record. **Validates at startup**. Use this pattern for any non-trivial config group.

## Actuator — production-grade endpoints for free

Add \`spring-boot-starter-actuator\` and you get HTTP endpoints out of the box:

| Endpoint | What |
|----------|------|
| \`/actuator/health\` | Health status (UP / DOWN / OUT_OF_SERVICE) |
| \`/actuator/info\` | App version, git commit, etc. |
| \`/actuator/metrics\` | Live metrics (JVM, HTTP, DB pool) |
| \`/actuator/prometheus\` | Metrics in Prometheus format (scrape this) |
| \`/actuator/env\` | Effective configuration |
| \`/actuator/loggers\` | View + change log levels at runtime |
| \`/actuator/threaddump\` | JVM thread dump |
| \`/actuator/heapdump\` | JVM heap dump |

**Secure your Actuator endpoints in prod.** \`/health\` is fine to expose, but \`/env\` leaks secrets. Use \`management.endpoints.web.exposure.include=health,prometheus\` to whitelist.

## A tricky Spring Boot interview question

\`\`\`java-quiz
level: tricky
q: Your Spring Boot app starts up successfully but a @Bean method you defined isn't being called. The bean is missing. What's the MOST likely cause?
options: The bean method isn't annotated with @Autowired | The @Configuration class is outside the package scanned by @SpringBootApplication | Spring Boot disabled it via auto-configuration | The bean method returns null
correct: 1
explain: @ComponentScan (part of @SpringBootApplication) only scans the package of the main app class and its sub-packages. A @Configuration class in a sibling package (or above) won't be discovered. Solutions: move the config under the main package, add @ComponentScan with extra basePackages, or use @Import explicitly. This is THE most common "but it worked locally" bug.
\`\`\`

## What you can do now

- Add a starter and get a working subsystem (web, DB, Kafka) in one dependency
- Understand auto-configuration is just @Conditional magic, not actual magic
- Externalize config with application.yml + @ConfigurationProperties
- Use profiles for environment-specific overrides
- Expose Actuator endpoints for health/metrics/observability
- Diagnose "bean not found" by checking package layout

Next: **Spring MVC + REST** — building HTTP APIs, validation, error handling, the patterns that ship.
`;

export const JF_L3 = `# Spring MVC and REST APIs

Spring MVC is the layer that turns HTTP requests into method calls on your beans. **99% of new Spring code uses it as a REST API layer.** This lesson covers writing solid REST endpoints, validating input, handling errors well, and the patterns that ship.

## The basic controller

\`\`\`java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService service;

  public OrderController(OrderService service) {
    this.service = service;
  }

  @GetMapping("/{id}")
  public OrderDto getOne(@PathVariable Long id) {
    return service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderDto create(@RequestBody @Valid CreateOrderRequest req) {
    return service.create(req);
  }

  @GetMapping
  public Page<OrderDto> list(
      @RequestParam(required = false) String status,
      @PageableDefault(size = 20) Pageable pageable) {
    return service.search(status, pageable);
  }
}
\`\`\`

What's happening:
- \`@RestController\` = \`@Controller\` + \`@ResponseBody\` on every method (returns are auto-serialized to JSON)
- \`@RequestMapping\` at class level — path prefix
- \`@PathVariable\`, \`@RequestParam\`, \`@RequestBody\` — bind URL/query/body to method args
- \`Pageable\` — Spring Data auto-binds \`?page=0&size=20&sort=createdAt,desc\` for you
- \`@Valid\` triggers bean validation on the body

## DTOs, never entities

The #1 mistake junior devs make: returning JPA entities directly from controllers.

\`\`\`java
// ❌ DON'T
@GetMapping("/{id}")
public Order getOne(@PathVariable Long id) {
  return orderRepository.findById(id).orElseThrow();
}
\`\`\`

Why this is bad:
1. **Lazy loading explodes** — serializer touches a relationship, triggers a query, mid-response
2. **Couples your API to your DB schema** — rename a column → API breaks
3. **Leaks internal fields** — \`password_hash\`, \`internal_notes\` all serialize
4. **Sensitive to N+1** — relationships fetch one-by-one as JSON serializes

**Always use DTOs.** Modern style: records.

\`\`\`java
public record OrderDto(Long id, String status, BigDecimal total, Instant createdAt) {
  public static OrderDto from(Order o) {
    return new OrderDto(o.getId(), o.getStatus(), o.getTotal(), o.getCreatedAt());
  }
}
\`\`\`

## Validation with @Valid

Spring Boot includes Jakarta Bean Validation. Annotate the DTO:

\`\`\`java
public record CreateOrderRequest(
    @NotBlank @Size(max = 100) String customerName,
    @NotNull @PositiveOrZero BigDecimal total,
    @Email String contactEmail,
    @NotEmpty List<@Valid OrderItemDto> items
) {}
\`\`\`

When \`@Valid\` is on the controller param, Spring runs validation before your method body. Failed validation throws \`MethodArgumentNotValidException\`. Catch it with @ExceptionHandler (next section) and return 400 with field-level errors.

## Global error handling — @RestControllerAdvice

Sprinkling try/catch in controllers is gross. Centralize with a global handler:

\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
    ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
    pd.setTitle("Validation failed");
    pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
        .map(e -> Map.of("field", e.getField(), "message", e.getDefaultMessage()))
        .toList());
    return pd;
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ProblemDetail handleNotFound(EntityNotFoundException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
  }
}
\`\`\`

\`ProblemDetail\` (Spring 6+ / Boot 3+) is the standard RFC 7807 error response format. Use it.

## The HTTP method/status discipline

| Action | Verb | Success status | Notes |
|--------|------|----------------|-------|
| Get a single thing | GET /orders/123 | 200 | 404 if not found |
| List things | GET /orders | 200 | Paginate, don't dump |
| Create | POST /orders | 201 + Location header | Returns the new resource |
| Update (full) | PUT /orders/123 | 200 or 204 | Idempotent — same body = same result |
| Update (partial) | PATCH /orders/123 | 200 or 204 | JSON Patch or JSON Merge Patch |
| Delete | DELETE /orders/123 | 204 | Idempotent — deleting twice = same 204 |

Most teams skip PUT/PATCH for non-trivial updates and use specific action endpoints: \`POST /orders/123/cancel\`. Both are valid.

## Bean validation gotchas

\`\`\`java-quiz
level: tricky
q: What's wrong with this controller method?
code:
  @PostMapping
  public Order create(@RequestBody @Valid CreateOrderRequest req) {
    if (req.items().isEmpty()) {
      throw new IllegalArgumentException("Items can't be empty");
    }
    return service.create(req);
  }
options: Nothing wrong — looks correct | Should return ResponseEntity for status control | The empty-items check duplicates what @NotEmpty on items would do; this should be in validation | @Valid should be @Validated
correct: 2
explain: The runtime check belongs in the DTO as @NotEmpty on the items field. Bean validation runs BEFORE your method body, returns a clean 400 with field details, and is centralized — meaning every caller of CreateOrderRequest gets the same validation. Hand-rolled checks in controllers scatter rules and bypass the @RestControllerAdvice formatting. Push as much validation as possible into the DTO annotations.
\`\`\`

## A few more must-knows

**CORS:** Use \`@CrossOrigin\` for quick demos, but production needs a \`CorsConfigurationSource\` bean. Spring Security has built-in support.

**Content negotiation:** By default, Spring serializes responses as JSON (Jackson). Add the right starter for XML, Protobuf, etc.

**Async controllers:** Return \`CompletableFuture<X>\` or \`Mono<X>\` (WebFlux). For Boot 3.2+ on Java 21+, controllers automatically run on **virtual threads** when configured (\`spring.threads.virtual.enabled=true\`) — your synchronous code gets non-blocking I/O for free.

**OpenAPI:** Add \`springdoc-openapi-starter-webmvc-ui\` and you get a Swagger UI at \`/swagger-ui.html\` auto-generated from your controllers. Don't hand-write OpenAPI specs.

## What you can do now

- Build a clean REST controller with proper HTTP verbs and status codes
- Use DTOs / records instead of returning JPA entities directly
- Validate input declaratively with Bean Validation annotations
- Centralize error handling with @RestControllerAdvice + ProblemDetail
- Enable virtual threads in Boot 3.2+ for cheap I/O concurrency
- Auto-generate API docs with springdoc-openapi

Next: **Spring Data JPA** — the layer that gives you repositories with zero boilerplate, plus the N+1 trap that lurks underneath.
`;

export const JF_L4 = `# Spring Data JPA — repositories and the N+1 trap

Spring Data JPA is the most loved + most-foot-gunned part of the Spring ecosystem. You get repositories with **zero code** — but careless use leads to the classic N+1 bug that tanks production performance. This lesson covers both halves.

## Entities — the basics

\`\`\`java
@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String status;

  @Column(precision = 19, scale = 2)
  private BigDecimal total;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  // getters, setters, equals/hashCode based on business key NOT id
}
\`\`\`

A few must-know rules:

1. **No-arg constructor required** — JPA spec, Hibernate needs to instantiate via reflection.
2. **\`equals\` and \`hashCode\` should NOT use \`id\`** — it's null before persist, then non-null after. If you put it in a Set before save, you can't find it after. Use a business key (email, slug, etc.) or use the inherited Object equality.
3. **Default fetch type for ToOne is EAGER, for ToMany is LAZY**. Always override @ManyToOne to LAZY explicitly — eager loading is the #1 performance killer.

## Repositories — zero-boilerplate CRUD

\`\`\`java
public interface OrderRepository extends JpaRepository<Order, Long> {

  // Spring derives the query from the method name:
  List<Order> findByStatus(String status);

  // Multiple criteria
  List<Order> findByStatusAndCustomerId(String status, Long customerId);

  // Or write your own JPQL
  @Query("SELECT o FROM Order o WHERE o.total > :min ORDER BY o.createdAt DESC")
  List<Order> findBigOrders(@Param("min") BigDecimal min, Pageable pageable);

  // Native SQL when JPQL isn't enough
  @Query(value = "SELECT * FROM orders WHERE created_at > now() - interval '7 days'",
         nativeQuery = true)
  List<Order> findRecentOrdersNative();
}
\`\`\`

\`JpaRepository<Order, Long>\` gives you save, findById, findAll, deleteById, count, exists, paginated/sorted variants — all for free. Just declare the interface.

**Derived query names** follow a strict DSL: \`findBy<Field>And<Field>OrderBy<Field>Desc\`. Spring parses it at startup and writes the JPQL. Keep names short — if it's getting unwieldy, switch to \`@Query\`.

## The N+1 problem — the bug that destroys production

You write this:

\`\`\`java
List<Order> orders = orderRepository.findAll();
for (Order o : orders) {
  System.out.println(o.getCustomer().getName());  // touches lazy relationship
}
\`\`\`

Looks innocent. Hibernate executes:
- **1 query** to load all 1000 orders
- **+ 1000 queries** to load each order's customer one at a time
- = **1001 queries**

Your endpoint just generated 1001 round-trips to the database. Latency goes from 50ms → 30 seconds.

**This is the N+1 problem.** Every senior backend interview asks about it. Three ways to fix it:

### Fix 1: JOIN FETCH

\`\`\`java
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();
\`\`\`

Hibernate generates one query with a JOIN. Fetches everything in one round-trip.

### Fix 2: @EntityGraph

\`\`\`java
@EntityGraph(attributePaths = {"customer", "items"})
List<Order> findAll();
\`\`\`

Same effect but declarative. Use when you can't / don't want to write the JPQL.

### Fix 3: Batch size hint

\`\`\`java
@BatchSize(size = 50)
@OneToMany(...)
private List<OrderItem> items;
\`\`\`

Now if you touch \`items\` on 100 orders, Hibernate batches them into 2 queries instead of 100. Less ideal than fetch joining but useful for "I sometimes need this relation."

## DTO projections — even better

Returning entities is sloppy. Returning DTOs IS the right answer:

\`\`\`java
public interface OrderRepository extends JpaRepository<Order, Long> {

  @Query("""
    SELECT new com.example.OrderSummaryDto(o.id, o.status, o.total, c.name)
    FROM Order o JOIN o.customer c
    WHERE o.status = :status
  """)
  List<OrderSummaryDto> findSummariesByStatus(String status);
}
\`\`\`

Hibernate writes the optimal SQL — only selects the columns you need, no entity hydration, no proxy creation. Fastest possible read path.

## Transactions — @Transactional

\`\`\`java
@Service
public class OrderService {

  private final OrderRepository orderRepo;
  private final InventoryClient inventory;

  @Transactional
  public Order create(CreateOrderRequest req) {
    inventory.reserve(req.items());                  // remote call
    Order order = orderRepo.save(new Order(...));    // INSERT
    eventPublisher.publish(new OrderCreated(...));   // event
    return order;
  }
}
\`\`\`

\`@Transactional\` wraps the method in a DB transaction. If it throws an unchecked exception, the transaction rolls back. **Watch out:**
- Checked exceptions DON'T trigger rollback by default. Use \`@Transactional(rollbackFor = Exception.class)\`.
- Self-invocation doesn't work — calling \`this.transactionalMethod()\` from inside the same class bypasses the proxy. Move the @Transactional method to another bean.
- Don't do network I/O (HTTP calls, queue publishes) inside a transaction. You're holding a DB connection open for the network latency.

## The most asked JPA interview question

\`\`\`java-quiz
level: tricky
q: A query method returns List<Order>. You iterate the list and call order.getItems() on each (a @OneToMany). What happens?
code:
  List<Order> orders = orderRepo.findAll();
  for (Order o : orders) {
    int count = o.getItems().size();
  }
options: One query — items are loaded with orders | One query for orders, one for ALL items combined | One query for orders, N queries for each order's items | Throws LazyInitializationException
correct: 2
explain: This is the N+1 problem. @OneToMany defaults to LAZY, so the initial findAll loads orders only. Each o.getItems() call triggers a SEPARATE query for that order's items. With 100 orders you get 101 queries. Fixes: JOIN FETCH in the query, @EntityGraph, or @BatchSize. Note: if the entity manager is closed before the loop runs, you'd get LazyInitializationException instead — that's the OTHER big JPA gotcha.
\`\`\`

## Database migrations — Flyway / Liquibase

Don't use \`spring.jpa.hibernate.ddl-auto=update\` in production. It silently makes schema changes you didn't review. **Use Flyway.**

\`\`\`
src/main/resources/db/migration/
  V1__create_orders.sql
  V2__add_status_index.sql
  V3__add_customer_email.sql
\`\`\`

Spring Boot autodetects Flyway, runs migrations at startup, tracks state in \`flyway_schema_history\`. Every prod schema change goes through a migration script that's reviewed in PR. Set \`spring.jpa.hibernate.ddl-auto=validate\` — Hibernate verifies the live schema matches your entities and refuses to start otherwise.

## What you can do now

- Map entities with proper @Column, @ManyToOne (always LAZY), @OneToMany (with mappedBy + cascade)
- Use \`equals\`/\`hashCode\` correctly (not based on auto-generated id)
- Get repositories for free by extending JpaRepository
- Diagnose and fix the N+1 problem with JOIN FETCH / @EntityGraph / @BatchSize
- Return DTO projections for read paths
- Use @Transactional correctly (rollback rules, self-invocation, no I/O in transactions)
- Use Flyway for production schema migrations

Next: **Hibernate deep-dive** — what JPA hides, the session/cache architecture, and the optimization knobs you'll reach for.
`;

export const JF_L5 = `# Hibernate — what JPA hides

Spring Data JPA gives you the API. **Hibernate is what runs underneath** on 95% of Spring projects. Understanding Hibernate's internals is what separates senior Java engineers from people who copy-paste from Stack Overflow. This lesson covers the Session, the caches, lazy loading internals, and the tuning knobs.

## JPA vs Hibernate — clear this up first

| | What it is |
|---|------------|
| **JPA** (Jakarta Persistence) | The specification — interfaces like \`EntityManager\`, \`@Entity\`, \`@Query\` |
| **Hibernate** | The dominant implementation. Adds extra features (e.g. native APIs, more dialects, second-level cache) |
| **EclipseLink** | Alternative JPA impl (used in some app servers) |

When you use \`@Entity\` and \`EntityManager\`, you're using **JPA APIs** — but Hibernate is doing the work. You can drop down to Hibernate-specific APIs (\`Session\`, \`Criteria\`) when JPA isn't enough.

## The Session and the Persistence Context

The **Session** (Hibernate's name) / **EntityManager** (JPA's name) is the unit of work. It holds the **persistence context** — a map of \`(EntityClass, id) → managed entity instance\`.

Entities can be in one of four states:

\`\`\`
        ┌─────────┐  persist()   ┌────────────┐
        │ Transient│ ───────────▶│  Managed   │
        └─────────┘              └────────────┘
              ▲                        │  ▲
              │ new Entity()           │  │
              │                        ▼  │ merge()
              │                  ┌────────────┐
              └──────────────────│  Detached  │
                                 └────────────┘
                                       │
                                       │ remove()
                                       ▼
                                 ┌────────────┐
                                 │  Removed   │
                                 └────────────┘
\`\`\`

| State | Has ID? | In persistence context? | Synced to DB? |
|-------|---------|------------------------|---------------|
| **Transient** | No | No | No (never persisted) |
| **Managed** | Yes | Yes | Auto-flushed at transaction end |
| **Detached** | Yes | No (context closed or evicted) | Not synced — changes are silent |
| **Removed** | Yes (still) | Yes (until flush) | DELETE pending |

The **#1 source of bugs**: modifying a detached entity expecting changes to save. Hibernate doesn't know about it.

## Dirty checking — the automatic UPDATE

You don't call \`update()\` in Hibernate (well, you can but you shouldn't). Hibernate tracks every managed entity's state from when it was loaded and **detects changes automatically** at flush time:

\`\`\`java
@Transactional
public void renameOrder(Long id, String newStatus) {
  Order o = orderRepo.findById(id).orElseThrow();
  o.setStatus(newStatus);
  // No save() call needed! Hibernate auto-flushes at transaction commit.
}
\`\`\`

When the transaction commits, Hibernate compares the entity's current field values to what was loaded, generates an UPDATE for only the changed columns, and runs it. That's why \`save()\` on a managed entity is a no-op — it just returns the same instance.

## Lazy loading internals

When you fetch an entity with a LAZY relationship, Hibernate **doesn't load the related data**. Instead, it stores a **proxy** (a generated subclass) in that field:

\`\`\`java
@Entity
class Order {
  @ManyToOne(fetch = LAZY)
  Customer customer;  // ← actually a Customer$HibernateProxy at runtime
}
\`\`\`

When you call \`order.getCustomer().getName()\`, the proxy intercepts the method, fires a SELECT for that customer, then forwards the call. **This is the source of every "but it worked in dev!" bug** — touching a lazy relation outside an active session throws \`LazyInitializationException\`.

Modern Spring + Boot has an "open session in view" filter that keeps the session alive for the entire request. Convenient — and dangerous, because it hides N+1 problems. **Disable it in production** (\`spring.jpa.open-in-view=false\`) and you'll surface every accidental lazy load as an immediate error. Then you can fix them properly.

## First-level vs second-level cache

### First-level (always on)
The persistence context itself is a cache. Within one transaction, loading the same entity twice returns the same instance:

\`\`\`java
Order a = orderRepo.findById(1L).get();
Order b = orderRepo.findById(1L).get();
a == b;  // true — same instance from the session cache
\`\`\`

This is automatic and bounded by transaction lifetime.

### Second-level (opt-in)
A cache **shared across sessions and transactions**. You enable it with:

\`\`\`
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
\`\`\`

\`\`\`java
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Country {
  ...
}
\`\`\`

Good for **rarely-changing reference data** (countries, product categories, config). Bad for write-heavy entities — cache invalidation adds overhead and complexity.

## Cascade types — the dangerous foot-gun

\`\`\`java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
List<OrderItem> items;
\`\`\`

| Cascade | Meaning |
|---------|---------|
| \`PERSIST\` | save parent → save children |
| \`MERGE\` | merge parent → merge children |
| \`REMOVE\` | delete parent → delete children |
| \`REFRESH\` | refresh parent → refresh children |
| \`DETACH\` | detach parent → detach children |
| \`ALL\` | all of the above |

**\`orphanRemoval = true\`** is separate: when you remove a child from the collection, it gets deleted.

\`\`\`java
order.getItems().remove(0);  // with orphanRemoval, deletes that item from DB
\`\`\`

Use cascades thoughtfully. \`CascadeType.ALL\` on a wrong relationship can wipe out half your DB on a \`delete()\`.

## Flush modes and explicit flush()

By default Hibernate flushes:
1. Before any query (so the query sees the latest state)
2. At transaction commit

You almost never need to call \`flush()\` explicitly. The two cases where you do:
- Forcing the DB to assign an auto-generated ID before the transaction commits (so you can use the ID in subsequent code)
- Releasing a row lock acquired by an INSERT for a long-running transaction

## A tricky Hibernate interview question

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  @Entity
  class User {
    @Id @GeneratedValue Long id;
    String name;
    // equals/hashCode based on id (not business key)
  }

  // In a single transaction:
  Set<User> users = new HashSet<>();
  User u = new User();
  u.setName("Alice");
  users.add(u);          // u.id is null at this point
  userRepo.save(u);      // u.id is now 42
  System.out.println(users.contains(u));
options: true | false | NullPointerException | throws ConcurrentModificationException
correct: 1
explain: This is the equals/hashCode-on-id trap. You added u to a HashSet when its id was null. HashSet computed its hashCode and placed it in some bucket. After save(), the id is now 42 and the hashCode changes. contains() computes the NEW hashCode and looks in the wrong bucket — finds nothing — returns false. This is why entities should NOT base equals/hashCode on auto-generated id. Use a business key (email, slug) or use Object identity.
\`\`\`

## What you can do now

- Distinguish JPA (spec) from Hibernate (impl)
- Explain entity states (Transient / Managed / Detached / Removed) and the bugs each causes
- Trust dirty checking — modify managed entities and they auto-save
- Diagnose LazyInitializationException (session closed before lazy load)
- Use the first-level cache implicitly, second-level cache for static reference data
- Apply cascades carefully — never CascadeType.ALL by reflex
- Avoid the equals/hashCode-on-id trap (use business keys or default identity)

Next: **Production patterns** — testing, profiles, observability, the things that get a Spring app reliably shipped.
`;

export const JF_L6 = `# Shipping Spring Boot — testing, observability, production patterns

The first five lessons cover Spring itself. This one covers **what separates a working app from a production-grade one**: testing strategies, profile-driven configuration, secrets handling, observability, and the deployment patterns the industry has converged on.

## The Spring testing pyramid

| Layer | Annotation | What it loads | When to use |
|-------|-----------|---------------|-------------|
| **Unit** | None (plain JUnit + Mockito) | Just your class + mocked deps | 80% of tests |
| **@DataJpaTest** | \`@DataJpaTest\` | JPA + an in-memory DB | Test repositories |
| **@WebMvcTest** | \`@WebMvcTest(OrderController.class)\` | One controller + Spring MVC, mocked services | Test request/response cycle |
| **@SpringBootTest** | \`@SpringBootTest\` | Full app context | Integration / smoke tests |

**Default to plain unit tests.** They're fast (no Spring container), explicit, and easy to debug. Reach for the slice tests (\`@DataJpaTest\`, \`@WebMvcTest\`) when you need that specific layer. Reserve \`@SpringBootTest\` for true end-to-end tests that touch multiple layers — they're slow (3-10s of context loading).

## Testcontainers — the killer test pattern

Pre-Testcontainers: tests used H2 in-memory DB. Bug: H2 ≠ Postgres. Tests passed; production failed.

\`\`\`java
@SpringBootTest
@Testcontainers
class OrderServiceIT {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("test")
      .withUsername("test")
      .withPassword("test");

  @DynamicPropertySource
  static void registerProps(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", postgres::getJdbcUrl);
    r.add("spring.datasource.username", postgres::getUsername);
    r.add("spring.datasource.password", postgres::getPassword);
  }

  @Test
  void createsOrder() {
    // Runs against a REAL Postgres, in a Docker container, spun up for the test
  }
}
\`\`\`

Same pattern for Kafka, Redis, MongoDB, S3 (LocalStack), etc. **You test against the same software you run in production.** Worth the ~2s startup cost.

## MockMvc vs @WebMvcTest

\`\`\`java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired MockMvc mockMvc;
  @MockBean OrderService service;   // mocked

  @Test
  void getReturnsJson() throws Exception {
    when(service.findById(1L)).thenReturn(new OrderDto(1L, "PAID", ...));

    mockMvc.perform(get("/api/orders/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("PAID"));
  }
}
\`\`\`

\`@WebMvcTest\` loads only Spring MVC + your controller — fast, focused. Pair with \`@MockBean\` to mock service-layer dependencies.

## Profiles — environment-driven config

\`\`\`
application.yml             # shared defaults
application-dev.yml         # local dev overrides
application-prod.yml        # production overrides
application-test.yml        # auto-active during tests
\`\`\`

Activate with \`SPRING_PROFILES_ACTIVE=prod\`. Tests can use \`@ActiveProfiles("test")\`.

\`\`\`java
@Service
@Profile("!test")  // active in any profile except test
public class RealStripeClient implements StripeClient { ... }

@Service
@Profile("test")
public class FakeStripeClient implements StripeClient { ... }
\`\`\`

## Secrets — NEVER in application.yml

Don't commit DB passwords or API keys. Three options, best to worst:

1. **External secret manager** — AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager. Spring Cloud has integrations.
2. **Environment variables** — \`spring.datasource.password=\${DB_PASSWORD}\`. Injected by your deployment system (k8s Secret, Docker env, systemd EnvironmentFile).
3. **Kubernetes ConfigMaps + Secrets** — same idea, mounted as files or env vars.

Never check secrets into git. Even private repos leak.

## Actuator + Prometheus + Grafana = free observability

\`\`\`yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  metrics:
    tags:
      application: \${spring.application.name}
\`\`\`

Now \`/actuator/prometheus\` exposes hundreds of metrics:
- JVM heap, GC, threads
- HTTP request latency / count / errors (by URI)
- DB connection pool stats
- Custom timers + counters you register

Point Prometheus at it. Build dashboards in Grafana. Done — production-grade observability with no custom code.

For **distributed tracing**, add \`spring-boot-starter-actuator\` + \`micrometer-tracing-bridge-otel\` + \`opentelemetry-exporter-otlp\`. Traces flow to Jaeger / Tempo / Honeycomb. We cover this in the Microservices course.

## Health checks done right

\`\`\`java
@Component
public class OrderProcessingHealthIndicator implements HealthIndicator {

  @Override
  public Health health() {
    long pendingJobs = jobQueue.countPending();
    if (pendingJobs > 10_000) {
      return Health.down()
          .withDetail("pendingJobs", pendingJobs)
          .withDetail("threshold", 10_000)
          .build();
    }
    return Health.up().withDetail("pendingJobs", pendingJobs).build();
  }
}
\`\`\`

Spring Boot auto-aggregates all \`HealthIndicator\` beans into \`/actuator/health\`. Configure liveness vs readiness probes:

\`\`\`yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState, db, redis
\`\`\`

Then point k8s at \`/actuator/health/liveness\` and \`/actuator/health/readiness\`.

## Caching with @Cacheable

\`\`\`java
@Service
public class CountryService {

  @Cacheable("countries")
  public Country findByCode(String code) {
    return countryRepo.findByCode(code).orElseThrow();
  }

  @CacheEvict(value = "countries", key = "#country.code")
  public void update(Country country) {
    countryRepo.save(country);
  }
}
\`\`\`

Backend is pluggable: \`spring-boot-starter-cache\` + a starter for the impl (Caffeine, Redis, Hazelcast). Same code, swap the backend via config.

## Graceful shutdown

Spring Boot 2.3+ supports graceful shutdown — finish in-flight requests before terminating:

\`\`\`yaml
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
\`\`\`

Combined with k8s preStop hooks and proper \`SIGTERM\` handling, your rolling deploys don't drop user requests. **Always enable this.**

## A tricky observability question

\`\`\`java-quiz
level: medium
q: Your Spring Boot app's /actuator/health returns 200 OK, but customers report 500 errors from a critical endpoint. The Kubernetes liveness probe is happily passing. What's most likely the problem?
options: The pod is healthy; the issue is downstream | The liveness probe should include all subsystems, not just the JVM | The customers are wrong | You need a separate readiness probe — liveness only checks the app is "alive enough not to restart"
correct: 3
explain: Liveness and readiness mean different things. LIVENESS = "is this pod broken in an unrecoverable way, restart it?" Should be a minimal "the JVM is alive" check — if it includes the DB, a DB blip restarts your whole fleet. READINESS = "is this pod ready to receive traffic?" Should include downstream dependencies (DB, Redis, etc.). When readiness fails, k8s temporarily removes the pod from the LB; when liveness fails, it kills the pod. Conflating them is a common ops mistake — split them up and your customer's broken endpoint causes the right behavior (LB drops the pod, no restart loop).
\`\`\`

## Production deploy checklist

Before shipping a Spring Boot app to prod, walk this:

- [ ] \`spring.jpa.hibernate.ddl-auto=validate\` (Flyway for migrations)
- [ ] \`spring.jpa.open-in-view=false\` (forces you to fix N+1 properly)
- [ ] \`server.shutdown=graceful\`
- [ ] Liveness and readiness probes split, pointed at the right paths
- [ ] Connection pool sized appropriately (HikariCP default 10 — usually too low for serious apps)
- [ ] Actuator endpoints whitelisted, secured behind internal network
- [ ] \`/actuator/prometheus\` scraped by your metrics system
- [ ] No secrets in application.yml — all via env or secret manager
- [ ] Structured logging (logback JSON layout)
- [ ] Tracing wired up if you have more than one service
- [ ] Build is reproducible (Maven/Gradle lockfile pinned)

## What you can do now

- Pick the right test layer for each scenario (unit / slice / integration)
- Use Testcontainers to test against real Postgres / Redis / Kafka
- Externalize all environment-specific config via profiles + env vars
- Expose Prometheus metrics with one starter dependency
- Split liveness and readiness probes correctly
- Cache with \`@Cacheable\` + swap backends without code change
- Ship with graceful shutdown enabled

## You've finished Java Frameworks

Six lessons in: you understand IoC, can build Boot apps with autoconfiguration, write REST APIs with validation and error handling, use Spring Data JPA without N+1 surprises, debug Hibernate's session and cache, and ship apps with proper testing + observability.

This is roughly the working senior Java engineer's framework toolkit. The remaining frontier is the *production ecosystem* — Kubernetes, CI/CD, service meshes, secrets management — but the framework code you'd write is the framework code you can write now.

Want to keep going? The natural next course is **Kafka** (event-driven Java often pairs with Spring) or **Microservices** (where Spring Boot really shines).
`;
