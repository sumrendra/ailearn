/** Client-side state for a sequential 4-section TCF mock exam. */

import { newExamSeed } from "./exam-draw";

export type MockModule = "listening" | "reading" | "writing" | "speaking";

export interface MockModuleScore {
  scoreRaw?: number;
  scoreNclc?: number;
  score699?: number;
}

export interface TcfMockSession {
  paper: number;
  /** Seeds the randomized item draw so every section of a sitting is stable. */
  seed: number;
  stage: MockModule | "results";
  startedAt: string;
  scores: Partial<Record<MockModule, MockModuleScore>>;
}

const STORAGE_KEY = "tcf-mock-session";
const MODULE_ORDER: MockModule[] = ["listening", "reading", "writing", "speaking"];

export function getMockSession(): TcfMockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TcfMockSession;
  } catch {
    return null;
  }
}

export function saveMockSession(session: TcfMockSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function startMockSession(paper = 1): TcfMockSession {
  const session: TcfMockSession = {
    paper,
    seed: newExamSeed(),
    stage: "listening",
    startedAt: new Date().toISOString(),
    scores: {},
  };
  saveMockSession(session);
  return session;
}

export function recordMockScore(module: MockModule, score: MockModuleScore): TcfMockSession | null {
  const session = getMockSession();
  if (!session) return null;
  session.scores[module] = score;
  const idx = MODULE_ORDER.indexOf(module);
  const next = MODULE_ORDER[idx + 1];
  session.stage = next ?? "results";
  saveMockSession(session);
  return session;
}

export function clearMockSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function mockModuleHref(module: MockModule, paper: number, seed?: number): string {
  const seedParam = seed != null ? `&seed=${seed}` : "";
  return `/tcf/${module}?mock=1&paper=${paper}${seedParam}`;
}

export function nextMockHref(session: TcfMockSession): string {
  if (session.stage === "results") return "/tcf/mocks/full/results";
  return mockModuleHref(session.stage, session.paper, session.seed);
}

export function isMockActive(): boolean {
  return getMockSession() != null;
}

export const MOCK_MODULE_LABELS: Record<MockModule, string> = {
  listening: "Compréhension orale",
  reading: "Compréhension écrite",
  writing: "Expression écrite",
  speaking: "Expression orale",
};

export const MOCK_MODULE_DURATION = "~2h 47min total";
