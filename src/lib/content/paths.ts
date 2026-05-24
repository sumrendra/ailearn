/**
 * Path metadata + lesson rows.
 * Lesson bodies are imported from the per-course content files.
 */
import type { LearningPath } from "./types";
import {
  LLM_L1_CONTENT, LLM_L2_CONTENT, LLM_L3_CONTENT,
  LLM_L4_CONTENT, LLM_L5_CONTENT, LLM_L6_CONTENT,
  RAG_L1_CONTENT, RAG_L2_CONTENT, RAG_L3_CONTENT,
  RAG_L4_CONTENT, RAG_L5_CONTENT, RAG_L6_CONTENT,
  AGT_L1_CONTENT, AGT_L2_CONTENT, AGT_L3_CONTENT,
  AGT_L4_CONTENT, AGT_L5_CONTENT, AGT_L6_CONTENT,
} from "./ai-content";
import { SQL_L1, SQL_L2, SQL_L3, SQL_L4, SQL_L5, SQL_L6 } from "./sql-content";
import { FR_L1, FR_L2, FR_L3, FR_L4, FR_L5, FR_L6 } from "./french-content";
import { XL_L1, XL_L2, XL_L3, XL_L4, XL_L5, XL_L6 } from "./excel-content";
import { JV_L1, JV_L2, JV_L3, JV_L4, JV_L5, JV_L6, JV_L7, JV_L8 } from "./java-content";
import { JF_L1, JF_L2, JF_L3, JF_L4, JF_L5, JF_L6 } from "./java-frameworks-content";
import { KF_L1, KF_L2, KF_L3, KF_L4, KF_L5, KF_L6 } from "./kafka-content";
import { MS_L1, MS_L2, MS_L3, MS_L4, MS_L5, MS_L6 } from "./microservices-content";
import { SD_L1, SD_L2, SD_L3, SD_L4, SD_L5, SD_L6 } from "./system-design-content";

