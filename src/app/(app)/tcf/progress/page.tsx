"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { MissionControl } from "@/components/tcf/MissionControl";

export default function TcfProgressPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchDashboard>> | null>(null);

  useEffect(() => {
    fetchDashboard().then(setData);
  }, []);

  return (
    <>
      <Topbar title="Progress" subtitle="Skills, curriculum, and practice history" />
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        {data ? (
          <>
            <MissionControl
              programPercent={data.programPercent}
              completedUnits={data.completedUnits}
              totalUnits={data.totalUnits}
              weeksRemaining={data.weeksRemaining}
              nextUnit={data.nextUnit}
              skills={data.skills}
              tracks={data.tracks}
            />
            {data.recentAttempts?.length > 0 && (
              <section style={{ marginTop: 32 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent practice</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.recentAttempts.map((a: { module: string; scoreNclc: number | null; score699: number | null }, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid var(--border-subtle)",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ textTransform: "capitalize" }}>{a.module}</span>
                      <span>
                        {a.scoreNclc != null && `NCLC ${a.scoreNclc}`}
                        {a.score699 != null && ` · ${a.score699}/699`}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        )}
      </div>
    </>
  );
}

async function fetchDashboard() {
  const res = await fetch("/api/tcf/dashboard");
  return res.json();
}
