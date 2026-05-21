"use client";

import { Sun, Moon, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { theme, toggle } = useTheme();
  const router = useRouter();

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
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Search bar — links to /search */}
      <Link href="/search" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)",
          padding: "6px 14px",
          cursor: "pointer",
          minWidth: 220,
          transition: "border-color 0.12s, background 0.12s",
        }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)50";
            (e.currentTarget as HTMLDivElement).style.background = "var(--accent-light)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
            (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)";
          }}
        >
          <Search size={14} color="var(--text-tertiary)" />
          <span style={{ fontSize: 13, color: "var(--text-tertiary)", flex: 1 }}>
            Search lessons, concepts...
          </span>
          <kbd style={{
            fontSize: 10,
            background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
            borderRadius: 4, padding: "1px 5px", color: "var(--text-tertiary)",
          }}>⌘K</kbd>
        </div>
      </Link>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{
          width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)", cursor: "pointer",
          color: "var(--text-secondary)",
          transition: "all 0.12s",
        }}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-tertiary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)"; }}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
