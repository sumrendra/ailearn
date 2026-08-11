import { NextRequest, NextResponse } from "next/server";
import { callGeminiForJson, evalErrorMessage } from "@/lib/gemini-eval";

interface EvalDocument {
  label: string;
  author: string;
  text: string;
}

interface EvalRequest {
  taskNumber: 1 | 2 | 3;
  taskPrompt: string;
  response: string;
  minWords: number;
  maxWords: number;
  /** Task 3: the two viewpoints the candidate had to compare. */
  documents?: EvalDocument[];
  partWords?: {
    comparison: { min: number; max: number };
    position: { min: number; max: number };
  };
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
  const { taskNumber, taskPrompt, response, minWords, maxWords, documents, partWords } = body;

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
    2: "compte rendu ou récit avec commentaire (120–150 mots)",
    3: "comparaison de deux points de vue puis prise de position (120–180 mots)",
  };

  /**
   * Task 3 is scored against the two source documents: a candidate who argues
   * well but never compares the viewpoints has not done the task.
   */
  const task3Block =
    taskNumber === 3 && documents?.length
      ? `
Documents fournis au candidat :
${documents.map((d) => `[${d.label} — ${d.author}] ${d.text}`).join("\n")}

Structure officielle imposée :
- Partie 1 (${partWords?.comparison.min ?? 40}–${partWords?.comparison.max ?? 60} mots) : comparer les deux points de vue.
- Partie 2 (${partWords?.position.min ?? 80}–${partWords?.position.max ?? 120} mots) : prendre position et argumenter.

Exigences supplémentaires pour la tâche 3 :
- Si la comparaison des deux documents est absente, Réalisation de la tâche ≤ 2.
- Si le candidat résume les documents sans les mettre en relation, Réalisation ≤ 3.
- Si la prise de position personnelle est absente ou non justifiée, Réalisation ≤ 3.
- Si les deux parties ne sont pas distinctes, Cohérence ≤ 3.
- Recopier des phrases entières des documents ne compte pas comme production : Vocabulaire ≤ 2.
`
      : "";

  const systemPrompt = `Vous êtes un correcteur officiel certifié TCF Canada. Évaluez la production écrite selon la grille FEI (France Éducation international) — double correction, critères standardisés.

Type de tâche: ${taskLabels[taskNumber] ?? "production écrite"}
Consigne: "${taskPrompt}"
Réponse du candidat (${wordCount} mots): "${response}"
Fourchette officielle: ${minWords}–${maxWords} mots.

Objectifs FEI par tâche:
- Tâche 1: message clair à un destinataire identifié (décrire, raconter, expliquer, informer).
- Tâche 2: compte rendu ou récit avec commentaire/opinion/argument selon la consigne.
- Tâche 3: comparer deux points de vue (partie 1) puis prendre position argumentée (partie 2).
${task3Block}
Barème (chaque critère 0–5, total = somme des 4 critères, max 20):
1. Réalisation de la tâche — pertinence, respect de la consigne, informations demandées
2. Cohérence et organisation — structure, connecteurs, progression logique
3. Étendue et maîtrise du vocabulaire — richesse, précision, registre adapté
4. Maîtrise grammaticale et orthographe — morphologie, syntaxe, orthographe

Pénalités FEI (appliquer sur le critère concerné):
- Hors sujet ou consigne non respectée: Réalisation ≤ 2
- Moins de 50% du minimum de mots: Réalisation ≤ 2
- Texte très court ou fragmentaire: Cohérence ≤ 2
- Registre inadapté (tâche 2/3): Vocabulaire −1

Référence IRCC: NCLC 7 ≈ 10–11/20 par tâche. Soyez exigeant comme un correcteur FEI, pas indulgent.

Le score total DOIT être exactement la somme des 4 critères.

Répondez UNIQUEMENT en JSON valide:
{
  "score": <entier 0-20, = taskCompletion + coherence + vocabulary + grammar>,
  "taskCompletion": <entier 0-5>,
  "coherence": <entier 0-5>,
  "vocabulary": <entier 0-5>,
  "grammar": <entier 0-5>,
  "feedback": "<2-3 phrases en français>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "improvements": ["<axe 1>", "<axe 2>"]
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
    const taskCompletion = Math.min(5, Math.max(0, Number(parsed.taskCompletion) || 0));
    const coherence = Math.min(5, Math.max(0, Number(parsed.coherence) || 0));
    const vocabulary = Math.min(5, Math.max(0, Number(parsed.vocabulary) || 0));
    const grammar = Math.min(5, Math.max(0, Number(parsed.grammar) || 0));
    const rubricSum = taskCompletion + coherence + vocabulary + grammar;
    const result: EvalResult = {
      score: rubricSum,
      taskCompletion,
      coherence,
      vocabulary,
      grammar,
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
