import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" } });

  const lessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      slug: true,
      title: true,
      description: true,
      path: { select: { title: true } },
    },
    take: 10,
  });

  const results = lessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    description: l.description,
    pathTitle: l.path.title,
  }));

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
}
