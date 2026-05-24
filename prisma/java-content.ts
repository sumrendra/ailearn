/* eslint-disable no-irregular-whitespace */
/**
 * Java Complete — 8 lesson bodies aimed at interview prep + production work.
 *
 * Covers: JVM fundamentals, OOP, Collections (with deep HashMap dive),
 * concurrency (classic + modern virtual threads), streams, modern Java
 * features (records, sealed classes, pattern matching, Java 21 LTS).
 *
 * Style: dense interview prep but with the same friendly tone as French/SQL.
 * Every lesson has tricky `java-quiz` checkpoints (the kind of questions
 * interviewers love) plus visualizers for HashMap and Collections hierarchy.
 */

export const JV_L1 = `# How Java actually runs — JVM, JRE, JDK

If you've ever wondered why Java jobs still pay so well in 2026, here's the short version: **Java's runtime is one of the most engineered pieces of software on Earth.** Decades of work tuning garbage collection, JIT compilation, and class loading. This lesson is about understanding the layer beneath your code — without it, half the interview questions don't make sense.

## The three letters everyone confuses

| | Contains | Who uses it |
|---|----------|-------------|
| **JVM** (Java Virtual Machine) | The runtime — interprets and JIT-compiles bytecode, manages memory, runs your program | End users |
| **JRE** (Java Runtime Environment) | JVM + standard library (java.util, java.io, ...) | End users running Java apps |
| **JDK** (Java Development Kit) | JRE + compiler (javac), debugger (jdb), build tools | Developers (you) |

Quick mnemonic: **JDK ⊃ JRE ⊃ JVM**. The JDK contains everything.

Modern note: since Java 11, the standalone JRE is no longer distributed separately. You install a JDK (e.g. Oracle, Adoptium Temurin, Amazon Corretto) and you get the runtime as part of it.

## Compile → Bytecode → Run

\`\`\`
   Foo.java   ──[ javac ]──▶   Foo.class       ──[ java ]──▶   Output
  (source)                   (bytecode, .class)              (running program)
                                    │
                              cross-platform!
\`\`\`

The trick that built the entire Java empire: \`javac\` compiles to **bytecode** (an intermediate format the JVM understands), not native machine code. The same \`.class\` file runs on Windows, macOS, Linux, mainframes — anywhere there's a JVM. *Write once, run anywhere.*

At runtime, the JVM:
1. **Class loader** brings \`.class\` files into memory
2. **Bytecode verifier** checks the bytecode is type-safe and won't corrupt the JVM
3. **Interpreter** starts running it
4. **JIT compiler** notices "hot" methods and recompiles them to native machine code for speed

## The memory model — what gets allocated where

\`\`\`
   ┌────────────────────────────────────────┐
   │             METHOD AREA                │  ← class metadata, static fields, JIT cache
   ├────────────────────────────────────────┤
   │                HEAP                    │  ← all objects (shared across threads)
   │  ┌─────────┐  ┌─────────┐              │
   │  │  Young  │  │   Old   │              │  Garbage collected
   │  └─────────┘  └─────────┘              │
   ├────────────────────────────────────────┤
   │           STACK (per thread)           │  ← local vars, method call frames
   ├────────────────────────────────────────┤
   │            PC + Native stack           │  ← bookkeeping
   └────────────────────────────────────────┘
\`\`\`

Two things to internalize:
1. **Objects always live on the heap.** Local variables on the stack hold a *reference* to the heap object.
2. **Primitives live on the stack** when they're local variables, but inside an object, they live inside that object on the heap.

When you write \`Integer x = new Integer(5)\`, \`x\` lives on the stack (a 64-bit reference) pointing to an \`Integer\` object on the heap.

## "Java is pass-by-value" — the most-misunderstood line in interviews

Java has **no pass-by-reference**. Every method call copies the argument. The catch is *what gets copied*:
- For primitives → the value is copied (obvious)
- For objects → the **reference** is copied (the pointer to the heap)

So when you pass an object, the method gets its own copy of the pointer — both pointers point to the same heap object. Mutate that object, and the caller sees the change. Reassign the parameter to a new object inside the method, and the caller does NOT see the change.

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  void modify(List<String> list, String name) {
    list.add("Carol");
    list = new ArrayList<>();
    name = "Bob";
  }

  List<String> mine = new ArrayList<>(List.of("Alice"));
  String myName = "Dave";
  modify(mine, myName);
  System.out.println(mine + " " + myName);
options: [Alice] Dave | [Alice, Carol] Dave | [Alice, Carol] Bob | [] Dave
correct: 1
explain: The method gets COPIES of both references. list.add() mutates the heap object (visible). list = new ArrayList<>() only reassigns the local copy of the pointer (NOT visible). name = "Bob" only reassigns the local String reference (NOT visible). So mine has Carol added, but myName is unchanged.
\`\`\`

This single question is the gateway interview test for "does this person understand Java memory."

## Garbage collection — automated heap management

The JVM tracks every object on the heap and **automatically frees** the ones nothing references anymore. You never call \`free()\` or \`delete\` in Java — the GC does it.

Modern collectors you should know:

| Collector | Default in | Strength |
|-----------|------------|----------|
| **G1** (Garbage First) | Java 9+ default | Predictable pause times, good general default |
| **ZGC** | Production-ready since Java 15 | Sub-millisecond pauses, huge heaps |
| **Shenandoah** | OpenJDK 12+ | Concurrent compaction, low latency |
| **Serial / Parallel** | Legacy | Single-threaded / throughput-focused |

For interviews you just need to know: **G1 is the default**, **ZGC is the new low-latency option**, and you tune them with \`-Xmx\` (max heap), \`-Xms\` (initial heap), \`-XX:MaxGCPauseMillis\`.

## Versions — what's "current" Java in 2026

| Version | Released | Status | Notable |
|---------|----------|--------|---------|
| **Java 8** | 2014 | Still everywhere | Streams, lambdas, default methods |
| **Java 11** | 2018 | LTS, still common | var keyword, HTTP Client, no JRE |
| **Java 17** | 2021 | LTS, modern baseline | Sealed classes, records, pattern matching (preview) |
| **Java 21** | 2023 | **Current LTS** | Virtual threads, sequenced collections, pattern matching for switch |
| **Java 22 / 23** | 2024 | Non-LTS interim | Continued pattern matching, stream gatherers |

**Use Java 21** for new projects. Most companies are on 17 or 21 in 2026; if you're interviewing, mention you've touched virtual threads.

## What you can do now

- Distinguish JDK / JRE / JVM in one sentence each
- Explain what bytecode is and why it makes Java portable
- Diagram heap vs stack and where objects live
- Win the "pass-by-value" interview question
- Pick a GC for a use case and tune the basic heap flags
- Know which Java version is current

Next: **OOP done right** — classes, interfaces, inheritance, and the SOLID principles. The conceptual foundation of all Java code.
`;

