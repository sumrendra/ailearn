import { NextRequest, NextResponse } from "next/server";
import { generateTcfListeningWav } from "@/lib/tcf-tts-server";

export async function POST(req: NextRequest) {
  const { text, level } = await req.json() as { text: string; level?: string };

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  try {
    const { wav } = await generateTcfListeningWav(text, level ?? "B1", apiKey);

    return new NextResponse(wav.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(wav.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "TTS generation failed";
    const lower = raw.toLowerCase();
    const status = lower.includes("quota") || lower.includes("429") ? 429 : 502;
    const error =
      status === 429
        ? "Quota Gemini TTS dépassé. Utilisez les audios stockés en base (npm run seed:tcf-audio)."
        : "Échec de la génération audio Gemini.";

    return NextResponse.json({ error }, { status });
  }
}
