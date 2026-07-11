"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";

const WEEKLY_TEMPLATE = [
  { day: "Mon", task: "Curriculum unit", href: "/tcf/learn" },
  { day: "Tue", task: "Listening practice", href: "/tcf/listening" },
  { day: "Wed", task: "Curriculum unit", href: "/tcf/learn" },
  { day: "Thu", task: "Reading practice", href: "/tcf/reading" },
  { day: "Fri", task: "Writing OR speaking", href: "/tcf/writing" },
  { day: "Sat", task: "Vocabulary review", href: "/tcf/vocabulary" },
  { day: "Sun", task: "Sectional mock or rest", href: "/tcf/mocks" },
];

export default function TcfPlanPage() {
  const [weeksRemaining, setWeeksRemaining] = useState<number | null>(null);
  const [weeklyHours, setWeeklyHours] = useState(6);

  useEffect(() => {
    fetch("/api/tcf/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setWeeksRemaining(d.weeksRemaining);
        if (d.profile?.weeklyHours) setWeeklyHours(d.profile.weeklyHours);
      });
  }, []);

  return (
    <>
      <Topbar title="Study plan" subtitle="From zero French to NCLC 7" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <div
          style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(190,24,93,0.08)",
            border: "1px solid rgba(190,24,93,0.2)",
            marginBottom: 28,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Your timeline (from A0)</div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            At <strong>{weeklyHours} hours/week</strong>, expect roughly{" "}
            <strong>{weeksRemaining ?? "10–12"} weeks</strong> remaining in the curriculum, plus 4–8 weeks of intensive exam mode before booking your real TCF Canada.
          </p>
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Weekly rhythm</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {WEEKLY_TEMPLATE.map((row) => (
            <Link
              key={row.day}
              href={row.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--border-subtle)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span style={{ width: 36, fontWeight: 700, fontSize: 12, color: "#be185d" }}>{row.day}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{row.task}</span>
            </Link>
          ))}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Phases</h2>
        <ol style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, paddingLeft: 20 }}>
          <li><strong>Foundation (A0→A2)</strong> — Units 1–20. Sounds, survival French, first grammar.</li>
          <li><strong>Bridge (A2→B1)</strong> — Units 21–34. Past tenses, pronouns, first production tasks.</li>
          <li><strong>NCLC 7 core (B1→B2)</strong> — Units 35–52. Subjunctive, argumentation, Québécois.</li>
          <li><strong>Exam mastery</strong> — Units 53–62 + full mocks. Book test when all 4 skills hit target in practice.</li>
        </ol>
      </div>
    </>
  );
}
