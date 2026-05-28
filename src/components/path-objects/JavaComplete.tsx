import type { PathObjectProps } from "./types";

/**
 * Class hierarchy tree. Root branches into 3 children, each with sub-children.
 * Pure geometric tree, no labels.
 */
export function JavaComplete({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const root = { x: 180, y: 60 };
  const level2 = [
    { x: 80, y: 170 },
    { x: 180, y: 170 },
    { x: 280, y: 170 },
  ];
  const level3: Array<{ x: number; y: number; parent: number }> = [
    { x: 50, y: 290, parent: 0 },
    { x: 110, y: 290, parent: 0 },
    { x: 155, y: 290, parent: 1 },
    { x: 205, y: 290, parent: 1 },
    { x: 250, y: 290, parent: 2 },
    { x: 310, y: 290, parent: 2 },
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
      aria-label="Class hierarchy tree"
    >
      {/* connectors root -> level2 (orthogonal) */}
      <g strokeWidth={1.5} strokeLinecap="round">
        {level2.map((n, i) => (
          <path
            key={i}
            d={`M ${root.x} ${root.y + 22} L ${root.x} ${(root.y + n.y) / 2} L ${n.x} ${(root.y + n.y) / 2} L ${n.x} ${n.y - 22}`}
            opacity={0.7}
            className={animated ? "po-tree" : undefined}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
        {/* level2 -> level3 */}
        {level3.map((n, i) => {
          const p = level2[n.parent];
          return (
            <path
              key={`l3-${i}`}
              d={`M ${p.x} ${p.y + 22} L ${p.x} ${(p.y + n.y) / 2} L ${n.x} ${(p.y + n.y) / 2} L ${n.x} ${n.y - 22}`}
              opacity={0.55}
              stroke={i === 2 || i === 3 ? "var(--accent, currentColor)" : undefined}
              className={animated ? "po-tree" : undefined}
              style={{ animationDelay: `${300 + i * 80}ms` }}
            />
          );
        })}
      </g>

      {/* root node — rounded square (class) */}
      <g strokeWidth={2}>
        <rect x={root.x - 26} y={root.y - 18} width={52} height={36} rx={4} />
        <line x1={root.x - 26} y1={root.y - 6} x2={root.x + 26} y2={root.y - 6} opacity={0.6} />
      </g>

      {/* level2 nodes */}
      <g strokeWidth={1.75}>
        {level2.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 22} y={n.y - 16} width={44} height={32} rx={4} />
            <line x1={n.x - 22} y1={n.y - 4} x2={n.x + 22} y2={n.y - 4} opacity={0.55} />
          </g>
        ))}
      </g>

      {/* level3 nodes (leaves) */}
      <g strokeWidth={1.5}>
        {level3.map((n, i) => {
          const accent = i === 2 || i === 3;
          return (
            <rect
              key={i}
              x={n.x - 16}
              y={n.y - 12}
              width={32}
              height={24}
              rx={3}
              stroke={accent ? "var(--accent, currentColor)" : undefined}
              fill={accent ? "var(--accent, currentColor)" : "transparent"}
              fillOpacity={accent ? 0.15 : 0}
            />
          );
        })}
      </g>

      {animated && (
        <style>{`
          .po-tree { stroke-dasharray: 260; stroke-dashoffset: 260; animation: po-tree-dash 1.6s ease-out forwards; }
          @keyframes po-tree-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
