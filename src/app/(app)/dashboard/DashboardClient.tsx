"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Flame, Trophy, Zap, ArrowRight, Clock, Play,
  CheckCircle2, Circle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RecentSession {
  title: string; slug: string;
  pathTitle: string; pathSlug: string; pathColor: string;
  status: "IN_PROGRESS" | "COMPLETED";
  updatedAt: string;
  timeSpentMins: number;
  estimatedMins: number;
}

interface CurrentLesson {
  title: string; slug: string;
  pathTitle: string; pathSlug: string; pathColor: string;
  timeSpentMins: number;
  estimatedMins: number;
  lastAccessedISO: string;
}

interface QueueItem {
  title: string; slug: string;
  estimatedMins: number;
  pathTitle: string; pathColor: string;
}

interface Props {
  isLoggedIn: boolean;
  userStats: {
    name: string; xp: number; level: number;
    currentStreak: number; longestStreak: number;
    completedLessons: number;
  };
  totalLessons: number;
  totalXP: number;
  recentSessions: RecentSession[];
  pathProgress: { slug: string; title: string; color: string; pct: number }[];
  currentLesson: CurrentLesson | null;
  queue: QueueItem[];
}

// ── Shared style snippets ─────────────────────────────────────────────────────
const monoNumeral: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontVariantNumeric: "tabular-nums",
};

// Format a number in mono with thousands separator (no localization quirks)
function num(n: number): string {
  return n.toLocaleString("en-US");
}

