import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { GrammarMap } from "@/components/tcf/GrammarMap";
import { GRAMMAR_TOPICS } from "@/lib/tcf-program/grammar-topics";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TcfGrammarPage() {
  const session = await auth();
  let completed = new Set<string>();
  if (session?.user?.id) {
    const rows = await prisma.lessonProgress.findMany({
      where: { userId: session.user.id, status: "COMPLETED", lessonSlug: { startsWith: "tcf-" } },
      select: { lessonSlug: true },
    });
    completed = new Set(rows.map((r) => r.lessonSlug));
  }

  const topics = GRAMMAR_TOPICS.map((t) => ({
    id: t.id,
    label: t.label,
    cefr: t.cefr,
    category: t.category,
    state: t.unitSlug && completed.has(t.unitSlug) ? "mastered" : "available",
  }));

  const mastered = topics.filter((t) => t.state === "mastered").length;

  return (
    <>
      <Topbar title="Grammar map" subtitle={`${mastered} / ${topics.length} topics mastered`} />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <GrammarMap topics={topics} />
      </div>
    </>
  );
}
