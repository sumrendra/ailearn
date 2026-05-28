import type { PathObjectProps } from "./types";

/**
 * Prosody waveform: concentric arcs suggesting intonation, with note-mark dots
 * along them. The most lyrical of the set.
 */
export function FrenchAdvanced({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  // build concentric arcs across the upper canvas
  const cx = 180;
  const cy = 280;
  const arcs = [
    { r: 80, dots: 5, accent: false },
    { r: 130, dots: 7, accent: true },
    { r: 180, dots: 9, accent: false },
    { r: 230, dots: 11, accent: false },
  ];

  // arc spans 200deg (from -190 to -350 / equiv 170 to 10)
  const arcStart = Math.PI * (10 / 180);
  const arcEnd = Math.PI * (170 / 180);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Prosodic intonation arcs"
    >
      {/* arcs */}
      <g strokeWidth={1.5} strokeLinecap="round">
        {arcs.map((a, i) => {
          const startX = cx + a.r * Math.cos(Math.PI + arcStart);
          const startY = cy + a.r * Math.sin(Math.PI + arcStart);
          const endX = cx + a.r * Math.cos(Math.PI + arcEnd);
          const endY = cy + a.r * Math.sin(Math.PI + arcEnd);
          const accent = a.accent;
          return (
            <path
              key={i}
              d={`M ${startX} ${startY} A ${a.r} ${a.r} 0 0 1 ${endX} ${endY}`}
              opacity={accent ? 1 : 0.6}
              stroke={accent ? "var(--accent, currentColor)" : undefined}
              strokeWidth={accent ? 2 : 1.5}
              className={animated ? "po-arc-draw" : undefined}
              style={{ animationDelay: `${i * 140}ms` }}
            />
          );
        })}
      </g>

      {/* note-mark dots along arcs */}
      <g strokeWidth={1.5}>
        {arcs.flatMap((a, ai) => {
          const dots = [];
          for (let i = 0; i < a.dots; i++) {
            const t = i / (a.dots - 1);
            const angle = Math.PI + arcStart + (arcEnd - arcStart) * t;
            const x = cx + a.r * Math.cos(angle);
            const y = cy + a.r * Math.sin(angle);
            const emphasized =
              (ai === 1 && (i === 2 || i === 4)) || (ai === 2 && i === 4);
            dots.push(
              <circle
                key={`${ai}-${i}`}
                cx={x}
                cy={y}
                r={emphasized ? 4 : 2.5}
                stroke={emphasized ? "var(--accent, currentColor)" : undefined}
                fill={emphasized ? "var(--accent, currentColor)" : "currentColor"}
                fillOpacity={emphasized ? 0.9 : 0.6}
              />,
            );
          }
          return dots;
        })}
      </g>

      {/* stress mark — a small slanted tick at apex */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <line x1={172} y1={36} x2={184} y2={28} />
        <line x1={196} y1={52} x2={208} y2={44} opacity={0.6} />
      </g>

      {/* baseline tick — represents the speaker / origin */}
      <g strokeWidth={1.5} opacity={0.5}>
        <line x1={cx - 24} y1={cy} x2={cx + 24} y2={cy} />
        <circle cx={cx} cy={cy} r={3} fill="currentColor" />
      </g>

      {animated && (
        <style>{`
          .po-arc-draw { stroke-dasharray: 600; stroke-dashoffset: 600; animation: po-arc-draw-dash 2s ease-out forwards; }
          @keyframes po-arc-draw-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
