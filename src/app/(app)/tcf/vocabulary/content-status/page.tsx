import Link from "next/link";
import { auth } from "@/auth";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { getVocabContentStatus } from "@/lib/tcf-program/vocab-catalog";

export const dynamic = "force-dynamic";

export default async function VocabContentStatusPage() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    const email = session?.user?.email?.toLowerCase();
    if (!email || email !== adminEmail) {
      return (
        <>
          <Topbar title="Content status" subtitle="Restricted" />
          <div style={{ padding: 24 }}>
            <p>Sign in with the admin account to view vocabulary content status.</p>
            <Link href="/login">Sign in</Link>
          </div>
        </>
      );
    }
  }

  const status = getVocabContentStatus();

  return (
    <>
      <Topbar title="Vocabulary content status" subtitle="Owner view · core exam word inventory" />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 20 }}>
          Tracks how many <strong>core exam words</strong> exist in code versus the {status.coreTarget} word target for TCF
          reading/listening prep. Optional packs and themes are separate.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Stat label="Core words live" value={String(status.coreInApp)} />
          <Stat label="Target" value={String(status.coreTarget)} />
          <Stat
            label="Still to author"
            value={String(status.stillToAuthor)}
            highlight={status.stillToAuthor > 0 ? "warn" : "ok"}
          />
          <Stat label="Optional words" value={String(status.optional.total)} />
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-subtle)" }}>
              <th style={{ padding: "10px 8px" }}>Band</th>
              <th style={{ padding: "10px 8px" }}>Words in app</th>
              <th style={{ padding: "10px 8px" }}>Share of 450 target</th>
              <th style={{ padding: "10px 8px" }}>Gap</th>
            </tr>
          </thead>
          <tbody>
            {status.bands.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "10px 8px" }}>
                  <Link href={`/tcf/vocabulary/band/${b.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
                    Band {b.id.toUpperCase()}
                  </Link>
                </td>
                <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{b.inApp}</td>
                <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{b.targetShare}</td>
                <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{b.gap}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700 }}>
              <td style={{ padding: "10px 8px" }}>Total core</td>
              <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{status.coreInApp}</td>
              <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{status.coreTarget}</td>
              <td style={{ padding: "10px 8px", fontFamily: "var(--font-mono)" }}>{status.stillToAuthor}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
          Optional: {status.optional.packWords} context pack words · {status.optional.themeWords} theme deck cards. Regenerate
          batch files with <code style={{ fontFamily: "var(--font-mono)" }}>npx tsx scripts/build-batch3-lexique.mts</code>
          . Report: <code style={{ fontFamily: "var(--font-mono)" }}>npm run tcf:vocab-gap</code>
        </p>

        <Link href="/tcf/vocabulary" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
          ← Back to vocabulary path
        </Link>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "ok" | "warn";
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: highlight === "ok" ? "rgba(34,197,94,0.08)" : highlight === "warn" ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{value}</div>
    </div>
  );
}
