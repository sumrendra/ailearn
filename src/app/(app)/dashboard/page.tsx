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

  type RecentSession = {
    title: string; slug: string;
    pathTitle: string; pathSlug: string; pathColor: string;
    status: "IN_PROGRESS" | "COMPLETED";
    updatedAt: string;          // ISO — formatted client-side
    timeSpentMins: number;
    estimatedMins: number;
  };

  let recentSessions: RecentSession[] = [];
  let pathProgress: { slug: string; title: string; color: string; pct: number }[] = [];

  // The "currently learning" focus — the most recently-touched IN_PROGRESS row.
  let currentLesson: {
    title: string; slug: string;
    pathTitle: string; pathSlug: string; pathColor: string;
    timeSpentMins: number;
    estimatedMins: number;
    lastAccessedISO: string;
  } | null = null;

  // Today's queue — next 3 unstarted lessons across the path the user is on (or
  // the first path if no in-progress yet).
  let queue: { title: string; slug: string; estimatedMins: number; pathTitle: string; pathColor: string }[] = [];

  if (session?.user?.id) {
    const [user, completedCount, completedRows, recentRows] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, xp: true, level: true, currentStreak: true, longestStreak: true },
      }),
      prisma.lessonProgress.count({
        where: { userId: session.user.id, status: "COMPLETED" },
      }),
      prisma.lessonProgress.findMany({
        where: { userId: session.user.id, status: "COMPLETED" },
        select: { lessonSlug: true, completedAt: true, updatedAt: true, timeSpentMins: true, status: true },
        orderBy: { completedAt: "desc" },
      }),
      // ANY recent row (in-progress or completed), ordered by last touch.
      prisma.lessonProgress.findMany({
        where: { userId: session.user.id },
        select: { lessonSlug: true, updatedAt: true, timeSpentMins: true, status: true },
        orderBy: { updatedAt: "desc" },
        take: 6,
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

    // Recent sessions feed — most recently-touched lessons regardless of status
    recentSessions = recentRows
      .map((r) => {
        const lesson = getLessonBySlug(r.lessonSlug);
        if (!lesson) return null;
        return {
          title: lesson.title,
          slug: lesson.slug,
          pathTitle: lesson.pathTitle,
          pathSlug: lesson.pathSlug,
          pathColor: getPathMeta(lesson.pathSlug).color,
          status: (r.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS") as "IN_PROGRESS" | "COMPLETED",
          updatedAt: r.updatedAt.toISOString(),
          timeSpentMins: r.timeSpentMins,
          estimatedMins: lesson.estimatedMins ?? 0,
        };
      })
      .filter((r): r is RecentSession => r !== null);

    // Currently learning — most recent IN_PROGRESS; fallback to most recent overall
    const focus =
      recentRows.find((r) => r.status === "IN_PROGRESS") ??
      recentRows[0] ??
      null;

    if (focus) {
      const lesson = getLessonBySlug(focus.lessonSlug);
      if (lesson) {
        currentLesson = {
          title: lesson.title,
          slug: lesson.slug,
          pathTitle: lesson.pathTitle,
          pathSlug: lesson.pathSlug,
          pathColor: getPathMeta(lesson.pathSlug).color,
          timeSpentMins: focus.timeSpentMins,
          estimatedMins: lesson.estimatedMins ?? 0,
          lastAccessedISO: focus.updatedAt.toISOString(),
        };
      }
    }

    // Per-path completion percentage (across all COMPLETED, not just the page-of-6)
    pathProgress = paths.map((path) => {
      const done = completedRows.filter((r) => path.lessons.some((l) => l.slug === r.lessonSlug)).length;
      const pct = path.lessons.length > 0 ? Math.round((done / path.lessons.length) * 100) : 0;
      return {
        slug: path.slug,
        title: path.title,
        color: getPathMeta(path.slug).color,
        pct,
      };
    });

    // Build "today's queue" from the active path
    const activePathSlug = currentLesson?.pathSlug ?? paths[0]?.slug;
    const activePath = paths.find((p) => p.slug === activePathSlug);
    if (activePath) {
      const completedSlugs = new Set(completedRows.map((r) => r.lessonSlug));
      const focusSlug = currentLesson?.slug;
      queue = activePath.lessons
        .filter((l) => !completedSlugs.has(l.slug) && l.slug !== focusSlug)
        .slice(0, 3)
        .map((l) => ({
          title: l.title,
          slug: l.slug,
          estimatedMins: l.estimatedMins ?? 0,
          pathTitle: activePath.title,
          pathColor: getPathMeta(activePath.slug).color,
        }));
    }
  } else {
    // Guest queue — first three lessons across the very first path
    const firstPath = paths[0];
    if (firstPath) {
      queue = firstPath.lessons.slice(0, 3).map((l) => ({
        title: l.title,
        slug: l.slug,
        estimatedMins: l.estimatedMins ?? 0,
        pathTitle: firstPath.title,
        pathColor: getPathMeta(firstPath.slug).color,
      }));
    }
  }

  return (
    <DashboardClient
      isLoggedIn={!!session?.user}
      userStats={userStats}
      totalLessons={totalLessons}
      totalXP={totalXP}
      recentSessions={recentSessions}
      pathProgress={pathProgress}
      currentLesson={currentLesson}
      queue={queue}
    />
  );
}
