/** Achievement catalog — used by the user-progress system to unlock badges. */
import type { Achievement } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  { slug: "first-lesson",    title: "First step",        description: "Complete your first lesson",          icon: "target",         xpReward: 50,   rarity: "COMMON" },
  { slug: "first-quiz",      title: "Quiz taker",        description: "Complete your first quiz",            icon: "clipboard-list", xpReward: 50,   rarity: "COMMON" },
  { slug: "first-interview", title: "Interview ready",   description: "Complete your first mock interview",  icon: "mic",            xpReward: 100,  rarity: "RARE" },
  { slug: "week-streak",     title: "Week warrior",      description: "Maintain a 7-day learning streak",    icon: "flame",          xpReward: 200,  rarity: "RARE" },
  { slug: "month-streak",    title: "Dedicated learner", description: "Maintain a 30-day learning streak",   icon: "zap",            xpReward: 500,  rarity: "EPIC" },
  { slug: "llm-complete",    title: "LLM graduate",      description: "Complete the LLM Foundations path",   icon: "brain",          xpReward: 250,  rarity: "RARE" },
  { slug: "rag-complete",    title: "RAG architect",     description: "Complete the RAG & Vector DBs path",  icon: "database",       xpReward: 350,  rarity: "EPIC" },
  { slug: "agent-builder",   title: "Agent builder",     description: "Complete the AI Agents path",         icon: "cpu",            xpReward: 450,  rarity: "EPIC" },
  { slug: "all-paths",       title: "Master",            description: "Complete every learning path",        icon: "trophy",         xpReward: 1000, rarity: "LEGENDARY" },
  { slug: "speed-learner",   title: "Speed learner",     description: "Complete 3 lessons in one day",       icon: "rocket",         xpReward: 150,  rarity: "RARE" },
  { slug: "perfect-quiz",    title: "Perfect score",     description: "Get 100% on any quiz",                icon: "star",           xpReward: 200,  rarity: "RARE" },
  { slug: "flashcard-100",   title: "Card shark",        description: "Review 100 flashcards total",         icon: "layers",         xpReward: 150,  rarity: "RARE" },
  { slug: "first-note",      title: "Note taker",        description: "Write your first lesson note",        icon: "pen-line",       xpReward: 30,   rarity: "COMMON" },
];
