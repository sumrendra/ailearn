import type { PathObjectProps } from "./types";

/**
 * Layered architecture stack. Four horizontal bands (presentation, service,
 * persistence, data) with vertical connection lines through them.
 */
export function JavaFrameworks({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const layers = [
    { y: 50, label: "presentation" },
    { y: 130, label: "service" },
    { y: 210, label: "persistence" },
    { y: 290, label: "data" },
  ];
  const x = 50;
  const w = 260;
  const h = 56;

  const wires = [120, 170, 220, 270];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Layered framework stack"
    >
      {/* vertical connection wires running through layers */}
      <g opacity={0.35} strokeWidth={1} strokeDasharray="3 4">
        {wires.map((wx, i) => (
          <line
            key={i}
            x1={wx}
            y1={layers[0].y}
            x2={wx}
            y2={layers[3].y + h}
          />
        ))}
      </g>

      {/* layers */}
      <g strokeWidth={1.75}>
        {layers.map((l, i) => {
          const accent = i === 1;
          return (
            <g key={i}>
              <rect
                x={x}
                y={l.y}
                width={w}
                height={h}
                rx={4}
                stroke={accent ? "var(--accent, currentColor)" : undefined}
                fill={accent ? "var(--accent, currentColor)" : "transparent"}
                fillOpacity={accent ? 0.12 : 0}
                className={animated ? "po-layer" : undefined}
                style={{ animationDelay: `${i * 90}ms` }}
              />
              {/* inner divider line — small detail */}
              <line
                x1={x + 18}
                y1={l.y + h - 14}
                x2={x + w - 18}
                y2={l.y + h - 14}
                opacity={0.3}
              />
              {/* small icon mark on the left of each band */}
              <circle cx={x + 18} cy={l.y + h / 2} r={4} opacity={0.7} />
              <circle cx={x + 32} cy={l.y + h / 2} r={2} opacity={0.5} />
            </g>
          );
        })}
      </g>

      {/* connection nodes where wires meet layers */}
      <g
        stroke="var(--accent, currentColor)"
        fill="var(--accent, currentColor)"
        opacity={0.85}
      >
        {layers.map((l) =>
          wires.map((wx) => (
            <circle key={`${l.y}-${wx}`} cx={wx} cy={l.y + h / 2} r={2.5} />
          )),
        )}
      </g>

      {animated && (
        <style>{`
          .po-layer { transform-origin: center; opacity: 0; animation: po-layer-in 600ms ease-out forwards; }
          @keyframes po-layer-in { to { opacity: 1; } }
        `}</style>
      )}
    </svg>
  );
}
