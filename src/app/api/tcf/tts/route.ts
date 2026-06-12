import { NextRequest, NextResponse } from "next/server";

const VOICES: Record<string, string> = {
  "A1": "Leda",
  "A2": "Leda",
  "B1": "Kore",
  "B2": "Kore",
  "C1": "Charon",
  "C2": "Charon",
};

function pcmToWav(pcmBuffer: Buffer): Buffer {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const headerSize = 44;

  const wav = Buffer.alloc(headerSize + dataSize);
  let offset = 0;

  wav.write("RIFF", offset); offset += 4;
  wav.writeUInt32LE(36 + dataSize, offset); offset += 4;
  wav.write("WAVE", offset); offset += 4;
  wav.write("fmt ", offset); offset += 4;
  wav.writeUInt32LE(16, offset); offset += 4;
  wav.writeUInt16LE(1, offset); offset += 2;
  wav.writeUInt16LE(numChannels, offset); offset += 2;
  wav.writeUInt32LE(sampleRate, offset); offset += 4;
  wav.writeUInt32LE(byteRate, offset); offset += 4;
  wav.writeUInt16LE(blockAlign, offset); offset += 2;
  wav.writeUInt16LE(bitsPerSample, offset); offset += 2;
  wav.write("data", offset); offset += 4;
  wav.writeUInt32LE(dataSize, offset); offset += 4;

  pcmBuffer.copy(wav, headerSize);
  return wav;
}

export async function POST(req: NextRequest) {
  const { text, level } = await req.json() as { text: string; level?: string };

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  const voiceName = VOICES[level ?? "B1"] ?? "Kore";

  const body = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini TTS error:", err);
    return NextResponse.json({ error: "TTS generation failed" }, { status: 502 });
  }

  const data = await res.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
    }>;
  };

  const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) {
    return NextResponse.json({ error: "No audio in response" }, { status: 502 });
  }

  const pcm = Buffer.from(b64, "base64");
  const wav = pcmToWav(pcm);

  return new NextResponse(wav.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": String(wav.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
