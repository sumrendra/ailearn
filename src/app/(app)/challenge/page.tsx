export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Flame, BookOpen, Trophy, ArrowRight, Calendar } from "lucide-react";

const TYPE_CONFIG: Record<string, { gradient: string; color: string; label: string }> = {
  CONCEPT: {
    gradient: "linear-gradient(135deg, #4f35cc 0%, #7c5cff 60%, #9b6dff 100%)",
    color: "#6c47ff",
    label: "Concept",
  },
  PAPER: {
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)",
    color: "#1d4ed8",
    label: "Research Paper",
  },
  CODE_SNIPPET: {
    gradient: "linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%)",
    color: "#059669",
    label: "Code Snippet",
  },
  SCENARIO: {
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 60%, #fbbf24 100%)",
    color: "#d97706",
    label: "Scenario",
  },
  TOOL_SPOTLIGHT: {
    gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fb923c 100%)",
    color: "#ea580c",
    label: "Tool Spotlight",
  },
};

export default async function ChallengePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const challenge = await prisma.dailyChallenge.findFirst({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
  });

  if (!challenge) {
    return (
      <>
        <Topbar title="Daily Challenge" subtitle="Come back tomorrow" />
        <div style={{ padding: "32px", maxWidth: 760, width: "100%" }}>
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)", padding: "72px 32px",
            textAlign: "center", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, margin: "0 auto 20px",
              background: "var(--bg-tertiary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Calendar size={28} color="var(--text-tertiary)" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              No challenge today
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
              Check back tomorrow for your next daily challenge!
            </p>
          </div>
        </div>
      </>
    );
  }

  const cfg = TYPE_CONFIG[challenge.type as string] ?? TYPE_CONFIG.CONCEPT;

  return (
    <>
      <Topbar title="Daily Challenge" subtitle="Today's concept to explore" />
      <div style={{ padding: "28px", maxWidth: 760, width: "100%" }}>
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Gradient hero */}
          <div style={{
            background: cfg.gradient,
            padding: "36px 36px 32px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", right: 80, bottom: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", left: -20, bottom: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,0,0,0.07)" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "var(--radius-full)", padding: "4px 12px",
                }}>
                  <Flame size={13} color="rgba(255,255,255,0.9)" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {cfg.label}
                  </span>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", padding: "4px 11px", borderRadius: "var(--radius-full)",
                }}>
                  +{challenge.xpReward} XP
                </span>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.3, margin: 0, maxWidth: 560 }}>
                {challenge.title}
              </h1>
            </div>
          </div>

          {/* Markdown content */}
          <div style={{ padding: "32px 36px" }}>
            <div className="lesson-content" style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {challenge.content}
              </ReactMarkdown>
            </div>

            {challenge.tags && (challenge.tags as string[]).length > 0 && (
              <div style={{
                display: "flex", gap: 6, flexWrap: "wrap",
                marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border-subtle)",
              }}>
                {(challenge.tags as string[]).map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11, padding: "3px 9px",
                    background: "var(--bg-secondary)", color: "var(--text-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-full)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            padding: "20px 36px", borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-secondary)",
            display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
          }}>
            <Link href="/tutor" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "11px 20px", background: cfg.color, color: "#fff",
                borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: `0 4px 12px ${cfg.color}50`,
              }}>
                <BookOpen size={14} /> Explore with AI Tutor
              </div>
            </Link>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "11px 20px",
                border: "1px solid var(--border-default)", background: "var(--bg-card)",
                borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500, cursor: "pointer",
              }}>
                <Trophy size={14} /> Practice quiz
              </div>
            </Link>
            <Link href="/learn" style={{ textDecoration: "none", marginLeft: "auto" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-tertiary)" }}>
                Browse all lessons <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
