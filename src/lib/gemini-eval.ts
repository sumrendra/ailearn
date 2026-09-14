/** Primary first; fall through on overload, quota, or unavailable model. */
const EVAL_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
] as const;

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

export async function callGeminiForJson(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ text: string; model: string }> {
  let lastError = "Evaluation failed";

  for (const model of EVAL_MODELS) {
    const res = await fetch(
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

    if (res.ok) {
      const data = (await res.json()) as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, model };
      lastError = "No evaluation in response";
      continue;
    }

    const errText = await res.text();
    lastError = errText;
    console.error(`Gemini eval error (${model}):`, errText);

    // Try next model on overload, quota, or model not available
    const retryable = res.status === 503 || res.status === 429 || res.status === 404;
    if (!retryable) break;
  }

  throw new Error(lastError);
}

export function evalErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("high demand") || raw.includes('"code": 503')) {
    return "Le service d'évaluation est temporairement surchargé. Réessayez dans quelques instants.";
  }
  if (raw.includes('"code": 429') || raw.includes("quota")) {
    return "Quota API atteint. Réessayez plus tard.";
  }
  if (raw.includes("API key") || raw.includes("API_KEY")) {
    return "Clé API Gemini invalide ou manquante sur le serveur.";
  }
  return "Evaluation failed";
}
