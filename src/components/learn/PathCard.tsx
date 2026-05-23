import Link from "next/link";
import { BookOpen, Clock, Zap, ArrowRight, Lock } from "lucide-react";
import { getPathMeta, type PlannedPath } from "@/lib/learning-paths";
import { PathIcon } from "./PathIcon";
import { ProgressRing } from "./ProgressRing";

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

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const DIFF_TINT: Record<string, string> = {
  BEGINNER: "var(--beginner)",
  INTERMEDIATE: "var(--intermediate)",
  ADVANCED: "var(--advanced)",
};

/**
 * Primary path card. Three variants:
 * - "feature": large, gradient hero. Used for the active/recommended path.
 * - "row":     wide horizontal row. Used in the /learn list.
 * - "tile":    compact square-ish tile. Used in dashboards & knowledge map.
 */
export function PathCard({
  data,
  variant = "row",
}: {
  data: PathCardData;
  variant?: "feature" | "row" | "tile";
}) {
  if (variant === "tile") return <PathTile data={data} />;
  if (variant === "feature") return <PathFeature data={data} />;
  return <PathRow data={data} />;
}

/* ────────────────────────────────────────────────────────────────────────
 * Row variant — used in the /learn "Available paths" list
 * ──────────────────────────────────────────────────────────────────────── */

function PathRow({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;
  const totalHrs = data.totalMins > 0 ? +(data.totalMins / 60).toFixed(1) : 0;

  return (
    <Link
      href={`/learn/${data.slug}`}
      className="path-card-row"
      style={{
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        }}
      >
        {/* Brand accent stripe */}
        <div style={{ width: 4, background: meta.gradient, flexShrink: 0 }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "20px 22px",
            minWidth: 0,
          }}
        >
          <PathIcon slug={data.slug} size={52} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {data.title}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: DIFF_TINT[data.difficulty],
                  background: `color-mix(in srgb, ${DIFF_TINT[data.difficulty]} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${DIFF_TINT[data.difficulty]} 22%, transparent)`,
                  padding: "2px 7px",
                  borderRadius: 999,
                }}
              >
                {DIFF_LABEL[data.difficulty]}
              </span>
            </div>

            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {data.description}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              <Chip Icon={BookOpen} label={`${data.lessonCount} lessons`} />
              {totalHrs > 0 && <Chip Icon={Clock} label={`${totalHrs}h`} />}
              {data.totalXP > 0 && <Chip Icon={Zap} label={`${data.totalXP} XP`} color="var(--xp-gold)" />}
              {completed > 0 && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: meta.color,
                  }}
                >
                  {completed} / {data.lessonCount} complete
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
            {completed > 0 ? (
              <ProgressRing value={pct} size={52} stroke={4.5} color={meta.color} />
            ) : null}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                background: meta.color,
                color: "#fff",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                boxShadow: `0 4px 12px ${meta.glow}`,
              }}
            >
              {completed > 0 ? "Continue" : "Start path"} <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Tile variant — compact card for Knowledge Map grid
 * ──────────────────────────────────────────────────────────────────────── */

function PathTile({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;

  return (
    <Link
      href={`/learn/${data.slug}`}
      className="path-tile"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <div
        style={{
          position: "relative",
          background: meta.gradient,
          borderRadius: 16,
          padding: "18px 18px 16px",
          minHeight: 168,
          height: "100%",
          color: "#fff",
          overflow: "hidden",
          boxShadow: `0 8px 22px ${meta.glow}, 0 1px 0 rgba(255,255,255,0.12) inset`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Decorative blob */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -32,
            top: -32,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <meta.Icon size={20} color="#fff" />
          </div>
          {completed > 0 ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "rgba(255,255,255,0.95)",
                background: "rgba(255,255,255,0.18)",
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              {Math.round(pct * 100)}%
            </span>
          ) : (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.18)",
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              {data.lessonCount} lessons
            </span>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.01em" }}>
            {data.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.45,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </div>

          {/* Progress bar */}
          {completed > 0 && (
            <div
              style={{
                marginTop: 12,
                height: 4,
                background: "rgba(255,255,255,0.18)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct * 100}%`,
                  height: "100%",
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: 999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Feature variant — full-width gradient hero for the active path
 * ──────────────────────────────────────────────────────────────────────── */

function PathFeature({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;
  const continueHref =
    completed > 0 && data.firstLessonSlug
      ? `/lessons/${data.firstLessonSlug}`
      : `/learn/${data.slug}`;

  return (
    <Link href={continueHref} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          position: "relative",
          background: meta.gradient,
          borderRadius: 18,
          padding: "26px 28px",
          color: "#fff",
          overflow: "hidden",
          boxShadow: `0 16px 36px ${meta.glow}, 0 1px 0 rgba(255,255,255,0.12) inset`,
          transition: "transform 0.2s ease",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: 30,
            bottom: -70,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <meta.Icon size={30} color="#fff" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: 4,
              }}
            >
              {completed > 0 ? "Continue learning" : "Start here"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.015em", marginBottom: 6 }}>
              {data.title}
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>
              {data.description}
            </div>

            {completed > 0 && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    flex: 1,
                    maxWidth: 240,
                    height: 6,
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct * 100}%`,
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: 999,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                  {completed} / {data.lessonCount}
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 18px",
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.30)",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {completed > 0 ? "Resume" : "Begin"} <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Planned tile — coming-soon, non-clickable
 * ──────────────────────────────────────────────────────────────────────── */

export function PlannedPathTile({ data }: { data: PlannedPath }) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-card)",
        borderRadius: 16,
        padding: "18px",
        minHeight: 168,
        height: "100%",
        border: "1px dashed var(--border-default)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: 0.85,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--bg-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
          }}
        >
          <data.Icon size={20} />
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--text-tertiary)",
            background: "var(--bg-tertiary)",
            padding: "3px 8px",
            borderRadius: 999,
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Lock size={9} /> Planned
        </span>
      </div>

      <div>
        <div
          style={{
            fontSize: 15.5,
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
            lineHeight: 1.45,
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

/* ────────────────────────────────────────────────────────────────────────
 * Local helpers
 * ──────────────────────────────────────────────────────────────────────── */

function Chip({
  Icon,
  label,
  color = "var(--text-tertiary)",
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 500,
        color,
      }}
    >
      <Icon size={11} color={color} /> {label}
    </span>
  );
}
