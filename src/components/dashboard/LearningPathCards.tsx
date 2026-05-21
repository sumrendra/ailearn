"use client";

import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Brain, Database, Cpu } from "lucide-react";

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

const pathIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  "llm-foundations": Brain,
  "rag-vector-dbs":  Database,
  "ai-agents":       Cpu,
};

const pathColorMap: Record<string, { color: string; colorLight: string }> = {
  "llm-foundations": { color: "#6c47ff", colorLight: "rgba(108, 71, 255, 0.09)" },
  "rag-vector-dbs":  { color: "#0f766e", colorLight: "rgba(15, 118, 110, 0.09)" },
  "ai-agents":       { color: "#b45309", colorLight: "rgba(180, 83, 9, 0.09)" },
};

const difficultyLabel: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};
const difficultyColor: Record<string, string> = {
  BEGINNER: "var(--beginner)", INTERMEDIATE: "var(--intermediate)", ADVANCED: "var(--advanced)",
};

export function LearningPathCards({ paths }: { paths: PathData[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {paths.map((path) => {
        const { color, colorLight } = pathColorMap[path.slug] ?? { color: path.color, colorLight: path.color + "15" };
        const Icon = pathIconMap[path.slug];
        const totalMins = path.lessons.reduce((s, l) => s + l.estimatedMins, 0);
        const hrs = totalMins > 0 ? `~${Math.round(totalMins / 6) / 10}h` : `~${path.estimatedHours}h`;
        const totalXP = path.lessons.reduce((s, l) => s + l.xpReward, 0);

        return (
          <Link key={path.slug} href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              height: "100%",
              transition: "box-shadow 0.15s, transform 0.12s",
              display: "flex", flexDirection: "column",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Icon + Difficulty */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: colorLight,
                  border: `1.5px solid ${color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {Icon ? <Icon size={20} color={color} /> : <span style={{ fontSize: 22 }}>{path.icon || "📚"}</span>}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  color: difficultyColor[path.difficulty] ?? "var(--text-tertiary)",
                  background: (difficultyColor[path.difficulty] ?? "#888") + "18",
                  padding: "3px 8px", borderRadius: "var(--radius-full)",
                }}>
                  {difficultyLabel[path.difficulty] ?? path.difficulty}
                </span>
              </div>

              {/* Title + Desc */}
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                {path.title}
              </h3>
              <p style={{
                fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                flex: 1, marginBottom: 14,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {path.description}
              </p>

              {/* Tags */}
              {path.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {path.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{
                      fontSize: 11, color: "var(--text-tertiary)",
                      background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
                      padding: "2px 7px", borderRadius: "var(--radius-full)",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta + CTA */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-tertiary)" }}>
                    <BookOpen size={13} /> {path.lessons.length} lesson{path.lessons.length !== 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-tertiary)" }}>
                    <Clock size={13} /> {hrs}
                  </div>
                  {totalXP > 0 && (
                    <div style={{ fontSize: 12, color: "var(--xp-gold)", fontWeight: 500 }}>
                      +{totalXP} XP
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    flex: 1, height: 5,
                    background: "var(--bg-tertiary)", borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", width: `${path.progress}%`,
                      background: color, borderRadius: "var(--radius-full)",
                    }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color, fontSize: 12, fontWeight: 500 }}>
                    {path.progress > 0 ? `${path.progress}%` : "Start"} <ArrowRight size={12} />
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