export const JV_L2 = `# OOP done right — classes, interfaces, SOLID

Object-oriented programming sounds simple until you see a 12-class inheritance tree from 2008. This lesson is about the patterns that make OOP code maintainable — and the interview questions that test whether you've internalized them.

## Class vs Interface vs Abstract Class

Three building blocks for shaping types:

| | Has state? | Has behavior? | Multiple inheritance? |
|---|-----------|---------------|----------------------|
| **Class** | yes | yes | NO (only one parent) |
| **Abstract class** | yes | yes + abstract methods | NO |
| **Interface** | only \`static final\` constants | abstract + \`default\` + \`static\` methods (since Java 8) | **YES** — a class can implement many |

The modern rule of thumb:
- **Interface** when you're defining a *capability* a class can have (\`Comparable\`, \`Runnable\`, \`Serializable\`)
- **Abstract class** when you have shared *state* + behavior across a small family (\`AbstractList\`, \`Number\`)
- **Plain class** for everything else

Since Java 8, interfaces can have \`default\` methods (concrete code), which closed the gap with abstract classes considerably. The remaining difference: interfaces can't have instance fields.

## The diamond problem — and how Java avoids it

In C++ a class can inherit from two classes that both inherit from a third. Which version of the grandparent method does it use? Ambiguous. Painful.

Java sidesteps this by **forbidding multiple class inheritance**. You can implement many interfaces though — and since Java 8, those interfaces can have default methods. What if two interfaces have the same default method?

\`\`\`java
interface A { default String hello() { return "hi from A"; } }
interface B { default String hello() { return "hi from B"; } }
class C implements A, B { /* DOES NOT COMPILE */ }
\`\`\`

Java forces you to resolve it explicitly:

\`\`\`java
class C implements A, B {
  public String hello() {
    return A.super.hello();  // pick one
  }
}
\`\`\`

## SOLID — the five principles

Every senior Java interview asks at least one of these. Internalize them:

| Letter | Principle | One-line meaning |
|--------|-----------|------------------|
| **S** | Single Responsibility | A class should have one reason to change |
| **O** | Open/Closed | Open for extension, closed for modification (use interfaces + polymorphism) |
| **L** | Liskov Substitution | Subclasses must be usable wherever the parent is — no surprise behavior |
| **I** | Interface Segregation | Many small focused interfaces beat one fat one |
| **D** | Dependency Inversion | Depend on abstractions (interfaces), not concrete classes |

The most-violated in practice: **L**. If your subclass throws an exception the parent doesn't, or restricts behavior in a way that breaks callers, you've violated Liskov.

## Composition over inheritance — the most important OOP advice

\`\`\`java
// Inheritance (often wrong)
class FastCar extends Car { ... }

// Composition (usually better)
class Car {
  private final Engine engine;        // a Car HAS-A Engine
  public Car(Engine engine) {
    this.engine = engine;
  }
}
\`\`\`

Composition wins because:
- You can swap parts at runtime (\`new Car(new ElectricEngine())\` vs \`new Car(new V8Engine())\`)
- No deep, brittle inheritance hierarchies
- Each piece can be tested independently
- No tight coupling — Engine doesn't know it's in a Car

Modern Java APIs are composition-heavy. \`HashMap\` HAS-A array of buckets. \`ExecutorService\` HAS-A thread pool. Inheritance is reserved for true type hierarchies (Number → Integer / Float, etc.).

## final, finally, finalize — the interview classic

\`\`\`java-quiz
level: medium
q: Which of these statements about final/finally/finalize is correct?
options: All three are Java keywords | finally is a keyword; final and finalize are not | final is a keyword; finally is a block; finalize was a method (deprecated since Java 9) | They're all methods on Object
correct: 2
explain: 'final' is a keyword for variables (immutable reference), methods (cannot override), classes (cannot extend). 'finally' is the block in try/catch/finally that always runs. 'finalize()' was a method on Object the GC could call before collecting an object — deprecated since Java 9 and removed in Java 18. Use try-with-resources or Cleaner instead.
\`\`\`

**Modern reality:** never override \`finalize()\`. It's deprecated, unpredictable, and slows down the GC. Use **try-with-resources** for resource cleanup, or the \`Cleaner\` API for objects that need cleanup hooks.

## Checked vs unchecked exceptions

| | Subclass of | Caller must... | Examples |
|---|-------------|----------------|----------|
| **Checked** | \`Exception\` (not RuntimeException) | catch or declare throws | \`IOException\`, \`SQLException\` |
| **Unchecked** | \`RuntimeException\` | nothing forced | \`NullPointerException\`, \`IllegalArgumentException\` |
| **Error** | \`Error\` | don't catch | \`OutOfMemoryError\`, \`StackOverflowError\` |

The Java community is split: checked exceptions force handling (good) but can clutter signatures (bad). Modern style favors **unchecked exceptions** for most code, reserving checked for truly recoverable conditions (file not found → maybe retry).

## A tricky Liskov interview question

\`\`\`java-quiz
level: tricky
q: Does this code violate the Liskov Substitution Principle?
code:
  class Bird {
    public void fly() { ... }
  }
  class Penguin extends Bird {
    @Override
    public void fly() {
      throw new UnsupportedOperationException("Penguins can't fly!");
    }
  }
options: No, Penguin properly overrides the method | Yes, because Penguin breaks the contract of fly() | No, exceptions are valid responses | Yes, because Penguin doesn't add new methods
correct: 1
explain: Liskov says a subclass must be usable wherever the parent is. Code that has a Bird and calls fly() expects it to work — Penguin breaks that contract by throwing. The right design: extract a Flyable interface and have only flying birds implement it. Penguin extends Bird (or Animal) but doesn't implement Flyable.
\`\`\`

## What you can do now

- Pick between class / abstract class / interface for a given design
- Explain how Java avoids the diamond problem
- Apply SOLID — especially Liskov, the one people get wrong
- Default to composition; reach for inheritance only for true type hierarchies
- Distinguish final / finally / finalize and not write finalize() in 2026
- Spot a Liskov violation in interview code samples

Next: **the Collections framework** — the data structures every Java program uses, with an interactive class hierarchy.
`;