export const PATHS: LearningPath[] = [
  // ── LLM Foundations ───────────────────────────────────────────────────────
  {
    slug: "llm-foundations",
    title: "LLM Foundations",
    description: "Master transformers, attention, tokenization, sampling, and the core engineering concepts behind every large language model.",
    icon: "brain",
    color: "#6c47ff",
    difficulty: "BEGINNER",
    estimatedHours: 8,
    tags: ["Transformers", "Tokenization", "Attention", "Sampling", "LLMs"],
    order: 1,
    lessons: [
      { slug: "what-is-an-llm",                       title: "What is a Large Language Model?", description: "Understand what LLMs are, how they're trained, why they hallucinate, and how to think about them as an engineer — not a researcher.", content: LLM_L1_CONTENT, order: 1, estimatedMins: 20, xpReward: 60, tags: ["LLM Fundamentals", "Training", "RLHF"] },
      { slug: "transformer-architecture",             title: "The Transformer Architecture: Attention Explained", description: "How transformers work under the hood — attention as a soft HashMap, multi-head attention, positional encoding, and why context windows are quadratically expensive.", content: LLM_L2_CONTENT, order: 2, estimatedMins: 30, xpReward: 80, tags: ["Transformers", "Attention", "Architecture"] },
      { slug: "tokenization-sampling-temperature",    title: "Tokenization, Temperature & Sampling", description: "What LLMs actually see, how BPE tokenization works, and the full sampling toolkit: temperature, top-p, top-k, frequency penalties — and when to use each.", content: LLM_L3_CONTENT, order: 3, estimatedMins: 25, xpReward: 70, tags: ["Tokenization", "Sampling", "Temperature", "BPE"] },
      { slug: "attention-mechanism",                  title: "The Attention Mechanism: How Transformers Focus", description: "Q, K, V vectors as a soft database, the softmax bottleneck, multi-head intuition, and why attention is the breakthrough that made modern AI possible.", content: LLM_L4_CONTENT, order: 4, estimatedMins: 28, xpReward: 80, tags: ["Attention", "Transformers", "Self-Attention"] },
      { slug: "context-windows",                      title: "Context Windows, KV-Cache & Long Documents", description: "Why context costs grow quadratically, what the KV-cache is, RoPE positional encoding, and the engineering tricks (flash-attention, sliding window) that push limits up.", content: LLM_L5_CONTENT, order: 5, estimatedMins: 22, xpReward: 70, tags: ["Context Window", "KV-Cache", "Scaling"] },
      { slug: "prompt-engineering",                   title: "Prompt Engineering: From Zero-Shot to Chain-of-Thought", description: "Zero-shot, few-shot, chain-of-thought, ReAct, self-consistency — the prompting techniques that move accuracy 20+% on hard tasks. Practical patterns for production prompts.", content: LLM_L6_CONTENT, order: 6, estimatedMins: 25, xpReward: 75, tags: ["Prompting", "Chain-of-Thought", "Few-shot"] },
    ],
  },
  // ── RAG & Vector DBs ──────────────────────────────────────────────────────
  {
    slug: "rag-vector-dbs",
    title: "RAG & Vector Databases",
    description: "Build production-grade retrieval-augmented generation pipelines: embeddings, vector search, chunking strategies, reranking, and evaluation.",
    icon: "database",
    color: "#0f766e",
    difficulty: "INTERMEDIATE",
    estimatedHours: 10,
    tags: ["RAG", "pgvector", "Embeddings", "Chunking", "Reranking"],
    order: 2,
    lessons: [
      { slug: "why-rag",                  title: "Why RAG? Solving LLM Knowledge Gaps", description: "Understand the core RAG architecture, when to choose RAG over fine-tuning, and how retrieval-augmented generation solves the LLM knowledge-cutoff problem.", content: RAG_L1_CONTENT, order: 1, estimatedMins: 20, xpReward: 70, tags: ["RAG", "Architecture", "Fine-tuning"] },
      { slug: "embeddings-vector-search", title: "Embeddings & Vector Search: How Semantic Search Works", description: "The math and engineering behind embeddings — cosine similarity, HNSW indexing, dimension tradeoffs, and how to choose and benchmark an embedding model.", content: RAG_L2_CONTENT, order: 2, estimatedMins: 25, xpReward: 80, tags: ["Embeddings", "Vector Search", "HNSW", "Similarity"] },
      { slug: "production-rag-pipeline",  title: "Building a Production RAG Pipeline", description: "From prototype to production: chunking strategies, hybrid search, cross-encoder reranking, metadata filtering, observability, and RAGAS evaluation.", content: RAG_L3_CONTENT, order: 3, estimatedMins: 30, xpReward: 90, tags: ["RAG", "Chunking", "Reranking", "Production", "RAGAS"] },
      { slug: "chunking-strategies",      title: "Chunking Strategies That Actually Work", description: "The decisions that quietly tank or save your RAG. Fixed-size, semantic, hierarchical, late chunking — when each wins and how to test it on your own data.", content: RAG_L4_CONTENT, order: 4, estimatedMins: 25, xpReward: 80, tags: ["Chunking", "RAG", "Document Processing"] },
      { slug: "vector-database-choices",  title: "Vector DB Showdown: pgvector, Pinecone & Weaviate", description: "Honest comparison of the top vector databases — pgvector, Pinecone, Weaviate, Qdrant, Chroma. How to pick based on scale, cost, ops budget, and existing stack.", content: RAG_L5_CONTENT, order: 5, estimatedMins: 28, xpReward: 85, tags: ["Vector Databases", "pgvector", "Pinecone"] },
      { slug: "rag-evaluation",           title: "Evaluating & Debugging RAG Pipelines", description: "How to actually measure if your RAG is any good — RAGAS metrics, golden datasets, faithfulness vs. answer relevance, and how to diagnose retrieval-vs-generation failures.", content: RAG_L6_CONTENT, order: 6, estimatedMins: 25, xpReward: 80, tags: ["RAG", "Evaluation", "RAGAS", "Debugging"] },
    ],
  },
  // ── AI Agents ─────────────────────────────────────────────────────────────
  {
    slug: "ai-agents",
    title: "AI Agents & Tool Use",
    description: "Build autonomous agents that observe, reason, and act. Tool calling, the ReAct framework, memory, multi-agent systems, and reliability patterns.",
    icon: "cpu",
    color: "#b45309",
    difficulty: "ADVANCED",
    estimatedHours: 12,
    tags: ["Agents", "Tool calling", "ReAct", "LangChain", "LangChain4j"],
    order: 3,
    lessons: [
      { slug: "what-are-agents",          title: "What Are AI Agents?", description: "Define agents properly — autonomous LLMs that observe, reason, and act through tools. The Anthropic spectrum: chains → workflows → autonomous agents.", content: AGT_L1_CONTENT, order: 1, estimatedMins: 22, xpReward: 75, tags: ["Agents", "Architecture", "Autonomy"] },
      { slug: "tool-use-function-calling",title: "Tool Use & Function Calling: Giving LLMs Hands", description: "How modern LLMs call functions — schema definitions, parallel tool calls, error handling, when to use tools vs RAG. Concrete examples in Python and Java.", content: AGT_L2_CONTENT, order: 2, estimatedMins: 25, xpReward: 80, tags: ["Tool Calling", "Function Calling", "Agents"] },
      { slug: "react-framework",          title: "The ReAct Framework: Reasoning + Acting", description: "The pattern that made agents work: Thought → Action → Observation loops. When ReAct beats one-shot, common failure modes, modern alternatives (Reflexion, plan-and-execute).", content: AGT_L3_CONTENT, order: 3, estimatedMins: 25, xpReward: 80, tags: ["ReAct", "Reasoning", "Agents"] },
      { slug: "agent-memory",             title: "Agent Memory: In-Context, External & Vector Memory", description: "Four kinds of agent memory and when to use each — working memory, key-value, semantic vector, summary. How to build agents that remember across sessions.", content: AGT_L4_CONTENT, order: 4, estimatedMins: 24, xpReward: 80, tags: ["Agent Memory", "Persistence", "Vector Memory"] },
      { slug: "multi-agent-systems",      title: "Multi-Agent Systems: Supervisor & Parallel Patterns", description: "Supervisor, parallel fan-out, and pipeline patterns for orchestrating multiple LLM agents. Communication, aggregation strategies, when multi-agent beats single-agent.", content: AGT_L5_CONTENT, order: 5, estimatedMins: 26, xpReward: 85, tags: ["Multi-agent", "Orchestration", "Supervisor"] },
      { slug: "agent-reliability",        title: "Building Reliable Agents: Guardrails & Error Handling", description: "The four guardrail categories, circuit breakers, human-in-the-loop, observability — turning fragile demos into production-grade agent systems.", content: AGT_L6_CONTENT, order: 6, estimatedMins: 28, xpReward: 90, tags: ["Reliability", "Guardrails", "Error Handling", "Production"] },
    ],
  },
  // ── SQL Mastery ───────────────────────────────────────────────────────────
  {
    slug: "sql-mastery",
    title: "SQL Mastery",
    description: "Think in sets, master joins and windows, read query plans, and build AI-ready storage with JSON and pgvector. SQL for senior engineers who already know Java and Kafka.",
    icon: "table",
    color: "#1d4ed8",
    difficulty: "INTERMEDIATE",
    estimatedHours: 10,
    tags: ["SQL", "Postgres", "Indexes", "Transactions", "pgvector"],
    order: 4,
    lessons: [
      { slug: "sql-relational-model-fundamentals", title: "Your first SQL query — how databases think", description: "Stop thinking in loops, start thinking in sets. Three-valued logic, why SELECT * is a smell, and your first real query against a live Postgres database in the browser.", content: SQL_L1, order: 1, estimatedMins: 20, xpReward: 60, tags: ["SQL", "SELECT", "Relational Model"] },
      { slug: "sql-joins-deep-dive",               title: "Joins — combining two tables", description: "Stitch tables together with INNER and LEFT joins. Spot the classic WHERE-clause trap that silently breaks outer joins.", content: SQL_L2, order: 2, estimatedMins: 22, xpReward: 70, tags: ["SQL", "JOIN", "LEFT JOIN"] },
      { slug: "sql-aggregation-window-functions",  title: "Counting, summing, grouping — the 'how many' questions", description: "COUNT, SUM, AVG, GROUP BY, HAVING — how to summarize data and answer 'how many of X per Y' in one query.", content: SQL_L3, order: 3, estimatedMins: 20, xpReward: 70, tags: ["SQL", "GROUP BY", "Aggregation"] },
      { slug: "sql-indexes-query-performance",     title: "Performance — why your query is slow", description: "Read EXPLAIN. Add the right indexes. Recognize the patterns that silently defeat them.", content: SQL_L4, order: 4, estimatedMins: 25, xpReward: 80, tags: ["SQL", "Indexes", "EXPLAIN"] },
      { slug: "sql-transactions-isolation-locking", title: "Transactions — when two things happen at once", description: "The lost-update bug, three ways to fix it, SELECT FOR UPDATE, and SKIP LOCKED for building a job queue in pure Postgres.", content: SQL_L5, order: 5, estimatedMins: 24, xpReward: 80, tags: ["SQL", "Transactions", "Concurrency"] },
      { slug: "sql-advanced-cte-json-pgvector",    title: "Postgres beyond the basics — CTEs, JSON, and AI", description: "Recursive CTEs, JSONB for flexible columns, UPSERT, and pgvector — turn Postgres into your one-stop AI data platform.", content: SQL_L6, order: 6, estimatedMins: 25, xpReward: 85, tags: ["SQL", "CTE", "JSONB", "pgvector"] },
    ],
  },
  // ── French Fundamentals ───────────────────────────────────────────────────
  {
    slug: "french-fundamentals",
    title: "French Fundamentals",
    description: "Go from zero to ordering coffee in Paris. Interactive vocabulary, real dialogues, and click-to-hear pronunciation — no audio files, all in your browser.",
    icon: "languages",
    color: "#be185d",
    difficulty: "BEGINNER",
    estimatedHours: 6,
    tags: ["French", "Languages", "A1", "Beginner", "Conversation"],
    order: 5,
    lessons: [
      { slug: "french-bonjour-first-words",  title: "Bonjour! Your first words in French", description: "Say hello, introduce yourself, and politely say goodbye. The first conversation you'll ever have in French.", content: FR_L1, order: 1, estimatedMins: 15, xpReward: 50, tags: ["French", "Greetings", "Introductions"] },
      { slug: "french-numbers",              title: "Numbers — count like a Parisian", description: "Count 0–69, give your phone number, share your age, and order two coffees.", content: FR_L2, order: 2, estimatedMins: 18, xpReward: 60, tags: ["French", "Numbers", "Counting"] },
      { slug: "french-questions-greetings",  title: "Asking questions like a local", description: "How are you? Where are you from? The three question words that unlock most of daily French.", content: FR_L3, order: 3, estimatedMins: 20, xpReward: 70, tags: ["French", "Questions", "tu vs vous"] },
      { slug: "french-restaurant",           title: "At the restaurant — order anything", description: "Read a menu, order a starter and main, ask for wine, get the bill — politely and confidently.", content: FR_L4, order: 4, estimatedMins: 22, xpReward: 75, tags: ["French", "Restaurant", "Articles", "Le/La"] },
      { slug: "french-directions",           title: "Getting around — directions and transport", description: "Find the metro, ask where the bathroom is, understand the directions a stranger gives you.", content: FR_L5, order: 5, estimatedMins: 18, xpReward: 70, tags: ["French", "Directions", "Transport"] },
      { slug: "french-time-plans",           title: "Time, days, and making plans", description: "Tell time, name the days, talk about today/tomorrow, and arrange to meet a friend.", content: FR_L6, order: 6, estimatedMins: 18, xpReward: 75, tags: ["French", "Time", "Days", "Plans"] },
    ],
  },
  // ── Excel Mastery ─────────────────────────────────────────────────────────
  {
    slug: "excel-mastery",
    title: "Excel Mastery",
    description: "From cells to dashboards — the working Excel toolkit for Business Analysts, QA engineers, and Customer Success Managers. Live formula playgrounds run real Excel formulas in your browser.",
    icon: "file-spreadsheet",
    color: "#047857",
    difficulty: "BEGINNER",
    estimatedHours: 7,
    tags: ["Excel", "Business Analyst", "Pivot Tables", "VLOOKUP", "Formulas"],
    order: 6,
    lessons: [
      { slug: "excel-cells-formulas-references", title: "How Excel actually works — cells, formulas, references", description: "The foundation: cell addresses, the formula bar, and the $ trick that fixes 90% of broken spreadsheets.", content: XL_L1, order: 1, estimatedMins: 18, xpReward: 50, tags: ["Excel", "Foundations", "References"] },
      { slug: "excel-conditional-logic",         title: "Conditional logic — IF, COUNTIF, SUMIFS", description: "Count and sum things that match a condition. The workhorse formulas every BA / QA / CSM lives in.", content: XL_L2, order: 2, estimatedMins: 20, xpReward: 65, tags: ["Excel", "IF", "COUNTIF", "SUMIFS"] },
      { slug: "excel-lookups-vlookup-xlookup",   title: "Joining data — VLOOKUP, XLOOKUP, INDEX/MATCH", description: "The most-asked Excel job-interview question. Lookups that don't break, and when to use which.", content: XL_L3, order: 3, estimatedMins: 25, xpReward: 80, tags: ["Excel", "VLOOKUP", "XLOOKUP", "INDEX MATCH"] },
      { slug: "excel-cleaning-text-functions",   title: "Cleaning messy data — text functions", description: "TRIM, SUBSTITUTE, splitting names, extracting domains. The work that fills 60% of an analyst's day.", content: XL_L4, order: 4, estimatedMins: 20, xpReward: 65, tags: ["Excel", "Text Functions", "Data Cleaning"] },
      { slug: "excel-pivot-tables",              title: "Pivot tables — the analyst's superpower", description: "Drag, drop, get answer. The single most important Excel skill for any BA — and the most-tested in interviews.", content: XL_L5, order: 5, estimatedMins: 24, xpReward: 85, tags: ["Excel", "Pivot Tables", "Aggregation"] },
      { slug: "excel-dashboards-formatting",     title: "Visualizing — conditional formatting, charts, dashboards", description: "Picking the right chart, building a one-page dashboard, and knowing when to leave Excel.", content: XL_L6, order: 6, estimatedMins: 22, xpReward: 75, tags: ["Excel", "Charts", "Dashboards", "Conditional Formatting"] },
    ],
  },
  // ── Java Complete ─────────────────────────────────────────────────────────
  {
    slug: "java-complete",
    title: "Java Complete",
    description: "From the JVM to virtual threads — the complete Java toolkit for senior engineers and interview prep. Interactive HashMap visualizer, clickable class hierarchy, and tricky 'what does this print?' quizzes throughout.",
    icon: "coffee",
    color: "#ea580c",
    difficulty: "INTERMEDIATE",
    estimatedHours: 12,
    tags: ["Java", "JVM", "Collections", "Concurrency", "Streams", "Interview"],
    order: 7,
    lessons: [
      { slug: "java-jvm-fundamentals",     title: "How Java actually runs — JVM, JRE, JDK", description: "Bytecode, the heap/stack/method-area memory model, garbage collection, and the pass-by-value question every interview asks.", content: JV_L1, order: 1, estimatedMins: 22, xpReward: 70, tags: ["Java", "JVM", "Memory Model", "Fundamentals"] },
      { slug: "java-oop-solid",            title: "OOP done right — classes, interfaces, SOLID", description: "When to use class vs interface vs abstract class, SOLID principles (especially Liskov), composition over inheritance, and the final/finally/finalize classic.", content: JV_L2, order: 2, estimatedMins: 25, xpReward: 75, tags: ["Java", "OOP", "SOLID", "Design"] },
      { slug: "java-collections-framework", title: "The Collections Framework", description: "Interactive class hierarchy. ArrayList vs LinkedList vs ArrayDeque, the equals/hashCode contract, Comparable vs Comparator, fail-fast vs fail-safe iterators.", content: JV_L3, order: 3, estimatedMins: 25, xpReward: 80, tags: ["Java", "Collections", "ArrayList", "HashMap"] },
      { slug: "java-hashmap-internals",    title: "HashMap — the deep dive every interview asks about", description: "Live visualization of HashMap internals: hash spreading, bucket chains, treeification at 8 entries, resize at 75% load, the null/mutable-key gotchas.", content: JV_L4, order: 4, estimatedMins: 28, xpReward: 95, tags: ["Java", "HashMap", "Internals", "Interview"] },
      { slug: "java-concurrency-basics",   title: "Concurrency — threads, synchronization, the Memory Model", description: "Runnable vs Callable, volatile vs synchronized, the lost-update problem, ReentrantLock, BlockingQueue, ThreadLocal — the classic primitives.", content: JV_L5, order: 5, estimatedMins: 28, xpReward: 90, tags: ["Java", "Concurrency", "Threads", "synchronized", "volatile"] },
      { slug: "java-modern-concurrency",   title: "Modern Java concurrency — virtual threads, CompletableFuture", description: "Virtual threads (Java 21), CompletableFuture pipelines, Structured Concurrency, when virtual threads help vs hurt. The patterns 2026 Java code uses.", content: JV_L6, order: 6, estimatedMins: 26, xpReward: 90, tags: ["Java", "Virtual Threads", "CompletableFuture", "Java 21"] },
      { slug: "java-streams-functional",   title: "Streams and functional Java", description: "Stream pipelines (lazy intermediate ops, eager terminal ops), map vs flatMap, Collectors, the parallel-streams trap, Optional done right.", content: JV_L7, order: 7, estimatedMins: 24, xpReward: 80, tags: ["Java", "Streams", "Functional", "Optional"] },
      { slug: "java-modern-features",      title: "Modern Java — records, sealed classes, pattern matching", description: "Records for value objects, sealed types for closed hierarchies, switch pattern matching with destructuring, text blocks, var, sequenced collections.", content: JV_L8, order: 8, estimatedMins: 22, xpReward: 80, tags: ["Java", "Records", "Pattern Matching", "Java 21"] },
    ],
  },
  // ── Java Frameworks ───────────────────────────────────────────────────────
  {
    slug: "java-frameworks",
    title: "Java Frameworks",
    description: "Spring, Spring Boot, JPA, and Hibernate — the framework toolkit 95% of production Java jobs use. From DI fundamentals to production-grade testing and observability.",
    icon: "leaf",
    color: "#16a34a",
    difficulty: "INTERMEDIATE",
    estimatedHours: 10,
    tags: ["Java", "Spring", "Spring Boot", "JPA", "Hibernate"],
    order: 8,
    lessons: [
      { slug: "spring-core-di-ioc",          title: "Spring Core — DI, IoC, and the bean container", description: "Inversion of Control, constructor injection, bean lifecycle, profiles. The one idea that makes Spring Spring.", content: JF_L1, order: 1, estimatedMins: 25, xpReward: 80, tags: ["Spring", "DI", "IoC"] },
      { slug: "spring-boot-autoconfig",      title: "Spring Boot — autoconfiguration and starters", description: "Starters, @Conditional autoconfig, application.yml, profiles, Actuator, externalized config. The Boot magic, demystified.", content: JF_L2, order: 2, estimatedMins: 24, xpReward: 80, tags: ["Spring Boot", "Autoconfig", "Actuator"] },
      { slug: "spring-mvc-rest",             title: "Spring MVC and REST APIs", description: "Controllers, validation, error handling with @RestControllerAdvice + ProblemDetail, virtual-thread controllers, OpenAPI auto-gen.", content: JF_L3, order: 3, estimatedMins: 26, xpReward: 85, tags: ["Spring MVC", "REST", "Validation"] },
      { slug: "spring-data-jpa",             title: "Spring Data JPA — repositories and the N+1 trap", description: "Derived queries, @Query, the N+1 bug and three fixes, DTO projections, @Transactional, Flyway migrations.", content: JF_L4, order: 4, estimatedMins: 28, xpReward: 90, tags: ["JPA", "Spring Data", "N+1"] },
      { slug: "hibernate-deep-dive",         title: "Hibernate — what JPA hides", description: "Entity states, dirty checking, lazy loading internals, first/second-level caches, cascade types, the equals/hashCode-on-id trap.", content: JF_L5, order: 5, estimatedMins: 26, xpReward: 90, tags: ["Hibernate", "JPA", "Session"] },
      { slug: "spring-production",           title: "Shipping Spring Boot — testing, observability, production patterns", description: "The testing pyramid, Testcontainers, profiles, secrets, Actuator + Prometheus + Grafana, health probes, graceful shutdown.", content: JF_L6, order: 6, estimatedMins: 24, xpReward: 85, tags: ["Spring Boot", "Testing", "Observability"] },
    ],
  },
  // ── Apache Kafka ──────────────────────────────────────────────────────────
  {
    slug: "kafka-essentials",
    title: "Apache Kafka",
    description: "The distributed log that became the backend's nervous system. End-to-end production Kafka: topics, partitions, producers, consumers, Streams, and the ops gotchas.",
    icon: "share-2",
    color: "#7c3aed",
    difficulty: "INTERMEDIATE",
    estimatedHours: 9,
    tags: ["Kafka", "Streaming", "Event-Driven", "Distributed Systems"],
    order: 9,
    lessons: [
      { slug: "kafka-why-log-abstraction",   title: "Why Kafka? The log abstraction", description: "Why Kafka is fundamentally different from a queue, when to reach for it, and the at-least-once + idempotent default.", content: KF_L1, order: 1, estimatedMins: 22, xpReward: 75, tags: ["Kafka", "Architecture"] },
      { slug: "kafka-topics-partitions",     title: "Topics, partitions, and replication", description: "Partitions = parallelism. Replication factor, in-sync replicas, acks=all + min.insync.replicas=2. The production-safe defaults.", content: KF_L2, order: 2, estimatedMins: 25, xpReward: 80, tags: ["Kafka", "Partitions", "Replication"] },
      { slug: "kafka-producers",             title: "Producers — keys, idempotence, batching", description: "Production-safe producer config, partition keys, async send + callbacks, transactional producer, Schema Registry.", content: KF_L3, order: 3, estimatedMins: 25, xpReward: 80, tags: ["Kafka", "Producer", "Idempotence"] },
      { slug: "kafka-consumers",             title: "Consumers — groups, offsets, rebalances", description: "Consumer groups, manual offset commit, the rebalance storm, static membership, cooperative rebalancing, DLT pipelines.", content: KF_L4, order: 4, estimatedMins: 26, xpReward: 85, tags: ["Kafka", "Consumer", "Rebalance"] },
      { slug: "kafka-streams",               title: "Kafka Streams — stream processing in your service", description: "KStream vs KTable, windowed aggregation, joins, Interactive Queries — stream processing without standing up Flink.", content: KF_L5, order: 5, estimatedMins: 24, xpReward: 85, tags: ["Kafka Streams", "Stream Processing"] },
      { slug: "kafka-production-ops",        title: "Production Kafka — sizing, monitoring, the gotchas", description: "Sizing partitions and brokers, the 5 metrics to alert on, common production bugs, Confluent vs Apache.", content: KF_L6, order: 6, estimatedMins: 22, xpReward: 80, tags: ["Kafka", "Operations", "Monitoring"] },
    ],
  },
  // ── Microservices ─────────────────────────────────────────────────────────
  {
    slug: "microservices-architecture",
    title: "Microservices",
    description: "The patterns, the failures, the interviews. Communication, resilience, API gateways, distributed data with sagas and outbox, observability with OpenTelemetry.",
    icon: "network",
    color: "#0891b2",
    difficulty: "ADVANCED",
    estimatedHours: 10,
    tags: ["Microservices", "Distributed Systems", "Saga", "Resilience"],
    order: 10,
    lessons: [
      { slug: "microservices-when-and-not",  title: "Why microservices? (And when to NOT)", description: "The real costs of microservices, the modular monolith middle ground, Conway's law, the org-size floor before they pay off.", content: MS_L1, order: 1, estimatedMins: 22, xpReward: 75, tags: ["Microservices", "Architecture"] },
      { slug: "microservices-comms",         title: "Communication patterns — sync vs async", description: "REST vs gRPC vs GraphQL, sync vs async, eventual consistency, when each wins.", content: MS_L2, order: 2, estimatedMins: 24, xpReward: 80, tags: ["Microservices", "Communication", "REST", "gRPC"] },
      { slug: "microservices-resilience",    title: "Resilience — circuit breakers, retries, bulkheads", description: "Timeouts, retry with exponential backoff + jitter, circuit breakers, bulkheads, Resilience4j, service meshes.", content: MS_L3, order: 3, estimatedMins: 24, xpReward: 85, tags: ["Resilience", "Circuit Breaker", "Resilience4j"] },
      { slug: "microservices-api-gateway",   title: "API gateways and BFF pattern", description: "Spring Cloud Gateway, Kong, Envoy. JWT propagation, rate limiting, the BFF pattern for client-specific APIs.", content: MS_L4, order: 4, estimatedMins: 22, xpReward: 80, tags: ["API Gateway", "BFF"] },
      { slug: "microservices-distributed-data", title: "Distributed data — sagas, outbox, CDC", description: "Orchestrated vs choreographed sagas, the killer outbox pattern, Debezium for CDC, when NOT to use a saga.", content: MS_L5, order: 5, estimatedMins: 28, xpReward: 95, tags: ["Saga", "Outbox", "CDC", "Debezium"] },
      { slug: "microservices-observability", title: "Observability — tracing, logs, metrics, OpenTelemetry", description: "The three pillars, OpenTelemetry as the standard, distributed tracing with sampling, structured logs, SLOs.", content: MS_L6, order: 6, estimatedMins: 24, xpReward: 85, tags: ["Observability", "OpenTelemetry", "Tracing"] },
    ],
  },
  // ── System Design ─────────────────────────────────────────────────────────
  {
    slug: "system-design",
    title: "System Design",
    description: "Pass the senior interview — the framework, scalability, databases at scale, async architecture, real-time + distributed, and the classic problems (Twitter, Uber, URL shortener).",
    icon: "blocks",
    color: "#dc2626",
    difficulty: "ADVANCED",
    estimatedHours: 9,
    tags: ["System Design", "Scalability", "Interview", "Architecture"],
    order: 11,
    lessons: [
      { slug: "system-design-framework",     title: "The system-design interview — the framework", description: "The 6-step structure: clarify, estimate, API, architecture, deep dive, tradeoffs. Back-of-envelope estimation. Good candidate vs bad.", content: SD_L1, order: 1, estimatedMins: 22, xpReward: 80, tags: ["System Design", "Interview", "Framework"] },
      { slug: "system-design-scalability",   title: "Scalability — load balancing, caching, CDNs", description: "Horizontal scale, L4 vs L7 LB, 5 cache layers, the cache stampede problem, CDN for dynamic content, read replicas.", content: SD_L2, order: 2, estimatedMins: 25, xpReward: 85, tags: ["Scalability", "Caching", "Load Balancing", "CDN"] },
      { slug: "system-design-databases",     title: "Databases at scale — SQL, NoSQL, sharding", description: "SQL vs NoSQL pragmatics, CAP theorem, replication, sharding strategies, picking a shard key, polyglot persistence.", content: SD_L3, order: 3, estimatedMins: 26, xpReward: 90, tags: ["Databases", "Sharding", "NoSQL", "Replication"] },
      { slug: "system-design-async",         title: "Async architecture — queues, event streaming, CQRS", description: "Job queues vs Kafka, CQRS and event sourcing, when to reach for each pattern (and when not to).", content: SD_L4, order: 4, estimatedMins: 25, xpReward: 85, tags: ["Async", "CQRS", "Event Sourcing"] },
      { slug: "system-design-realtime",      title: "Real-time and distributed — push, geo, coordination", description: "WebSocket vs SSE, push notifications, multi-region patterns, distributed locking dangers, idempotency keys.", content: SD_L5, order: 5, estimatedMins: 26, xpReward: 90, tags: ["Real-time", "WebSocket", "Geo-distribution"] },
      { slug: "system-design-classic-problems", title: "Classic system design problems — applied", description: "Walk through URL shortener, news feed (Twitter), and ride-sharing (Uber) end-to-end — the framework + toolkit applied.", content: SD_L6, order: 6, estimatedMins: 28, xpReward: 100, tags: ["System Design", "Interview", "URL Shortener", "News Feed"] },
    ],
  },
];
