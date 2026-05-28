"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PracticeStage } from "@/components/practice/PracticeStage";
import { Kbd } from "@/components/practice/Kbd";

/**
 * Quiz landing. The redesigned surface treats this as a *menu* — pick a
 * starting topic, then jump into the focused quiz stage at /quiz/generate.
 * The center-stage card holds the topic chooser; the surrounding mesh +
 * grain do the atmospheric work.
 *
 * Keyboard:
 *   1-5  → jump into a quick-start set
 *   N    → "new custom quiz" (alias for clicking Generate)
 */
const QUICK_SETS = [
  { label: "LLM Fundamentals", difficulty: "BEGINNER" as const },
  { label: "RAG & Vector Search", difficulty: "INTERMEDIATE" as const },
  { label: "AI Agents", difficulty: "ADVANCED" as const },
  { label: "Prompt Engineering Mastery", difficulty: "INTERMEDIATE" as const },
  { label: "Transformer Architecture", difficulty: "INTERMEDIATE" as const },
];

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export default function QuizPage() {
  // Keyboard routing — 1..5 jumps to a quick-start, N opens the generator.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (e.key >= "1" && e.key <= "5") {
        const set = QUICK_SETS[Number(e.key) - 1];
        if (set) {
          e.preventDefault();
          window.location.href = `/quiz/generate?topic=${encodeURIComponent(set.label)}&difficulty=${set.difficulty}`;
        }
      }
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        window.location.href = "/quiz/generate";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Topbar title="Quiz" subtitle="Pick a topic. Five questions, detailed explanations." />
      <PracticeStage
        above={
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="mono-overline">Practice · Quiz</span>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
            What do you want to be quizzed on?
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Press <Kbd>1</Kbd>–<Kbd>5</Kbd> to start a quick-set, or <Kbd>N</Kbd> to build a custom quiz.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUICK_SETS.map((set, idx) => (
            <Link
              key={set.label}
              href={`/quiz/generate?topic=${encodeURIComponent(set.label)}&difficulty=${set.difficulty}`}
              className="glow-ring"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--text-primary)",
                fontSize: 14,
              }}
            >
              <Kbd tint="var(--accent-text)">{idx + 1}</Kbd>
              <span style={{ flex: 1 }}>{set.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {DIFF_LABEL[set.difficulty]}
              </span>
              <ArrowRight size={14} color="var(--text-tertiary)" />
            </Link>
          ))}
        </div>

        <div className="hairline-t" style={{ paddingTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/quiz/generate"
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 18px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <Wand2 size={14} /> Build a custom quiz <Kbd tint="rgba(255,255,255,0.85)">N</Kbd>
          </Link>
        </div>
      </PracticeStage>
    </>
  );
}
