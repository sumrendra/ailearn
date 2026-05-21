"use client";

import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { Trophy, Zap, ArrowRight, Wand2 } from "lucide-react";

const quizSets = [
  { title: "LLM Fundamentals Quick Check", questions: 5, xp: 100, difficulty: "BEGINNER", tags: ["LLMs", "Transformers"], topic: "LLM Fundamentals" },
  { title: "RAG System Design", questions: 5, xp: 120, difficulty: "INTERMEDIATE", tags: ["RAG", "Embeddings"], topic: "RAG & Vector Search" },
  { title: "Agents & Tool Use", questions: 5, xp: 150, difficulty: "ADVANCED", tags: ["Agents", "ReAct"], topic: "AI Agents" },
  { title: "Prompt Engineering Mastery", questions: 5, xp: 130, difficulty: "INTERMEDIATE", tags: ["Prompting"], topic: "LLM Fundamentals" },
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
          background: "linear-gradient(135deg, var(--accent-light), var(--info-light))",
          border: "1px solid var(--accent)30",
          borderRadius: "var(--radius-lg)", padding: "20px 24px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "var(--bg-card)",
            border: "1.5px solid var(--accent)25",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
            flexShrink: 0,
            animation: "pulse-soft 2.5s infinite",
          }}>
            <Wand2 size={20} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
              Generate a custom quiz with AI
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Pick any lesson and Claude will generate fresh questions tailored to your level.
            </div>
          </div>
          <Link href="/quiz/generate" style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--accent)", color: "#fff",
              padding: "10px 18px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              Generate quiz <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        {/* Quiz sets */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {quizSets.map((q, i) => (
            <Link key={i} href={`/quiz/generate?topic=${encodeURIComponent(q.topic)}&difficulty=${q.difficulty}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)", padding: "20px",
              boxShadow: "var(--shadow-sm)", cursor: "pointer",
              transition: "all 0.12s", height: "100%",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <Trophy size={18} color="var(--xp-gold)" />
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: "2px 8px",
                  color: diffColor[q.difficulty],
                  background: diffColor[q.difficulty] + "18",
                  borderRadius: "var(--radius-full)",
                }}>
                  {diffLabel[q.difficulty]}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.3 }}>
                {q.title}
              </h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {q.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: 11, color: "var(--text-tertiary)",
                    background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                    padding: "2px 7px", borderRadius: "var(--radius-full)",
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{q.questions} questions</span>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: "var(--xp-gold)", display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Zap size={12} /> +{q.xp} XP
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
