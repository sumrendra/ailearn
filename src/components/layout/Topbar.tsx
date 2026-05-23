"use client";

import { Sun, Moon, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header style={{
      height: 56,
      display: "flex",
      alignItems: "center",
      padding: "0 28px",
      background: "var(--bg-primary)",
      borderBottom: "1px solid var(--border-subtle)",
      gap: 16,
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title + breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <p style={{
            fontSize: 11, color: "var(--text-tertiary)",
            fontWeight: 500, marginBottom: 1,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {subtitle}
          </p>
        )}
        {title && (
          <h1 style={{
            fontSize: 15, fontWeight: 600,
            color: "var(--text-primary)", lineHeight: 1.2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
          }}>
            {title}
          </h1>
        )}
      </div>

      {/* Search — opens the global command palette */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("ailearn:open-palette"))}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)",
          padding: "6px 16px",
          cursor: "pointer",
          minWidth: 220,
          transition: "border-color 0.12s, box-shadow 0.12s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(108,71,255,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
        title="Open command palette"
      >
        <Search size={13} color="var(--text-tertiary)" />
        <span style={{ fontSize: 13, color: "var(--text-tertiary)", flex: 1, textAlign: "left" }}>
          Search courses, lessons...
        </span>
        <kbd style={{
          fontSize: 10,
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-default)",
          borderRadius: 4, padding: "1px 5px",
          color: "var(--text-tertiary)",
          fontFamily: "inherit",
        }}>⌘K</kbd>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{
          width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          cursor: "pointer",
          color: "var(--text-secondary)",
          transition: "all 0.12s",
          flexShrink: 0,
        }}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-tertiary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
        }}
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
