"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  Pause,
  Play,
  Square,
  RotateCcw,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { MessageBubble } from "@/components/conversation/MessageBubble";
import { StreamingDots } from "@/components/conversation/StreamingDots";
import { genId } from "@/lib/utils";

/**
 * Mock Interview — Wave 4b redesign.
 *
 * Two-pane layout for the active session:
 *   LEFT (45%): the current question (serif) + a "notes & scratch" mono
 *               textarea where the candidate thinks out loud, with a
 *               "Submit answer" button anchored at the bottom of the pane.
 *   RIGHT (55%): the interviewer's chat stream — questions, the candidate's
 *               submitted answers, feedback, follow-ups.
 *
 * Mobile collapses to single-column (chat stream first, scratch below).
 *
 * API contract preserved: POST /api/interview/chat with
 *   { messages, topic, difficulty } returns { text }.
 */

type Phase = "setup" | "active" | "ended";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  ts: number;
}

const TOPICS = [
  { value: "llm-fundamentals", label: "LLM Fundamentals" },
  { value: "rag-systems", label: "RAG & Vector Systems" },
  { value: "ai-agents", label: "AI Agents & Tool Use" },
  { value: "prompt-engineering", label: "Prompt Engineering" },
  { value: "mlops", label: "MLOps & Production AI" },
  { value: "system-design", label: "AI System Design" },
  { value: "general", label: "General AI Engineering" },
];

const DIFFICULTIES = [
  { value: "BEGINNER", label: "Junior" },
  { value: "INTERMEDIATE", label: "Senior" },
  { value: "ADVANCED", label: "Staff" },
];

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function fmtClock(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Extract the current question from the most recent interviewer message.
 *
 * The interviewer prompt structures its replies as: optional feedback +
 * possibly a [Score: X/10] line + a new question. We take the last
 * non-empty line that ends with "?" as the question. If none, fall back
 * to the whole message.
 */
function extractQuestion(msg: string | undefined): string {
  if (!msg) return "";
  const lines = msg
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^\[Score:/i.test(l));
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].endsWith("?")) {
      // Drop common bold/markdown emphasis.
      return lines[i].replace(/^\*+|\*+$/g, "").replace(/^#+\s*/, "").trim();
    }
  }
  return lines.join(" ").slice(0, 240);
}

