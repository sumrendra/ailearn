"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, BookOpen, FlipHorizontal,
  Trophy, Mic, Search, StickyNote, Flame,
  Settings, Sparkles, Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",      icon: LayoutDashboard },
  { href: "/learn",      label: "Learning paths",  icon: Map },
  { href: "/lessons",    label: "All lessons",     icon: BookOpen },
  { href: "/flashcards", label: "Flashcards",      icon: FlipHorizontal },
  { href: "/quiz",       label: "Quizzes",         icon: Trophy },
  { href: "/interview",  label: "Mock interviews", icon: Mic },
  { href: "/tutor",      label: "AI tutor",        icon: Sparkles, badge: "AI" },
  { href: "/search",     label: "Search",          icon: Search },
  { href: "/notes",      label: "My notes",        icon: StickyNote },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        minHeight: "100vh",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>A</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.1 }}>
                AILearn
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1 }}>
                Master AI engineering
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's challenge pill */}
      <div style={{ padding: "12px 12px 0" }}>
        <Link href="/challenge" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--streak-light)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer",
          }}>
            <Flame size={15} color="var(--streak-orange)" />
            <span style={{ fontSize: 13, color: "var(--streak-orange)", fontWeight: 500, flex: 1 }}>
              Daily challenge
            </span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              +25 XP
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", padding: "0 8px 6px" }}>
          Learn
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: "var(--radius-md)",
                  marginBottom: 2,
                  background: active ? "var(--accent-light)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: active ? 500 : 400,
                  fontSize: 14, cursor: "pointer",
                  transition: "all 0.12s",
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
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, background: "var(--accent)", color: "#fff",
                    padding: "2px 5px", borderRadius: 4, letterSpacing: "0.03em",
                  }}>{item.badge}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px 8px 16px", borderTop: "1px solid var(--border-subtle)" }}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: "var(--radius-md)",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-light)" : "transparent",
                fontSize: 14, cursor: "pointer",
              }}>
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* XP display */}
        <div style={{
          marginTop: 8, padding: "10px 10px",
          background: "var(--bg-tertiary)",
          borderRadius: "var(--radius-md)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: "var(--accent)",
          }}>
            <Zap size={14} />
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
              Start learning
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              Earn XP · Build streaks
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
