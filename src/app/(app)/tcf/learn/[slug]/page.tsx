export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getTcfUnitBySlug, getAllTcfUnits } from "@/lib/tcf-program";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TcfUnitPageClient } from "./TcfUnitPageClient";

export default async function TcfUnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = getTcfUnitBySlug(slug);
  if (!unit) notFound();

  const allUnits = getAllTcfUnits();
  const lessons = allUnits.map((u) => ({
    id: u.slug,
    slug: u.slug,
    title: u.title,
    order: u.order,
    estimatedMins: u.estimatedMins,
    xpReward: u.xpReward,
  }));
  const currentIdx = allUnits.findIndex((u) => u.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  let completedSlugs: string[] = [];
  if (userId) {
    const rows = await prisma.lessonProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
        lessonSlug: { startsWith: "tcf-" },
      },
      select: { lessonSlug: true },
    });
    completedSlugs = rows.map((r) => r.lessonSlug);
  }

  return (
    <TcfUnitPageClient
      unit={{
        slug: unit.slug,
        title: unit.title,
        content: unit.content,
        estimatedMins: unit.estimatedMins,
        xpReward: unit.xpReward,
        tags: unit.grammarTopics,
        practiceModule: unit.practiceModule,
        practiceHint: unit.practiceHint,
      }}
      lessons={lessons}
      currentIdx={currentIdx}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      initialCompleted={completedSlugs.includes(slug)}
      completedSlugs={completedSlugs}
      isAuthed={!!userId}
    />
  );
}