export const JV_L3 = `# The Collections Framework

Every Java program uses collections. List, Set, Map — three little interfaces and a constellation of implementations. **Picking the right one is the #1 day-to-day skill.** And it's also the most-asked interview topic after HashMap.

## The big picture

Below is the actual class hierarchy. Click any class to see its time complexity, thread safety, when to use it, and the interview gotcha most candidates miss.

\`\`\`java-collections
\`\`\`

Three things to notice immediately:
1. **Map is NOT a Collection.** It's a parallel hierarchy. Calling \`Collection<Map<K,V>>\` is fine; \`Map<K,V> instanceof Collection\` is \`false\`.
2. Interfaces are italic; concrete classes are bold. Most of the time you code to the interface (\`List<String> names = new ArrayList<>()\`).
3. \`LinkedList\` is the rare class that implements *both* \`List\` and \`Deque\` — historically used for stacks and queues, but \`ArrayDeque\` is almost always faster.

## The cheat sheet — when to pick what

| Need | Pick |
|------|------|
| Default list | **ArrayList** |
| Default map | **HashMap** (or **ConcurrentHashMap** if shared across threads) |
| Default set | **HashSet** |
| Predictable iteration order | **LinkedHashMap** / **LinkedHashSet** |
| Sorted by key/element | **TreeMap** / **TreeSet** |
| Stack or queue | **ArrayDeque** (never \`Stack\` or \`Vector\` — both are legacy synchronized) |
| Priority queue / heap | **PriorityQueue** |
| Thread-safe map | **ConcurrentHashMap** |
| Frequent random access | **ArrayList** (O(1)) |
| Frequent head/tail ops | **ArrayDeque** |
| LRU cache | **LinkedHashMap** with \`accessOrder=true\` + override \`removeEldestEntry()\` |

## The \`equals\` / \`hashCode\` contract — every Java engineer must know

If you put your own class into a \`HashMap\` or \`HashSet\` as a key, you **must** override both \`equals()\` and \`hashCode()\` consistently:

1. If \`a.equals(b)\` is true, then \`a.hashCode() == b.hashCode()\` MUST be true
2. If \`a.hashCode() == b.hashCode()\`, \`a.equals(b)\` may or may not be true (collisions are fine)
3. Both methods must be **consistent** — same result given the same state
4. \`hashCode()\` must use the same fields that \`equals()\` does

Break this and you get the classic bug: "I put it in the HashSet, but contains() returns false!" — different hashCode landed it in a different bucket than the lookup checks.

\`\`\`java
@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof Person other)) return false;
  return Objects.equals(name, other.name) && age == other.age;
}

@Override
public int hashCode() {
  return Objects.hash(name, age);  // same fields as equals()
}
\`\`\`

**Modern Java shortcut:** declare your class as a **record** and the compiler generates both correctly:

\`\`\`java
public record Person(String name, int age) {}
// equals, hashCode, toString — all generated. Use this for value objects.
\`\`\`

## Comparable vs Comparator

| | Where it lives | Used by |
|---|---------------|---------|
| \`Comparable<T>\` | Implemented on the class itself (\`int compareTo(T other)\`) | Collections.sort() with no second arg, TreeMap, TreeSet |
| \`Comparator<T>\` | A separate object (\`int compare(T a, T b)\`) | Collections.sort(list, comparator), passed to TreeMap constructor |

Use \`Comparable\` when the class has a single natural ordering (numbers, dates, strings). Use \`Comparator\` for everything else — including "sort by name, then by age, then by ID."

\`\`\`java
// Modern Java composition
list.sort(Comparator.comparing(Person::name)
              .thenComparingInt(Person::age)
              .reversed());
\`\`\`

## Fail-fast vs fail-safe iterators

\`\`\`java-quiz
level: tricky
q: What happens when this code runs?
code:
  List<Integer> list = new ArrayList<>(List.of(1, 2, 3));
  for (Integer n : list) {
    if (n == 2) list.remove(n);
  }
options: Prints 1, 2, 3 normally | ConcurrentModificationException | Prints 1, 3 | Compilation error
correct: 1
explain: ArrayList's iterator is FAIL-FAST. It tracks a "modCount" — when you modify the list during iteration (outside the iterator's own remove), the next iteration check throws ConcurrentModificationException. To remove items during iteration, use the Iterator's remove() method, or use removeIf(): list.removeIf(n -> n == 2).
\`\`\`

**Fail-fast:** \`ArrayList\`, \`HashMap\`, \`HashSet\` iterators throw \`ConcurrentModificationException\` immediately on detected modification.
**Fail-safe (weakly consistent):** \`ConcurrentHashMap\`, \`CopyOnWriteArrayList\` iterate over a snapshot — no exception, but you might miss recent changes.

## Java 9+ immutable factories

The modern way to create small fixed collections:

\`\`\`java
List<String> names = List.of("Alice", "Bob", "Carol");
Map<String, Integer> ages = Map.of("Alice", 30, "Bob", 25);
Set<Integer> primes = Set.of(2, 3, 5, 7);
\`\`\`

These return **immutable** views — calling \`add()\` throws \`UnsupportedOperationException\`. Perfect for constants. They also don't allow \`null\` (where \`HashMap\` does), which catches bugs early.

## Java 21 — SequencedCollection

Java 21 added a unifying interface \`SequencedCollection\` with \`getFirst()\`, \`getLast()\`, \`addFirst()\`, \`addLast()\`, \`reversed()\`. \`ArrayList\`, \`LinkedHashSet\`, \`LinkedHashMap\` all implement it. Finally, a sane unified API for "ordered" collections.

## What you can do now

- Read the Collections class hierarchy and pick the right impl from memory
- Avoid \`Stack\` and \`Vector\` (legacy); reach for \`ArrayDeque\`
- Implement \`equals\` and \`hashCode\` consistently (or use records)
- Distinguish fail-fast vs fail-safe iterators
- Use \`List.of\` / \`Map.of\` for immutable constants
- Compose \`Comparator\`s with \`comparing().thenComparing()\`

Next: **HashMap deep-dive** — the single most-asked Java internal in interviews, with a live visualization of buckets, hash spreading, and treeification.
`;