export default function InterviewPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [topic, setTopic] = useState("general");
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");

  const [messages, setMessages] = useState<Message[]>([]);
  const [scratch, setScratch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // End-of-session metrics
  const [submittedCount, setSubmittedCount] = useState(0);

  const streamRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Tick the timer.
  useEffect(() => {
    if (phase !== "active" || paused) return;
    timerRef.current = window.setInterval(() => {
      setElapsed((t) => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, paused]);

  // Auto-scroll the chat stream as messages or loading state change.
  useEffect(() => {
    if (!endRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    endRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, loading]);

  const topicLabel = TOPICS.find((t) => t.value === topic)?.label ?? "General";
  const difficultyLabel = DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? "Senior";

  // Send to the interview API.
  const callAPI = useCallback(
    async (msgHistory: Message[]) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/interview/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: msgHistory.map((m) => ({ role: m.role, content: m.content })),
            topic: topicLabel,
            difficulty,
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
        setError("The interviewer couldn't respond. Try resubmitting.");
      } finally {
        setLoading(false);
      }
    },
    [difficulty, topicLabel],
  );

  const startInterview = useCallback(async () => {
    setPhase("active");
    setElapsed(0);
    setPaused(false);
    setSubmittedCount(0);
    setMessages([]);
    setScratch("");
    const opening: Message = {
      role: "user",
      content: `Start the interview. Topic: ${topicLabel}. Difficulty: ${difficulty}.`,
      id: genId(),
      ts: Date.now(),
    };
    // Don't render the opening user message (it's a system kickoff, not the
    // candidate speaking). Send only to the API, then append the first
    // assistant reply.
    await callAPI([opening]);
  }, [callAPI, difficulty, topicLabel]);

  const submitAnswer = useCallback(async () => {
    const text = scratch.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: "user", content: text, id: genId(), ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setScratch("");
    setSubmittedCount((c) => c + 1);
    await callAPI(next);
  }, [callAPI, loading, messages, scratch]);

  const endSession = useCallback(() => {
    setPhase("ended");
    setPaused(true);
  }, []);

  const resetToSetup = useCallback(() => {
    setPhase("setup");
    setMessages([]);
    setScratch("");
    setElapsed(0);
    setPaused(false);
    setSubmittedCount(0);
    setError(null);
  }, []);

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant"),
    [messages],
  );
  const currentQuestion = extractQuestion(lastAssistant?.content);

  /* ── Render ──────────────────────────────────────────────────────────── */

  if (phase === "setup") {
    return (
      <>
        <Topbar
          title="Mock Interview"
          subtitle="AI interviewer · Real questions · Scored feedback"
        />
        <SetupScreen
          topic={topic}
          difficulty={difficulty}
          onTopic={setTopic}
          onDifficulty={setDifficulty}
          onStart={startInterview}
        />
      </>
    );
  }

  if (phase === "ended") {
    return (
      <>
        <Topbar title="Mock Interview" subtitle="Session complete" />
        <EndScreen
          submitted={submittedCount}
          elapsed={elapsed}
          topic={topicLabel}
          difficulty={difficultyLabel}
          onAnother={resetToSetup}
          onReview={() => setPhase("active")}
        />
      </>
    );
  }

  // Active session: two-pane layout.
  return (
    <>
      <Topbar
        title="Mock Interview"
        subtitle={`In session · ${topicLabel}`}
        actions={
          <SessionHeaderActions
            elapsed={elapsed}
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            onEnd={endSession}
          />
        }
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="interview-grid">
          {/* LEFT pane — question + scratch */}
          <section
            className="interview-pane interview-pane--left"
            style={{
              padding: "28px 28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
                Question · Difficulty: {difficultyLabel}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(24px, 2.6vw, 28px)",
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {currentQuestion || (loading ? "Preparing your first question…" : "")}
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                minHeight: 0,
              }}
            >
              <span className="mono-overline" style={{ color: "var(--text-muted)" }}>
                Notes &amp; scratch
              </span>
              <textarea
                value={scratch}
                onChange={(e) => setScratch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                placeholder="Think out loud. Sketch your approach, list tradeoffs, draft pseudocode…"
                style={{
                  flex: 1,
                  minHeight: 240,
                  resize: "vertical",
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: 14,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  outline: "none",
                  boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.03)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Cmd / Ctrl + Enter to submit
              </span>
              <button
                type="button"
                onClick={submitAnswer}
                disabled={loading || scratch.trim().length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  background:
                    loading || scratch.trim().length === 0
                      ? "var(--bg-overlay)"
                      : "var(--accent)",
                  color:
                    loading || scratch.trim().length === 0
                      ? "var(--text-muted)"
                      : "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    loading || scratch.trim().length === 0 ? "not-allowed" : "pointer",
                  boxShadow:
                    loading || scratch.trim().length === 0
                      ? "none"
                      : "0 0 40px var(--accent-glow)",
                  transition: "background 0.18s ease, box-shadow 0.22s ease",
                  fontFamily: "inherit",
                }}
              >
                Submit answer
                <ArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* Divider */}
          <div
            aria-hidden
            className="interview-divider"
            style={{
              width: 1,
              background: "var(--border-subtle)",
            }}
          />

          {/* RIGHT pane — chat stream */}
          <section
            className="interview-pane interview-pane--right"
            style={{
              padding: "28px 28px 24px",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <span
              className="mono-overline"
              style={{ color: "var(--text-tertiary)", marginBottom: 16 }}
            >
              Interviewer · {topicLabel}
            </span>

            <div
              ref={streamRef}
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                paddingBottom: 24,
              }}
            >
              {messages.length === 0 && !loading && (
                <p
                  style={{
                    color: "var(--text-tertiary)",
                    fontSize: 13.5,
                    margin: 0,
                  }}
                >
                  The interviewer will open with the first question shortly.
                </p>
              )}

              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  userInitial="Y"
                  timestamp={fmtTime(m.ts)}
                  assistantLabel="Interviewer"
                />
              ))}

              {loading && <StreamingDots label="Composing" />}

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
                  <AlertCircle
                    size={14}
                    color="var(--danger)"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <span>{error}</span>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .interview-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 45fr 1px 55fr;
        }
        .interview-divider { display: block; }
        @media (max-width: 880px) {
          .interview-grid {
            grid-template-columns: 1fr;
          }
          .interview-divider { display: none; }
          .interview-pane--left { order: 2; border-top: 1px solid var(--border-subtle); }
          .interview-pane--right { order: 1; }
        }
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

/* ── Topbar actions: timer + pause + end ─────────────────────────────────── */

interface SessionHeaderActionsProps {
  elapsed: number;
  paused: boolean;
  onTogglePause: () => void;
  onEnd: () => void;
}

