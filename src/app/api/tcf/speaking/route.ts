import { NextRequest, NextResponse } from "next/server";

interface SpeakingEvalRequest {
  taskNumber: 1 | 2 | 3;
  taskPrompt: string;
  audioBase64: string;
  mimeType: string;
}

interface SpeakingEvalResult {
  score: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  transcript: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export async function POST(req: NextRequest) {
  const body = await req.json() as SpeakingEvalRequest;
  const { taskNumber, taskPrompt, audioBase64, mimeType } = body;

  if (!audioBase64) {
    return NextResponse.json({ error: "audio is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI evaluation not configured" }, { status: 503 });
  }

  const taskLabels: Record<number, string> = {
    1: "entretien guidé (2 minutes, questions personnelles)",
    2: "jeu de rôle (3,5 minutes, interaction simulée)",
    3: "monologue d'opinion (4,5 minutes, argumentation)",
  };

  const systemPrompt = `Vous êtes un évaluateur officiel certifié TCF Canada pour la section Expression orale. Transcrivez et évaluez la production orale suivante selon les critères officiels du TCF.

Type de tâche: ${taskLabels[taskNumber] ?? "production orale"}
Consigne donnée au candidat: "${taskPrompt}"

Critères d'évaluation TCF Expression orale (chaque critère est noté de 0 à 5):
1. Aisance et fluidité — Débit, hésitations, capacité à maintenir la communication
2. Étendue et maîtrise du vocabulaire — Richesse lexicale, précision, registre
3. Maîtrise grammaticale — Morphologie, syntaxe, complexité des structures
4. Prononciation et intelligibilité — Clarté, accent, intonation

Score total: somme des 4 critères, maximum 20 points.

Si l'audio est inaudible ou vide, attribuez un score de 0 et indiquez le problème dans le feedback.

Répondez UNIQUEMENT en JSON valide (pas de markdown, pas de texte avant ou après):
{
  "transcript": "<transcription fidèle de la réponse orale>",
  "score": <entier 0-20>,
  "fluency": <entier 0-5>,
  "vocabulary": <entier 0-5>,
  "grammar": <entier 0-5>,
  "pronunciation": <entier 0-5>,
  "feedback": "<2-3 phrases en français résumant l'évaluation globale>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "improvements": ["<axe d'amélioration 1>", "<axe d'amélioration 2>"]
}`;

  const geminiBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { inlineData: { mimeType, data: audioBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(geminiBody),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini speaking eval error:", err);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 502 });
  }

  const data = await res.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return NextResponse.json({ error: "No evaluation in response" }, { status: 502 });
  }

  try {
    const parsed = JSON.parse(text) as Partial<SpeakingEvalResult>;
    const result: SpeakingEvalResult = {
      score: Math.min(20, Math.max(0, Number(parsed.score) || 0)),
      fluency: Math.min(5, Math.max(0, Number(parsed.fluency) || 0)),
      vocabulary: Math.min(5, Math.max(0, Number(parsed.vocabulary) || 0)),
      grammar: Math.min(5, Math.max(0, Number(parsed.grammar) || 0)),
      pronunciation: Math.min(5, Math.max(0, Number(parsed.pronunciation) || 0)),
      transcript: parsed.transcript ?? "",
      feedback: parsed.feedback ?? "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse evaluation" }, { status: 502 });
  }
}
