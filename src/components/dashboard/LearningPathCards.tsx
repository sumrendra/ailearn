"use client";

import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Brain, Database, Cpu } from "lucide-react";

const pathIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  "llm-foundations": Brain,
  "rag-vector-dbs": Database,
  "ai-agents": Cpu,
};

const paths = [
  {
    slug: "llm-foundations",
    title: "LLM Foundations",
    description: "Transformers, attention, tokenization, temperature, context windows — everything you need to work with LLMs confidently.",
    icon: "llm-foundations",
    color: "#6c47ff",
    colorLight: "rgba(108, 71, 255, 0.09)",
    difficulty: "BEGINNER",
    estimatedHours: 8,
    lessons: 12,
    progress: 0,
    tags: ["Transformers", "Tokenization", "Prompting"],
  },
  {
    slug: "rag-vector-dbs",
    title: "RAG & Vector Databases",
    description: "Build retrieval-augmented generation systems. pgvector, Chroma, Pinecone, embedding strategies, chunking, and reranking.",
    icon: "rag-vector-dbs",
    color: "#0f766e",
    colorLight: "rgba(15, 118, 110, 0.09)",
    difficulty: "INTERMEDIATE",
    estimatedHours: 10,
    lessons: 14,
    progress: 0,
    tags: ["pgvector", "Embeddings", "Chunking"],
  },
  {
    slug: "ai-agents",
    title: "AI Agents & Tool Use",
    description: "Autonomous agents, tool calling, ReAct loops, LangChain agents, function calling with OpenAI and Claude APIs.",
    icon: "ai-agents",
    color: "#b45309",
    colorLight: "rgba(180, 83, 9, 0.09)",
    difficulty: "ADVANCED",
    estimatedHours: 12,
    lessons: 16,
    progress: 0,
    tags: ["Tool calling", "ReAct", "LangChain"],
  },
];

const difficultyLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const difficultyColor: Record<string, string> = {
  BEGINNER: "var(--beginner)",
  INTERMEDIATE: "var(--intermediate)",
  ADVANCED: "var(--advanced)",
};

export function LearningPathCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {paths.map((path) => (
        <Link key={path.slug} href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
            cursor: "pointer",
            height: "100%",
            transition: "box-shadow 0.15s, transform 0.12s",
            display: "flex", flexDirection: "column",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            {/* Icon + Difficulty */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: path.colorLight,
                border: `1.5px solid ${path.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {(() => {
                  const Icon = pathIcons[path.icon];
                  return Icon ? <Icon size={20} color={path.color} /> : null;
                })()}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: difficultyColor[path.difficulty],
                background: difficultyColor[path.difficulty] + "18",
                padding: "3px 8px", borderRadius: "var(--radius-full)",
              }}>
                {difficultyLabel[path.difficulty]}
              </span>
            </div>

            {/* Title + Desc */}
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
              {path.title}
            </h3>
            <p style={{
              fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
              flex: 1, marginBottom: 14,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {path.description}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {path.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 11, color: "var(--text-tertiary)",
                  background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                  padding: "2px 7px", borderRadius: "var(--radius-full)",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta + Progress */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-tertiary)" }}>
                  <BookOpen size={13} />
                  {path.lessons} lessons
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-tertiary)" }}>
                  <Clock size={13} />
                  ~{path.estimatedHours}h
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  flex: 1, height: 5,
                  background: "var(--bg-tertiary)", borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${path.progress}%`,
                    background: path.color, borderRadius: "var(--radius-full)",
                  }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: path.color, fontSize: 12, fontWeight: 500 }}>
                  Start <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
