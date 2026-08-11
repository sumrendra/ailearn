"use client";

/**
 * AtlasExplorer — interactive shell around the knowledge-graph canvas.
 *
 * Owns selection + search state and the overlay chrome: search (with result
 * jump-list), the detail panel for the selected node, zoom controls, and the
 * reading legend. Keyboard: `/` search, `+`/`-` zoom, `0` fit, Esc dismiss.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, Clock3, Maximize2, Minus, Plus, Search, X, Zap,
} from "lucide-react";
import type { AtlasGraph, AtlasNode } from "@/lib/map-graph";
import { AtlasCanvas, type AtlasCanvasHandle } from "./AtlasCanvas";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const KIND_LABEL: Record<AtlasNode["kind"], string> = {
  path: "Course",
  lesson: "Lesson",
  hub: "Exam hub",
  module: "Exam module",
};

const STATUS_LABEL = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
} as const;

export function AtlasExplorer({ graph }: { graph: AtlasGraph }) {
  const router = useRouter();
  const canvasRef = useRef<AtlasCanvasHandle>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeResult, setActiveResult] = useState(0);

  const byId = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );
  const selected = selectedId ? byId.get(selectedId) ?? null : null;

  /* Search: every match feeds the canvas highlight; the dropdown lists the
     best few. Course hits rank above lesson hits. */
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const hit = (n: AtlasNode) =>
      n.label.toLowerCase().includes(q) || n.sub.toLowerCase().includes(q);
    const all = graph.nodes.filter(hit);
    const rank = (n: AtlasNode) => (n.kind === "path" || n.kind === "hub" ? 0 : 1);
    all.sort((a, b) => rank(a) - rank(b) || a.label.localeCompare(b.label));
    return all;
  }, [query, graph.nodes]);

  const searchIds = useMemo(
    () => (matches ? new Set(matches.map((n) => n.id)) : null),
    [matches],
  );
  const shownResults = matches?.slice(0, 8) ?? [];

  const jumpTo = useCallback((id: string) => {
    setSelectedId(id);
    setQuery("");
    setActiveResult(0);
    searchInputRef.current?.blur();
    canvasRef.current?.focusNode(id);
  }, []);

  const navigate = useCallback(
    (url: string) => router.push(url),
    [router],
  );

  /* Global keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (typing) return;
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "+" || e.key === "=") {
        canvasRef.current?.zoomBy(1.45);
      } else if (e.key === "-" || e.key === "_") {
        canvasRef.current?.zoomBy(1 / 1.45);
      } else if (e.key === "0") {
        canvasRef.current?.fitView();
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      setActiveResult(0);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveResult((i) => Math.min(i + 1, shownResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveResult((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && shownResults.length > 0) {
      e.preventDefault();
      jumpTo(shownResults[Math.min(activeResult, shownResults.length - 1)].id);
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <AtlasCanvas
        ref={canvasRef}
        nodes={graph.nodes}
        links={graph.links}
        selectedId={selectedId}
        searchIds={searchIds}
        onSelect={setSelectedId}
        onNavigate={navigate}
      />

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          width: "min(300px, calc(100vw - 32px))",
          zIndex: 3,
        }}
      >
        <div
          className="glass-pane"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 10,
            padding: "9px 12px",
          }}
        >
          <Search size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveResult(0);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Find a course or lesson"
            aria-label="Find a course or lesson in the map"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                color: "var(--text-tertiary)", display: "inline-flex", padding: 2,
              }}
            >
              <X size={13} />
            </button>
          ) : (
            <kbd
              style={{
                fontSize: 10.5,
                color: "var(--text-tertiary)",
                background: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                padding: "0px 5px",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              /
            </kbd>
          )}
        </div>

        {matches !== null && (
          <div
            className="glass-pane"
            style={{
              marginTop: 6,
              borderRadius: 10,
              overflow: "hidden",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {shownResults.length === 0 ? (
              <p style={{ padding: "12px 14px", margin: 0, fontSize: 12.5, color: "var(--text-tertiary)" }}>
                Nothing matches “{query.trim()}”. Try a course name or a topic keyword.
              </p>
            ) : (
              shownResults.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => jumpTo(n.id)}
                  onMouseEnter={() => setActiveResult(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "9px 12px",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    background: i === activeResult ? "var(--bg-overlay)" : "transparent",
                    color: "var(--text-primary)",
                    transition: `background 0.12s ${EASE}`,
                  }}
                >
                  <span
                    style={{
                      width: n.kind === "path" || n.kind === "hub" ? 10 : 7,
                      height: n.kind === "path" || n.kind === "hub" ? 10 : 7,
                      borderRadius: "50%",
                      background: n.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block", fontSize: 13, fontWeight: 500,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}
                    >
                      {n.label}
                    </span>
                    {n.kind === "lesson" && (
                      <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>
                        {n.sub}
                      </span>
                    )}
                  </span>
                  <span
                    className="mono-overline"
                    style={{ fontSize: 9, color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    {KIND_LABEL[n.kind]}
                  </span>
                </button>
              ))
            )}
            {matches.length > shownResults.length && (
              <p
                className="hairline-t"
                style={{ padding: "7px 12px", margin: 0, fontSize: 11, color: "var(--text-muted)" }}
              >
                {matches.length - shownResults.length} more highlighted on the map
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Zoom controls ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 2,
        }}
      >
        <ControlButton label="Zoom in" onClick={() => canvasRef.current?.zoomBy(1.45)}>
          <Plus size={14} />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={() => canvasRef.current?.zoomBy(1 / 1.45)}>
          <Minus size={14} />
        </ControlButton>
        <ControlButton label="Fit map to view" onClick={() => canvasRef.current?.fitView()}>
          <Maximize2 size={13} />
        </ControlButton>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div
        className="glass-pane"
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 14,
          borderRadius: 999,
          padding: "7px 14px",
        }}
      >
        <LegendItem label="Course">
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--text-secondary)" }} />
        </LegendItem>
        <LegendItem label="Completed">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-secondary)" }} />
        </LegendItem>
        <LegendItem label="In progress">
          <span
            style={{
              width: 8, height: 8, borderRadius: "50%",
              border: "1.5px solid var(--text-secondary)", background: "transparent",
            }}
          />
        </LegendItem>
        <LegendItem label="Unvisited">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-secondary)", opacity: 0.35 }} />
        </LegendItem>
      </div>

      {/* ── Detail panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass-pane"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: "min(304px, calc(100vw - 32px))",
              maxHeight: "calc(100% - 32px)",
              overflowY: "auto",
              borderRadius: 14,
              padding: 18,
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <span
                className="mono-overline"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--text-tertiary)" }}
              >
                <span
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: selected.color, flexShrink: 0,
                  }}
                />
                {selected.kind === "lesson" && selected.order
                  ? `Lesson ${String(selected.order).padStart(2, "0")}`
                  : KIND_LABEL[selected.kind]}
              </span>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Close details"
                style={{
                  border: "none", background: "transparent", cursor: "pointer",
                  color: "var(--text-tertiary)", display: "inline-flex", padding: 2, marginTop: -2,
                }}
              >
                <X size={14} />
              </button>
            </div>

            <h2
              style={{
                margin: "10px 0 0",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.015em",
                lineHeight: 1.3,
                color: "var(--text-primary)",
              }}
            >
              {selected.label}
            </h2>
            {selected.kind === "lesson" && (
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-tertiary)" }}>
                {selected.sub}
              </p>
            )}

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 13,
                lineHeight: 1.55,
                color: "var(--text-secondary)",
              }}
            >
              {selected.description}
            </p>

            {/* Facts row */}
            {selected.kind === "lesson" ? (
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 14, marginTop: 14,
                  fontFamily: "var(--font-mono)", fontSize: 11.5,
                  color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums",
                }}
              >
                {selected.mins !== undefined && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Clock3 size={11} /> {selected.mins} min
                  </span>
                )}
                {selected.xp !== undefined && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Zap size={11} /> {selected.xp} XP
                  </span>
                )}
                <span
                  style={{
                    color:
                      selected.status === "COMPLETED"
                        ? "var(--success)"
                        : selected.status === "IN_PROGRESS"
                          ? "var(--warning)"
                          : "var(--text-muted)",
                  }}
                >
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
            ) : selected.lessonCount ? (
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex", justifyContent: "space-between", marginBottom: 6,
                    fontFamily: "var(--font-mono)", fontSize: 11.5,
                    color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span>
                    {selected.completedCount ?? 0} of {selected.lessonCount} lessons
                  </span>
                  {selected.difficulty && <span>{selected.difficulty.toLowerCase()}</span>}
                </div>
                <div
                  style={{
                    height: 4, borderRadius: 999, background: "var(--border-subtle)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      width: `${Math.round(((selected.completedCount ?? 0) / selected.lessonCount) * 100)}%`,
                      background: selected.color,
                      transition: `width 0.3s ${EASE}`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            <button
              onClick={() => navigate(selected.url)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                width: "100%",
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: "var(--accent)",
                color: "var(--text-on-accent)",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                boxShadow: "0 4px 14px color-mix(in srgb, var(--accent) 30%, transparent)",
                transition: `background 0.18s ${EASE}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              }}
            >
              {selected.kind === "path" ? "Open course" : selected.kind === "lesson" ? "Open lesson" : "Open"}
              <ArrowUpRight size={14} />
            </button>

            <p style={{ margin: "10px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Double-click any node to open it directly.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Small pieces ───────────────────────────────────────────────────────── */

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick(): void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="glass-pane glow-ring"
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        cursor: "pointer",
        color: "var(--text-secondary)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function LegendItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-flex", width: 12, justifyContent: "center" }}>{children}</span>
      <span style={{ fontSize: 11, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{label}</span>
    </span>
  );
}
