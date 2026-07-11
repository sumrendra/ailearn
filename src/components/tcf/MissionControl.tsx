"use client";

import Link from "next/link";
import { ArrowRight, Target, AlertCircle } from "lucide-react";

interface SkillRing {
  label: string;
  nclc: number;
  target: number;
  href: string;
  color: string;
}

interface MissionControlProps {
  programPercent: number;
  completedUnits: number;
  totalUnits: number;
  weeksRemaining: number | null;
  nextUnit: { slug: string; title: string; trackId: string } | null;
  skills: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    target: number;
    weakest: { skill: string; nclc: number };
  };
  tracks: { id: string; percent: number; completed: number; total: number }[];
}

export function MissionControl({
  programPercent,
  completedUnits,
  totalUnits,
  weeksRemaining,
  nextUnit,
  skills,
  tracks,
}: MissionControlProps) {
  const rings: SkillRing[] = [
    { label: "Listening", nclc: skills.listening, target: skills.target, href: "/tcf/listening", color: "#5b6af0" },
    { label: "Reading", nclc: skills.reading, target: skills.target, href: "/tcf/reading", color: "#10b981" },
    { label: "Writing", nclc: skills.writing, target: skills.target, href: "/tcf/writing", color: "#f59e0b" },
    { label: "Speaking", nclc: skills.speaking, target: skills.target, href: "/tcf/speaking", color: "#ef4444" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Skill rings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {rings.map((r) => {
          const atTarget = r.nclc >= r.target;
          const isWeakest = skills.weakest.skill === r.label.toLowerCase() && r.nclc > 0;
          return (
            <Link
              key={r.label}
              href={r.href}
              style={{
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${isWeakest ? "#ef4444" : "var(--border-subtle)"}`,
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: r.color }}>
                {r.nclc > 0 ? `NCLC ${r.nclc}` : "—"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
                Target: {r.target} {atTarget && r.nclc > 0 ? "✓" : ""}
              </div>
            </Link>
          );
        })}
      </div>

      {skills.weakest.nclc > 0 && skills.weakest.nclc < skills.target && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            fontSize: 13,
          }}
        >
          <AlertCircle size={16} color="#ef4444" />
          <span>
            Weakest skill: <strong>{skills.weakest.skill}</strong> (NCLC {skills.weakest.nclc}) — IRCC uses your lowest score.
          </span>
        </div>
      )}

      {/* Program bar */}
      <div
        style={{
          padding: 20,
          borderRadius: 14,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={18} color="#be185d" />
            <span style={{ fontWeight: 700 }}>Program progress</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#be185d" }}>{programPercent}%</span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "var(--bg-subtle)",
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: `${programPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #be185d, #ec4899)",
              borderRadius: 4,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {completedUnits} / {totalUnits} units
          {weeksRemaining != null && weeksRemaining > 0 && (
            <> · ~{weeksRemaining} weeks at your pace</>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
          {tracks.map((t) => (
            <div key={t.id} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, textTransform: "capitalize", color: "var(--text-muted)", marginBottom: 4 }}>
                {t.id}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.percent}%</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{t.completed}/{t.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next unit CTA */}
      {nextUnit && (
        <Link
          href={`/tcf/learn/${nextUnit.slug}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #831843 0%, #be185d 55%, #ec4899 100%)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <span>Continue: {nextUnit.title}</span>
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
