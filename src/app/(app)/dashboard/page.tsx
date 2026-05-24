export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAllPaths, getLessonBySlug } from "@/lib/content";
import { getPathMeta } from "@/lib/learning-paths";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  const paths = getAllPaths();

  const totalLessons = paths.reduce((s, p) => s + p.lessons.length, 0);
  const totalXP      = paths.reduce((s, p) => s + p.lessons.reduce((a, l) => a + (l.xpReward ?? 0), 0), 0);

  let userStats = {
    name: "Guest",
    xp: 0, level: 1,
    currentStreak: 0, longestStreak: 0,
    completedLessons: 0,
  };

  let recentLessons: { title: string; slug: string; pathTitle: string; pathSlug: string; pathColor: string }[] = [];
  let pathProgress: Record<string, number> = {};

  if (session?.user?.id) {
    const [user, completedCount, progressRows] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, xp: true, level: true, currentStreak: true, longestStreak: true },
      }),
      prisma.lessonProgress.count({
        where: { userId: session.user.id, status: "COMPLETED" },
      }),
      prisma.lessonProgress.findMany({
        where: { userId: session.user.id, status: "COMPLETED" },
        select: { lessonSlug: true, completedAt: true },
        orderBy: { completedAt: "desc" },
        take: 4,
      }),
    ]);

    if (user) {
      userStats = {
        name: user.name ?? session.user.email?.split("@")[0] ?? "You",
        xp: user.xp, level: user.level,
        currentStreak: user.currentStreak, longestStreak: user.longestStreak,
        completedLessons: completedCount,
      };
    }

    // Join user progress against in-memory content
    recentLessons = progressRows
      .map((r) => {
        const lesson = getLessonBySlug(r.lessonSlug);
        if (!lesson) return null;
        return {
          title: lesson.title,
          slug: lesson.slug,
          pathTitle: lesson.pathTitle,
          pathSlug: lesson.pathSlug,
          pathColor: getPathMeta(lesson.pathSlug).color,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    // Per-path completion percentage
    for (const path of paths) {
      const done = progressRows.filter((r) => path.lessons.some((l) => l.slug === r.lessonSlug)).length;
      pathProgress[path.slug] = path.lessons.length > 0 ? Math.round((done / path.lessons.length) * 100) : 0;
    }
  }

  const firstPath = paths[0];
  const firstLesson = firstPath?.lessons[0];

  return (
    <DashboardClient
      isLoggedIn={!!session?.user}
      userStats={userStats}
      totalLessons={totalLessons}
      totalXP={totalXP}
      recentLessons={recentLessons}
      pathProgress={pathProgress}
      continuePath={firstPath ? {
        title: firstPath.title,
        slug: firstPath.slug,
        color: getPathMeta(firstPath.slug).color,
        lesson: firstLesson ? { title: firstLesson.title, slug: firstLesson.slug } : null,
      } : null}
      paths={paths.map(p => ({
        title: p.title,
        slug: p.slug,
        color: getPathMeta(p.slug).color,
        totalLessons: p.lessons.length,
        xpAvailable: p.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0),
        firstLesson: p.lessons[0] ? { slug: p.lessons[0].slug } : null,
      }))}
    />
  );
}
