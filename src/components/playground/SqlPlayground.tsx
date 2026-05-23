"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Database, AlertCircle, CheckCircle2, Loader2, Table2, Lightbulb } from "lucide-react";
import { FIXTURES, type FixtureKey } from "@/lib/sql-fixtures";

// PGlite is loaded dynamically on the client to keep it out of the SSR bundle.
// It's ~3MB of WASM — we don't want it on the critical path.
import type { PGlite as PGliteType } from "@electric-sql/pglite";

interface SqlPlaygroundProps {
  /** Which seed schema to load (see src/lib/sql-fixtures.ts). */
  fixture?: FixtureKey;
  /** Pre-filled query shown in the editor. */
  initial?: string;
  /** Hint shown above the editor — "Try changing the WHERE clause", etc. */
  hint?: string;
  /** Suggested next queries — click to load into the editor. */
  challenges?: { label: string; sql: string }[];
}

interface QueryRow {
  [col: string]: unknown;
}

interface QueryResult {
  rows: QueryRow[];
  fields: { name: string }[];
  rowCount: number;
  elapsedMs: number;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Module-level PGlite singleton (one instance per fixture)
 *
 * A page with three playgrounds previously instantiated three full PGlite
 * runtimes (~100MB each = ~300MB total + Next.js + React + Tailwind = OOM
 * territory on consumer browsers). Sharing a single instance per fixture
 * across every <SqlPlayground> on the page cuts that to ~100MB regardless
 * of how many playgrounds the lesson embeds.
 *
 * Two trade-offs to be aware of:
 *  1. Playgrounds that share a fixture share *state* — running INSERT in one
 *     is visible in the next. Acceptable for a teaching tool; arguably a
 *     feature ("see, your data persisted between blocks").
 *  2. "Reset data" re-runs the fixture SQL on the shared instance, so it
 *     resets *all* playgrounds for that fixture simultaneously. Fine — the
 *     fixtures are short and idempotent.
 * ──────────────────────────────────────────────────────────────────────── */

const pgCache = new Map<FixtureKey, Promise<PGliteType>>();

function getSharedPGlite(fixture: FixtureKey): Promise<PGliteType> {
  let promise = pgCache.get(fixture);
  if (!promise) {
    promise = (async () => {
      const mod = await import("@electric-sql/pglite");
      const db = new mod.PGlite();
      await db.waitReady;
      await db.exec(FIXTURES[fixture].sql);
      return db;
    })();
    // If init fails, drop the cache entry so a remount can retry.
    promise.catch(() => pgCache.delete(fixture));
    pgCache.set(fixture, promise);
  }
  return promise;
}

/**
 * In-browser SQL playground powered by PGlite (Postgres compiled to WASM).
 *
 * Why PGlite: real Postgres syntax and semantics — same parser, same
 * optimiser, same NULL three-valued logic — running entirely in the user's
 * browser. No server round-trip, no rate limits, no data leaves the device.
 *
 * Initialization is *lazy*: the WASM runtime only loads when this component
 * scrolls into the viewport. That means a lesson with 5 playgrounds doesn't
 * eagerly download or run anything until the user actually scrolls to one.
 */
export function SqlPlayground({
  fixture = "ecommerce",
  initial = "",
  hint,
  challenges,
}: SqlPlaygroundProps) {
  const fixtureMeta = FIXTURES[fixture];
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<PGliteType | null>(null);

  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "running" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("Tap Run to load Postgres");
  const [query, setQuery] = useState(initial.trim() || `SELECT * FROM ${fixtureMeta.tables[0]} LIMIT 5;`);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // IntersectionObserver: flip `inView` to true the first time the playground
  // enters the viewport. After that we keep it true — once initialized, the
  // shared singleton stays loaded regardless of scroll position.
  useEffect(() => {
    if (!containerRef.current || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }, // pre-load just before scroll reaches it
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [inView]);

  // Once in view, attach to the shared PGlite instance for this fixture.
  useEffect(() => {
    if (!inView || status !== "idle") return;
    let cancelled = false;
    setStatus("loading");
    setStatusMsg("Initializing in-browser Postgres…");
    (async () => {
      try {
        const db = await getSharedPGlite(fixture);
        if (cancelled) return;
        dbRef.current = db;
        setStatus("ready");
        setStatusMsg("Ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setStatusMsg(`Failed to initialize: ${(err as Error).message}`);
        }
      }
    })();
    return () => {
      cancelled = true;
      // Don't close the shared DB on unmount — other playgrounds may still need it.
    };
  }, [inView, fixture, status]);

  const runQuery = async () => {
    if (!dbRef.current || status === "running") return;
    setStatus("running");
    setError(null);
    const start = performance.now();
    try {
      const res = await dbRef.current.query(query);
      const elapsed = Math.round(performance.now() - start);
      setResult({
        rows: res.rows as QueryRow[],
        fields: res.fields,
        rowCount: res.rows.length,
        elapsedMs: elapsed,
      });
      setStatus("ready");
    } catch (err) {
      setError((err as Error).message.replace(/^error: /i, ""));
      setResult(null);
      setStatus("ready");
    }
  };

  const reset = async () => {
    if (!dbRef.current) return;
    setStatus("running");
    setError(null);
    setResult(null);
    try {
      await dbRef.current.exec(fixtureMeta.sql);
      setStatus("ready");
    } catch (err) {
      setError((err as Error).message);
      setStatus("ready");
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl-Enter → run
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
    // Tab → insert two spaces, don't lose focus
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newVal = query.slice(0, start) + "  " + query.slice(end);
      setQuery(newVal);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const tableSchemas = useMemo(() => fixtureMeta.tables, [fixtureMeta]);

  return (
    <div
      ref={containerRef}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        margin: "20px 0",
        fontFamily: "var(--font-sans, inherit)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(29,78,216,0.12)",
              border: "1px solid rgba(29,78,216,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={15} color="#1d4ed8" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.005em" }}>
              SQL Playground
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
              {fixtureMeta.label}
            </div>
          </div>
        </div>

        <StatusPill status={status} message={statusMsg} />
      </div>

      {/* Schema chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          flexWrap: "wrap",
        }}
      >
        <Table2 size={11} color="var(--text-tertiary)" />
        <span style={{ fontSize: 10.5, color: "var(--text-tertiary)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Tables:
        </span>
        {tableSchemas.map((t) => (
          <code
            key={t}
            onClick={() => {
              setQuery(`SELECT * FROM ${t} LIMIT 10;`);
              editorRef.current?.focus();
            }}
            style={{
              fontSize: 11.5,
              padding: "2px 8px",
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              borderRadius: 5,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            {t}
          </code>
        ))}
      </div>

      {/* Hint */}
      {hint && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: "10px 16px",
            background: "var(--accent-light)",
            borderBottom: "1px solid var(--border-subtle)",
            color: "var(--accent-text, var(--accent))",
          }}
        >
          <Lightbulb size={13} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>{hint}</span>
        </div>
      )}

      {/* Editor */}
      <div style={{ position: "relative", background: "var(--bg-card)" }}>
        <textarea
          ref={editorRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: 92,
            maxHeight: 360,
            padding: "14px 16px",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: 13.5,
            lineHeight: 1.55,
            resize: "vertical",
            tabSize: 2,
          }}
          placeholder="Write a SQL query and press Cmd/Ctrl + Enter to run…"
        />
      </div>

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={runQuery}
            disabled={status !== "ready"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: status === "ready" ? "var(--accent)" : "var(--bg-tertiary)",
              color: status === "ready" ? "#fff" : "var(--text-tertiary)",
              border: "none",
              borderRadius: 7,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: status === "ready" ? "pointer" : "not-allowed",
              boxShadow: status === "ready" ? "0 2px 8px rgba(108,71,255,0.25)" : "none",
            }}
          >
            {status === "running" ? <Loader2 size={13} className="spin-slow" /> : <Play size={13} />}
            Run
            <kbd
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                opacity: 0.8,
                padding: "1px 5px",
                background: "rgba(255,255,255,0.18)",
                borderRadius: 3,
                marginLeft: 2,
              }}
            >
              ⌘ ⏎
            </kbd>
          </button>
          <button
            onClick={reset}
            disabled={status === "loading"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 500,
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            <RotateCcw size={12} /> Reset data
          </button>
        </div>

        {result && (
          <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
            <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{result.rowCount}</strong> row{result.rowCount === 1 ? "" : "s"} · {result.elapsedMs}ms
          </div>
        )}
      </div>

      {/* Output */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "color-mix(in srgb, var(--danger) 8%, transparent)",
            borderTop: "1px solid color-mix(in srgb, var(--danger) 22%, transparent)",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            color: "var(--danger)",
          }}
        >
          <AlertCircle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Query error</div>
            <div style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>{error}</div>
          </div>
        </div>
      )}

      {result && !error && (
        <ResultTable result={result} />
      )}

      {/* Challenges */}
      {challenges && challenges.length > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 8,
            }}
          >
            Try these
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {challenges.map((ch, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ch.sql);
                  editorRef.current?.focus();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "left",
                  padding: "8px 10px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 7,
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span>{ch.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function StatusPill({ status, message }: { status: string; message: string }) {
  const palette: Record<string, { bg: string; fg: string; Icon: React.ComponentType<{ size?: number }> }> = {
    idle:    { bg: "var(--bg-tertiary)", fg: "var(--text-tertiary)", Icon: Database },
    loading: { bg: "var(--bg-tertiary)", fg: "var(--text-tertiary)", Icon: Loader2 },
    ready:   { bg: "color-mix(in srgb, var(--success) 10%, transparent)", fg: "var(--success)", Icon: CheckCircle2 },
    running: { bg: "var(--bg-tertiary)", fg: "var(--text-secondary)", Icon: Loader2 },
    error:   { bg: "color-mix(in srgb, var(--danger) 10%, transparent)", fg: "var(--danger)", Icon: AlertCircle },
  };
  const { bg, fg, Icon } = palette[status] ?? palette.loading;
  const isSpinning = status === "loading" || status === "running";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span className={isSpinning ? "spin-slow" : ""} style={{ display: "inline-flex" }}>
        <Icon size={11} />
      </span>
      {message}
    </div>
  );
}

function ResultTable({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) {
    return (
      <div
        style={{
          padding: "20px 16px",
          textAlign: "center",
          color: "var(--text-tertiary)",
          fontSize: 12.5,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        Query ran successfully — 0 rows returned.
      </div>
    );
  }

  const cols = result.fields.map((f) => f.name);

  return (
    <div
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        maxHeight: 360,
        overflow: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            background: "var(--bg-secondary)",
            zIndex: 1,
          }}
        >
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "9px 14px",
                  textAlign: "left",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  borderBottom: "1px solid var(--border-subtle)",
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: i % 2 === 0 ? "transparent" : "var(--bg-secondary)",
              }}
            >
              {cols.map((c) => (
                <td
                  key={c}
                  style={{
                    padding: "9px 14px",
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {renderCell(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(v: unknown): React.ReactNode {
  if (v === null || v === undefined) {
    return (
      <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>NULL</span>
    );
  }
  if (typeof v === "boolean") {
    return v ? "true" : "false";
  }
  if (v instanceof Date) {
    return v.toISOString().slice(0, 10);
  }
  if (typeof v === "object") {
    return JSON.stringify(v);
  }
  return String(v);
}
