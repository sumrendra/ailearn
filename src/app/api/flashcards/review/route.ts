import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getFlashcardByKey } from "@/lib/content";
import { sm2Next, type SrsRating } from "@/lib/flashcard-srs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "Sign in to save review progress." }, { status: 401 });
  }

  let body: { cardKey?: string; rating?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cardKey = body.cardKey?.trim();
  const rating = body.rating;
  if (!cardKey || typeof rating !== "number" || rating < 1 || rating > 4) {
    return Response.json({ error: "cardKey and rating (1–4) required" }, { status: 400 });
  }

  if (!getFlashcardByKey(cardKey)) {
    return Response.json({ error: "Unknown card" }, { status: 404 });
  }

  const srsRating = Math.round(rating) as SrsRating;
  const existing = await prisma.flashcardReview.findFirst({
    where: { userId, cardKey },
    orderBy: { reviewedAt: "desc" },
  });

  const prevInterval = existing?.interval ?? 0;
  const prevEase = existing?.easeFactor ?? 2.5;
  const next = sm2Next({
    rating: srsRating,
    intervalDays: prevInterval,
    easeFactor: prevEase,
  });

  if (existing) {
    await prisma.flashcardReview.update({
      where: { id: existing.id },
      data: {
        rating: srsRating,
        interval: next.intervalDays,
        easeFactor: next.easeFactor,
        nextReview: next.nextReview,
        reviewedAt: new Date(),
      },
    });
  } else {
    await prisma.flashcardReview.create({
      data: {
        userId,
        cardKey,
        rating: srsRating,
        interval: next.intervalDays,
        easeFactor: next.easeFactor,
        nextReview: next.nextReview,
      },
    });
  }

  return Response.json({
    ok: true,
    nextReview: next.nextReview.toISOString(),
    intervalDays: next.intervalDays,
  });
}
