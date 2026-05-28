import type { PathObjectProps } from "./types";

/**
 * JVM internals: stacked memory regions (Heap, Stack, Method Area) with GC
 * arrows and abstract pointer connections between objects in the heap.
 */
export function JavaAdvanced({
  color,
  size = 360,
  animated = true,
  className,
}: PathObjectProps) {
  // big heap region on left, stack on top-right, method area on bottom-right
  const heap = { x: 30, y: 60, w: 200, h: 240 };
  const stack = { x: 250, y: 60, w: 80, h: 130 };
  const methodArea = { x: 250, y: 210, w: 80, h: 90 };

  // heap object cells
  const objs = [
    { x: 55, y: 90, w: 36, h: 28, live: true },
    { x: 110, y: 100, w: 32, h: 26, live: true },
    { x: 170, y: 92, w: 30, h: 28, live: false },
    { x: 60, y: 160, w: 30, h: 24, live: false },
    { x: 110, y: 170, w: 38, h: 30, live: true },
    { x: 170, y: 165, w: 28, h: 28, live: true },
    { x: 80, y: 230, w: 34, h: 28, live: false },
    { x: 140, y: 230, w: 40, h: 30, live: true },
  ];

  // pointer references between live objects
  const refs: Array<[number, number]> = [
    [0, 1],
    [1, 4],
    [4, 5],
    [5, 7],
  ];

  const centerOf = (o: { x: number; y: number; w: number; h: number }) => ({
    x: o.x + o.w / 2,
    y: o.y + o.h / 2,
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
      aria-label="JVM memory regions and GC"
    >
      <defs>
        <marker
          id="po-jvm-arrow"
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

      {/* Heap region */}
      <g strokeWidth={1.5}>
        <rect x={heap.x} y={heap.y} width={heap.w} height={heap.h} rx={6} />
        {/* young/old generations */}
        <line
          x1={heap.x}
          y1={heap.y + 120}
          x2={heap.x + heap.w}
          y2={heap.y + 120}
          opacity={0.4}
          strokeDasharray="3 4"
        />
        <line
          x1={heap.x}
          y1={heap.y + 200}
          x2={heap.x + heap.w}
          y2={heap.y + 200}
          opacity={0.3}
          strokeDasharray="3 4"
        />
      </g>

      {/* heap objects */}
      <g strokeWidth={1.5}>
        {objs.map((o, i) => (
          <rect
            key={i}
            x={o.x}
            y={o.y}
            width={o.w}
            height={o.h}
            rx={3}
            opacity={o.live ? 1 : 0.35}
            stroke={o.live ? undefined : "currentColor"}
            strokeDasharray={o.live ? undefined : "3 3"}
            fill={o.live ? "currentColor" : "transparent"}
            fillOpacity={o.live ? 0.08 : 0}
          />
        ))}
      </g>

      {/* pointer refs */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.5}
        markerEnd="url(#po-jvm-arrow)"
        opacity={0.85}
      >
        {refs.map(([a, b], i) => {
          const A = centerOf(objs[a]);
          const B = centerOf(objs[b]);
          return (
            <path
              key={i}
              d={`M ${A.x} ${A.y} Q ${(A.x + B.x) / 2} ${(A.y + B.y) / 2 - 14} ${B.x - 6} ${B.y}`}
              className={animated ? "po-ref" : undefined}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          );
        })}
      </g>

      {/* GC sweep arrow on dead objects */}
      <g
        stroke="var(--accent, currentColor)"
        strokeWidth={1.25}
        opacity={0.55}
        strokeLinecap="round"
      >
        <path
          d="M 60 280 Q 100 300 200 280"
          markerEnd="url(#po-jvm-arrow)"
          className={animated ? "po-gc" : undefined}
        />
      </g>

      {/* Stack region — frames */}
      <g strokeWidth={1.5}>
        <rect x={stack.x} y={stack.y} width={stack.w} height={stack.h} rx={4} />
        {Array.from({ length: 4 }, (_, i) => (
          <line
            key={i}
            x1={stack.x}
            y1={stack.y + 24 + i * 24}
            x2={stack.x + stack.w}
            y2={stack.y + 24 + i * 24}
            opacity={0.4}
          />
        ))}
      </g>

      {/* Method Area */}
      <g strokeWidth={1.5}>
        <rect
          x={methodArea.x}
          y={methodArea.y}
          width={methodArea.w}
          height={methodArea.h}
          rx={4}
        />
        <line
          x1={methodArea.x + 10}
          y1={methodArea.y + 22}
          x2={methodArea.x + methodArea.w - 10}
          y2={methodArea.y + 22}
          opacity={0.5}
        />
        <line
          x1={methodArea.x + 10}
          y1={methodArea.y + 44}
          x2={methodArea.x + methodArea.w - 24}
          y2={methodArea.y + 44}
          opacity={0.4}
        />
        <line
          x1={methodArea.x + 10}
          y1={methodArea.y + 66}
          x2={methodArea.x + methodArea.w - 16}
          y2={methodArea.y + 66}
          opacity={0.35}
        />
      </g>

      {/* stack -> heap connector */}
      <g strokeWidth={1.25} opacity={0.55} strokeDasharray="2 4">
        <line x1={stack.x} y1={stack.y + 60} x2={heap.x + heap.w - 20} y2={150} />
      </g>

      {animated && (
        <style>{`
          .po-ref { stroke-dasharray: 80; stroke-dashoffset: 80; animation: po-ref-dash 1.4s ease-out forwards; }
          .po-gc { stroke-dasharray: 200; stroke-dashoffset: 200; animation: po-ref-dash 1.8s ease-out forwards; }
          @keyframes po-ref-dash { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
    </svg>
  );
}
