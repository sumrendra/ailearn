"use client";

import { Bolt, ArrowRight } from "lucide-react";
import Link from "next/link";

const todayChallenge = {
  type: "CONCEPT",
  label: "Concept of the day",
  title: "Why does temperature = 0 make LLMs deterministic?",
  preview: "Temperature controls the randomness in token sampling. At 0, the model always picks the highest-probability token — making outputs fully deterministic...",
  xpReward: 25,
  tag: "LLM Fundamentals",
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  CONCEPT:       { bg: "var(--accent-light)",     text: "var(--accent)",       border: "var(--accent)" },
  PAPER:         { bg: "var(--info-light)",        text: "var(--info)",         border: "var(--info)" },
  CODE_SNIPPET:  { bg: "var(--success-light)",     text: "var(--success)",      border: "var(--success)" },
  SCENARIO:      { bg: "var(--warning-light)",     text: "var(--warning)",      border: "var(--warning)" },
  TOOL_SPOTLIGHT:{ bg: "var(--streak-light)",      text: "var(--streak-orange)",border: "var(--streak-orange)" },
};

export function DailyChallenge() {
  const colors = typeColors[todayChallenge.type] ?? typeColors.CONCEPT;

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: colors.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bolt size={14} color={colors.text} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {todayChallenge.label}
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: "var(--xp-gold-light)", color: "var(--xp-gold)",
          padding: "2px 8px", borderRadius: "var(--radius-full)",
          border: "1px solid var(--xp-gold)",
        }}>
          +{todayChallenge.xpReward} XP
        </span>
      </div>

      {/* Tag */}
      <div style={{
        fontSize: 11, fontWeight: 500,
        background: colors.bg, color: colors.text,
        padding: "3px 8px", borderRadius: "var(--radius-full)",
        display: "inline-block", marginBottom: 10,
        width: "fit-content",
      }}>
        {todayChallenge.tag}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 15, fontWeight: 600,
        color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 10,
        flex: 1,
      }}>
        {todayChallenge.title}
      </h3>

      {/* Preview */}
      <p style={{
        fontSize: 13, color: "var(--text-secondary)",
        lineHeight: 1.6, marginBottom: 16,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {todayChallenge.preview}
      </p>

      {/* CTA */}
      <Link href="/challenge" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "var(--accent)", color: "#fff",
          borderRadius: "var(--radius-md)", padding: "10px 16px",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          transition: "opacity 0.15s",
        }}>
          Take the challenge
          <ArrowRight size={15} />
        </div>
      </Link>
    </div>
  );
}
