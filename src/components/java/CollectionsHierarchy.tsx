"use client";

import { useState } from "react";
import { Network, Layers, Lock, Unlock, Hash } from "lucide-react";

type NodeKind = "interface" | "abstract" | "class";
type NodeColor = "interface" | "list" | "set" | "queue" | "map";

interface ClassNode {
  id: string;
  label: string;
  kind: NodeKind;
  color: NodeColor;
  summary: string;
  details: string[];
  /** Big-O complexity table */
  bigO?: { op: string; complexity: string; note?: string }[];
  /** Thread-safe? */
  threadSafe?: "yes" | "no" | "synchronized-wrap";
  /** Real-world use cases */
  useCases?: string[];
  /** Common interview gotcha */
  gotcha?: string;
}

const NODES: ClassNode[] = [
  // Top interfaces
  {
    id: "iterable",
    label: "Iterable<E>",
    kind: "interface",
    color: "interface",
    summary: "The root that gives you for-each.",
    details: [
      "Defines a single method: iterator()",
      "Anything implementing Iterable can be used with for-each loops",
      "Map does NOT implement Iterable — you iterate its entrySet(), keySet(), or values() instead",
    ],
  },
  {
    id: "collection",
    label: "Collection<E>",
    kind: "interface",
    color: "interface",
    summary: "All Lists, Sets, and Queues are Collections.",
    details: [
      "add(), remove(), contains(), size(), isEmpty(), iterator()",
      "All concrete impls (ArrayList, HashSet, etc.) live somewhere below this",
      "Map is famously NOT a Collection",
    ],
  },
  {
    id: "map",
    label: "Map<K,V>",
    kind: "interface",
    color: "map",
    summary: "Key-value store. Not a Collection — separate hierarchy.",
    details: [
      "Key → Value mapping with unique keys",
      "get, put, remove, containsKey, entrySet, keySet, values",
      "Common implementations: HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap",
    ],
  },
  // List
  {
    id: "list",
    label: "List<E>",
    kind: "interface",
    color: "list",
    summary: "Ordered, indexed, duplicates allowed.",
    details: [
      "get(int), set(int, E), add(int, E), indexOf",
      "Insertion order preserved",
      "Most common collection in Java code",
    ],
  },
  {
    id: "arraylist",
    label: "ArrayList<E>",
    kind: "class",
    color: "list",
    summary: "Dynamic array. Fast random access, slow middle inserts.",
    details: [
      "Backed by a resizable Object[]",
      "Initial capacity: 10. Grows by 50% when full (oldCap + oldCap >> 1)",
      "Random access is O(1); inserting at the front is O(n)",
      "NOT thread-safe — wrap in Collections.synchronizedList or use CopyOnWriteArrayList",
    ],
    bigO: [
      { op: "get(i)", complexity: "O(1)" },
      { op: "add(e)", complexity: "O(1) amortized", note: "O(n) when resize" },
      { op: "add(i,e)", complexity: "O(n)", note: "shifts elements" },
      { op: "remove(i)", complexity: "O(n)" },
      { op: "contains(e)", complexity: "O(n)" },
    ],
    threadSafe: "no",
    useCases: ["Default List choice", "Read-heavy lists", "Iteration-heavy code"],
    gotcha: "Calling new ArrayList<>(otherList) gives you a shallow copy — the elements are shared by reference.",
  },
  {
    id: "linkedlist",
    label: "LinkedList<E>",
    kind: "class",
    color: "list",
    summary: "Doubly-linked list. Implements List AND Deque.",
    details: [
      "Each node holds next/prev pointers + value",
      "Fast head/tail operations; slow random access",
      "Not used much anymore — ArrayDeque is faster as a queue, ArrayList as a list",
    ],
    bigO: [
      { op: "get(i)", complexity: "O(n)", note: "walks the list" },
      { op: "add(e)", complexity: "O(1)" },
      { op: "addFirst/Last", complexity: "O(1)" },
      { op: "remove(i)", complexity: "O(n)" },
    ],
    threadSafe: "no",
    useCases: ["Rarely the right choice today", "Implementing LRU cache via removeFirst"],
    gotcha: "Iterating with get(i) inside a for loop is accidentally O(n²). Use the Iterator.",
  },
  // Set
  {
    id: "set",
    label: "Set<E>",
    kind: "interface",
    color: "set",
    summary: "No duplicates. Order varies by implementation.",
    details: [
      "add returns boolean — false if already present",
      "Identity is via equals() + hashCode() contract",
      "Three classics: HashSet (unordered), LinkedHashSet (insertion order), TreeSet (sorted)",
    ],
  },
  {
    id: "hashset",
    label: "HashSet<E>",
    kind: "class",
    color: "set",
    summary: "Backed by a HashMap. Unordered, O(1) operations.",
    details: [
      "Internally just a HashMap<E, Object> with a placeholder value",
      "Iteration order is undefined (and can change between JVM versions)",
      "Add a custom class? Override equals() AND hashCode() or you'll get duplicates",
    ],
    bigO: [
      { op: "add", complexity: "O(1) avg", note: "O(n) worst" },
      { op: "contains", complexity: "O(1) avg" },
      { op: "remove", complexity: "O(1) avg" },
    ],
    threadSafe: "no",
    useCases: ["Membership tests", "Deduplication", "Set algebra"],
    gotcha: "Forgetting to override hashCode() with equals() — two .equals() objects with different hashCode() will both end up in the set as duplicates.",
  },
  {
    id: "linkedhashset",
    label: "LinkedHashSet<E>",
    kind: "class",
    color: "set",
    summary: "HashSet + insertion-order iteration.",
    details: [
      "Extends HashSet, adds a doubly-linked list across all entries",
      "Tiny memory overhead vs HashSet, predictable iteration",
      "Perfect for ordered dedup: keep the first occurrence of each",
    ],
    threadSafe: "no",
  },
  {
    id: "treeset",
    label: "TreeSet<E>",
    kind: "class",
    color: "set",
    summary: "Sorted set, backed by a red-black tree.",
    details: [
      "Elements stored in sorted order (natural or by Comparator)",
      "Supports floor(), ceiling(), higher(), lower(), subSet(), headSet(), tailSet()",
      "Implements NavigableSet",
    ],
    bigO: [
      { op: "add", complexity: "O(log n)" },
      { op: "contains", complexity: "O(log n)" },
      { op: "first/last", complexity: "O(log n)" },
    ],
    threadSafe: "no",
    useCases: ["Sorted iteration", "Range queries (subSet)", "Find-nearest with floor/ceiling"],
  },
  // Queue / Deque
  {
    id: "queue",
    label: "Queue<E>",
    kind: "interface",
    color: "queue",
    summary: "FIFO container — offer, poll, peek.",
    details: [
      "offer (add to tail), poll (remove head), peek (look at head)",
      "Variants throw exception on empty vs return null — poll/peek return null",
    ],
  },
  {
    id: "deque",
    label: "Deque<E>",
    kind: "interface",
    color: "queue",
    summary: "Double-ended queue — add/remove at both ends.",
    details: [
      "Replaces Stack (which is legacy and synchronized — don't use it)",
      "ArrayDeque is the recommended Deque implementation",
    ],
  },
  {
    id: "arraydeque",
    label: "ArrayDeque<E>",
    kind: "class",
    color: "queue",
    summary: "Fast resizable circular array. Use this instead of Stack.",
    details: [
      "Doubles in size when full, no null elements allowed",
      "Both as a Stack (push/pop) and a Queue (offer/poll)",
      "Faster than LinkedList for almost everything",
    ],
    bigO: [
      { op: "push/pop", complexity: "O(1)" },
      { op: "offer/poll", complexity: "O(1)" },
    ],
    threadSafe: "no",
    useCases: ["LIFO stack", "FIFO queue", "Sliding window algorithms"],
    gotcha: "Old code often uses java.util.Stack. ArrayDeque is faster, not synchronized, and the recommended replacement.",
  },
  {
    id: "priorityqueue",
    label: "PriorityQueue<E>",
    kind: "class",
    color: "queue",
    summary: "Min-heap by default. Top = smallest element.",
    details: [
      "Backed by an array as a binary heap",
      "Use Comparator.reverseOrder() for max-heap",
      "iterator() does NOT return elements in sorted order — use poll() repeatedly",
    ],
    bigO: [
      { op: "offer", complexity: "O(log n)" },
      { op: "poll", complexity: "O(log n)" },
      { op: "peek", complexity: "O(1)" },
    ],
    threadSafe: "no",
    useCases: ["Dijkstra's algorithm", "Top-K problems", "Event schedulers"],
  },
  // Maps
  {
    id: "hashmap",
    label: "HashMap<K,V>",
    kind: "class",
    color: "map",
    summary: "The default Map. Hash table + linked-list/tree buckets.",
    details: [
      "Initial capacity 16, load factor 0.75, doubles when threshold crossed",
      "Java 8+: bucket converts to red-black tree at 8 entries (TREEIFY_THRESHOLD)",
      "Allows ONE null key and any number of null values",
      "NOT thread-safe — use ConcurrentHashMap",
    ],
    bigO: [
      { op: "get", complexity: "O(1) avg", note: "O(log n) worst since Java 8" },
      { op: "put", complexity: "O(1) avg" },
    ],
    threadSafe: "no",
    useCases: ["Default Map choice for non-concurrent code", "Caching", "Indexing"],
    gotcha: "Custom keys MUST implement consistent equals() and hashCode(). Mutate a key after putting it and you'll never find it again.",
  },
  {
    id: "linkedhashmap",
    label: "LinkedHashMap<K,V>",
    kind: "class",
    color: "map",
    summary: "HashMap + predictable iteration order.",
    details: [
      "Maintains insertion order (or access order if accessOrder=true)",
      "Pass accessOrder=true and override removeEldestEntry() → instant LRU cache",
    ],
    threadSafe: "no",
    useCases: ["LRU cache", "Order-preserving map", "Predictable JSON output"],
  },
  {
    id: "treemap",
    label: "TreeMap<K,V>",
    kind: "class",
    color: "map",
    summary: "Sorted map. Red-black tree, O(log n) everything.",
    details: [
      "Keys sorted by natural ordering or Comparator",
      "Supports floorKey/ceilingKey/headMap/tailMap/subMap",
      "Implements NavigableMap",
    ],
    bigO: [
      { op: "get", complexity: "O(log n)" },
      { op: "put", complexity: "O(log n)" },
    ],
    threadSafe: "no",
    useCases: ["Range queries", "Sorted iteration", "Time-series with timestamp keys"],
  },
  {
    id: "concurrenthashmap",
    label: "ConcurrentHashMap<K,V>",
    kind: "class",
    color: "map",
    summary: "Thread-safe Map with fine-grained locking.",
    details: [
      "Pre-Java 8: 16 segments, each lockable independently",
      "Java 8+: per-bucket CAS, treeification at 8 entries",
      "Atomic operations: compute, computeIfAbsent, merge, putIfAbsent",
      "Iterator is weakly consistent — won't throw ConcurrentModificationException",
    ],
    bigO: [
      { op: "get", complexity: "O(1) avg" },
      { op: "put", complexity: "O(1) avg" },
    ],
    threadSafe: "yes",
    useCases: ["Multi-threaded caches", "Counters via compute()", "Producer-consumer state"],
    gotcha: "Doesn't allow null keys or null values (HashMap does). Surprise NPE!",
  },
];

