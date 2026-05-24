/* eslint-disable no-irregular-whitespace */
/**
 * Apache Kafka — 6 lessons. End-to-end, production-grade, interview-ready.
 * Voice: friendly + opinionated, like the Java Complete and Spring courses.
 */

export const KF_L1 = `# Why Kafka? The log abstraction

Every senior backend interview eventually arrives at: *"Tell me about Kafka."* It's not because Kafka is fashionable. It's because **Kafka quietly became the nervous system of modern backend architecture** — every Fortune-500 you know runs critical workloads on it.

But before we dig into APIs, you need to internalize the **one idea** that makes Kafka different from a queue.

## A traditional queue (RabbitMQ, ActiveMQ, SQS)

A queue is a **delivery mechanism**. Producers push messages. Consumers pull them, ACK them, and they're **gone from the queue**. The queue's job: get the message to one consumer, exactly once-ish.

\`\`\`
[Producer] ──▶ [Queue] ──▶ [Consumer]
                  │
                  └──── messages disappear after ACK
\`\`\`

Once consumed, the message is gone. Want to replay yesterday's messages? Too late.

## Kafka — a distributed, durable log

Kafka is fundamentally different. A Kafka topic is a **commit log** — an append-only file you can read from any position:

\`\`\`
Topic "orders":
  offset:  0   1   2   3   4   5   6   7   8   ← (and growing)
  data:   [A] [B] [C] [D] [E] [F] [G] [H] [I]
                                              ↑ append here

Consumers track their OWN read position (offset).
Consumer A is reading at offset 3.
Consumer B is reading at offset 7.
Both see the same data, independently.
\`\`\`

That single change unlocks an entire architecture:
- **Replay** — start a new consumer from offset 0 and re-process everything
- **Multiple consumers** — analytics team reads the same orders topic the inventory team reads, neither blocking the other
- **Time travel** — debug by replaying yesterday's events through your dev environment
- **Decoupling** — producer doesn't know who's consuming. Add consumers years later without touching producer code

## When to reach for Kafka

| Use case | Kafka? |
|----------|--------|
| Inter-service notifications ("user signed up — update CRM, send welcome email, etc.") | **YES** — many consumers, each gets their own copy |
| Stream processing (clickstream → aggregate per minute) | **YES** — log shape fits naturally |
| Audit log / event sourcing | **YES** — log IS the system of record |
| Async request/response RPC | **NO** — use HTTP or gRPC, you don't need replay |
| Real-time chat | **NO** — use a websocket gateway, Kafka adds latency |
| Single-consumer, fire-and-forget jobs | **NO** — Redis + Sidekiq / Postgres job queue is simpler |

**The rule:** Kafka is for **events that multiple things care about, that you might want to replay**. If neither is true, Kafka is overkill.

## The Kafka guarantee that everyone gets wrong

Default Kafka delivery is **at-least-once**. A message might be delivered to a consumer more than once. Your consumers MUST be idempotent — processing the same message twice produces the same result.

\`\`\`java
// ❌ Not idempotent — second delivery doubles the balance
account.setBalance(account.getBalance() + amount);

// ✅ Idempotent — applying the same eventId twice has no effect
if (!ledger.hasEvent(eventId)) {
  ledger.recordEvent(eventId, amount);
  account.setBalance(account.getBalance() + amount);
}
\`\`\`

Kafka also offers **exactly-once semantics (EOS)** within Kafka — producer + consumer + Kafka can be transactionally coordinated so a message is processed exactly once. But it adds latency and complexity. **Default to at-least-once + idempotent handlers.** It's almost always the right choice.

## A tiny mental model that wins interviews

When someone says "Kafka," picture:
1. A bunch of giant append-only log files on disk (the topics)
2. Producers slapping new entries on the end
3. Consumers reading from wherever they want, at their own pace
4. The broker (Kafka server) doing very little — just keeping the log, no per-consumer state

That's it. Everything else (partitions, consumer groups, retention, compaction) is just elaborations on this core: **distributed durable log + offset tracking.**

## A tricky interview question

\`\`\`java-quiz
level: tricky
q: A team using Kafka tells you "we want exactly-once delivery." What's the most important thing to push back on?
options: That's impossible | They probably want at-least-once + idempotent handlers, which gives the same business outcome | EOS is fine, just enable it | They should use RabbitMQ instead
correct: 1
explain: "Exactly-once delivery" across a distributed system is a famously hard problem (some say impossible in the strictest sense). What people USUALLY mean is "exactly-once EFFECT" — the business outcome is applied once. That's solved by at-least-once delivery + idempotent processing. It's simpler, faster, and more robust than Kafka's EOS feature. Kafka EOS exists and works, but it only applies within Kafka (read-process-write). The moment your consumer hits an external system (DB, API), you're back to needing idempotency anyway. Push back on the requirement, not the technology.
\`\`\`

## What you can do now

- Explain a Kafka topic as a "distributed durable log" in one sentence
- Distinguish Kafka from a traditional queue (where messages disappear)
- Know when Kafka is the right tool — and when it's overkill
- Default to at-least-once delivery + idempotent consumers
- Identify the moment in an interview when someone asks for "exactly-once" and gently redirect them to "exactly-once effect"

Next: **Topics, partitions, replication** — the data model that makes Kafka horizontally scalable.
`;

