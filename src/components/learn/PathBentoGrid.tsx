"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Zap, CheckCircle2 } from "lucide-react";
import { getPathMeta } from "@/lib/learning-paths";
import type { PathCardData } from "./PathCard";

interface PathBentoGridProps {
  paths: PathCardData[];
}

/**
 * Bento-style grid of all paths. Cards have varying visual weight based on
 * their tier — foundations get larger gradient hero cards, specializations
 * and advanced get tighter glass cards. Stagger-animated on mount.
 */
export function PathBentoGrid({ paths }: PathBentoGridProps) {
  const foundations    = paths.filter((p) => getPathMeta(p.slug).tier === "foundation");
  const specializations = paths.filter((p) => getPathMeta(p.slug).tier === "specialization");
  const advanced       = paths.filter((p) => getPathMeta(p.slug).tier === "advanced");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      {foundations.length > 0 && (
        <Tier
          eyebrow="Foundations"
          title="The bedrock"
          subtitle="Start here — broadly useful, builds intuition for everything that follows."
        >
          <Grid cards={foundations} variant="hero" />
        </Tier>
      )}

      {specializations.length > 0 && (
        <Tier
          eyebrow="Specializations"
          title="Go deep on a domain"
          subtitle="Pick a track that matches your work or your interest. Each is self-contained."
        >
          <Grid cards={specializations} variant="hero" />
        </Tier>
      )}

      {advanced.length > 0 && (
        <Tier
          eyebrow="Advanced"
          title="Senior-level material"
          subtitle="Architecture, distributed systems, and senior-interview prep."
        >
          <Grid cards={advanced} variant="hero" />
        </Tier>
      )}
    </div>
  );
}

function Tier({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 24 }}
      >
        <div
          className="text-eyebrow"
          style={{ color: "var(--accent)", marginBottom: 10 }}
        >
          {eyebrow}
        </div>
        <h2 className="display-md" style={{ marginBottom: 8 }}>{title}</h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            maxWidth: 580,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function Grid({ cards, variant }: { cards: PathCardData[]; variant: "hero" | "compact" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
      }}
    >
      {cards.map((data, i) => (
        <motion.div
          key={data.slug}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.45,
            delay: i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {variant === "hero" ? <BentoCard data={data} /> : <CompactCard data={data} />}
        </motion.div>
      ))}
    </div>
  );
}

/* ── BentoCard — premium gradient surface with rich content ─────────────── */

function BentoCard({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;
  const totalHrs = data.totalMins > 0 ? +(data.totalMins / 60).toFixed(1) : 0;

  return (
    <Link href={`/learn/${data.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "relative",
          height: "100%",
          minHeight: 240,
          padding: 24,
          borderRadius: 18,
          background: meta.gradient,
          color: "#fff",
          overflow: "hidden",
          boxShadow: `0 10px 30px ${meta.glow}, 0 1px 0 rgba(255,255,255,0.12) inset`,
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Decorative blob */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -50,
            top: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -30,
            bottom: -60,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.10)",
            pointerEvents: "none",
          }}
        />

        {/* Top row: icon + completion badge */}
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <meta.Icon size={22} color="#fff" strokeWidth={2} />
          </div>

          {completed > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                background: completed === data.lessonCount ? "rgba(34, 197, 94, 0.5)" : "rgba(255,255,255,0.22)",
                border: "1px solid rgba(255,255,255,0.32)",
                padding: "4px 10px",
                borderRadius: 999,
                letterSpacing: "0.04em",
              }}
            >
              {completed === data.lessonCount && <CheckCircle2 size={11} strokeWidth={2.5} />}
              {Math.round(pct * 100)}%
            </span>
          ) : (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.18)",
                padding: "4px 10px",
                borderRadius: 999,
                letterSpacing: "0.04em",
              }}
            >
              {data.lessonCount} lessons
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ position: "relative", marginTop: 18, flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 6 }}>
            {data.title}
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.55,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.description}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "relative",
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.78)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={12} /> {data.lessonCount}
            </span>
            {totalHrs > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} /> {totalHrs}h
              </span>
            )}
            {data.totalXP > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} /> {data.totalXP}
              </span>
            )}
          </div>
          <ArrowRight size={16} color="rgba(255,255,255,0.92)" />
        </div>

        {/* Progress underline */}
        {completed > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 3,
              background: "rgba(0,0,0,0.18)",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: "100%",
                background: "rgba(255,255,255,0.92)",
              }}
            />
          </div>
        )}
      </motion.div>
    </Link>
  );
}

/* ── CompactCard — glass surface for the advanced tier ──────────────────── */

function CompactCard({ data }: { data: PathCardData }) {
  const meta = getPathMeta(data.slug);
  const completed = data.completedLessons ?? 0;
  const pct = data.lessonCount > 0 ? completed / data.lessonCount : 0;

  return (
    <Link href={`/learn/${data.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="hover-card"
        style={{
          position: "relative",
          padding: 22,
          borderRadius: 16,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: meta.tint,
              border: `1px solid ${meta.ring}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <meta.Icon size={20} color={meta.color} strokeWidth={2} />
          </div>
          {completed > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, color: meta.color }}>
              {Math.round(pct * 100)}%
            </span>
          )}
        </div>

        <div style={{ marginTop: 14, flex: 1 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              marginBottom: 6,
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
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

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          <span>{data.lessonCount} lessons</span>
          <ArrowRight size={14} color={meta.color} />
        </div>
      </motion.div>
    </Link>
  );
}
