"use client";

import { useMemo, useState } from "react";
import { Plus, X, Hash, RotateCcw, AlertTriangle, TreePine } from "lucide-react";

/**
 * Visual model of how Java's HashMap actually stores entries internally.
 *
 *   - Initial capacity: 16 buckets (the real default since Java 1.0)
 *   - Load factor: 0.75 (when size > capacity × 0.75, double the table)
 *   - TREEIFY_THRESHOLD: 8 (since Java 8, a bucket with ≥8 entries converts
 *     its linked list into a red-black tree to bound worst-case lookup at
 *     O(log n) instead of O(n))
 *   - UNTREEIFY_THRESHOLD: 6 (back to a list when the tree shrinks again)
 *
 * The component uses Java's actual `hash()` algorithm:
 *
 *   static int hash(Object key) {
 *     int h;
 *     return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
 *   }
 *
 * (The XOR with the high 16 bits is HashMap's defense against bad hash
 * functions that don't distribute well in the low bits — a classic
 * interview question.)
 *
 * The bucket index is then `hash & (capacity - 1)`, which only works
 * because capacity is always a power of 2.
 */

interface Entry {
  key: string;
  value: string;
  hash: number;
  bucket: number;
}

const INITIAL_CAPACITY = 16;
const LOAD_FACTOR = 0.75;
const TREEIFY_THRESHOLD = 8;

/** Java's String.hashCode() — exactly the algorithm used in production. */
function javaStringHashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
    h = h | 0; // force int32
  }
  return h;
}

/** HashMap.hash() — XORs upper 16 bits into lower 16 to spread bad hashes */
function hashMapHash(key: string): number {
  const h = javaStringHashCode(key);
  return (h ^ (h >>> 16)) | 0;
}

/** bucket index = hash & (capacity-1) — works because capacity is power of 2 */
function bucketIndex(hash: number, capacity: number): number {
  return (hash & (capacity - 1)) >>> 0;
}

const PRESET_SETS: Record<string, string[]> = {
  default: ["Alice", "Bob", "Carol", "Dave"],
  collisions: ["Aa", "BB", "Bb", "C#", "Dd"],
  growthDemo: ["one", "two", "three", "four", "five", "six", "seven", "eight",
               "nine", "ten", "eleven", "twelve", "thirteen"],
  treeify: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"],
};