export const KF_L2 = `# Topics, partitions, and replication

A Kafka topic isn't actually one log — it's **N logs**, each called a **partition**. This is what lets Kafka scale to millions of messages per second across hundreds of brokers. It's also the source of every confusing Kafka behavior you'll encounter.

## A topic with 4 partitions

\`\`\`
Topic "orders" (4 partitions):

  Partition 0:  [msg] [msg] [msg] [msg] [msg]
  Partition 1:  [msg] [msg] [msg] [msg]
  Partition 2:  [msg] [msg] [msg] [msg] [msg] [msg]
  Partition 3:  [msg] [msg] [msg]
\`\`\`

Each partition is an independent, ordered, immutable log on disk. **Order is guaranteed within a partition, NOT across partitions.** That's the one trade-off that defines everything else.

## How a producer picks a partition

When you publish to a topic, the producer decides which partition. Three modes:

1. **Explicit partition** — you specify "go to partition 2"
2. **By key** — hash(key) % numPartitions. **Same key → same partition → ordered.**
3. **Round-robin (no key)** — spreads across all partitions, no order guarantee

**The killer pattern:** use a meaningful key like \`userId\`. All events for the same user go to the same partition, in order. Different users spread across partitions for parallelism. You get **per-key ordering with horizontal scale**.

\`\`\`java
producer.send(new ProducerRecord<>("orders", userId, orderJson));
\`\`\`

## Replication — surviving broker failure

Each partition has **N replicas** spread across brokers. One is the **leader** (handles reads/writes), the rest are **followers** (passively copy from the leader).

\`\`\`
Topic "orders", replication.factor=3:

  Partition 0:   leader=broker1, followers=broker2, broker3
  Partition 1:   leader=broker2, followers=broker3, broker1
  Partition 2:   leader=broker3, followers=broker1, broker2
\`\`\`

If broker1 dies:
1. Brokers detect it (via heartbeat timeout, default 30s)
2. For every partition broker1 was leading, an **in-sync replica** is elected leader
3. Producers/consumers transparently retry to the new leader

That last bit — **in-sync replica (ISR)** — matters. A replica only counts as in-sync if it's caught up within \`replica.lag.time.max.ms\` (default 30s). If you have 3 replicas but 2 fall behind, your ISR is just 1 — and a failure now loses data.

## acks — the producer's durability knob

When the producer sends a message, when does it return successfully?

| \`acks\` setting | What "success" means | Trade-off |
|----------------|----------------------|-----------|
| \`0\` | Wrote to socket — fire and forget | Fastest, can lose data |
| \`1\` (default before Kafka 3.0) | Leader confirmed | Loses data if leader dies before replicas catch up |
| \`all\` (default since 3.0) | All in-sync replicas confirmed | Safest. Slight latency cost. **Use this in prod.** |

Combine with \`min.insync.replicas=2\` on the topic — that says "at least 2 replicas must be in-sync, or refuse the write." This prevents the "1 ISR + acks=all" failure mode where you'd silently lose your replication factor.

\`\`\`
Topic config:    replication.factor=3, min.insync.replicas=2
Producer:        acks=all

Result: every write is confirmed by at least 2 of 3 replicas.
        You can tolerate ONE broker failure with zero data loss.
\`\`\`

This combination is **the production default** for important Kafka topics. Memorize it.

## Retention — how long does data live?

Two retention policies:

### Time-based (default)
Delete messages older than X. Default: **7 days**.

\`\`\`
retention.ms=604800000          # 7 days
\`\`\`

### Log compaction
Keep only the **latest message per key**. Useful for state-of-the-world topics — current user profile, latest config, etc.

\`\`\`
cleanup.policy=compact
\`\`\`

A compacted topic effectively becomes a **changelog of a key-value store**. Reading from offset 0 gives you the latest value for every key. This is how Kafka Streams maintains its local state stores.

## How many partitions should you have?

The interview classic. Trade-offs:
- **More partitions** = more parallelism for consumers (each partition is consumed by exactly one consumer in a group)
- **More partitions** = more files / connections / memory on brokers
- **More partitions** = harder to rebalance, longer leader-election time on failure

Rough sizing:
- For modest workloads: **partitions = 3 × expected peak consumer count**
- For high-throughput: target **10-25 MB/s per partition** as the upper bound
- Don't go nuts — 100 partitions per topic is a lot; 1000 is excessive for most teams

**Critical gotcha:** **you can ADD partitions but you cannot remove them**, and **adding partitions changes the hash-to-partition mapping**, breaking per-key ordering for keys that move buckets. Pick a partition count you're comfortable with and stick with it.

## A common partition-count interview question

\`\`\`java-quiz
level: tricky
q: You have a consumer group with 10 consumers reading from a topic with 6 partitions. How many consumers are actively reading?
options: 10 — all of them | 6 — one per partition; the other 4 are idle | 1 — the leader | All 10, each reads a fraction of each partition
correct: 1
explain: A partition is consumed by EXACTLY ONE consumer in a group. With 6 partitions and 10 consumers, 6 are active and 4 are idle, sitting there ready to take over if one of the 6 fails. This is why partition count is your throughput ceiling: max consumers = number of partitions. Want more parallelism? Repartition (carefully). Three or four consumers per topic when you have 6 partitions is fine; ten consumers is wasted compute.
\`\`\`

## What you can do now

- Explain partitions as the unit of parallelism (and the limit on consumer count)
- Pick a key that gives you "per-key ordering + horizontal scale"
- Configure replication.factor=3, min.insync.replicas=2, acks=all for safety
- Pick retention based on use case (time-based vs compaction)
- Size partition count based on expected peak consumer count

Next: **Producers** — keys, partitioning, idempotence, batching, and the tuning knobs that matter.
`;

