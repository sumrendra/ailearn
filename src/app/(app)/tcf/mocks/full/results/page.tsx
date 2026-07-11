"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import {
  clearMockSession,
  getMockSession,
  MOCK_MODULE_LABELS,
  type MockModule,
  type TcfMockSession,
} from "@/lib/tcf-program/mock-session";
import { NCLC7_TARGETS } from "@/lib/tcf-program/nclc";
import { RotateCcw } from "lucide-react";

const MODULES: MockModule[] = ["listening", "reading", "writing", "speaking"];

function meetsTarget(module: MockModule, score: { scoreNclc?: number; score699?: number; scoreRaw?: number }): boolean {
  if (module === "listening") return (score.score699 ?? 0) >= NCLC7_TARGETS.listening.min;
  if (module === "reading") return (score.score699 ?? 0) >= NCLC7_TARGETS.reading.min;
  return (score.scoreRaw ?? 0) >= NCLC7_TARGETS.writing.min;
}

export default function TcfMockResultsPage() {
  const [session, setSession] = useState<TcfMockSession | null>(null);

  useEffect(() => {
    setSession(getMockSession());
  }, []);

  const allDone = session && MODULES.every((m) => session.scores[m]);

  return (
    <>
      <Topbar title="Mock results" subtitle={session ? `Paper ${session.paper}` : "Full exam"} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        {!session ? (
          <p style={{ color: "var(--text-secondary)" }}>
            No active mock session.{" "}
            <Link href="/tcf/mocks/full">Start a full mock</Link>
          </p>
        ) : (
          <div className="glass-pane" style={{ borderRadius: 16, padding: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Paper {session.paper} summary</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
              {allDone
                ? "All four sections complete. Scores are estimates — book your official TCF when practice consistently hits NCLC 7."
                : "Finish all sections to see your full mock profile."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {MODULES.map((m) => {
                const s = session.scores[m];
                const ok = s ? meetsTarget(m, s) : false;
                return (
                  <div
                    key={m}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: `1px solid ${s ? (ok ? "#22c55e44" : "#f59e0b44") : "var(--border-subtle)"}`,
                      background: s ? (ok ? "#22c55e08" : "#f59e0b08") : "var(--bg-overlay)",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{MOCK_MODULE_LABELS[m]}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      {!s
                        ? "—"
                        : m === "listening" || m === "reading"
                          ? `NCLC ${s.scoreNclc ?? "?"} · ${s.score699 ?? "?"}/699`
                          : `NCLC ${s.scoreNclc ?? "?"} · ${s.scoreRaw ?? "?"}/20 avg`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href="/tcf/mocks/full"
                onClick={() => clearMockSession()}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--bg-overlay)",
                  border: "1px solid var(--border-default)",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <RotateCcw size={14} /> New mock
              </Link>
              <Link
                href="/tcf/progress"
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  background: "#be185d",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                View progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
