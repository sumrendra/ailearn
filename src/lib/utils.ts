import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID safe for both secure (HTTPS/localhost) and non-secure
 * (plain HTTP, IP-based) contexts. `crypto.randomUUID()` throws on the latter,
 * which silently kills any onClick handler that calls it before state updates —
 * leaving send buttons "disabled" and starter prompts inert.
 */
export function genId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try { return crypto.randomUUID(); } catch { /* fall through */ }
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getLevelFromXP(xp: number): { level: number; title: string; progress: number; nextXP: number } {
  const thresholds = [
    { xp: 0,     title: "AI Curious" },
    { xp: 200,   title: "Prompt Apprentice" },
    { xp: 500,   title: "Token Wrangler" },
    { xp: 1000,  title: "Embedding Explorer" },
    { xp: 2000,  title: "Vector Voyager" },
    { xp: 3500,  title: "RAG Architect" },
    { xp: 5500,  title: "Agent Builder" },
    { xp: 8000,  title: "LLM Engineer" },
    { xp: 12000, title: "Prompt Architect" },
    { xp: 18000, title: "Model Whisperer" },
    { xp: 25000, title: "AI Systems Master" },
  ];

  let level = 1;
  let title = thresholds[0].title;
  let prevXP = 0;
  let nextXP = thresholds[1]?.xp ?? 9999999;

  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i].xp) {
      level = i + 1;
      title = thresholds[i].title;
      prevXP = thresholds[i].xp;
      nextXP = thresholds[i + 1]?.xp ?? prevXP + 10000;
    }
  }

  const progress = Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100);
  return { level, title, progress, nextXP };
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "BEGINNER": return "var(--beginner)";
    case "INTERMEDIATE": return "var(--intermediate)";
    case "ADVANCED": return "var(--advanced)";
    default: return "var(--text-secondary)";
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty) {
    case "BEGINNER": return "var(--beginner-light)";
    case "INTERMEDIATE": return "var(--intermediate-light)";
    case "ADVANCED": return "var(--advanced-light)";
    default: return "var(--bg-secondary)";
  }
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "COMMON":    return "#9a9a9a";
    case "RARE":      return "#3b82f6";
    case "EPIC":      return "#8b5cf6";
    case "LEGENDARY": return "#f59e0b";
    default: return "#9a9a9a";
  }
}

export function getTopicIcon(tag: string): string {
  const icons: Record<string, string> = {
    llm: "🧠", rag: "🔍", agents: "🤖", mlops: "⚙️",
    embeddings: "📐", "vector-db": "🗃️", "prompt-engineering": "✍️",
    "fine-tuning": "🎛️", "spring-ai": "☕", langchain: "🔗",
    kafka: "📨", microservices: "🧩", transformers: "⚡",
    "computer-vision": "👁️", nlp: "💬", "reinforcement-learning": "🎮",
  };
  return icons[tag.toLowerCase()] ?? "📚";
}