export const JV_L4 = `# HashMap — the deep dive every interview asks about

If interviewers had to pick **one** Java internal to test you on, it's \`HashMap\`. They'll ask: how does it work? What's the load factor? What changed in Java 8? Why use it over \`Hashtable\`? **This lesson is the answer to all of those.**

Below is a live visualization of HashMap internals — try adding keys, watching collisions, and triggering a resize. We'll explain every piece underneath.

\`\`\`java-hashmap
\`\`\`

## The data structure

Internally, \`HashMap\` is a \`Node<K,V>[]\` — an array (called the *table*) where each slot is either:
- empty (\`null\`)
- a single \`Node\`
- a *linked list* of \`Node\`s (collision chain)
- since Java 8, a *red-black tree* of \`TreeNode\`s when a bucket gets too crowded

Each \`Node\` stores: \`hash\`, \`key\`, \`value\`, and \`next\` (the linked-list pointer).

## How a \`put\` works — step by step

1. Compute \`hash = hash(key)\` — Java applies a special "spread" to defend against bad \`hashCode()\` implementations:
   \`\`\`java
   static int hash(Object key) {
     int h;
     return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
   }
   \`\`\`
   The XOR with the upper 16 bits ensures that even if \`hashCode()\` only varies in its upper bits, the bucket index (which uses lower bits) still distributes well.

2. Compute bucket index = \`hash & (capacity - 1)\`
   - Works because \`capacity\` is **always a power of 2** (16, 32, 64, ...)
   - \`& (cap-1)\` is equivalent to \`% cap\` but ~10× faster

3. Look at \`table[index]\`:
   - If empty → put a new \`Node\` there
   - If occupied → walk the chain, comparing \`hash\` first (cheap), then \`equals()\` (expensive). If we find a match, update its value; otherwise append a new \`Node\`

4. After insertion, if \`size > threshold\` (where \`threshold = capacity * loadFactor\`), call \`resize()\`:
   - Double the table size
   - Re-hash every entry (since the index calculation depends on capacity)

## Load factor 0.75 — why?

\`HashMap\`'s default load factor is **0.75**. That means when the map is 75% full, it doubles.

- **Lower** (e.g. 0.5) → fewer collisions, but more memory wasted and more resizes
- **Higher** (e.g. 1.0) → more collisions (chains get long), but less memory

0.75 is a tested sweet spot — a great default, very rarely worth changing.

## The Java 8 treeification — the "big change"

Before Java 8, a collision chain was always a linked list. Worst case: every key hashes to the same bucket, lookups become O(n).

**Since Java 8:** when a bucket reaches **8 entries** (\`TREEIFY_THRESHOLD = 8\`), Java converts that bucket's linked list into a **red-black tree**. Lookups in that bucket drop from O(n) to O(log n).

When the tree shrinks back to **6 entries** (\`UNTREEIFY_THRESHOLD = 6\`), it converts back to a linked list (trees have more memory overhead).

This is the answer to "what changed in HashMap between Java 7 and 8?" — and it's a great interview brag because most candidates don't know the specific thresholds.

## The killer interview gotcha

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  Map<Integer, String> map = new HashMap<>();
  map.put(null, "value");
  map.put(null, "newer value");
  System.out.println(map.get(null) + " size=" + map.size());
options: null value size=1 | newer value size=1 | newer value size=2 | NullPointerException
correct: 1
explain: HashMap allows ONE null key (it's hashed to bucket 0). Putting twice updates the same entry, so size stays 1 and the value is the most recent. Contrast: ConcurrentHashMap and Hashtable both throw NullPointerException for null keys/values. TreeMap also throws NPE for null keys (it can't compare them).
\`\`\`

## Custom keys — the mutability trap

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  class MutableKey {
    String name;
    MutableKey(String n) { this.name = n; }
    @Override public int hashCode() { return name.hashCode(); }
    @Override public boolean equals(Object o) {
      return o instanceof MutableKey k && Objects.equals(name, k.name);
    }
  }

  Map<MutableKey, String> map = new HashMap<>();
  MutableKey key = new MutableKey("Alice");
  map.put(key, "engineer");
  key.name = "Bob";              // mutate AFTER putting
  System.out.println(map.get(key));
options: engineer | null | Throws ConcurrentModificationException | Bob
correct: 1
explain: When we put(), the hash was computed from "Alice" and the entry was placed in that bucket. After mutating the key to "Bob", a get() computes the hash from "Bob" — which lands in a DIFFERENT bucket. The entry is still in the original bucket but unreachable. Lesson: never mutate keys after putting them into a HashMap. Prefer immutable keys (String, Integer, records).
\`\`\`

## HashMap vs Hashtable vs ConcurrentHashMap

| | Thread-safe | null keys | Iterator |
|---|------------|-----------|----------|
| **HashMap** | no | one allowed | fail-fast |
| **Hashtable** | yes (synchronized methods) | no | fail-fast |
| **ConcurrentHashMap** | yes (per-bucket CAS) | no | weakly consistent |

**Never use Hashtable in new code.** It's a 1990s relic. Either you need single-threaded → \`HashMap\`, or you need concurrent → \`ConcurrentHashMap\`. \`Hashtable\` is "synchronized but slow" — the worst of both worlds.

## ConcurrentHashMap — the right concurrent map

Pre-Java 8: split the table into 16 *segments*, each lockable independently → 16-way concurrency.

Since Java 8: per-bucket CAS (compare-and-swap) on writes, lock only on collisions. Much higher throughput. Reads are completely lock-free.

The killer methods are the atomic compound operations:

\`\`\`java
ConcurrentHashMap<String, Integer> counters = new ConcurrentHashMap<>();
counters.compute("hits", (k, v) -> v == null ? 1 : v + 1);  // atomic increment
counters.merge("hits", 1, Integer::sum);                     // same thing, shorter
counters.putIfAbsent("user", 0);                             // atomic
\`\`\`

## What you can do now

- Diagram HashMap internals: array of buckets, linked-list collision chains, treeification
- Explain hash spreading (XOR upper 16 bits) and why
- Justify the 0.75 load factor and 8/6 treeify/untreeify thresholds
- Spot the null-key, mutable-key, and HashMap-vs-Hashtable interview traps
- Pick HashMap vs ConcurrentHashMap based on threading needs

Next: **concurrency** — threads, synchronization, the Java Memory Model, race conditions, and the classic concurrency interview questions.
`;

