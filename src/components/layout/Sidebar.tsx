"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, BookOpen, FlipHorizontal,
  Trophy, Mic, Search, StickyNote,
  Settings, Sparkles, Flame,
} from "lucide-react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const navGroups = [
  {
    label: "Learn",
    items: [
      { href: "/dashboard",  label: "Dashboard",      icon: LayoutDashboard },
      { href: "/learn",      label: "Learning paths",  icon: Map },
      { href: "/lessons",    label: "All lessons",     icon: BookOpen },
    ],
  },
  {
    label: "Practice",
    items: [
      { href: "/flashcards", label: "Flashcards",      icon: FlipHorizontal },
      { href: "/quiz",       label: "Quizzes",         icon: Trophy },
      { href: "/interview",  label: "Mock interviews", icon: Mic },
    ],
  },
  {
    label: "AI tools",
    items: [
      { href: "/tutor",      label: "AI tutor",        icon: Sparkles, badge: "AI" },
      { href: "/search",     label: "Search",          icon: Search },
      { href: "/notes",      label: "My notes",        icon: StickyNote },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <aside
      className="glass-pane"
      style={{
        width: "var(--sidebar-width)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 40,
        border: "none",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* ── Logo ───────────────────────────────────────────────────────── */}
      <div
        className="hairline-b"
        style={{ padding: "18px 20px 16px" }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--accent) 35%, transparent)",
              flexShrink: 0,
            }}>
              <Sparkles size={16} color="var(--text-on-accent)" />
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: "var(--text-primary)", lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}>
                AILearn
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1, marginTop: 1 }}>
                Master AI engineering
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Daily challenge strip ───────────────────────────────────────── */}
      <div style={{ padding: "10px 12px 0" }}>
        <Link href="/challenge" style={{ textDecoration: "none" }}>
          <div
            className="hairline-t"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px",
              background: "color-mix(in srgb, var(--streak-orange) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--streak-orange) 18%, transparent)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: `background 0.18s ${EASE}`,
            }}
          >
            <Flame size={14} color="var(--streak-orange)" />
            <span style={{ fontSize: 13, color: "var(--streak-orange)", fontWeight: 500, flex: 1 }}>
              Daily challenge
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              background: "var(--streak-orange)", color: "var(--text-on-accent)",
              padding: "2px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)",
            }}>+25 XP</span>
          </div>
        </Link>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div
              className="mono-overline"
              style={{
                color: "var(--text-tertiary)",
                padding: "10px 8px 4px",
                display: "block",
              }}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    className={active ? undefined : "glow-ring"}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 10px",
                      borderRadius: "var(--radius-md)",
                      marginBottom: 1,
                      background: active ? "var(--accent-soft)" : "transparent",
                      color: active ? "var(--accent-text)" : "var(--text-secondary)",
                      outline: active ? "1px solid var(--accent)" : undefined,
                      outlineOffset: active ? "-1px" : undefined,
                      fontWeight: active ? 600 : 400,
                      fontSize: 13.5,
                      cursor: "pointer",
                      transition: `background 0.18s ${EASE}, color 0.18s ${EASE}, outline-color 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: "var(--accent)", color: "var(--text-on-accent)",
                        padding: "2px 5px", borderRadius: 4,
                        letterSpacing: "0.04em",
                        fontFamily: "var(--font-mono)",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom: settings ────────────────────────────────────────────── */}
      <div
        className="hairline-t"
        style={{ padding: "8px 12px 16px" }}
      >
        <Link href="/settings" style={{ textDecoration: "none" }}>
          <div
            className={pathname === "/settings" ? undefined : "glow-ring"}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px", borderRadius: "var(--radius-md)",
              color: pathname === "/settings" ? "var(--accent-text)" : "var(--text-secondary)",
              background: pathname === "/settings" ? "var(--accent-soft)" : "transparent",
              outline: pathname === "/settings" ? "1px solid var(--accent)" : undefined,
              outlineOffset: pathname === "/settings" ? "-1px" : undefined,
              fontSize: 13.5, cursor: "pointer",
              transition: `background 0.18s ${EASE}, color 0.18s ${EASE}, outline-color 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
            }}
          >
            <Settings size={16} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>Settings</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
