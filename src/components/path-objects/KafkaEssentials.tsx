import type { PathObjectProps } from "./types";

/**
 * Partitioned log: 3 parallel tracks with offset markers, producer arrow into
 * the top track, consumers reading from the bottom.
 */
export function KafkaEssentials({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const tracks = [110, 180, 250];
  const x0 = 60;
  const x1 = 300;
  const offsets = 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Kafka partitioned log"
    >
      <defs>
        <marker
          id="po-kafka-arrow"
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

      {/* producer node + arrow into top track */}
      <g strokeWidth={2}>
        <rect x={14} y={70} width={36} height={36} rx={4} />
        <line x1={28} y1={86} x2={42} y2={86} opacity={0.6} />
        <line x1={28} y1={94} x2={42} y2={94} opacity={0.4} />
      </g>
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.75}
        markerEnd="url(#po-kafka-arrow)"
      >
        <line
          x1={52}
          y1={88}
          x2={x0 - 4}
          y2={tracks[0]}
          className={animated ? "po-flow" : undefined}
        />
      </g>

      {/* tracks (partitions) — each is a horizontal line of offset cells */}
      <g strokeWidth={1.5}>
        {tracks.map((y, ti) => (
          <g key={ti}>
            {/* baseline */}
            <line x1={x0} y1={y} x2={x1} y2={y} opacity={0.5} />
            {/* offset cells */}
            {Array.from({ length: offsets }, (_, i) => {
              const w = (x1 - x0) / offsets;
              const cx = x0 + i * w;
              const filled =
                (ti === 0 && i < 6) || (ti === 1 && i < 5) || (ti === 2 && i < 4);
              const accent = ti === 0 && i === 5;
              return (
                <rect
                  key={i}
                  x={cx + 2}
                  y={y - 11}
                  width={w - 4}
                  height={22}
                  rx={2}
                  stroke={accent ? "var(--accent, currentColor)" : undefined}
                  fill={
                    accent
                      ? "var(--accent, currentColor)"
                      : filled
                        ? "currentColor"
                        : "transparent"
                  }
                  fillOpacity={accent ? 0.6 : filled ? 0.12 : 0}
                  opacity={filled ? 1 : 0.4}
                />
              );
            })}
            {/* partition label tick */}
            <line x1={x0 - 16} y1={y} x2={x0 - 6} y2={y} opacity={0.5} />
          </g>
        ))}
      </g>

      {/* consumer arrows reading from each track to consumer group */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.75}
        markerEnd="url(#po-kafka-arrow)"
        opacity={0.85}
      >
        {tracks.map((y, ti) => (
          <line
            key={ti}
            x1={x1 + 4}
            y1={y}
            x2={324}
            y2={290}
            className={animated ? "po-flow" : undefined}
            style={{ animationDelay: `${300 + ti * 80}ms` }}
          />
        ))}
      </g>
      <g strokeWidth={2}>
        <rect x={310} y={290} width={36} height={50} rx={4} />
        <line x1={318} y1={304} x2={338} y2={304} opacity={0.55} />
        <line x1={318} y1={314} x2={338} y2={314} opacity={0.4} />
        <line x1={318} y1={324} x2={338} y2={324} opacity={0.3} />
      </g>

      {animated && (
        <style>{`
          .po-flow { stroke-dasharray: 400; stroke-dashoffset: 400; animation: po-flow-dash 1.8s ease-out forwards; }
          @keyframes po-flow-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
