import { NextRequest, NextResponse } from "next/server";
import { callGeminiForJson, evalErrorMessage } from "@/lib/gemini-eval";

interface EvalRequest {
  taskNumber: 1 | 2 | 3;
  taskPrompt: string;
  response: string;
  minWords: number;
  maxWords: number;
}

interface EvalResult {
  score: number;
  taskCompletion: number;
  coherence: number;
  vocabulary: number;
  grammar: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  wordCount: number;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as EvalRequest;
  const { taskNumber, taskPrompt, response, minWords, maxWords } = body;

  if (!response?.trim()) {
    return NextResponse.json({ error: "response is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI evaluation not configured" }, { status: 503 });
  }

  const wordCount = countWords(response);
  const taskLabels: Record<number, string> = {
    1: "message informel (60–120 mots)",
    2: "article ou lettre semi-formelle (120–150 mots)",
    3: "texte formel ou argumentatif (120–180 mots)",
  };

  const systemPrompt = `Vous êtes un correcteur officiel certifié TCF Canada. Évaluez la production écrite suivante selon les critères officiels du TCF (Test de connaissance du français).

Type de tâche: ${taskLabels[taskNumber] ?? "production écrite"}
Consigne donnée à l'apprenant: "${taskPrompt}"
Réponse de l'apprenant (${wordCount} mots): "${response}"

Fourchette de mots recommandée: ${minWords}–${maxWords} mots.

Critères d'évaluation TCF (chaque critère est noté de 0 à 5):
1. Réalisation de la tâche — Adéquation au sujet, respect des consignes, pertinence du contenu
2. Cohérence et organisation — Structure logique, utilisation des connecteurs, progression des idées
3. Étendue et maîtrise du vocabulaire — Richesse lexicale, précision, registre approprié
4. Maîtrise grammaticale — Morphologie, syntaxe, orthographe

Score total: somme des 4 critères, maximum 20 points.

Répondez UNIQUEMENT en JSON valide (pas de markdown, pas de texte avant ou après):
{
  "score": <entier 0-20>,
  "taskCompletion": <entier 0-5>,
  "coherence": <entier 0-5>,
  "vocabulary": <entier 0-5>,
  "grammar": <entier 0-5>,
  "feedback": "<2-3 phrases en français résumant l'évaluation globale>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "improvements": ["<axe d'amélioration 1>", "<axe d'amélioration 2>"]
}`;

  const geminiBody = {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  };

  try {
    const { text } = await callGeminiForJson(apiKey, geminiBody);
    const parsed = JSON.parse(text) as Partial<EvalResult>;
    const result: EvalResult = {
      score: Math.min(20, Math.max(0, Number(parsed.score) || 0)),
      taskCompletion: Math.min(5, Math.max(0, Number(parsed.taskCompletion) || 0)),
      coherence: Math.min(5, Math.max(0, Number(parsed.coherence) || 0)),
      vocabulary: Math.min(5, Math.max(0, Number(parsed.vocabulary) || 0)),
      grammar: Math.min(5, Math.max(0, Number(parsed.grammar) || 0)),
      feedback: parsed.feedback ?? "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      wordCount,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("Gemini writing eval error:", err);
    return NextResponse.json({ error: evalErrorMessage(err) }, { status: 502 });
  }
}
