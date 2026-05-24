export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getLessonBySlug, getPathBySlug } from "@/lib/content";
import { getPathMeta } from "@/lib/learning-paths";
import { LessonPageClient } from "./LessonPageClient";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const path = getPathBySlug(lesson.pathSlug);
  if (!path) notFound();

  const lessons = path.lessons.map((l) => ({
    id: l.slug, // legacy id field — LessonPageClient still typed against it
    slug: l.slug,
    title: l.title,
    order: l.order,
    estimatedMins: l.estimatedMins,
    xpReward: l.xpReward,
  }));
  const currentIdx = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  const meta = getPathMeta(path.slug);
  const pathColors = {
    color: meta.color,
    light: meta.tint,
    label: path.title,
  };

  return (
    <LessonPageClient
      lesson={{
        id: lesson.slug, // slug *is* the stable id now
        slug: lesson.slug,
        title: lesson.title,
        content: lesson.content,
        estimatedMins: lesson.estimatedMins,
        xpReward: lesson.xpReward,
        tags: lesson.tags,
      }}
      path={{ slug: path.slug, title: path.title }}
      pathColors={pathColors}
      lessons={lessons}
      currentIdx={currentIdx}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
