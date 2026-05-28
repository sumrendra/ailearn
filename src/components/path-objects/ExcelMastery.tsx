import type { PathObjectProps } from "./types";

/**
 * Cell grid with formula trace. 5x4 grid; one target cell highlighted; arrows
 * from three precedent cells point into it.
 */
export function ExcelMastery({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  const cols = 5;
  const rows = 4;
  const cellW = 56;
  const cellH = 56;
  const xPad = 40;
  const yPad = 60;

  const target: [number, number] = [3, 2]; // col, row
  const precedents: Array<[number, number]> = [
    [0, 0],
    [1, 2],
    [2, 3],
  ];

  const cellRect = (c: number, r: number) => ({
    x: xPad + c * cellW,
    y: yPad + r * cellH,
    cx: xPad + c * cellW + cellW / 2,
    cy: yPad + r * cellH + cellH / 2,
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 360 360"
      fill="none"
      stroke={color ?? "currentColor"}
      className={className}
      role="img"
      aria-label="Excel formula trace"
    >
      <defs>
        <marker
          id="po-excel-arrow"
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

      {/* column header band */}
      <g opacity={0.35} strokeWidth={1}>
        <rect x={xPad} y={yPad - 22} width={cols * cellW} height={22} />
        <rect x={xPad - 22} y={yPad} width={22} height={rows * cellH} />
      </g>
      {/* tick marks for headers */}
      <g opacity={0.45} strokeWidth={1}>
        {Array.from({ length: cols }, (_, c) => (
          <line
            key={`h${c}`}
            x1={xPad + c * cellW + 8}
            y1={yPad - 11}
            x2={xPad + c * cellW + cellW - 8}
            y2={yPad - 11}
          />
        ))}
        {Array.from({ length: rows }, (_, r) => (
          <line
            key={`v${r}`}
            x1={xPad - 14}
            y1={yPad + r * cellH + cellH / 2}
            x2={xPad - 8}
            y2={yPad + r * cellH + cellH / 2}
          />
        ))}
      </g>

      {/* cells */}
      <g strokeWidth={1.2} opacity={0.55}>
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const { x, y } = cellRect(c, r);
            return <rect key={`${r}-${c}`} x={x} y={y} width={cellW} height={cellH} />;
          }),
        )}
      </g>

      {/* precedent cells */}
      <g strokeWidth={1.75}>
        {precedents.map(([c, r], i) => {
          const { x, y } = cellRect(c, r);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              fill="currentColor"
              fillOpacity={0.08}
            />
          );
        })}
      </g>

      {/* target cell (=formula) */}
      {(() => {
        const { x, y, cx, cy } = cellRect(target[0], target[1]);
        return (
          <g stroke="var(--accent, currentColor)">
            <rect
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              strokeWidth={2.5}
              fill="var(--accent, currentColor)"
              fillOpacity={0.14}
            />
            {/* fx mark */}
            <g strokeWidth={1.5} transform={`translate(${cx - 8} ${cy - 7})`}>
              <path d="M 0 14 L 0 4 Q 0 0 4 0 L 8 0" />
              <line x1={-2} y1={9} x2={6} y2={9} />
            </g>
          </g>
        );
      })()}

      {/* arrows from precedents to target */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.5}
        strokeLinecap="round"
        markerEnd="url(#po-excel-arrow)"
        opacity={0.9}
      >
        {precedents.map(([c, r], i) => {
          const a = cellRect(c, r);
          const t = cellRect(target[0], target[1]);
          // offset endpoints slightly toward target cell border
          const dx = t.cx - a.cx;
          const dy = t.cy - a.cy;
          const len = Math.hypot(dx, dy);
          const ex = t.cx - (dx / len) * (cellW / 2 + 2);
          const ey = t.cy - (dy / len) * (cellH / 2 + 2);
          const sx = a.cx + (dx / len) * 12;
          const sy = a.cy + (dy / len) * 12;
          return (
            <line
              key={i}
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              className={animated ? "po-trace" : undefined}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          );
        })}
      </g>

      {animated && (
        <style>{`
          .po-trace { stroke-dasharray: 240; stroke-dashoffset: 240; animation: po-trace-dash 1.4s ease-out forwards; }
          @keyframes po-trace-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