export const KF_L3 = `# Producers — keys, idempotence, batching

Producers look simple — \`producer.send(record)\` — but the right configuration is what separates "Kafka works fine" from "we lost 0.1% of orders for a week and didn't notice." This lesson covers the producer settings every Kafka-using engineer should know.

## The Java producer in 8 lines

\`\`\`java
Properties props = new Properties();
props.put("bootstrap.servers", "broker1:9092,broker2:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
  producer.send(new ProducerRecord<>("orders", userId, orderJson));
}  // close() flushes pending sends
\`\`\`

This works. It's also **completely unsafe for production.** Defaults are tuned for "happy path on a stable cluster," not for the messy reality of network partitions and broker failures.

## The production-safe producer config

\`\`\`java
props.put("acks", "all");                       // wait for all ISRs to ack
props.put("enable.idempotence", "true");        // no duplicates from retries
props.put("max.in.flight.requests.per.connection", "5");  // works with idempotence
props.put("retries", Integer.MAX_VALUE);        // retry forever (bounded by delivery.timeout.ms)
props.put("delivery.timeout.ms", "120000");     // give up after 2 minutes
props.put("compression.type", "lz4");           // ~4× throughput on text payloads
props.put("linger.ms", "10");                   // batch for 10ms before sending
props.put("batch.size", "65536");               // 64KB max batch
\`\`\`

What each one does:

### \`acks=all\` + \`enable.idempotence=true\`
Together, these give you **at-least-once delivery with no duplicates from the producer side**. Without idempotence, a network blip could cause the producer to retry a message it already sent successfully (it just didn't get the ACK). With idempotence, the broker tracks producer IDs + sequence numbers and de-dupes automatically.

**Since Kafka 3.0, these are the defaults.** But every Kafka client library handles it slightly differently. Always set them explicitly.

### \`compression.type=lz4\`
Tradeoff: CPU vs network/disk. For text/JSON, compression typically gives **3-5× more throughput per broker**. lz4 is the modern default — fast compression, fast decompression. \`zstd\` is the next step up if you have the CPU budget.

### \`linger.ms\` + \`batch.size\`
The producer doesn't send each message immediately. It batches records going to the same partition. \`linger.ms\` is the max time to wait collecting more messages before sending; \`batch.size\` is the max batch size.

\`linger.ms=0\` (default) — send ASAP. Lowest latency, lowest throughput.
\`linger.ms=10-50\` + \`batch.size=64KB\` — production sweet spot. ~10ms latency, ~10× throughput.

## Keys decide partitions

Already covered in Lesson 2, but the producer code:

\`\`\`java
// Explicit partition (rare)
new ProducerRecord<>("orders", 3, key, value);

// By key — RECOMMENDED. Same key always goes to the same partition.
new ProducerRecord<>("orders", userId, orderJson);

// No key — round-robin (or sticky-round-robin since 2.4)
new ProducerRecord<>("orders", null, eventJson);
\`\`\`

**Choosing a key is the most important producer decision.** Common choices:
- \`userId\` — orders by the same user stay in order
- \`accountId\` — events for an account stay in order
- For logs/events with no natural key — let it round-robin

What you DON'T want: a key with poor distribution. \`status="OK"\` as a key means 99% of traffic goes to one partition. Sad.

## The transactional producer (exactly-once within Kafka)

When you read from one topic and write to another in lockstep, you can wrap the cycle in a transaction:

\`\`\`java
producer.initTransactions();
producer.beginTransaction();
try {
  producer.send(new ProducerRecord<>("outputTopic", processedRecord));
  // Optionally: commit consumer offsets in the same transaction
  producer.sendOffsetsToTransaction(...);
  producer.commitTransaction();
} catch (Exception e) {
  producer.abortTransaction();
}
\`\`\`

This is what Kafka Streams uses internally to give you exactly-once semantics. **Adds ~20% latency overhead.** Only worth it for read-process-write Kafka pipelines where the output also goes to Kafka. Crossing into an external system (DB, REST API) breaks the transaction boundary — back to idempotency.

## Synchronous vs asynchronous send

\`\`\`java
// Async (default) — returns immediately, fires the callback later
producer.send(record, (metadata, exception) -> {
  if (exception != null) log.error("Failed", exception);
  else log.info("Sent to partition={}, offset={}", metadata.partition(), metadata.offset());
});

// Sync — blocks until acked. Use when you NEED to know the message landed before proceeding.
try {
  RecordMetadata md = producer.send(record).get();
} catch (ExecutionException e) {
  // handle
}
\`\`\`

**99% of code should be async + callback** — much higher throughput. Sync only when the next line of business logic depends on the message having landed.

## Schema management — Avro / Protobuf / JSON Schema

Sending raw JSON is fine until two teams have a different idea of what \`order.totalAmount\` means. **Schema Registry** (Confluent, Apicurio, or compatible) solves this:

\`\`\`java
props.put("value.serializer", "io.confluent.kafka.serializers.KafkaAvroSerializer");
props.put("schema.registry.url", "http://schema-registry:8081");
\`\`\`

Now:
- Producers register their schema with the registry, get a numeric ID
- The schema ID prefixes each message (5 bytes); payload is binary Avro
- Consumers fetch the schema by ID and decode

Result: producers can evolve schemas (add fields, etc.) with backward-compatibility checks enforced by the registry. **Crucial for inter-team Kafka.**

JSON Schema + Protobuf are also supported. Avro is the historical default; Protobuf is gaining ground.

## A tricky producer interview question

\`\`\`java-quiz
level: tricky
q: A team complains: "Sometimes our Kafka messages arrive out of order for the same user." They're using a userId key. What's the most likely cause?
options: Kafka doesn't guarantee order even within partitions | They're sending to multiple topics | enable.idempotence is false, AND max.in.flight.requests.per.connection > 1 | The consumer is reading from multiple partitions
correct: 2
explain: Within a single partition, Kafka guarantees order. With a userId key, all messages for one user go to the same partition. So why out of order? The producer has multiple requests "in flight" simultaneously. If one fails and is retried while another succeeds, they land out of order on the broker. The fix is enable.idempotence=true — when enabled, the broker enforces that requests are written in producer sequence order, regardless of in-flight count (up to 5). Without idempotence, you'd need max.in.flight.requests.per.connection=1 (slow). Since Kafka 3.0, idempotence defaults to true.
\`\`\`

## What you can do now

- Configure a production-safe producer (acks=all + idempotence + compression + batching)
- Pick a partition key that gives both ordering AND distribution
- Use async send + callback for throughput
- Wrap read-process-write in a transaction if both sides are Kafka
- Use Schema Registry for inter-team safety

Next: **Consumers** — groups, offsets, rebalances, the patterns that don't lose your data.
`;

