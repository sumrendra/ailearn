export const dynamic = "force-dynamic";

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

        <PathBentoGrid paths={cardData} />
      </div>
    </>
  );
}
