"use client";

import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Zap } from "lucide-react";
import { getPathMeta } from "@/lib/learning-paths";

type PathData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  estimatedHours: number;
  tags: string[];
  lessons: { id: string; slug: string; title: string; xpReward: number; estimatedMins: number }[];
  progress: number;
};

const difficultyLabel: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};

export function LearningPathCards({ paths }: { paths: PathData[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {paths.map((path) => {
        const meta = getPathMeta(path.slug);
        const Icon = meta.Icon;
        const totalMins = path.lessons.reduce((s, l) => s + l.estimatedMins, 0);
        const hrs = totalMins > 0 ? `${(Math.round(totalMins / 6) / 10).toFixed(1)}h` : `${path.estimatedHours}h`;
        const totalXP = path.lessons.reduce((s, l) => s + l.xpReward, 0);

        return (
          <Link key={path.slug} href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                transition: "box-shadow 0.15s, transform 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Gradient header */}
              <div style={{
                background: meta.gradient,
                padding: "20px 20px 18px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <div style={{ position: "absolute", left: -15, bottom: -25, width: 80, height: 80, borderRadius: "50%", background: "rgba(0,0,0,0.07)" }} />

                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{path.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
                        {difficultyLabel[path.difficulty] ?? path.difficulty}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "#fff",
                    background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
                    padding: "3px 9px", borderRadius: "var(--radius-full)",
                  }}>
                    {path.lessons.length} lessons
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{
                  fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                  flex: 1, marginBottom: 14,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {path.description}
                </p>

                {path.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                    {path.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10, color: "var(--text-tertiary)",
                        background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                        padding: "2px 7px", borderRadius: "var(--radius-full)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-tertiary)" }}>
                      <Clock size={12} /> {hrs}
                    </span>
                    {totalXP > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--xp-gold)", fontWeight: 600 }}>
                        <Zap size={12} /> {totalXP} XP
                      </span>
                    )}
                    <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: meta.color }}>
                      {path.progress > 0 ? `${path.progress}% done` : "Start"} <ArrowRight size={12} />
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 4, background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-full)", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${path.progress}%`,
                      background: meta.color, borderRadius: "var(--radius-full)",
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
