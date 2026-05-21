import { Topbar } from "@/components/layout/Topbar";
import { StickyNote, PenLine } from "lucide-react";
import Link from "next/link";

export default function NotesPage() {
  return (
    <>
      <Topbar title="My Notes" subtitle="Lesson notes with AI summarisation — coming soon" />
      <div style={{ padding: "24px", maxWidth: 700, width: "100%" }}>
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", padding: "60px 40px",
          textAlign: "center", boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: "0 auto 20px",
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <StickyNote size={28} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
            Notes are coming soon
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
            You&apos;ll be able to take inline notes while reading lessons, get them
            auto-summarised by AI, and review them alongside your flashcards.
          </p>
          <Link href="/learn" style={{ textDecoration: "none" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 20px", background: "var(--accent)", color: "#fff",
              borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>
              <PenLine size={14} /> Start a lesson
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
