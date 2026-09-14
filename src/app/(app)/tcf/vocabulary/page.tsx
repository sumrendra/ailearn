import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { VocabThemeGrid } from "@/components/tcf/GrammarMap";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";

export default function TcfVocabularyPage() {
  const themes = VOCAB_THEMES.map((t) => ({ ...t, percent: 0 }));

  return (
    <>
      <Topbar title="Vocabulary" subtitle="Lexique TCF Canada — thèmes, bandes d'examen, extraits des sujets" />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.5 }}>
          Les sujets TCF réutilisent les mêmes champs lexicaux. Commencez par la bande qui correspond à vos questions difficiles,
          puis les packs tirés de nos sujets d&apos;examen.
        </p>

        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Bandes d&apos;examen (CO / CE)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 36 }}>
          {EXAM_BAND_META.map((b) => (
            <Link
              key={b.id}
              href={`/tcf/vocabulary/band/${b.id}`}
              style={{
                padding: 16,
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {b.cefr}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.4 }}>{b.blurb}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>{b.count} cartes · flashcards + SM-2</div>
            </Link>
          ))}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Dans le contexte (extraits + quiz)</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {TCF_CONTEXT_PACKS.map((p) => (
            <Link
              key={p.id}
              href={`/tcf/vocabulary/pack/${p.id}`}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.subtitle}</div>
              </div>
              <span style={{ fontSize: 12, color: "var(--accent)", whiteSpace: "nowrap" }}>{p.items.length} mots →</span>
            </Link>
          ))}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Thèmes Canada (deck classique)</h2>
        <VocabThemeGrid themes={themes} />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>
          Connectez-vous pour enregistrer vos révisions ; la progression apparaît sur le tableau de bord TCF.
        </p>
      </div>
    </>
  );
}
