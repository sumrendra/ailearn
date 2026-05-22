export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LessonPageClient } from "./LessonPageClient";

const PATH_COLOR: Record<string, { color: string; light: string; label: string }> = {
  "llm-foundations": { color: "#6c47ff", light: "rgba(108,71,255,0.08)", label: "LLM Foundations" },
  "rag-vector-dbs":  { color: "#0f766e", light: "rgba(15,118,110,0.08)",  label: "RAG & Vector DBs" },
  "ai-agents":       { color: "#b45309", light: "rgba(180,83,9,0.08)",    label: "AI Agents" },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { slug },
    include: {
      path: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, slug: true, title: true, order: true, estimatedMins: true, xpReward: true },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const lessons     = lesson.path.lessons;
  const currentIdx  = lessons.findIndex((l) => l.slug === slug);
  const prevLesson  = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson  = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;
  const pathColors  = PATH_COLOR[lesson.path.slug] ?? {
    color: "var(--accent)", light: "var(--accent-light)", label: lesson.path.title,
  };

  return (
    <LessonPageClient
      lesson={{
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        content: lesson.content,
        estimatedMins: lesson.estimatedMins,
        xpReward: lesson.xpReward,
        tags: lesson.tags,
      }}
      path={{ slug: lesson.path.slug, title: lesson.path.title }}
      pathColors={pathColors}
      lessons={lessons}
      currentIdx={currentIdx}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
