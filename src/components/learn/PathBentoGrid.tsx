"use client";

import { motion } from "framer-motion";
import { getPathMeta } from "@/lib/learning-paths";
import { PathCard, type PathCardData } from "./PathCard";

interface PathBentoGridProps {
  paths: PathCardData[];
}

/**
 * Three-row bento grid by tier (DESIGN.md §Per-surface contracts → Learn):
 *
 *   Foundation       — 3-up, the broad starts (LLMs, SQL, Java, etc.)
 *   Specialization   — 2-up, deeper tracks
 *   Advanced         — large 1- or 2-up, senior material
 *
 * Each row uses a CSS grid with generous gap (~28px). Section headers are
 * `.mono-overline` siblings of the grid, never wrappers around individual
 * cards. Cards are single-elevation and breathe — see PathCard.tsx.
 */
export function PathBentoGrid({ paths }: PathBentoGridProps) {
  const foundations    = paths.filter((p) => getPathMeta(p.slug).tier === "foundation");
  const specializations = paths.filter((p) => getPathMeta(p.slug).tier === "specialization");
  const advanced       = paths.filter((p) => getPathMeta(p.slug).tier === "advanced");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
      {foundations.length > 0 && (
        <Tier
          overline="Foundation"
          title="Start here"
          subtitle="Broad, broadly useful. The intuition every later path assumes."
          cards={foundations}
          columns="three"
        />
      )}

      {specializations.length > 0 && (
        <Tier
          overline="Specialization"
          title="Go deep on a domain"
          subtitle="Pick a track that matches your week's work. Each is self-contained."
          cards={specializations}
          columns="two"
        />
      )}

      {advanced.length > 0 && (
        <Tier
          overline="Advanced"
          title="Senior-level material"
          subtitle="Distributed systems, JVM internals, senior-interview shape."
          cards={advanced}
          columns="two"
        />
      )}
    </div>
  );
}

type Columns = "three" | "two" | "one";

function Tier({
  overline,
  title,
  subtitle,
  cards,
  columns,
}: {
  overline: string;
  title: string;
  subtitle: string;
  cards: PathCardData[];
  columns: Columns;
}) {
  return (
    <section>
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 24,
          maxWidth: 640,
        }}
      >
        <span
          className="mono-overline"
          style={{ color: "var(--accent-text)" }}
        >
          {overline}
        </span>
        <h2
          className="display-md"
          style={{ color: "var(--text-primary)", margin: 0 }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </motion.header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridFor(columns),
          gap: 28,
        }}
        className={`bento-row bento-row--${columns}`}
      >
        {cards.map((data, i) => (
          <motion.div
            key={data.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              delay: Math.min(i * 0.05, 0.25),
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ height: "100%" }}
          >
            <PathCard data={data} variant="row" />
          </motion.div>
        ))}
      </div>

      {/* Responsive collapse — keep cards breathing on smaller widths. */}
      <style>{`
        @media (max-width: 1100px) {
          .bento-row--three { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 760px) {
          .bento-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function gridFor(columns: Columns): string {
  switch (columns) {
    case "three":
      return "repeat(3, minmax(0, 1fr))";
    case "two":
      return "repeat(2, minmax(0, 1fr))";
    case "one":
    default:
      return "minmax(0, 1fr)";
  }
}
