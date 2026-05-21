import { Topbar } from "@/components/layout/Topbar";
import { FlashcardReviewer } from "@/components/learn/FlashcardReviewer";

export default function FlashcardsPage() {
  return (
    <>
      <Topbar title="Flashcards" subtitle="Spaced repetition · SM-2 algorithm · Daily review" />
      <div style={{ padding: "24px", maxWidth: 700, width: "100%" }}>
        <FlashcardReviewer />
      </div>
    </>
  );
}
