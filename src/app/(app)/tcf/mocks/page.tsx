import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { ClipboardCheck } from "lucide-react";

const MOCKS = [
  { title: "Full exam simulation", desc: "All 4 sections · ~2h 47min · sequential mock", href: "/tcf/mocks/full", soon: false },
  { title: "Listening sectional", desc: "39 questions · 35 min · exam mode", href: "/tcf/listening", soon: false },
  { title: "Reading sectional", desc: "39 questions · 60 min · exam mode", href: "/tcf/reading", soon: false },
  { title: "Writing sectional", desc: "3 tasks · 60 min · AI scored", href: "/tcf/writing", soon: false },
  { title: "Speaking sectional", desc: "3 tasks · timers · AI scored", href: "/tcf/speaking", soon: false },
];

export default function TcfMocksPage() {
  return (
    <>
      <Topbar title="Mocks" subtitle="Timed practice under exam conditions" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
          Use <strong>Exam mode</strong> inside each practice module for one-pass listening and strict timers, or run the <Link href="/tcf/mocks/full" style={{ color: "#be185d" }}>full 4-section mock</Link>.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCKS.map((m) => (
            <Link
              key={m.title}
              href={m.soon ? "#" : m.href}
              style={{
                display: "flex",
                gap: 14,
                padding: 16,
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: m.soon ? "var(--text-muted)" : "inherit",
                pointerEvents: m.soon ? "none" : "auto",
                opacity: m.soon ? 0.7 : 1,
              }}
            >
              <ClipboardCheck size={22} color="#be185d" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{m.title}{m.soon && " (soon)"}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{m.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
