export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import { XPStreakWidget } from "@/components/dashboard/XPStreakWidget";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { LearningPathCards } from "@/components/dashboard/LearningPathCards";
import { TopicMasteryRadar } from "@/components/dashboard/TopicMasteryRadar";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import Link from "next/link";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function formatDate(d: Date) {
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function DashboardPage() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [paths, challenge] = await Promise.all([
    prisma.learningPath.findMany({
      orderBy: { order: "asc" },
      include: { lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, xpReward: true, estimatedMins: true } } },
    }),
    prisma.dailyChallenge.findFirst({
      where: { date: { gte: todayStart } },
      orderBy: { date: "asc" },
    }),
  ]);

  const serializedPaths = paths.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    icon: p.icon ?? "",
    color: p.color ?? "#6c47ff",
    difficulty: p.difficulty as string,
    estimatedHours: p.estimatedHours ?? 0,
    tags: (p.tags ?? []) as string[],
    lessons: p.lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      xpReward: l.xpReward ?? 0,
      estimatedMins: l.estimatedMins ?? 0,
    })),
    progress: 0,
  }));

  const serializedChallenge = challenge ? {
    id: challenge.id,
    type: challenge.type as string,
    title: challenge.title,
    content: challenge.content,
    xpReward: challenge.xpReward,
    tags: (challenge.tags ?? []) as string[],
  } : null;

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle={formatDate(now)}
      />
      <div style={{ padding: "24px", maxWidth: 1200, width: "100%" }}>

        {/* Top row: XP/Streak + Daily Challenge + Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <XPStreakWidget />
          <DailyChallenge challenge={serializedChallenge} />
          <QuickActions />
        </div>

        {/* Middle row: Learning paths */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Your learning paths" action="View all" href="/learn" />
          <LearningPathCards paths={serializedPaths} />
        </div>

        {/* Bottom row: Radar + Heatmap + Recent */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: 16 }}>
          <TopicMasteryRadar />
          <ActivityHeatmap />
          <RecentActivity />
        </div>

      </div>
    </>
  );
}

function SectionHeader({ title, action, href }: { title: string; action: string; href: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{title}</h2>
      <Link href={href} style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
        {action} →
      </Link>
    </div>
  );
}