// "X min ago" / "X h ago" / "Y days ago"
function relativeTime(iso: string, nowMs: number): string {
  const then = new Date(iso).getTime();
  const sec = Math.max(0, Math.round((nowMs - then) / 1000));
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} h ago`;
  const days = Math.round(hr / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const mo = Math.round(days / 30);
  return `${mo} mo ago`;
}

// Hydration-safe client clock via useSyncExternalStore. SSR snapshot is 0;
// hydrated client snapshot is Date.now(); we tick once a minute and notify.
function subscribeNow(cb: () => void): () => void {
  const t = window.setInterval(cb, 60_000);
  return () => window.clearInterval(t);
}
function useNow(): number {
  return useSyncExternalStore(
    subscribeNow,
    () => Date.now(),
    () => 0,
  );
}

// Stable, server-safe fallback: short ISO date (YYYY-MM-DD)
function isoShort(iso: string): string {
  return iso.slice(0, 10);
}

// ── Main component ────────────────────────────────────────────────────────────
export function DashboardClient({
  isLoggedIn,
  userStats,
  totalLessons,
  totalXP,
  recentSessions,
  pathProgress,
  currentLesson,
  queue,
}: Props) {
  const now = useNow();

  const overallPct = totalLessons > 0
    ? Math.round((userStats.completedLessons / totalLessons) * 100)
    : 0;

  // Section heading copy — no greeting, just orient the user
  const overlineCopy = currentLesson ? "Currently learning" : "Begin";
  const headlineCopy = currentLesson
    ? currentLesson.pathTitle
    : "Choose a path to begin";

  return (
    <div
      style={{
        padding: "40px clamp(24px, 4vw, 48px) 80px",
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
        color: "var(--text-primary)",
      }}
    >
      {/* ── Header: overline + serif headline (no greeting) ───────────────── */}
      <header style={{ marginBottom: 36 }}>
        <div className="mono-overline" style={{ marginBottom: 12 }}>
          {overlineCopy}
        </div>
        <h1
          className="display-md"
          style={{
            margin: 0,
            color: "var(--text-primary)",
            maxWidth: 900,
          }}
        >
          {headlineCopy}
        </h1>
      </header>

      {/* Responsive: stack the hero + path-progress on narrow screens.
          Inline media-query via a scoped <style> — no new tokens required. */}
      <style>{`
        @media (max-width: 880px) {
          .studio-hero { grid-template-columns: 1fr !important; }
          .studio-path-row { grid-template-columns: minmax(0,1fr) 100px auto !important; }
        }
      `}</style>

      {/* ── Hero: 2-col studio (continue panel + stats panel) ─────────────── */}
      <section
        className="studio-hero"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 20,
          marginBottom: 48,
        }}
      >
        {/* LEFT: Continue learning panel */}
        <ContinuePanel
          isLoggedIn={isLoggedIn}
          currentLesson={currentLesson}
          now={now}
        />

        {/* RIGHT: Streak · XP · Level stat trio */}
        <StatsPanel
          isLoggedIn={isLoggedIn}
          streak={userStats.currentStreak}
          longestStreak={userStats.longestStreak}
          xp={userStats.xp}
          totalXP={totalXP}
          level={userStats.level}
          overallPct={overallPct}
        />
      </section>

      {/* ── Recent sessions feed ──────────────────────────────────────────── */}
      <RecentSessionsFeed sessions={recentSessions} isLoggedIn={isLoggedIn} now={now} />

      {/* ── Today's queue ─────────────────────────────────────────────────── */}
      <TodaysQueue queue={queue} hasFocus={!!currentLesson} />

      {/* ── Path progress — secondary, mono numerals only ─────────────────── */}
      {isLoggedIn && pathProgress.length > 0 && (
        <PathProgressList pathProgress={pathProgress} />
      )}
    </div>
  );
}

// ── Continue panel (LEFT of hero) ─────────────────────────────────────────────
function ContinuePanel({
  isLoggedIn,
  currentLesson,
  now,
}: {
  isLoggedIn: boolean;
  currentLesson: CurrentLesson | null;
  now: number;
}) {
  // Empty / unauthed state — keep it sparse, single CTA
  if (!isLoggedIn || !currentLesson) {
    return (
      <article
        className="glass-pane"
        style={{
          borderRadius: "var(--radius-xl)",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minHeight: 220,
        }}
      >
        <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
          {isLoggedIn ? "No lesson in progress" : "Get started"}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            maxWidth: 460,
          }}
        >
          {isLoggedIn
            ? "Pick a path to begin."
            : "Browse the paths and start a session. Sign in to track time, streak, and XP."}
        </p>
        <div style={{ marginTop: "auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <PrimaryCTA href="/learn" label="Browse paths" />
          {!isLoggedIn && (
            <SecondaryCTA href="/signup" label="Create account" />
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className="glass-pane glow-ring"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minHeight: 220,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Path-color hairline at top edge — ambient identity, not a "bar" */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${currentLesson.pathColor}, transparent)`,
          opacity: 0.6,
        }}
      />

      <header style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: currentLesson.pathColor,
            boxShadow: `0 0 12px ${currentLesson.pathColor}`,
          }}
        />
        <span
          className="mono-overline"
          style={{ color: "var(--text-tertiary)" }}
        >
          {currentLesson.pathTitle}
        </span>
      </header>

      <h2
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: "var(--text-primary)",
          lineHeight: 1.25,
        }}
      >
        {currentLesson.title}
      </h2>

      {/* Lesson facts — mono numerals, hairline-divided */}
      <dl
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 24px",
          margin: 0,
          color: "var(--text-tertiary)",
          fontSize: 13,
        }}
      >
        <FactPair label="Time spent">
          <span style={monoNumeral}>{num(currentLesson.timeSpentMins)}</span>
          {" min"}
        </FactPair>
        <FactPair label="Estimated">
          <span style={monoNumeral}>{num(currentLesson.estimatedMins)}</span>
          {" min"}
        </FactPair>
        <FactPair label="Last opened">
          <span style={monoNumeral}>
            {now > 0 ? relativeTime(currentLesson.lastAccessedISO, now) : isoShort(currentLesson.lastAccessedISO)}
          </span>
        </FactPair>
      </dl>

      <div style={{ marginTop: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <PrimaryCTA
          href={`/lessons/${currentLesson.slug}`}
          label="Resume"
          icon={<Play size={15} strokeWidth={2.5} />}
        />
      </div>
    </article>
  );
}

