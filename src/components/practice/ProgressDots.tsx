/**
 * Horizontal row of M dots tracking quiz progress. Each dot encodes:
 *   - current   → solid accent + faint accent glow
 *   - correct   → solid success
 *   - incorrect → solid danger
 *   - remaining → bg-overlay
 *
 * Renders inline-block so a single row can sit comfortably next to the
 * `.mono-overline` label above the quiz card.
 */
export type DotState = "current" | "correct" | "incorrect" | "remaining";

export function ProgressDots({ states }: { states: DotState[] }) {
  const palette: Record<DotState, { bg: string; ring?: string }> = {
    current:   { bg: "var(--accent)",     ring: "0 0 0 3px var(--accent-soft)" },
    correct:   { bg: "var(--success)" },
    incorrect: { bg: "var(--danger)" },
    remaining: { bg: "var(--bg-overlay)" },
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {states.map((s, i) => {
        const p = palette[s];
        return (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: p.bg,
              boxShadow: p.ring,
              transition: "background 0.2s ease, box-shadow 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
}
