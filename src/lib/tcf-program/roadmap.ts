import type { TcfTrackId } from "./types";

export type StudyMode = "self" | "tutor" | "mixed";

export type RoadmapPhaseId = "foundation" | "bridge" | "b2" | "exam" | "practice";

export interface RoadmapBlock {
  id: string;
  label: string;
  description: string;
  href: string;
  tutorFriendly?: boolean;
}

export interface RoadmapPhase {
  id: RoadmapPhaseId;
  trackId?: TcfTrackId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  color: string;
  blocks: RoadmapBlock[];
  tutorTip: string;
}

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  self: "Self-study",
  tutor: "With tutor",
  mixed: "Mixed",
};

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "foundation",
    trackId: "foundation",
    order: 1,
    title: "French basics",
    subtitle: "A0 → A2 · ~28 hours",
    description:
      "Sounds, greetings, survival French, and the grammar you need before TCF-style questions make sense. Skip ahead if you already know some French — mark units complete when you finish them.",
    timeline: "Weeks 1–14 at 6 h/week",
    color: "#be185d",
    tutorTip:
      "Popular with tutors: pronunciation, greetings, and present tense. Many learners do 5–10 hours in person, then self-study units here.",
    blocks: [
      {
        id: "curriculum",
        label: "Foundation units (1–20)",
        description: "Interactive lessons — open any unit, recommended order shown",
        href: "/tcf/learn",
      },
      {
        id: "vocab-survival",
        label: "Survival vocabulary",
        description: "Immigration, housing, daily life decks",
        href: "/tcf/vocabulary",
        tutorFriendly: true,
      },
      {
        id: "grammar-core",
        label: "Core grammar map",
        description: "Present tense, articles, basic questions",
        href: "/tcf/grammar",
      },
      {
        id: "listening-intro",
        label: "Listening intro",
        description: "Papers 1–2 in practice mode",
        href: "/tcf/listening",
      },
    ],
  },
  {
    id: "bridge",
    trackId: "bridge",
    order: 2,
    title: "Bridge to intermediate",
    subtitle: "A2 → B1 · ~22 hours",
    description:
      "Past tenses, pronouns, longer texts, and the listening/reading bands that unlock NCLC 5–6. Production tasks start appearing.",
    timeline: "Weeks 15–24",
    color: "#7c3aed",
    tutorTip:
      "Tutors often focus on passé composé vs imparfait and spoken fluency. Pair weekly tutor sessions with reading/listening practice here.",
    blocks: [
      {
        id: "curriculum",
        label: "Bridge units (21–34)",
        description: "Past tenses, connectors, TCF MCQ strategies",
        href: "/tcf/learn",
      },
      {
        id: "vocab-work",
        label: "Work & education vocab",
        description: "Employment, training, health themes",
        href: "/tcf/vocabulary",
      },
      {
        id: "reading",
        label: "Reading practice",
        description: "39-question papers with explanations",
        href: "/tcf/reading",
      },
      {
        id: "listening",
        label: "Listening practice",
        description: "Exam-mode papers when ready",
        href: "/tcf/listening",
      },
    ],
  },
  {
    id: "b2",
    trackId: "b2",
    order: 3,
    title: "NCLC 7 core",
    subtitle: "B1 → B2 · ~30 hours",
    description:
      "Subjunctive, argumentation, Québécois listening, and writing/speaking at the Express Entry threshold. This is the longest phase.",
    timeline: "Weeks 25–40",
    color: "#326ce5",
    tutorTip:
      "Speaking and writing benefit most from tutor feedback. Use AI practice here between sessions to track improvement.",
    blocks: [
      {
        id: "curriculum",
        label: "NCLC 7 units (35–52)",
        description: "B2 grammar, formal register, exam strategies",
        href: "/tcf/learn",
      },
      {
        id: "writing",
        label: "Writing practice",
        description: "3 tasks per paper · AI scored",
        href: "/tcf/writing",
        tutorFriendly: true,
      },
      {
        id: "speaking",
        label: "Speaking practice",
        description: "Recorded tasks · AI scored",
        href: "/tcf/speaking",
        tutorFriendly: true,
      },
      {
        id: "grammar-advanced",
        label: "Advanced grammar",
        description: "Subjunctive, conditionals, pronouns",
        href: "/tcf/grammar",
      },
    ],
  },
  {
    id: "exam",
    trackId: "exam",
    order: 4,
    title: "Exam mastery",
    subtitle: "Test-ready · ~15 hours",
    description:
      "Full mocks, timing drills, error journal, and the checklist before you book your real TCF Canada date.",
    timeline: "Weeks 41–48",
    color: "#0f766e",
    tutorTip:
      "Optional tutor mock interviews before the real test. Most learners self-study mocks and only book the exam when practice scores hit NCLC 7.",
    blocks: [
      {
        id: "curriculum",
        label: "Exam units (53–62)",
        description: "Timing, weak-skill drills, booking checklist",
        href: "/tcf/learn",
      },
      {
        id: "mocks",
        label: "Full & sectional mocks",
        description: "4-section simulation under exam conditions",
        href: "/tcf/mocks",
      },
      {
        id: "all-practice",
        label: "All four skills",
        description: "Rotate weakest skill from progress dashboard",
        href: "/tcf/practice",
      },
    ],
  },
  {
    id: "practice",
    order: 5,
    title: "Ongoing practice",
    subtitle: "Parallel track",
    description:
      "Runs alongside every phase above. Return here whenever you want timed papers — not a step you finish once.",
    timeline: "Throughout your journey",
    color: "#64748b",
    tutorTip:
      "Use practice scores to decide what to bring to a tutor: weakest skill + specific paper results.",
    blocks: [
      { id: "listening", label: "Listening", description: "5 papers · 39 Q", href: "/tcf/listening" },
      { id: "reading", label: "Reading", description: "5 papers · 39 Q", href: "/tcf/reading" },
      { id: "writing", label: "Writing", description: "5 papers · AI eval", href: "/tcf/writing", tutorFriendly: true },
      { id: "speaking", label: "Speaking", description: "5 papers · AI eval", href: "/tcf/speaking", tutorFriendly: true },
    ],
  },
];

