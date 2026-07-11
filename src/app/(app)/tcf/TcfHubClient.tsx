"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { MissionControl } from "@/components/tcf/MissionControl";
import { Headphones, BookOpen, PenLine, Mic, ChevronRight } from "lucide-react";

interface DashboardData {
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
  profile: { onboardingDone?: boolean } | null;
  stats: { totalUnits: number; totalHours: number };
}

const PRACTICE = [
  { href: "/tcf/listening", Icon: Headphones, label: "Listening", sub: "39 Q · 35 min", color: "#5b6af0" },
  { href: "/tcf/reading", Icon: BookOpen, label: "Reading", sub: "39 Q · 60 min", color: "#10b981" },
  { href: "/tcf/writing", Icon: PenLine, label: "Writing", sub: "3 tasks · 60 min", color: "#f59e0b" },
  { href: "/tcf/speaking", Icon: Mic, label: "Speaking", sub: "3 tasks · 12 min", color: "#ef4444" },
];

export function TcfHubClient() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/tcf/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, []);

  const needsOnboarding = data?.profile && data.profile.onboardingDone === false;

  return (
    <>
      <Topbar
        title="TCF Canada"
        subtitle="Zero French → NCLC 7 — complete preparation program"
      />
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { href: "/tcf/plan", label: "Roadmap", sub: "Phases & tutor plan", color: "#be185d" },
            { href: "/tcf/learn", label: "Lessons", sub: "62 open units", color: "#7c3aed" },
            { href: "/tcf/practice", label: "Practice", sub: "4 exam skills", color: "#5b6af0" },
            { href: "/tcf/progress", label: "Progress", sub: "Scores & history", color: "#0f766e" },
          ].map(({ href, label, sub, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
            </Link>
          ))}
        </div>

        {needsOnboarding && (
          <Link
            href="/tcf/onboarding"
            style={{
              display: "block",
              padding: 14,
              marginBottom: 20,
              borderRadius: 10,
              background: "rgba(190,24,93,0.1)",
              border: "1px solid rgba(190,24,93,0.3)",
              color: "#be185d",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Start here — set your goal & study plan (2 min)
          </Link>
        )}

        {data ? (
          <MissionControl
            programPercent={data.programPercent}
            completedUnits={data.completedUnits}
            totalUnits={data.totalUnits}
            weeksRemaining={data.weeksRemaining}
            nextUnit={data.nextUnit}
            skills={data.skills}
            tracks={data.tracks}
          />
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        )}

        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "32px 0 14px" }}>Practice modules</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 12px" }}>
          Or go to the <Link href="/tcf/practice" style={{ color: "#be185d" }}>practice hub</Link> for all four skills.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {PRACTICE.map(({ href, Icon, label, sub, color }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ padding: 10, borderRadius: 10, background: `${color}18` }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
              </div>
              <ChevronRight size={16} style={{ opacity: 0.4 }} />
            </Link>
          ))}
        </div>

        {data?.stats && (
          <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
            {data.stats.totalUnits} curriculum units · ~{data.stats.totalHours} hours · 5 mock papers per skill
          </p>
        )}
      </div>
    </>
  );
}
