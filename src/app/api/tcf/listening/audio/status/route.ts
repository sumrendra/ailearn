import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TCF_LISTENING_NAMESPACE } from "@/lib/tcf-audio";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";

const QUESTIONS_PER_PAPER = 39;

function parsePapers(req: NextRequest): number[] | null {
  const raw = req.nextUrl.searchParams.get("papers") ?? req.nextUrl.searchParams.get("paper");
  if (!raw) return null;

  const papers = [
    ...new Set(
      raw
        .split(",")
        .map((value) => parseInt(value.trim(), 10))
        .filter((n) => Number.isFinite(n) && n >= 1 && n <= PAPER_COUNT),
    ),
  ].sort((a, b) => a - b);

  return papers.length > 0 ? papers : null;
}

/**
 * A randomized sitting pulls audio from several papers at once, so readiness is
 * reported for every paper the exam needs.
 */
export async function GET(req: NextRequest) {
  const papers = parsePapers(req);

  if (!papers) {
    return NextResponse.json(
      { error: `papers query param required (1-${PAPER_COUNT}, comma separated)` },
      { status: 400 },
    );
  }

  const rows = await prisma.audioAsset.findMany({
    where: { namespace: TCF_LISTENING_NAMESPACE, paper: { in: papers } },
    select: { paper: true, questionIndex: true },
  });

  const storedByPaper = new Map<number, number>();
  for (const row of rows) {
    storedByPaper.set(row.paper, (storedByPaper.get(row.paper) ?? 0) + 1);
  }

  const perPaper = papers.map((paper) => {
    const stored = storedByPaper.get(paper) ?? 0;
    return { paper, stored, total: QUESTIONS_PER_PAPER, ready: stored === QUESTIONS_PER_PAPER };
  });

  return NextResponse.json({
    papers,
    perPaper,
    stored: rows.length,
    total: papers.length * QUESTIONS_PER_PAPER,
    ready: perPaper.every((p) => p.ready),
  });
}
