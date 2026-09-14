"use client";

import Link from "next/link";

interface GrammarCell {
  id: string;
  label: string;
  cefr: string;
  category: string;
  state: string;
}

const CEFR_COLORS: Record<string, string> = {
  A0: "#94a3b8",
  A1: "#3b82f6",
  A2: "#8b5cf6",
  B1: "#f59e0b",
  B2: "#be185d",
  exam: "#0f766e",
};

const STATE_OPACITY: Record<string, number> = {
  available: 0.15,
  in_progress: 0.35,
  practiced: 0.5,
  mastered: 1,
};

export function GrammarMap({ topics }: { topics: GrammarCell[] }) {
  const categories = ["tenses", "pronouns", "syntax", "mood", "other"] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {categories.map((cat) => {
        const cells = topics.filter((t) => t.category === cat);
        if (!cells.length) return null;
        return (
          <div key={cat}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize", marginBottom: 10, color: "var(--text-secondary)" }}>
              {cat}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cells.map((t) => {
                const color = CEFR_COLORS[t.cefr] ?? "#64748b";
                const opacity = STATE_OPACITY[t.state] ?? 0.15;
                return (
                  <div
                    key={t.id}
                    title={`${t.label} (${t.cefr}) — ${t.state}`}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      border: `1px solid ${color}44`,
                      background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`,
                      color: t.state === "mastered" ? color : "var(--text-secondary)",
                    }}
                  >
                    {t.label}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
        Topics light up when you complete their linked lesson. Browse any lesson anytime — this map shows what you&apos;ve covered.
      </p>
    </div>
  );
}

export function VocabThemeGrid({
  themes,
}: {
  themes: { id: string; title: string; titleFr: string; emoji: string; description: string; percent: number; cardCount: number }[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
      {themes.map((t) => (
        <Link
          key={t.id}
          href={`/tcf/vocabulary/theme/${t.id}`}
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>{t.emoji}</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{t.titleFr}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{t.description}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: "#be185d" }}>{t.cardCount} cards · {t.percent}% mastered</div>
        </Link>
      ))}
    </div>
  );
}
