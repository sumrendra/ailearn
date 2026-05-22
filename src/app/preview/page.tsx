"use client";

import { useState } from "react";
import {
  LayoutDashboard, BookOpen, FlipHorizontal, Trophy,
  Sparkles, Search, Settings, ChevronRight, Clock,
  Zap, Sun, Moon, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ── Theme definitions ─────────────────────────────────────────────────────────

interface Theme {
  id: string;
  name: string;
  tagline: string;

  // backgrounds
  bgApp: string;
  bgSidebar: string;
  bgContent: string;
  bgCard: string;
  bgCode: string;
  bgInput: string;
  bgActive: string;
  bgHover: string;

  // text
  txPrimary: string;
  txSecondary: string;
  txTertiary: string;
  txMuted: string;

  // borders
  brSidebar: string;
  brContent: string;
  brCard: string;

  // accent
  accent: string;
  accentFg: string;
  accentLight: string;
  accentGlow: string;

  // chrome
  radius: string;
  fontStack: string;
  letterSpacing: string;
  headingWeight: number;
}

const THEMES: Theme[] = [
  // ── 1. Zero — pure dark, no colour noise ──────────────────────────────────
  {
    id: "zero",
    name: "Zero",
    tagline: "Dark, silent, content-first",

    bgApp:     "#080808",
    bgSidebar: "#0d0d0d",
    bgContent: "#111111",
    bgCard:    "#191919",
    bgCode:    "#0a0a0a",
    bgInput:   "#1a1a1a",
    bgActive:  "rgba(255,255,255,0.05)",
    bgHover:   "rgba(255,255,255,0.03)",

    txPrimary:   "#f2f2f2",
    txSecondary: "#909090",
    txTertiary:  "#555555",
    txMuted:     "#333333",

    brSidebar: "#1a1a1a",
    brContent: "#1e1e1e",
    brCard:    "#222222",

    accent:      "#22d3ee",
    accentFg:    "#fff",
    accentLight: "rgba(34,211,238,0.08)",
    accentGlow:  "rgba(34,211,238,0.25)",

    radius: "4px",
    fontStack: "'Inter', sans-serif",
    letterSpacing: "-0.01em",
    headingWeight: 700,
  },

  // ── 2. Canvas — off-white, minimal, airy ─────────────────────────────────
  {
    id: "canvas",
    name: "Canvas",
    tagline: "Clean, open, distraction-free",

    bgApp:     "#f4f3ef",
    bgSidebar: "#ebe9e3",
    bgContent: "#fdfcfa",
    bgCard:    "#ffffff",
    bgCode:    "#f0ede6",
    bgInput:   "#e8e5de",
    bgActive:  "rgba(37,99,235,0.07)",
    bgHover:   "rgba(0,0,0,0.03)",

    txPrimary:   "#1a1a1a",
    txSecondary: "#525252",
    txTertiary:  "#9ca3af",
    txMuted:     "#d1d5db",

    brSidebar: "#dbd8d0",
    brContent: "#e5e2da",
    brCard:    "#e8e5dd",

    accent:      "#2563eb",
    accentFg:    "#fff",
    accentLight: "rgba(37,99,235,0.08)",
    accentGlow:  "rgba(37,99,235,0.2)",

    radius: "8px",
    fontStack: "'Inter', sans-serif",
    letterSpacing: "-0.01em",
    headingWeight: 700,
  },

  // ── 3. Midnight — deep indigo, premium ──────────────────────────────────
  {
    id: "midnight",
    name: "Midnight",
    tagline: "Deep, premium, focused",

    bgApp:     "#0b0a18",
    bgSidebar: "#0f0e1d",
    bgContent: "#13122a",
    bgCard:    "#181730",
    bgCode:    "#080712",
    bgInput:   "#1a1932",
    bgActive:  "rgba(167,139,250,0.12)",
    bgHover:   "rgba(255,255,255,0.03)",

    txPrimary:   "#e8e6ff",
    txSecondary: "#9b99cc",
    txTertiary:  "#6867a0",
    txMuted:     "#3a3868",

    brSidebar: "rgba(255,255,255,0.06)",
    brContent: "rgba(255,255,255,0.05)",
    brCard:    "rgba(255,255,255,0.07)",

    accent:      "#a78bfa",
    accentFg:    "#fff",
    accentLight: "rgba(167,139,250,0.12)",
    accentGlow:  "rgba(167,139,250,0.35)",

    radius: "10px",
    fontStack: "'Inter', sans-serif",
    letterSpacing: "-0.015em",
    headingWeight: 800,
  },

  // ── 4. Paper — warm cream, editorial, typographic ────────────────────────
  {
    id: "paper",
    name: "Paper",
    tagline: "Warm, editorial, like a good book",

    bgApp:     "#f9f7f2",
    bgSidebar: "#f0ece2",
    bgContent: "#faf8f3",
    bgCard:    "#ffffff",
    bgCode:    "#eee9dc",
    bgInput:   "#e8e3d8",
    bgActive:  "rgba(180,83,9,0.07)",
    bgHover:   "rgba(0,0,0,0.03)",

    txPrimary:   "#1c1712",
    txSecondary: "#5c5248",
    txTertiary:  "#a09080",
    txMuted:     "#d0c8b8",

    brSidebar: "#ddd5c4",
    brContent: "#e4dccc",
    brCard:    "#e8e0d0",

    accent:      "#b45309",
    accentFg:    "#fff",
    accentLight: "rgba(180,83,9,0.08)",
    accentGlow:  "rgba(180,83,9,0.25)",

    radius: "6px",
    fontStack: "'Georgia', 'Times New Roman', serif",
    letterSpacing: "0",
    headingWeight: 700,
  },
];

// ── Nav items used in the preview sidebar ─────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen,        label: "Lessons",     active: true },
  { icon: FlipHorizontal,  label: "Flashcards" },
  { icon: Trophy,          label: "Quizzes" },
  { icon: Sparkles,        label: "AI Tutor",    badge: "AI" },
  { icon: Search,          label: "Search" },
];

