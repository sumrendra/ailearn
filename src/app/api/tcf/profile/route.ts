import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const profile = await prisma.tcfProfile.findUnique({ where: { userId } });
  return Response.json(profile ?? {
    targetNclc: 7,
    placementCefr: "A0",
    weeklyHours: 6,
    examDate: null,
    onboardingDone: false,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    targetNclc?: number;
    placementCefr?: string;
    weeklyHours?: number;
    examDate?: string | null;
    onboardingDone?: boolean;
    roadmapPrefs?: Record<string, string>;
  };

  const profile = await prisma.tcfProfile.upsert({
    where: { userId },
    create: {
      userId,
      targetNclc: body.targetNclc ?? 7,
      placementCefr: body.placementCefr ?? "A0",
      weeklyHours: body.weeklyHours ?? 6,
      examDate: body.examDate ? new Date(body.examDate) : null,
      onboardingDone: body.onboardingDone ?? true,
      roadmapPrefs: body.roadmapPrefs ?? undefined,
    },
    update: {
      ...(body.targetNclc != null ? { targetNclc: body.targetNclc } : {}),
      ...(body.placementCefr ? { placementCefr: body.placementCefr } : {}),
      ...(body.weeklyHours != null ? { weeklyHours: body.weeklyHours } : {}),
      ...(body.examDate !== undefined
        ? { examDate: body.examDate ? new Date(body.examDate) : null }
        : {}),
      ...(body.onboardingDone != null ? { onboardingDone: body.onboardingDone } : {}),
      ...(body.roadmapPrefs != null ? { roadmapPrefs: body.roadmapPrefs } : {}),
    },
  });

  return Response.json(profile);
}
