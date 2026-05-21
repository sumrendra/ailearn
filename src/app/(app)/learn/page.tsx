export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Brain, Database, Cpu, Zap, CheckCircle2 } from "lucide-react";

const PATH_META: Record<string, {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  gradient: string;
  color: string;
  patternColor: string;
}> = {
  "llm-foundations": {
    Icon: Brain,
    gradient: "linear-gradient(135deg, #4f35cc 0%, #7c5cff 50%, #9b6dff 100%)",
    color: "#6c47ff",
    patternColor: "rgba(255,255,255,0.06)",
  },
  "rag-vector-dbs": {
    Icon: Database,
    gradient: "linear-gradient(135deg, #0c5e58 0%, #0f766e 50%, #14b8a6 100%)",
    color: "#0f766e",
    patternColor: "rgba(255,255,255,0.06)",
  },
  "ai-agents": {
    Icon: Cpu,
    gradient: "linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)",
    color: "#b45309",
    patternColor: "rgba(255,255,255,0.06)",
  },
};

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};

export default async function LearnPage() {
  const paths = await prisma.learningPath.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  const totalLessons = paths.reduce((s, p) => s + p.lessons.length, 0);
  const totalXP = paths.reduce((s, p) => s + p.lessons.reduce((ls, l) => ls + (l.xpReward ?? 0), 0), 0);

  return (
    <>
      <Topbar title="Learning Paths" subtitle="Structured journeys from zero to production" />
      <div style={{ padding: "28px", maxWidth: 1040, width: "100%" }}>

        {/* Summary bar */}
        <div style={{
          display: "flex", gap: 24, marginBottom: 28, padding: "14px 20px",
          background: "var(--bg-card)", borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)",
        }}>
          {[
            { label: "Learning paths", value: paths.length, icon: "🗺️" },
            { label: "Total lessons", value: totalLessons, icon: "📖" },
            { label: "XP available", value: `${totalXP.toLocaleString()} XP`, icon: "⚡" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{s.label}</div>
              </div>
              <div style={{ width: 1, height: 28, background: "var(--border-subtle)", marginLeft: 14 }} />
            </div>
          ))}
        </div>

        {/* Path cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {paths.map((path) => {
            const meta = PATH_META[path.slug];
            const totalMins = path.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
            const totalHrs = totalMins > 0 ? (Math.round(totalMins / 6) / 10).toFixed(1) : (path.estimatedHours ?? 0);
            const pathXP = path.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0);
            const Icon = meta?.Icon ?? BookOpen;

            return (
              <div key={path.slug} style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
              }}>
                {/* Gradient hero */}
                <div style={{
                  background: meta?.gradient ?? "linear-gradient(135deg, #6c47ff, #9b6dff)",
                  padding: "28px 32px",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Decorative circles */}
                  <div style={{
                    position: "absolute", right: -40, top: -40,
                    width: 180, height: 180, borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                  }} />
                  <div style={{
                    position: "absolute", right: 60, bottom: -60,
                    width: 120, height: 120, borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                  }} />

                  <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 20 }}>
                    {/* Icon */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={28} color="#fff" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>
                          {path.title}
                        </h2>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 9px",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(255,255,255,0.2)",
                          color: "#fff", letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}>
                          {DIFF_LABEL[path.difficulty]}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.55, margin: "0 0 16px", maxWidth: 560 }}>
                        {path.description}
                      </p>

                      {/* Stats */}
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        {[
                          { icon: <BookOpen size={12} />, label: `${path.lessons.length} lessons` },
                          { icon: <Clock size={12} />, label: `${totalHrs}h total` },
                          { icon: <Zap size={12} />, label: `${pathXP} XP` },
                        ].map((s, i) => (
                          <span key={i} style={{
                            display: "flex", alignItems: "center", gap: 5,
                            fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500,
                          }}>
                            {s.icon} {s.label}
                          </span>
                        ))}
                      </div>

                      {/* Tags */}
                      {(path.tags as string[]).length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                          {(path.tags as string[]).slice(0, 5).map((tag) => (
                            <span key={tag} style={{
                              fontSize: 10, padding: "2px 8px",
                              background: "rgba(255,255,255,0.15)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "var(--radius-full)",
                              color: "rgba(255,255,255,0.85)",
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                      <div style={{
                        background: "rgba(255,255,255,0.95)", color: meta?.color ?? "#6c47ff",
                        padding: "11px 20px", borderRadius: "var(--radius-md)",
                        fontSize: 13, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}>
                        Start path <ArrowRight size={14} />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Lesson list */}
                <div>
                  {path.lessons.map((lesson, idx) => (
                    <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                      <div className="hover-item" style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 28px",
                        borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        cursor: "pointer",
                      }}>
                        {/* Number badge */}
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                          background: "var(--bg-tertiary)",
                          border: "2px solid var(--border-default)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)",
                        }}>
                          {idx + 1}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                            {lesson.title}
                          </div>
                          {lesson.description && (
                            <div style={{
                              fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.4,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {lesson.description}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                          {lesson.estimatedMins && (
                            <span style={{ fontSize: 11, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 3 }}>
                              <Clock size={10} /> {lesson.estimatedMins}m
                            </span>
                          )}
                          {lesson.xpReward && (
                            <span style={{
                              fontSize: 11, fontWeight: 600, color: "var(--xp-gold)",
                              background: "var(--xp-gold-light)", padding: "2px 7px",
                              borderRadius: "var(--radius-full)", border: "1px solid var(--xp-gold)30",
                            }}>
                              +{lesson.xpReward} XP
                            </span>
                          )}
                          <ChevronRight size={13} color="var(--text-tertiary)" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Footer CTA */}
                <div style={{
                  padding: "14px 28px",
                  background: "var(--bg-secondary)",
                  borderTop: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    {path.lessons.length} lessons  ·  0 completed
                  </span>
                  <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: meta?.color ?? "var(--accent)" }}>
                      View curriculum →
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ChevronRight({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
