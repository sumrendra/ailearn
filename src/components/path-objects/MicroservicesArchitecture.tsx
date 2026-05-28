import type { PathObjectProps } from "./types";

/**
 * Service mesh graph: 6 service nodes with irregular connections; one entry
 * request arrow into the mesh.
 */
export function MicroservicesArchitecture({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const nodes = [
    { x: 100, y: 110, r: 22 }, // 0 gateway-ish
    { x: 200, y: 80, r: 18 }, // 1
    { x: 280, y: 140, r: 20 }, // 2
    { x: 250, y: 240, r: 18 }, // 3
    { x: 140, y: 250, r: 20 }, // 4
    { x: 70, y: 200, r: 16 }, // 5
  ];

  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 5],
    [1, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [4, 5],
    [0, 4],
    [2, 4],
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
      aria-label="Microservice mesh"
    >
      <defs>
        <marker
          id="po-ms-arrow"
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

      {/* faint enclosing mesh boundary */}
      <g opacity={0.15} strokeWidth={1}>
        <path d="M 60 110 Q 30 200 80 270 Q 180 330 280 280 Q 330 200 300 110 Q 220 50 130 70 Q 70 80 60 110 Z" />
      </g>

      {/* edges */}
      <g strokeWidth={1.5} opacity={0.7}>
        {edges.map(([a, b], i) => {
          const A = nodes[a];
          const B = nodes[b];
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              className={animated ? "po-edge" : undefined}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          );
        })}
      </g>

      {/* incoming request arrow into node 0 */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={2}
        strokeLinecap="round"
        markerEnd="url(#po-ms-arrow)"
      >
        <line
          x1={20}
          y1={60}
          x2={nodes[0].x - 16}
          y2={nodes[0].y - 12}
          className={animated ? "po-request" : undefined}
        />
      </g>

      {/* nodes — hex-like circles */}
      <g strokeWidth={1.75}>
        {nodes.map((n, i) => {
          const entry = i === 0;
          return (
            <g key={i}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                stroke={entry ? "var(--accent, currentColor)" : undefined}
                strokeWidth={entry ? 2.5 : 1.75}
                fill="var(--bg, transparent)"
              />
              <circle cx={n.x} cy={n.y} r={Math.max(3, n.r - 12)} opacity={0.5} />
            </g>
          );
        })}
      </g>

      {animated && (
        <style>{`
          .po-edge { stroke-dasharray: 220; stroke-dashoffset: 220; animation: po-edge-dash 1.4s ease-out forwards; }
          .po-request { stroke-dasharray: 140; stroke-dashoffset: 140; animation: po-edge-dash 0.9s ease-out forwards; }
          @keyframes po-edge-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