const EDGES: Array<{ from: string; to: string; kind: "implements" | "extends" }> = [
  // Top
  { from: "collection", to: "iterable", kind: "extends" },
  // List branch
  { from: "list", to: "collection", kind: "extends" },
  { from: "arraylist", to: "list", kind: "implements" },
  { from: "linkedlist", to: "list", kind: "implements" },
  { from: "linkedlist", to: "deque", kind: "implements" },
  // Set branch
  { from: "set", to: "collection", kind: "extends" },
  { from: "hashset", to: "set", kind: "implements" },
  { from: "linkedhashset", to: "hashset", kind: "extends" },
  { from: "treeset", to: "set", kind: "implements" },
  // Queue / Deque
  { from: "queue", to: "collection", kind: "extends" },
  { from: "deque", to: "queue", kind: "extends" },
  { from: "arraydeque", to: "deque", kind: "implements" },
  { from: "priorityqueue", to: "queue", kind: "implements" },
  // Maps (separate hierarchy)
  { from: "hashmap", to: "map", kind: "implements" },
  { from: "linkedhashmap", to: "hashmap", kind: "extends" },
  { from: "treemap", to: "map", kind: "implements" },
  { from: "concurrenthashmap", to: "map", kind: "implements" },
];

const COLORS: Record<NodeColor, { bg: string; border: string; text: string }> = {
  interface: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.40)", text: "#475569" },
  list:      { bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.40)",  text: "#4338ca" },
  set:       { bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.40)",  text: "#047857" },
  queue:     { bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.40)",  text: "#b45309" },
  map:       { bg: "rgba(234,88,12,0.10)",   border: "rgba(234,88,12,0.40)",   text: "#c2410c" },
};

