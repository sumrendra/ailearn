"use client";

import { Flame, Zap, Target } from "lucide-react";
import { getLevelFromXP, formatXP } from "@/lib/utils";

const mockUser = {
  xp: 0,
  currentStreak: 0,
  streakFreezes: 2,
};

export function XPStreakWidget() {
  const { level, title, progress, nextXP } = getLevelFromXP(mockUser.xp);

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Level badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 4 }}>
            Your level
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
            Lv. {level}
          </div>
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, marginTop: 3 }}>
            {title}
          </div>
        </div>

        {/* Streak */}
        <div style={{
          background: mockUser.currentStreak > 0 ? "var(--streak-light)" : "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          padding: "8px 12px",
          textAlign: "center",
          border: "1px solid var(--border-subtle)",
        }}>
          <Flame size={18} color={mockUser.currentStreak > 0 ? "var(--streak-orange)" : "var(--text-tertiary)"} style={{ marginBottom: 2 }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: mockUser.currentStreak > 0 ? "var(--streak-orange)" : "var(--text-tertiary)", lineHeight: 1 }}>
            {mockUser.currentStreak}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>day streak</div>
        </div>
      </div>

      {/* XP Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <Zap size={12} style={{ display: "inline", marginRight: 4, color: "var(--xp-gold)" }} />
            {formatXP(mockUser.xp)} XP
          </span>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            Next: {formatXP(nextXP)} XP
          </span>
        </div>
        <div style={{
          height: 8, background: "var(--bg-tertiary)",
          borderRadius: "var(--radius-full)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, var(--accent), #a78bfa)",
            borderRadius: "var(--radius-full)",
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4, textAlign: "right" }}>
          {progress > 0 ? `${progress}% to Lv. ${level + 1}` : `Complete a lesson to earn XP`}
        </div>
      </div>

      {/* Goal nudge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "8px 12px",
      }}>
        <Target size={14} color="var(--accent)" />
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Complete your first lesson to start your streak
        </span>
      </div>
    </div>
  );
}
