export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Brain, Database, Cpu, Zap } from "lucide-react";

const pathIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  "llm-foundations": Brain,
  "rag-vector-dbs": Database,
  "ai-agents": Cpu,
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

export default async function LearnPage() {
  const paths = await prisma.learningPath.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      <Topbar title="Learning Paths" subtitle="Structured journeys from foundations to mastery" />
      <div style={{ padding: "24px", maxWidth: 1100, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {paths.map((path) => {
            const { color, colorLight } = pathColorMap[path.slug] ?? { color: "var(--accent)", colorLight: "var(--accent-light)" };
            const Icon = pathIconMap[path.slug];
            const totalMins = path.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
            const totalHrs = totalMins > 0 ? `~${Math.round(totalMins / 6) / 10}h` : `~${path.estimatedHours ?? 0}h`;

            return (
              <div key={path.slug} style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
              }}>
                {/* Path header */}
                <div style={{
                  padding: "24px 28px",
                  background: colorLight,
                  display: "flex", alignItems: "flex-start", gap: 16,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: "var(--bg-card)",
                    border: `1.5px solid ${color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "var(--shadow-sm)", flexShrink: 0,
                  }}>
                    {Icon ? <Icon size={24} color={color} /> : <span style={{ fontSize: 22 }}>{path.icon ?? "📚"}</span>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color }}>{path.title}</h2>
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        color: difficultyColor[path.difficulty],
                        background: difficultyColor[path.difficulty] + "20",
                      }}>
                        {difficultyLabel[path.difficulty]}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 600 }}>
                      {path.description}
                    </p>
                    <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <BookOpen size={12} /> {path.lessons.length} lesson{path.lessons.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} /> {totalHrs} total
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Zap size={12} /> {path.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0)} XP available
                      </span>
                    </div>
                  </div>

                  <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                    <div style={{
                      background: color, color: "#fff",
                      padding: "10px 18px", borderRadius: "var(--radius-md)",
                      fontSize: 14, fontWeight: 500,
                      display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                    }}>
                      Start path <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>

                {/* Lesson list */}
                <div style={{ padding: "0 0 8px" }}>
                  {path.lessons.map((lesson, idx) => (
                    <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "13px 28px",
                        borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        cursor: "pointer", transition: "background 0.12s",
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: "var(--bg-tertiary)",
                          border: "2px solid var(--border-default)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)",
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>
                            {lesson.title}
                          </span>
                          {lesson.description && (
                            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2, lineHeight: 1.4 }}>
                              {lesson.description}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          {lesson.estimatedMins && (
                            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{lesson.estimatedMins} min</span>
                          )}
                          {lesson.xpReward && (
                            <span style={{ fontSize: 12, color: "var(--xp-gold)", fontWeight: 500 }}>+{lesson.xpReward} XP</span>
                          )}
                          <ArrowRight size={13} color="var(--text-tertiary)" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {path.lessons.length === 0 && (
                    <div style={{ padding: "24px 28px", color: "var(--text-tertiary)", fontSize: 14, textAlign: "center" }}>
                      Lessons coming soon
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
