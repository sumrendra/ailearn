"use client";

import { Search } from "lucide-react";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  /** Optional right-side actions */
  actions?: React.ReactNode;
}

/**
 * Premium topbar — sticky, glass-blurred, minimal chrome. Sidebar carries
 * navigation; topbar carries page context + search + page actions.
 */
export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header
      className="glass"
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <p
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              fontWeight: 500,
              marginBottom: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.02em",
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
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 999,
          padding: "7px 14px",
          cursor: "pointer",
          minWidth: 260,
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-tertiary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-subtle)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
        }}
        title="Search (⌘K)"
      >
        <Search size={13} color="var(--text-tertiary)" />
        <span
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
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
            color: "var(--text-quaternary)",
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
