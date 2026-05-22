"use client";

import { useState } from "react";
import {
  LayoutDashboard, BookOpen, FlipHorizontal, Trophy,
  Sparkles, Search, Settings, Clock, Zap, Moon, ArrowLeft,
  CheckCircle2, ChevronRight, Map,
} from "lucide-react";
import Link from "next/link";

// ── Theme definition ──────────────────────────────────────────────────────────

interface Theme {
  id: string;
  name: string;
  tagline: string;

  bgApp: string;
  bgSidebar: string;
  bgContent: string;
  bgCard: string;
  bgCode: string;
  bgInput: string;
  bgActive: string;

  txPrimary: string;
  txSecondary: string;
  txTertiary: string;

  brSubtle: string;
  brDefault: string;

  accent: string;
  accentFg: string;
  accentSoft: string;
  accentGlow: string;

  radius: string;
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  headingTracking: string;
}

// ── 4 Canvas variants ─────────────────────────────────────────────────────────

const THEMES: Theme[] = [
  // ── 1. Slate — crisp, cool, Vercel-docs polish ────────────────────────────
  {
    id: "slate",
    name: "Slate",
    tagline: "Crisp, cool, professional",

    bgApp:     "#f1f5f9",
    bgSidebar: "#ffffff",
    bgContent: "#ffffff",
    bgCard:    "#f8fafc",
    bgCode:    "#0f172a",
    bgInput:   "#f1f5f9",
    bgActive:  "#eff6ff",

    txPrimary:   "#0f172a",
    txSecondary: "#475569",
    txTertiary:  "#94a3b8",

    brSubtle:  "#e2e8f0",
    brDefault: "#cbd5e1",

    accent:     "#2563eb",
    accentFg:   "#ffffff",
    accentSoft: "#dbeafe",
    accentGlow: "rgba(37,99,235,0.2)",

    radius: "8px",
    headingFont: "'Inter', sans-serif",
    bodyFont:    "'Inter', sans-serif",
    headingWeight: 800,
    headingTracking: "-0.03em",
  },

  // ── 2. Warm — cream tones, Craft.do/Linear warmth ─────────────────────────
  {
    id: "warm",
    name: "Warm",
    tagline: "Soft, warm, easy on the eyes",

    bgApp:     "#f7f3ee",
    bgSidebar: "#f0ebe3",
    bgContent: "#faf7f4",
    bgCard:    "#ffffff",
    bgCode:    "#1c1812",
    bgInput:   "#e8e2d9",
    bgActive:  "#fef3c7",

    txPrimary:   "#1c1410",
    txSecondary: "#5c5248",
    txTertiary:  "#a09080",

    brSubtle:  "#e4ddd3",
    brDefault: "#d4ccbf",

    accent:     "#d97706",
    accentFg:   "#ffffff",
    accentSoft: "#fef3c7",
    accentGlow: "rgba(217,119,6,0.25)",

    radius: "10px",
    headingFont: "'Inter', sans-serif",
    bodyFont:    "'Inter', sans-serif",
    headingWeight: 800,
    headingTracking: "-0.03em",
  },

  // ── 3. Editorial — magazine-grade, bold type, teal accent ────────────────
  {
    id: "editorial",
    name: "Editorial",
    tagline: "Bold type, magazine-grade layout",

    bgApp:     "#f9f9f9",
    bgSidebar: "#f3f3f3",
    bgContent: "#ffffff",
    bgCard:    "#fafafa",
    bgCode:    "#111111",
    bgInput:   "#eeeeee",
    bgActive:  "#e6fff9",

    txPrimary:   "#111111",
    txSecondary: "#555555",
    txTertiary:  "#999999",

    brSubtle:  "#e8e8e8",
    brDefault: "#d8d8d8",

    accent:     "#0d9488",
    accentFg:   "#ffffff",
    accentSoft: "#ccfbf1",
    accentGlow: "rgba(13,148,136,0.25)",

    radius: "4px",
    headingFont: "'Georgia', 'Times New Roman', serif",
    bodyFont:    "'Inter', sans-serif",
    headingWeight: 700,
    headingTracking: "-0.02em",
  },

  // ── 4. Arc — pure white, electric violet, high contrast ──────────────────
  {
    id: "arc",
    name: "Arc",
    tagline: "Pure white, high contrast, modern",

    bgApp:     "#fafafa",
    bgSidebar: "#f4f4f5",
    bgContent: "#ffffff",
    bgCard:    "#fafafa",
    bgCode:    "#09090b",
    bgInput:   "#f4f4f5",
    bgActive:  "#f5f3ff",

    txPrimary:   "#09090b",
    txSecondary: "#52525b",
    txTertiary:  "#a1a1aa",

    brSubtle:  "#e4e4e7",
    brDefault: "#d4d4d8",

    accent:     "#7c3aed",
    accentFg:   "#ffffff",
    accentSoft: "#f5f3ff",
    accentGlow: "rgba(124,58,237,0.25)",

    radius: "10px",
    headingFont: "'Inter', sans-serif",
    bodyFont:    "'Inter', sans-serif",
    headingWeight: 800,
    headingTracking: "-0.035em",
  },
];

