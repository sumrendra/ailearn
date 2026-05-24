export const dynamic = "force-dynamic";
import { Topbar } from "@/components/layout/Topbar";
import { Calendar } from "lucide-react";

/**
 * Daily challenge page — stubbed out during the content-out-of-DB migration.
 *
 * The original feature pulled one DailyChallenge row from Postgres per day.
 * With static content moving to src/lib/content/, we'd need either an
 * in-memory date-rotating challenge engine or a DB-backed challenge editor.
 * Neither is critical right now — the page renders the "no challenge today"
 * empty state until a real challenge system is rebuilt.
 */
export default function ChallengePage() {
  return (
    <>
      <Topbar title="Daily Challenge" subtitle="Come back tomorrow" />
      <div style={{ padding: "32px", maxWidth: 760, width: "100%" }}>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: "72px 32px",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              margin: "0 auto 20px",
              background: "var(--bg-tertiary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={28} color="var(--text-tertiary)" />
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            No challenge today
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Daily challenges are temporarily disabled while we rebuild the
            content engine. Check back soon.
          </p>
        </div>
      </div>
    </>
  );
}
