"use client";

import { Sun, Moon, Bell, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header style={{
      height: 60,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      background: "var(--bg-primary)",
      borderBottom: "1px solid var(--border-subtle)",
      gap: 16,
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title */}
      <div style={{ flex: 1 }}>
        {title && (
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Search bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-full)",
        padding: "6px 14px",
        cursor: "pointer",
        minWidth: 220,
      }}>
        <Search size={14} color="var(--text-tertiary)" />
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          Search lessons, concepts...
        </span>
        <kbd style={{
          marginLeft: "auto", fontSize: 10,
          background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
          borderRadius: 4, padding: "1px 5px", color: "var(--text-tertiary)",
        }}>⌘K</kbd>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Notifications */}
        <button
          style={{
            width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "var(--radius-md)", border: "none",
            background: "transparent", cursor: "pointer",
            color: "var(--text-secondary)",
            position: "relative",
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--accent)",
            border: "1.5px solid var(--bg-primary)",
          }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "var(--radius-md)", border: "none",
            background: "transparent", cursor: "pointer",
            color: "var(--text-secondary)",
          }}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