export const JV_L5 = `# Concurrency — threads, synchronization, the Memory Model

Concurrency is where Java earned its reputation as an enterprise language — and where interview questions get hardest. This lesson covers the classic concurrency primitives every Java engineer must know. The next lesson covers **modern** Java concurrency (virtual threads, structured concurrency, CompletableFuture) which is what production code looks like in 2026.

## The three ways to start a thread

\`\`\`java
// 1. Extend Thread (rarely the right choice — locks you out of other inheritance)
class Worker extends Thread {
  public void run() { System.out.println("Hi from " + getName()); }
}
new Worker().start();

// 2. Implement Runnable + pass to Thread
Runnable task = () -> System.out.println("Hi");
new Thread(task).start();

// 3. Submit to an ExecutorService (the production-ready way)
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("Hi"));
\`\`\`

**Always pick #3 in production.** Manual \`Thread\` creation gives you no thread pool, no error handling, no result, no cancellation. \`ExecutorService\` is the foundation everything else builds on.

## Runnable vs Callable

\`\`\`java
// Runnable — returns nothing, can't throw checked exceptions
Runnable r = () -> doWork();

// Callable — returns a value, can throw checked exceptions
Callable<Integer> c = () -> {
  return computeAnswer();
};

Future<Integer> future = pool.submit(c);
Integer result = future.get();  // blocks until done
\`\`\`

Use \`Callable\` when you need a return value. \`Runnable\` when you don't.

## The Java Memory Model — what \`volatile\` actually does

Modern CPUs aggressively reorder operations and cache writes in per-core caches. Without explicit synchronization, **one thread's writes may never become visible to another thread**.

\`\`\`java
// Thread 1 (writer)
data = computeData();
ready = true;

// Thread 2 (reader)
while (!ready) { /* spin */ }
process(data);  // might see ready=true but stale data!
\`\`\`

The fix: declare \`ready\` (and ideally \`data\`) as \`volatile\`. A \`volatile\` write **flushes** all preceding writes to main memory; a \`volatile\` read **invalidates** the local cache and re-reads from main memory.

Quick rules:
- \`volatile\` gives you **visibility** (what one thread writes, others see)
- \`synchronized\` gives you **visibility AND atomicity** (no two threads execute the block at once)
- For simple flags, \`volatile\` is enough; for compound operations (read-then-write), use \`synchronized\` or \`Atomic*\` classes

## The lost-update problem

\`\`\`java-quiz
level: tricky
q: Two threads run counter++ 1,000,000 times each on a shared int. What's the final value?
options: Exactly 2,000,000 | Anywhere from 1,000,001 to 2,000,000 | Anywhere from 2 to 2,000,000 | Always 1,000,000
correct: 2
explain: counter++ is THREE operations: read, increment, write. Without synchronization, two threads can both read the same value, both increment, both write — losing one increment. Worst case: each iteration overlaps perfectly and only the last write wins, giving as little as 2. Fix: use AtomicInteger.incrementAndGet() or synchronize the increment.
\`\`\`

The fix:

\`\`\`java
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();  // atomic, lock-free, ~10× faster than synchronized for this
\`\`\`

\`AtomicInteger\`, \`AtomicLong\`, \`AtomicReference\` are built on CPU CAS (compare-and-swap) instructions — extremely fast for high-contention counters and flags.

## synchronized — the original lock

\`\`\`java
private final Object lock = new Object();

void transfer(int amount) {
  synchronized (lock) {
    balance -= amount;
    other.balance += amount;
  }
}
\`\`\`

\`synchronized\` does two things:
1. Acquires an exclusive lock on the object — no other thread can enter any synchronized block on the same lock until you exit
2. Establishes a memory barrier — all writes inside are visible to the next thread that acquires the lock

Use a **private \`Object\` lock** (or \`final\`) rather than locking on \`this\` — exposing your lock to subclasses or callers leads to deadlocks. (\`synchronized\` on a method locks \`this\`, which is why it's somewhat discouraged.)

## ReentrantLock — the flexible alternative

\`java.util.concurrent.locks.ReentrantLock\` does what \`synchronized\` does, plus:
- \`tryLock(timeout)\` — give up if you can't get the lock fast
- \`lockInterruptibly()\` — abort if the thread is interrupted
- \`ReentrantReadWriteLock\` — many readers OR one writer

\`\`\`java
private final ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
  // critical section
} finally {
  lock.unlock();  // ALWAYS unlock in finally
}
\`\`\`

## Deadlock — the classic gotcha

Two threads, each holding a lock the other wants:

\`\`\`
Thread 1: holds lock A, wants lock B
Thread 2: holds lock B, wants lock A
→ both wait forever
\`\`\`

**The fix:** always acquire multiple locks in the same global order (e.g. by object hash). Or use \`tryLock\` with a timeout so you can detect and retry.

## Producer-consumer with BlockingQueue

The cleanest pattern for "one thread produces, another consumes":

\`\`\`java
BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);

// Producer
queue.put(task);  // blocks if queue is full

// Consumer
Task task = queue.take();  // blocks if queue is empty
\`\`\`

No manual locking, no spin-waiting, naturally throttled by capacity. Use \`LinkedBlockingQueue\` for unbounded-ish queues, \`ArrayBlockingQueue\` when you know the size, \`PriorityBlockingQueue\` for priority order.

## ThreadLocal — per-thread state

\`\`\`java
private static final ThreadLocal<SimpleDateFormat> FMT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

String today = FMT.get().format(new Date());
\`\`\`

Each thread gets its own copy. Useful for non-thread-safe objects you want to amortize across calls (like \`SimpleDateFormat\` which famously is *not* thread-safe).

**WARNING:** in applications with thread pools (Tomcat, Spring, etc.), \`ThreadLocal\` values persist between requests. Always \`remove()\` in a finally block to avoid leaks.

## What you can do now

- Pick \`Runnable\` vs \`Callable\` correctly
- Explain what \`volatile\` does vs \`synchronized\`
- Use \`AtomicInteger\` instead of \`synchronized\` for counters
- Use \`ReentrantLock\` when you need \`tryLock\` or read/write locking
- Avoid deadlock by ordering lock acquisition
- Use \`BlockingQueue\` for producer/consumer

Next: **modern concurrency** — virtual threads (Java 21), \`CompletableFuture\`, and structured concurrency. The patterns production code uses today.
`;

