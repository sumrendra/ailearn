import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ paper: string; question: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { paper, question } = await params;
  const paperNum = parseInt(paper, 10);
  const questionIndex = parseInt(question, 10);

  if (
    !Number.isFinite(paperNum) ||
    !Number.isFinite(questionIndex) ||
    paperNum < 1 ||
    paperNum > 5 ||
    questionIndex < 0 ||
    questionIndex > 38
  ) {
    return NextResponse.json({ error: "Invalid paper or question index" }, { status: 400 });
  }

  const row = await prisma.tcfListeningAudio.findUnique({
    where: {
      paper_questionIndex: { paper: paperNum, questionIndex },
    },
  });

  if (!row) {
    return NextResponse.json(
      {
        error: "Audio not found in database",
        hint: "Run: npm run seed:tcf-audio",
      },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(row.audioData), {
    status: 200,
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(row.audioData.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
