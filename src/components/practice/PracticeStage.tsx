"use client";

import { CSSProperties, ReactNode } from "react";

/**
 * Center-stage scaffold for the practice surfaces (Quiz, Flashcards).
 *
 * The mesh + grain layers (rendered by the app shell) carry the atmosphere;
 * the stage is a quiet, opinionated frame that pins the focused interaction
 * to the optical center of the viewport. The card itself is .glass-pane with
 * an ambient glow ring + heavy shadow — so it reads as a held object rather
 * than a flat panel.
 *
 * Variants:
 *   - "quiz"  → 640px wide, comfortable vertical padding
 *   - "card"  → 520×340 — sized for a single flashcard face
 *
 * Children render *inside* the glass card. Anything that should sit OUTSIDE
 * the card (progress dots above, rating bar below) should be passed via the
 * `above` / `below` slots so it stays anchored to the stage axis.
 */
type Variant = "quiz" | "card";

interface Props {
  variant?: Variant;
  above?: ReactNode;
  below?: ReactNode;
  children: ReactNode;
  /** Override the inner card sizing — only used for the flashcard flip rig. */
  cardStyle?: CSSProperties;
  /** Forwarded to the outer wrapper so consumers can pin focus targets. */
  className?: string;
}

const SIZES: Record<Variant, { width: number; minHeight: number | string }> = {
  quiz: { width: 640, minHeight: "auto" },
  card: { width: 520, minHeight: 340 },
};

export function PracticeStage({
  variant = "quiz",
  above,
  below,
  children,
  cardStyle,
  className,
}: Props) {
  const size = SIZES[variant];

  return (
    <div
      className={className}
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px 56px",
        gap: 20,
      }}
    >
      {above ? (
        <div style={{ width: "100%", maxWidth: size.width, display: "flex", flexDirection: "column", gap: 14 }}>
          {above}
        </div>
      ) : null}

      <div
        className="glass-pane"
        style={{
          width: "100%",
          maxWidth: size.width,
          minHeight: size.minHeight,
          borderRadius: "var(--radius-xl, 20px)",
          boxShadow: "var(--shadow-glow), var(--shadow-2xl)",
          padding: variant === "quiz" ? "36px 36px 32px" : 0,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative",
          ...cardStyle,
        }}
      >
        {children}
      </div>

      {below ? (
        <div style={{ width: "100%", maxWidth: size.width, display: "flex", flexDirection: "column", gap: 12 }}>
          {below}
        </div>
      ) : null}
    </div>
  );
}
