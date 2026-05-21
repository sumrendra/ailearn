export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import { ArrowRight, BookOpen, Clock, ChevronLeft, Zap, Brain, Database, Cpu, Lock, PlayCircle } from "lucide-react";

const PATH_META: Record<string, {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  gradient: string;
  color: string;
}> = {
  "llm-foundations": {
    Icon: Brain,
    gradient: "linear-gradient(135deg, #4f35cc 0%, #7c5cff 60%, #9b6dff 100%)",
    color: "#6c47ff",
  },
  "rag-vector-dbs": {
    Icon: Database,
    gradient: "linear-gradient(135deg, #0c5e58 0%, #0f766e 60%, #14b8a6 100%)",
    color: "#0f766e",
  },
  "ai-agents": {
    Icon: Cpu,
    gradient: "linear-gradient(135deg, #92400e 0%, #b45309 60%, #d97706 100%)",
    color: "#b45309",
  },
};

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
};

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const path = await prisma.learningPath.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!path) notFound();

  const meta = PATH_META[path.slug];
  const Icon = meta?.Icon ?? BookOpen;
  const totalMins = path.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
  const totalHrs = totalMins > 0 ? (Math.round(totalMins / 6) / 10).toFixed(1) : (path.estimatedHours ?? 0);
  const totalXP = path.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0);

  return (
    <>
      <Topbar title={path.title} subtitle={DIFF_LABEL[path.difficulty] + " path"} />
      <div style={{ padding: "24px", maxWidth: 860, width: "100%" }}>

        {/* Back */}
        <Link href="/learn" style={{
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20,
          padding: "5px 0",
        }}>
          <ChevronLeft size={14} /> All learning paths
        </Link>

        {/* Hero card */}
        <div style={{
          borderRadius: "var(--radius-lg)", overflow: "hidden",
          boxShadow: "var(--shadow-lg)", marginBottom: 24,
          border: "1px solid var(--border-subtle)",
        }}>
          {/* Gradient hero */}
          <div style={{
            background: meta?.gradient ?? "linear-gradient(135deg, #6c47ff, #9b6dff)",
            padding: "40px 40px 36px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Decorative shapes */}
            <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", right: 100, bottom: -80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", left: -30, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(0,0,0,0.08)" }} />

            <div style={{ position: "relative" }}>
              {/* Icon */}
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <Icon size={34} color="#fff" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>
                  {path.title}
                </h1>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  {DIFF_LABEL[path.difficulty]}
                </span>
              </div>

              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 560 }}>
                {path.description}
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                {[
                  { icon: <BookOpen size={14} />, value: `${path.lessons.length}`, label: "Lessons" },
                  { icon: <Clock size={14} />, value: `${totalHrs}h`, label: "Total time" },
                  { icon: <Zap size={14} />, value: `${totalXP}`, label: "XP to earn" },
                ].map((stat, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 20px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: i === 0 ? "var(--radius-md) 0 0 var(--radius-md)" : i === 2 ? "0 var(--radius-md) var(--radius-md) 0" : "0",
                    marginRight: i < 2 ? -1 : 0,
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{stat.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA strip */}
          <div style={{
            padding: "16px 32px",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Ready to start?</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                0 of {path.lessons.length} lessons completed
              </div>
            </div>
            {path.lessons.length > 0 && (
              <Link href={`/lessons/${path.lessons[0].slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: meta?.color ?? "var(--accent)", color: "#fff",
                  padding: "11px 22px", borderRadius: "var(--radius-md)",
                  fontSize: 14, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  boxShadow: `0 4px 14px ${(meta?.color ?? "#6c47ff")}40`,
                }}>
                  <PlayCircle size={16} /> Start learning
                </div>
              </Link>
            )}
          </div>

          {/* Curriculum */}
          <div style={{ background: "var(--bg-card)" }}>
            <div style={{
              padding: "16px 32px",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Curriculum — {path.lessons.length} lessons
              </div>
            </div>

            {path.lessons.map((lesson, idx) => (
              <Link key={lesson.id} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                <div className="hover-item" style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "18px 32px",
                  borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  cursor: "pointer",
                }}>
                  {/* Step number with connector */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, flexShrink: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "var(--bg-tertiary)",
                      border: `2px solid var(--border-default)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "var(--text-tertiary)",
                    }}>
                      {idx + 1}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
                      {lesson.title}
                    </div>
                    {lesson.description && (
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.45 }}>
                        {lesson.description}
                      </div>
                    )}
                    {/* Tags */}
                    {lesson.tags && (lesson.tags as string[]).length > 0 && (
                      <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
                        {(lesson.tags as string[]).slice(0, 3).map((t) => (
                          <span key={t} style={{
                            fontSize: 10, padding: "1px 7px",
                            background: "var(--accent-light)", color: "var(--accent)",
                            borderRadius: "var(--radius-full)",
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    {lesson.estimatedMins && (
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={11} /> {lesson.estimatedMins}m
                      </span>
                    )}
                    {lesson.xpReward && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: "var(--xp-gold)", background: "var(--xp-gold-light)",
                        padding: "2px 8px", borderRadius: "var(--radius-full)",
                      }}>
                        +{lesson.xpReward} XP
                      </span>
                    )}
                    <ArrowRight size={14} color="var(--text-tertiary)" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
