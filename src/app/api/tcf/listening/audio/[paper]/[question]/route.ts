import fs from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  TCF_LISTENING_NAMESPACE,
  resolveAudioFile,
} from "@/lib/tcf-audio";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";

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
    paperNum > PAPER_COUNT ||
    questionIndex < 0 ||
    questionIndex > 38
  ) {
    return NextResponse.json({ error: "Invalid paper or question index" }, { status: 400 });
  }

  const row = await prisma.audioAsset.findUnique({
    where: {
      namespace_paper_questionIndex: {
        namespace: TCF_LISTENING_NAMESPACE,
        paper: paperNum,
        questionIndex,
      },
    },
  });

  if (!row) {
    return NextResponse.json({ error: "Audio not found" }, { status: 404 });
  }

  const filePath = resolveAudioFile(row.storagePath);
  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ error: "Audio file missing on volume" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
