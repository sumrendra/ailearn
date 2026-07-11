import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { getAllTcfUnits, TCF_TRACKS } from "@/lib/tcf-program";
import { CheckCircle2, Lock, Circle } from "lucide-react";
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

  return (
    <>
      <Topbar title="Learn" subtitle="62 units · A0 → NCLC 7" />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <p style={{ color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.5 }}>
          Work through tracks in order. Each unit builds on the last. Interactive lessons — click words to hear them, build sentences, match vocabulary.
        </p>

        {TCF_TRACKS.map((track) => {
          const trackUnits = units.filter((u) => u.trackId === track.id);
          const done = trackUnits.filter((u) => completed.has(u.slug)).length;
          return (
            <section key={track.id} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: track.color }}>{track.title}</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {track.subtitle} · {done}/{trackUnits.length}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>{track.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {trackUnits.map((unit, idx) => {
                  const isDone = completed.has(unit.slug);
                  const prevDone = idx === 0 || completed.has(trackUnits[idx - 1].slug);
                  const locked = !prevDone && !isDone && idx > 0;
                  return (
                    <Link
                      key={unit.slug}
                      href={locked ? "#" : `/tcf/learn/${unit.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--border-subtle)",
                        background: isDone ? "rgba(16,185,129,0.06)" : "var(--bg-card)",
                        textDecoration: "none",
                        color: locked ? "var(--text-muted)" : "inherit",
                        opacity: locked ? 0.6 : 1,
                        pointerEvents: locked ? "none" : "auto",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} color="#10b981" />
                      ) : locked ? (
                        <Lock size={18} />
                      ) : (
                        <Circle size={18} color={track.color} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{unit.title}</div>
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
