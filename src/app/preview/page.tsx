"use client";

import { useState } from "react";
import {
  Sparkles, Search, BookOpen, Zap, Clock, ChevronRight,
  Brain, Database, Cpu, LayoutDashboard, Map, FlipHorizontal,
  Trophy, Settings, ArrowLeft, Flame, Star, CheckCircle2,
  Play, ChevronLeft, BarChart2, TrendingUp,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// TWO radically different structural concepts
// ─────────────────────────────────────────────────────────────────────────────

type View = "dashboard" | "lesson";
type Concept = "A" | "B";

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT A: "Product"
// Icon rail (no labels) + full-bleed content. Zero sidebar chrome.
// Feels like Figma / Linear / VS Code.
// ─────────────────────────────────────────────────────────────────────────────

const RAIL_ICONS = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Map,             label: "Paths",     active: true  },
  { icon: FlipHorizontal,  label: "Practice",  active: false },
  { icon: Sparkles,        label: "AI Tutor",  active: false },
];

function ConceptA({ view }: { view: View }) {
  return (
    <div style={{ display: "flex", height: "100%", background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>

      {/* Icon rail — 56px, zero labels */}
      <nav style={{
        width: 56, flexShrink: 0,
        background: "#ffffff",
        borderRight: "1px solid #f0f0f0",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        paddingTop: 12, paddingBottom: 12,
        gap: 2,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, flexShrink: 0,
          boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
        }}>
          <Sparkles size={15} color="#fff" />
        </div>

        {RAIL_ICONS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} title={item.label} style={{
              width: 36, height: 36, borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: item.active ? "#f0f0ff" : "transparent",
              color: item.active ? "#6366f1" : "#a0a0a0",
              cursor: "pointer",
              transition: "all 0.12s",
              position: "relative",
            }}>
              <Icon size={17} strokeWidth={item.active ? 2.2 : 1.7} />
              {item.active && (
                <div style={{
                  position: "absolute", left: -1, top: "50%",
                  transform: "translateY(-50%)",
                  width: 3, height: 18, borderRadius: "0 3px 3px 0",
                  background: "#6366f1",
                }} />
              )}
            </div>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff",
        }}>
          S
        </div>
      </nav>

      {/* Full-bleed content */}
      {view === "dashboard" ? <ConceptADashboard /> : <ConceptALesson />}
    </div>
  );
}

