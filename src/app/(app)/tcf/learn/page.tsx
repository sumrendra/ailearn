import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { getAllTcfUnits, TCF_TRACKS } from "@/lib/tcf-program";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TcfLearnPage() {
  const units = getAllTcfUnits();
  const session = await auth();
  let completed = new Set<string>();
  if (session?.user?.id) {
    const rows = await prisma.lessonProgress.findMany({
      where: { userId: session.user.id, status: "COMPLETED", lessonSlug: { startsWith: "tcf-" } },
      select: { lessonSlug: true },
    });
    completed = new Set(rows.map((r) => r.lessonSlug));
  }

  const suggestedSlug = units.find((u) => !completed.has(u.slug))?.slug ?? null;

  return (
    <>
      <Topbar title="Learn" subtitle="62 units · open curriculum" />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-overlay)",
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)" }}>All lessons are open.</strong> Read any unit — even if you
            learned the topic elsewhere. We suggest an order for beginners; mark complete when you&apos;re done.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/tcf/plan"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#be185d",
                textDecoration: "none",
              }}
            >
              View full roadmap →
            </Link>
            {suggestedSlug && (
              <Link
                href={`/tcf/learn/${suggestedSlug}`}
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                Suggested next unit
              </Link>
            )}
          </div>
        </div>

        {TCF_TRACKS.map((track) => {
          const trackUnits = units.filter((u) => u.trackId === track.id);
          const done = trackUnits.filter((u) => completed.has(u.slug)).length;
          const trackPct = trackUnits.length ? Math.round((done / trackUnits.length) * 100) : 0;
          return (
            <section key={track.id} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: track.color, margin: 0 }}>{track.title}</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {track.subtitle} · {done}/{trackUnits.length} done
                </span>
                <div style={{ flex: 1, minWidth: 120, maxWidth: 200, height: 4, borderRadius: 2, background: "var(--bg-overlay)", overflow: "hidden" }}>
                  <div style={{ width: `${trackPct}%`, height: "100%", background: track.color, borderRadius: 2 }} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.5 }}>
                {track.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {trackUnits.map((unit) => {
                  const isDone = completed.has(unit.slug);
                  const isSuggested = unit.slug === suggestedSlug;
                  return (
                    <Link
                      key={unit.slug}
                      href={`/tcf/learn/${unit.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: isSuggested ? `1px solid ${track.color}55` : "1px solid var(--border-subtle)",
                        background: isDone ? "rgba(16,185,129,0.06)" : isSuggested ? `${track.color}08` : "var(--bg-card)",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} color="#10b981" />
                      ) : (
                        <Circle size={18} color={track.color} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{unit.title}</span>
                          {isSuggested && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                padding: "2px 7px",
                                borderRadius: 4,
                                background: `${track.color}20`,
                                color: track.color,
                              }}
                            >
                              <Sparkles size={10} /> Suggested
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {unit.estimatedMins} min · {unit.cefrBand} · +{unit.xpReward} XP
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
