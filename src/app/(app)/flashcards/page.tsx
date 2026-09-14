"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { EXAM_BAND_META, getContextPack } from "@/lib/content/tcf-exam-lexique";

function FlashcardsInner() {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");
  const band = searchParams.get("band");
  const pack = searchParams.get("pack");
  const keys = searchParams.get("keys");

  const themeMeta = theme ? VOCAB_THEMES.find((t) => t.id === theme) : undefined;
  const bandMeta = band ? EXAM_BAND_META.find((b) => b.id === band) : undefined;
  const packMeta = pack ? getContextPack(pack) : undefined;

  const deckName = themeMeta
    ? `${themeMeta.emoji} ${themeMeta.title}`
    : bandMeta
      ? bandMeta.title
      : packMeta
        ? packMeta.title
        : "All flashcards";

  const subtitle = themeMeta
    ? `${themeMeta.cardCount} TCF Canada cards · ${themeMeta.description}`
    : bandMeta
      ? `${bandMeta.count} mots · ${bandMeta.cefr}`
      : packMeta
        ? packMeta.subtitle
        : "Spaced repetition · SM-2 · daily review";

  return (
    <>
      <Topbar title="Flashcards" subtitle={subtitle} />
      <FlashcardDeck
        themeId={theme ?? undefined}
        bandId={band && ["a", "b", "c"].includes(band) ? band : undefined}
        packId={pack ?? undefined}
        cardKeys={keys ?? undefined}
        deckName={deckName}
      />
    </>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<Topbar title="Flashcards" subtitle="Loading…" />}>
      <FlashcardsInner />
    </Suspense>
  );
}
