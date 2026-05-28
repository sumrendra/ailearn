import type { PathObjectProps } from "./types";

/**
 * Two relational tables joined. Hairline rows; a join line connects matching
 * key columns; one matched row is highlighted on each side.
 */
export function SqlMastery({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const tableA = { x: 30, y: 70, w: 130, h: 220 };
  const tableB = { x: 200, y: 70, w: 130, h: 220 };
  const rows = 6;
  const rowH = tableA.h / rows;
  const headerH = 28;

  const matchedRowA = 2;
  const matchedRowB = 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="SQL relational join"
    >
      {[tableA, tableB].map((t, ti) => (
        <g key={ti} strokeWidth={1.5}>
          {/* table outline */}
          <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={4} />
          {/* header band */}
          <line x1={t.x} y1={t.y + headerH} x2={t.x + t.w} y2={t.y + headerH} />
          {/* row separators */}
          <g opacity={0.4} strokeWidth={1}>
            {Array.from({ length: rows - 1 }, (_, i) => {
              const y = t.y + headerH + ((t.h - headerH) / rows) * (i + 1);
              return (
                <line key={i} x1={t.x} y1={y} x2={t.x + t.w} y2={y} />
              );
            })}
            {/* column separator */}
            <line
              x1={t.x + 36}
              y1={t.y}
              x2={t.x + 36}
              y2={t.y + t.h}
            />
          </g>
        </g>
      ))}

      {/* highlighted matched rows */}
      <g stroke="var(--accent, currentColor)" strokeWidth={2}>
        <rect
          x={tableA.x}
          y={tableA.y + headerH + ((tableA.h - headerH) / rows) * matchedRowA}
          width={tableA.w}
          height={(tableA.h - headerH) / rows}
          rx={2}
          fill="var(--accent, currentColor)"
          fillOpacity={0.12}
        />
        <rect
          x={tableB.x}
          y={tableB.y + headerH + ((tableB.h - headerH) / rows) * matchedRowB}
          width={tableB.w}
          height={(tableB.h - headerH) / rows}
          rx={2}
          fill="var(--accent, currentColor)"
          fillOpacity={0.12}
        />
      </g>

      {/* join line connecting matched key columns */}
      {(() => {
        const ax = tableA.x + tableA.w;
        const ay =
          tableA.y +
          headerH +
          ((tableA.h - headerH) / rows) * (matchedRowA + 0.5);
        const bx = tableB.x;
        const by =
          tableB.y +
          headerH +
          ((tableB.h - headerH) / rows) * (matchedRowB + 0.5);
        return (
          <g
            stroke="var(--accent, currentColor)"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path
              d={`M ${ax} ${ay} C ${ax + 20} ${ay} ${bx - 20} ${by} ${bx} ${by}`}
              className={animated ? "po-join" : undefined}
            />
            <circle cx={ax} cy={ay} r={3.5} fill="var(--accent, currentColor)" />
            <circle cx={bx} cy={by} r={3.5} fill="var(--accent, currentColor)" />
          </g>
        );
      })()}

      {/* JOIN label as geometric "⋈" mark */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.5}
        transform="translate(180 310)"
      >
        <path d="M -8 -6 L 0 6 L 8 -6" />
        <path d="M -8 6 L 0 -6 L 8 6" opacity={0.55} />
      </g>

      {animated && (
        <style>{`
          .po-join { stroke-dasharray: 200; stroke-dashoffset: 200; animation: po-join-dash 1.6s ease-out forwards; }
          @keyframes po-join-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
