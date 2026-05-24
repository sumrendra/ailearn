export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getAllPaths } from "@/lib/content";
import { Topbar } from "@/components/layout/Topbar";
import { LearnHero } from "@/components/learn/LearnHero";
import { PathBentoGrid } from "@/components/learn/PathBentoGrid";
import { PathCard, type PathCardData } from "@/components/learn/PathCard";

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

  // Featured: most-progressed-but-incomplete; fall back to first
  const featured =
    cardData
      .filter((p) => (p.completedLessons ?? 0) > 0 && (p.completedLessons ?? 0) < p.lessonCount)
      .sort((a, b) => (b.completedLessons ?? 0) - (a.completedLessons ?? 0))[0] ??
    cardData[0];

  const totalHrs = Math.round((totalMins / 60) * 10) / 10;

  return (
    <>
      <Topbar title="Learn" subtitle="Choose your next path" />

      <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 32px 80px" }}>
        {/* Hero */}
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

        {/* Bento grid of all paths grouped by tier */}
        <PathBentoGrid paths={cardData} />

        {/* Detailed all-paths list */}
        <div style={{ marginTop: 64 }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 18,
            }}
          >
            All paths
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cardData.map((data) => (
              <PathCard key={data.slug} data={data} variant="row" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
