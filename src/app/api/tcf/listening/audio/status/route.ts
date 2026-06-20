import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TCF_LISTENING_NAMESPACE } from "@/lib/tcf-audio";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";

const QUESTIONS_PER_PAPER = 39;

export async function GET(req: NextRequest) {
  const paper = parseInt(req.nextUrl.searchParams.get("paper") ?? "", 10);

  if (!Number.isFinite(paper) || paper < 1 || paper > PAPER_COUNT) {
    return NextResponse.json(
      { error: `paper query param required (1-${PAPER_COUNT})` },
      { status: 400 },
    );
  }

  const rows = await prisma.audioAsset.findMany({
    where: { namespace: TCF_LISTENING_NAMESPACE, paper },
    select: { questionIndex: true },
    orderBy: { questionIndex: "asc" },
  });

  return NextResponse.json({
    paper,
    stored: rows.length,
    total: QUESTIONS_PER_PAPER,
    ready: rows.length === QUESTIONS_PER_PAPER,
  });
}
