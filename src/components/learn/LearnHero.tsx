"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Waypoints } from "lucide-react";
import { PathObjectSafe } from "./PathObjectSafe";
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
  /** Most-progressed incomplete path; falls back to the first foundation. */
  featured?: PathCardData;
}

/**
 * Asymmetric /learn hero (DESIGN.md §Per-surface contracts → Learn).
 *
 * Left column: mono-overline → serif display headline → lede → primary CTA.
 * Right column: generative SVG <PathObject> for the featured path (or a
 * tinted mini-mesh fallback).
 *
 * No nested cards, no gradient text, no decorative orbs — the atmospheric
 * layer the root layout already paints does the ambient work. The hero is
 * just type + a generative object.
 */
export function LearnHero({ stats, featured }: LearnHeroProps) {
  const cta = resolveCta(stats, featured);

  return (
    <section
      style={{
        position: "relative",
        margin: "16px 0 56px",
        // Hero breathes against the canvas — no surface fill, no border.
        // The atmospheric mesh painted by the app shell is the backdrop.
        padding: "32px 0 0",
      }}
    >
      <div
        style={{
          display: "grid",
          // Asymmetric: copy takes 1.25fr, the generative object takes 1fr.
          // Below ~960px the right rail wraps under the copy block.
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
          gap: "clamp(32px, 6vw, 72px)",
          alignItems: "center",
        }}
        className="learn-hero-grid"
      >
        {/* ── Copy column ─────────────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mono-overline" style={{ marginBottom: 20 }}>
              Foundation &nbsp;·&nbsp; Specialization &nbsp;·&nbsp; Advanced
            </span>
          </motion.div>

          <motion.h1
            className="display-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "var(--text-primary)",
              margin: "18px 0 22px",
              maxWidth: "18ch",
            }}
          >
            Master the AI engineering stack.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              margin: 0,
            }}
          >
            Thirteen opinionated paths, written for technical adults — from
            transformer internals and retrieval pipelines to the Java, SQL,
            and systems work that actually ships. No fluff, no celebration
            copy, just material worth your evening.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <Link href={cta.href} style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 22px",
                  background: "var(--accent)",
                  color: "var(--bg-app)",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-md, 10px)",
                  fontSize: 14.5,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  cursor: "pointer",
                  transition: "box-shadow 0.18s ease, background 0.18s ease",
                  boxShadow: "0 0 0 0 var(--accent-glow)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 40px var(--accent-glow)";
                  e.currentTarget.style.background = "var(--accent-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 0 var(--accent-glow)";
                  e.currentTarget.style.background = "var(--accent)";
                }}
              >
                {cta.label}
                <ArrowRight size={16} strokeWidth={2.25} />
              </button>
            </Link>
            <Link href="/map" style={{ textDecoration: "none" }}>
              <button
                type="button"
                className="glow-ring"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 20px",
                  background: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md, 10px)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  cursor: "pointer",
                  transition: "border-color 0.18s ease, color 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-default)";
                }}
              >
                <Waypoints size={15} strokeWidth={2.25} />
                Knowledge map
              </button>
            </Link>
            {cta.subline && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-tertiary)",
                  letterSpacing: "-0.005em",
                }}
              >
                {cta.subline}
              </span>
            )}
          </motion.div>
        </div>

        {/* ── Generative object column ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 280,
          }}
        >
          {featured ? (
            <PathObjectSafe slug={featured.slug} size={420} />
          ) : (
            <PathObjectSafe slug="llm-foundations" size={420} />
          )}
        </motion.div>
      </div>

      {/* ── Stats strip — bottom of hero, 4-up mono numerals ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hairline-t"
        style={{
          marginTop: 56,
          paddingTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        <Stat
          value={String(stats.paths)}
          label="Paths"
        />
        <Stat
          value={String(stats.lessons)}
          label={stats.isAuthed ? `${stats.completed} completed` : "Lessons"}
        />
        <Stat
          value={`${stats.totalXP.toLocaleString()}`}
          label="XP available"
        />
        <Stat
          value={`${stats.totalHours}`}
          unit="h"
          label="Of content"
        />
      </motion.div>

      {/* Responsive: collapse to single column under 960px. */}
      <style>{`
        @media (max-width: 960px) {
          .learn-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          lineHeight: 1,
          display: "flex",
          alignItems: "baseline",
          gap: 2,
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: 16,
              color: "var(--text-tertiary)",
              fontWeight: 500,
              marginLeft: 1,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      <div
        className="mono-overline"
        style={{
          marginTop: 8,
          color: "var(--text-tertiary)",
          // Override .mono-overline's accent-text color for footer labels.
        }}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * Resolves the primary CTA href + copy.
 *
 * - In-progress path → "Continue learning" + first incomplete-or-first lesson.
 * - Authed-but-fresh user → "Start with <first foundation>" jumps to /learn/<slug>.
 * - Anonymous → same as fresh authed.
 */
function resolveCta(
  stats: LearnHeroProps["stats"],
  featured?: PathCardData,
): { href: string; label: string; subline?: string } {
  if (!featured) {
    return {
      href: "/learn/llm-foundations",
      label: "Start with LLM Foundations",
      subline: "First foundation path · ~8h of material",
    };
  }
  const progressed =
    (featured.completedLessons ?? 0) > 0 &&
    (featured.completedLessons ?? 0) < featured.lessonCount;

  if (progressed && stats.isAuthed) {
    return {
      href: featured.firstLessonSlug
        ? `/lessons/${featured.firstLessonSlug}`
        : `/learn/${featured.slug}`,
      label: "Continue learning",
      subline: `${featured.title} · ${featured.completedLessons}/${featured.lessonCount} lessons`,
    };
  }
  return {
    href: `/learn/${featured.slug}`,
    label: `Start with ${featured.title}`,
    subline: `${featured.lessonCount} lessons${
      featured.totalMins > 0
        ? ` · ~${Math.round(featured.totalMins / 60)}h`
        : ""
    }`,
  };
}
