"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ROADMAP_PHASES,
  STUDY_MODE_LABELS,
  DEFAULT_ROADMAP_PREFS,
  phaseProgressPercent,
  overallRoadmapPercent,
  parseRoadmapPrefs,
  type RoadmapPhaseId,
  type StudyMode,
  type RoadmapPrefs,
} from "@/lib/tcf-program/roadmap";
import { CheckCircle2, Circle, GraduationCap, User, Users, ChevronRight } from "lucide-react";

interface RoadmapData {
  tracks: { id: string; percent: number; completed: number; total: number }[];
  completedUnits: number;
  totalUnits: number;
  weeksRemaining: number | null;
  weeklyHours: number;
  roadmapPrefs: RoadmapPrefs;
}

const MODE_ICONS: Record<StudyMode, typeof User> = {
  self: User,
  tutor: GraduationCap,
  mixed: Users,
};

export function TcfRoadmap() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [prefs, setPrefs] = useState<RoadmapPrefs>(DEFAULT_ROADMAP_PREFS);
  const [saving, setSaving] = useState<RoadmapPhaseId | null>(null);

  useEffect(() => {
    fetch("/api/tcf/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData({
          tracks: d.tracks ?? [],
          completedUnits: d.completedUnits ?? 0,
          totalUnits: d.totalUnits ?? 62,
          weeksRemaining: d.weeksRemaining,
          weeklyHours: d.profile?.weeklyHours ?? 6,
          roadmapPrefs: parseRoadmapPrefs(d.profile?.roadmapPrefs),
        });
        setPrefs(parseRoadmapPrefs(d.profile?.roadmapPrefs));
      });
  }, []);

  const saveMode = useCallback(async (phaseId: RoadmapPhaseId, mode: StudyMode) => {
    const next = { ...prefs, [phaseId]: mode };
    setPrefs(next);
    setSaving(phaseId);
    try {
      await fetch("/api/tcf/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapPrefs: next }),
      });
    } finally {
      setSaving(null);
    }
  }, [prefs]);

  if (!data) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading roadmap…</div>;
  }

  const overall = overallRoadmapPercent(data.tracks);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Overview */}
      <div
        style={{
          padding: 22,
          borderRadius: 14,
          border: "1px solid rgba(190,24,93,0.25)",
          background: "linear-gradient(135deg, rgba(190,24,93,0.06) 0%, rgba(236,72,153,0.04) 100%)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#be185d", marginBottom: 8 }}>Your path to NCLC 7</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 16px" }}>
          Four curriculum phases plus ongoing practice. Work in order if you&apos;re starting from zero — or jump to any
          topic you need. Mark how you plan to study each phase: on your own, with a tutor, or both.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: "var(--text-muted)" }}>Overall curriculum</span>
              <span style={{ fontWeight: 700, color: "#be185d" }}>{overall}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--bg-overlay)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${overall}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #be185d, #ec4899)",
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
              {data.completedUnits} / {data.totalUnits} units · ~{data.weeklyHours} h/week
              {data.weeksRemaining != null && data.weeksRemaining > 0 && (
                <> · ~{data.weeksRemaining} weeks left in curriculum</>
              )}
            </div>
          </div>
          <Link
            href="/tcf/learn"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "#be185d",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Browse all lessons →
          </Link>
        </div>
      </div>

      {/* Phases timeline */}
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: "var(--border-subtle)",
            borderRadius: 1,
          }}
        />
        {ROADMAP_PHASES.map((phase) => {
          const pct = phaseProgressPercent(phase, data.tracks);
          const done = pct >= 100;
          const mode = prefs[phase.id] ?? "self";
          const ModeIcon = MODE_ICONS[mode];

          return (
            <section key={phase.id} style={{ position: "relative", marginBottom: 28 }}>
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: 20,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: done ? phase.color : "var(--bg-card)",
                  border: `2px solid ${phase.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done && <CheckCircle2 size={10} color="#fff" style={{ background: phase.color, borderRadius: "50%" }} />}
              </div>

              <div
                style={{
                  borderRadius: 14,
                  border: `1px solid ${phase.id === "practice" ? "var(--border-subtle)" : `${phase.color}33`}`,
                  background: "var(--bg-card)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "18px 20px 14px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: phase.color }}>
                        Phase {phase.order}
                      </div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "4px 0 2px" }}>{phase.title}</h2>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{phase.subtitle} · {phase.timeline}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: phase.color }}>{pct}%</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{done ? "Complete" : pct > 0 ? "In progress" : "Not started"}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, margin: "12px 0 14px" }}>
                    {phase.description}
                  </p>

                  <div style={{ height: 4, borderRadius: 2, background: "var(--bg-overlay)", overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: phase.color, borderRadius: 2, transition: "width 0.4s" }} />
                  </div>

                  {/* Study mode */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <ModeIcon size={12} /> How will you study this phase?
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(["self", "tutor", "mixed"] as StudyMode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          disabled={saving === phase.id}
                          onClick={() => saveMode(phase.id, m)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: mode === m ? 600 : 500,
                            border: `1px solid ${mode === m ? phase.color : "var(--border-subtle)"}`,
                            background: mode === m ? `${phase.color}18` : "transparent",
                            color: mode === m ? phase.color : "var(--text-secondary)",
                            cursor: "pointer",
                          }}
                        >
                          {STUDY_MODE_LABELS[m]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "var(--bg-overlay)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: "var(--text-secondary)" }}>Tutor tip:</strong> {phase.tutorTip}
                  </div>
                </div>

                {/* Blocks */}
                <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "12px 20px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    What&apos;s in this phase
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {phase.blocks.map((block) => (
                      <Link
                        key={block.id}
                        href={block.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid var(--border-subtle)",
                          textDecoration: "none",
                          color: "inherit",
                          background: "var(--bg-overlay)",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={16} color={phase.color} style={{ flexShrink: 0, opacity: 0.5 }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{block.label}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{block.description}</div>
                        </div>
                        {block.tutorFriendly && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: "rgba(124,58,237,0.12)",
                              color: "#7c3aed",
                              flexShrink: 0,
                            }}
                          >
                            Tutor-friendly
                          </span>
                        )}
                        <ChevronRight size={14} style={{ opacity: 0.35, flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
