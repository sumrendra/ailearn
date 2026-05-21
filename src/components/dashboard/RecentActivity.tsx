"use client";

import { BookOpen, FlipHorizontal, Trophy, Mic, Sparkles } from "lucide-react";

const activities = [
  { type: "lesson",    label: "No lessons yet",     sub: "Start your first lesson", time: "", icon: BookOpen, color: "var(--accent)" },
];

const emptyState = true;

export function RecentActivity() {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: 14 }}>
        Recent activity
      </div>

      {emptyState ? (
        <div style={{ textAlign: "center", padding: "20px 12px" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--accent-light)",
            border: "1.5px solid var(--accent)20",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 4px 12px rgba(108, 71, 255, 0.12)",
          }}>
            <Sparkles size={20} color="var(--accent)" style={{ animation: "pulse-soft 2.5s infinite" }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>
            Your journey starts here
          </div>
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
            Complete your first lesson to see activity here.
          </div>
          <a href="/learn" style={{
            display: "inline-block", marginTop: 14,
            fontSize: 13, color: "var(--accent)", fontWeight: 500,
            textDecoration: "none",
          }}>
            Browse learning paths →
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 12px",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: a.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color={a.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{a.sub}</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", flexShrink: 0 }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
