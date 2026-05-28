"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles, Check, X, ArrowRight } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PracticeStage } from "@/components/practice/PracticeStage";
import { Kbd } from "@/components/practice/Kbd";
import { ProgressDots, DotState } from "@/components/practice/ProgressDots";

type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface QuizQuestion {
  type: string;
  question: string;
  options?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  explanation: string;
  difficulty: string;
  tags: string[];
}

const TOPICS = [
  { label: "LLM Fundamentals", value: "What is a Large Language Model? How do transformers work? Key concepts: pre-training, RLHF, inference, context windows, hallucination." },
  { label: "Transformer Architecture", value: "Attention mechanism, Q/K/V, multi-head attention, positional encoding, decoder-only vs encoder-decoder architectures." },
  { label: "Tokenization & Sampling", value: "BPE tokenization, temperature, top-p, top-k sampling, frequency penalties, deterministic output." },
  { label: "RAG & Vector Search", value: "Retrieval-Augmented Generation, embeddings, cosine similarity, HNSW indexing, hybrid search, chunking strategies." },
  { label: "Embeddings & Vector DBs", value: "Text embeddings, pgvector, Pinecone, Weaviate, similarity metrics, dimension tradeoffs, evaluation with RAGAS." },
  { label: "Production RAG", value: "Chunking strategies, cross-encoder reranking, metadata filtering, evaluation metrics, scaling considerations." },
  { label: "AI Agents", value: "Agent architecture, observe-decide-act loop, tool use, chains vs agents, prompt injection risks." },
  { label: "Tool Use & Function Calling", value: "Function calling, JSON schema definitions, parallel tool calls, tool design best practices." },
  { label: "ReAct Framework", value: "Thought-Action-Observation loop, Plan-and-Execute, agent failure modes, debugging agents." },
];

const DIFF_OPTIONS: { label: string; value: Difficulty; desc: string }[] = [
  { label: "Beginner", value: "BEGINNER", desc: "Core concepts" },
  { label: "Intermediate", value: "INTERMEDIATE", desc: "Tradeoffs" },
  { label: "Advanced", value: "ADVANCED", desc: "System design" },
];

/**
 * Quiz stage. Single center card carries the entire flow:
 *   setup → generating → quiz (per-question) → results
 *
 * Per-question keyboard map:
 *   1-4    select an option (or auto-submit for true/false)
 *   Enter  submit selection (or advance after feedback)
 *   S      skip to next question (counts as incorrect)
 *
 * Persistence shape (API contracts) is unchanged — we still POST to
 * /api/quiz/generate with the same body and consume the same response.
 */
export default function QuizGeneratePage() {
  // useSearchParams reads from the streaming search-params bailout in Next 16;
  // wrapping the inner client component in Suspense keeps the route streamable.
  return (
    <Suspense fallback={null}>
      <QuizGenerateInner />
    </Suspense>
  );
}

