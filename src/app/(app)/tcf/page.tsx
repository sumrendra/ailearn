"use client";

import Link from "next/link";
import { Headphones, BookOpen, PenLine, Mic, ChevronRight, Clock, ListChecks, Info } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";

const MODULES = [
  {
    href: "/tcf/listening",
    Icon: Headphones,
    label: "Listening",
    labelFr: "Compréhension orale",
    accent: "#5b6af0",
    duration: "35 min",
    questions: "39 questions",
    levels: "A1 → C2",
    description: "Audio dialogues and monologues — multiple choice. Rate control (slow / normal). Audio plays once per question in exam mode.",
    status: "available" as const,
    kbd: "1",
  },
  {
    href: "/tcf/reading",
    Icon: BookOpen,
    label: "Reading",
    labelFr: "Compréhension écrite",
    accent: "#10b981",
    duration: "60 min",
    questions: "39 questions",
    levels: "A1 → C2",
    description: "Signs, articles, letters and academic texts — multiple choice. Passage shown alongside the question.",
    status: "available" as const,
    kbd: "2",
  },
  {
    href: "/tcf/writing",
    Icon: PenLine,
    label: "Writing",
    labelFr: "Expression écrite",
    accent: "#f59e0b",
    duration: "60 min",
    questions: "3 tâches",
    levels: "B1 → C2",
    description: "Message informel, article semi-formel et lettre argumentative. Évaluation IA selon le barème officiel TCF (0–20).",
    status: "available" as const,
    kbd: "3",
  },
  {
    href: "/tcf/speaking",
    Icon: Mic,
    label: "Speaking",
    labelFr: "Expression orale",
    accent: "#ef4444",
    duration: "~12 min",
    questions: "3 tâches",
    levels: "A2 → C2",
    description: "Entretien guidé, jeu de rôle et monologue d'opinion. Enregistrez votre réponse, obtenez une évaluation IA détaillée.",
    status: "available" as const,
    kbd: "4",
  },
];

const CLB_TABLE = [
  { clb: "NCLC 4", cefr: "A2", scoreL: "100", scoreR: "100", note: "Élémentaire" },
  { clb: "NCLC 5", cefr: "A2+", scoreL: "181", scoreR: "181", note: "Pré-intermédiaire" },
  { clb: "NCLC 6", cefr: "B1+", scoreL: "361", scoreR: "342", note: "Intermédiaire" },
  { clb: "NCLC 7", cefr: "B2", scoreL: "458", scoreR: "453", note: "Seuil RP" },
  { clb: "NCLC 8", cefr: "B2+", scoreL: "503", scoreR: "499", note: "Inter. supérieur" },
  { clb: "NCLC 9–10", cefr: "C1", scoreL: "549", scoreR: "524", note: "Avancé" },
  { clb: "NCLC 11–12", cefr: "C2", scoreL: "633", scoreR: "611", note: "Quasi-natif" },
];

export default function TCFHubPage() {
  return (
    <>
      <Topbar
        title="TCF Canada"
        subtitle="Test de connaissance du français — 4-section practice"
      />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span className="mono-overline" style={{ color: "var(--accent)" }}>
            Practice · TCF Canada
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              margin: "8px 0 12px",
            }}
          >
            TCF Canada — Exam Practice
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 560 }}>
            Entraînement complet aux 4 épreuves obligatoires du TCF Canada. Les questions suivent la progression A1→C2 de l&apos;examen réel. Les scores sont mappés aux niveaux NCLC utilisés par IRCC pour la résidence permanente.
          </p>
        </div>

        {/* Module cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {MODULES.map((m) => {
            const isAvailable = m.status === "available";
            const card = (
              <div
                className={isAvailable ? "glass-pane" : undefined}
                style={{
                  borderRadius: 16,
                  padding: "24px 24px 20px",
                  border: isAvailable
                    ? `1px solid ${m.accent}44`
                    : "1px solid var(--border-subtle)",
                  background: isAvailable ? undefined : "var(--bg-overlay)",
                  opacity: isAvailable ? 1 : 0.55,
                  cursor: isAvailable ? "pointer" : "default",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isAvailable) return;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${m.accent}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: m.accent,
                    opacity: isAvailable ? 1 : 0.3,
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${m.accent}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <m.Icon size={18} color={m.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                        {m.labelFr}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {isAvailable ? (
                      <>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            background: `${m.accent}22`,
                            color: m.accent,
                            padding: "2px 7px",
                            borderRadius: 4,
                          }}
                        >
                          Available
                        </span>
                        <kbd
                          style={{
                            fontSize: 10,
                            color: "var(--text-tertiary)",
                            background: "var(--bg-overlay)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 4,
                            padding: "2px 6px",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {m.kbd}
                        </kbd>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          background: "var(--bg-overlay)",
                          color: "var(--text-tertiary)",
                          padding: "2px 7px",
                          borderRadius: 4,
                        }}
                      >
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, margin: "14px 0 16px" }}>
                  {m.description}
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { Icon: Clock, text: m.duration },
                    { Icon: ListChecks, text: m.questions },
                  ].map(({ Icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={12} color="var(--text-tertiary)" />
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{text}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: m.accent,
                      background: `${m.accent}14`,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {m.levels}
                  </div>
                </div>

                {isAvailable && (
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: m.accent }}>
                      Start practice
                    </span>
                    <ChevronRight size={16} color={m.accent} />
                  </div>
                )}
              </div>
            );

            return isAvailable ? (
              <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
                {card}
              </Link>
            ) : (
              <div key={m.href}>{card}</div>
            );
          })}
        </div>

        {/* CLB reference table */}
        <div className="glass-pane" style={{ borderRadius: 16, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Info size={14} color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              Référence NCLC / TCF
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
            L&apos;IRCC utilise les <strong style={{ color: "var(--text-primary)" }}>Niveaux de compétence linguistique canadiens (NCLC)</strong> pour le français. La plupart des programmes de résidence permanente exigent <strong style={{ color: "var(--text-primary)" }}>NCLC 7</strong> (≈ B2) au minimum. Chaque section TCF est notée 0–699.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Niveau NCLC", "CECRL", "TCF écoute (min)", "TCF lecture (min)", "Description"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLB_TABLE.map((row, i) => {
                  const isTarget = row.clb === "NCLC 7";
                  return (
                    <tr key={row.clb} style={{ background: isTarget ? "var(--accent-soft)" : i % 2 === 0 ? "transparent" : "var(--bg-overlay)" }}>
                      <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: isTarget ? "var(--accent)" : "var(--text-primary)", fontWeight: isTarget ? 700 : 400 }}>
                        {row.clb}
                      </td>
                      <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>{row.cefr}</td>
                      <td style={{ padding: "8px 12px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{row.scoreL}</td>
                      <td style={{ padding: "8px 12px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{row.scoreR}</td>
                      <td style={{ padding: "8px 12px", color: isTarget ? "var(--accent)" : "var(--text-secondary)" }}>
                        {row.note}
                        {isTarget && (
                          <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--accent)", color: "white", padding: "1px 5px", borderRadius: 3 }}>
                            RP min
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
