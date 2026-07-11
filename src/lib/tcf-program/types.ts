export type TcfTrackId = "foundation" | "bridge" | "b2" | "exam";

export type CefrBand = "A0" | "A1" | "A2" | "B1" | "B2" | "exam";

export type GrammarMasteryState =
  | "locked"
  | "available"
  | "in_progress"
  | "practiced"
  | "mastered";

export interface TcfUnit {
  slug: string;
  trackId: TcfTrackId;
  order: number;
  title: string;
  description: string;
  content: string;
  estimatedMins: number;
  xpReward: number;
  cefrBand: CefrBand;
  grammarTopics: string[];
  vocabThemes: string[];
  prerequisites: string[];
  practiceModule?: "listening" | "reading" | "writing" | "speaking";
  practiceHint?: string;
}

export interface TcfTrack {
  id: TcfTrackId;
  title: string;
  subtitle: string;
  description: string;
  cefrRange: string;
  estimatedHours: number;
  color: string;
  order: number;
}

export interface GrammarTopic {
  id: string;
  label: string;
  cefr: CefrBand;
  category: "tenses" | "pronouns" | "syntax" | "mood" | "other";
  unitSlug?: string;
  prerequisiteIds: string[];
}

export interface VocabTheme {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  emoji: string;
  cefr: CefrBand;
  cardCount: number;
}

export interface TcfUserProfileData {
  targetNclc: number;
  placementCefr: CefrBand;
  weeklyHours: number;
  examDate: string | null;
  onboardingDone: boolean;
}

export const TCF_TRACKS: TcfTrack[] = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "Zero → A2",
    description: "Start from nothing. Sounds, survival French, core grammar, and your first TCF-style drills.",
    cefrRange: "A0 → A2",
    estimatedHours: 28,
    color: "#be185d",
    order: 1,
  },
  {
    id: "bridge",
    title: "Bridge",
    subtitle: "A2 → B1",
    description: "Past tenses, pronouns, conditionals, and the listening/reading bands that unlock NCLC 5–6.",
    cefrRange: "A2 → B1",
    estimatedHours: 22,
    color: "#7c3aed",
    order: 2,
  },
  {
    id: "b2",
    title: "NCLC 7 Core",
    subtitle: "B1 → B2",
    description: "Subjunctive, argumentation, Québécois listening, and production tasks at the Express Entry threshold.",
    cefrRange: "B1 → B2",
    estimatedHours: 30,
    color: "#326ce5",
    order: 3,
  },
  {
    id: "exam",
    title: "Exam Mastery",
    subtitle: "Test-ready",
    description: "Timing, full mocks, error journal, and the checklist before you book your real TCF Canada.",
    cefrRange: "B2+",
    estimatedHours: 15,
    color: "#0f766e",
    order: 4,
  },
];
