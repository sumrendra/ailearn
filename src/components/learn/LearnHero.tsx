"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Map, Sparkles, Zap } from "lucide-react";
import { getPathMeta } from "@/lib/learning-paths";
import type { PathCardData } from "./PathCard";

interface LearnHeroProps {
  stats: {
    paths: number;
    lessons: number;
    completed: number;
    totalXP: number;
    totalHours: number;
    isAuthed: boolean;
  };
  featured?: PathCardData;
}

/**
 * Hero block for the /learn page.
 *
 * Combines: animated mesh gradient background, big display headline,
 * inline stats strip, and a "continue your journey" featured-path card.
 * Everything animates in on mount via Framer Motion stagger.
 */
export function LearnHero({ stats, featured }: LearnHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        margin: "32px 0 48px",
        padding: "56px 48px",
        borderRadius: 28,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="mesh-bg" />

      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-eyebrow"
            style={{
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 16,
            }}
          >
            <Sparkles size={11} strokeWidth={2.5} /> Your learning library
          </span>
        </motion.div>

        <motion.h1
          className="display-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: "var(--text-primary)",
            maxWidth: 760,
            marginBottom: 20,
          }}
        >
          {stats.isAuthed
            ? <>Pick up where you left off, or <span style={gradientText}>start something new</span>.</>
            : <>The complete library, from <span style={gradientText}>first principles to production</span>.</>}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.10, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 620,
            marginBottom: 36,
          }}
        >
          {stats.paths} hand-crafted paths covering AI engineering, software architecture, languages, and tools — written for senior engineers and beginners alike.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 36,
            paddingTop: 8,
            borderTop: "1px solid var(--border-subtle)",
            marginBottom: featured ? 40 : 0,
          }}
        >
          <Stat Icon={Map}      value={stats.paths}   label="paths" />
          <Stat Icon={BookOpen} value={stats.lessons} label={stats.isAuthed ? `${stats.completed} completed` : "lessons"} />
          <Stat Icon={Zap}      value={`${stats.totalXP.toLocaleString()} XP`} label="to earn" />
          <Stat Icon={Clock}    value={`${stats.totalHours}h`} label="of content" />
        </motion.div>

        {/* Featured path card — only when there is one */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: 40 }}
          >
            <FeaturedCard data={featured} resume={stats.isAuthed && (featured.completedLessons ?? 0) > 0} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Stat({
  Icon,
  value,
  label,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  value: string | number;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary)",
          flexShrink: 0,
        }}
      >
        <Icon size={14} strokeWidth={2} />
      </div>
      <div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ data, resume }: { data: PathCardData; resume: boolean }) {
  const meta = getPathMeta(data.slug);
  const pct = data.lessonCount > 0 ? (data.completedLessons ?? 0) / data.lessonCount : 0;
  const href = resume && data.firstLessonSlug
    ? `/lessons/${data.firstLessonSlug}`
    : `/learn/${data.slug}`;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        style={{
          position: "relative",
          padding: "26px 30px",
          background: meta.gradient,
          borderRadius: 20,
          color: "#fff",
          boxShadow: `0 18px 40px ${meta.glow}, 0 1px 0 rgba(255,255,255,0.15) inset`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 24,
          cursor: "pointer",
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            filter: "blur(4px)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: 40,
            bottom: -80,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            backdropFilter: "blur(8px)",
          }}
        >
          <meta.Icon size={28} color="#fff" strokeWidth={2} />
        </div>

        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
              marginBottom: 6,
            }}
          >
            {resume ? "Continue learning" : "Start here"}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.018em",
              marginBottom: 4,
              lineHeight: 1.15,
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.5,
              maxWidth: 480,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </div>

          {resume && (
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  maxWidth: 280,
                  height: 5,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: "100%",
                    background: "rgba(255,255,255,0.95)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {data.completedLessons} / {data.lessonCount}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.32)",
            borderRadius: 12,
            fontSize: 14.5,
            fontWeight: 600,
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {resume ? "Resume" : "Begin"} <ArrowRight size={15} />
        </div>
      </motion.div>
    </Link>
  );
}

const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, hsl(258 87% 64%), hsl(196 87% 56%), hsl(330 87% 64%))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};
