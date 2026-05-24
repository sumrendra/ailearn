"use client";

import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Tri-state theme toggle (light / dark / system).
 *
 * Renders as a segmented pill — three buttons inside a rounded container,
 * the selected one filled with the accent surface. Tiny, premium, lives in
 * the sidebar or topbar.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: Array<{ value: "light" | "dark" | "system"; Icon: typeof Sun; label: string }> = [
    { value: "light",  Icon: Sun,     label: "Light"  },
    { value: "system", Icon: Monitor, label: "System" },
    { value: "dark",   Icon: Moon,    label: "Dark"   },
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: 3,
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 999,
        gap: 1,
      }}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(({ value, Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 999,
              border: "none",
              background: active ? "var(--bg-surface)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-tertiary)",
              cursor: "pointer",
              transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
              boxShadow: active ? "var(--shadow-xs)" : "none",
            }}
          >
            <Icon size={14} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Compact single-button toggle — light ↔ dark only. For very tight spaces.
 */
export function ThemeToggleCompact() {
  const { resolvedTheme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"}`}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-subtle)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.18s ease",
      }}
    >
      {resolvedTheme === "light"
        ? <Moon size={14} strokeWidth={2} />
        : <Sun  size={14} strokeWidth={2} />}
    </button>
  );
}
