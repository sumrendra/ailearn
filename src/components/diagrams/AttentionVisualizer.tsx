"use client";

import { useMemo, useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";

/**
 * Interactive attention visualizer.
 *
 * The user picks a token in a sentence; we render the attention weights from
 * that token to every other token as connection lines + a coloured ribbon
 * underneath each word. Pre-computed weights (the matrix below) approximate
 * a real attention head's output for the example sentence — so the user
 * can develop intuition for *which* tokens get attended to and why, without
 * us needing to run a transformer in the browser.
 */

// Pre-baked attention matrix for: "The hungry cat chased the mouse quickly"
// rows = query token, cols = key token. Each row sums to ~1.0 (softmax normalised).
const TOKENS = ["The", "hungry", "cat", "chased", "the", "mouse", "quickly"] as const;

const WEIGHTS: number[][] = [
  // The
  [0.42, 0.10, 0.18, 0.04, 0.08, 0.12, 0.06],
  // hungry
  [0.05, 0.30, 0.45, 0.07, 0.02, 0.08, 0.03],
  // cat (subject)
  [0.08, 0.22, 0.30, 0.18, 0.02, 0.08, 0.12],
  // chased (verb — attends to subject + object)
  [0.04, 0.08, 0.32, 0.18, 0.04, 0.28, 0.06],
  // the
  [0.10, 0.04, 0.06, 0.04, 0.30, 0.40, 0.06],
  // mouse (object — attends back to verb + adverb)
  [0.04, 0.05, 0.10, 0.32, 0.06, 0.22, 0.21],
  // quickly (adverb — attends to verb)
  [0.05, 0.04, 0.08, 0.45, 0.02, 0.18, 0.18],
];

// Annotated explanations per query token — pedagogical, not from the model.
const EXPLAIN: Record<string, string> = {
  "The": "Determiners attend mostly to themselves and the noun they modify (here: cat).",
  "hungry": "Adjectives attend most strongly to the noun they describe — cat.",
  "cat": "The grammatical subject attends to its modifiers (hungry) and the verb (chased).",
  "chased": "Verbs are syntactic hubs — they attend strongly to both subject (cat) and object (mouse).",
  "the": "This determiner binds to mouse — its adjacent noun.",
  "mouse": "The object attends back to the verb that acts on it and the adverb describing the action.",
  "quickly": "Adverbs attend most strongly to the verb they modify — chased.",
};

export function AttentionVisualizer() {
  const [queryIdx, setQueryIdx] = useState(3); // default: "chased"
  const [showSelfAttention, setShowSelfAttention] = useState(true);

  const weights = WEIGHTS[queryIdx];
  const sortedTargets = useMemo(
    () =>
      weights
        .map((w, i) => ({ token: TOKENS[i], weight: w, idx: i }))
        .sort((a, b) => b.weight - a.weight),
    [weights],
  );

  // Geometry for the SVG connections.
  const TOK_WIDTH = 76;
  const TOK_GAP = 18;
  const ROW_HEIGHT = 180;

  const tokenX = (i: number) => 20 + i * (TOK_WIDTH + TOK_GAP) + TOK_WIDTH / 2;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        margin: "20px 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(108,71,255,0.12)",
              border: "1px solid rgba(108,71,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Sparkles size={15} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
              Attention visualizer
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
              Click any word — see what it attends to
            </div>
          </div>
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 11.5,
            color: "var(--text-secondary)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={showSelfAttention}
            onChange={(e) => setShowSelfAttention(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Show self-attention
        </label>
      </div>

      {/* Diagram canvas */}
      <div style={{ padding: "20px 16px 8px", overflowX: "auto" }}>
        <svg
          width={20 + TOKENS.length * (TOK_WIDTH + TOK_GAP)}
          height={ROW_HEIGHT}
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* Curved arrows from query → each key */}
          {weights.map((w, i) => {
            if (i === queryIdx && !showSelfAttention) return null;
            const x1 = tokenX(queryIdx);
            const x2 = tokenX(i);
            const midY = 30;
            const startY = 60;
            const endY   = 60;
            const arcLift = 30 + Math.abs(i - queryIdx) * 9;
            const opacity = 0.15 + w * 1.6; // visually emphasise high weights
            const strokeW = 0.8 + w * 6;
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${startY} C ${x1} ${midY - arcLift}, ${x2} ${midY - arcLift}, ${x2} ${endY}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity={opacity}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                />
                {/* Weight label at apex */}
                {w > 0.12 && (
                  <text
                    x={(x1 + x2) / 2}
                    y={midY - arcLift + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--accent)"
                    style={{ pointerEvents: "none" }}
                  >
                    {(w * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Token row */}
          {TOKENS.map((tok, i) => {
            const isQuery = i === queryIdx;
            const w = weights[i];
            return (
              <g
                key={i}
                onClick={() => setQueryIdx(i)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={tokenX(i) - TOK_WIDTH / 2}
                  y={70}
                  width={TOK_WIDTH}
                  height={42}
                  rx={9}
                  fill={isQuery ? "var(--accent)" : "var(--bg-tertiary)"}
                  stroke={isQuery ? "var(--accent-hover)" : "var(--border-subtle)"}
                  strokeWidth={isQuery ? 0 : 1}
                />
                <text
                  x={tokenX(i)}
                  y={96}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight={isQuery ? 700 : 500}
                  fill={isQuery ? "#fff" : "var(--text-primary)"}
                  style={{ pointerEvents: "none" }}
                >
                  {tok}
                </text>
                {/* Weight bar underneath */}
                <rect
                  x={tokenX(i) - TOK_WIDTH / 2}
                  y={118}
                  width={TOK_WIDTH}
                  height={6}
                  rx={3}
                  fill="var(--bg-tertiary)"
                />
                <rect
                  x={tokenX(i) - TOK_WIDTH / 2}
                  y={118}
                  width={TOK_WIDTH * w}
                  height={6}
                  rx={3}
                  fill="var(--accent)"
                  opacity={0.85}
                />
                {/* Weight value */}
                <text
                  x={tokenX(i)}
                  y={142}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--text-tertiary)"
                  style={{ pointerEvents: "none" }}
                >
                  {(w * 100).toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Explanation strip */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ flex: 1, padding: "14px 18px" }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 4,
            }}
          >
            Query: <code style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}>&quot;{TOKENS[queryIdx]}&quot;</code>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {EXPLAIN[TOKENS[queryIdx]]}
          </div>
          <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--text-tertiary)" }}>
            Strongest: <strong style={{ color: "var(--text-secondary)" }}>{sortedTargets[0].token}</strong>{" "}
            ({(sortedTargets[0].weight * 100).toFixed(0)}%) ·{" "}
            <strong style={{ color: "var(--text-secondary)" }}>{sortedTargets[1].token}</strong>{" "}
            ({(sortedTargets[1].weight * 100).toFixed(0)}%) ·{" "}
            <strong style={{ color: "var(--text-secondary)" }}>{sortedTargets[2].token}</strong>{" "}
            ({(sortedTargets[2].weight * 100).toFixed(0)}%)
          </div>
        </div>

        <button
          onClick={() => setQueryIdx(3)}
          title="Reset to default"
          style={{
            background: "var(--bg-card)",
            border: "none",
            borderLeft: "1px solid var(--border-subtle)",
            padding: "0 16px",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            fontWeight: 500,
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>
    </div>
  );
}
