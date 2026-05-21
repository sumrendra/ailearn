import { NextRequest } from "next/server";
import { generateAIQuiz } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { lessonTitle, lessonContent, difficulty, count = 5 } = await req.json();

    const questions = await generateAIQuiz(lessonTitle, lessonContent, difficulty, count);

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
