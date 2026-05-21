"use client";

import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

const paths = [
  {
    slug: "llm-foundations",
    title: "LLM Foundations",
    description: "Master transformers, attention mechanisms, tokenization, sampling strategies, and how to work with LLMs confidently as an engineer.",
    icon: "🧠",
    color: "#6c47ff",
    colorLight: "#ede9ff",
    difficulty: "BEGINNER",
    estimatedHours: 8,
    lessons: [
      { slug: "what-is-an-llm", title: "What is a Large Language Model?", mins: 15, done: false },
      { slug: "transformers-explained", title: "Transformers explained for engineers", mins: 25, done: false },
      { slug: "tokenization-deep-dive", title: "Tokenization: how text becomes numbers", mins: 20, done: false },
      { slug: "attention-mechanism", title: "Attention is all you need — really", mins: 30, done: false },
      { slug: "temperature-sampling", title: "Temperature, top-p, and sampling", mins: 15, done: false },
      { slug: "context-windows", title: "Context windows and why they matter", mins: 20, done: false },
    ],
  },
  {
    slug: "rag-vector-dbs",
    title: "RAG & Vector Databases",
    description: "Build production-grade RAG pipelines. Learn embeddings, chunking strategies, vector search, and reranking.",
    icon: "🔍",
    color: "#0f766e",
    colorLight: "#ccfbf1",
    difficulty: "INTERMEDIATE",
    estimatedHours: 10,
    lessons: [
      { slug: "what-is-rag", title: "RAG: retrieval-augmented generation", mins: 20, done: false },
      { slug: "embeddings-101", title: "Embeddings: turning text into vectors", mins: 25, done: false },
      { slug: "chunking-strategies", title: "Chunking strategies that actually work", mins: 20, done: false },
      { slug: "vector-db-comparison", title: "pgvector vs Pinecone vs Weaviate", mins: 25, done: false },
      { slug: "reranking", title: "Reranking and hybrid search", mins: 20, done: false },
      { slug: "rag-in-java", title: "Building RAG in Java with Spring AI", mins: 30, done: false },
    ],
  },
  {
    slug: "ai-agents",
    title: "AI Agents & Tool Use",
    description: "Build autonomous agents, implement tool calling, and design reliable agent loops with LangChain, Claude, and OpenAI.",
    icon: "🤖",
    color: "#b45309",
    colorLight: "#fef3c7",
    difficulty: "ADVANCED",
    estimatedHours: 12,
    lessons: [
      { slug: "what-are-agents", title: "What are AI agents?", mins: 15, done: false },
      { slug: "tool-calling", title: "Tool use and function calling", mins: 25, done: false },
      { slug: "react-loop", title: "ReAct: reasoning + acting", mins: 30, done: false },
      { slug: "agent-memory", title: "Agent memory patterns", mins: 25, done: false },
      { slug: "multi-agent", title: "Multi-agent systems", mins: 35, done: false },
      { slug: "langchain-agents", title: "Building agents with LangChain4j", mins: 30, done: false },
    ],
  },
];

const difficultyLabel: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};
const difficultyColor: Record<string, string> = {
  BEGINNER: "var(--beginner)", INTERMEDIATE: "var(--intermediate)", ADVANCED: "var(--advanced)",
};

export default function LearnPage() {
  return (
    <>
      <Topbar title="Learning Paths" subtitle="Structured journeys from foundations to mastery" />
      <div style={{ padding: "24px", maxWidth: 1100, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {paths.map((path) => (
            <div key={path.slug} style={{
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}>
              {/* Path header */}
              <div style={{
                padding: "24px 28px",
                background: path.colorLight,
                display: "flex", alignItems: "flex-start", gap: 16,
              }}>
                <div style={{ fontSize: 36 }}>{path.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: path.color }}>{path.title}</h2>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      color: difficultyColor[path.difficulty],
                      background: difficultyColor[path.difficulty] + "20",
                    }}>
                      {difficultyLabel[path.difficulty]}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 600 }}>
                    {path.description}
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                      <BookOpen size={12} /> {path.lessons.length} lessons
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> ~{path.estimatedHours}h total
                    </span>
                  </div>
                </div>
                <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <div style={{
                    background: path.color, color: "#fff",
                    padding: "10px 18px", borderRadius: "var(--radius-md)",
                    fontSize: 14, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 6,
                    cursor: "pointer",
                  }}>
                    Start path <ArrowRight size={14} />
                  </div>
                </Link>
              </div>

              {/* Lesson list */}
              <div style={{ padding: "0 0 8px" }}>
                {path.lessons.map((lesson, idx) => (
                  <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "12px 28px",
                      borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    >
                      {/* Number circle */}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: lesson.done ? path.color : "var(--bg-tertiary)",
                        border: `2px solid ${lesson.done ? path.color : "var(--border-default)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 600,
                        color: lesson.done ? "#fff" : "var(--text-tertiary)",
                      }}>
                        {lesson.done ? "✓" : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: lesson.done ? 400 : 500 }}>
                          {lesson.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{lesson.mins} min</span>
                        <ArrowRight size={13} color="var(--text-tertiary)" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