export const KF_L4 = `# Consumers — groups, offsets, rebalances

Consumers are where most Kafka production bugs live. Producers either work or they don't — it's visible. Consumers can silently skip messages, process the same message twice, hang, or rebalance in a way that takes minutes. This lesson is about the patterns that don't bite you.

## The consumer group abstraction

The killer Kafka feature: **consumer groups**. Multiple consumer instances coordinate via the broker to share work on a topic:

\`\`\`
Topic "orders" (6 partitions)

  Consumer group "billing-service":
    Instance 1  ──reads── P0, P1
    Instance 2  ──reads── P2, P3
    Instance 3  ──reads── P4, P5

  Consumer group "analytics":
    Instance 1  ──reads── P0, P1, P2
    Instance 2  ──reads── P3, P4, P5

Both groups see ALL messages.
Within a group, each partition is owned by ONE consumer.
\`\`\`

Add an instance to billing-service → Kafka rebalances and reassigns partitions. Remove an instance → rebalance again.

This is what gives you **horizontal scale-out** for consumers: just add more pods. Up to \`numPartitions\` workers can be active.

## Offset commits — the heart of all consumer bugs

Each consumer group tracks "where am I" per partition. This is the **consumer offset**. It's stored in a special Kafka topic (\`__consumer_offsets\`). Two questions:

1. **When do you commit?** Before processing, or after?
2. **How do you commit?** Automatically, or manually?

### Auto-commit (the default, DANGEROUS)

\`\`\`java
props.put("enable.auto.commit", "true");
props.put("auto.commit.interval.ms", "5000");
\`\`\`

Every 5 seconds, the consumer commits the last polled offset. Problem: you might commit before you've actually processed the messages. If your service crashes after the commit but before processing, **you lose data**.

### Manual commit AFTER processing (the right way)

\`\`\`java
props.put("enable.auto.commit", "false");

while (true) {
  ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
  for (ConsumerRecord<String, String> record : records) {
    process(record);                        // do the work first
  }
  consumer.commitSync();                    // then commit
}
\`\`\`

Now the offset is only advanced after successful processing. If your service crashes mid-batch, you'll re-process the un-committed records on restart. **At-least-once delivery** — which is exactly why your handlers need to be idempotent.

## The rebalance — your service's slowest moment

When a consumer joins or leaves a group, **Kafka pauses everyone**, computes a new partition assignment, and resumes. This is the **rebalance** — and during it, no messages are consumed.

A rebalance can take **seconds** for small groups, **minutes** for large groups across many topics. Triggers:

- Consumer starts up
- Consumer crashes (heartbeat timeout — default \`session.timeout.ms = 45s\` in Kafka 3.0)
- New partition added
- Consumer takes too long to poll (\`max.poll.interval.ms\` exceeded)
- Slow-consumer-rebalance trigger from the broker

**The #1 rebalance bug**: your processing logic takes longer than \`max.poll.interval.ms\` (default 5 minutes). Kafka thinks you're dead, kicks you out of the group, triggers a rebalance. Symptoms: rebalances every few minutes, throughput tanks.

**Fix**: either make your processing faster, or **increase poll interval / decrease max poll records**:

\`\`\`java
props.put("max.poll.interval.ms", "600000");   // give yourself 10 min
props.put("max.poll.records", "100");          // process less per poll
\`\`\`

## Static membership — the rebalance escape

Kafka 2.3+ adds **static membership** (\`group.instance.id\`). With static membership:
- A consumer that disappears for a configurable window does NOT trigger a rebalance
- When it returns (same group.instance.id), it gets its old partitions back

This is huge for rolling deployments. Without static membership, a rolling restart of 10 pods = 20 rebalances (one for each leave + join). With it = zero, if you do it within the timeout.

\`\`\`java
props.put("group.instance.id", "billing-pod-7");   // distinct per instance
props.put("session.timeout.ms", "120000");          // forgiving rebalance window
\`\`\`

## Cooperative rebalancing — the modern default

The legacy "eager" rebalance protocol stopped ALL consumers during a rebalance. **Cooperative rebalancing** (default since Kafka 2.4) keeps consumers running, only pausing partitions that are actually being reassigned.

\`\`\`java
props.put("partition.assignment.strategy",
    "org.apache.kafka.clients.consumer.CooperativeStickyAssignor");
\`\`\`

Almost always worth enabling.

## Dead letter topics — handling unprocessable messages

What do you do when a message is poisonous? It throws an exception every time you process it. Without handling, your consumer is stuck — the offset never advances.

The pattern:

\`\`\`java
try {
  process(record);
} catch (Exception e) {
  if (isRetryable(e) && record.attempts() < MAX_ATTEMPTS) {
    throw e;  // re-poll
  }
  // give up — send to DLT
  producer.send(new ProducerRecord<>("orders-dlt", record.key(), record.value(),
      record.headers()));
}
consumer.commitSync();  // advance past the poison
\`\`\`

Spring's \`@KafkaListener\` has built-in DLT support — set up a \`DeadLetterPublishingRecoverer\` and Spring handles the routing.

## A tricky consumer interview question

\`\`\`java-quiz
level: tricky
q: Your consumer service does this per message: 1) writes to PostgreSQL, 2) calls an external HTTP API, 3) commits the Kafka offset. The PostgreSQL write occasionally takes 30 seconds during a maintenance window. What goes wrong?
options: Nothing — Kafka handles slow consumers transparently | The consumer drops out of the group due to max.poll.interval.ms, triggers a rebalance, the in-flight work might be processed twice | The Kafka broker runs out of memory | The producer slows down to match the consumer
correct: 1
explain: max.poll.interval.ms (default 5 min) is the deadline for processing a poll's worth of messages. If your DB writes are slow, your processing loop misses the deadline. Kafka kicks you out of the group, the partition is reassigned, and the new owner re-processes from your last committed offset — which is BEFORE the messages you were working on. So those messages get processed twice. This is why: (a) your processing must be idempotent, and (b) reduce max.poll.records so you process fewer per poll, OR increase max.poll.interval.ms, OR offload slow work to a background thread (manual commit AFTER the background task finishes).
\`\`\`

## What you can do now

- Pick consumer group sizes based on partition count (no more than partitions)
- Disable auto-commit, commit manually AFTER processing
- Configure max.poll.interval.ms to match your worst-case processing time
- Enable static membership + cooperative rebalancing for smooth deploys
- Build a DLT pipeline for poison messages
- Diagnose rebalance storms (the #1 production Kafka issue)

Next: **Kafka Streams** — the killer feature for stream processing without standing up a separate Flink cluster.
`;

