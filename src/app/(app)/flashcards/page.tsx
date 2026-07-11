"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";

function FlashcardsInner() {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");
  const themeMeta = theme ? VOCAB_THEMES.find((t) => t.id === theme) : undefined;
  const deckName = themeMeta ? `${themeMeta.emoji} ${themeMeta.title}` : "All flashcards";
  const subtitle = themeMeta
    ? `${themeMeta.cardCount} TCF Canada cards · ${themeMeta.description}`
    : "Spaced repetition · SM-2 · daily review";

  return (
    <>
      <Topbar title="Flashcards" subtitle={subtitle} />
      <FlashcardDeck themeId={theme ?? undefined} deckName={deckName} />
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
