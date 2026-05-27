import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLessonBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * Per-user lesson progress writer.
 *
 * POST { lessonSlug, status?: "COMPLETED" | "IN_PROGRESS" }
 *
 * Upserts a LessonProgress row keyed on (userId, lessonSlug). On the FIRST
 * time a lesson transitions to COMPLETED (i.e. it wasn't already), we award
 * the lesson's xpReward to the user. Re-marking an already-completed lesson
 * is a no-op (no double XP).
 *
 * GET ?lesson=slug — returns { status, completedAt } for the current user,
 * or 404 if no row exists yet. Mainly used by the lesson reader to bootstrap
 * the "Mark complete" button state.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { lessonSlug?: string; status?: "COMPLETED" | "IN_PROGRESS" };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lessonSlug = body?.lessonSlug;
  const targetStatus = body?.status ?? "COMPLETED";

  if (!lessonSlug || typeof lessonSlug !== "string") {
    return new Response(JSON.stringify({ error: "missing_lessonSlug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate the slug refers to a real lesson — content is in code, not DB,
  // so we check the content module rather than a join.
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) {
    return new Response(JSON.stringify({ error: "unknown_lesson" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check existing state so we know whether to award XP (only on first
  // completion).
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug } },
    select: { status: true },
  });
  const wasCompleted = existing?.status === "COMPLETED";
  const becomingCompleted = targetStatus === "COMPLETED" && !wasCompleted;

  const now = new Date();
  const row = await prisma.lessonProgress.upsert({
    where: { userId_lessonSlug: { userId, lessonSlug } },
    create: {
      userId,
      lessonSlug,
      status: targetStatus,
      completedAt: targetStatus === "COMPLETED" ? now : null,
    },
    update: {
      status: targetStatus,
      // Only set completedAt on the first transition to COMPLETED — don't
      // overwrite a real timestamp with a fresh one on re-marks.
      ...(becomingCompleted ? { completedAt: now } : {}),
    },
    select: {
      status: true,
      completedAt: true,
    },
  });

  let awardedXP = 0;
  if (becomingCompleted) {
    const xp = lesson.xpReward ?? 0;
    if (xp > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xp }, lastActiveDate: now },
      });
      awardedXP = xp;
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveDate: now },
      });
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      status: row.status,
      completedAt: row.completedAt,
      awardedXP,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lessonSlug = req.nextUrl.searchParams.get("lesson");
  if (!lessonSlug) {
    return new Response(JSON.stringify({ error: "missing_lesson" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const row = await prisma.lessonProgress.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug } },
    select: { status: true, completedAt: true },
  });

  return new Response(
    JSON.stringify({
      status: row?.status ?? "NOT_STARTED",
      completedAt: row?.completedAt ?? null,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
