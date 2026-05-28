"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Brain,
  Code2,
  Layers,
  Sparkles,
  Workflow,
  X,
  AlertCircle,
} from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { MessageBubble } from "@/components/conversation/MessageBubble";
import { StreamingDots } from "@/components/conversation/StreamingDots";
import { Composer } from "@/components/conversation/Composer";
import { genId } from "@/lib/utils";

/**
 * AI Tutor — Wave 4b redesign.
 *
 * Single-column conversation stream on the canvas. Composer is pinned to
 * the bottom of the viewport. Empty state is a serif headline + a small
 * grid of iconed example prompts. Code blocks inside the assistant's prose
 * are surfaced as artifacts (CodeArtifact). Lesson context is shown as a
 * dismissible chip at the top of the stream when present (?lesson=).
 *
 * API contract preserved: POST /api/tutor/chat with { messages, lessonContext }
 * returns { text }.
 */

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  ts: number;
}

const STARTER_PROMPTS: Array<{ icon: typeof Brain; label: string; prompt: string }> = [
  {
    icon: Brain,
    label: "Explain transformers",
    prompt: "Explain transformers and the attention mechanism, the way you'd explain it to a senior Java engineer who knows distributed systems.",
  },
  {
    icon: Layers,
    label: "Walk me through RAG",
    prompt: "Walk me through how a Retrieval-Augmented Generation system actually works end to end. Use analogies to systems I'd know from a Spring + Kafka stack.",
  },
  {
    icon: Workflow,
    label: "Compare fine-tuning vs prompting",
    prompt: "What's the practical difference between fine-tuning, RAG, and prompt engineering? When would I pick each one?",
  },
  {
    icon: Code2,
    label: "Vector DB tradeoffs",
    prompt: "Compare pgvector, Pinecone, and Weaviate for a Java backend. Latency, cost, operational footprint.",
  },
];

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function TutorPage() {
  return (
    <Suspense fallback={<TutorShell />}>
      <TutorPageInner />
    </Suspense>
  );
}

/**
 * Lightweight skeleton rendered while useSearchParams suspends during a
 * client-side navigation transition. Just the topbar so layout doesn't jump.
 */
function TutorShell() {
  return (
    <Topbar
      title="AI Tutor"
      subtitle="Conversation · Context-aware · Java-developer framing"
    />
  );
}