function ConceptADashboard() {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#fafafa" }}>

      {/* Hero strip */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        padding: "28px 40px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 12, color: "#a0a0a0", marginBottom: 4, fontWeight: 500, letterSpacing: "0.02em" }}>
            THURSDAY, 22 MAY
          </p>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: "#0a0a0a",
            letterSpacing: "-0.035em", margin: 0,
          }}>
            Good evening, Haril 👋
          </h1>
          <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
            You're on a <strong style={{ color: "#f59e0b" }}>5 day streak</strong> — keep it going.
          </p>
        </div>

        {/* Search — command palette style */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#f5f5f5", border: "1px solid #ebebeb",
          borderRadius: 10, padding: "10px 16px",
          width: 260, cursor: "pointer",
        }}>
          <Search size={14} color="#bbb" />
          <span style={{ fontSize: 13.5, color: "#bbb", flex: 1 }}>Search anything...</span>
          <kbd style={{
            fontSize: 10.5, color: "#ccc",
            background: "#fff", border: "1px solid #e0e0e0",
            borderRadius: 5, padding: "2px 7px",
          }}>⌘K</kbd>
        </div>
      </div>

      <div style={{ padding: "28px 40px", maxWidth: 1100 }}>

        {/* Continue card — big and prominent */}
        <div style={{
          background: "linear-gradient(120deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          borderRadius: 16, padding: "28px 32px",
          display: "flex", alignItems: "center", gap: 28,
          marginBottom: 32,
          boxShadow: "0 8px 40px rgba(99,102,241,0.3)",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Brain size={28} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>
              Continue where you left off
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
              Transformer Architecture
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              LLM Foundations · Lesson 2 of 6 · 20 min left
            </div>
          </div>
          {/* Progress ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="#a5b4fc" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 26 * 0.38} ${2 * Math.PI * 26 * 0.62}`}
                strokeLinecap="round" />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>38%</div>
          </div>
          <div style={{
            background: "#fff", color: "#4338ca",
            padding: "11px 22px", borderRadius: 10,
            fontSize: 13.5, fontWeight: 700,
            cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <Play size={14} /> Resume
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "XP earned",    value: "1,250",  unit: "XP",    icon: <Zap size={16} color="#f59e0b" />,    bg: "#fffbeb", border: "#fde68a" },
            { label: "Day streak",   value: "5",       unit: "days",  icon: <Flame size={16} color="#ef4444" />,   bg: "#fef2f2", border: "#fecaca" },
            { label: "Lessons done", value: "7",       unit: "total", icon: <CheckCircle2 size={16} color="#10b981" />, bg: "#ecfdf5", border: "#a7f3d0" },
            { label: "Accuracy",     value: "84",      unit: "%",     icon: <TrendingUp size={16} color="#6366f1" />, bg: "#f0f0ff", border: "#c7d2fe" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#ffffff", border: "1px solid #f0f0f0",
              borderRadius: 12, padding: "18px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: s.bg, border: `1px solid ${s.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 12,
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value} <span style={{ fontSize: 13, fontWeight: 400, color: "#aaa" }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: "#a0a0a0", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Paths */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.02em", marginBottom: 14 }}>
          Learning paths
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "LLM Foundations",  desc: "Transformers, attention, prompting", icon: <Brain size={20} color="#6366f1" />, color: "#6366f1", bg: "#f0f0ff", progress: 33, lessons: 6, done: 2 },
            { title: "RAG & Vector DBs", desc: "Embeddings, retrieval, evaluation",  icon: <Database size={20} color="#0d9488" />, color: "#0d9488", bg: "#f0fdfa", progress: 0, lessons: 6, done: 0 },
            { title: "AI Agents",        desc: "Tool use, ReAct, multi-agent",       icon: <Cpu size={20} color="#f59e0b" />, color: "#f59e0b", bg: "#fffbeb", progress: 0, lessons: 6, done: 0 },
          ].map((p) => (
            <div key={p.title} style={{
              background: "#ffffff", border: "1px solid #f0f0f0",
              borderRadius: 12, padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 18,
              cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: p.bg, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {p.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0a0a0a", marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: "#aaa" }}>{p.desc} · {p.lessons} lessons</div>
                {p.progress > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 3, background: "#f0f0f0", borderRadius: 99, overflow: "hidden", width: 180 }}>
                      <div style={{ height: "100%", width: `${p.progress}%`, background: p.color, borderRadius: 99 }} />
                    </div>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: "#ccc" }}>{p.done}/{p.lessons} done</div>
                <div style={{
                  marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5,
                  background: p.color, color: "#fff",
                  padding: "6px 14px", borderRadius: 7,
                  fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                }}>
                  {p.done > 0 ? "Continue" : "Start"} <ChevronRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConceptALesson() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: "#ffffff" }}>

      {/* Slim top bar */}
      <div style={{
        padding: "0 40px", height: 48,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#aaa" }}>
          <span style={{ cursor: "pointer" }}>LLM Foundations</span>
          <ChevronRight size={12} />
          <span style={{ color: "#0a0a0a", fontWeight: 500 }}>Transformer Architecture</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#aaa" }}>
          <span>Lesson 2 of 6</span>
          <div style={{ width: 80, height: 3, background: "#f0f0f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "33%", background: "#6366f1", borderRadius: 99 }} />
          </div>
          <span style={{ color: "#6366f1", fontWeight: 600 }}>33%</span>
        </div>
      </div>

      {/* Full-width reading column — centered */}
      <div style={{ flex: 1, overflowY: "auto", padding: "60px 40px 100px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {/* Chapter heading */}
          <div style={{ marginBottom: 52 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f0f0ff", border: "1px solid #c7d2fe",
              padding: "4px 12px", borderRadius: 999, marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#6366f1", letterSpacing: "0.04em" }}>
                LLM FOUNDATIONS · LESSON 2
              </span>
            </div>
            <h1 style={{
              fontSize: 42, fontWeight: 800, color: "#0a0a0a",
              letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 20px",
            }}>
              Transformer Architecture
            </h1>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={13} /> 20 min
              </span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: "#f59e0b",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <Zap size={13} /> +75 XP
              </span>
            </div>
            <div style={{ height: 1, background: "#f0f0f0", marginTop: 28 }} />
          </div>

          {/* Body */}
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 28, letterSpacing: "-0.003em" }}>
            The Transformer replaced every previous architecture in NLP almost overnight.
            Introduced in 2017 with the paper <em style={{ color: "#0a0a0a" }}>"Attention Is All You Need"</em>,
            it discarded recurrence entirely — enabling GPUs to process entire sequences in parallel
            and unlocking models at previously impossible scale.
          </p>

          <h2 style={{
            fontSize: 22, fontWeight: 800, color: "#0a0a0a",
            letterSpacing: "-0.03em", margin: "44px 0 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ display: "inline-block", width: 4, height: 22, background: "#6366f1", borderRadius: 2, flexShrink: 0 }} />
            Self-attention
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 28 }}>
            Instead of processing tokens one at a time, self-attention lets every token look at
            every other token simultaneously. The model learns which words are most relevant
            to each other — <strong style={{ color: "#0a0a0a", background: "#f0f0ff", padding: "1px 5px", borderRadius: 4 }}>regardless of how far apart they are in the sentence.</strong>
          </p>

          {/* Code */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8", marginBottom: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            <div style={{ background: "#0a0a14", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase" }}>python</span>
              <span style={{ fontSize: 11, color: "#555", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 5, cursor: "pointer" }}>Copy</span>
            </div>
            <pre style={{ background: "#0d0d1a", margin: 0, padding: "22px 24px", fontSize: 13.5, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace", color: "#abb2bf", overflowX: "auto" }}>
              <span style={{ color: "#c678dd" }}>import</span>{" torch.nn "}<span style={{ color: "#c678dd" }}>as</span>{" nn\n\n"}
              <span style={{ color: "#7ec8e3" }}>class</span>{" "}<span style={{ color: "#e5c07b" }}>MultiHeadAttention</span>{"(nn.Module):\n"}
              {"    "}<span style={{ color: "#7ec8e3" }}>def</span>{" "}<span style={{ color: "#61afef" }}>forward</span>{"(self, Q, K, V):\n"}
              {"        scores = (Q @ K.transpose(-2,-1)) / math.sqrt(self.d_k)\n"}
              {"        return "}<span style={{ color: "#61afef" }}>softmax</span>{"(scores) @ V"}
            </pre>
          </div>

          {/* Callout */}
          <div style={{
            background: "#f8f8ff", border: "1px solid #e0e0ff",
            borderLeft: "4px solid #6366f1",
            borderRadius: "0 10px 10px 0",
            padding: "18px 22px", marginBottom: 32,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6366f1", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>💡 Interview answer</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>
              <strong style={{ color: "#0a0a0a" }}>Q: "Why transformers over RNNs?"</strong><br />
              Transformers process all tokens in parallel (not sequentially), allowing much larger batch sizes and eliminating vanishing gradients over long sequences.
            </p>
          </div>

        </div>
      </div>

      {/* Floating bottom nav */}
      <div style={{
        position: "sticky", bottom: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #f0f0f0",
        padding: "14px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#aaa" }}>
          <div style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid #e8e8e8",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            color: "#666", fontWeight: 500,
          }}>
            <ChevronLeft size={14} /> Previous
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[1,2,3,4,5,6].map((n) => (
            <div key={n} style={{
              width: n === 2 ? 24 : 8, height: 8, borderRadius: 99,
              background: n === 1 ? "#6366f1" : n === 2 ? "#6366f1" : "#e8e8e8",
              opacity: n === 2 ? 1 : n === 1 ? 0.5 : 1,
              transition: "all 0.2s",
            }} />
          ))}
        </div>
        <div style={{
          padding: "9px 22px", borderRadius: 8,
          background: "#6366f1", color: "#fff",
          fontWeight: 600, fontSize: 13.5,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
          boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
        }}>
          Next: Tokenization <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT B: "Immersive"
// Top nav only, zero sidebar. Dashboard feels like a product home page.
// Lesson = full-screen reading mode, like Medium Premium.
// ─────────────────────────────────────────────────────────────────────────────

function ConceptB({ view }: { view: View }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", background: "#f6f6f4" }}>

      {/* Top nav — compact, everything is here */}
      <header style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0 32px", height: 54, flexShrink: 0, gap: 0,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginRight: 32 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #111, #333)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#111", letterSpacing: "-0.03em" }}>
            AILearn
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 2, flex: 1 }}>
          {[
            { label: "Dashboard", active: view === "dashboard" },
            { label: "Paths", active: false },
            { label: "Practice", active: false },
            { label: "AI Tutor", active: false },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "6px 14px", borderRadius: 7,
              fontSize: 13.5, fontWeight: item.active ? 600 : 400,
              color: item.active ? "#111" : "#888",
              background: item.active ? "#f0f0f0" : "transparent",
              cursor: "pointer",
            }}>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f5f5f5", borderRadius: 8,
            padding: "7px 14px", fontSize: 13, color: "#aaa", cursor: "pointer",
          }}>
            <Search size={13} /> Search <kbd style={{ fontSize: 10, background: "#ebebeb", padding: "1px 5px", borderRadius: 4 }}>⌘K</kbd>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#f5f5f5", borderRadius: 8, padding: "7px 12px",
            fontSize: 12.5, fontWeight: 600, color: "#f59e0b", cursor: "pointer",
          }}>
            <Flame size={13} color="#f59e0b" /> 5
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}>H</div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "dashboard" ? <ConceptBDashboard /> : <ConceptBLesson />}
      </div>
    </div>
  );
}

