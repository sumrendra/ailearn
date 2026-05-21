"use client";

import Link from "next/link";
import { Sparkles, FlipHorizontal, Mic, Trophy, ArrowRight } from "lucide-react";

const actions = [
  {
    href: "/tutor",
    icon: Sparkles,
    label: "Ask AI tutor",
    desc: "Get instant answers",
    color: "var(--accent)",
    bg: "var(--accent-light)",
  },
  {
    href: "/flashcards",
    icon: FlipHorizontal,
    label: "Review flashcards",
    desc: "Spaced repetition",
    color: "var(--info)",
    bg: "var(--info-light)",
  },
  {
    href: "/quiz",
    icon: Trophy,
    label: "Take a quiz",
    desc: "Test your knowledge",
    color: "var(--warning)",
    bg: "var(--warning-light)",
  },
  {
    href: "/interview",
    icon: Mic,
    label: "Mock interview",
    desc: "Practice for roles",
    color: "var(--success)",
    bg: "var(--success-light)",
  },
];

export function QuickActions() {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: 14 }}>
        Quick actions
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-secondary)",
                cursor: "pointer",
                transition: "all 0.12s",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = action.bg;
                  (e.currentTarget as HTMLDivElement).style.borderColor = action.color + "40";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: action.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={15} color={action.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{action.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{action.desc}</div>
                </div>
                <ArrowRight size={13} color="var(--text-tertiary)" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
