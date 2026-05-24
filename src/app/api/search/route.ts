import { NextRequest } from "next/server";
import { getAllLessons } from "@/lib/content";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" } });

  const needle = q.toLowerCase();
  const results = getAllLessons()
    .filter((l) =>
      l.title.toLowerCase().includes(needle) ||
      l.description.toLowerCase().includes(needle) ||
      l.content.toLowerCase().includes(needle),
    )
    .slice(0, 10)
    .map((l) => ({
      slug: l.slug,
      title: l.title,
      description: l.description,
      pathTitle: l.pathTitle,
    }));

  return new Response(JSON.stringify({ results }), {
    headers: { "Content-Type": "application/json" },
  });
}
