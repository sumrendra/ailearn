import type { PathObjectProps } from "./types";

/**
 * Query vector retrieving a nearest-neighbor cluster. One large center dot,
 * dotted lines radiating to small grouped dots.
 */
export function RagVectorDbs({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  // small neighbor dots, arranged in loose clusters around the query
  const neighbors: Array<{ x: number; y: number; r: number; near?: boolean }> = [
    // close cluster (retrieved)
    { x: 240, y: 120, r: 7, near: true },
    { x: 268, y: 150, r: 6, near: true },
    { x: 252, y: 178, r: 8, near: true },
    { x: 110, y: 230, r: 7, near: true },
    { x: 138, y: 258, r: 6, near: true },
    // distractors (not retrieved)
    { x: 60, y: 90, r: 5 },
    { x: 310, y: 280, r: 5 },
    { x: 80, y: 310, r: 5 },
    { x: 320, y: 60, r: 4 },
    { x: 200, y: 310, r: 5 },
    { x: 40, y: 180, r: 5 },
    { x: 320, y: 200, r: 4 },
  ];

  const cx = 180;
  const cy = 180;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Vector query with nearest neighbors"
    >
      {/* concentric similarity rings */}
      <g opacity={0.18} strokeWidth={1}>
        <circle cx={cx} cy={cy} r={50} />
        <circle cx={cx} cy={cy} r={95} />
        <circle cx={cx} cy={cy} r={140} />
      </g>

      {/* distractor points */}
      <g opacity={0.4} strokeWidth={1.5}>
        {neighbors
          .filter((n) => !n.near)
          .map((n, i) => (
            <circle key={`d${i}`} cx={n.x} cy={n.y} r={n.r} />
          ))}
      </g>

      {/* retrieval lines */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.25}
        strokeDasharray="4 5"
        opacity={0.85}
      >
        {neighbors
          .filter((n) => n.near)
          .map((n, i) => (
            <line
              key={`l${i}`}
              x1={cx}
              y1={cy}
              x2={n.x}
              y2={n.y}
              className={animated ? "po-ray" : undefined}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
      </g>

      {/* retrieved neighbors */}
      <g
        stroke="var(--accent, currentColor)"
        fill="var(--accent, currentColor)"
        fillOpacity={0.15}
        strokeWidth={1.75}
      >
        {neighbors
          .filter((n) => n.near)
          .map((n, i) => (
            <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} />
          ))}
      </g>

      {/* query vector at center */}
      <g strokeWidth={2.5}>
        <circle cx={cx} cy={cy} r={14} />
        <circle cx={cx} cy={cy} r={4} fill="currentColor" />
      </g>

      {animated && (
        <style>{`
          .po-ray { stroke-dasharray: 4 5; animation: po-ray-pulse 2.4s ease-in-out infinite; }
          @keyframes po-ray-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        `}</style>
      )}
    </svg>
  );
}
