"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { TcfExamBand } from "@/lib/content/tcf-exam-lexique";
import { getExamLemmaFlashcards } from "@/lib/content/tcf-exam-lexique";
import { addToVocabPile } from "@/lib/tcf-program/vocab-pile";

interface BandScore {
  label: string;
  correct: number;
  total: number;
}

function weakestBandIndex(bands: BandScore[]): number {
  return bands.reduce(
    (best, b, i) =>
      b.total > 0 && b.correct / b.total < bands[best].correct / bands[best].total ? i : best,
    0,
  );
}

function bandIdFromIndex(idx: number): TcfExamBand {
  if (idx === 0) return "a";
  if (idx === 1) return "b";
  return "c";
}

export function TcfLexiqueNextStep({
  bands,
  accent = "var(--accent)",
}: {
  bands: BandScore[];
  accent?: string;
}) {
  const weakestIdx = weakestBandIndex(bands);
  const bandHref = bandIdFromIndex(weakestIdx);

  const preparePile = () => {
    const keys = getExamLemmaFlashcards(bandHref)
      .slice(0, 12)
      .map((c) => c.key);
    addToVocabPile(keys);
    window.location.href = `/flashcards?keys=${encodeURIComponent(keys.join(","))}`;
  };

  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 14,
        background: "linear-gradient(135deg, var(--bg-overlay) 0%, var(--bg-card) 100%)",
        border: "1px solid var(--border-subtle)",
        marginBottom: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Sparkles size={16} color={accent} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>Vocabulaire — prochaine étape</span>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 14 }}>
        Beaucoup d&apos;erreurs viennent de mots inconnus. Ciblez la bande où vous avez le plus de lacunes, ou
        lancez une mini-session de 12 mots.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Link
          href={`/tcf/vocabulary/band/${bandHref}`}
          style={{
            padding: "9px 14px",
            borderRadius: 9,
            background: accent,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Bande {bandHref.toUpperCase()} — explorer
        </Link>
        <button
          type="button"
          onClick={preparePile}
          style={{
            padding: "9px 14px",
            borderRadius: 9,
            border: `1px solid ${accent}66`,
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Mini-session 12 mots
        </button>
        <Link
          href="/tcf/vocabulary"
          style={{
            padding: "9px 14px",
            borderRadius: 9,
            border: "1px solid var(--border-subtle)",
            fontSize: 13,
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          Packs en contexte
        </Link>
      </div>
    </div>
  );
}
