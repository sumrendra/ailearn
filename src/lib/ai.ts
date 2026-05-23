import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client conditionally
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
};

/**
 * Non-streaming helper using OpenAI-compatible endpoint.
 * Returns the full response text at once (more reliable than SSE streaming).
 */
async function chatOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  systemPrompt: string
): Promise<string> {
  const formattedMessages = messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
      ],
      stream: true, // Use streaming to avoid server-side hang in Docker with Gemini
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible API returned error code ${response.status}: ${errorText}`);
  }

  // Accumulate full text from SSE stream server-side, then return as a plain string
  const decoder = new TextDecoder();
  const reader = response.body?.getReader();
  let accumulated = "";
  let buffer = "";

  if (!reader) return accumulated;

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
          if (text) accumulated += text;
        } catch {
          // Ignore parsing errors from partial chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return accumulated;
}

/**
 * Non-streaming chat: returns full response text.
 * 3-tier fallback: Gemini → OpenRouter → Anthropic.
 */
export async function generateAIChat(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  modelType: "tutor" | "interview"
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !openrouterKey && !anthropicKey) {
    throw new Error("No AI API keys configured.");
  }

  // 1. PRIMARY: Gemini
  if (geminiKey) {
    try {
      console.log(`[AI Chat] Attempting Gemini for ${modelType}...`);
      const model = modelType === "tutor" ? "gemini-3.5-flash" : "gemini-3.1-flash-lite";
      return await chatOpenAICompatible(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        geminiKey,
        model,
        messages,
        systemPrompt
      );
    } catch (err) {
      console.error("[AI Chat] Gemini failed:", err);
    }
  }

  // 2. SECONDARY: OpenRouter
  if (openrouterKey) {
    try {
      console.log(`[AI Chat] Attempting OpenRouter for ${modelType}...`);
      const model = modelType === "tutor"
        ? "meta-llama/llama-3.3-70b-instruct:free"
        : "deepseek/deepseek-v4-flash:free";
      return await chatOpenAICompatible(
        "https://openrouter.ai/api/v1/chat/completions",
        openrouterKey,
        model,
        messages,
        systemPrompt
      );
    } catch (err) {
      console.error("[AI Chat] OpenRouter failed:", err);
    }
  }

  // 3. TERTIARY: Anthropic
  if (anthropicKey) {
    try {
      console.log(`[AI Chat] Attempting Anthropic for ${modelType}...`);
      const anthropic = getAnthropicClient();
      if (!anthropic) throw new Error("Anthropic client failed to initialize.");
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.slice(-20) as any,
      });
      const block = response.content[0];
      if (block.type !== "text") throw new Error("Unexpected response type");
      return block.text;
    } catch (err) {
      console.error("[AI Chat] Anthropic failed:", err);
      throw err;
    }
  }

  throw new Error("All configured AI providers failed.");
}

/**
 * Helper to stream completion from an OpenAI-compatible endpoint.
 */
async function streamOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  systemPrompt: string
): Promise<Response> {
  const formattedMessages = messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible API returned error code ${response.status}: ${errorText}`);
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
        console.error("OpenAI-compatible stream parsing error:", streamErr);
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
}

/**
 * Unified helper to stream chat interactions from either Gemini (Primary), OpenRouter (Secondary), or Anthropic (Fallback).
 */