export const JV_L6 = `# Modern Java concurrency — virtual threads, CompletableFuture

Classic threads + \`synchronized\` work but they're heavy and verbose. Modern Java offers two huge improvements: **virtual threads** (Java 21) which give you millions of threads cheap, and **CompletableFuture** which composes async operations like a pipeline. This is what 2026 Java code looks like.

## CompletableFuture — chained async

Pre-Java 8, async chaining looked like nested \`Future.get()\` calls — blocking, ugly, error-prone. \`CompletableFuture\` lets you build pipelines:

\`\`\`java
CompletableFuture<String> result = CompletableFuture
    .supplyAsync(() -> fetchUser(userId))            // async step 1
    .thenApply(user -> user.getEmail())              // sync transform
    .thenCompose(email -> sendWelcomeAsync(email))   // chain another async
    .exceptionally(ex -> "fallback");                // handle errors
\`\`\`

The keys:
- \`supplyAsync\` runs in a thread pool, returns immediately
- \`thenApply\` transforms the result (when it arrives)
- \`thenCompose\` chains another \`CompletableFuture\` (flat-map)
- \`thenCombine\` waits for **two** futures and merges them
- \`allOf\` / \`anyOf\` wait for multiple

**Default executor** for these is \`ForkJoinPool.commonPool()\` (size = cpu count). For I/O-heavy work, pass your own executor:

\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(50);
CompletableFuture.supplyAsync(() -> blockingHttpCall(), pool)
                 .thenApply(this::parse);
\`\`\`

## Virtual threads — Java 21's killer feature

Traditional (platform) threads are heavy — typically ~1MB of stack each, scheduled by the OS. You can comfortably run **thousands** but not millions.

**Virtual threads** are managed by the JVM, not the OS. They're tiny (a few hundred bytes), and the JVM multiplexes them onto a small pool of OS threads. You can run **millions** at once.

\`\`\`java
// Old way — limited by OS threads
ExecutorService executor = Executors.newFixedThreadPool(200);

// New way (Java 21+) — millions of cheap virtual threads
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

// Use exactly like any other executor
for (Request req : requests) {
  executor.submit(() -> handle(req));
}
\`\`\`

The magic: when a virtual thread does **blocking I/O** (a DB call, an HTTP request), the JVM detects it and *parks* the virtual thread — releasing the underlying OS thread to run other virtual threads. When the I/O completes, the JVM resumes the virtual thread (possibly on a different OS thread).

**Effect:** the "thread per request" model works again. You don't need reactive frameworks (Reactor, RxJava) for high-throughput services. Spring Boot 3.2+ uses virtual threads natively. **This is the biggest Java change since lambdas.**

## When virtual threads help — and when they don't

| Use case | Virtual threads help? |
|----------|----------------------|
| Many concurrent HTTP/DB calls | **YES** — they spend most time blocked on I/O |
| CPU-heavy computation | **NO** — you only have N cores, virtual threads just queue up |
| Lots of \`synchronized\` blocks | **MAYBE** — \`synchronized\` pins virtual threads to their carrier (since fixed in Java 24, partially) |
| Holding ThreadLocal state | **CAREFUL** — millions of threads × ThreadLocal = memory blowup |

Replace \`synchronized\` with \`ReentrantLock\` if you're using virtual threads heavily.

## Structured Concurrency (Java 21 preview, stable Java 23)

The problem with raw \`CompletableFuture.allOf(...)\`: if one task errors, the others keep running invisibly. No structure, no cleanup.

**Structured Concurrency** treats a group of related concurrent tasks as one unit — they all start together, all finish together (or all get cancelled together).

\`\`\`java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
  Subtask<User> user    = scope.fork(() -> fetchUser(id));
  Subtask<Account> acct = scope.fork(() -> fetchAccount(id));

  scope.join();           // wait for all
  scope.throwIfFailed();  // re-throw any subtask error

  return new Profile(user.get(), acct.get());
}
// Both subtasks have either completed or been cancelled before this point.
\`\`\`

If \`fetchUser\` throws, \`fetchAccount\` is cancelled immediately. No leaked threads, no orphaned work. This is going to define a lot of Java 2026+ code.

## Atomic classes — lock-free coordination

For high-contention counters and flags, \`Atomic*\` classes are faster than locks (built on CPU CAS):

\`\`\`java
AtomicLong counter = new AtomicLong(0);
counter.incrementAndGet();   // atomic
counter.addAndGet(5);        // atomic
counter.compareAndSet(0, 1); // atomic CAS

AtomicReference<State> state = new AtomicReference<>(State.IDLE);
state.compareAndSet(State.IDLE, State.RUNNING);  // transition only if currently IDLE
\`\`\`

For accumulators with very high contention, use \`LongAdder\` instead — it spreads contention across multiple internal cells.

## A tricky CompletableFuture quiz

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  CompletableFuture<Integer> f = CompletableFuture
      .supplyAsync(() -> 10)
      .thenApply(x -> x * 2)
      .thenApply(x -> { throw new RuntimeException("boom"); })
      .thenApply(x -> x + 1)
      .exceptionally(ex -> -1);

  System.out.println(f.join());
options: 21 | -1 | RuntimeException: boom | 20
correct: 1
explain: When a stage throws, all DOWNSTREAM stages skip their normal execution and propagate the exception. The exceptionally() stage catches it and returns -1. The (x + 1) stage is silently skipped. Note: exceptionally() only catches exceptions; handle() catches both success AND failure.
\`\`\`

## What you can do now

- Compose async work with \`CompletableFuture\` (supplyAsync, thenApply, thenCompose, exceptionally)
- Use virtual threads (\`Executors.newVirtualThreadPerTaskExecutor()\`) for I/O-heavy code
- Know when virtual threads help (I/O) vs hurt (CPU-bound, synchronized-heavy)
- Group related concurrent work with Structured Concurrency
- Use \`AtomicInteger\` / \`LongAdder\` for lock-free counters
- Pick the right tool: virtual threads for many concurrent tasks, CompletableFuture for chaining

Next: **streams and functional Java** — the modern way to transform collections, plus the parallel streams pitfall every interview asks about.
`;

