export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LessonViewer } from "@/components/learn/LessonViewer";
import { Topbar } from "@/components/layout/Topbar";
import { ChevronLeft, ChevronRight, Clock, Zap, BookOpen, CheckCircle2 } from "lucide-react";

const PATH_COLOR: Record<string, { color: string; light: string; label: string }> = {
  "llm-foundations": { color: "#6c47ff", light: "rgba(108,71,255,0.08)", label: "LLM Foundations" },
  "rag-vector-dbs":  { color: "#0f766e", light: "rgba(15,118,110,0.08)",  label: "RAG & Vector DBs" },
  "ai-agents":       { color: "#b45309", light: "rgba(180,83,9,0.08)",    label: "AI Agents" },
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
            select: {
              id: true, slug: true, title: true, order: true,
              estimatedMins: true, xpReward: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const lessons   = lesson.path.lessons;
  const currentIdx = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;
  const pathColors = PATH_COLOR[lesson.path.slug] ?? {
    color: "var(--accent)", light: "var(--accent-light)", label: lesson.path.title,
  };

  // Simple progress: treat "past" lessons as completed (no auth in this version)
  const completedCount = currentIdx; // lessons before current assumed done

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title={lesson.title} subtitle={lesson.path.title} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Lesson sidebar ──────────────────────────────────────────────── */}
        <aside style={{
          width: 260, flexShrink: 0,
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          display: "flex", flexDirection: "column",
          height: "100%", overflowY: "auto",
        }}>

          {/* Path banner */}
          <div style={{
            padding: "14px 16px 12px",
            background: pathColors.light,
            borderBottom: "1px solid var(--border-subtle)",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: pathColors.color, marginBottom: 5,
            }}>
              Learning path
            </div>
            <div style={{
              fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)",
              lineHeight: 1.25, marginBottom: 6,
            }}>
              {lesson.path.title}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 10 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 10.5, color: "var(--text-tertiary)", marginBottom: 5,
              }}>
                <span>{completedCount} of {lessons.length} done</span>
                <span style={{ fontWeight: 600, color: pathColors.color }}>
                  {Math.round((completedCount / lessons.length) * 100)}%
                </span>
              </div>
              <div style={{
                height: 5, background: "rgba(0,0,0,0.08)",
                borderRadius: "var(--radius-full)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${Math.round((completedCount / lessons.length) * 100)}%`,
                  background: pathColors.color,
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          </div>

          {/* Lesson list */}
          <div style={{ flex: 1 }}>
            {lessons.map((l, idx) => {
              const isCurrent = l.slug === slug;
              const isPast    = idx < currentIdx;
              const isFuture  = idx > currentIdx;

              return (
                <Link key={l.id} href={`/lessons/${l.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className={isCurrent ? "" : "hover-item"}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "11px 14px",
                      background: isCurrent ? pathColors.light : "transparent",
                      borderLeft: isCurrent
                        ? `3px solid ${pathColors.color}`
                        : "3px solid transparent",
                      transition: "background 0.12s",
                      opacity: isFuture ? 0.6 : 1,
                    }}
                  >
                    {/* Step indicator */}
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      flexShrink: 0, marginTop: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isPast
                        ? "var(--success)"
                        : isCurrent
                          ? pathColors.color
                          : "transparent",
                      border: `2px solid ${
                        isPast
                          ? "var(--success)"
                          : isCurrent
                            ? pathColors.color
                            : "var(--border-default)"
                      }`,
                      fontSize: 10, fontWeight: 700,
                      color: (isPast || isCurrent) ? "#fff" : "var(--text-tertiary)",
                    }}>
                      {isPast
                        ? <CheckCircle2 size={13} strokeWidth={2.5} />
                        : <span>{idx + 1}</span>
                      }
                    </div>

                    {/* Lesson info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12.5, lineHeight: 1.4,
                        color: isCurrent
                          ? pathColors.color
                          : isPast
                            ? "var(--text-secondary)"
                            : "var(--text-tertiary)",
                        fontWeight: isCurrent ? 600 : isPast ? 400 : 400,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {l.title}
                      </div>
                      {l.estimatedMins && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 10.5, color: "var(--text-tertiary)", marginTop: 3,
                        }}>
                          <Clock size={9} /> {l.estimatedMins} min
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Back to path link */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <Link href={`/learn/${lesson.path.slug}`} style={{
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500,
              transition: "color 0.12s",
            }}>
              <ChevronLeft size={12} /> Back to path overview
            </Link>
          </div>
        </aside>

        {/* ── Main content area ───────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <LessonViewer
            content={lesson.content ?? "No content available for this lesson yet."}
            lessonTitle={lesson.title}
            lessonSlug={lesson.slug}
            pathName={lesson.path.title}
            pathSlug={lesson.path.slug}
            pathColor={pathColors.color}
            estimatedMins={lesson.estimatedMins}
            xpReward={lesson.xpReward}
            lessonIndex={currentIdx}
            totalLessons={lessons.length}
          />

          {/* ── Prev / Next navigation bar ─────────────────────────────── */}
          <div style={{
            padding: "14px 32px",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexShrink: 0, gap: 16,
          }}>
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-secondary)", cursor: "pointer",
                  transition: "border-color 0.12s",
                }}>
                  <ChevronLeft size={14} color="var(--text-tertiary)" />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 1 }}>
                      Previous
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
                      maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {prevLesson.title}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px", borderRadius: "var(--radius-md)",
                  background: pathColors.color, color: "#fff",
                  cursor: "pointer",
                  boxShadow: `0 4px 12px ${pathColors.color}50`,
                  transition: "opacity 0.12s",
                }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>
                      Next lesson
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {nextLesson.title}
                    </div>
                  </div>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ) : (
              <Link href={`/learn/${lesson.path.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 20px", borderRadius: "var(--radius-md)",
                  background: pathColors.color, color: "#fff",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  boxShadow: `0 4px 12px ${pathColors.color}50`,
                }}>
                  <BookOpen size={14} /> Path complete — view overview
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