function SessionHeaderActions({
  elapsed,
  paused,
  onTogglePause,
  onEnd,
}: SessionHeaderActionsProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--text-primary)",
          letterSpacing: "0.08em",
          padding: "4px 10px",
          background: "var(--bg-sunken)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          minWidth: 64,
          textAlign: "center",
        }}
        aria-label={`Elapsed time ${fmtClock(elapsed)}`}
      >
        {fmtClock(elapsed)}
      </span>
      <button
        type="button"
        onClick={onTogglePause}
        aria-label={paused ? "Resume session" : "Pause session"}
        title={paused ? "Resume" : "Pause"}
        style={{
          width: 30,
          height: 30,
          borderRadius: "var(--radius-sm)",
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
      </button>
      <button
        type="button"
        onClick={onEnd}
        aria-label="End session"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          background: "transparent",
          border: "1px solid color-mix(in oklch, var(--danger), transparent 60%)",
          color: "var(--danger)",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Square size={11} fill="currentColor" />
        End
      </button>
    </div>
  );
}

/* ── Setup screen ────────────────────────────────────────────────────────── */

interface SetupScreenProps {
  topic: string;
  difficulty: string;
  onTopic: (v: string) => void;
  onDifficulty: (v: string) => void;
  onStart: () => void;
}

function SetupScreen({
  topic,
  difficulty,
  onTopic,
  onDifficulty,
  onStart,
}: SetupScreenProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        padding: "56px 28px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span
            className="mono-overline"
            style={{ color: "var(--text-tertiary)" }}
          >
            Mock interview
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(34px, 4.5vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Pick a topic. Pick a level. Get scored.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 560,
            }}
          >
            A senior AI engineering interviewer will ask one question at a time
            and give you honest, scored feedback after each answer.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="mono-overline" style={{ color: "var(--text-muted)" }}>
            Topic
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 8,
            }}
          >
            {TOPICS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onTopic(t.value)}
                aria-pressed={topic === t.value}
                style={{
                  padding: "10px 14px",
                  background:
                    topic === t.value ? "var(--accent-soft)" : "var(--bg-elevated)",
                  border:
                    topic === t.value
                      ? "1px solid color-mix(in oklch, var(--accent), transparent 55%)"
                      : "1px solid var(--border-subtle)",
                  color:
                    topic === t.value ? "var(--accent-text)" : "var(--text-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "background 0.18s ease, border-color 0.18s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="mono-overline" style={{ color: "var(--text-muted)" }}>
            Difficulty
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => onDifficulty(d.value)}
                aria-pressed={difficulty === d.value}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background:
                    difficulty === d.value
                      ? "var(--accent-soft)"
                      : "var(--bg-elevated)",
                  border:
                    difficulty === d.value
                      ? "1px solid color-mix(in oklch, var(--accent), transparent 55%)"
                      : "1px solid var(--border-subtle)",
                  color:
                    difficulty === d.value
                      ? "var(--accent-text)"
                      : "var(--text-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "14px 18px",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 14.5,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 0 60px var(--accent-glow)",
            fontFamily: "inherit",
          }}
        >
          <Mic size={15} />
          Start session
        </button>
      </div>
    </div>
  );
}

/* ── End-of-session screen ───────────────────────────────────────────────── */

interface EndScreenProps {
  submitted: number;
  elapsed: number;
  topic: string;
  difficulty: string;
  onAnother: () => void;
  onReview: () => void;
}

function EndScreen({
  submitted,
  elapsed,
  topic,
  difficulty,
  onAnother,
  onReview,
}: EndScreenProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        padding: "56px 28px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
            Session complete · {topic} · {difficulty}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(34px, 4.5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Nice run. Here&apos;s what stood out.
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 14,
          }}
        >
          <Metric label="Answers submitted" value={String(submitted)} />
          <Metric label="Time elapsed" value={fmtClock(elapsed)} />
          <Metric
            label="Avg / answer"
            value={submitted > 0 ? fmtClock(Math.round(elapsed / submitted)) : "—"}
          />
        </div>

        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
          }}
        >
          <span
            className="mono-overline"
            style={{ color: "var(--text-tertiary)" }}
          >
            Areas to revisit
          </span>
          <p
            style={{
              marginTop: 10,
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            Scroll back through the session transcript for the interviewer&apos;s
            scored feedback on each answer. Specific topic-recommendation linking
            arrives in a follow-up wave.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onAnother}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 0 40px var(--accent-glow)",
            }}
          >
            <Mic size={14} />
            Practice another topic
          </button>
          <button
            type="button"
            onClick={onReview}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <RotateCcw size={14} />
            Review the session
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span className="mono-overline" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 24,
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
