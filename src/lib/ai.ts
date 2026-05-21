import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client conditionally
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
};

/**
 * Unified helper to stream chat interactions from either Anthropic or Gemini.
 */
export async function streamAIChat(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  modelType: "tutor" | "interview"
): Promise<Response> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey && !geminiKey) {
    return new Response(
      JSON.stringify({
        error: "No AI API keys configured. Please set GEMINI_API_KEY or ANTHROPIC_API_KEY in your env.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- OPTION A: GEMINI (via OpenAI-compatible endpoint) ---
  if (geminiKey) {
    try {
      const model = modelType === "tutor" ? "gemini-1.5-pro" : "gemini-1.5-flash";
      const formattedMessages = messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${geminiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedMessages,
            ],
            stream: true,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned error: ${errorText}`);
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const reader = response.body?.getReader();

      const readable = new ReadableStream({
        async start(controller) {
          if (!reader) {
            controller.close();
            return;
          }

          let buffer = "";
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine.startsWith("data: ")) continue;
                
                const dataContent = cleanLine.slice(6);
                if (dataContent === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(dataContent);
                  const text = parsed.choices?.[0]?.delta?.content || "";
                  if (text) {
                    const payload = JSON.stringify({ delta: { text } });
                    controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                  }
                } catch (err) {
                  // Ignore parsing errors from partial chunks
                }
              }
            }
          } catch (streamErr) {
            console.error("Gemini stream parsing error:", streamErr);
          } finally {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      console.error("Gemini stream error, falling back to Anthropic if available:", err);
      if (!anthropicKey) throw err;
    }
  }

  // --- OPTION B: ANTHROPIC (using SDK) ---
  const anthropic = getAnthropicClient();
  if (!anthropic) {
    throw new Error("Anthropic client failed to initialize.");
  }

  const model = modelType === "tutor" ? "claude-3-5-sonnet-latest" : "claude-3-5-sonnet-latest";
  const stream = anthropic.messages.stream({
    model: model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.slice(-20) as any,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          const data = JSON.stringify({ delta: { text: event.delta.text } });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * Unified helper to generate structured JSON (quizzes) from either Anthropic or Gemini.
 */
export async function generateAIQuiz(
  lessonTitle: string,
  lessonContent: string,
  difficulty: string,
  count: number = 5
): Promise<any[]> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey && !geminiKey) {
    throw new Error("No AI API keys configured. Please set GEMINI_API_KEY or ANTHROPIC_API_KEY.");
  }

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
- Return ONLY the raw JSON array, no other text or explanation. Start with [ and end with ]`;

  // --- OPTION A: GEMINI ---
  if (geminiKey) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${geminiKey}`,
          },
          body: JSON.stringify({
            model: "gemini-1.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a precise technical quiz generation assistant. You must output valid JSON arrays.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned error code ${response.status}`);
      }

      const resJson = await response.json();
      const content = resJson.choices?.[0]?.message?.content || "";
      
      // Since response_format: json_object is set, some LLMs package the array in a parent object, or return it directly.
      // Let's parse and retrieve the array.
      let questions = [];
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          questions = parsed;
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
          questions = parsed.questions;
        } else {
          // If it's a wrapper object, find the first array property
          const firstKey = Object.keys(parsed)[0];
          if (firstKey && Array.isArray(parsed[firstKey])) {
            questions = parsed[firstKey];
          }
        }
      } catch (innerErr) {
        // Fallback regex parsing if needed
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw innerErr;
        }
      }

      return questions;
    } catch (err) {
      console.error("Gemini quiz generation error, falling back to Anthropic if available:", err);
      if (!anthropicKey) throw err;
    }
  }

  // --- OPTION B: ANTHROPIC ---
  const anthropic = getAnthropicClient();
  if (!anthropic) {
    throw new Error("Anthropic client failed to initialize.");
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-latest",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const contentBlock = response.content[0];
  if (contentBlock.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = contentBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON array found in response");

  return JSON.parse(jsonMatch[0]);
}
