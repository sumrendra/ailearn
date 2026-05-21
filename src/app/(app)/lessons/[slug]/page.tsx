import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LessonViewer } from "@/components/learn/LessonViewer";
import { Topbar } from "@/components/layout/Topbar";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Zap } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: {
      path: {
        include: {
          lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, order: true, estimatedMins: true } },
        },
      },
    },
  });

  if (!lesson) notFound();

  const lessons = lesson.path.lessons;
  const currentIdx = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar
        title={lesson.title}
        subtitle={lesson.path.title}
      />

      <div style={{ display: "flex", flex: 1, gap: 0 }}>

        {/* Left sidebar — lesson list */}
        <div style={{
          width: 260, flexShrink: 0,
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          padding: "20px 0",
          position: "sticky", top: 0, height: "calc(100vh - 57px)",
          overflowY: "auto",
        }}>
          <div style={{ padding: "0 16px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>
            {lesson.path.title}
          </div>
          {lessons.map((l, idx) => {
            const isCurrent = l.slug === slug;
            return (
              <Link key={l.id} href={`/lessons/${l.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px",
                  background: isCurrent ? "var(--accent-light)" : "transparent",
                  borderLeft: isCurrent ? "3px solid var(--accent)" : "3px solid transparent",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: isCurrent ? "var(--accent)" : "var(--bg-tertiary)",
                    border: `2px solid ${isCurrent ? "var(--accent)" : "var(--border-default)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    color: isCurrent ? "#fff" : "var(--text-tertiary)",
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{
                    fontSize: 12, lineHeight: 1.4,
                    color: isCurrent ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: isCurrent ? 600 : 400,
                  }}>
                    {l.title}
                  </span>
                </div>
              </Link>
            );
          })}

          <div style={{ margin: "16px", borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
            <Link href={`/learn/${lesson.path.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)" }}>
              <ChevronLeft size={13} /> Back to path
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Lesson meta bar */}
          <div style={{
            padding: "12px 32px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            display: "flex", alignItems: "center", gap: 20,
          }}>
            {lesson.estimatedMins && (
              <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} /> {lesson.estimatedMins} min read
              </span>
            )}
            {lesson.xpReward && (
              <span style={{ fontSize: 12, color: "var(--xp-gold)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} /> +{lesson.xpReward} XP
              </span>
            )}
            {lesson.tags && (lesson.tags as string[]).length > 0 && (
              <div style={{ display: "flex", gap: 6, flex: 1 }}>
                {(lesson.tags as string[]).slice(0, 4).map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11, padding: "1px 7px", borderRadius: "var(--radius-full)",
                    background: "var(--accent-light)", color: "var(--accent)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Lesson content */}
          <LessonViewer
            content={lesson.content ?? "No content available for this lesson yet."}
            lessonTitle={lesson.title}
            lessonSlug={lesson.slug}
          />

          {/* Prev / Next navigation */}
          <div style={{
            padding: "20px 32px",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer", transition: "all 0.12s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-default)"; }}
                >
                  <ChevronLeft size={16} color="var(--text-tertiary)" />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Previous</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{prevLesson.title}</div>
                  </div>
                </div>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer", transition: "all 0.12s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-default)"; }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Next</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{nextLesson.title}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </div>
              </Link>
            ) : (
              <Link href={`/learn/${lesson.path.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 18px", borderRadius: "var(--radius-md)",
                  background: "var(--accent)", color: "#fff",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}>
                  Path complete! Back to overview <ChevronRight size={14} />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