export const JV_L7 = `# Streams and functional Java

Streams arrived in Java 8 and quietly transformed how Java code is written. Instead of explicit loops, you describe **what** you want and let the runtime figure out **how**. Cleaner code, parallel execution for free (sometimes), and a whole new class of interview questions.

## The stream pipeline

A stream is a sequence of values processed through a pipeline of operations:

\`\`\`java
List<String> names = List.of("Alice", "Bob", "Carol", "Dave", "Eve");

String result = names.stream()                       // source
    .filter(n -> n.length() > 3)                     // intermediate (lazy)
    .map(String::toUpperCase)                        // intermediate (lazy)
    .sorted()                                        // intermediate (lazy)
    .collect(Collectors.joining(", "));              // terminal (triggers)

// "ALICE, CAROL, DAVE"
\`\`\`

Three rules:

1. **Intermediate operations** (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`limit\`, \`peek\`) are **lazy** — they don't run until a terminal operation forces them
2. **Terminal operations** (\`collect\`, \`reduce\`, \`count\`, \`forEach\`, \`anyMatch\`, \`findFirst\`) trigger the pipeline and produce a result
3. **A stream is single-use.** After a terminal op, calling another method throws \`IllegalStateException\`. Create a new stream.

## map vs flatMap — the eternal confusion

| | Input → Output | Example |
|---|---------------|---------|
| \`map\` | T → R (one-to-one) | \`stream.map(String::length)\` |
| \`flatMap\` | T → Stream<R> (one-to-many, then flatten) | \`stream.flatMap(List::stream)\` |

When each element produces *multiple* outputs (a list, a stream), use \`flatMap\` to unnest:

\`\`\`java
List<List<String>> nested = List.of(List.of("a","b"), List.of("c"));
List<String> flat = nested.stream()
    .flatMap(List::stream)
    .toList();  // ["a", "b", "c"]
\`\`\`

If you used \`map(List::stream)\` instead, you'd get a \`Stream<Stream<String>>\` — usually not what you want.

## Collectors — the terminal toolkit

\`Collectors\` is a treasure trove for grouping, partitioning, joining:

\`\`\`java
// Group people by city
Map<String, List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::city));

// Count by city
Map<String, Long> countByCity = people.stream()
    .collect(Collectors.groupingBy(Person::city, Collectors.counting()));

// Average age by city
Map<String, Double> avgAgeByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::city,
        Collectors.averagingInt(Person::age)
    ));

// Partition (boolean grouping)
Map<Boolean, List<Person>> adults = people.stream()
    .collect(Collectors.partitioningBy(p -> p.age() >= 18));

// Join into one string
String names = people.stream()
    .map(Person::name)
    .collect(Collectors.joining(", "));
\`\`\`

## Java 16+ shortcut: \`.toList()\`

The old way: \`.collect(Collectors.toList())\`. The new way:

\`\`\`java
List<String> result = names.stream().filter(...).toList();
\`\`\`

Cleaner, and returns an **unmodifiable** list (which is a small but important difference from \`Collectors.toList()\` which returns a mutable one).

## Parallel streams — the interview trap

Adding \`.parallel()\` makes a stream use \`ForkJoinPool.commonPool()\` to process elements in parallel:

\`\`\`java
long count = bigList.parallelStream()
    .filter(this::expensiveCheck)
    .count();
\`\`\`

Sounds magical. **Don't reach for it in production without measuring.** Pitfalls:

1. **Shared pool** — all parallel streams in your JVM use the same \`commonPool\`. One bad stream starves all others.
2. **Order is lost** for unordered operations like \`forEach\` (use \`forEachOrdered\` if you need order)
3. **Overhead** — splitting and merging has cost; only worth it for big collections and expensive per-element work
4. **Side effects break** — modifying shared state from a parallel stream is undefined behavior (races)

Rule of thumb: parallel streams are great for **CPU-bound** transformations over **large** data with **no side effects**. For I/O-bound work, use virtual threads + \`CompletableFuture\`.

## A tricky lazy-evaluation quiz

\`\`\`java-quiz
level: tricky
q: What does this print?
code:
  Stream.of("a", "b", "c", "d")
      .filter(s -> {
        System.out.println("filter: " + s);
        return true;
      })
      .map(s -> {
        System.out.println("map: " + s);
        return s.toUpperCase();
      })
      .findFirst();
options: filter:a, filter:b, ..., map:a, map:b, ... | filter:a, map:a (then stops) | All eight lines printed, then "A" returned | Nothing — no terminal operation
correct: 1
explain: Streams are lazy AND fuse operations. findFirst() pulls one element through the whole pipeline before moving to the next. So: filter(a) → true → map(a) → "A" → findFirst returns. b, c, d are never touched. This fusion is what makes large pipelines fast.
\`\`\`

## Functional interfaces — the core 4

| Interface | Signature | Use |
|-----------|-----------|-----|
| \`Function<T, R>\` | T → R | transform |
| \`Predicate<T>\` | T → boolean | filter |
| \`Consumer<T>\` | T → void | forEach |
| \`Supplier<T>\` | () → T | factory |

Plus variants like \`BiFunction\`, \`BiPredicate\`, \`UnaryOperator\`, \`BinaryOperator\` for two-argument or same-type cases. You'll see these in method signatures everywhere.

## Method references — the ::

\`\`\`java
list.stream().map(String::toUpperCase)        // instance method on each element
list.stream().map(MyClass::staticParse)       // static method
list.stream().map(this::process)              // instance method on captured object
list.stream().map(MyClass::new)               // constructor reference
\`\`\`

Method references are syntactic sugar for the lambda \`x -> x.toUpperCase()\`. Use them when the lambda would just call one method.

## Optional — the right way

\`Optional<T>\` is a wrapper that's either *present* (has a T) or *empty*. Designed to replace \`null\` returns:

\`\`\`java
Optional<User> user = repo.findById(id);
String name = user.map(User::getName).orElse("Anonymous");

// Chain operations
findUser(id)
    .map(User::email)
    .filter(e -> e.endsWith("@company.com"))
    .ifPresent(this::sendEmail);
\`\`\`

**Rules:**
- Use \`Optional\` as a **return type** to signal "might be absent"
- Do NOT use \`Optional\` as a method parameter (just allow null or overload)
- Do NOT use \`Optional\` as an instance field (use null + check)
- Never call \`.get()\` without first checking \`.isPresent()\` — use \`.orElse\`, \`.orElseThrow\`, or \`.ifPresent\`

## What you can do now

- Read a stream pipeline and trace it through filter / map / collect
- Pick \`map\` vs \`flatMap\` correctly
- Use \`Collectors.groupingBy\` for the common BA-style "by category" aggregations
- Avoid parallel streams in production without measurement
- Replace null returns with \`Optional\` (but use it as a return type only)
- Use method references when the lambda is one method call

Next: **modern Java features** — records, sealed classes, pattern matching, text blocks, the things that make Java 21 feel like a different language than Java 8.
`;

