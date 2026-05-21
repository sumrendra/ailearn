export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import Link from "next/link";
import { Zap, ArrowRight, BookOpen, Trophy } from "lucide-react";

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
        <Topbar title="Daily Challenge" subtitle="Come back tomorrow for a new challenge" />
        <div style={{ padding: "24px" }}>
          <p style={{ color: "var(--text-secondary)" }}>No challenge available today. Check back tomorrow!</p>
        </div>
      </>
    );
  }

  const typeColors: Record<string, { bg: string; text: string }> = {
    CONCEPT:        { bg: "var(--accent-light)",   text: "var(--accent)" },
    PAPER:          { bg: "var(--info-light)",      text: "var(--info)" },
    CODE_SNIPPET:   { bg: "var(--success-light)",   text: "var(--success)" },
    SCENARIO:       { bg: "var(--warning-light)",   text: "var(--warning)" },
    TOOL_SPOTLIGHT: { bg: "var(--streak-light)",    text: "var(--streak-orange)" },
  };
  const colors = typeColors[challenge.type as string] ?? typeColors.CONCEPT;

  return (
    <>
      <Topbar title="Daily Challenge" subtitle="Today's concept to explore" />
      <div style={{ padding: "24px", maxWidth: 720, width: "100%" }}>
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Header strip */}
          <div style={{
            padding: "20px 28px",
            background: colors.bg,
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Zap size={18} color={colors.text} />
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {(challenge.type as string).replace(/_/g, " ")}
              </span>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600,
              background: "var(--xp-gold-light)", color: "var(--xp-gold)",
              padding: "3px 10px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--xp-gold)",
            }}>
              +{challenge.xpReward} XP
            </span>
          </div>

          {/* Content */}
          <div style={{ padding: "32px 28px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35, marginBottom: 24 }}>
              {challenge.title}
            </h1>

            <div style={{
              fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}>
              {challenge.content}
            </div>

            {/* Tags */}
            {challenge.tags && (challenge.tags as string[]).length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 24 }}>
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
            padding: "20px 28px", borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-secondary)",
            display: "flex", gap: 12, flexWrap: "wrap",
          }}>
            <Link href="/tutor" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 18px", background: "var(--accent)", color: "#fff",
                borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
                <BookOpen size={14} /> Explore with AI tutor
              </div>
            </Link>
            <Link href="/quiz/generate" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 18px",
                border: "1px solid var(--border-default)", background: "var(--bg-card)",
                borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500, cursor: "pointer",
              }}>
                <Trophy size={14} /> Take a quiz on this
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