export async function streamAIChat(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  modelType: "tutor" | "interview"
): Promise<Response> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !openrouterKey && !anthropicKey) {
    return new Response(
      JSON.stringify({
        error: "No AI API keys configured. Please set GEMINI_API_KEY or OPENROUTER_KEY in your env.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- 1. PRIMARY: NATIVE GEMINI (LATEST FREE TIER VERSION 3/3.5) ---
  if (geminiKey) {
    try {
      console.log(`[AI] Attempting primary native Gemini (Free Tier) for ${modelType}...`);
      const model = modelType === "tutor" ? "gemini-3.5-flash" : "gemini-3.1-flash-lite";
      return await streamOpenAICompatible(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        geminiKey,
        model,
        messages,
        systemPrompt
      );
    } catch (err) {
      console.error("[AI] Native Gemini failed, attempting OpenRouter secondary:", err);
    }
  }

  // --- 2. SECONDARY: OPENROUTER (FREE TIER ONLY) ---
  if (openrouterKey) {
    try {
      console.log(`[AI] Attempting secondary OpenRouter (Free Tier Only) for ${modelType}...`);
      const model = modelType === "tutor"
        ? "meta-llama/llama-3.3-70b-instruct:free"
        : "deepseek/deepseek-v4-flash:free";
      return await streamOpenAICompatible(
        "https://openrouter.ai/api/v1/chat/completions",
        openrouterKey,
        model,
        messages,
        systemPrompt
      );
    } catch (err) {
      console.error("[AI] OpenRouter failed, attempting Anthropic tertiary:", err);
    }
  }

  // --- 3. TERTIARY: ANTHROPIC ---
  if (anthropicKey) {
    try {
      console.log(`[AI] Attempting tertiary Anthropic for ${modelType}...`);
      const anthropic = getAnthropicClient();
      if (!anthropic) {
        throw new Error("Anthropic client failed to initialize.");
      }

      const model = "claude-3-5-sonnet-latest";
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
    } catch (err) {
      console.error("[AI] Anthropic fallback failed:", err);
      throw err;
    }
  }

  throw new Error("All configured AI providers failed to complete the request.");
}

/**
 * Unified helper to generate structured JSON (quizzes) from either Gemini (Primary), OpenRouter (Secondary), or Anthropic (Fallback).
 */
export async function generateAIQuiz(
  lessonTitle: string,
  lessonContent: string,
  difficulty: string,
  count: number = 5
): Promise<any[]> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !openrouterKey && !anthropicKey) {
    throw new Error("No AI API keys configured. Please set GEMINI_API_KEY or OPENROUTER_KEY.");
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

  const parseQuizContent = (content: string) => {
    let questions: any[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else {
        const firstKey = Object.keys(parsed)[0];
        if (firstKey && Array.isArray(parsed[firstKey])) {
          questions = parsed[firstKey];
        }
      }
    } catch (innerErr) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw innerErr;
      }
    }
    return questions;
  };

  // --- 1. PRIMARY: NATIVE GEMINI (LATEST FREE TIER VERSION 3/3.5) ---
  if (geminiKey) {
    try {
      console.log("[AI Quiz] Attempting primary native Gemini (gemini-3.5-flash)...");
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${geminiKey}`,
          },
          body: JSON.stringify({
            model: "gemini-3.5-flash",
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
      return parseQuizContent(content);
    } catch (err) {
      console.error("[AI Quiz] Native Gemini failed, trying OpenRouter secondary:", err);
    }
  }

  // --- 2. SECONDARY: OPENROUTER (FREE TIER ONLY) ---
  if (openrouterKey) {
    try {
      console.log("[AI Quiz] Attempting secondary OpenRouter (Free Tier: deepseek/deepseek-v4-flash:free)...");
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-v4-flash:free",
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
        throw new Error(`OpenRouter API returned error code ${response.status}`);
      }

      const resJson = await response.json();
      const content = resJson.choices?.[0]?.message?.content || "";
      return parseQuizContent(content);
    } catch (err) {
      console.error("[AI Quiz] OpenRouter failed, trying Anthropic tertiary:", err);
    }
  }

  // --- 3. TERTIARY: ANTHROPIC ---
  if (anthropicKey) {
    try {
      console.log("[AI Quiz] Attempting tertiary Anthropic (claude-3-5-haiku-latest)...");
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
    } catch (err) {
      console.error("[AI Quiz] Anthropic failed:", err);
      throw err;
    }
  }

  throw new Error("All configured AI providers failed to generate quiz questions.");
}
