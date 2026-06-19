import { createHash } from "crypto";

export const TCF_TTS_VOICES: Record<string, string> = {
  A1: "Leda",
  A2: "Leda",
  B1: "Kore",
  B2: "Kore",
  C1: "Charon",
  C2: "Charon",
};

const TTS_MODELS = [
  "gemini-3.1-flash-tts-preview",
  "gemini-2.5-flash-preview-tts",
] as const;

export function hashAudioScript(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

export function pcmToWav(pcmBuffer: Buffer): Buffer {
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

function parseRetryAfterMs(errText: string): number | undefined {
  try {
    const parsed = JSON.parse(errText) as {
      error?: { details?: Array<{ "@type"?: string; retryDelay?: string }> };
    };
    const retry = parsed.error?.details?.find((d) =>
      d["@type"]?.includes("RetryInfo"),
    )?.retryDelay;
    if (!retry) return undefined;
    const sec = parseInt(retry.replace(/s$/, ""), 10);
    return Number.isFinite(sec) ? sec * 1000 : undefined;
  } catch {
    return undefined;
  }
}

async function callGeminiTts(
  apiKey: string,
  model: string,
  text: string,
  voiceName: string,
) {
  const body = {
    contents: [{ parts: [{ text: `Read aloud in French: ${text}` }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  };

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    },
  );
}

export interface GenerateTtsResult {
  wav: Buffer;
  voice: string;
  model: string;
}

export async function generateTcfListeningWav(
  text: string,
  level: string,
  apiKey: string,
): Promise<GenerateTtsResult> {
  const voiceName = TCF_TTS_VOICES[level] ?? TCF_TTS_VOICES.B1;
  let lastError = "TTS generation failed";

  for (const model of TTS_MODELS) {
    const res = await callGeminiTts(apiKey, model, text, voiceName);

    if (res.ok) {
      const data = await res.json() as {
        candidates?: Array<{
          content?: { parts?: Array<{ inlineData?: { data?: string } }> };
        }>;
      };

      const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) {
        lastError = "No audio in Gemini response";
        continue;
      }

      const pcm = Buffer.from(b64, "base64");
      return { wav: pcmToWav(pcm), voice: voiceName, model };
    }

    const errText = await res.text();
    lastError = errText;
    const retryMs = parseRetryAfterMs(errText);

    if (res.status === 429 && retryMs) {
      await new Promise((r) => setTimeout(r, retryMs));
      const retry = await callGeminiTts(apiKey, model, text, voiceName);
      if (retry.ok) {
        const data = await retry.json() as {
          candidates?: Array<{
            content?: { parts?: Array<{ inlineData?: { data?: string } }> };
          }>;
        };
        const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          const pcm = Buffer.from(b64, "base64");
          return { wav: pcmToWav(pcm), voice: voiceName, model };
        }
      }
    }

    if (res.status !== 429 && res.status !== 503) break;
  }

  throw new Error(lastError);
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
