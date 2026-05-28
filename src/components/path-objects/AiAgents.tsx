import type { PathObjectProps } from "./types";

/**
 * Closed observe-think-act loop. Three arcs form a triangle, an arrow traces
 * the loop direction.
 */
export function AiAgents({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  // three triangle vertices for the labeled nodes
  const nodes = [
    { x: 180, y: 70, label: "observe" },
    { x: 300, y: 260, label: "act" },
    { x: 60, y: 260, label: "think" },
  ];

  const r = 28;

  // arc paths between nodes (curved outward)
  const arc = (a: typeof nodes[0], b: typeof nodes[0]) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const cx = 180;
    const cy = 200;
    const dx = mx - cx;
    const dy = my - cy;
    const len = Math.hypot(dx, dy) || 1;
    const ox = mx + (dx / len) * 30;
    const oy = my + (dy / len) * 30;
    return `M ${a.x} ${a.y} Q ${ox} ${oy} ${b.x} ${b.y}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Agent observe-think-act loop"
    >
      <defs>
        <marker
          id="po-agent-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill="var(--accent, currentColor)"
            stroke="none"
          />
        </marker>
      </defs>

      {/* outer scaffold circle */}
      <circle cx={180} cy={200} r={150} opacity={0.18} strokeWidth={1} />

      {/* arcs */}
      <g strokeWidth={2} strokeLinecap="round">
        <path d={arc(nodes[0], nodes[1])} opacity={0.85} />
        <path d={arc(nodes[1], nodes[2])} opacity={0.85} />
        <path
          d={arc(nodes[2], nodes[0])}
          opacity={0.95}
          stroke="var(--accent, currentColor)"
          markerEnd="url(#po-agent-arrow)"
          className={animated ? "po-loop" : undefined}
        />
      </g>

      {/* nodes */}
      <g strokeWidth={2}>
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={r} fill="var(--bg, transparent)" />
            <circle cx={n.x} cy={n.y} r={r - 8} opacity={0.5} />
          </g>
        ))}
      </g>

      {/* center pivot */}
      <g strokeWidth={1} opacity={0.35}>
        <circle cx={180} cy={200} r={4} fill="currentColor" />
      </g>

      {animated && (
        <style>{`
          .po-loop { stroke-dasharray: 320; stroke-dashoffset: 320; animation: po-loop-dash 2.2s ease-in-out infinite; }
          @keyframes po-loop-dash { 0% { stroke-dashoffset: 320; } 60%,100% { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