export function HashMapVisualizer() {
  const [capacity, setCapacity] = useState(INITIAL_CAPACITY);
  const [entries, setEntries] = useState<Entry[]>(() => buildEntries(PRESET_SETS.default, INITIAL_CAPACITY));
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [resizeNotice, setResizeNotice] = useState<string | null>(null);

  const buckets = useMemo(() => {
    const arr: Entry[][] = Array.from({ length: capacity }, () => []);
    for (const e of entries) {
      const idx = bucketIndex(e.hash, capacity);
      arr[idx].push({ ...e, bucket: idx });
    }
    return arr;
  }, [entries, capacity]);

  const totalSize = entries.length;
  const threshold = Math.floor(capacity * LOAD_FACTOR);
  const maxBucketSize = Math.max(...buckets.map((b) => b.length), 0);
  const treeified = buckets.filter((b) => b.length >= TREEIFY_THRESHOLD).length;

  function add(key: string, value: string) {
    if (!key) return;
    const existing = entries.find((e) => e.key === key);
    let nextEntries: Entry[];
    if (existing) {
      // Same key → update value (HashMap.put semantics: returns old value)
      nextEntries = entries.map((e) => (e.key === key ? { ...e, value } : e));
    } else {
      const h = hashMapHash(key);
      nextEntries = [...entries, { key, value, hash: h, bucket: bucketIndex(h, capacity) }];
    }
    // Check if we need to resize: size > capacity × loadFactor
    if (nextEntries.length > Math.floor(capacity * LOAD_FACTOR)) {
      const newCap = capacity * 2;
      setCapacity(newCap);
      setResizeNotice(`Threshold crossed (${nextEntries.length} > ${Math.floor(capacity * LOAD_FACTOR)}) — resized to ${newCap} buckets, all entries re-hashed.`);
      setTimeout(() => setResizeNotice(null), 4000);
    }
    setEntries(nextEntries);
  }

  function remove(key: string) {
    setEntries((es) => es.filter((e) => e.key !== key));
  }

  function loadPreset(name: keyof typeof PRESET_SETS) {
    let cap = INITIAL_CAPACITY;
    let pool: string[] = PRESET_SETS[name];
    // For growth demo, force re-evaluation since each add triggers resize
    let acc: Entry[] = [];
    for (const k of pool) {
      const h = hashMapHash(k);
      acc.push({ key: k, value: "·", hash: h, bucket: bucketIndex(h, cap) });
      while (acc.length > Math.floor(cap * LOAD_FACTOR)) {
        cap = cap * 2;
      }
    }
    setCapacity(cap);
    setEntries(acc.map((e) => ({ ...e, bucket: bucketIndex(e.hash, cap) })));
  }

  function reset() {
    loadPreset("default");
  }

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
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            <Hash size={15} color="#ea580c" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              HashMap Internals
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
              Watch Java's HashMap distribute, collide, and resize
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(PRESET_SETS).map((name) => (
            <button
              key={name}
              onClick={() => loadPreset(name as keyof typeof PRESET_SETS)}
              style={chipBtn}
            >
              {name}
            </button>
          ))}
          <button onClick={reset} style={{ ...chipBtn, background: "var(--bg-secondary)" }}>
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          padding: "12px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Stat label="size" value={totalSize} />
        <Stat label="capacity" value={capacity} note="always 2ⁿ" />
        <Stat
          label="threshold"
          value={threshold}
          note={`capacity × ${LOAD_FACTOR}`}
          highlight={totalSize > threshold * 0.9}
        />
        <Stat
          label="max bucket"
          value={maxBucketSize}
          note={maxBucketSize >= TREEIFY_THRESHOLD ? "treeified" : "linked list"}
          highlight={maxBucketSize >= TREEIFY_THRESHOLD}
        />
        <Stat label="treeified buckets" value={treeified} />
      </div>

      {/* Add controls */}
      <div style={{ padding: "12px 18px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="key"
          spellCheck={false}
          style={{
            ...inputStyle,
            flex: "1 1 140px",
            fontFamily: "var(--font-mono, monospace)",
          }}
        />
        <input
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="value (optional)"
          spellCheck={false}
          style={{
            ...inputStyle,
            flex: "1 1 140px",
            fontFamily: "var(--font-mono, monospace)",
          }}
        />
        <button
          onClick={() => {
            add(keyInput.trim(), valueInput.trim() || "·");
            setKeyInput("");
            setValueInput("");
          }}
          disabled={!keyInput.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 14px",
            background: keyInput.trim() ? "#ea580c" : "var(--bg-tertiary)",
            color: keyInput.trim() ? "#fff" : "var(--text-tertiary)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: keyInput.trim() ? "pointer" : "not-allowed",
          }}
        >
          <Plus size={12} /> put
        </button>
      </div>

      {resizeNotice && (
        <div
          style={{
            margin: "0 18px 12px",
            padding: "8px 12px",
            background: "color-mix(in srgb, var(--warning) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--warning) 30%, transparent)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--warning)",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <AlertTriangle size={12} /> {resizeNotice}
        </div>
      )}

      {/* Bucket grid */}
      <div style={{ padding: "8px 18px 18px" }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 8,
          }}
        >
          Buckets — hash &amp; (capacity − 1)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(capacity, 8)}, 1fr)`,
            gap: 6,
          }}
        >
          {buckets.map((bucket, i) => {
            const isTree = bucket.length >= TREEIFY_THRESHOLD;
            return (
              <div
                key={i}
                style={{
                  background: bucket.length === 0 ? "var(--bg-secondary)" : "var(--bg-card)",
                  border: `1px solid ${
                    isTree
                      ? "color-mix(in srgb, var(--success) 40%, transparent)"
                      : bucket.length > 1
                      ? "color-mix(in srgb, var(--warning) 30%, transparent)"
                      : "var(--border-subtle)"
                  }`,
                  borderRadius: 8,
                  padding: 6,
                  minHeight: 70,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 9.5,
                    fontFamily: "var(--font-mono, monospace)",
                    color: "var(--text-tertiary)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>[{i}]</span>
                  {isTree && <TreePine size={10} color="var(--success)" />}
                </div>
                {bucket.map((e) => (
                  <button
                    key={e.key}
                    onClick={() => remove(e.key)}
                    title={`hash = ${e.hash} (0x${(e.hash >>> 0).toString(16)})\nbucket = hash & ${capacity - 1} = ${e.bucket}\nClick to remove`}
                    style={{
                      padding: "4px 6px",
                      background: bucket.length > 1
                        ? "color-mix(in srgb, var(--warning) 12%, transparent)"
                        : "color-mix(in srgb, var(--accent) 8%, transparent)",
                      border: `1px solid ${bucket.length > 1 ? "color-mix(in srgb, var(--warning) 30%, transparent)" : "color-mix(in srgb, var(--accent) 20%, transparent)"}`,
                      borderRadius: 5,
                      fontSize: 10.5,
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono, monospace)",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: bucket.length > 1 ? "var(--warning)" : "var(--accent)" }}>
                      {e.key}
                    </span>
                    {e.value !== "·" && (
                      <>
                        <span style={{ color: "var(--text-tertiary)" }}>→</span>
                        <span>{e.value}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend / explainer */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 11.5,
            color: "var(--text-tertiary)",
          }}
        >
          <LegendDot color="var(--accent)" label="Single entry" />
          <LegendDot color="var(--warning)" label="Collision (linked list)" />
          <LegendDot color="var(--success)" label={`≥ ${TREEIFY_THRESHOLD} entries → tree (Java 8+)`} />
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "color-mix(in srgb, #ea580c 6%, transparent)",
            border: "1px solid color-mix(in srgb, #ea580c 18%, transparent)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: "#ea580c" }}>How it works:</strong>{" "}
          Each key is hashed with Java&apos;s <code style={codeInline}>String.hashCode()</code>,
          XOR&apos;d with its upper 16 bits (HashMap&apos;s &quot;spread&quot; trick), then ANDed with{" "}
          <code style={codeInline}>capacity − 1</code> to pick a bucket. Keys that land in
          the same bucket form a <em>linked list</em>. Once a single bucket reaches{" "}
          <strong>{TREEIFY_THRESHOLD}</strong> entries, Java 8+ converts it to a red-black
          tree (worst-case lookup drops from O(n) to O(log n)). When total size exceeds
          capacity × {LOAD_FACTOR}, the table doubles and every entry is re-hashed.
        </div>
      </div>
    </div>
  );
}

function buildEntries(keys: string[], capacity: number): Entry[] {
  return keys.map((k) => {
    const h = hashMapHash(k);
    return { key: k, value: "·", hash: h, bucket: bucketIndex(h, capacity) };
  });
}

function Stat({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string | number;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "8px 12px",
        background: highlight ? "color-mix(in srgb, var(--warning) 8%, transparent)" : "var(--bg-secondary)",
        border: `1px solid ${highlight ? "color-mix(in srgb, var(--warning) 25%, transparent)" : "var(--border-subtle)"}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: highlight ? "var(--warning)" : "var(--text-primary)",
          letterSpacing: "-0.02em",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", marginTop: 2 }}>
        {label}
        {note && <span style={{ marginLeft: 4, fontStyle: "italic" }}>· {note}</span>}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

const chipBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 9px",
  fontSize: 11,
  background: "var(--bg-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 999,
  color: "var(--text-secondary)",
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: 13,
  color: "var(--text-primary)",
  outline: "none",
};

const codeInline: React.CSSProperties = {
  background: "var(--bg-tertiary)",
  padding: "0 4px",
  borderRadius: 3,
  fontSize: 11,
  fontFamily: "var(--font-mono, monospace)",
};