export const JV_L8 = `# Modern Java — records, sealed classes, pattern matching

The Java you see in interview questions from 2014 is not the Java you write in 2026. The language has quietly absorbed most of the conveniences people used to leave Java for (Kotlin, Scala, etc.). This lesson covers what's new in Java 17–21 that you should be using right now.

## Records (Java 16+) — immutable value classes in one line

The most-loved Java feature in years. Replaces 50 lines of boilerplate with one:

\`\`\`java
public record Person(String name, int age) {}
\`\`\`

The compiler generates:
- A constructor \`Person(String, int)\`
- Accessor methods \`name()\` and \`age()\` (note: no \`get\` prefix)
- \`equals()\` based on all fields
- \`hashCode()\` consistent with \`equals()\`
- \`toString()\` showing field values
- The class is \`final\` — can't be extended

You can still add methods, validate in a "compact constructor," and add static factories:

\`\`\`java
public record Person(String name, int age) {
  // Compact constructor — runs before the auto-generated field assignment
  public Person {
    if (age < 0) throw new IllegalArgumentException("age must be ≥ 0");
    name = name.trim();   // normalize
  }

  public boolean isAdult() {
    return age >= 18;
  }

  public static Person of(String name, int age) {
    return new Person(name, age);
  }
}
\`\`\`

**Use records for:** DTOs, API responses, value objects, anywhere you need an immutable bag of fields. Don't use for entities with mutable state (use a regular class).

## Sealed classes (Java 17+) — bounded inheritance

A \`sealed\` class restricts which classes can extend it. Combined with pattern matching, this gives you exhaustive switch — a long-awaited Java feature.

\`\`\`java
public sealed interface Shape permits Circle, Square, Triangle {}

public record Circle(double radius) implements Shape {}
public record Square(double side) implements Shape {}
public record Triangle(double base, double height) implements Shape {}
\`\`\`

Now \`Shape\` has exactly three implementations. The compiler knows this — used with pattern matching:

\`\`\`java
double area = switch (shape) {
  case Circle c   -> Math.PI * c.radius() * c.radius();
  case Square s   -> s.side() * s.side();
  case Triangle t -> 0.5 * t.base() * t.height();
  // No default needed! Compiler proves the switch is exhaustive.
};
\`\`\`

If you add a fourth implementation to \`Shape\`, every switch breaks at compile time — you can't accidentally forget a case.

## Pattern matching for switch (Java 21)

Beyond just type matching, you can destructure records and add guards:

\`\`\`java
String describe(Object obj) {
  return switch (obj) {
    case null              -> "nothing";
    case Integer i when i < 0
                          -> "negative integer";
    case Integer i         -> "integer " + i;
    case String s          -> "string of length " + s.length();
    case Person(String n, int a) when a >= 18
                          -> "adult named " + n;
    case Person(String n, int a)
                          -> "minor named " + n;
    default                -> "something else";
  };
}
\`\`\`

Three new tricks:
- **Type patterns** — \`case Integer i\` binds the value
- **Guarded patterns** — \`when ...\` adds a condition
- **Record patterns** — \`case Person(String n, int a)\` destructures
- **Null patterns** — \`case null\` (you can finally switch on null without NPE)

This is THE feature that makes modern Java pleasant for data-shape work.

## Text blocks (Java 15+) — multi-line strings

\`\`\`java
// Old way
String json = "{\\n" +
              "  \\"name\\": \\"Alice\\",\\n" +
              "  \\"age\\": 30\\n" +
              "}";

// Modern way — text block
String json = """
    {
      "name": "Alice",
      "age": 30
    }
    """;
\`\`\`

The leading whitespace is stripped intelligently based on the position of the closing \`"""\`. Embed quotes without escaping. Use them for SQL, JSON, HTML, XML — anything multi-line.

## var (Java 10+) — local type inference

\`\`\`java
var list = new ArrayList<String>();       // ArrayList<String>
var map = new HashMap<String, Person>();  // HashMap<String, Person>

for (var entry : map.entrySet()) {        // Map.Entry<String, Person>
  ...
}
\`\`\`

\`var\` only works for local variables (not fields, not method params, not returns). Use it when the RHS clearly shows the type. Avoid for things like \`var x = getStuff()\` where the return type isn't obvious.

## Enhanced instanceof (Java 16)

\`\`\`java
// Old way
if (obj instanceof String) {
  String s = (String) obj;        // ugly redundant cast
  System.out.println(s.length());
}

// Modern way
if (obj instanceof String s) {
  System.out.println(s.length()); // s is in scope, already cast
}
\`\`\`

Combine with negation:

\`\`\`java
if (!(obj instanceof String s)) return;
// s is in scope here too (flow scoping)
System.out.println(s.length());
\`\`\`

## Stream.toList() (Java 16+)

We already covered this in the streams lesson, but worth re-emphasizing: prefer \`.toList()\` over \`.collect(Collectors.toList())\`. Shorter, returns unmodifiable.

## Sequenced collections (Java 21)

Finally a unified API for "ordered" collections:

\`\`\`java
SequencedCollection<String> list = new ArrayList<>(List.of("a", "b", "c"));
list.getFirst();    // "a"
list.getLast();     // "c"
list.addFirst("z"); // [z, a, b, c]
list.reversed();    // SequencedCollection in reverse order
\`\`\`

Implemented by \`List\`, \`Deque\`, \`LinkedHashSet\`, \`LinkedHashMap\`. No more \`list.get(list.size() - 1)\` to get the last element.

## A modern Java quiz

\`\`\`java-quiz
level: medium
q: What does this print?
code:
  sealed interface Result permits Ok, Err {}
  record Ok(int value) implements Result {}
  record Err(String msg) implements Result {}

  Result r = new Ok(42);
  String s = switch (r) {
    case Ok(int v) when v > 0 -> "positive: " + v;
    case Ok(int v)            -> "zero or negative: " + v;
    case Err(String m)        -> "error: " + m;
  };
  System.out.println(s);
options: positive: 42 | error: 42 | zero or negative: 42 | Compilation error — missing default
correct: 0
explain: Result is sealed (only Ok or Err can implement it), and records destructure cleanly with pattern matching. The first case matches: Ok(42) where 42 > 0. Switch is exhaustive thanks to sealed interface — no default needed. This style is becoming the dominant Java idiom for shape-based code.
\`\`\`

## What you can do now

- Use records for any immutable bag-of-fields
- Use sealed classes/interfaces for closed type hierarchies
- Switch on type + destructure with pattern matching
- Write multi-line strings cleanly with text blocks
- Use \`var\` for obvious local types
- Spot enhanced \`instanceof\` patterns

## You've finished Java Complete

Across eight lessons you've covered: JVM internals, OOP and SOLID, the Collections framework, HashMap internals, classic concurrency, modern concurrency (virtual threads + CompletableFuture), streams, and Java 17–21 features.

This is the working Java toolkit for 2026 — and the answers to every classic interview question. Next steps when you have the appetite:

- **Spring Boot** — the dominant Java framework. Dependency injection, JPA/Hibernate, REST controllers, profiles
- **Build tools** — Maven and Gradle (Gradle is winning on new projects)
- **Testing** — JUnit 5, Mockito, AssertJ, Testcontainers
- **Reactive Java** — Project Reactor (less needed since virtual threads, but still in many shops)
- **Native compilation** — GraalVM, Spring Boot Native, sub-100ms startup

But what you have now is enough to handle most senior Java interviews and most production Java code. Go build something.
`;
