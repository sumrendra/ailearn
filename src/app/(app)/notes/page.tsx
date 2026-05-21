import { Topbar } from "@/components/layout/Topbar";
import { StickyNote, Sparkles, BookOpen, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: StickyNote,
    title: "Inline lesson notes",
    desc: "Highlight and annotate while reading — notes stay attached to the exact lesson passage.",
    color: "var(--accent)",
    bg: "var(--accent-light)",
  },
  {
    icon: Sparkles,
    title: "AI summarisation",
    desc: "Claude condenses your notes into key insights and generates flashcards automatically.",
    color: "var(--warning)",
    bg: "var(--warning-light)",
  },
  {
    icon: Search,
    title: "Full-text search",
    desc: "Find any note instantly across all lessons — search by topic, keyword, or lesson.",
    color: "var(--info)",
    bg: "var(--info-light)",
  },
];

export default function NotesPage() {
  return (
    <>
      <Topbar title="My Notes" subtitle="Inline notes with AI summarisation" />
      <div style={{ padding: "24px", maxWidth: 760, width: "100%" }}>

        {/* Hero */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)", overflow: "hidden",
          marginBottom: 20,
        }}>
          <div style={{
            padding: "48px 40px", textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-light) 0%, transparent 60%)",
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: 18, margin: "0 auto 20px",
              background: "var(--accent-light)",
              border: "1.5px solid var(--accent)25",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(108, 71, 255, 0.15)",
            }}>
              <StickyNote size={30} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.3 }}>
              Notes are coming soon
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px" }}>
              Take inline notes while reading lessons, get them auto-summarised by AI,
              and review them alongside your flashcards.
            </p>
            <Link href="/learn" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 22px", background: "var(--accent)", color: "#fff",
                borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 500, cursor: "pointer",
              }}>
                <BookOpen size={14} /> Start a lesson
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        {/* Feature preview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                padding: "20px", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: f.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12,
                }}>
                  <Icon size={18} color={f.color} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
