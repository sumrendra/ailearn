import type { VocabTheme } from "./types";

export const VOCAB_THEMES: VocabTheme[] = [
  { id: "immigration", title: "Immigration & integration", titleFr: "Immigration et intégration", description: "Visa, citizenship, adaptation, multiculturalism", emoji: "🛂", cefr: "A2", cardCount: 15 },
  { id: "work", title: "Work & employment", titleFr: "Travail et emploi", description: "CV, interview, workplace, skills", emoji: "💼", cefr: "B1", cardCount: 15 },
  { id: "housing", title: "Housing & daily life", titleFr: "Logement et vie quotidienne", description: "Rent, landlord, utilities, neighbourhood", emoji: "🏠", cefr: "A2", cardCount: 15 },
  { id: "health", title: "Health & wellbeing", titleFr: "Santé et bien-être", description: "Doctor, symptoms, insurance, mental health", emoji: "🏥", cefr: "B1", cardCount: 15 },
  { id: "education", title: "Education & training", titleFr: "Éducation et formation", description: "School, diploma, courses, equivalence", emoji: "🎓", cefr: "B1", cardCount: 15 },
  { id: "environment", title: "Environment & climate", titleFr: "Environnement et climat", description: "Pollution, recycling, climate debate", emoji: "🌿", cefr: "B2", cardCount: 15 },
  { id: "technology", title: "Technology & digital", titleFr: "Technologie et numérique", description: "Internet, AI, telework, data privacy", emoji: "💻", cefr: "B2", cardCount: 15 },
  { id: "media", title: "Media & society", titleFr: "Médias et société", description: "News, social media, public opinion", emoji: "📰", cefr: "B2", cardCount: 15 },
  { id: "culture", title: "Culture & travel", titleFr: "Culture et voyage", description: "Heritage, festivals, tourism", emoji: "✈️", cefr: "A2", cardCount: 15 },
  { id: "economy", title: "Economy & consumption", titleFr: "Économie et consommation", description: "Prices, budget, consumer rights", emoji: "🛒", cefr: "B1", cardCount: 15 },
];

export const VOCAB_THEME_IDS = VOCAB_THEMES.map((t) => t.id);
