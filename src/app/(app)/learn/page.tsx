export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Topbar } from "@/components/layout/Topbar";
import { KnowledgeMap } from "@/components/learn/KnowledgeMap";
import { PathCard, type PathCardData } from "@/components/learn/PathCard";
import { StatCard } from "@/components/learn/StatCard";
import { Map, BookOpen, Zap, Clock } from "lucide-react";

export default async function LearnPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch all paths + their lessons in one query.
  const paths = await prisma.learningPath.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, slug: true, estimatedMins: true, xpReward: true },
      },
    },
  });

  // Per-user lesson progress (single query, joined client-side).
  let completedLessonIds = new Set<string>();
  if (userId) {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED" },
      select: { lessonId: true },
    });
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  // Aggregate stats.
  const totalLessons = paths.reduce((s, p) => s + p.lessons.length, 0);
  const totalXP = paths.reduce(
    (s, p) => s + p.lessons.reduce((a, l) => a + (l.xpReward ?? 0), 0),
    0,
  );
  const totalMins = paths.reduce(
    (s, p) => s + p.lessons.reduce((a, l) => a + (l.estimatedMins ?? 0), 0),
    0,
  );
  const totalHrs = Math.round((totalMins / 60) * 10) / 10;
  const completedCount = paths.reduce(
    (s, p) => s + p.lessons.filter((l) => completedLessonIds.has(l.id)).length,
    0,
  );

  // Map each DB row into the shape PathCard expects.
  const cardData: PathCardData[] = paths.map((p) => {
    const lessonMins = p.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
    const lessonXP = p.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0);
    const completed = p.lessons.filter((l) => completedLessonIds.has(l.id)).length;
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

  // Pick the most-progressed-but-incomplete path as the featured hero.
  // Falls back to the first foundation path.
  const featured =
    cardData
      .filter((p) => (p.completedLessons ?? 0) > 0 && (p.completedLessons ?? 0) < p.lessonCount)
      .sort((a, b) => (b.completedLessons ?? 0) - (a.completedLessons ?? 0))[0] ??
    cardData[0];

  return (
    <>
      <Topbar title="Learning Paths" subtitle="Structured journeys from zero to production" />

      <div style={{ padding: "28px 32px", maxWidth: 1080, width: "100%" }}>
        {/* Stats strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <StatCard
            Icon={Map}
            iconColor="var(--accent)"
            value={paths.length}
            label="Learning paths"
          />
          <StatCard
            Icon={BookOpen}
            iconColor="#0f766e"
            value={totalLessons}
            label={userId ? `${completedCount} completed` : "Total lessons"}
          />
          <StatCard
            Icon={Zap}
            iconColor="var(--xp-gold)"
            value={`${totalXP.toLocaleString()} XP`}
            label="Available to earn"
          />
          <StatCard
            Icon={Clock}
            iconColor="#475569"
            value={`${totalHrs}h`}
            label="Estimated study time"
          />
        </div>

        {/* Featured / continue hero */}
        {featured && (
          <div style={{ marginBottom: 24 }}>
            <PathCard data={featured} variant="feature" />
          </div>
        )}

        {/* Knowledge Map (responsive grid of tiles) */}
        <div style={{ marginBottom: 28 }}>
          <KnowledgeMap paths={cardData} />
        </div>

        {/* Detailed list */}
        <div>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              marginBottom: 14,
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
