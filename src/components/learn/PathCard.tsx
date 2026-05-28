"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Lock, Zap } from "lucide-react";
import { getPathMeta, type PlannedPath } from "@/lib/learning-paths";

export interface PathCardData {
  slug: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  lessonCount: number;
  totalMins: number;
  totalXP: number;
  /** Number of lessons the current user has completed in this path. */
  completedLessons?: number;
  /** Slug of the first lesson — used for "Jump to first lesson". */
  firstLessonSlug?: string;
}

/**
 * Primary path card (Wave 2a redesign).
 *
 * One elevation (`--bg-elevated`), one hairline border, no nested cards.
 * Path identity shows only as: an 8px solid dot beside the title, a tinted
 * mesh that bleeds through the frost on hover, and the progress-fill color.
 * The CTA is always violet (`--accent`) regardless of path — never tinted
 * by path color (DESIGN.md §Path identity).
 *
 * Three callable variants, kept for API compatibility with the rest of the
 * app, but `row` is now the canonical /learn variant.
 */
export function PathCard({
  data,
  variant = "row",
}: {
  data: PathCardData;
  variant?: "feature" | "row" | "tile";
}) {
  if (variant === "tile") return <PathTileCard data={data} />;
  // "feature" and "row" both fall through to the same redesigned card;
  // the bento-grid drives sizing via its grid, this card just renders.
  return <PathRowCard data={data} />;
}

/* ────────────────────────────────────────────────────────────────────────
 * Primary card — used by PathBentoGrid AND as the legacy "All paths" row.
 * Single elevation, hairline border, glow-ring on hover.
 * ──────────────────────────────────────────────────────────────────────── */

function PathRowCard({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;
  const totalHrs = data.totalMins > 0 ? +(data.totalMins / 60).toFixed(1) : 0;
  const inProgress = completed > 0 && completed < data.lessonCount;
  const ctaLabel = inProgress ? "Continue" : "Start";
  const Icon = meta.Icon;

  return (
    <Link
      href={`/learn/${data.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <article
        className="glow-ring path-card"
        style={{
          // Path color is exposed to descendant hover styles only; the card
          // itself doesn't paint with it except for the dot + progress fill.
          ["--path-color" as string]: meta.color,
          ["--path-tint" as string]: meta.tint,
          position: "relative",
          height: "100%",
          padding: "22px 22px 20px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg, 14px)",
          boxShadow: "inset 0 1px 0 var(--hairline-top)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Hover-tinted mesh — appears only when the card is hovered.
         * Uses --path-color to bias toward the path's identity color.
         * Sits behind content (z-index 0) but above the card background. */}
        <span
          aria-hidden
          className="path-card__tint"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transition: "opacity 0.25s ease",
            background: `
              radial-gradient(60% 60% at 80% 0%, ${meta.color} 0%, transparent 65%),
              radial-gradient(50% 60% at 0% 100%, ${meta.color} 0%, transparent 70%)
            `,
            mixBlendMode: "screen",
            pointerEvents: "none",
            filter: "blur(20px)",
          }}
        />

        {/* ── Top row: Lucide icon tile + difficulty/progress chip ───── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}
          >
            <Icon size={20} strokeWidth={2} />
          </div>

          <span
            className="mono-overline"
            style={{
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            {DIFF_LABEL[data.difficulty]}
          </span>
        </div>

        {/* ── Title row with path-color dot ──────────────────────────── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: meta.color,
                flexShrink: 0,
                boxShadow: `0 0 8px ${meta.glow}`,
              }}
            />
            <h3
              className="display-sm"
              style={{
                color: "var(--text-primary)",
                margin: 0,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.title}
            </h3>
          </div>

          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "var(--text-secondary)",
              margin: 0,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </p>
        </div>

        {/* ── Meta row ───────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
            fontSize: 12,
            color: "var(--text-tertiary)",
            marginTop: "auto",
          }}
        >
          <Meta Icon={BookOpen} label={`${data.lessonCount} lessons`} />
          {totalHrs > 0 && <Meta Icon={Clock} label={`${totalHrs}h`} />}
          {data.totalXP > 0 && (
            <Meta Icon={Zap} label={`${data.totalXP} XP`} />
          )}
        </div>

        {/* ── Progress + CTA ─────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingTop: 14,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {completed > 0 ? (
              <>
                <div
                  style={{
                    height: 3,
                    width: "100%",
                    background: "var(--bg-overlay)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct * 100}%`,
                      height: "100%",
                      background: meta.color,
                      borderRadius: 999,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {completed} / {data.lessonCount}
                  &nbsp;·&nbsp;
                  {Math.round(pct * 100)}%
                </div>
              </>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Not started
              </span>
            )}
          </div>

          <span
            className="path-card__cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              background: "color-mix(in srgb, var(--accent) 14%, transparent)",
              color: "var(--accent-text)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              borderRadius: "var(--radius-md, 10px)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
            }}
          >
            {ctaLabel}
            <ArrowRight size={13} strokeWidth={2.25} />
          </span>
        </div>

        {/* Per-card hover styles — keep them scoped via a class. */}
        <style>{`
          .path-card:hover .path-card__tint { opacity: 0.18; }
          .path-card:hover .path-card__cta {
            background: var(--accent);
            color: var(--bg-app);
            border-color: var(--accent);
          }
        `}</style>
      </article>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Tile variant — compact card for dashboards / knowledge map. Same design
 * vocabulary as the row card, just denser.
 * ──────────────────────────────────────────────────────────────────────── */

function PathTileCard({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;
  const Icon = meta.Icon;

  return (
    <Link
      href={`/learn/${data.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <article
        className="glow-ring"
        style={{
          position: "relative",
          height: "100%",
          minHeight: 168,
          padding: 18,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md, 12px)",
          boxShadow: "inset 0 1px 0 var(--hairline-top)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
          {completed > 0 && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                fontSize: 11,
                color: meta.color,
                letterSpacing: "0.02em",
              }}
            >
              {Math.round(pct * 100)}%
            </span>
          )}
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: meta.color,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {data.title}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--text-secondary)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </div>

          {completed > 0 && (
            <div
              style={{
                marginTop: 12,
                height: 3,
                background: "var(--bg-overlay)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct * 100}%`,
                  height: "100%",
                  background: meta.color,
                }}
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Planned tile — coming-soon, non-clickable. Kept for backward compat with
 * KnowledgeMap.tsx; uses the same single-elevation vocabulary.
 * ──────────────────────────────────────────────────────────────────────── */

export function PlannedPathTile({ data }: { data: PlannedPath }) {
  const Icon = data.Icon;
  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-md, 12px)",
        padding: 18,
        minHeight: 168,
        height: "100%",
        border: "1px dashed var(--border-default)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
        opacity: 0.7,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
        <span
          className="mono-overline"
          style={{
            color: "var(--text-tertiary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Lock size={10} strokeWidth={2.25} /> Planned
        </span>
      </div>

      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-secondary)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.description}
        </div>
      </div>
    </div>
  );
}

/* ── Local helpers ────────────────────────────────────────────────────── */

const DIFF_LABEL: Record<PathCardData["difficulty"], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function Meta({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Icon size={12} strokeWidth={2} />
      {label}
    </span>
  );
}
