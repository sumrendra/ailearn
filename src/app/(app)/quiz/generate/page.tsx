"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Zap, ChevronLeft, RotateCcw, Check, X, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

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
  { label: "Beginner", value: "BEGINNER", desc: "Core concepts and definitions" },
  { label: "Intermediate", value: "INTERMEDIATE", desc: "Design choices and tradeoffs" },
  { label: "Advanced", value: "ADVANCED", desc: "System design and edge cases" },
];

export default function QuizGeneratePage() {
  const [step, setStep] = useState<"setup" | "generating" | "quiz" | "results">("setup");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("INTERMEDIATE");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
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
      setShowExplanation(false);
      setAnswers([]);
      setStep("quiz");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong generating the quiz.");
      setStep("setup");
    }
  };

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const isCorrect = q.options?.[idx]?.isCorrect ?? false;
    setAnswers((prev) => [...prev, isCorrect]);
  };

  const handleTrueFalse = (answer: boolean) => {
    if (selected !== null) return;
    setSelected(answer ? 1 : 0);
    setShowExplanation(true);
    const isCorrect = q.correctAnswer?.toLowerCase() === (answer ? "true" : "false");
    setAnswers((prev) => [...prev, isCorrect]);
  };

  const next = () => {
    if (current >= questions.length - 1) {
      setStep("results");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const restart = () => {
    setStep("setup");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
  };

  const score = answers.filter(Boolean).length;

  return (
    <>
      <Topbar title="Generate Quiz" subtitle="AI-generated questions tailored to your topic and level" />
      <div style={{ padding: "24px", maxWidth: 760, width: "100%" }}>

        <Link href="/quiz" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20 }}>
          <ChevronLeft size={14} /> Back to quizzes
        </Link>

        {/* SETUP */}
        {step === "setup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)", padding: "28px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                Configure your quiz
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
                Pick a topic and difficulty. Claude will generate 5 fresh questions with detailed explanations.
              </p>

              {/* Topic selector */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>Topic</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {TOPICS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setTopic(t)}
                      style={{
                        padding: "10px 12px", textAlign: "left",
                        borderRadius: "var(--radius-md)", cursor: "pointer",
                        border: `1.5px solid ${topic.label === t.label ? "var(--accent)" : "var(--border-subtle)"}`,
                        background: topic.label === t.label ? "var(--accent-light)" : "var(--bg-secondary)",
                        fontSize: 13,
                        color: topic.label === t.label ? "var(--accent)" : "var(--text-primary)",
                        fontWeight: topic.label === t.label ? 600 : 400,
                        transition: "all 0.12s",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selector */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>Difficulty</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {DIFF_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      style={{
                        flex: 1, padding: "12px 16px", textAlign: "left",
                        borderRadius: "var(--radius-md)", cursor: "pointer",
                        border: `1.5px solid ${difficulty === d.value ? "var(--accent)" : "var(--border-subtle)"}`,
                        background: difficulty === d.value ? "var(--accent-light)" : "var(--bg-secondary)",
                        transition: "all 0.12s",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: difficulty === d.value ? "var(--accent)" : "var(--text-primary)", marginBottom: 2 }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "12px 16px", borderRadius: "var(--radius-md)",
                  background: "var(--danger-light)", border: "1px solid var(--danger)",
                  color: "var(--danger)", fontSize: 13, marginBottom: 16,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={generate}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "13px 24px", background: "var(--accent)",
                  color: "#fff", border: "none", borderRadius: "var(--radius-md)",
                  fontSize: 15, fontWeight: 500, cursor: "pointer",
                  width: "100%", justifyContent: "center",
                }}
              >
                <Sparkles size={16} />
                Generate 5 questions on {topic.label}
              </button>
            </div>
          </div>
        )}

        {/* GENERATING */}
        {step === "generating" && (
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)", padding: "60px 32px",
            textAlign: "center", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Loader2 size={40} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Generating your quiz…
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Claude is crafting 5 questions on <strong>{topic.label}</strong>
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* QUIZ */}
        {step === "quiz" && q && (
          <div>
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                Question {current + 1} of {questions.length}
              </span>
              <div style={{
                flex: 1, height: 5, background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-full)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${((current) / questions.length) * 100}%`,
                  background: "var(--accent)", transition: "width 0.4s",
                  borderRadius: "var(--radius-full)",
                }} />
              </div>
              <span style={{ fontSize: 12, color: "var(--xp-gold)", fontWeight: 500 }}>
                {answers.filter(Boolean).length}/{answers.length} correct
              </span>
            </div>

            <div style={{
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)", padding: "28px",
              boxShadow: "var(--shadow-sm)",
            }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: "var(--radius-full)",
                  background: "var(--accent-light)", color: "var(--accent)", fontWeight: 500,
                }}>
                  {q.type.replace("_", " ")}
                </span>
                {q.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: "var(--radius-full)",
                    background: "var(--bg-tertiary)", color: "var(--text-tertiary)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Question */}
              <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 24 }}>
                {q.question}
              </p>

              {/* MCQ options */}
              {q.type === "MCQ" && q.options && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt, idx) => {
                    let bg = "var(--bg-secondary)";
                    let border = "var(--border-subtle)";
                    let color = "var(--text-primary)";
                    if (selected !== null) {
                      if (opt.isCorrect) { bg = "var(--success-light)"; border = "var(--success)"; color = "var(--success)"; }
                      else if (idx === selected && !opt.isCorrect) { bg = "var(--danger-light)"; border = "var(--danger)"; color = "var(--danger)"; }
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={selected !== null}
                        style={{
                          padding: "14px 16px", textAlign: "left",
                          background: bg, border: `1.5px solid ${border}`,
                          borderRadius: "var(--radius-md)", cursor: selected === null ? "pointer" : "default",
                          fontSize: 14, color, fontWeight: 400, lineHeight: 1.5,
                          transition: "all 0.15s",
                          display: "flex", alignItems: "flex-start", gap: 10,
                        }}
                      >
                        <span style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: selected !== null && opt.isCorrect ? "var(--success)" : selected === idx ? "var(--danger)" : "var(--bg-tertiary)",
                          border: `2px solid ${selected !== null && opt.isCorrect ? "var(--success)" : selected === idx ? "var(--danger)" : "var(--border-default)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700, color: selected !== null && (opt.isCorrect || idx === selected) ? "#fff" : "var(--text-tertiary)",
                        }}>
                          {selected !== null && opt.isCorrect ? <Check size={12} /> : selected === idx ? <X size={12} /> : String.fromCharCode(65 + idx)}
                        </span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True/False */}
              {q.type === "TRUE_FALSE" && (
                <div style={{ display: "flex", gap: 12 }}>
                  {[true, false].map((val) => {
                    const isCorrect = q.correctAnswer?.toLowerCase() === (val ? "true" : "false");
                    const isSelected = selected !== null && (val ? selected === 1 : selected === 0);
                    let bg = "var(--bg-secondary)";
                    let border = "var(--border-subtle)";
                    if (selected !== null) {
                      if (isCorrect) { bg = "var(--success-light)"; border = "var(--success)"; }
                      else if (isSelected) { bg = "var(--danger-light)"; border = "var(--danger)"; }
                    }
                    return (
                      <button
                        key={String(val)}
                        onClick={() => handleTrueFalse(val)}
                        disabled={selected !== null}
                        style={{
                          flex: 1, padding: "16px",
                          background: bg, border: `1.5px solid ${border}`,
                          borderRadius: "var(--radius-md)", cursor: selected === null ? "pointer" : "default",
                          fontSize: 16, fontWeight: 600,
                          color: selected !== null && isCorrect ? "var(--success)" : selected !== null && isSelected ? "var(--danger)" : "var(--text-primary)",
                          transition: "all 0.15s",
                        }}
                      >
                        {val ? "True" : "False"}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div style={{
                  marginTop: 20, padding: "16px",
                  background: answers[answers.length - 1] ? "var(--success-light)" : "var(--info-light)",
                  border: `1px solid ${answers[answers.length - 1] ? "var(--success)" : "var(--info)"}`,
                  borderRadius: "var(--radius-md)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    {answers[answers.length - 1] ? <Check size={14} color="var(--success)" /> : <X size={14} color="var(--danger)" />}
                    {answers[answers.length - 1] ? "Correct!" : "Not quite"}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {q.explanation}
                  </p>
                </div>
              )}

              {/* Next button */}
              {showExplanation && (
                <button
                  onClick={next}
                  style={{
                    marginTop: 16, width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", background: "var(--accent)", color: "#fff",
                    border: "none", borderRadius: "var(--radius-md)",
                    fontSize: 14, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  {current >= questions.length - 1 ? "See results" : "Next question"}
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)", padding: "48px 32px",
            textAlign: "center", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {score >= 4 ? "🏆" : score >= 3 ? "🎯" : "📚"}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              {score}/{questions.length} correct
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 8 }}>
              {score >= 4 ? "Excellent! You've mastered this topic." : score >= 3 ? "Good work — a few more passes and you'll nail it." : "Keep studying — the tutor can help you fill the gaps."}
            </p>
            <div style={{ fontSize: 14, color: "var(--xp-gold)", fontWeight: 500, marginBottom: 32 }}>
              +{score * 20} XP earned
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={restart}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 20px", background: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
                  fontSize: 14, color: "var(--text-primary)", fontWeight: 500, cursor: "pointer",
                }}
              >
                <RotateCcw size={14} /> Try another quiz
              </button>
              <Link href="/tutor" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 20px", background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-md)",
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                }}>
                  <Sparkles size={14} /> Ask tutor about this topic
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
