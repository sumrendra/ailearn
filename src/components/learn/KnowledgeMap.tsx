import { Sparkles } from "lucide-react";
import { getPathMeta, PLANNED_PATHS } from "@/lib/learning-paths";
import { PathCard, PlannedPathTile, type PathCardData } from "./PathCard";

interface KnowledgeMapProps {
  paths: PathCardData[];
  /** Hide the planned/coming-soon section. Default: show. */
  hidePlanned?: boolean;
}

/**
 * Premium learning roadmap.
 *
 * Replaces the previous 960px hard-coded canvas with a responsive grid that:
 *   - reflows on any viewport (CSS Grid auto-fit, minmax),
 *   - is fully data-driven (no hardcoded node list),
 *   - separates Foundations from Specializations,
 *   - shows real per-path progress when available.
 *
 * Server-component safe: no client hooks. Hover states are CSS.
 */
export function KnowledgeMap({ paths, hidePlanned = false }: KnowledgeMapProps) {
  const foundations = paths.filter((p) => getPathMeta(p.slug).tier === "foundation");
  const specializations = paths.filter((p) => getPathMeta(p.slug).tier === "specialization");

  return (
    <section
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            <Sparkles size={12} /> Knowledge Map
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.015em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Your roadmap from zero to production
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            Start with foundations, branch into the specializations that match your goals.
          </p>
        </div>
        <Legend />
      </header>

      {/* Foundations tier */}
      {foundations.length > 0 && (
        <Tier label="Foundations" hint="Build the bedrock — required before specializing">
          <PathGrid paths={foundations} />
        </Tier>
      )}

      {/* Specializations tier */}
      {specializations.length > 0 && (
        <Tier
          label="Specializations"
          hint="Branch deep into the area that matches your goals"
          divider
        >
          <PathGrid paths={specializations} />
        </Tier>
      )}

      {/* Planned tier */}
      {!hidePlanned && PLANNED_PATHS.length > 0 && (
        <Tier label="Coming soon" hint="Tracks landing in upcoming releases" divider muted>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {PLANNED_PATHS.map((p) => (
              <PlannedPathTile key={p.slug} data={p} />
            ))}
          </div>
        </Tier>
      )}
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Tier({
  label,
  hint,
  divider,
  muted,
  children,
}: {
  label: string;
  hint: string;
  divider?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "22px 24px 24px",
        borderTop: divider ? "1px solid var(--border-subtle)" : undefined,
        background: muted ? "var(--bg-sunken, var(--bg-secondary))" : "var(--bg-card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{hint}</span>
      </div>
      {children}
    </div>
  );
}

function PathGrid({ paths }: { paths: PathCardData[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 14,
      }}
    >
      {paths.map((p) => (
        <PathCard key={p.slug} data={p} variant="tile" />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {[
        { color: "var(--accent)", label: "Available" },
        { color: "var(--text-tertiary)", label: "Planned" },
      ].map((l) => (
        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: l.color,
            }}
          />
          <span style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}
