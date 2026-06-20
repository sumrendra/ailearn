/**
 * Validate a TCF paper manifest JSON (structure + level bands).
 */

import type { TCFLevel } from "../../src/lib/content/tcf-listening";

export interface TcfPaperManifest {
  paper: number;
  theme: string;
  listening: Array<{
    id: number;
    level: TCFLevel;
    topic: string;
    audioScript: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }>;
  reading: Array<{
    id: number;
    level: TCFLevel;
    passageType: string;
    passage: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }>;
  writing: Array<{
    type: 1 | 2 | 3;
    register: string;
    minWords: number;
    maxWords: number;
    timeMin: number;
    context: string;
    prompt: string;
  }>;
  speaking: Array<{
    type: 1 | 2 | 3;
    label: string;
    prepSeconds: number;
    recordSeconds: number;
    context: string;
    prompt: string;
    tips: string[];
  }>;
}

const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

function expectedLevelForId(id: number): Set<string> {
  if (id <= 10) return new Set(["A1", "A2"]);
  if (id <= 25) return new Set(["B1", "B2"]);
  return new Set(["C1", "C2"]);
}

function assertMcqSection(
  name: string,
  items: Array<{
    id: number;
    level: string;
    question: string;
    options: unknown;
    correctIndex: number;
  }>,
  errors: string[],
) {
  if (items.length !== 39) {
    errors.push(`${name}: expected 39 items, got ${items.length}`);
    return;
  }
  for (let i = 0; i < items.length; i++) {
    const q = items[i];
    const id = i + 1;
    if (q.id !== id) errors.push(`${name} Q${id}: id must be ${id}`);
    if (!LEVELS.has(q.level)) errors.push(`${name} Q${id}: invalid level ${q.level}`);
    const allowed = expectedLevelForId(id);
    if (!allowed.has(q.level)) {
      errors.push(`${name} Q${id}: level ${q.level} not in band ${[...allowed].join("/")}`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${name} Q${id}: need 4 options`);
    }
    if (![0, 1, 2, 3].includes(q.correctIndex)) {
      errors.push(`${name} Q${id}: correctIndex must be 0-3`);
    }
  }
}

const WRITING_LIMITS: Record<number, { register: string; min: number; max: number; time: number }> = {
  1: { register: "Informel", min: 60, max: 120, time: 15 },
  2: { register: "Semi-formel", min: 120, max: 150, time: 20 },
  3: { register: "Formel", min: 120, max: 180, time: 25 },
};

const SPEAKING_LIMITS: Record<number, { label: string; prep: number; record: number }> = {
  1: { label: "Entretien guidé", prep: 0, record: 120 },
  2: { label: "Jeu de rôle", prep: 120, record: 210 },
  3: { label: "Monologue d'opinion", prep: 180, record: 270 },
};

export function validateManifest(manifest: TcfPaperManifest): string[] {
  const errors: string[] = [];

  if (!manifest.paper || manifest.paper < 1) errors.push("paper must be >= 1");
  if (!manifest.theme?.trim()) errors.push("theme is required");

  assertMcqSection("listening", manifest.listening, errors);
  assertMcqSection("reading", manifest.reading, errors);

  if (manifest.writing.length !== 3) errors.push("writing: expected 3 tasks");
  manifest.writing.forEach((t, i) => {
    const spec = WRITING_LIMITS[t.type];
    if (!spec) errors.push(`writing task ${i + 1}: invalid type ${t.type}`);
    else if (t.type !== (i + 1) as 1 | 2 | 3) {
      errors.push(`writing task ${i + 1}: type should be ${i + 1}`);
    }
  });

  if (manifest.speaking.length !== 3) errors.push("speaking: expected 3 tasks");
  manifest.speaking.forEach((t, i) => {
    if (t.type !== (i + 1) as 1 | 2 | 3) {
      errors.push(`speaking task ${i + 1}: type should be ${i + 1}`);
    }
    if (!t.tips?.length || t.tips.length < 2) {
      errors.push(`speaking task ${i + 1}: need at least 2 tips`);
    }
  });

  return errors;
}
