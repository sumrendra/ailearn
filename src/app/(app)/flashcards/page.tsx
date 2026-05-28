import { Topbar } from "@/components/layout/Topbar";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";

export default function FlashcardsPage() {
  return (
    <>
      <Topbar title="Flashcards" subtitle="Spaced repetition · SM-2 · daily review" />
      <FlashcardDeck deckName="All flashcards" />
    </>
  );
}
