"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import {
  clearMockSession,
  getMockSession,
  type MockModule,
  type TcfMockSession,
} from "@/lib/tcf-program/mock-session";
import {
  evaluateExamReadiness,
  SKILL_LABELS,
  SKILL_ORDER,
  type ExamSkill,
  type ExamVerdict,
  type SkillReadiness,
} from "@/lib/tcf-program/readiness";
import { RotateCcw } from "lucide-react";

const VERDICT_STYLE: Record<ExamVerdict, { color: string; title: string }> = {
  ready: { color: "#22c55e", title: "Prêt pour l'examen officiel" },
  borderline: { color: "#f59e0b", title: "Limite — marge insuffisante" },
  "not-ready": { color: "#ef4444", title: "Pas encore prêt" },
  incomplete: { color: "var(--text-tertiary)", title: "Examen incomplet" },
};

const SKILL_VERDICT_COLOR: Record<SkillReadiness["verdict"], string> = {
  clear: "#22c55e",
  borderline: "#f59e0b",
  below: "#ef4444",
};

/** Section score on its own scale: 0–699 comprehension, 0–20 production. */
function sectionScore(module: MockModule, s: TcfMockSession["scores"][MockModule]): number | undefined {
  if (!s) return undefined;
  if (module === "listening" || module === "reading") return s.score699;
  return s.scoreRaw;
}

export default function TcfMockResultsPage() {
  const [session, setSession] = useState<TcfMockSession | null>(null);

  useEffect(() => {
    setSession(getMockSession());
  }, []);

  const scores: Partial<Record<ExamSkill, number>> = {};
  if (session) {
    for (const m of SKILL_ORDER) {
      const value = sectionScore(m, session.scores[m]);
      if (typeof value === "number") scores[m] = value;
    }
  }
  const readiness = evaluateExamReadiness(scores);
  const verdictStyle = VERDICT_STYLE[readiness.verdict];

  return (
    <>
      <Topbar title="Résultats du blanc" subtitle={session ? `Épreuve ${session.paper}` : "Examen complet"} />
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        {!session ? (
          <p style={{ color: "var(--text-secondary)" }}>
            Aucun examen blanc en cours.{" "}
            <Link href="/tcf/mocks/full">Commencer un examen complet</Link>
          </p>
        ) : (
          <>
            <div
              className="glass-pane"
              style={{
                borderRadius: 16,
                padding: 24,
                marginBottom: 16,
                borderLeft: `3px solid ${verdictStyle.color}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: verdictStyle.color,
                  marginBottom: 6,
                }}
              >
                Verdict — cible NCLC 7
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{verdictStyle.title}</h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                {readiness.summary}
              </p>

              {readiness.verdict !== "incomplete" && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>NCLC effectif</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 24,
                      fontWeight: 700,
                      color: verdictStyle.color,
                    }}
                  >
                    {readiness.effectiveNclc}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                    IRCC retient l&apos;épreuve la plus faible, jamais la moyenne.
                  </span>
                </div>
              )}
            </div>

            <div className="glass-pane" style={{ borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Détail par épreuve</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SKILL_ORDER.map((m) => {
                  const detail = readiness.skills.find((s) => s.skill === m);
                  const color = detail ? SKILL_VERDICT_COLOR[detail.verdict] : "var(--border-subtle)";
                  return (
                    <div
                      key={m}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: `1px solid ${detail ? `${color}44` : "var(--border-subtle)"}`,
                        background: detail ? `${color}0d` : "var(--bg-overlay)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{SKILL_LABELS[m]}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color }}>
                          {!detail
                            ? "—"
                            : detail.scale === "699"
                              ? `${detail.score} / 699 · NCLC ${detail.nclc}`
                              : `${detail.score} / 20 · NCLC ${detail.nclc}`}
                        </span>
                      </div>
                      {detail && (
                        <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
                          {detail.verdict === "clear"
                            ? `Au-dessus du seuil (${detail.floor}) avec marge.`
                            : detail.verdict === "borderline"
                              ? `Seuil atteint (${detail.floor}) mais sans marge — ${detail.pointsToSafe} point(s) pour sécuriser.`
                              : `Sous le seuil NCLC 7 (${detail.floor}) — il manque ${detail.floor - detail.score} point(s).`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {readiness.blockers.length > 0 && readiness.verdict !== "incomplete" && (
              <div className="glass-pane" style={{ borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Priorité de révision</h2>
                <ol style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                  {readiness.blockers.map((b) => (
                    <li key={b.skill}>
                      <strong style={{ color: "var(--text-primary)" }}>{SKILL_LABELS[b.skill]}</strong> —{" "}
                      {b.pointsToSafe} point(s) sous la marge de sécurité ({b.safe}).
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="glass-pane" style={{ borderRadius: 16, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: 0, lineHeight: 1.6 }}>
                Les scores de compréhension utilisent le barème pondéré du TCF (les questions
                difficiles valent jusqu&apos;à onze fois les premières). L&apos;expression écrite et orale
                est notée par IA sur la grille FEI, sans la double correction humaine officielle.
                Prévoyez une marge d&apos;environ ±1 niveau NCLC par rapport à l&apos;examen réel.
              </p>
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
                <RotateCcw size={14} /> Nouvel examen
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
                Voir la progression
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