export type RoadmapPrefs = Partial<Record<RoadmapPhaseId, StudyMode>>;

export const DEFAULT_ROADMAP_PREFS: RoadmapPrefs = {
  foundation: "mixed",
  bridge: "self",
  b2: "mixed",
  exam: "self",
  practice: "self",
};

export function parseRoadmapPrefs(json: unknown): RoadmapPrefs {
  if (!json || typeof json !== "object") return { ...DEFAULT_ROADMAP_PREFS };
  const o = json as Record<string, string>;
  const modes: StudyMode[] = ["self", "tutor", "mixed"];
  const out: RoadmapPrefs = { ...DEFAULT_ROADMAP_PREFS };
  for (const phase of ROADMAP_PHASES) {
    const v = o[phase.id];
    if (modes.includes(v as StudyMode)) out[phase.id] = v as StudyMode;
  }
  return out;
}

export function phaseProgressPercent(
  phase: RoadmapPhase,
  tracks: { id: string; percent: number }[],
): number {
  if (phase.trackId) {
    return tracks.find((t) => t.id === phase.trackId)?.percent ?? 0;
  }
  if (phase.id === "practice") {
    const avg = tracks.reduce((s, t) => s + t.percent, 0) / Math.max(tracks.length, 1);
    return Math.round(avg);
  }
  return 0;
}

export function overallRoadmapPercent(tracks: { id: string; percent: number }[]): number {
  const curriculum = tracks.filter((t) => t.id !== "exam");
  if (!curriculum.length) return 0;
  return Math.round(curriculum.reduce((s, t) => s + t.percent, 0) / curriculum.length);
}