export const KF_L5 = `# Kafka Streams — stream processing in your service

Sometimes you need more than "read from topic, write to topic." You need joins, aggregations, windowing — actual stream processing. The classical answer was "stand up a Flink cluster." That's a lot. **Kafka Streams** lets you do real stream processing as just a library inside your normal Java service.

## What Kafka Streams is (and isn't)

**Is:** a JVM library you add to your existing service. No new infrastructure. Reads from Kafka, processes with operators (filter, map, join, aggregate, window), writes back to Kafka.

**Isn't:** a separate system. There's no "Streams cluster." Each instance of your service that includes the library participates in the processing topology. Scale by adding service instances.

\`\`\`java
StreamsBuilder builder = new StreamsBuilder();

builder.stream("orders")
    .filter((key, order) -> order.amount > 100)
    .mapValues(order -> new HighValueAlert(order))
    .to("high-value-alerts");

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
\`\`\`

That's it. Reads from "orders," filters, transforms, writes to "high-value-alerts." Scales by running multiple instances.

## KStream vs KTable — the core abstraction

| | What it represents | Example |
|---|---|---|
| **KStream<K, V>** | An unbounded sequence of events | Click events, order events |
| **KTable<K, V>** | The current state per key (a changelog) | Current user profile, current order status |
| **GlobalKTable** | A KTable replicated to every instance | Small reference data (countries, config) |

Think of it as: a KStream is **facts** ("user X clicked at time T"), a KTable is **state** ("user X's current city").

The same topic can be read as either:

\`\`\`java
KStream<String, Order> orderEvents = builder.stream("orders");
KTable<String, Order> latestOrderPerKey = builder.table("orders");
\`\`\`

Read as a stream → each event. Read as a table → only the latest value per key (last-write-wins).

## Stateless vs stateful operations

**Stateless** — operate on one record at a time, no memory:
- \`filter\`, \`map\`, \`mapValues\`, \`flatMap\`, \`peek\`, \`branch\`

**Stateful** — need memory:
- \`groupByKey + count / reduce / aggregate\` — running totals per key
- \`join\` — combine two streams
- \`windowedBy\` — bucket events into time windows

Stateful operations store data in a **local state store** (RocksDB by default), backed by a **changelog topic** in Kafka. If your service crashes, the state is restored from the changelog on restart. **You don't need an external state DB.**

## Windowed aggregation — the killer feature

"Count orders per customer per 5 minutes":

\`\`\`java
builder.stream("orders")
    .groupByKey()
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
    .count()
    .toStream()
    .to("orders-per-customer-5min");
\`\`\`

Five minutes of orders for each customerId get aggregated into a count. Every 5-minute window per key produces one output. Zero infrastructure beyond your existing Kafka cluster.

Other window types:
- **TumblingWindows** — fixed, non-overlapping (the example above)
- **HoppingWindows** — fixed size with overlap ("last 5 min, updated every 1 min")
- **SessionWindows** — gap-based ("group events less than 30s apart into a session")

## Stream-stream joins

Two streams merged on key + time:

\`\`\`java
KStream<String, Click> clicks = builder.stream("clicks");
KStream<String, Conversion> conversions = builder.stream("conversions");

clicks.join(
    conversions,
    (click, conversion) -> new AttributedConversion(click, conversion),
    JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofMinutes(30))
).to("attributed-conversions");
\`\`\`

This says: for each click, find a conversion within 30 minutes (on the same key, e.g. userId), and emit the joined record.

## Interactive Queries — Kafka Streams as a queryable store

Because Kafka Streams maintains local state, you can **query that state from outside**:

\`\`\`java
ReadOnlyKeyValueStore<String, Long> store = streams.store(
    StoreQueryParameters.fromNameAndType("counts-store", QueryableStoreTypes.keyValueStore())
);
Long count = store.get("userId-123");
\`\`\`

Combined with an HTTP endpoint, you've built a real-time query API on top of an event stream. No external DB. Spring Boot's actuator + a REST controller, done.

## When Kafka Streams is right (and when it isn't)

| Use case | Kafka Streams? |
|----------|---------------|
| Per-event transformation | YES — single-event ops are trivial |
| Aggregation + windowing on Kafka data | YES — exactly what it's for |
| Joining two Kafka streams | YES |
| Complex multi-source pipelines (Kafka + Postgres + APIs) | Maybe — Flink might be cleaner |
| ML inference at scale | NO — use a model serving framework |
| Truly massive scale (millions msg/sec sustained) | Flink scales better |

For most teams already on Kafka: **Streams covers 90% of stream processing needs**. It's worth it just to avoid operating a Flink cluster.

## A tricky Streams interview question

\`\`\`java-quiz
level: tricky
q: Your Kafka Streams application restarts after a crash and takes 25 minutes to come up. logs say "Restoring state from changelog topic." Why so slow, and how do you fix it?
options: Normal startup time — wait it out | The state store rebuilds by replaying its entire changelog. Use a standby replica (num.standby.replicas=1) so another instance keeps a hot copy ready for failover | Increase the consumer poll size | Switch from RocksDB to in-memory store
correct: 1
explain: When a Streams instance restarts and its local state is gone (new pod, fresh disk), it has to rebuild every state store by replaying the changelog topic from offset 0. For a large state store, that's slow. The fix is num.standby.replicas — another running instance maintains a hot standby of each state store. When the primary dies, the standby's already up to date and takes over instantly. Costs 2x the disk, but cuts failover from 25 minutes to seconds. Also helps for rolling deploys.
\`\`\`

## What you can do now

- Pick KStream (facts) vs KTable (state) for each data shape
- Apply stateless transforms (filter, map, flatMap) on event streams
- Build windowed aggregations without an external timer infrastructure
- Join two streams within a time window
- Use Interactive Queries to expose stream state as an HTTP API
- Configure standby replicas for fast failover

Next: **Production operations** — sizing, monitoring, the gotchas that bite at scale.
`;

