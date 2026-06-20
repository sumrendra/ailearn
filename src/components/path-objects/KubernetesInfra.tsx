import type { PathObjectProps } from "./types";

/**
 * Control plane hex + three worker nodes with pods — K8s path hero art.
 */
export function KubernetesInfra({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const accent = color ?? "#326ce5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={accent}
      className={className}
      role="img"
      aria-label="Kubernetes cluster"
    >
      <defs>
        <marker id="po-k8s-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent, currentColor)" stroke="none" />
        </marker>
      </defs>

      {/* control plane */}
      <g strokeWidth={1.75}>
        <polygon
          points="180,48 230,78 230,128 180,158 130,128 130,78"
          fill={`${accent}18`}
          stroke={accent}
        />
        <line x1={180} y1={68} x2={180} y2={88} opacity={0.5} />
        <line x1={165} y1={78} x2={195} y2={78} opacity={0.4} />
        <line x1={165} y1={88} x2={195} y2={88} opacity={0.3} />
      </g>

      {/* spokes to workers */}
      <g stroke="var(--accent, currentColor)" strokeWidth={1.5} markerEnd="url(#po-k8s-arrow)" opacity={0.7}>
        {[
          [180, 158, 80, 220],
          [180, 158, 180, 240],
          [180, 158, 280, 220],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={animated ? "po-k8s-flow" : undefined}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </g>

      {/* worker nodes */}
      {[80, 180, 280].map((cx, ni) => (
        <g key={ni} strokeWidth={1.75}>
          <rect x={cx - 42} y={220} width={84} height={72} rx={6} fill="currentColor" fillOpacity={0.06} />
          {[0, 1, 2].map((pi) => (
            <rect
              key={pi}
              x={cx - 32 + pi * 22}
              y={248}
              width={18}
              height={28}
              rx={3}
              fill={pi === 1 && ni === 1 ? "var(--accent, currentColor)" : "currentColor"}
              fillOpacity={pi === 1 && ni === 1 ? 0.35 : 0.12}
            />
          ))}
        </g>
      ))}

      {animated && (
        <style>{`
          .po-k8s-flow { stroke-dasharray: 200; stroke-dashoffset: 200; animation: po-k8s-dash 1.6s ease-out forwards; }
          @keyframes po-k8s-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
