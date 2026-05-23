import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  Icon: LucideIcon;
  iconColor?: string;
  value: string | number;
  label: string;
  /** Optional secondary metric — e.g. "+12 this week" */
  delta?: string;
}

/**
 * Single statistic tile. Used in the /learn header strip and dashboard.
 * Designed to sit inside a flex row at flex:1 — no fixed width.
 */
export function StatCard({ Icon, iconColor = "var(--accent)", value, label, delta }: StatCardProps) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `color-mix(in srgb, ${iconColor} 10%, transparent)`,
          border: `1px solid color-mix(in srgb, ${iconColor} 18%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={iconColor} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {label}
          {delta && (
            <span style={{ color: "var(--success)", fontWeight: 600 }}>{delta}</span>
          )}
        </div>
      </div>
    </div>
  );
}
