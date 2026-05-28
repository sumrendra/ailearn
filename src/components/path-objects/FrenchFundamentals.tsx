import type { PathObjectProps } from "./types";

/**
 * Conjugation matrix: a 3x4 grid of phoneme circles linked by inflection arcs.
 * Calmer, linguistic-feeling.
 */
export function FrenchFundamentals({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const cols = 4;
  const rows = 3;
  const cellW = 70;
  const cellH = 70;
  const xPad = 50;
  const yPad = 80;

  const nodes: Array<{ x: number; y: number; r: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // gentle vertical wobble to avoid pure grid feel
      const wobble = ((c + r) % 2 === 0 ? -1 : 1) * 4;
      nodes.push({
        x: xPad + c * cellW,
        y: yPad + r * cellH + wobble,
        r: 9 + ((c * r) % 3),
      });
    }
  }

  // arcs: inflection patterns — row-wise connections + a few column shifts
  const arcs: Array<[number, number]> = [
    // person/tense within rows
    [0, 1],
    [1, 2],
    [2, 3],
    [4, 5],
    [5, 6],
    [6, 7],
    [8, 9],
    [9, 10],
    [10, 11],
    // tense shifts across rows
    [1, 5],
    [5, 9],
    [2, 6],
    [6, 10],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="French conjugation matrix"
    >
      {/* row guide lines */}
      <g opacity={0.18} strokeWidth={1}>
        {Array.from({ length: rows }, (_, r) => (
          <line
            key={r}
            x1={xPad - 20}
            y1={yPad + r * cellH}
            x2={xPad + (cols - 1) * cellW + 20}
            y2={yPad + r * cellH}
          />
        ))}
      </g>

      {/* arcs */}
      <g strokeWidth={1.25} strokeLinecap="round" opacity={0.7}>
        {arcs.map(([a, b], i) => {
          const A = nodes[a];
          const B = nodes[b];
          const mx = (A.x + B.x) / 2;
          const my = (A.y + B.y) / 2 - 14;
          const accent = i % 3 === 0;
          return (
            <path
              key={i}
              d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`}
              stroke={accent ? "var(--accent, currentColor)" : undefined}
              className={animated ? "po-arc" : undefined}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          );
        })}
      </g>

      {/* nodes (phonemes) */}
      <g strokeWidth={1.5}>
        {nodes.map((n, i) => {
          const accent = i === 5 || i === 9 || i === 2;
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              stroke={accent ? "var(--accent, currentColor)" : undefined}
              fill={accent ? "var(--accent, currentColor)" : "transparent"}
              fillOpacity={accent ? 0.18 : 0}
            />
          );
        })}
      </g>

      {/* diacritic mark — a single floating accent */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.75}
        strokeLinecap="round"
      >
        <line x1={nodes[5].x - 5} y1={nodes[5].y - 18} x2={nodes[5].x + 5} y2={nodes[5].y - 24} />
      </g>

      {animated && (
        <style>{`
          .po-arc { stroke-dasharray: 140; stroke-dashoffset: 140; animation: po-arc-dash 2.2s ease-out forwards; }
          @keyframes po-arc-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
