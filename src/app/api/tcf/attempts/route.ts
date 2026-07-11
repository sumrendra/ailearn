import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Log a TCF practice or mock attempt for progress dashboard */
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    module: string;
    paper?: number;
    scoreRaw?: number;
    scoreNclc?: number;
    score699?: number;
    durationSec?: number;
    detailJson?: unknown;
  };

  if (!body.module) {
    return Response.json({ error: "missing_module" }, { status: 400 });
  }

  const row = await prisma.tcfAttempt.create({
    data: {
      userId,
      module: body.module,
      paper: body.paper ?? null,
      scoreRaw: body.scoreRaw ?? null,
      scoreNclc: body.scoreNclc ?? null,
      score699: body.score699 ?? null,
      durationSec: body.durationSec ?? 0,
      detailJson: body.detailJson ?? undefined,
    },
  });

  return Response.json({ ok: true, id: row.id });
}
