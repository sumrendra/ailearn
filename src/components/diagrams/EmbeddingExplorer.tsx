"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

/**
 * Embedding explorer — a 2D scatter of pre-computed word "embeddings".
 *
 * Real embeddings live in 768-1536 dim space; we project a hand-curated set
 * to 2D so the geometry is legible. The points reflect *actual* semantic
 * relationships: animals cluster together, programming terms cluster apart,
 * verbs vs. nouns separate along an axis, etc.
 *
 * The user clicks a word or types a query — we highlight the K nearest
 * neighbours by Euclidean distance and show their similarity scores.
 */

interface Point {
  word: string;
  x: number;
  y: number;
  category: "animal" | "food" | "tech" | "emotion" | "action";
}

// 2D coordinates designed so semantic groups cluster visually.
const POINTS: Point[] = [
  // Animals (top-left cluster)
  { word: "cat",       x: 120, y:  80, category: "animal" },
  { word: "dog",       x: 145, y:  95, category: "animal" },
  { word: "hamster",   x: 100, y:  60, category: "animal" },
  { word: "tiger",     x: 175, y:  70, category: "animal" },
  { word: "elephant",  x: 200, y: 110, category: "animal" },
  { word: "rabbit",    x: 115, y: 105, category: "animal" },
  { word: "wolf",      x: 165, y:  60, category: "animal" },

  // Food (top-right cluster)
  { word: "pizza",     x: 540, y:  90, category: "food" },
  { word: "burger",    x: 565, y: 110, category: "food" },
  { word: "salad",     x: 520, y:  60, category: "food" },
  { word: "pasta",     x: 555, y:  75, category: "food" },
  { word: "apple",     x: 480, y:  70, category: "food" },
  { word: "sushi",     x: 590, y:  95, category: "food" },

  // Tech (bottom-left)
  { word: "database",  x: 110, y: 350, category: "tech" },
  { word: "server",    x: 135, y: 365, category: "tech" },
  { word: "code",      x:  90, y: 330, category: "tech" },
  { word: "compiler",  x: 165, y: 340, category: "tech" },
  { word: "java",      x: 145, y: 310, category: "tech" },
  { word: "python",    x: 105, y: 305, category: "tech" },
  { word: "kafka",     x: 175, y: 375, category: "tech" },

  // Emotions (center)
  { word: "happy",     x: 320, y: 200, category: "emotion" },
  { word: "sad",       x: 345, y: 230, category: "emotion" },
  { word: "angry",     x: 300, y: 240, category: "emotion" },
  { word: "joy",       x: 330, y: 180, category: "emotion" },
  { word: "fear",      x: 360, y: 220, category: "emotion" },

  // Actions (bottom-right)
  { word: "run",       x: 530, y: 320, category: "action" },
  { word: "jump",      x: 555, y: 340, category: "action" },
  { word: "swim",      x: 510, y: 355, category: "action" },
  { word: "throw",     x: 575, y: 315, category: "action" },
  { word: "walk",      x: 540, y: 290, category: "action" },
];

const CATEGORY_COLOR: Record<Point["category"], string> = {
  animal:  "#7c5cff",
  food:    "#ea580c",
  tech:    "#0f766e",
  emotion: "#e11d48",
  action:  "#1d4ed8",
};

const CATEGORY_LABEL: Record<Point["category"], string> = {
  animal: "Animals",
  food: "Food",
  tech: "Tech",
  emotion: "Emotions",
  action: "Actions",
};

const CANVAS_W = 700;
const CANVAS_H = 420;
const K = 5; // neighbours to highlight

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Convert distance → similarity score in 0..1 range. Tighter clusters → higher.
function distanceToSimilarity(d: number): number {
  return Math.max(0, 1 - d / 320);
}

