import { Topbar } from "@/components/layout/Topbar";
import { XPStreakWidget } from "@/components/dashboard/XPStreakWidget";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { LearningPathCards } from "@/components/dashboard/LearningPathCards";
import { TopicMasteryRadar } from "@/components/dashboard/TopicMasteryRadar";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Good morning, Haril 👋"
        subtitle="Thursday, 21 May 2026"
      />
      <div style={{ padding: "24px", maxWidth: 1200, width: "100%" }}>

        {/* Top row: XP/Streak + Daily Challenge + Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <XPStreakWidget />
          <DailyChallenge />
          <QuickActions />
        </div>

        {/* Middle row: Learning paths */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Your learning paths" action="View all" href="/learn" />
          <LearningPathCards />
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
      <a href={href} style={{
        fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 500,
      }}>
        {action} →
      </a>
    </div>
  );
}