// ── Fake lesson content ────────────────────────────────────────────────────────

const SAMPLE_BULLETS = [
  "Trained on massive text corpora using self-supervised learning",
  "Generate text token-by-token using probability distributions",
  "Scale dramatically — more parameters = richer representations",
  "Emergent capabilities appear beyond a certain parameter threshold",
];

// ── Preview shell ─────────────────────────────────────────────────────────────

function ThemePreview({ t }: { t: Theme }) {
  const css = (styles: React.CSSProperties) => styles;

  return (
    <div style={css({
      display: "flex",
      height: "100%",
      background: t.bgApp,
      fontFamily: t.fontStack,
      letterSpacing: t.letterSpacing,
      overflow: "hidden",
    })}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={css({
        width: 220,
        flexShrink: 0,
        background: t.bgSidebar,
        borderRight: `1px solid ${t.brSidebar}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      })}>

        {/* Logo */}
        <div style={css({
          padding: "18px 16px 14px",
          borderBottom: `1px solid ${t.brSidebar}`,
        })}>
          <div style={css({
            display: "flex", alignItems: "center", gap: 9,
          })}>
            <div style={css({
              width: 30, height: 30, borderRadius: t.radius,
              background: t.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 12px ${t.accentGlow}`,
            })}>
              <Sparkles size={14} color={t.accentFg} />
            </div>
            <div>
              <div style={css({
                fontSize: 14, fontWeight: 700, color: t.txPrimary, lineHeight: 1,
                letterSpacing: "-0.02em",
              })}>
                AILearn
              </div>
              <div style={css({ fontSize: 10, color: t.txTertiary, marginTop: 2 })}>
                Master AI engineering
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={css({ flex: 1, padding: "10px 8px", overflowY: "auto" })}>
          {[
            { label: "LEARN",    items: NAV.slice(0, 2) },
            { label: "PRACTICE", items: NAV.slice(2, 4) },
            { label: "TOOLS",    items: NAV.slice(4) },
          ].map((group) => (
            <div key={group.label} style={css({ marginBottom: 6 })}>
              <div style={css({
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em",
                color: t.txTertiary, padding: "8px 8px 4px",
                textTransform: "uppercase",
              })}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={css({
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 9px", borderRadius: t.radius,
                    marginBottom: 1,
                    background: item.active ? t.bgActive : "transparent",
                    color: item.active ? t.accent : t.txSecondary,
                    fontWeight: item.active ? 600 : 400,
                    fontSize: 13,
                    cursor: "pointer",
                  })}>
                    <Icon size={15} strokeWidth={item.active ? 2.2 : 1.7} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span style={css({
                        fontSize: 9, fontWeight: 700,
                        background: t.accent, color: t.accentFg,
                        padding: "1px 5px", borderRadius: 3,
                      })}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={css({
          padding: "10px 8px 14px",
          borderTop: `1px solid ${t.brSidebar}`,
        })}>
          <div style={css({
            display: "flex", alignItems: "center", gap: 9,
            padding: "7px 9px", borderRadius: t.radius,
            color: t.txSecondary, fontSize: 13, cursor: "pointer",
          })}>
            <Settings size={15} strokeWidth={1.7} />
            Settings
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={css({
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: t.bgContent,
        overflow: "hidden",
      })}>

        {/* Topbar */}
        <header style={css({
          height: 52,
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 12,
          borderBottom: `1px solid ${t.brContent}`,
          background: t.bgContent,
          flexShrink: 0,
        })}>
          <div style={css({ flex: 1 })}>
            <div style={css({ fontSize: 10, color: t.txTertiary, marginBottom: 1 })}>LLM Foundations</div>
            <div style={css({ fontSize: 14, fontWeight: 600, color: t.txPrimary })}>What is an LLM?</div>
          </div>

          {/* Search pill */}
          <div style={css({
            display: "flex", alignItems: "center", gap: 7,
            background: t.bgInput,
            border: `1px solid ${t.brContent}`,
            borderRadius: "999px",
            padding: "5px 14px",
            fontSize: 12, color: t.txTertiary,
            minWidth: 170,
          })}>
            <Search size={12} color={t.txTertiary} />
            Search lessons...
          </div>

          {/* Theme toggle (decorative) */}
          <div style={css({
            width: 32, height: 32, borderRadius: t.radius,
            border: `1px solid ${t.brContent}`,
            background: t.bgCard,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          })}>
            <Moon size={13} color={t.txTertiary} />
          </div>
        </header>

        {/* Progress bar */}
        <div style={css({ height: 2, background: t.brContent, position: "relative" })}>
          <div style={css({
            position: "absolute", left: 0, top: 0, height: "100%",
            width: "38%",
            background: t.accent,
            boxShadow: `0 0 6px ${t.accentGlow}`,
          })} />
        </div>

        {/* Content + TOC */}
        <div style={css({
          flex: 1, display: "flex", overflow: "hidden",
        })}>

          {/* Lesson body */}
          <div style={css({
            flex: 1, overflowY: "auto",
            padding: "40px 56px 60px",
          })}>

            {/* Lesson header */}
            <div style={css({ marginBottom: 40 })}>
              <div style={css({ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 })}>
                <span style={css({
                  fontSize: 11, fontWeight: 600, color: t.accentFg,
                  background: t.accent, padding: "3px 10px",
                  borderRadius: "999px", letterSpacing: "0.02em",
                })}>
                  LLM Foundations
                </span>
                <span style={css({ fontSize: 11, color: t.txTertiary })}>Lesson 1 of 6</span>
              </div>

              <h1 style={css({
                fontSize: 32, fontWeight: t.headingWeight,
                color: t.txPrimary, lineHeight: 1.15,
                letterSpacing: "-0.03em", marginBottom: 18,
              })}>
                What is an LLM?
              </h1>

              <div style={css({ display: "flex", alignItems: "center", gap: 10 })}>
                <span style={css({
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12, color: t.txSecondary,
                  background: t.bgCard, border: `1px solid ${t.brCard}`,
                  padding: "4px 11px", borderRadius: "999px",
                })}>
                  <Clock size={11} color={t.txTertiary} /> 15 min read
                </span>
                <span style={css({
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 600,
                  color: "#f59e0b",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  padding: "4px 11px", borderRadius: "999px",
                })}>
                  <Zap size={11} /> +50 XP
                </span>
              </div>

              <div style={css({ height: 1, background: t.brContent, marginTop: 28 })} />
            </div>

            {/* Intro paragraph */}
            <p style={css({
              fontSize: 16, lineHeight: 1.9,
              color: t.txSecondary, marginBottom: 24,
            })}>
              A Large Language Model is a neural network trained on vast amounts of text data
              to understand and generate human language. They are the foundation of modern AI
              assistants, coding tools, and reasoning systems.
            </p>

            {/* Section heading */}
            <h2 style={css({
              fontSize: 20, fontWeight: t.headingWeight,
              color: t.txPrimary, marginBottom: 14, marginTop: 40,
              paddingLeft: 14,
              borderLeft: `3px solid ${t.accent}`,
              letterSpacing: "-0.02em",
            })}>
              How LLMs work
            </h2>

            {/* Bullet list */}
            <div style={css({ marginBottom: 28 })}>
              {SAMPLE_BULLETS.map((b, i) => (
                <div key={i} style={css({
                  display: "flex", alignItems: "flex-start", gap: 14,
                  marginBottom: 12,
                })}>
                  <div style={css({
                    width: 7, height: 7, borderRadius: "50%",
                    background: t.accent, marginTop: 10, flexShrink: 0,
                  })} />
                  <span style={css({ fontSize: 15.5, lineHeight: 1.8, color: t.txSecondary })}>
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* Code block */}
            <div style={css({
              borderRadius: t.radius,
              overflow: "hidden",
              border: `1px solid ${t.brCard}`,
              marginBottom: 28,
            })}>
              <div style={css({
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: t.bgCode, padding: "8px 16px",
                borderBottom: `1px solid ${t.brCard}`,
              })}>
                <span style={css({
                  fontSize: 10.5, fontWeight: 600, color: t.txTertiary,
                  letterSpacing: "0.07em", textTransform: "uppercase",
                })}>
                  python
                </span>
                <span style={css({
                  fontSize: 10.5, color: t.txTertiary,
                  background: t.bgApp, border: `1px solid ${t.brCard}`,
                  padding: "2px 9px", borderRadius: 4,
                })}>
                  Copy
                </span>
              </div>
              <pre style={css({
                background: t.bgCode, margin: 0,
                padding: "18px 22px", overflowX: "auto",
                fontSize: 13, lineHeight: 1.75,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: t.txSecondary,
              })}>
                <span style={{ color: t.accent }}>from</span>
                {" openai "}
                <span style={{ color: t.accent }}>import</span>
                {" OpenAI\n"}
                {"\n"}
                {"client = OpenAI()\n"}
                {"response = client.chat.completions.create(\n"}
                {"    model="}
                <span style={{ color: "#98c379" }}>&quot;gpt-4o&quot;</span>
                {",\n"}
                {"    messages=[{"}
                <span style={{ color: "#98c379" }}>&quot;role&quot;</span>
                {": "}
                <span style={{ color: "#98c379" }}>&quot;user&quot;</span>
                {", "}
                <span style={{ color: "#98c379" }}>&quot;content&quot;</span>
                {": "}
                <span style={{ color: "#98c379" }}>&quot;Explain transformers&quot;</span>
                {"}]\n"}
                {")"}
              </pre>
            </div>

            {/* Callout */}
            <div style={css({
              position: "relative",
              padding: "16px 18px",
              background: t.accentLight,
              borderLeft: `3px solid ${t.accent}`,
              borderRadius: `0 ${t.radius} ${t.radius} 0`,
              marginBottom: 24,
            })}>
              <div style={css({
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em",
                color: t.accent, textTransform: "uppercase", marginBottom: 6,
              })}>
                💡 Key insight
              </div>
              <p style={css({ fontSize: 14, lineHeight: 1.7, color: t.txSecondary, margin: 0 })}>
                The "large" in LLM refers to parameter count — modern models range from
                7 billion to over a trillion parameters.
              </p>
            </div>

          </div>

          {/* TOC panel */}
          <div style={css({
            width: 196, flexShrink: 0,
            borderLeft: `1px solid ${t.brContent}`,
            background: t.bgContent,
            padding: "32px 0",
          })}>
            <div style={css({
              fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: t.txTertiary,
              padding: "0 18px", marginBottom: 12,
            })}>
              On this page
            </div>
            {["How LLMs work", "Architecture", "Use cases", "Interview tips"].map((h, i) => (
              <div key={h} style={css({
                padding: `5px 18px`,
                fontSize: 12,
                color: i === 0 ? t.accent : t.txTertiary,
                fontWeight: i === 0 ? 600 : 400,
                borderLeft: i === 0 ? `2px solid ${t.accent}` : "2px solid transparent",
                cursor: "pointer", marginBottom: 2,
              })}>
                {h}
              </div>
            ))}

            <div style={css({
              margin: "20px 18px 0",
              paddingTop: 16,
              borderTop: `1px solid ${t.brContent}`,
            })}>
              <div style={css({
                display: "flex", justifyContent: "space-between",
                fontSize: 10, color: t.txTertiary, marginBottom: 7,
              })}>
                <span>Progress</span>
                <span style={{ color: t.accent, fontWeight: 700 }}>38%</span>
              </div>
              <div style={css({
                height: 4, background: t.brContent,
                borderRadius: 999, overflow: "hidden",
              })}>
                <div style={css({
                  height: "100%", width: "38%",
                  background: t.accent,
                  boxShadow: `0 0 6px ${t.accentGlow}`,
                })} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab switcher ──────────────────────────────────────────────────────────────

const TAB_COLORS: Record<string, { dot: string; ring: string }> = {
  zero:     { dot: "#22d3ee", ring: "rgba(34,211,238,0.3)" },
  canvas:   { dot: "#2563eb", ring: "rgba(37,99,235,0.3)" },
  midnight: { dot: "#a78bfa", ring: "rgba(167,139,250,0.3)" },
  paper:    { dot: "#b45309", ring: "rgba(180,83,9,0.3)" },
};

export default function PreviewPage() {
  const [active, setActive] = useState(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === active)!;

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#050505",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Top chrome ──────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        background: "#0a0a0a",
        borderBottom: "1px solid #1f1f1f",
        padding: "0 20px",
        flexShrink: 0,
        height: 50,
      }}>

        {/* Back link */}
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#555", cursor: "pointer",
            padding: "6px 12px 6px 4px",
            borderRight: "1px solid #1f1f1f",
            marginRight: 20,
            transition: "color 0.12s",
          }}>
            <ArrowLeft size={13} /> Back to app
          </div>
        </Link>

        <span style={{ fontSize: 12, color: "#444", marginRight: 20 }}>
          Pick a design — then tell me which you like
        </span>

        {/* Theme tabs */}
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {THEMES.map((t) => {
            const isActive = t.id === active;
            const colors = TAB_COLORS[t.id];
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: isActive ? `1px solid ${colors.ring}` : "1px solid transparent",
                  background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: colors.dot,
                  boxShadow: isActive ? `0 0 6px ${colors.ring}` : "none",
                  transition: "box-shadow 0.15s",
                }} />
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#f0f0f0" : "#555",
                }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 11, color: "#333", fontStyle: "italic" }}>
                  {t.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Choose CTA */}
        <div style={{
          fontSize: 11, color: "#444", marginLeft: "auto",
          paddingLeft: 20, borderLeft: "1px solid #1f1f1f",
          whiteSpace: "nowrap",
        }}>
          Now viewing: <span style={{ color: TAB_COLORS[active].dot, fontWeight: 600 }}>{theme.name}</span>
          {" — "}{theme.tagline}
        </div>
      </div>

      {/* ── Preview canvas ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ThemePreview key={active} t={theme} />
      </div>
    </div>
  );
}
