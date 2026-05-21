import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding AILearn database...");

  // Learning Paths
  const llmPath = await prisma.learningPath.upsert({
    where: { slug: "llm-foundations" },
    update: {},
    create: {
      slug: "llm-foundations",
      title: "LLM Foundations",
      description: "Master transformers, attention, tokenization, and how to work with LLMs as an engineer.",
      icon: "🧠",
      color: "#6c47ff",
      difficulty: "BEGINNER",
      estimatedHours: 8,
      tags: ["Transformers", "Tokenization", "Prompting", "LLMs"],
      order: 1,
    },
  });

  const ragPath = await prisma.learningPath.upsert({
    where: { slug: "rag-vector-dbs" },
    update: {},
    create: {
      slug: "rag-vector-dbs",
      title: "RAG & Vector Databases",
      description: "Build production-grade RAG pipelines with embeddings, chunking, and vector search.",
      icon: "🔍",
      color: "#0f766e",
      difficulty: "INTERMEDIATE",
      estimatedHours: 10,
      tags: ["RAG", "pgvector", "Embeddings", "Chunking"],
      order: 2,
    },
  });

  const agentsPath = await prisma.learningPath.upsert({
    where: { slug: "ai-agents" },
    update: {},
    create: {
      slug: "ai-agents",
      title: "AI Agents & Tool Use",
      description: "Build autonomous agents, implement tool calling, and design reliable agent loops.",
      icon: "🤖",
      color: "#b45309",
      difficulty: "ADVANCED",
      estimatedHours: 12,
      tags: ["Agents", "Tool calling", "ReAct", "LangChain"],
      order: 3,
    },
  });

  // Lessons for LLM path
  const lesson1 = await prisma.lesson.upsert({
    where: { slug: "what-is-an-llm" },
    update: {},
    create: {
      slug: "what-is-an-llm",
      title: "What is a Large Language Model?",
      description: "Understand what LLMs are, how they're trained, and why they work the way they do.",
      pathId: llmPath.id,
      order: 1,
      estimatedMins: 15,
      xpReward: 50,
      tags: ["LLM Fundamentals"],
      content: `# What is a Large Language Model?

A **Large Language Model (LLM)** is a type of neural network trained to predict the next token in a sequence of text. That's it at its core — everything else (reasoning, coding, conversation) emerges from doing this extremely well at massive scale.

## The training recipe

1. Collect a massive corpus of text (the internet, books, code, etc.)
2. Tokenize it into subword tokens
3. Train a transformer neural network to predict the next token, billions of times
4. The model learns statistical patterns, facts, reasoning, and language structure as side effects

## Why they feel intelligent

LLMs don't "understand" language the way humans do — they learn incredibly rich statistical patterns. When you ask "What is the capital of France?", the model has seen "capital of France is Paris" so many times that \`Paris\` has the highest probability.

## The Java developer analogy

Think of an LLM as a very sophisticated auto-complete that trained on the entire internet. If you've used IntelliJ IDEA's code completion, you understand the concept — but LLMs are doing this for *all human knowledge*, not just Java APIs.

## Key terms

- **Parameters**: The weights in the neural network (GPT-4 has ~1.8T, Claude 3 Haiku has ~20B)
- **Training**: The process of adjusting weights via gradient descent
- **Inference**: Running the model to generate text (this is what you pay for per API call)
- **RLHF**: Reinforcement Learning from Human Feedback — makes the raw model useful and safe

## Popular LLMs in 2025

| Model | Maker | Strengths |
|-------|-------|-----------|
| Claude 3.5 Sonnet | Anthropic | Reasoning, coding, long context (200K) |
| GPT-4o | OpenAI | Multimodal, broad capability |
| Llama 3.3 70B | Meta | Open source, self-hostable |
| Gemini 1.5 Pro | Google | 1M context window |
| Mistral Large | Mistral | European, fast |

## What's next?

Now that you understand what LLMs are, the next lesson covers how the transformer architecture actually works — and why "attention is all you need."
`,
    },
  });

  // Flashcards for lesson 1
  await prisma.flashcard.createMany({
    skipDuplicates: true,
    data: [
      {
        lessonId: lesson1.id,
        front: "What is the core task that LLMs are trained to perform?",
        back: "Next token prediction. Given a sequence of tokens, predict the most likely next token. Everything else (reasoning, coding, conversation) emerges from doing this at massive scale on huge datasets.",
        tags: ["LLM Fundamentals"],
      },
      {
        lessonId: lesson1.id,
        front: "What does RLHF stand for and why is it important?",
        back: "Reinforcement Learning from Human Feedback. It's a training technique used after base pretraining to align the model to be helpful, harmless, and honest. Without RLHF, raw pretrained models often produce unhelpful or harmful outputs.",
        tags: ["LLM Fundamentals", "Training"],
      },
      {
        lessonId: lesson1.id,
        front: "What is the difference between training and inference for LLMs?",
        back: "Training: adjusting the model's weights by showing it billions of examples (done once, very expensive — millions of dollars). Inference: running the trained model to generate text (done per API call, pay-as-you-go). API costs are inference costs.",
        tags: ["LLM Fundamentals"],
      },
    ],
  });

  // Achievements
  const achievements = [
    { slug: "first-lesson", title: "First step", description: "Complete your first lesson", icon: "🎯", xpReward: 50, rarity: "COMMON" as const },
    { slug: "first-quiz", title: "Quiz taker", description: "Complete your first quiz", icon: "📝", xpReward: 50, rarity: "COMMON" as const },
    { slug: "first-interview", title: "Interview ready", description: "Complete your first mock interview", icon: "🎤", xpReward: 100, rarity: "RARE" as const },
    { slug: "week-streak", title: "Week warrior", description: "Maintain a 7-day learning streak", icon: "🔥", xpReward: 200, rarity: "RARE" as const },
    { slug: "month-streak", title: "Dedicated learner", description: "Maintain a 30-day learning streak", icon: "⚡", xpReward: 500, rarity: "EPIC" as const },
    { slug: "rag-complete", title: "RAG architect", description: "Complete the RAG & Vector DB path", icon: "🔍", xpReward: 300, rarity: "EPIC" as const },
    { slug: "agent-builder", title: "Agent builder", description: "Complete the AI Agents path", icon: "🤖", xpReward: 400, rarity: "EPIC" as const },
    { slug: "all-paths", title: "AI master", description: "Complete all three learning paths", icon: "🏆", xpReward: 1000, rarity: "LEGENDARY" as const },
    { slug: "speed-learner", title: "Speed learner", description: "Complete 3 lessons in one day", icon: "⚡", xpReward: 150, rarity: "RARE" as const },
    { slug: "perfect-quiz", title: "Perfect score", description: "Get 100% on any quiz", icon: "💯", xpReward: 200, rarity: "RARE" as const },
    { slug: "kafka-ai", title: "Kafka + AI integrator", description: "Complete the event streaming + AI lesson", icon: "📨", xpReward: 250, rarity: "EPIC" as const },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // Daily challenges
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyChallenge.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      type: "CONCEPT",
      title: "Why does temperature = 0 make LLMs deterministic?",
      content: `Temperature controls the randomness in token sampling. At temperature=0, the model always picks the highest-probability token — making the output fully deterministic (same prompt = same output every time).

At higher temperatures (0.7-1.0), the probability distribution is "flatter" — lower probability tokens get more chances to be picked, producing creative/varied output.

**The math**: temperature divides the logits (raw model outputs) before softmax. T → 0 makes the highest logit dominate completely. T → ∞ makes all tokens equally probable.

**Java analogy**: Think of it like a load balancer. Temperature=0 is round-robin to the top server only. Temperature=1.0 is weighted random routing.

**When to use what**:
- Temperature=0: factual Q&A, classification, structured output
- Temperature=0.7: balanced creativity
- Temperature=1.0+: brainstorming, creative writing`,
      xpReward: 25,
      tags: ["LLM Fundamentals", "Sampling"],
    },
  });

  console.log("Seed complete! ✓");
  console.log(`  Created paths: LLM Foundations, RAG & Vector DBs, AI Agents`);
  console.log(`  Created lessons: ${lesson1.title}`);
  console.log(`  Created ${achievements.length} achievements`);
  console.log(`  Created daily challenge for today`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