export const KF_L6 = `# Production Kafka — sizing, monitoring, the gotchas

You can write the producer/consumer code from the previous lessons after a weekend of reading. Running Kafka in production is a much longer journey. This lesson is the compressed wisdom of what bites teams in real deployments.

## Sizing — partitions, brokers, retention

### Brokers
The basic rule: **3 brokers minimum** (so you can survive losing one and still have 2 to satisfy \`acks=all\` + \`min.insync.replicas=2\`). Beyond that, scale based on total throughput:

- Modest workloads (~10K msg/sec): 3 brokers
- Mid (50K msg/sec): 5-7 brokers
- High (100K+): 10+

### Partitions per topic
- Lower bound: enough for your max consumer count
- Upper bound: ~25 MB/s per partition under load, or ~10K msg/sec per partition for small messages
- Don't blast above 4000 partitions per broker (memory + file handle pressure)

**You cannot reduce partition count.** Pick conservatively. Re-partitioning later requires creating a new topic, mirroring, and cutover.

### Retention
- 7 days: default. Fine for inter-service events.
- 24 hours: high-volume telemetry where you don't need history.
- Forever: event sourcing / audit log — combine with log compaction so storage stays bounded.

\`\`\`
log.retention.hours=168               # 7 days
log.segment.bytes=1073741824          # 1 GB segments
log.segment.ms=604800000              # roll new segment every 7 days
\`\`\`

## The 5 metrics you must watch

1. **Under-replicated partitions** — should be 0. Anything > 0 means a broker is lagging or down.
2. **Active controller count** — should be exactly 1 across the cluster.
3. **Consumer lag** — per consumer group, per topic. The most important user-facing metric. Rising lag = consumer can't keep up.
4. **Request handler idle ratio** — < 30% means brokers are CPU-bound.
5. **Network processor idle ratio** — < 30% means brokers are network-bound (or batching needs tuning).

Set up alerts on under-replicated partitions and consumer lag. Everything else can be a dashboard.

## Consumer lag — what to do when it grows

Symptoms: \`kafka-consumer-groups.sh --describe --group billing\` shows LAG climbing.

Diagnose in order:
1. **Is the consumer running?** Check the LAG vs the OFFSET. If neither moving, consumer is down.
2. **Is the consumer keeping up but slowly?** Increase consumer count (up to partition count), or speed up processing.
3. **Is one partition consistently lagging more than others?** Hot key — re-key the data or split the workload.
4. **Has it always been this way?** Maybe your default is "spikes happen, they catch up." Look at the 95th percentile lag over a week.

## The Schema Registry "always-on" rule

If you use a Schema Registry, **producers and consumers will not function without it**. Plan for it like you plan for the broker:
- Multiple replicas
- Behind a load balancer
- Cached subjects in client code (default in most libraries)
- Schema changes deployed BEFORE the producer code that uses them

## Compaction gotchas

A compacted topic deletes the OLDER value when a newer one arrives for the same key. Two surprises:
1. **Tombstones**: write a null value to mark "this key is deleted." Compaction removes both the old value AND the tombstone after a delay (\`delete.retention.ms\`, default 24h).
2. **Compaction isn't instant**. There's always a "tail" of un-compacted recent data. Don't rely on compaction for security-critical deletes (e.g. GDPR) — use a side-channel.

## The Confluent vs Apache Kafka question

Two Kafka distributions in the wild:

| | What |
|---|------|
| **Apache Kafka** | The open-source project. Free. Lacks Schema Registry, ksqlDB, Connect connectors. |
| **Confluent Platform** | Apache Kafka + Schema Registry + ksqlDB + REST Proxy + many Connect connectors. Free for dev, licensed for prod. |
| **Confluent Cloud** | Managed hosted version. Pay-per-use. |

Most teams self-host: Apache Kafka + community Schema Registry (Apicurio). Confluent Cloud is the most popular managed option — competing managed Kafka exists (AWS MSK, Aiven, Redpanda). **For interviews, know that "Kafka" usually means the OSS project; "Confluent" is the company + their platform.**

## Common production bugs

### 1. **Tiny messages, no batching**
\`linger.ms=0\` (the default) with high-frequency producers. Each message becomes a separate request. Network gets crushed. Fix: \`linger.ms=20\`, \`batch.size=64KB\`, \`compression.type=lz4\`.

### 2. **Consumer thread blocked on external I/O**
Consumer thread polls, then calls some HTTP API that takes 30s. Throughput is one message per 30 seconds. Fix: offload to a thread pool; use \`pause()\` / \`resume()\` to manage flow.

### 3. **Big messages**
Trying to send >1MB messages. Kafka defaults to \`max.message.bytes=1MB\` (broker) and \`max.request.size=1MB\` (producer). Either chunk the message, store the payload in S3 and send a reference, or — last resort — bump the limits.

### 4. **Misunderstood retention vs compaction**
"Why is data disappearing?" Because retention.ms is 7 days. "Why aren't messages being deleted?" Because cleanup.policy=compact and you haven't written a new value for that key.

### 5. **Consumer with multiple poll() calls in flight**
Calling \`poll()\` from multiple threads is unsupported. Each consumer instance is single-threaded. Use multiple consumer instances or workers consuming from a shared queue inside your service.

## A tricky operational question

\`\`\`java-quiz
level: tricky
q: You deploy a new version of your consumer service. During the rolling deploy, you notice consumer lag spikes to 2 million and takes 20 minutes to recover. Each old pod is replaced one at a time, with proper health checks. What's the root cause?
options: The new version is slower than the old | Each pod replacement triggers a rebalance — that's 10 rebalances for 10 pods, each pausing all consumers | The broker is overwhelmed by reconnections | Network partition during deploy
correct: 1
explain: Every consumer joining or leaving a group triggers a rebalance. A 10-pod rolling deploy = 10 leaves + 10 joins = 20 rebalances. Each rebalance pauses ALL consumers in the group for seconds (or minutes for big groups). During that pause, lag accumulates. The fix is static membership (group.instance.id) + a long session.timeout.ms: when a pod is terminated, the broker waits for it to come back instead of rebalancing. Combined with cooperative rebalancing (CooperativeStickyAssignor), rolling deploys become nearly invisible.
\`\`\`

## You've finished Kafka

Six lessons in: you understand the log abstraction, partition + replication model, producer + consumer configuration, stream processing with Streams, and the operational realities. This is the working Kafka toolkit.

What's left when you're ready for more:
- **Kafka Connect** — pre-built integrations (CDC from Postgres, sink to S3, etc.). 95% of "I need to move data from X to Y" can be Kafka Connect.
- **ksqlDB** — SQL on top of Kafka topics. Useful for ad-hoc stream queries.
- **MirrorMaker 2** — cross-cluster replication for multi-region setups.
- **Tiered storage** (Apache Kafka 3.6+) — offload old segments to S3 / GCS. Huge cost win for long retention.

Build something. Kafka clicks fastest when you've shipped one production consumer.
`;
