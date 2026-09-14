/**
 * SM-2 spaced repetition (simplified Anki-style).
 * Ratings: 1 Again, 2 Hard, 3 Good, 4 Easy.
 */

export type SrsRating = 1 | 2 | 3 | 4;

export function deckRatingToSrs(rating: "Again" | "Hard" | "Good" | "Easy"): SrsRating {
  switch (rating) {
    case "Again":
      return 1;
    case "Hard":
      return 2;
    case "Good":
      return 3;
    case "Easy":
      return 4;
  }
}

/** Map deck button to SM-2 quality 0–5. */
function ratingToQuality(rating: SrsRating): number {
  if (rating === 1) return 1;
  if (rating === 2) return 3;
  if (rating === 3) return 4;
  return 5;
}

export function sm2Next(params: {
  rating: SrsRating;
  intervalDays: number;
  easeFactor: number;
}): { intervalDays: number; easeFactor: number; nextReview: Date } {
  const q = ratingToQuality(params.rating);
  let { intervalDays, easeFactor } = params;

  if (q < 3) {
    intervalDays = 1;
  } else {
    if (intervalDays <= 0) intervalDays = 1;
    else if (intervalDays === 1) intervalDays = q >= 4 ? 4 : 2;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return { intervalDays, easeFactor, nextReview };
}

/** Treat as "mastered" for progress rings when interval reaches a week+. */
export function isMasteredForProgress(intervalDays: number, rating: number): boolean {
  return intervalDays >= 7 || (intervalDays >= 3 && rating >= 3);
}
