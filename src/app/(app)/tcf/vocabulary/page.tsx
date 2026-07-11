import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { VocabThemeGrid } from "@/components/tcf/GrammarMap";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";

export default function TcfVocabularyPage() {
  const themes = VOCAB_THEMES.map((t) => ({ ...t, percent: 0 }));

  return (
    <>
      <Topbar title="Vocabulary" subtitle="10 TCF themes — immigration, work, health…" />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
          TCF Canada recycles the same thematic clusters. Master these decks and your score improves across all four skills.
        </p>
        <VocabThemeGrid themes={themes} />
      </div>
    </>
  );
}