function TutorPageInner() {
  const params = useSearchParams();
  const lessonParam = params.get("lesson") ?? "";

  // We seed `lessonContext` from ?lesson= but let the user dismiss it. To
  // re-seed when the URL changes we track the last-seen param alongside
  // (avoids the setState-in-effect anti-pattern flagged by lint).
  const [seenParam, setSeenParam] = useState<string>(lessonParam);
  const [dismissed, setDismissed] = useState(false);
  if (lessonParam !== seenParam) {
    // URL changed — adopt new value, clear dismissal.
    setSeenParam(lessonParam);
    setDismissed(false);
  }
  const lessonContext = dismissed ? "" : lessonParam;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Smooth-scroll the new message into view (cross-fade if reduced motion).
  useEffect(() => {
    if (!endRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    endRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, loading]);

  const send = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || loading) return;

      const userMsg: Message = { role: "user", content: text, id: genId(), ts: Date.now() };
      const nextMsgs = [...messages, userMsg];
      setMessages(nextMsgs);
      setInput("");
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/tutor/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
            lessonContext: lessonContext || undefined,
          }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const reply: Message = {
          role: "assistant",
          content: typeof data?.text === "string" ? data.text : "",
          id: genId(),
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, reply]);
      } catch {
        setError("The tutor couldn't respond. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, lessonContext],
  );

  const empty = messages.length === 0 && !loading;

  const lessonChip = useMemo(() => {
    if (!lessonContext) return null;
    // Show the first ~60 chars of context as a title hint.
    const firstLine = lessonContext.split("\n").find((l) => l.trim().length > 0) ?? lessonContext;
    const cleaned = firstLine.replace(/^Lesson:\s*/i, "").trim();
    return cleaned.length > 0 ? cleaned : "Current lesson";
  }, [lessonContext]);

  return (
    <>
      <Topbar
        title="AI Tutor"
        subtitle="Conversation · Context-aware · Java-developer framing"
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Conversation stream — centered, 760px column, with bottom padding
            sized so the pinned composer doesn't overlap the last message. */}
        <div
          ref={streamRef}
          style={{
            flex: 1,
            overflowY: "auto",
            paddingTop: 24,
            paddingBottom: 220, // headroom for the pinned composer + air below
            paddingInline: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 760,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* Lesson context chip */}
            {lessonChip && (
              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px 6px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  maxWidth: "100%",
                }}
              >
                <span
                  className="mono-overline"
                  style={{ color: "var(--text-tertiary)", fontSize: 9.5 }}
                >
                  Discussing
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 360,
                  }}
                >
                  {lessonChip}
                </span>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  aria-label="Drop lesson context"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                    display: "inline-flex",
                    padding: 2,
                    borderRadius: 4,
                  }}
                  title="Drop lesson context"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {empty && <TutorEmptyState onPick={(p) => send(p)} />}

            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                userInitial="Y"
                timestamp={fmtTime(m.ts)}
                assistantLabel="Tutor"
              />
            ))}

            {loading && <StreamingDots label="Thinking" />}

            {error && (
              <div
                role="alert"
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  gap: 10,
                  padding: "10px 14px",
                  background: "color-mix(in oklch, var(--danger), transparent 88%)",
                  border: "1px solid color-mix(in oklch, var(--danger), transparent 60%)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
              >
                <AlertCircle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  {error}{" "}
                  <button
                    type="button"
                    onClick={() => send(messages[messages.length - 1]?.content)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--accent-text)",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                      font: "inherit",
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Pinned composer */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            paddingInline: 24,
            paddingBottom: 24,
            paddingTop: 12,
            display: "flex",
            justifyContent: "center",
            background:
              "linear-gradient(to top, var(--bg-app) 30%, color-mix(in oklch, var(--bg-app), transparent 30%) 70%, transparent)",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "100%", maxWidth: 760, pointerEvents: "auto" }}>
            <Composer
              value={input}
              onChange={setInput}
              onSubmit={() => send()}
              placeholder={
                lessonContext
                  ? "Ask anything about the lesson…"
                  : "Ask anything…"
              }
              disabled={loading}
              autoFocus
              hint={
                <>
                  <span>Enter to send</span>
                  <span>Shift + Enter for new line</span>
                </>
              }
            />
          </div>
        </div>
      </div>

      {/* Cross-fade fallback for reduced-motion; slide-in for everyone else. */}
      <style>{`
        .conversation-message {
          animation: conversation-msg-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes conversation-msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .conversation-message {
            animation: conversation-msg-fade 160ms ease-out;
          }
          @keyframes conversation-msg-fade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */

interface EmptyProps {
  onPick: (prompt: string) => void;
}

function TutorEmptyState({ onPick }: EmptyProps) {
  return (
    <div
      style={{
        paddingTop: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--accent-soft)",
            border: "1px solid color-mix(in oklch, var(--accent), transparent 65%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-text)",
          }}
        >
          <Sparkles size={12} />
        </span>
        <span
          className="mono-overline"
          style={{ color: "var(--text-tertiary)" }}
        >
          Tutor session
        </span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(36px, 5vw, 44px)",
          lineHeight: 1.08,
          letterSpacing: "-0.015em",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        What would you like to learn today?
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        <span className="mono-overline" style={{ color: "var(--text-muted)" }}>
          Or try
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
          }}
        >
          {STARTER_PROMPTS.map(({ icon: Icon, label, prompt }) => (
            <button
              key={label}
              type="button"
              onClick={() => onPick(prompt)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "border-color 0.18s ease, box-shadow 0.22s ease, background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget;
                b.style.borderColor = "var(--accent)";
                b.style.boxShadow = "0 0 40px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget;
                b.style.borderColor = "var(--border-subtle)";
                b.style.boxShadow = "none";
              }}
            >
              <Icon size={14} color="var(--accent-text)" />
              <span style={{ flex: 1 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
