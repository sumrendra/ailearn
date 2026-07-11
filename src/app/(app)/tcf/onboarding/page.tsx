"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { GraduationCap, Target, Clock } from "lucide-react";

export default function TcfOnboardingPage() {
  const router = useRouter();
  const [targetNclc, setTargetNclc] = useState(7);
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    setSaving(true);
    try {
      await fetch("/api/tcf/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetNclc,
          placementCefr: "A0",
          weeklyHours,
          onboardingDone: true,
        }),
      });
      router.push("/tcf/learn/tcf-a01-why-tcf");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Welcome to TCF Canada" subtitle="Starting from zero French" />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <GraduationCap size={48} color="#be185d" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your path to NCLC 7</h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
            You&apos;re starting from <strong>zero French</strong>. This program takes you through
            62 units (~100 hours) plus exam practice — no other textbook required.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
          <label style={{ display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 600 }}>
              <Target size={16} color="#be185d" /> Immigration goal
            </div>
            <select
              value={targetNclc}
              onChange={(e) => setTargetNclc(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                fontSize: 14,
              }}
            >
              <option value={5}>NCLC 5 — Basic (work permit pathways)</option>
              <option value={7}>NCLC 7 — Express Entry French bonus (recommended)</option>
              <option value={9}>NCLC 9 — Maximum CRS points</option>
            </select>
          </label>

          <label style={{ display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 600 }}>
              <Clock size={16} color="#be185d" /> Hours per week
            </div>
            <select
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                fontSize: 14,
              }}
            >
              <option value={4}>4 h/week (~12 months from zero)</option>
              <option value={6}>6 h/week (~10 months)</option>
              <option value={8}>8 h/week (~8 months)</option>
              <option value={10}>10 h/week (~6 months)</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={saving}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #831843, #be185d)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Start Unit 1 — Why TCF Canada?"}
        </button>
      </div>
    </>
  );
}
