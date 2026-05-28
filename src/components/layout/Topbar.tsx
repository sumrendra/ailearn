"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  /** Optional right-side actions */
  actions?: React.ReactNode;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Premium topbar — sticky, frosted glass, scroll-aware opacity.
 *
 * At scrollY=0 the topbar nearly disappears (canvas + mesh show through);
 * as the user scrolls past ~120px it commits to full frost. The transition
 * is driven by a `--scroll-y` CSS custom property updated on a
 * requestAnimationFrame loop so we don't thrash layout on every scroll event.
 */
export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    let lastY = -1;
    const RAMP = 120; // px of scroll over which we commit to full frost

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const norm = Math.min(1, Math.max(0, y / RAMP));
      el.style.setProperty("--scroll-y", String(norm));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update(); // initial paint
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="glass-pane"
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
        // Override .glass-pane's full border with a bottom-only hairline so
        // the topbar reads as a frosted shelf on the canvas, not a boxed bar.
        border: "none",
        borderBottom: "1px solid var(--border-subtle)",
        // Scroll-aware frost: nearly transparent at top, near-opaque past 120px.
        background: "hsl(220 17% 7% / calc(0.2 + var(--scroll-y, 0) * 0.65))",
        transition: `background 0.18s ${EASE}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <p
            className="mono-overline"
            style={{
              color: "var(--text-tertiary)",
              marginBottom: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {subtitle}
          </p>
        )}
        {title && (
          <h1
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Search — opens command palette */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("ailearn:open-palette"))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-sunken)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 999,
          padding: "7px 14px",
          cursor: "pointer",
          minWidth: 260,
          color: "var(--text-tertiary)",
          transition: `border-color 0.18s ${EASE}, background 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "var(--bg-overlay)";
          btn.style.borderColor = "var(--accent)";
          btn.style.boxShadow = "0 0 60px var(--accent-glow)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "var(--bg-sunken)";
          btn.style.borderColor = "var(--border-subtle)";
          btn.style.boxShadow = "none";
        }}
        title="Search (⌘K)"
      >
        <Search size={13} />
        <span
          style={{
            fontSize: 13,
            flex: 1,
            textAlign: "left",
          }}
        >
          Search courses, lessons…
        </span>
        <kbd
          style={{
            fontSize: 10.5,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 4,
            padding: "1px 5px",
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{actions}</div>
      )}
    </header>
  );
}
