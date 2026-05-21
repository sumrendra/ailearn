"use client";

import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { Trophy, Zap, ArrowRight, Wand2, Brain, Database, Cpu, MessageSquare } from "lucide-react";

const quizSets = [
  {
    title: "LLM Fundamentals",
    desc: "Pre-training, RLHF, context windows, and how LLMs actually work.",
    icon: Brain,
    questions: 5,
    xp: 100,
    difficulty: "BEGINNER",
    tags: ["LLMs", "Transformers"],
    topic: "LLM Fundamentals",
    color: "#6c47ff",
    colorLight: "rgba(108, 71, 255, 0.08)",
  },
  {
    title: "RAG & Vector Search",
    desc: "Embeddings, chunking, HNSW indexing, and retrieval-augmented generation.",
    icon: Database,
    questions: 5,
    xp: 120,
    difficulty: "INTERMEDIATE",
    tags: ["RAG", "Embeddings", "pgvector"],
    topic: "RAG & Vector Search",
    color: "#0f766e",
    colorLight: "rgba(15, 118, 110, 0.08)",
  },
  {
    title: "AI Agents & Tool Use",
    desc: "ReAct loops, function calling, agent memory, and multi-agent coordination.",
    icon: Cpu,
    questions: 5,
    xp: 150,
    difficulty: "ADVANCED",
    tags: ["Agents", "ReAct", "Tool calling"],
    topic: "AI Agents",
    color: "#b45309",
    colorLight: "rgba(180, 83, 9, 0.08)",
  },
  {
    title: "Prompt Engineering",
    desc: "Zero-shot, few-shot, chain-of-thought, structured output, and system prompts.",
    icon: MessageSquare,
    questions: 5,
    xp: 130,
    difficulty: "INTERMEDIATE",
    tags: ["Prompting", "CoT"],
    topic: "Prompt Engineering Mastery",
    color: "#1a6bbf",
    colorLight: "rgba(26, 107, 191, 0.08)",
  },
];

const diffColor: Record<string, string> = {
  BEGINNER: "var(--beginner)", INTERMEDIATE: "var(--intermediate)", ADVANCED: "var(--advanced)",
};
const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};

export default function QuizPage() {
  return (
    <>
      <Topbar title="Quizzes" subtitle="AI-generated · Adaptive difficulty · Detailed explanations" />
      <div style={{ padding: "24px", maxWidth: 900, width: "100%" }}>

        {/* AI Generate banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--accent-light) 0%, var(--info-light) 100%)",
          border: "1px solid var(--accent)25",
          borderRadius: "var(--radius-lg)", padding: "20px 24px",
          marginBottom: 28, display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: "var(--bg-card)",
            border: "1.5px solid var(--accent)20",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-sm)", flexShrink: 0,
          }}>
            <Wand2 size={22} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
              Generate a custom quiz with AI
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Pick any topic and difficulty — Claude generates 5 fresh questions with detailed explanations.
            </div>
          </div>
          <Link href="/quiz/generate" style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--accent)", color: "#fff",
              padding: "10px 20px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap",
            }}>
              Build my quiz <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        {/* Section label */}
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: 14 }}>
          Quick-start sets
        </div>

        {/* Quiz sets */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {quizSets.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.title} href={`/quiz/generate?topic=${encodeURIComponent(q.topic)}&difficulty=${q.difficulty}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)", padding: "22px",
                  boxShadow: "var(--shadow-sm)", cursor: "pointer",
                  transition: "all 0.15s", height: "100%", display: "flex", flexDirection: "column",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = q.color + "40";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: q.colorLight,
                      border: `1.5px solid ${q.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={20} color={q.color} />
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: "3px 9px",
                      color: diffColor[q.difficulty],
                      background: diffColor[q.difficulty] + "18",
                      borderRadius: "var(--radius-full)",
                    }}>
                      {diffLabel[q.difficulty]}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                    {q.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
                    {q.desc}
                  </p>

                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {q.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: 11, color: "var(--text-tertiary)",
                        background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                        padding: "2px 7px", borderRadius: "var(--radius-full)",
                      }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      <Trophy size={12} style={{ display: "inline", marginRight: 4, color: "var(--xp-gold)" }} />
                      {q.questions} AI-generated questions
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--xp-gold)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Zap size={12} /> +{q.xp} XP
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