function ConceptBDashboard() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "#ffffff",
        padding: "48px 64px 40px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{
            fontSize: 36, fontWeight: 900, color: "#111",
            letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 8,
          }}>
            Your learning hub
          </h1>
          <p style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>
            3 paths · 18 lessons · 1,250 XP earned this month
          </p>

          {/* Continue learning — horizontal card */}
          <div style={{
            background: "#0d0d1a",
            borderRadius: 16, padding: "24px 28px",
            display: "flex", alignItems: "center", gap: 24,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Continue learning
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 4 }}>
                Transformer Architecture
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                LLM Foundations · 38% complete · 20 min remaining
              </div>
              {/* Progress bar */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, marginTop: 16, overflow: "hidden", width: 240 }}>
                <div style={{ height: "100%", width: "38%", background: "#818cf8" }} />
              </div>
            </div>
            <div style={{
              background: "#6366f1", color: "#fff",
              padding: "12px 24px", borderRadius: 10,
              fontWeight: 700, fontSize: 14,
              cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
            }}>
              <Play size={15} /> Resume
            </div>
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div style={{ padding: "40px 64px", maxWidth: 960 + 128, margin: "0 auto" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Paths grid */}
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Your paths
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 40 }}>
            {[
              { title: "LLM Foundations",  lessons: 6, done: 2, color: "#6366f1", icon: <Brain size={22} color="#fff" />, gradient: "linear-gradient(135deg,#4338ca,#6366f1)" },
              { title: "RAG & Vector DBs", lessons: 6, done: 0, color: "#0d9488", icon: <Database size={22} color="#fff" />, gradient: "linear-gradient(135deg,#0f766e,#14b8a6)" },
              { title: "AI Agents",        lessons: 6, done: 0, color: "#f59e0b", icon: <Cpu size={22} color="#fff" />, gradient: "linear-gradient(135deg,#b45309,#f59e0b)" },
            ].map((p) => (
              <div key={p.title} style={{
                borderRadius: 14, overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.07)",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}>
                {/* Color header */}
                <div style={{ background: p.gradient, padding: "20px 20px 16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -16, top: -16, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.icon}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 14.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{p.lessons} lessons</div>
                </div>
                {/* Footer */}
                <div style={{ background: "#fff", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{p.done}/{p.lessons} done</div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: p.color,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {p.done > 0 ? "Continue" : "Start"} →
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <BarChart2 size={14} /> THIS WEEK
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
                {[30, 70, 40, 90, 60, 80, 50].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: 4,
                    background: i === 4 ? "#6366f1" : "#f0f0f0",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9.5, color: "#ccc" }}>{d}</div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginBottom: 12 }}>RECENT ACTIVITY</div>
              {[
                { title: "What is an LLM?", time: "2h ago", done: true },
                { title: "Tokenization",    time: "Yesterday", done: true },
                { title: "Quiz: LLM Basics", time: "3 days ago", done: true },
              ].map((a) => (
                <div key={a.title} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span style={{ fontSize: 13, color: "#333", flex: 1 }}>{a.title}</span>
                  <span style={{ fontSize: 11.5, color: "#ccc" }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptBLesson() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100%" }}>
      {/* Full-width lesson header — immersive */}
      <div style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
        padding: "52px 64px 44px",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999, padding: "4px 12px",
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.04em",
            }}>
              LLM FOUNDATIONS
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Lesson 2 of 6</span>
          </div>

          <h1 style={{
            fontSize: 44, fontWeight: 900, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 18,
          }}>
            Transformer Architecture
          </h1>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={12} /> 20 min
            </span>
            <span style={{ fontSize: 13, color: "#fcd34d", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={12} /> +75 XP on completion
            </span>
          </div>

          {/* Reading progress */}
          <div style={{ marginTop: 28, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "42%", background: "rgba(255,255,255,0.8)", borderRadius: 99 }} />
          </div>
        </div>
      </div>

      {/* Body — centered reading column */}
      <div style={{ padding: "56px 64px 120px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 680 }}>

          <p style={{ fontSize: 17.5, lineHeight: 1.85, color: "#444", marginBottom: 28, letterSpacing: "-0.005em" }}>
            The Transformer replaced every previous architecture in NLP almost overnight.
            Introduced in 2017, it discarded recurrence entirely — enabling full parallelisation
            and unlocking models at previously impossible scale.
          </p>

          <h2 style={{
            fontSize: 22, fontWeight: 800, color: "#111",
            letterSpacing: "-0.03em", margin: "44px 0 18px",
          }}>
            How self-attention works
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.85, color: "#444", marginBottom: 28 }}>
            Instead of processing tokens sequentially, self-attention computes relationships
            between <strong style={{ color: "#111" }}>every token pair simultaneously</strong>.
            Three matrices — Query, Key, Value — are learned through training.
          </p>

          {/* Code */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e8", marginBottom: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <div style={{ background: "#0a0a14", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase" }}>python</span>
              <span style={{ fontSize: 11, color: "#555", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 5 }}>Copy</span>
            </div>
            <pre style={{ background: "#0d0d1a", margin: 0, padding: "22px 24px", fontSize: 13.5, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace", color: "#abb2bf", overflowX: "auto" }}>
              {"scores = (Q @ K.transpose(-2,-1)) / math.sqrt(d_k)\n"}
              {"weights = "}<span style={{ color: "#61afef" }}>softmax</span>{"(scores, dim=-1)\n"}
              {"output = weights @ V"}
            </pre>
          </div>

          {/* Callout */}
          <div style={{
            background: "#f8f8ff", border: "1px solid #e0e0ff",
            borderLeft: "4px solid #6366f1",
            borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: 32,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6366f1", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
              💡 Interview answer
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", margin: 0 }}>
              <strong style={{ color: "#111" }}>Q: Why transformers over RNNs?</strong><br />
              Full parallelisation during training. No vanishing gradients. Ability to model
              long-range dependencies directly.
            </p>
          </div>

        </div>
      </div>

      {/* Sticky bottom nav */}
      <div style={{
        position: "sticky", bottom: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "14px 64px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <ChevronLeft size={15} /> What is an LLM?
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[1,2,3,4,5,6].map((n) => (
            <div key={n} style={{ width: n === 2 ? 20 : 7, height: 7, borderRadius: 99, background: n <= 2 ? "#6366f1" : "#e8e8e8", opacity: n === 1 ? 0.4 : 1 }} />
          ))}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#111", color: "#fff",
          padding: "10px 22px", borderRadius: 9,
          fontSize: 13.5, fontWeight: 600, cursor: "pointer",
        }}>
          Tokenization <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root switcher
// ─────────────────────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const [concept, setConcept] = useState<Concept>("A");
  const [view, setView] = useState<View>("dashboard");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#111" }}>

      {/* Chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        background: "#0a0a0a", borderBottom: "1px solid #222",
        padding: "0 20px", height: 50, flexShrink: 0,
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555", marginRight: 24, paddingRight: 24, borderRight: "1px solid #222" }}>
            <ArrowLeft size={13} /> Back
          </div>
        </Link>

        {/* Concept tabs */}
        <div style={{ display: "flex", gap: 4, marginRight: 32 }}>
          {(["A", "B"] as Concept[]).map((c) => (
            <button key={c} onClick={() => setConcept(c)} style={{
              padding: "5px 18px", borderRadius: 7,
              background: concept === c ? "#222" : "transparent",
              border: concept === c ? "1px solid #333" : "1px solid transparent",
              color: concept === c ? "#f0f0f0" : "#555",
              fontSize: 13, fontWeight: concept === c ? 600 : 400,
              cursor: "pointer",
            }}>
              {c === "A" ? "A — Icon rail" : "B — Top nav"}
              <span style={{ marginLeft: 8, fontSize: 11, color: "#555", fontWeight: 400 }}>
                {c === "A" ? "VS Code / Linear feel" : "Medium / Stripe feel"}
              </span>
            </button>
          ))}
        </div>

        {/* View tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["dashboard", "lesson"] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "5px 16px", borderRadius: 7,
              background: view === v ? "#1a1a2e" : "transparent",
              border: view === v ? "1px solid #6366f130" : "1px solid transparent",
              color: view === v ? "#818cf8" : "#555",
              fontSize: 12.5, fontWeight: view === v ? 600 : 400,
              cursor: "pointer",
            }}>
              {v === "dashboard" ? "Dashboard view" : "Lesson view"}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "#444" }}>
          Tell me which structure you prefer → I'll rebuild everything from scratch
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {concept === "A" ? <ConceptA view={view} /> : <ConceptB view={view} />}
      </div>
    </div>
  );
}