// Small label/value pair for the lesson-facts row
function FactPair({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        className="mono-overline"
        style={{
          color: "var(--text-muted)",
          fontSize: 9.5,
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{children}</span>
    </div>
  );
}

// ── Stats panel (RIGHT of hero) ───────────────────────────────────────────────
function StatsPanel({
  isLoggedIn,
  streak,
  longestStreak,
  xp,
  totalXP,
  level,
  overallPct,
}: {
  isLoggedIn: boolean;
  streak: number;
  longestStreak: number;
  xp: number;
  totalXP: number;
  level: number;
  overallPct: number;
}) {
  return (
    <article
      className="glass-pane"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
      }}
    >
      <div
        className="mono-overline"
        style={{ color: "var(--text-tertiary)", marginBottom: 4 }}
      >
        Studio · facts
      </div>

      {/* Three large mono numerals, hairline-divided between rows */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <StatRow
          icon={<Flame size={18} strokeWidth={2} color="var(--streak-orange)" />}
          label="Day streak"
          value={streak}
          sub={`Best ${num(longestStreak)}`}
          isLoggedIn={isLoggedIn}
        />
        <StatRow
          icon={<Zap size={18} strokeWidth={2} />}
          label="XP earned"
          value={xp}
          sub={`of ${num(totalXP)} available`}
          isLoggedIn={isLoggedIn}
        />
        <StatRow
          icon={<Trophy size={18} strokeWidth={2} />}
          label="Level"
          value={level}
          sub={`${overallPct}% across all paths`}
          isLoggedIn={isLoggedIn}
          isLast
        />
      </div>
    </article>
  );
}

function StatRow({
  icon,
  label,
  value,
  sub,
  isLoggedIn,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  isLoggedIn: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={isLast ? "" : "hairline-b"}
      style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr auto",
        gap: 14,
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <span style={{ color: "var(--text-tertiary)", display: "flex" }}>{icon}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          className="mono-overline"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {isLoggedIn ? sub : "Sign in to track"}
        </span>
      </div>
      <span
        style={{
          ...monoNumeral,
          fontSize: 30,
          fontWeight: 500,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {num(value)}
      </span>
    </div>
  );
}

// ── Recent sessions feed (rows, not cards) ────────────────────────────────────
function RecentSessionsFeed({
  sessions,
  isLoggedIn,
  now,
}: {
  sessions: RecentSession[];
  isLoggedIn: boolean;
  now: number;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
          Recent sessions
        </div>
        {isLoggedIn && sessions.length > 0 && (
          <Link
            href="/learn"
            style={{
              fontSize: 13,
              color: "var(--accent-text)",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
          >
            All paths →
          </Link>
        )}
      </header>

      {sessions.length === 0 ? (
        <div
          style={{
            padding: "28px 4px",
            color: "var(--text-tertiary)",
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 540,
          }}
        >
          {isLoggedIn
            ? "No sessions yet. Today is a good day to start one."
            : "Sign in to see your sessions here. Until then — your first lesson is one click away."}
        </div>
      ) : (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            borderTop: "1px solid var(--hairline-bottom)",
          }}
        >
          {sessions.map((s) => (
            <li key={s.slug + s.updatedAt} className="hairline-b">
              <Link
                href={`/lessons/${s.slug}`}
                className="glow-ring"
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px minmax(0, 1fr) auto auto",
                  gap: 16,
                  alignItems: "center",
                  padding: "16px 12px",
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {/* path color dot */}
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.pathColor,
                    boxShadow: `0 0 8px ${s.pathColor}`,
                  }}
                />

                {/* title + path */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>{s.pathTitle}</span>
                    {s.status === "COMPLETED" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--success)" }}>
                        <CheckCircle2 size={11} strokeWidth={2.5} />
                        Completed
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Circle size={11} strokeWidth={2.5} />
                        In progress
                      </span>
                    )}
                  </div>
                </div>

                {/* time spent */}
                <span
                  style={{
                    ...monoNumeral,
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Clock size={11} strokeWidth={2} />
                  {num(s.timeSpentMins)} min
                </span>

                {/* relative timestamp — mono */}
                <span
                  style={{
                    ...monoNumeral,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {now > 0 ? relativeTime(s.updatedAt, now) : isoShort(s.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Today's queue ─────────────────────────────────────────────────────────────
function TodaysQueue({ queue, hasFocus }: { queue: QueueItem[]; hasFocus: boolean }) {
  if (queue.length === 0) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <header style={{ marginBottom: 14 }}>
        <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
          {hasFocus ? "Up next on this path" : "Today's queue"}
        </div>
      </header>

      <div
        className="glass-pane"
        style={{
          borderRadius: "var(--radius-xl)",
          padding: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {queue.map((q, i) => (
          <Link
            key={q.slug}
            href={`/lessons/${q.slug}`}
            className="glow-ring"
            style={{
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
              gap: 16,
              alignItems: "center",
              padding: "14px 18px",
              textDecoration: "none",
              color: "inherit",
              borderRadius: "var(--radius-md)",
              borderTop: i === 0 ? "none" : "1px solid var(--hairline-bottom)",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: q.pathColor,
                opacity: 0.85,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {q.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  marginTop: 2,
                }}
              >
                {q.pathTitle}
              </div>
            </div>
            <span
              style={{
                ...monoNumeral,
                fontSize: 12,
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <Clock size={11} strokeWidth={2} />
              {num(q.estimatedMins)} min
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--accent)",
                whiteSpace: "nowrap",
              }}
            >
              Start
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Path progress — list of facts, not cards ──────────────────────────────────
function PathProgressList({
  pathProgress,
}: {
  pathProgress: { slug: string; title: string; color: string; pct: number }[];
}) {
  // Only show paths with ANY progress; sort by % desc; cap at 6
  const entries = pathProgress
    .filter((p) => p.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);

  if (entries.length === 0) return null;

  return (
    <section>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div className="mono-overline" style={{ color: "var(--text-tertiary)" }}>
          Path progress
        </div>
        <Link
          href="/learn"
          style={{
            fontSize: 13,
            color: "var(--accent-text)",
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
          }}
        >
          All paths →
        </Link>
      </header>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          borderTop: "1px solid var(--hairline-bottom)",
        }}
      >
        {entries.map((p) => (
          <li
            key={p.slug}
            className="hairline-b studio-path-row"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 180px auto",
              gap: 16,
              alignItems: "center",
              padding: "14px 12px",
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: p.color,
                  flexShrink: 0,
                }}
              />
              {p.title}
            </span>
            <div
              aria-hidden
              style={{
                height: 2,
                background: "var(--border-subtle)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${p.pct}%`,
                  background: "var(--accent)",
                  borderRadius: 99,
                }}
              />
            </div>
            <span
              style={{
                ...monoNumeral,
                fontSize: 13,
                color: "var(--text-tertiary)",
                textAlign: "right",
                minWidth: 44,
              }}
            >
              {p.pct}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── CTAs ──────────────────────────────────────────────────────────────────────
function PrimaryCTA({
  href, label, icon,
}: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 20px",
        background: "var(--accent)",
        color: "var(--text-on-accent)",
        borderRadius: "var(--radius-md)",
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "-0.005em",
        boxShadow:
          "0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent)",
        transition: "box-shadow 0.18s ease, background 0.18s ease",
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

function SecondaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 20px",
        background: "transparent",
        color: "var(--text-secondary)",
        borderRadius: "var(--radius-md)",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        border: "1px solid var(--border-default)",
        transition: "border-color 0.18s ease, color 0.18s ease",
      }}
    >
      {label}
    </Link>
  );
}