export function EmbeddingExplorer() {
  const [selected, setSelected] = useState<string>("cat");
  const [query, setQuery] = useState("");

  const focusPoint = useMemo(
    () => POINTS.find((p) => p.word === selected) ?? POINTS[0],
    [selected],
  );

  const neighbours = useMemo(() => {
    return POINTS
      .filter((p) => p.word !== focusPoint.word)
      .map((p) => ({ ...p, d: distance(focusPoint, p), sim: distanceToSimilarity(distance(focusPoint, p)) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, K);
  }, [focusPoint]);

  const neighbourSet = new Set(neighbours.map((n) => n.word));

  const filteredPoints = useMemo(() => {
    if (!query.trim()) return POINTS;
    const q = query.toLowerCase();
    return POINTS.filter((p) => p.word.includes(q));
  }, [query]);

  const visibleSet = new Set(filteredPoints.map((p) => p.word));

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
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          gap: 14, flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(15,118,110,0.12)",
            border: "1px solid rgba(15,118,110,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={15} color="#0f766e" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
              Embedding space
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
              Words with similar meanings live near each other
            </div>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={12} color="var(--text-tertiary)" style={{ position: "absolute", left: 9 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter words…"
            style={{
              padding: "5px 9px 5px 28px",
              fontSize: 12,
              border: "1px solid var(--border-subtle)",
              borderRadius: 7,
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              outline: "none",
              width: 160,
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", minHeight: CANVAS_H }}>
        {/* Canvas */}
        <div style={{ position: "relative", padding: "12px", borderRight: "1px solid var(--border-subtle)", overflow: "hidden" }}>
          <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} style={{ width: "100%", height: "100%", display: "block" }}>
            {/* Grid */}
            <defs>
              <pattern id="emb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="var(--border-subtle)" />
              </pattern>
            </defs>
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#emb-grid)" />

            {/* Connection lines to neighbours */}
            {neighbours.map((n) => (
              <line
                key={`line-${n.word}`}
                x1={focusPoint.x} y1={focusPoint.y}
                x2={n.x}          y2={n.y}
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeOpacity={0.25 + n.sim * 0.5}
                strokeDasharray="3 3"
              />
            ))}

            {/* Points */}
            {POINTS.map((p) => {
              const isFocus = p.word === focusPoint.word;
              const isNeighbour = neighbourSet.has(p.word);
              const isVisible = visibleSet.has(p.word);
              const opacity = isVisible ? 1 : 0.18;
              const color = CATEGORY_COLOR[p.category];

              return (
                <g
                  key={p.word}
                  onClick={() => isVisible && setSelected(p.word)}
                  style={{ cursor: isVisible ? "pointer" : "default", opacity }}
                >
                  <circle
                    cx={p.x} cy={p.y}
                    r={isFocus ? 9 : isNeighbour ? 6.5 : 4.5}
                    fill={color}
                    stroke={isFocus ? "#fff" : "transparent"}
                    strokeWidth={2}
                    filter={isFocus ? "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" : undefined}
                  />
                  <text
                    x={p.x}
                    y={p.y - (isFocus ? 14 : 10)}
                    textAnchor="middle"
                    fontSize={isFocus ? 13 : isNeighbour ? 11.5 : 10.5}
                    fontWeight={isFocus ? 700 : isNeighbour ? 600 : 500}
                    fill="var(--text-primary)"
                    style={{ pointerEvents: "none" }}
                  >
                    {p.word}
                  </text>
                </g>
              );
            })}

            {/* Focus ring */}
            <circle
              cx={focusPoint.x} cy={focusPoint.y}
              r={26}
              fill="none"
              stroke={CATEGORY_COLOR[focusPoint.category]}
              strokeWidth={1.5}
              strokeOpacity={0.35}
              strokeDasharray="3 4"
            />
          </svg>

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: 12, left: 16,
            display: "flex", flexWrap: "wrap", gap: 10,
            padding: "6px 10px",
            background: "color-mix(in srgb, var(--bg-card) 88%, transparent)",
            borderRadius: 7, border: "1px solid var(--border-subtle)",
            backdropFilter: "blur(4px)",
          }}>
            {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: CATEGORY_COLOR[key as Point["category"]],
                }} />
                <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: nearest neighbours */}
        <div style={{ background: "var(--bg-secondary)", padding: "16px 14px" }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--text-tertiary)",
            marginBottom: 6,
          }}>
            Focus
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            marginBottom: 14,
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: CATEGORY_COLOR[focusPoint.category],
              flexShrink: 0,
            }} />
            <code style={{
              fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
              color: "var(--text-primary)",
            }}>
              {focusPoint.word}
            </code>
          </div>

          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--text-tertiary)",
            marginBottom: 8,
          }}>
            Nearest neighbours
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {neighbours.map((n) => (
              <button
                key={n.word}
                onClick={() => setSelected(n.word)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 7,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: CATEGORY_COLOR[n.category],
                  flexShrink: 0,
                }} />
                <code style={{
                  flex: 1, fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--text-primary)", fontWeight: 500,
                }}>
                  {n.word}
                </code>
                {/* mini similarity bar */}
                <div style={{
                  width: 36, height: 4, borderRadius: 2,
                  background: "var(--bg-tertiary)", overflow: "hidden",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: `${n.sim * 100}%`, height: "100%",
                    background: "var(--accent)",
                  }} />
                </div>
                <span style={{ fontSize: 10.5, color: "var(--text-tertiary)", minWidth: 26, textAlign: "right" }}>
                  {(n.sim * 100).toFixed(0)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