export function CollectionsHierarchy() {
  const [selectedId, setSelectedId] = useState<string>("hashmap");
  const selected = NODES.find((n) => n.id === selectedId)!;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        margin: "24px 0",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "color-mix(in srgb, #ea580c 12%, transparent)",
            border: "1px solid color-mix(in srgb, #ea580c 25%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Network size={15} color="#ea580c" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            Collections Framework — Class Hierarchy
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
            Click any class to see Big-O, thread safety, use cases, and gotchas
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 0 }}>
        {/* Diagram */}
        <div
          style={{
            padding: 16,
            borderRight: "1px solid var(--border-subtle)",
            overflowX: "auto",
          }}
        >
          <Diagram selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Detail panel */}
        <div style={{ padding: 16, background: "var(--bg-secondary)" }}>
          <DetailPanel node={selected} />
        </div>
      </div>
    </div>
  );
}

/* ── Diagram (tree layout, click-anywhere-to-select) ─────────────────────── */

function Diagram({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  // Tier layout — simple vertical groups, since SVG positioning would be over-engineered here
  const tiers: { label: string; ids: string[] }[] = [
    { label: "Iterable", ids: ["iterable"] },
    { label: "Collection vs Map (separate roots)", ids: ["collection", "map"] },
    { label: "Sub-interfaces", ids: ["list", "set", "queue"] },
    { label: "Deque (extends Queue)", ids: ["deque"] },
    { label: "Concrete classes", ids: ["arraylist", "linkedlist", "hashset", "linkedhashset", "treeset", "arraydeque", "priorityqueue", "hashmap", "linkedhashmap", "treemap", "concurrenthashmap"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 540 }}>
      {tiers.map((tier) => (
        <div key={tier.label}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 6,
            }}
          >
            {tier.label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tier.ids.map((id) => {
              const node = NODES.find((n) => n.id === id)!;
              const c = COLORS[node.color];
              const isSelected = id === selectedId;
              const isAncestor = isAncestorOf(id, selectedId) || isDescendantOf(id, selectedId);
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  style={{
                    padding: "7px 11px",
                    background: isSelected ? c.text : c.bg,
                    color: isSelected ? "#fff" : c.text,
                    border: `1px solid ${isSelected ? c.text : c.border}`,
                    borderRadius: 8,
                    fontSize: 11.5,
                    fontWeight: node.kind === "interface" ? 500 : 600,
                    fontStyle: node.kind === "interface" ? "italic" : "normal",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono, monospace)",
                    transition: "all 0.15s",
                    opacity: isSelected || isAncestor || selectedId === "" ? 1 : 0.55,
                  }}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Visual relationship indicator */}
      <div
        style={{
          marginTop: 6,
          padding: "10px 12px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          fontSize: 11.5,
          color: "var(--text-tertiary)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>Reading this:</strong>{" "}
        <em>italic</em> classes are <strong>interfaces</strong>; bold are <strong>concrete classes</strong>.
        Each concrete class implements the interfaces above it. Map deliberately sits in its own
        hierarchy — it is <em>not</em> a Collection.
      </div>
    </div>
  );
}

function isAncestorOf(maybeAncestor: string, target: string): boolean {
  // Walk edges from target upward
  let cur = target;
  while (cur) {
    if (cur === maybeAncestor) return true;
    const edge = EDGES.find((e) => e.from === cur);
    if (!edge) break;
    cur = edge.to;
  }
  return false;
}

function isDescendantOf(maybeDesc: string, target: string): boolean {
  return isAncestorOf(target, maybeDesc);
}

/* ── Detail panel ────────────────────────────────────────────────────────── */

function DetailPanel({ node }: { node: ClassNode }) {
  const c = COLORS[node.color];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 8px",
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: c.text,
          }}
        >
          {node.kind}
        </span>
        {node.threadSafe && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              background: node.threadSafe === "yes" ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
              border: `1px solid ${node.threadSafe === "yes" ? "color-mix(in srgb, var(--success) 30%, transparent)" : "color-mix(in srgb, var(--danger) 30%, transparent)"}`,
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              color: node.threadSafe === "yes" ? "var(--success)" : "var(--danger)",
            }}
          >
            {node.threadSafe === "yes" ? <Lock size={9} /> : <Unlock size={9} />}
            {node.threadSafe === "yes" ? "thread-safe" : "not thread-safe"}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          fontFamily: "var(--font-mono, monospace)",
          marginBottom: 4,
        }}
      >
        {node.label}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>
        {node.summary}
      </div>

      {/* Details list */}
      <Section icon={<Layers size={11} />} title="Key points">
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {node.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </Section>

      {/* Big-O table */}
      {node.bigO && (
        <Section icon={<Hash size={11} />} title="Time complexity">
          <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}>
            <tbody>
              {node.bigO.map((b, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "4px 8px 4px 0",
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      width: "30%",
                    }}
                  >
                    {b.op}
                  </td>
                  <td
                    style={{
                      padding: "4px 8px",
                      fontFamily: "var(--font-mono, monospace)",
                      color: "var(--accent)",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.complexity}
                  </td>
                  {b.note && (
                    <td style={{ padding: "4px 0", color: "var(--text-tertiary)", fontSize: 11 }}>
                      {b.note}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* Use cases */}
      {node.useCases && (
        <Section title="When to reach for this">
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {node.useCases.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Gotcha */}
      {node.gotcha && (
        <div
          style={{
            marginTop: 12,
            padding: "9px 11px",
            background: "color-mix(in srgb, var(--warning) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--warning) 25%, transparent)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: "var(--warning)" }}>Interview trap:</strong> {node.gotcha}
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: 4,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {icon} {title}
      </div>
      {children}
    </div>
  );
}
