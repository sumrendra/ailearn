export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getAllPaths } from "@/lib/content";
import { Topbar } from "@/components/layout/Topbar";
import { PathIcon } from "@/components/learn/PathIcon";
import { getPathMeta } from "@/lib/learning-paths";
import Link from "next/link";
import { Clock, Zap, ArrowRight, CheckCircle2, Circle } from "lucide-react";

const diffColor: Record<string, string> = {
  BEGINNER: "var(--beginner)",
  INTERMEDIATE: "var(--intermediate)",
  ADVANCED: "var(--advanced)",
};

const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export default async function LessonsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const paths = getAllPaths();

  let completedLessonSlugs = new Set<string>();
  if (userId) {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED" },
      select: { lessonSlug: true },
    });
    completedLessonSlugs = new Set(progress.map((p) => p.lessonSlug));
  }

  return (
    <>
      <Topbar title="All Lessons" subtitle="Every lesson across every path, in order" />
      <div style={{ padding: "28px 32px", maxWidth: 960, width: "100%" }}>
        {paths.map((path) => {
          const meta = getPathMeta(path.slug);
          const completed = path.lessons.filter((l) => completedLessonSlugs.has(l.slug)).length;
          return (
            <section key={path.slug} style={{ marginBottom: 36 }}>
              {/* Section header */}
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <PathIcon slug={path.slug} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {path.title}
                  </h2>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginTop: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: diffColor[path.difficulty], fontWeight: 600 }}>
                      {diffLabel[path.difficulty]}
                    </span>
                    <span>·</span>
                    <span>{path.lessons.length} lessons</span>
                    {userId && completed > 0 && (
                      <>
                        <span>·</span>
                        <span style={{ color: meta.color, fontWeight: 600 }}>
                          {completed} completed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </header>

              {/* Lesson list */}
              <div
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {path.lessons.map((lesson, idx) => {
                  const isComplete = completedLessonSlugs.has(lesson.slug);
                  return (
                    <Link
                      key={lesson.slug}
                      href={`/lessons/${lesson.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="hover-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "16px 22px",
                          borderBottom:
                            idx < path.lessons.length - 1
                              ? "1px solid var(--border-subtle)"
                              : "none",
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: isComplete ? `color-mix(in srgb, ${meta.color} 12%, transparent)` : "var(--bg-tertiary)",
                            border: isComplete ? `1.5px solid ${meta.color}` : "1.5px solid var(--border-default)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isComplete ? (
                            <CheckCircle2 size={16} color={meta.color} strokeWidth={2.4} />
                          ) : (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--text-tertiary)",
                              }}
                            >
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {lesson.title}
                          </div>
                          {lesson.description && (
                            <div
                              style={{
                                fontSize: 12.5,
                                color: "var(--text-tertiary)",
                                marginTop: 3,
                                lineHeight: 1.5,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {lesson.description}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            flexShrink: 0,
                          }}
                        >
                          {lesson.estimatedMins ? (
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text-tertiary)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Clock size={11} /> {lesson.estimatedMins}m
                            </span>
                          ) : null}
                          {lesson.xpReward ? (
                            <span
                              style={{
                                fontSize: 11.5,
                                fontWeight: 600,
                                color: "var(--xp-gold)",
                                background: "var(--xp-gold-light)",
                                padding: "2px 9px",
                                borderRadius: 999,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Zap size={10} /> +{lesson.xpReward}
                            </span>
                          ) : null}
                          <ArrowRight size={14} color="var(--text-tertiary)" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
