"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  /** The element whose scroll determines progress. Defaults to window. */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Accent color, falls back to var(--accent) */
  color?: string;
  /** Track height in px */
  height?: number;
}

/**
 * A thin progress bar that tracks scroll inside a container (or window).
 * Pinned to the top of its nearest positioned parent — drop it inside a
 * sticky/absolute container.
 */
export function ReadingProgress({ targetRef, color = "var(--accent)", height = 3 }: ReadingProgressProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const target = targetRef?.current ?? null;
    const compute = () => {
      if (target) {
        const max = target.scrollHeight - target.clientHeight;
        const p = max > 0 ? target.scrollTop / max : 0;
        setPct(Math.max(0, Math.min(1, p)));
      } else {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setPct(Math.max(0, Math.min(1, p)));
      }
    };

    compute();
    const node: EventTarget = target ?? window;
    node.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      node.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [targetRef]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height,
        background: "transparent",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}, hsl(196 87% 60%), hsl(330 87% 64%))`,
          transition: "width 0.1s ease",
          boxShadow: `0 0 12px ${color}`,
        }}
      />
    </div>
  );
}
