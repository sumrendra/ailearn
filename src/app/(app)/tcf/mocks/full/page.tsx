"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { ClipboardCheck, Clock, Headphones, BookOpen, PenLine, Mic } from "lucide-react";
import {
  MOCK_MODULE_DURATION,
  MOCK_MODULE_LABELS,
  mockModuleHref,
  startMockSession,
} from "@/lib/tcf-program/mock-session";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";

const SECTIONS = [
  { key: "listening" as const, icon: Headphones, mins: 35, color: "#5b6af0" },
  { key: "reading" as const, icon: BookOpen, mins: 60, color: "#10b981" },
  { key: "writing" as const, icon: PenLine, mins: 60, color: "#f59e0b" },
  { key: "speaking" as const, icon: Mic, mins: 12, color: "#ef4444" },
];

export default function TcfFullMockPage() {
  const router = useRouter();

  const begin = (paper: number) => {
    const session = startMockSession(paper);
    router.push(mockModuleHref("listening", paper, session.seed));
  };

  return (
    <>
      <Topbar title="Full mock exam" subtitle={MOCK_MODULE_DURATION} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <div className="glass-pane" style={{ borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <ClipboardCheck size={28} color="#be185d" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>4-section TCF Canada simulation</h1>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                One sitting, four skills. Listening and reading are drawn fresh from the whole
                question bank each time, so no two sittings repeat. They run in strict exam mode;
                writing and speaking use official timers and AI scoring. Plan a quiet block of ~3 hours.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            <Clock size={14} /> {MOCK_MODULE_DURATION} · breaks between sections allowed
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {SECTIONS.map(({ key, icon: Icon, mins, color }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-overlay)",
                }}
              >
                <Icon size={18} color={color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{MOCK_MODULE_LABELS[key]}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>~{mins} min</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            Choose a practice paper (1–5). Your scores feed the TCF progress dashboard after each section.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {Array.from({ length: PAPER_COUNT }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => begin(p)}
                style={{
                  padding: "14px 0",
                  borderRadius: 10,
                  border: "1px solid #be185d44",
                  background: "#be185d12",
                  color: "#be185d",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <Link href="/tcf/mocks" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          ← Sectional mocks only
        </Link>
      </div>
    </>
  );
}
