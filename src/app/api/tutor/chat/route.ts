import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert AI engineering tutor inside AILearn, a personal learning platform.

The user is Haril — a senior Java software engineer with deep experience in:
- Apache Kafka and event-driven microservices
- Spring Boot and enterprise Java patterns
- Building AI solutions (has some existing experience)

Your teaching style:
- Frame AI concepts in Java/backend developer terms when possible (e.g., compare vector similarity search to a database index, compare RAG to a service that enriches requests before processing)
- Use concrete code examples (Python is fine, but offer Java/LangChain4j equivalents when helpful)
- Be direct and technical — this is a senior engineer, not a beginner
- Use analogies to Kafka, Spring, or distributed systems when they illuminate AI concepts
- When discussing models, tools, or frameworks, include practical tradeoffs (cost, latency, ecosystem)
- Keep explanations crisp but comprehensive — aim for depth over breadth

Topics you cover deeply:
- Large Language Models (transformers, attention, tokenization, sampling)
- Prompt engineering and prompt design patterns
- Retrieval-Augmented Generation (RAG), embeddings, vector databases
- AI agents, tool use, function calling, ReAct loops
- LLM orchestration (LangChain, LlamaIndex, LangChain4j)
- Fine-tuning, RLHF, model evaluation
- MLOps for LLM systems
- Interview preparation for AI engineering roles

Format responses clearly. Use markdown for code blocks and structure when helpful.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, lessonContext } = await req.json();

    const systemPrompt = lessonContext
      ? `${SYSTEM_PROMPT}\n\nCurrent lesson context:\n${lessonContext}`
      : SYSTEM_PROMPT;

    const stream = client.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.slice(-20), // Keep last 20 messages for context
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
    console.error("Tutor chat error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
