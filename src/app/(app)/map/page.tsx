export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildAtlasGraph, type LessonStatus } from "@/lib/map-graph";
import { Topbar } from "@/components/layout/Topbar";
import { AtlasExplorer } from "@/components/map/AtlasExplorer";

export const metadata = { title: "Map · AILearn" };

export default async function MapPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const progress: Record<string, LessonStatus> = {};
  if (userId) {
    const rows = await prisma.lessonProgress.findMany({
      where: { userId, status: { in: ["IN_PROGRESS", "COMPLETED"] } },
      select: { lessonSlug: true, status: true },
    });
    for (const row of rows) progress[row.lessonSlug] = row.status as LessonStatus;
  }

  const graph = buildAtlasGraph(progress);
  const { paths, lessons, completed } = graph.totals;

  return (
    <>
      <Topbar
        title="Knowledge Map"
        subtitle={`${paths} courses · ${lessons} lessons${completed > 0 ? ` · ${completed} completed` : ""}`}
      />
      {/* The map owns the rest of the viewport; the page itself never scrolls. */}
      <div style={{ position: "relative", height: "calc(100vh - 60px)", overflow: "hidden" }}>
        <AtlasExplorer graph={graph} />
      </div>
    </>
  );
}
