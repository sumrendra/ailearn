export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { Clock, Zap, ArrowRight } from "lucide-react";

const diffColor: Record<string, string> = {
  BEGINNER: "var(--beginner)",
  INTERMEDIATE: "var(--intermediate)",
  ADVANCED: "var(--advanced)",
};

export default async function LessonsPage() {
  const paths = await prisma.learningPath.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      <Topbar title="All Lessons" subtitle="Browse every lesson across all learning paths" />
      <div style={{ padding: "24px", maxWidth: 900, width: "100%" }}>
        {paths.map((path) => (
          <div key={path.id} style={{ marginBottom: 32 }}>
            {/* Path header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{path.icon ?? "📚"}</span>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  {path.title}
                </h2>
                <span style={{
                  fontSize: 11, fontWeight: 500,
                  color: diffColor[path.difficulty] ?? "var(--text-tertiary)",
                }}>
                  {path.difficulty.charAt(0) + path.difficulty.slice(1).toLowerCase()} · {path.lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Lessons */}
            <div style={{
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)", overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}>
              {path.lessons.map((lesson, idx) => (
                <Link key={lesson.id} href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 20px",
                    borderBottom: idx < path.lessons.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    transition: "background 0.12s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "var(--bg-tertiary)", border: "2px solid var(--border-default)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)",
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                        {lesson.title}
                      </div>
                      {lesson.description && (
                        <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                          {lesson.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                      {lesson.estimatedMins && (
                        <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> {lesson.estimatedMins}m
                        </span>
                      )}
                      {lesson.xpReward && (
                        <span style={{ fontSize: 12, color: "var(--xp-gold)", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
                          <Zap size={11} /> +{lesson.xpReward}
                        </span>
                      )}
                      <ArrowRight size={13} color="var(--text-tertiary)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
