import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import { ArrowRight, BookOpen, Clock, CheckCircle2, Circle, ChevronLeft } from "lucide-react";

const diffColor: Record<string, string> = {
  BEGINNER: "var(--beginner)",
  INTERMEDIATE: "var(--intermediate)",
  ADVANCED: "var(--advanced)",
};

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const path = await prisma.learningPath.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!path) notFound();

  const totalMins = path.lessons.reduce((sum, l) => sum + (l.estimatedMins ?? 0), 0);
  const totalHours = Math.round(totalMins / 60 * 10) / 10;

  return (
    <>
      <Topbar
        title={path.title}
        subtitle={path.description ?? ""}
      />
      <div style={{ padding: "24px", maxWidth: 860, width: "100%" }}>

        {/* Back */}
        <Link href="/learn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20 }}>
          <ChevronLeft size={14} /> All learning paths
        </Link>

        {/* Path header card */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
          boxShadow: "var(--shadow-sm)", marginBottom: 24,
        }}>
          <div style={{
            padding: "28px 32px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "flex-start", gap: 20,
          }}>
            <div style={{ fontSize: 48, lineHeight: 1 }}>
              {path.icon ?? "📚"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
                  {path.title}
                </h1>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: "2px 9px",
                  borderRadius: "var(--radius-full)",
                  color: diffColor[path.difficulty] ?? "var(--text-tertiary)",
                  background: (diffColor[path.difficulty] ?? "#888") + "18",
                }}>
                  {path.difficulty.charAt(0) + path.difficulty.slice(1).toLowerCase()}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14, maxWidth: 560 }}>
                {path.description}
              </p>
              <div style={{ display: "flex", gap: 20 }}>
                <span style={{ fontSize: 13, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
                  <BookOpen size={13} /> {path.lessons.length} lessons
                </span>
                <span style={{ fontSize: 13, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} /> ~{totalHours}h total
                </span>
              </div>
            </div>

            {path.lessons.length > 0 && (
              <Link href={`/lessons/${path.lessons[0].slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div style={{
                  background: "var(--accent)", color: "#fff",
                  padding: "11px 20px", borderRadius: "var(--radius-md)",
                  fontSize: 14, fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                }}>
                  Start learning <ArrowRight size={14} />
                </div>
              </Link>
            )}
          </div>

          {/* Lessons list */}
          <div>
            {path.lessons.map((lesson, idx) => (
              <Link key={lesson.id} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 32px",
                  borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  {/* Number/status circle */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "var(--bg-tertiary)",
                    border: "2px solid var(--border-default)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600, color: "var(--text-tertiary)",
                  }}>
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>
                      {lesson.title}
                    </div>
                    {lesson.description && (
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.4 }}>
                        {lesson.description}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    {lesson.estimatedMins && (
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                        {lesson.estimatedMins} min
                      </span>
                    )}
                    {lesson.xpReward && (
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--xp-gold)" }}>
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
