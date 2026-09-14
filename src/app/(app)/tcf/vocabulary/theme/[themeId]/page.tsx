import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";

export default async function TcfVocabThemePage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const theme = VOCAB_THEMES.find((t) => t.id === themeId);
  if (!theme) notFound();

  return (
    <>
      <Topbar title={theme.title} subtitle={theme.titleFr} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <div style={{ fontSize: 40, marginBottom: 12 }}>{theme.emoji}</div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 24 }}>{theme.description}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Niveau indicatif : {theme.cefr} · {theme.cardCount} cartes
        </p>
        <Link
          href={`/flashcards?theme=${theme.id}`}
          style={{
            display: "inline-block",
            padding: "12px 20px",
            borderRadius: 10,
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Lancer les flashcards
        </Link>
        <p style={{ marginTop: 24 }}>
          <Link href="/tcf/vocabulary" style={{ color: "var(--accent)", fontSize: 14 }}>
            ← Tous les thèmes TCF
          </Link>
        </p>
      </div>
    </>
  );
}
