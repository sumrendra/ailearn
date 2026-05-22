export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/Topbar";
import { KnowledgeMap } from "@/components/learn/KnowledgeMap";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowRight, Brain, Database, Cpu, Zap,
} from "lucide-react";

const PATH_META: Record<string, {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  gradient: string;
  accentLight: string;
}> = {
  "llm-foundations": {
    Icon: Brain,
    color: "#7c5cff",
    gradient: "linear-gradient(135deg, #4f35cc, #7c5cff)",
    accentLight: "rgba(124,92,255,0.08)",
  },
  "rag-vector-dbs": {
    Icon: Database,
    color: "#0f766e",
    gradient: "linear-gradient(135deg, #0c5e58, #0f766e)",
    accentLight: "rgba(15,118,110,0.08)",
  },
  "ai-agents": {
    Icon: Cpu,
    color: "#c2670a",
    gradient: "linear-gradient(135deg, #92400e, #c2670a)",
    accentLight: "rgba(194,103,10,0.08)",
  },
};

export default async function LearnPage() {
  const paths = await prisma.learningPath.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, slug: true, title: true, estimatedMins: true, xpReward: true },
      },
    },
  });

  const totalLessons = paths.reduce((s, p) => s + p.lessons.length, 0);
  const totalXP      = paths.reduce((s, p) => s + p.lessons.reduce((a, l) => a + (l.xpReward ?? 0), 0), 0);

  return (
    <>
      <Topbar title="Learning Paths" subtitle="Structured journeys from zero to production" />

      <div style={{ padding: "28px 32px", maxWidth: 1040, width: "100%" }}>

        {/* ── Stats bar ──────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 0,
          background: "var(--bg-card)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: 24,
          overflow: "hidden",
        }}>
          {[
            { emoji: "🗺️", value: paths.length,                          label: "Learning paths" },
            { emoji: "📖", value: totalLessons,                           label: "Total lessons" },
            { emoji: "⚡", value: `${totalXP.toLocaleString()} XP`,       label: "XP available" },
            { emoji: "📚", value: `${Math.round(totalLessons * 15 / 60)}h`, label: "Study time" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              padding: "14px 20px",
              borderRight: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none",
            }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <div>
                <div style={{
                  fontSize: 17, fontWeight: 700,
                  color: "var(--text-primary)", lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Knowledge Map ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <KnowledgeMap />
        </div>

        {/* ── Path cards ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 8 }}>
          <h2 style={{
            fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
            marginBottom: 16, letterSpacing: "-0.01em",
          }}>
            Available paths
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {paths.map((path) => {
              const meta = PATH_META[path.slug];
              const Icon = meta?.Icon ?? BookOpen;
              const totalMins = path.lessons.reduce((s, l) => s + (l.estimatedMins ?? 0), 0);
              const pathXP    = path.lessons.reduce((s, l) => s + (l.xpReward ?? 0), 0);
              const firstLesson = path.lessons[0];

              return (
                <div
                  key={path.slug}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  {/* Color accent strip */}
                  <div style={{
                    width: 5, flexShrink: 0,
                    background: meta?.gradient ?? "var(--accent)",
                  }} />

                  {/* Content */}
                  <div style={{
                    flex: 1, display: "flex", alignItems: "center",
                    padding: "18px 22px", gap: 18,
                  }}>
                    {/* Icon */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                      background: meta?.accentLight ?? "var(--accent-light)",
                      border: `1px solid ${meta?.color ?? "var(--accent)"}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={22} color={meta?.color ?? "var(--accent)"} />
                    </div>

                    {/* Title + description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700,
                        color: "var(--text-primary)", marginBottom: 4,
                      }}>
                        {path.title}
                      </div>
                      <div style={{
                        fontSize: 12.5, color: "var(--text-tertiary)",
                        lineHeight: 1.5,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {path.description}
                      </div>

                      {/* Meta chips */}
                      <div style={{ display: "flex", gap: 12, marginTop: 9, flexWrap: "wrap" }}>
                        {[
                          { icon: <BookOpen size={10} />, label: `${path.lessons.length} lessons` },
                          { icon: <Clock size={10} />, label: `${Math.round(totalMins / 60 * 10) / 10}h` },
                          { icon: <Zap size={10} />, label: `${pathXP} XP` },
                        ].map((chip, i) => (
                          <span key={i} style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 11.5, color: "var(--text-tertiary)",
                            fontWeight: 500,
                          }}>
                            {chip.icon} {chip.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "9px 18px",
                          background: meta?.color ?? "var(--accent)",
                          color: "#fff",
                          borderRadius: "var(--radius-md)",
                          fontSize: 13, fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxShadow: `0 4px 12px ${meta?.color ?? "var(--accent)"}40`,
                        }}>
                          Start path <ArrowRight size={13} />
                        </div>
                      </Link>
                      {firstLesson && (
                        <Link href={`/lessons/${firstLesson.slug}`} style={{ textDecoration: "none" }}>
                          <div style={{
                            fontSize: 11.5, color: "var(--text-tertiary)",
                            textAlign: "center", cursor: "pointer",
                            padding: "4px 0",
                            fontWeight: 500,
                          }}>
                            Jump to first lesson →
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Coming soon hint ───────────────────────────────────────────── */}
        <div style={{
          marginTop: 24, padding: "16px 22px",
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 22 }}>🚀</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
              More paths coming soon
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
              Java Deep Dive, System Design, Kubernetes & Infrastructure, DevOps & CI/CD —
              the map grows as new content is added.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