function QuizGenerateInner() {
  const params = useSearchParams();
  const initialTopic = useMemo(() => {
    const t = params.get("topic");
    return TOPICS.find((x) => x.label === t) ?? TOPICS[0];
  }, [params]);
  const initialDifficulty = useMemo<Difficulty>(() => {
    const d = params.get("difficulty");
    if (d === "BEGINNER" || d === "INTERMEDIATE" || d === "ADVANCED") return d;
    return "INTERMEDIATE";
  }, [params]);

  const [step, setStep] = useState<"setup" | "generating" | "quiz" | "results">("setup");
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);

  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const generate = useCallback(async () => {
    setStep("generating");
    setError(null);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: topic.label,
          lessonContent: topic.value,
          difficulty,
          count: 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate quiz");
      setQuestions(data.questions);
      setCurrent(0);
      setSelected(null);
      setSubmitted(false);
      setAnswers([]);
      setStep("quiz");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong generating the quiz.";
      setError(msg);
      setStep("setup");
    }
  }, [topic, difficulty]);

  const q = questions[current];

  // Coerce every question type into a uniform 4-option model so the keyboard
  // map (1-4) stays consistent. True/False renders as two options. Short-
  // answer is treated as a 1-option "Reveal" interaction.
  const options = useMemo(() => {
    if (!q) return [] as { text: string; isCorrect: boolean }[];
    if ((q.type === "MCQ" || q.type === "SCENARIO") && q.options) return q.options;
    if (q.type === "TRUE_FALSE") {
      const correctIsTrue = q.correctAnswer?.toLowerCase() === "true";
      return [
        { text: "True",  isCorrect: correctIsTrue },
        { text: "False", isCorrect: !correctIsTrue },
      ];
    }
    if (q.type === "SHORT_ANSWER") {
      return [{ text: q.correctAnswer ?? "Reveal model answer", isCorrect: true }];
    }
    return [];
  }, [q]);

  const submit = useCallback(() => {
    if (selected === null || submitted) return;
    const correct = options[selected]?.isCorrect ?? false;
    setAnswers((prev) => [...prev, correct]);
    setSubmitted(true);
  }, [selected, submitted, options]);

  const advance = useCallback(() => {
    if (current >= questions.length - 1) {
      setStep("results");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }, [current, questions.length]);

  const skip = useCallback(() => {
    if (submitted) return;
    setAnswers((prev) => [...prev, false]);
    setSubmitted(true);
  }, [submitted]);

  // Quiz-step keyboard map. We listen on window so the user can drive the
  // whole flow without ever needing the mouse. Skip target inputs/textareas.
  useEffect(() => {
    if (step !== "quiz" || !q) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (e.key >= "1" && e.key <= String(options.length)) {
        e.preventDefault();
        if (!submitted) setSelected(Number(e.key) - 1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (!submitted) submit();
        else advance();
        return;
      }
      if (e.key.toLowerCase() === "s" && !submitted) {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, q, options.length, submitted, submit, advance, skip]);

  // Focus the Next button as soon as feedback shows, so Enter feels natural.
  useEffect(() => {
    if (submitted) nextBtnRef.current?.focus();
  }, [submitted]);

  const score = answers.filter(Boolean).length;

  return (
    <>
      <Topbar title="Quiz" subtitle={topic.label} />

      <div style={{ padding: "12px 16px 0", maxWidth: 760, margin: "0 auto", width: "100%" }}>
        <Link
          href="/quiz"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--text-tertiary)",
          }}
        >
          <ChevronLeft size={14} /> Back to quizzes
        </Link>
      </div>

      {step === "setup" && (
        <PracticeStage
          above={
            <div style={{ textAlign: "center" }}>
              <span className="mono-overline">Configure your quiz</span>
            </div>
          }
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Pick a topic and difficulty.
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>Topic</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {TOPICS.map((t) => {
                const active = topic.label === t.label;
                return (
                  <button
                    key={t.label}
                    onClick={() => setTopic(t)}
                    className="glow-ring"
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      border: "1px solid var(--border-subtle)",
                      outline: active ? "1.5px solid var(--accent)" : undefined,
                      outlineOffset: active ? -1 : undefined,
                      background: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                      color: active ? "var(--accent-text)" : "var(--text-primary)",
                      fontSize: 13,
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>Difficulty</div>
            <div style={{ display: "flex", gap: 8 }}>
              {DIFF_OPTIONS.map((d) => {
                const active = difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className="glow-ring"
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      textAlign: "left",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      border: "1px solid var(--border-subtle)",
                      outline: active ? "1.5px solid var(--accent)" : undefined,
                      outlineOffset: active ? -1 : undefined,
                      background: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: active ? "var(--accent-text)" : "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {d.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{d.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--danger)",
                color: "var(--danger)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={generate}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "13px 22px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Sparkles size={14} /> Generate 5 questions
          </button>
        </PracticeStage>
      )}

      {step === "generating" && (
        <PracticeStage
          above={
            <div style={{ textAlign: "center" }}>
              <span className="mono-overline">Generating · {topic.label}</span>
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              padding: "32px 0 16px",
            }}
          >
            <Loader2 size={32} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                }}
              >
                Writing your quiz…
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Claude is drafting five questions on {topic.label}.
              </div>
            </div>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </PracticeStage>
      )}

      {step === "quiz" && q && (
        <PracticeStage
          above={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <span className="mono-overline">
                Question {current + 1} of {questions.length} · {topic.label}
              </span>
              <ProgressDots
                states={Array.from({ length: questions.length }).map<DotState>((_, i) => {
                  if (i < answers.length) return answers[i] ? "correct" : "incorrect";
                  if (i === current) return "current";
                  return "remaining";
                })}
              />
            </div>
          }
        >
          {/* Question */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.25,
              letterSpacing: "-0.005em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {q.question}
          </h1>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = opt.isCorrect;
              let outline = "1px solid var(--border-subtle)";
              let background = "var(--bg-elevated)";
              let color = "var(--text-primary)";
              let icon: React.ReactNode = null;

              if (!submitted && isSelected) {
                outline = "1.5px solid var(--accent)";
                background = "var(--accent-soft)";
              }
              if (submitted) {
                if (isCorrect) {
                  outline = "1.5px solid var(--success)";
                  color = "var(--text-primary)";
                  icon = <Check size={14} color="var(--success)" />;
                } else if (isSelected) {
                  outline = "1.5px solid var(--danger)";
                  color = "var(--text-secondary)";
                  icon = <X size={14} color="var(--danger)" />;
                } else {
                  color = "var(--text-tertiary)";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (submitted) return;
                    setSelected(idx);
                  }}
                  disabled={submitted}
                  className={!submitted ? "glow-ring" : undefined}
                  style={{
                    padding: "13px 14px",
                    textAlign: "left",
                    background,
                    border: "1px solid transparent",
                    outline,
                    outlineOffset: -1,
                    borderRadius: "var(--radius-md)",
                    cursor: submitted ? "default" : "pointer",
                    fontSize: 14,
                    color,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    fontFamily: "inherit",
                  }}
                >
                  <Kbd tint={isSelected && !submitted ? "var(--accent-text)" : undefined}>{idx + 1}</Kbd>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {submitted && (
            <div
              style={{
                padding: "14px 16px",
                background: "var(--bg-elevated)",
                border: `1px solid ${answers[answers.length - 1] ? "var(--success)" : "var(--danger)"}`,
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: answers[answers.length - 1] ? "var(--success)" : "var(--danger)",
                }}
              >
                {answers[answers.length - 1] ? "Correct" : "Not quite"}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {q.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!submitted ? (
              <>
                <button
                  onClick={submit}
                  disabled={selected === null}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 18px",
                    background: selected === null ? "var(--bg-overlay)" : "var(--accent)",
                    color: selected === null ? "var(--text-tertiary)" : "#fff",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: selected === null ? "not-allowed" : "pointer",
                  }}
                >
                  Submit <Kbd tint="rgba(255,255,255,0.85)">↵</Kbd>
                </button>
                <button
                  onClick={skip}
                  style={{
                    padding: "12px 14px",
                    background: "transparent",
                    color: "var(--text-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 13,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Skip <Kbd>S</Kbd>
                </button>
              </>
            ) : (
              <button
                ref={nextBtnRef}
                onClick={advance}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 18px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {current >= questions.length - 1 ? "See results" : "Next question"}{" "}
                <ArrowRight size={14} /> <Kbd tint="rgba(255,255,255,0.85)">↵</Kbd>
              </button>
            )}
          </div>
        </PracticeStage>
      )}

      {step === "results" && (
        <PracticeStage
          above={
            <div style={{ textAlign: "center" }}>
              <span className="mono-overline">{topic.label}</span>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 8 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 56,
                lineHeight: 1,
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "var(--accent)" }}>{score}</span>
              <span style={{ color: "var(--text-tertiary)" }}> / {questions.length}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {score === questions.length
                ? "Clean sweep."
                : score >= Math.ceil(questions.length * 0.7)
                ? "Solid run."
                : "Worth a second pass."}
            </div>
          </div>

          {/* Per-question recap */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ProgressDots
              states={answers.map<DotState>((a) => (a ? "correct" : "incorrect"))}
            />
          </div>

          <div className="hairline-t" style={{ paddingTop: 16, display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setStep("setup");
                setQuestions([]);
                setAnswers([]);
                setCurrent(0);
                setSelected(null);
                setSubmitted(false);
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Review answers
            </button>
            <button
              onClick={generate}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Take another quiz
            </button>
          </div>
        </PracticeStage>
      )}
    </>
  );
}