// ── Sample data ────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Learn",
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Map,             label: "Paths" },
      { icon: BookOpen,        label: "Lessons",  active: true },
    ],
  },
  {
    label: "Practice",
    items: [
      { icon: FlipHorizontal, label: "Flashcards" },
      { icon: Trophy,         label: "Quizzes" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: Sparkles, label: "AI Tutor", badge: "AI" },
      { icon: Search,   label: "Search" },
    ],
  },
];

const LESSON_LIST = [
  { n: 1, title: "What is an LLM?",           done: true,  active: false },
  { n: 2, title: "Transformer Architecture",  done: false, active: true  },
  { n: 3, title: "Tokenization",              done: false, active: false },
  { n: 4, title: "Attention Mechanism",       done: false, active: false },
  { n: 5, title: "Context Windows",           done: false, active: false },
  { n: 6, title: "Prompt Engineering",        done: false, active: false },
];

const BULLETS = [
  "Each token is predicted from all preceding tokens using learned probabilities",
  "Self-attention computes relationships between every pair of tokens in the sequence",
  "Position encodings give the model a sense of word order in the sequence",
  "Layer normalisation stabilises training across thousands of gradient steps",
];

// ── Theme preview shell ───────────────────────────────────────────────────────

function Preview({ t }: { t: Theme }) {
  return (
    <div style={{
      display: "flex", height: "100%", overflow: "hidden",
      fontFamily: t.bodyFont,
      background: t.bgApp,
    }}>

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside style={{
        width: 232, flexShrink: 0,
        background: t.bgSidebar,
        borderRight: `1px solid ${t.brSubtle}`,
        display: "flex", flexDirection: "column",
        height: "100%", overflowY: "auto",
      }}>

        {/* Logo */}
        <div style={{
          padding: "16px 16px 14px",
          borderBottom: `1px solid ${t.brSubtle}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: t.radius,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${t.accentGlow}`,
              flexShrink: 0,
            }}>
              <Sparkles size={15} color={t.accentFg} />
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: t.txPrimary, lineHeight: 1,
                fontFamily: t.headingFont,
                letterSpacing: "-0.02em",
              }}>
                AILearn
              </div>
              <div style={{ fontSize: 10.5, color: t.txTertiary, marginTop: 2 }}>
                Master AI engineering
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 10px" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em",
                color: t.txTertiary, textTransform: "uppercase",
                padding: "8px 8px 4px",
              }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = "active" in item && item.active;
                return (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 9px", borderRadius: t.radius,
                    marginBottom: 1,
                    background: active ? t.bgActive : "transparent",
                    color: active ? t.accent : t.txSecondary,
                    fontWeight: active ? 600 : 400,
                    fontSize: 13.5, cursor: "pointer",
                    borderLeft: active ? `2px solid ${t.accent}` : "2px solid transparent",
                  }}>
                    <Icon size={15} strokeWidth={active ? 2.2 : 1.7} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: t.accent, color: t.accentFg,
                        padding: "1px 5px", borderRadius: 3,
                        letterSpacing: "0.04em",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div style={{ padding: "8px 10px 14px", borderTop: `1px solid ${t.brSubtle}` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "7px 9px", borderRadius: t.radius,
            color: t.txTertiary, fontSize: 13.5, cursor: "pointer",
          }}>
            <Settings size={15} strokeWidth={1.7} />
            Settings
          </div>
        </div>
      </aside>

      {/* ── Lesson sidebar (path outline) ──────────────────────────────── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: t.bgContent,
        borderRight: `1px solid ${t.brSubtle}`,
        display: "flex", flexDirection: "column",
        height: "100%", overflowY: "auto",
      }}>

        {/* Path header */}
        <div style={{
          padding: "14px 16px 12px",
          borderBottom: `1px solid ${t.brSubtle}`,
          background: t.accentSoft,
        }}>
          <div style={{
            fontSize: 9.5, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: t.accent, marginBottom: 4,
          }}>
            Learning path
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.txPrimary, marginBottom: 10 }}>
            LLM Foundations
          </div>
          {/* Progress */}
          <div style={{ fontSize: 10, color: t.txTertiary, marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
            <span>1 of 6 done</span>
            <span style={{ color: t.accent, fontWeight: 600 }}>17%</span>
          </div>
          <div style={{ height: 4, background: t.brSubtle, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "17%", background: t.accent, borderRadius: 999 }} />
          </div>
        </div>

        {/* Lesson list */}
        {LESSON_LIST.map((l) => (
          <div key={l.n} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px",
            background: l.active ? t.bgActive : "transparent",
            borderLeft: l.active ? `3px solid ${t.accent}` : "3px solid transparent",
            cursor: "pointer",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: l.done ? t.accent : l.active ? t.accent : "transparent",
              border: `2px solid ${l.done || l.active ? t.accent : t.brDefault}`,
              fontSize: 10, fontWeight: 700,
              color: (l.done || l.active) ? t.accentFg : t.txTertiary,
            }}>
              {l.done ? <CheckCircle2 size={13} strokeWidth={2.5} /> : l.n}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12, lineHeight: 1.4,
                color: l.active ? t.accent : l.done ? t.txTertiary : t.txSecondary,
                fontWeight: l.active ? 600 : 400,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {l.title}
              </div>
            </div>
          </div>
        ))}
      </aside>

      {/* ── Main reading area ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 54, display: "flex", alignItems: "center",
          padding: "0 28px", gap: 14,
          background: t.bgContent,
          borderBottom: `1px solid ${t.brSubtle}`,
          flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: t.txTertiary, marginBottom: 1 }}>LLM Foundations</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: t.txPrimary, fontFamily: t.headingFont }}>
              Transformer Architecture
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: t.bgInput, border: `1px solid ${t.brSubtle}`,
            borderRadius: 999, padding: "6px 14px",
            fontSize: 12.5, color: t.txTertiary, minWidth: 180,
          }}>
            <Search size={13} color={t.txTertiary} />
            Search lessons...
            <kbd style={{
              marginLeft: "auto", fontSize: 10,
              background: t.bgContent, border: `1px solid ${t.brDefault}`,
              borderRadius: 4, padding: "1px 5px", color: t.txTertiary,
            }}>⌘K</kbd>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: t.radius,
            border: `1px solid ${t.brSubtle}`, background: t.bgContent,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Moon size={14} color={t.txTertiary} />
          </div>
        </header>

        {/* Reading progress bar */}
        <div style={{ height: 2.5, background: t.brSubtle }}>
          <div style={{ height: "100%", width: "42%", background: t.accent }} />
        </div>

        {/* Content + TOC */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Lesson body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "44px 60px 80px" }}>
            <div style={{ maxWidth: 720 }}>

              {/* Chapter header */}
              <div style={{ marginBottom: 44 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: t.accentFg,
                    background: t.accent, padding: "3px 11px", borderRadius: 999,
                  }}>
                    LLM Foundations
                  </span>
                  <span style={{ fontSize: 11, color: t.txTertiary }}>Lesson 2 of 6</span>
                </div>

                <h1 style={{
                  fontSize: 38, fontWeight: t.headingWeight,
                  fontFamily: t.headingFont,
                  color: t.txPrimary, lineHeight: 1.1,
                  letterSpacing: t.headingTracking,
                  marginBottom: 20,
                }}>
                  Transformer Architecture
                </h1>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 0 }}>
                  {[
                    { icon: <Clock size={11} />, label: "20 min read", color: t.txSecondary, bg: t.bgCard, border: t.brSubtle },
                    { icon: <Zap size={11} />, label: "+75 XP", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)" },
                  ].map((chip) => (
                    <span key={chip.label} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12, color: chip.color, fontWeight: chip.label.includes("XP") ? 600 : 400,
                      background: chip.bg, border: `1px solid ${chip.border}`,
                      padding: "4px 11px", borderRadius: 999,
                    }}>
                      {chip.icon} {chip.label}
                    </span>
                  ))}
                </div>

                <div style={{ height: 1, background: t.brSubtle, marginTop: 26 }} />
              </div>

              {/* Body */}
              <p style={{ fontSize: 16.5, lineHeight: 1.85, color: t.txSecondary, marginBottom: 24 }}>
                The Transformer is the neural network architecture behind every modern LLM. Introduced in
                the landmark 2017 paper <em>"Attention Is All You Need"</em>, it replaced recurrent networks
                entirely with a mechanism called self-attention — enabling massive parallelisation during
                training and far richer representations of context.
              </p>

              <h2 style={{
                fontSize: 22, fontWeight: t.headingWeight,
                fontFamily: t.headingFont,
                color: t.txPrimary, lineHeight: 1.25,
                letterSpacing: t.headingTracking,
                marginTop: 44, marginBottom: 16,
                paddingLeft: 14,
                borderLeft: `3px solid ${t.accent}`,
              }}>
                Core mechanics
              </h2>

              {/* Bullets */}
              <div style={{ marginBottom: 28 }}>
                {BULLETS.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: t.accent, marginTop: 11, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 16, lineHeight: 1.8, color: t.txSecondary }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Code block */}
              <div style={{
                borderRadius: t.radius, overflow: "hidden",
                border: `1px solid ${t.brDefault}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                marginBottom: 28,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: t.bgCode, padding: "9px 18px",
                }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "#6b7280", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                    python
                  </span>
                  <span style={{
                    fontSize: 10.5, color: "#6b7280",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "2px 10px", borderRadius: 5, cursor: "pointer",
                  }}>
                    Copy
                  </span>
                </div>
                <pre style={{
                  background: t.bgCode, margin: 0,
                  padding: "20px 24px", overflowX: "auto",
                  fontSize: 13.5, lineHeight: 1.75,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  color: "#abb2bf",
                }}>
                  <span style={{ color: "#c678dd" }}>import</span>{" torch\n"}
                  <span style={{ color: "#c678dd" }}>import</span>{" torch.nn "}
                  <span style={{ color: "#c678dd" }}>as</span>{" nn\n\n"}
                  <span style={{ color: "#61afef" }}>class</span>
                  {" "}
                  <span style={{ color: "#e5c07b" }}>SelfAttention</span>
                  {"(nn.Module):\n"}
                  {"    "}
                  <span style={{ color: "#61afef" }}>def</span>
                  {" "}
                  <span style={{ color: "#61afef" }}>__init__</span>
                  {"(self, d_model, n_heads):\n"}
                  {"        "}
                  <span style={{ color: "#61afef" }}>super</span>
                  {"().__init__()\n"}
                  {"        self.attn = nn.MultiheadAttention(d_model, n_heads)\n"}
                </pre>
              </div>

              {/* Callout */}
              <div style={{
                padding: "16px 20px",
                background: t.accentSoft,
                borderLeft: `4px solid ${t.accent}`,
                borderRadius: `0 ${t.radius} ${t.radius} 0`,
                marginBottom: 28,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  color: t.accent, textTransform: "uppercase", marginBottom: 7,
                }}>
                  💡 Interview tip
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: t.txSecondary, margin: 0 }}>
                  Interviewers frequently ask: <strong style={{ color: t.txPrimary }}>"Why transformers instead of RNNs?"</strong> —
                  the answer is parallelisation during training and the ability to attend to
                  long-range dependencies without vanishing gradients.
                </p>
              </div>

              {/* Table */}
              <div style={{
                borderRadius: t.radius, border: `1px solid ${t.brSubtle}`,
                overflow: "hidden", marginBottom: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: t.accentSoft }}>
                      {["Component", "Purpose", "Interview importance"].map((h) => (
                        <th key={h} style={{
                          padding: "10px 16px", textAlign: "left",
                          fontSize: 10.5, fontWeight: 700, color: t.accent,
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          borderBottom: `1px solid ${t.brSubtle}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Self-attention", "Relates tokens to each other", "⭐⭐⭐⭐⭐"],
                      ["Feed-forward", "Per-token transformations", "⭐⭐⭐"],
                      ["Layer norm", "Training stability", "⭐⭐⭐"],
                    ].map(([c, p, i]) => (
                      <tr key={c} style={{ borderBottom: `1px solid ${t.brSubtle}` }}>
                        <td style={{ padding: "10px 16px", color: t.txPrimary, fontWeight: 500 }}>{c}</td>
                        <td style={{ padding: "10px 16px", color: t.txSecondary }}>{p}</td>
                        <td style={{ padding: "10px 16px", color: t.txSecondary }}>{i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* TOC panel */}
          <div style={{
            width: 200, flexShrink: 0,
            borderLeft: `1px solid ${t.brSubtle}`,
            background: t.bgContent,
            padding: "32px 0",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: t.txTertiary,
              padding: "0 18px", marginBottom: 12,
            }}>
              On this page
            </div>
            {["Core mechanics", "Self-attention", "Positional encoding", "Interview tips"].map((h, i) => (
              <div key={h} style={{
                padding: "5px 18px",
                fontSize: 12, color: i === 0 ? t.accent : t.txTertiary,
                fontWeight: i === 0 ? 600 : 400,
                borderLeft: i === 0 ? `2px solid ${t.accent}` : "2px solid transparent",
                cursor: "pointer", marginBottom: 2,
              }}>
                {h}
              </div>
            ))}

            <div style={{ margin: "20px 18px 0", paddingTop: 16, borderTop: `1px solid ${t.brSubtle}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.txTertiary, marginBottom: 7 }}>
                <span>Progress</span>
                <span style={{ color: t.accent, fontWeight: 700 }}>42%</span>
              </div>
              <div style={{ height: 4, background: t.brSubtle, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "42%", background: t.accent, borderRadius: 999 }} />
              </div>
            </div>

            {/* Next / Prev */}
            <div style={{ margin: "20px 14px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                padding: "9px 14px",
                background: t.accent, color: t.accentFg,
                borderRadius: t.radius, fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: `0 4px 12px ${t.accentGlow}`,
              }}>
                Next lesson <ChevronRight size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next bar */}
        <div style={{
          padding: "12px 28px",
          borderTop: `1px solid ${t.brSubtle}`,
          background: t.bgContent,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 16px", borderRadius: t.radius,
            border: `1px solid ${t.brDefault}`, background: t.bgCard,
            fontSize: 12.5, color: t.txSecondary, cursor: "pointer",
          }}>
            ← What is an LLM?
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 18px", borderRadius: t.radius,
            background: t.accent, color: t.accentFg,
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            boxShadow: `0 4px 12px ${t.accentGlow}`,
          }}>
            Tokenization →
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab strip ─────────────────────────────────────────────────────────────────

const TAB_META: Record<string, { dot: string }> = {
  slate:     { dot: "#2563eb" },
  warm:      { dot: "#d97706" },
  editorial: { dot: "#0d9488" },
  arc:       { dot: "#7c3aed" },
};

export default function PreviewPage() {
  const [active, setActive] = useState(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === active)!;

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#fafafa", fontFamily: "'Inter', sans-serif", overflow: "hidden",
    }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "#ffffff", borderBottom: "1px solid #e4e4e7",
        padding: "0 20px", height: 52, flexShrink: 0, gap: 16,
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "#71717a", cursor: "pointer",
            paddingRight: 16, borderRight: "1px solid #e4e4e7",
          }}>
            <ArrowLeft size={13} /> Back
          </div>
        </Link>

        <span style={{ fontSize: 12, color: "#a1a1aa" }}>
          All Canvas-style — pick the one that feels right
        </span>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {THEMES.map((t) => {
            const isActive = t.id === active;
            const meta = TAB_META[t.id];
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "6px 16px", borderRadius: 8,
                  border: isActive ? `1.5px solid ${meta.dot}30` : "1.5px solid transparent",
                  background: isActive ? `${meta.dot}10` : "transparent",
                  cursor: "pointer", transition: "all 0.12s",
                }}
              >
                <div style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: isActive ? meta.dot : "#d4d4d8",
                  transition: "background 0.15s",
                }} />
                <span style={{
                  fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#09090b" : "#71717a",
                }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 11.5, color: "#a1a1aa" }}>
                  — {t.tagline}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: "#a1a1aa", paddingLeft: 16, borderLeft: "1px solid #e4e4e7", whiteSpace: "nowrap" }}>
          Viewing: <strong style={{ color: TAB_META[active].dot }}>{theme.name}</strong>
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Preview key={active} t={theme} />
      </div>
    </div>
  );
}
