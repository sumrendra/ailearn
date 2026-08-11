export const dynamic = "force-dynamic";

import Link from "next/link";
import { Waypoints } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getAllPaths } from "@/lib/content";
import { Topbar } from "@/components/layout/Topbar";
import { LearnHero } from "@/components/learn/LearnHero";
import { PathBentoGrid } from "@/components/learn/PathBentoGrid";
import type { PathCardData } from "@/components/learn/PathCard";

export default async function LearnPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const paths = getAllPaths();

  // Pull per-user progress
  let completedLessonSlugs = new Set<string>();
  if (userId) {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED" },
      select: { lessonSlug: true },
    });
    completedLessonSlugs = new Set(progress.map((p) => p.lessonSlug));
  }

  // Aggregates
  const totalLessons = paths.reduce((s, p) => s + p.lessons.length, 0);
  const totalXP = paths.reduce(
    (s, p) => s + p.lessons.reduce((a, l) => a + (l.xpReward ?? 0), 0),
    0,
  );
  const totalMins = paths.reduce(
    (s, p) => s + p.lessons.reduce((a, l) => a + (l.estimatedMins ?? 0), 0),
    0,
  );
  const completedCount = paths.reduce(
    (s, p) => s + p.lessons.filter((l) => completedLessonSlugs.has(l.slug)).length,
    0,
  );

  // Map to card data
  const cardData: PathCardData[] = paths.map((p) => {
    const lessonMins = p.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
    const lessonXP = p.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0);
    const completed = p.lessons.filter((l) => completedLessonSlugs.has(l.slug)).length;
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      lessonCount: p.lessons.length,
      totalMins: lessonMins,
      totalXP: lessonXP,
      completedLessons: completed,
      firstLessonSlug: p.lessons[0]?.slug,
    };
  });

  // Featured: most-progressed-but-incomplete. Falls back to the first
  // foundation path so a fresh user still gets a real CTA (no "0/0" tiles).
  const inProgress = cardData
    .filter((p) => (p.completedLessons ?? 0) > 0 && (p.completedLessons ?? 0) < p.lessonCount)
    .sort((a, b) => (b.completedLessons ?? 0) - (a.completedLessons ?? 0))[0];

  const featured = inProgress ?? cardData[0];

  const totalHrs = Math.round((totalMins / 60) * 10) / 10;

  return (
    <>
      <Topbar title="Learn" subtitle="Choose your next path" />

      <div
        className="stage"
        style={{
          width: "100%",
          // The .stage utility provides the responsive max-width + side
          // gutters; bottom padding gives the last bento row breathing room.
          paddingBottom: 96,
        }}
      >
        <LearnHero
          stats={{
            paths: paths.length,
            lessons: totalLessons,
            completed: completedCount,
            totalXP,
            totalHours: totalHrs,
            isAuthed: !!userId,
          }}
          featured={featured}
        />

        <Link
          href="/map"
          className="glass-pane glow-ring"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 40,
            padding: "16px 20px",
            borderRadius: "var(--radius-lg, 12px)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--accent-soft)",
                color: "var(--accent-text)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Waypoints size={18} strokeWidth={2.25} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Explore the knowledge map
              </div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
                Every course and lesson as one connected graph — pan, zoom, and open any page.
              </div>
            </div>
          </div>
          <span
            className="mono-overline"
            style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}
          >
            Open
          </span>
        </Link>

        <PathBentoGrid paths={cardData} />
      </div>
    </>
  );
}
