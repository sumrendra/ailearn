import { callGeminiForJson, evalErrorMessage } from "@/lib/gemini-eval";
import { TCF_PRACTICE_TRANSLATIONS_EN } from "@/lib/content/tcf-practice-translations.generated";

export const dynamic = "force-dynamic";

type Body = {
  key?: string;
  text?: string;
  skill?: "listening" | "reading";
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const key = body.key?.trim();
  const text = body.text?.trim();
  const skill = body.skill;

  if (!key || !text || (skill !== "listening" && skill !== "reading")) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const bundled = TCF_PRACTICE_TRANSLATIONS_EN[key];
  if (bundled?.trim()) {
    return Response.json({ english: bundled, source: "bundled" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "English translation is not bundled for this item yet, and GEMINI_API_KEY is not configured on the server.",
      },
      { status: 503 },
    );
  }

  const label =
    skill === "listening"
      ? "TCF Canada listening audio script"
      : "TCF Canada reading passage";

  const prompt = `Translate the following ${label} from French to clear English for a learner practicing for immigration exams. Preserve line breaks. Output ONLY the English translation, no preamble.

---
${text}
---`;

  try {
    const { text: raw } = await callGeminiForJson(apiKey, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
    });
    const english = raw.trim();
    if (!english) {
      return Response.json({ error: "Empty translation" }, { status: 502 });
    }
    return Response.json({ english, source: "gemini" });
  } catch (err) {
    return Response.json({ error: evalErrorMessage(err) }, { status: 502 });
  }
}
