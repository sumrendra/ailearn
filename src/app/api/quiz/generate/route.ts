import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { lessonTitle, lessonContent, difficulty, count = 5 } = await req.json();

    const prompt = `Generate ${count} quiz questions for this AI engineering lesson.

Lesson: "${lessonTitle}"
Difficulty: ${difficulty}
Content: ${lessonContent?.slice(0, 3000) ?? "General AI engineering concepts"}

Return a JSON array with this exact structure:
[
  {
    "type": "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "SCENARIO",
    "question": "the question text",
    "options": [{"text": "...", "isCorrect": true/false}],  // only for MCQ, 4 options
    "correctAnswer": "the correct answer text",  // for TRUE_FALSE and SHORT_ANSWER
    "explanation": "why this is the answer (2-3 sentences)",
    "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    "tags": ["tag1", "tag2"]
  }
]

Requirements:
- Mix question types (at least 2 MCQ, 1 scenario-based)
- MCQs must have exactly 4 options with ONE correct answer
- Scenarios should be realistic Java/backend engineering contexts
- Explanations should be thorough and educational
- Return ONLY the JSON array, no other text`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const questions = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Quiz generate error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate quiz" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
