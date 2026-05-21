"use client";

import { Bolt, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

type ChallengeProps = {
  challenge: {
    id: string;
    type: string;
    title: string;
    content: string;
    xpReward: number;
    tags: string[];
  } | null;
};

const typeColors: Record<string, { bg: string; text: string }> = {
  CONCEPT:        { bg: "var(--accent-light)",   text: "var(--accent)" },
  PAPER:          { bg: "var(--info-light)",      text: "var(--info)" },
  CODE_SNIPPET:   { bg: "var(--success-light)",   text: "var(--success)" },
  SCENARIO:       { bg: "var(--warning-light)",   text: "var(--warning)" },
  TOOL_SPOTLIGHT: { bg: "var(--streak-light)",    text: "var(--streak-orange)" },
};

const typeLabels: Record<string, string> = {
  CONCEPT: "Concept of the day",
  PAPER: "Paper of the day",
  CODE_SNIPPET: "Code challenge",
  SCENARIO: "Design scenario",
  TOOL_SPOTLIGHT: "Tool spotlight",
};

export function DailyChallenge({ challenge }: ChallengeProps) {
  if (!challenge) {
    return (
      <div style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        padding: "20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "var(--accent-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={20} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
            No challenge today
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Daily challenges will appear here. Keep learning!
          </div>
        </div>
        <Link href="/learn" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--accent)", color: "#fff",
            borderRadius: "var(--radius-md)", padding: "9px 16px",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            Start learning <ArrowRight size={13} />
          </div>
        </Link>
      </div>
    );
  }

  const colors = typeColors[challenge.type] ?? typeColors.CONCEPT;
  const label = typeLabels[challenge.type] ?? "Daily challenge";

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
            {label}
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: "var(--xp-gold-light)", color: "var(--xp-gold)",
          padding: "2px 8px", borderRadius: "var(--radius-full)",
          border: "1px solid var(--xp-gold)",
        }}>
          +{challenge.xpReward} XP
        </span>
      </div>

      {/* Tag */}
      {challenge.tags.length > 0 && (
        <div style={{
          fontSize: 11, fontWeight: 500,
          background: colors.bg, color: colors.text,
          padding: "3px 8px", borderRadius: "var(--radius-full)",
          display: "inline-block", marginBottom: 10,
          width: "fit-content",
        }}>
          {challenge.tags[0]}
        </div>
      )}

      {/* Title */}
      <h3 style={{
        fontSize: 15, fontWeight: 600,
        color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 10,
        flex: 1,
      }}>
        {challenge.title}
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
        {challenge.content}
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
