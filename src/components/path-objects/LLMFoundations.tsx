import type { PathObjectProps } from "./types";

/**
 * Token grid with attention lines. 5x5 grid of token cells; one query token
 * fans attention arcs to several value tokens.
 */
export function LLMFoundations({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) cells.push([r, c]);

  const cellSize = 44;
  const gap = 12;
  const origin = 30;
  const xy = (c: number, r: number) => [
    origin + c * (cellSize + gap),
    origin + r * (cellSize + gap),
  ];

  // query token = (1,2). value tokens = a handful of others
  const query: [number, number] = [2, 1];
  const values: Array<[number, number]> = [
    [0, 3],
    [3, 0],
    [4, 2],
    [1, 4],
  ];

  const center = (c: number, r: number) => {
    const [x, y] = xy(c, r);
    return [x + cellSize / 2, y + cellSize / 2];
  };

  const [qx, qy] = center(query[0], query[1]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="LLM token grid with attention"
    >
      <g opacity={0.35} strokeWidth={1}>
        {cells.map(([r, c], i) => {
          const [x, y] = xy(c, r);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={6}
            />
          );
        })}
      </g>

      {/* highlighted tokens */}
      <g strokeWidth={1.5}>
        {values.map(([c, r], i) => {
          const [x, y] = xy(c, r);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={6}
              opacity={0.9}
            />
          );
        })}
      </g>

      {/* query token, emphasized */}
      <g stroke="var(--accent, currentColor)" strokeWidth={2.5}>
        <rect
          x={xy(query[0], query[1])[0]}
          y={xy(query[0], query[1])[1]}
          width={cellSize}
          height={cellSize}
          rx={6}
        />
      </g>

      {/* attention arcs */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.85}
      >
        {values.map(([c, r], i) => {
          const [vx, vy] = center(c, r);
          const mx = (qx + vx) / 2;
          const my = (qy + vy) / 2 - 28;
          return (
            <path
              key={i}
              d={`M ${qx} ${qy} Q ${mx} ${my} ${vx} ${vy}`}
              className={animated ? "po-attn" : undefined}
              style={{ animationDelay: `${i * 90}ms` }}
            />
          );
        })}
      </g>

      {animated && (
        <style>{`
          .po-attn { stroke-dasharray: 220; stroke-dashoffset: 220; animation: po-attn-dash 1.6s ease-out forwards; }
          @keyframes po-attn-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
