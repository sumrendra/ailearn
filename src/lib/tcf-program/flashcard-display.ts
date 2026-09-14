/** TCF comprehension flashcards: show French first, English on flip. */

export function extractFrenchLemma(markdownBack: string): string | null {
  const m = markdownBack.match(/\*\*([^*]+)\*\*/);
  return m?.[1]?.trim() ?? null;
}

export function isTcfComprehensionCard(tags: string[]): boolean {
  return tags.some((t) => t === "TCF Canada" || t === "Lexique" || t === "Vocabulary" || t === "pack");
}

export type DisplayCard = {
  id: string;
  front: string;
  back: string;
  englishHint: string | null;
  tags: string[];
  lessonTitle: string | null;
  lessonSlug: string | null;
  nextReview: string | null;
  due: boolean;
};

export function toComprehensionDisplay(card: {
  id: string;
  front: string;
  back: string;
  tags: string[];
  lessonTitle: string | null;
  lessonSlug: string | null;
  nextReview?: string | null;
  due?: boolean;
}): DisplayCard {
  if (!isTcfComprehensionCard(card.tags)) {
    return {
      id: card.id,
      front: card.front,
      back: card.back,
      englishHint: null,
      tags: card.tags,
      lessonTitle: card.lessonTitle,
      lessonSlug: card.lessonSlug,
      nextReview: card.nextReview ?? null,
      due: card.due ?? true,
    };
  }

  const fr = extractFrenchLemma(card.back);
  const en = card.front.trim();
  if (!fr) {
    return {
      id: card.id,
      front: card.front,
      back: card.back,
      englishHint: null,
      tags: card.tags,
      lessonTitle: card.lessonTitle,
      lessonSlug: card.lessonSlug,
      nextReview: card.nextReview ?? null,
      due: card.due ?? true,
    };
  }

  return {
    id: card.id,
    front: fr,
    back: `**${en}**\n\n---\n\n${card.back}`,
    englishHint: en,
    tags: card.tags,
    lessonTitle: card.lessonTitle,
    lessonSlug: card.lessonSlug,
    nextReview: card.nextReview ?? null,
    due: card.due ?? true,
  };
}
