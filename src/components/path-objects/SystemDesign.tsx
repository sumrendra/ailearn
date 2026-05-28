import type { PathObjectProps } from "./types";

/**
 * Load balancer fanning to 4 servers, with a DB node at the bottom. The
 * canonical scaling diagram.
 */
export function SystemDesign({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const lb = { x: 180, y: 80 };
  const servers = [
    { x: 60, y: 200 },
    { x: 140, y: 200 },
    { x: 220, y: 200 },
    { x: 300, y: 200 },
  ];
  const db = { x: 180, y: 310 };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Load balancer with servers and DB"
    >
      <defs>
        <marker
          id="po-sys-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent, currentColor)" stroke="none" />
        </marker>
      </defs>

      {/* incoming traffic into LB */}
      <g stroke="var(--accent, currentColor)" strokeWidth={2} markerEnd="url(#po-sys-arrow)">
        <line
          x1={180}
          y1={20}
          x2={180}
          y2={lb.y - 24}
          className={animated ? "po-pipe" : undefined}
        />
      </g>

      {/* LB -> servers fan */}
      <g strokeWidth={1.5} stroke="var(--accent, currentColor)" opacity={0.85}>
        {servers.map((s, i) => (
          <line
            key={i}
            x1={lb.x}
            y1={lb.y + 22}
            x2={s.x}
            y2={s.y - 22}
            className={animated ? "po-pipe" : undefined}
            style={{ animationDelay: `${120 + i * 70}ms` }}
          />
        ))}
      </g>

      {/* servers -> DB */}
      <g strokeWidth={1.25} opacity={0.55}>
        {servers.map((s, i) => (
          <line
            key={i}
            x1={s.x}
            y1={s.y + 22}
            x2={db.x}
            y2={db.y - 26}
          />
        ))}
      </g>

      {/* LB node — diamond */}
      <g strokeWidth={2}>
        <path
          d={`M ${lb.x} ${lb.y - 22} L ${lb.x + 36} ${lb.y} L ${lb.x} ${lb.y + 22} L ${lb.x - 36} ${lb.y} Z`}
          stroke="var(--accent, currentColor)"
          fill="var(--accent, currentColor)"
          fillOpacity={0.1}
        />
        <line x1={lb.x - 16} y1={lb.y} x2={lb.x + 16} y2={lb.y} opacity={0.6} />
      </g>

      {/* server nodes — square + horizontal lines (rack icon) */}
      <g strokeWidth={1.75}>
        {servers.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 20} y={s.y - 22} width={40} height={44} rx={3} />
            <line x1={s.x - 14} y1={s.y - 10} x2={s.x + 14} y2={s.y - 10} opacity={0.55} />
            <line x1={s.x - 14} y1={s.y + 2} x2={s.x + 14} y2={s.y + 2} opacity={0.45} />
            <line x1={s.x - 14} y1={s.y + 14} x2={s.x + 14} y2={s.y + 14} opacity={0.35} />
          </g>
        ))}
      </g>

      {/* DB cylinder */}
      <g strokeWidth={2}>
        <ellipse cx={db.x} cy={db.y - 14} rx={42} ry={8} />
        <line x1={db.x - 42} y1={db.y - 14} x2={db.x - 42} y2={db.y + 18} />
        <line x1={db.x + 42} y1={db.y - 14} x2={db.x + 42} y2={db.y + 18} />
        <ellipse cx={db.x} cy={db.y + 18} rx={42} ry={8} />
        <ellipse cx={db.x} cy={db.y - 14} rx={42} ry={8} opacity={0.4} />
      </g>

      {animated && (
        <style>{`
          .po-pipe { stroke-dasharray: 200; stroke-dashoffset: 200; animation: po-pipe-dash 1.4s ease-out forwards; }
          @keyframes po-pipe-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
