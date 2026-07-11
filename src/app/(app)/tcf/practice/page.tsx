import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { Headphones, BookOpen, PenLine, Mic, ClipboardCheck } from "lucide-react";

const MODULES = [
  {
    href: "/tcf/listening",
    Icon: Headphones,
    label: "Listening",
    desc: "39 questions · 35 min · audio from server",
    color: "#5b6af0",
    tip: "Use exam mode for one-pass practice",
  },
  {
    href: "/tcf/reading",
    Icon: BookOpen,
    label: "Reading",
    desc: "39 questions · 60 min · MCQ with explanations",
    color: "#10b981",
    tip: "Exam mode hides feedback until the end",
  },
  {
    href: "/tcf/writing",
    Icon: PenLine,
    label: "Writing",
    desc: "3 tasks · 60 min · AI rubric scoring",
    color: "#f59e0b",
    tip: "Best paired with a tutor for feedback",
  },
  {
    href: "/tcf/speaking",
    Icon: Mic,
    label: "Speaking",
    desc: "3 tasks · timers · AI evaluation",
    color: "#ef4444",
    tip: "Record in a quiet room; tutors help pronunciation",
  },
];

export default function TcfPracticeHubPage() {
  return (
    <>
      <Topbar title="Practice" subtitle="Timed papers for all four TCF skills" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 24 }}>
          Practice runs <strong>in parallel</strong> with the curriculum — not after it. Pick the skill you want to train;
          scores feed your progress dashboard. When all four skills approach NCLC 7 in practice, run a{" "}
          <Link href="/tcf/mocks/full" style={{ color: "#be185d" }}>full mock</Link>.
        </p>

        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          {MODULES.map(({ href, Icon, label, desc, color, tip }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 18,
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ padding: 12, borderRadius: 12, background: `${color}15` }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{tip}</div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/tcf/mocks"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 16,
            borderRadius: 12,
            border: "1px dashed rgba(190,24,93,0.4)",
            background: "rgba(190,24,93,0.05)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <ClipboardCheck size={20} color="#be185d" />
          <div>
            <div style={{ fontWeight: 600 }}>Mocks & exam simulation</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Full 4-section mock or sectional exams</div>
          </div>
        </Link>
      </div>
    </>
  );
}
