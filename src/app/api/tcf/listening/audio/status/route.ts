import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const paper = parseInt(req.nextUrl.searchParams.get("paper") ?? "", 10);

  if (!Number.isFinite(paper) || paper < 1 || paper > 5) {
    return NextResponse.json({ error: "paper query param required (1-5)" }, { status: 400 });
  }

  const rows = await prisma.tcfListeningAudio.findMany({
    where: { paper },
    select: { questionIndex: true },
    orderBy: { questionIndex: "asc" },
  });

  return NextResponse.json({
    paper,
    stored: rows.length,
    total: 39,
    ready: rows.length === 39,
    indices: rows.map((r) => r.questionIndex),
  });
}
