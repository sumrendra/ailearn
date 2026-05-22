"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, BookOpen, FlipHorizontal,
  Trophy, Mic, Search, StickyNote,
  Settings, Sparkles, Flame, ChevronRight,
} from "lucide-react";

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
    <aside style={{
      width: "var(--sidebar-width)",
      minHeight: "100vh",
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      zIndex: 40,
    }}>
      {/* ── Logo ───────────────────────────────────────────────────────── */}
      <div style={{
        padding: "18px 20px 16px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #6c47ff, #9b6dff)",
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(108,71,255,0.35)",
              flexShrink: 0,
            }}>
              <Sparkles size={16} color="#fff" />
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
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 12px",
            background: "linear-gradient(90deg, rgba(234,87,10,0.08), rgba(234,87,10,0.04))",
            border: "1px solid rgba(234,87,10,0.15)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            transition: "background 0.12s",
          }}>
            <Flame size={14} color="var(--streak-orange)" />
            <span style={{ fontSize: 13, color: "var(--streak-orange)", fontWeight: 500, flex: 1 }}>
              Daily challenge
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              background: "var(--streak-orange)", color: "#fff",
              padding: "2px 6px", borderRadius: 4,
            }}>+25 XP</span>
          </div>
        </Link>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: "var(--text-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              padding: "10px 8px 4px",
            }}>
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "7px 10px",
                    borderRadius: "var(--radius-md)",
                    marginBottom: 1,
                    background: active ? "var(--accent-light)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: active ? 600 : 400,
                    fontSize: 13.5,
                    cursor: "pointer",
                    transition: "background 0.1s, color 0.1s",
                  }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLDivElement).style.background = "var(--bg-tertiary)";
                        (e.currentTarget as HTMLDivElement).style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLDivElement).style.background = "transparent";
                        (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: "var(--accent)", color: "#fff",
                        padding: "2px 5px", borderRadius: 4,
                        letterSpacing: "0.04em",
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
      <div style={{ padding: "8px 12px 16px", borderTop: "1px solid var(--border-subtle)" }}>
        <Link href="/settings" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 10px", borderRadius: "var(--radius-md)",
            color: pathname === "/settings" ? "var(--accent)" : "var(--text-secondary)",
            background: pathname === "/settings" ? "var(--accent-light)" : "transparent",
            fontSize: 13.5, cursor: "pointer",
          }}>
            <Settings size={16} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>Settings</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
