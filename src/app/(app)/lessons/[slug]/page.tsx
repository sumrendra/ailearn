export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LessonViewer } from "@/components/learn/LessonViewer";
import { Topbar } from "@/components/layout/Topbar";
import { ChevronLeft, ChevronRight, Clock, Zap, BookOpen } from "lucide-react";

const PATH_COLOR: Record<string, { color: string; light: string }> = {
  "llm-foundations": { color: "#6c47ff", light: "rgba(108,71,255,0.08)" },
  "rag-vector-dbs":  { color: "#0f766e", light: "rgba(15,118,110,0.08)" },
  "ai-agents":       { color: "#b45309", light: "rgba(180,83,9,0.08)" },
};

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
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, slug: true, title: true, order: true, estimatedMins: true, xpReward: true },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const lessons = lesson.path.lessons;
  const currentIdx = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;
  const pathColors = PATH_COLOR[lesson.path.slug] ?? { color: "var(--accent)", light: "var(--accent-light)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title={lesson.title} subtitle={lesson.path.title} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Left sidebar ─────────────────────────────────────────────────── */}
        <div style={{
          width: 252, flexShrink: 0,
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          display: "flex", flexDirection: "column",
          height: "100%", overflowY: "auto",
        }}>
          {/* Path header */}
          <div style={{
            padding: "14px 16px 12px",
            borderBottom: "1px solid var(--border-subtle)",
            background: pathColors.light,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: pathColors.color, marginBottom: 4 }}>
              Learning path
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
              {lesson.path.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
              Lesson {currentIdx + 1} of {lessons.length}
            </div>
          </div>

          {/* Lesson meta */}
          <div style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", gap: 14,
          }}>
            {lesson.estimatedMins && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-tertiary)" }}>
                <Clock size={11} /> {lesson.estimatedMins} min
              </span>
            )}
            {lesson.xpReward && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--xp-gold)", fontWeight: 600 }}>
                <Zap size={11} /> +{lesson.xpReward} XP
              </span>
            )}
          </div>

          {/* Lesson list */}
          <div style={{ flex: 1 }}>
            {lessons.map((l, idx) => {
              const isCurrent = l.slug === slug;
              const isPast = idx < currentIdx;
              return (
                <Link key={l.id} href={`/lessons/${l.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className={isCurrent ? "" : "hover-item"}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 14px",
                      background: isCurrent ? pathColors.light : "transparent",
                      borderLeft: isCurrent ? `3px solid ${pathColors.color}` : "3px solid transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    {/* Step circle */}
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                      background: isCurrent ? pathColors.color : isPast ? "var(--success)" : "var(--bg-tertiary)",
                      border: `2px solid ${isCurrent ? pathColors.color : isPast ? "var(--success)" : "var(--border-default)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700,
                      color: isCurrent || isPast ? "#fff" : "var(--text-tertiary)",
                    }}>
                      {isPast ? "✓" : idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, lineHeight: 1.4,
                        color: isCurrent ? pathColors.color : "var(--text-secondary)",
                        fontWeight: isCurrent ? 600 : 400,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {l.title}
                      </div>
                      {l.estimatedMins && (
                        <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>
                          {l.estimatedMins} min
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Back to path */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-subtle)" }}>
            <Link href={`/learn/${lesson.path.slug}`} style={{
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500,
            }}>
              <ChevronLeft size={13} /> Back to path overview
            </Link>
          </div>
        </div>

        {/* ── Main content (LessonViewer handles its own scroll + TOC) ──── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <LessonViewer
            content={lesson.content ?? "No content available for this lesson yet."}
            lessonTitle={lesson.title}
            lessonSlug={lesson.slug}
          />

          {/* Prev / Next navigation */}
          <div style={{
            padding: "16px 32px",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexShrink: 0,
          }}>
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-secondary)", cursor: "pointer",
                }}>
                  <ChevronLeft size={15} color="var(--text-tertiary)" />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 1 }}>Previous</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{prevLesson.title}</div>
                  </div>
                </div>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px", borderRadius: "var(--radius-md)",
                  background: pathColors.color, color: "#fff", cursor: "pointer",
                  boxShadow: `0 4px 12px ${pathColors.color}50`,
                }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>Next lesson</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{nextLesson.title}</div>
                  </div>
                  <ChevronRight size={15} />
                </div>
              </Link>
            ) : (
              <Link href={`/learn/${lesson.path.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: "var(--radius-md)",
                  background: pathColors.color, color: "#fff",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  <BookOpen size={14} /> Path complete! View overview
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
