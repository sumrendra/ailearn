import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lessonSlug = req.nextUrl.searchParams.get("lesson");

  const cards = await prisma.flashcard.findMany({
    where: lessonSlug
      ? { lesson: { slug: lessonSlug } }
      : {},
    include: {
      lesson: { select: { title: true, slug: true } },
    },
    orderBy: { id: "asc" },
    take: 50,
  });

  const result = cards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    tags: (c.tags ?? []) as string[],
    lessonTitle: c.lesson?.title ?? null,
    lessonSlug: c.lesson?.slug ?? null,
  }));

  return new Response(JSON.stringify({ cards: result }), {
    headers: { "Content-Type": "application/json" },
  });
}
