"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Brain, BookOpen, Zap, Flame, Trophy, ArrowRight,
  Play, BarChart3, Clock, Star, LogIn,
} from "lucide-react";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1200;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * to));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Animated progress ring ────────────────────────────────────────────────────
function ProgressRing({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={6} />
      <circle
        ref={ref}
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={inView ? circ * (1 - pct / 100) : circ}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  isLoggedIn: boolean;
  userStats: {
    name: string; xp: number; level: number;
    currentStreak: number; longestStreak: number;
    completedLessons: number;
  };
  totalLessons: number;
  totalXP: number;
  recentLessons: { title: string; slug: string; pathTitle: string; pathSlug: string; pathColor: string }[];
  pathProgress: Record<string, number>;
  continuePath: {
    title: string; slug: string; color: string;
    lesson: { title: string; slug: string } | null;
  } | null;
  paths: {
    title: string; slug: string; color: string;
    totalLessons: number; xpAvailable: number;
    firstLesson: { slug: string } | null;
  }[];
}

// Framer-motion v12 needs explicit typing for Variants
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stagger: any = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

// ── Main component ────────────────────────────────────────────────────────────
export function DashboardClient({
  isLoggedIn, userStats, totalLessons, totalXP,
  recentLessons, pathProgress, continuePath, paths,
}: Props) {
  const overallPct = totalLessons > 0
    ? Math.round((userStats.completedLessons / totalLessons) * 100)
    : 0;

  const xpForNextLevel = 500;
  const xpInLevel = userStats.xp % xpForNextLevel;
  const levelPct = Math.round((xpInLevel / xpForNextLevel) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "32px 36px", maxWidth: 1100, width: "100%" }}>

      {/* ── Greeting ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ marginBottom: 32 }}
      >
        <motion.h1 variants={fadeUp} style={{
          fontSize: 30, fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em", lineHeight: 1.2,
          marginBottom: 6,
        }}>
          {greeting}, {userStats.name} 👋
        </motion.h1>
        <motion.p variants={fadeUp} style={{ fontSize: 15, color: "var(--text-tertiary)" }}>
          {isLoggedIn
            ? `You've completed ${userStats.completedLessons} of ${totalLessons} lessons. Keep it up!`
            : "Sign in to track your progress, earn XP, and build streaks."}
        </motion.p>
      </motion.div>

      {/* ── Guest CTA banner ── */}
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginBottom: 28,
              padding: "16px 22px",
              background: "linear-gradient(135deg, rgba(108,71,255,0.08), rgba(167,139,255,0.05))",
              border: "1px solid rgba(108,71,255,0.2)",
              borderRadius: 16,
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <Brain size={24} color="var(--accent)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                Track your progress — it&apos;s free!
              </div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Create an account to earn XP, maintain streaks, and unlock achievements.
              </div>
            </div>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 18px",
                  background: "var(--accent)", color: "#fff",
                  borderRadius: 10, fontSize: 13, fontWeight: 700,
                  whiteSpace: "nowrap", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(108,71,255,0.35)",
                }}
              >
                <LogIn size={15} /> Sign up free
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top stats row ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}
      >
        {[
          {
            icon: <Zap size={20} color="#eab308" />,
            label: "Total XP",
            value: <Counter to={userStats.xp} />,
            sub: `${totalXP.toLocaleString()} available`,
            bg: "rgba(234,179,8,0.08)",
            border: "rgba(234,179,8,0.15)",
          },
          {
            icon: <Flame size={20} color="#ef4444" />,
            label: "Streak",
            value: <Counter to={userStats.currentStreak} suffix="d" />,
            sub: `Best: ${userStats.longestStreak}d`,
            bg: "rgba(239,68,68,0.08)",
            border: "rgba(239,68,68,0.15)",
          },
          {
            icon: <BookOpen size={20} color="var(--accent)" />,
            label: "Lessons done",
            value: <Counter to={userStats.completedLessons} />,
            sub: `of ${totalLessons} total`,
            bg: "rgba(108,71,255,0.08)",
            border: "rgba(108,71,255,0.15)",
          },
          {
            icon: <Trophy size={20} color="#f97316" />,
            label: "Level",
            value: <Counter to={userStats.level} />,
            sub: `${xpInLevel}/${xpForNextLevel} to next`,
            bg: "rgba(249,115,22,0.08)",
            border: "rgba(249,115,22,0.15)",
          },
        ].map(stat => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
            style={{
              background: "var(--bg-surface)",
              border: `1px solid ${stat.border}`,
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex", flexDirection: "column", gap: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.2s",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: stat.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: -4 }}>
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Middle: Continue + Progress ring + Recent ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 18, marginBottom: 28 }}>

        {/* Continue learning hero */}
        {continuePath?.lesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 20,
              background: `linear-gradient(135deg, ${continuePath.color}18, ${continuePath.color}08)`,
              border: `1px solid ${continuePath.color}30`,
              padding: "28px 32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{
              position: "absolute", right: -30, top: -30,
              width: 180, height: 180, borderRadius: "50%",
              background: `${continuePath.color}10`,
            }} />
            <div style={{
              position: "absolute", right: 40, bottom: -60,
              width: 120, height: 120, borderRadius: "50%",
              background: `${continuePath.color}08`,
            }} />

            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: continuePath.color,
                background: `${continuePath.color}18`,
                padding: "4px 10px", borderRadius: 99,
                marginBottom: 14,
              }}>
                <Play size={10} /> Continue learning
              </div>

              <h2 style={{
                fontSize: 22, fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.25, marginBottom: 8,
                letterSpacing: "-0.02em",
              }}>
                {continuePath.lesson.title}
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-tertiary)", marginBottom: 22 }}>
                {continuePath.title}
              </p>

              <Link href={`/lessons/${continuePath.lesson.slug}`} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 24px",
                    background: continuePath.color, color: "#fff",
                    borderRadius: 12, fontSize: 15, fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 8px 24px ${continuePath.color}40`,
                  }}
                >
                  Start lesson <ArrowRight size={16} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Progress ring card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            background: "var(--bg-surface)",
            borderRadius: 20,
            border: "1px solid var(--border-subtle)",
            padding: "24px 20px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 12, textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Overall progress
          </div>

          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <ProgressRing pct={overallPct} color="var(--accent)" size={100} />
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                {overallPct}%
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>
              {userStats.completedLessons}/{totalLessons} lessons
            </div>
          </div>

          {/* XP level bar */}
          <div style={{ width: "100%", marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-tertiary)", marginBottom: 5 }}>
              <span>Level {userStats.level}</span>
              <span>{xpInLevel} / {xpForNextLevel} XP</span>
            </div>
            <div style={{ height: 5, background: "var(--border-subtle)", borderRadius: 99, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelPct}%` }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: "var(--accent)", borderRadius: 99 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Learning paths ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Learning paths
          </h2>
          <Link href="/learn" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {paths.map((path, i) => {
            const prog = pathProgress[path.slug] ?? 0;
            return (
              <motion.div
                key={path.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: 16,
                  border: "1px solid var(--border-subtle)",
                  padding: "20px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Color bar top */}
                <div style={{
                  height: 4, borderRadius: 99,
                  background: `linear-gradient(90deg, ${path.color}, ${path.color}60)`,
                  marginBottom: 16,
                }} />

                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                  {path.title}
                </div>

                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <BookOpen size={11} /> {path.totalLessons} lessons
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Zap size={11} /> {path.xpAvailable.toLocaleString()} XP
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 4, background: "var(--border-subtle)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: path.color, borderRadius: 99 }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 14 }}>
                  {prog}% complete
                </div>

                {path.firstLesson && (
                  <Link href={`/lessons/${path.firstLesson.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 12.5, fontWeight: 600, color: path.color,
                      padding: "7px 14px",
                      background: `${path.color}12`,
                      borderRadius: 8,
                      border: `1px solid ${path.color}25`,
                      cursor: "pointer",
                    }}>
                      {prog > 0 ? "Continue" : "Start"} <ArrowRight size={12} />
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Recent activity ── */}
      {recentLessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 14 }}>
            Recently completed
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentLessons.map((lesson, i) => (
              <motion.div
                key={lesson.slug}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
              >
                <Link href={`/lessons/${lesson.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 16px",
                    background: "var(--bg-surface)",
                    borderRadius: 12,
                    border: "1px solid var(--border-subtle)",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = lesson.pathColor; (e.currentTarget as HTMLDivElement).style.background = `${lesson.pathColor}06`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)"; }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${lesson.pathColor}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Star size={15} color={lesson.pathColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{lesson.pathTitle}</div>
                    </div>
                    <ArrowRight size={14} color="var(--text-tertiary)" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Quick links when no recent activity ── */}
      {recentLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: "24px 28px",
            background: "var(--bg-surface)",
            borderRadius: 16,
            border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", gap: 20,
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Brain size={26} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
              Ready to start learning?
            </div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              Pick a path and begin your AI engineering journey today.
            </div>
          </div>
          <Link href="/learn" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "11px 22px",
                background: "var(--accent)", color: "#fff",
                borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 6px 20px rgba(108,71,255,0.35)",
              }}
            >
              Browse paths <ArrowRight size={14} />
            </motion.div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
