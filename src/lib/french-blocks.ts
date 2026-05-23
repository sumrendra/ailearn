/**
 * Parsers for French lesson interactive blocks.
 *
 * Lesson markdown convention — each interactive component has its own
 * fenced block whose body is line-oriented data. Examples:
 *
 *   ```french-vocab
 *   bonjour | hello | bohn-zhoor
 *   au revoir | goodbye | oh ruh-vwar
 *   ```
 *
 *   ```french-sentence
 *   prompt: I would like a coffee, please.
 *   answer: Je voudrais un café, s'il vous plaît.
 *   distractors: bonjour | merci
 *   hint: "I would like" = "Je voudrais"
 *   ```
 *
 *   ```french-dialogue
 *   title: At the café
 *   scene: Ordering breakfast in Paris
 *   --
 *   Server | Bonjour! Qu'est-ce que vous voulez? | Hello! What would you like?
 *   You    | Un café et un croissant, s'il vous plaît. | A coffee and a croissant, please.
 *   ```
 *
 *   ```french-match
 *   title: Greetings
 *   bonjour | hello
 *   bonsoir | good evening
 *   ```
 *
 *   ```french-grammar
 *   title: The verb être (to be)
 *   note: Use this for permanent qualities — nationality, profession, traits.
 *   headers: Singular | Plural
 *   --
 *   1st | je suis | nous sommes
 *   2nd | tu es | vous êtes
 *   3rd | il/elle est | ils/elles sont
 *   ```
 *
 * All parsers return a typed object suitable for direct prop spread.
 */

export interface FrenchVocabItem {
  fr: string;
  en: string;
  pronunciation?: string;
}

export function parseFrenchVocab(raw: string): FrenchVocabItem[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      return { fr: parts[0], en: parts[1] ?? "", pronunciation: parts[2] };
    })
    .filter((v) => v.fr && v.en);
}

export interface FrenchSentenceData {
  prompt: string;
  answer: string;
  distractors: string[];
  hint?: string;
}

export function parseFrenchSentence(raw: string): FrenchSentenceData | null {
  const out: Partial<FrenchSentenceData> = { distractors: [] };
  for (const line of raw.split("\n")) {
    const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    if (key === "prompt") out.prompt = value.trim();
    else if (key === "answer") out.answer = value.trim();
    else if (key === "distractors")
      out.distractors = value.split("|").map((s) => s.trim()).filter(Boolean);
    else if (key === "hint") out.hint = value.trim();
  }
  if (!out.prompt || !out.answer) return null;
  return out as FrenchSentenceData;
}

export interface FrenchDialogueLine {
  speaker: string;
  fr: string;
  en: string;
}

export interface FrenchDialogueData {
  title?: string;
  scene?: string;
  lines: FrenchDialogueLine[];
}

export function parseFrenchDialogue(raw: string): FrenchDialogueData {
  const out: FrenchDialogueData = { lines: [] };
  const sections = raw.split(/^\s*--\s*$/m);
  // First section: meta (key: value lines)
  if (sections.length >= 2) {
    for (const line of sections[0].split("\n")) {
      const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
      if (!m) continue;
      const [, key, value] = m;
      if (key === "title") out.title = value.trim();
      else if (key === "scene") out.scene = value.trim();
    }
  }
  // Subsequent: dialogue lines (speaker | fr | en)
  const body = sections.length >= 2 ? sections.slice(1).join("\n") : sections[0];
  for (const line of body.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      out.lines.push({ speaker: parts[0], fr: parts[1], en: parts[2] });
    }
  }
  return out;
}

export interface FrenchMatchData {
  title?: string;
  pairs: { fr: string; en: string }[];
}

export function parseFrenchMatch(raw: string): FrenchMatchData {
  const out: FrenchMatchData = { pairs: [] };
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const titleMatch = /^title\s*:\s*(.*)$/i.exec(trimmed);
    if (titleMatch) {
      out.title = titleMatch[1].trim();
      continue;
    }
    const parts = trimmed.split("|").map((s) => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      out.pairs.push({ fr: parts[0], en: parts[1] });
    }
  }
  return out;
}

export interface FrenchGrammarData {
  title: string;
  note?: string;
  headers: string[];
  rows: { label: string; forms: string[] }[];
}

export function parseFrenchGrammar(raw: string): FrenchGrammarData | null {
  const out: Partial<FrenchGrammarData> = { rows: [], headers: [] };
  const sections = raw.split(/^\s*--\s*$/m);
  const metaLines = sections[0]?.split("\n") ?? [];
  for (const line of metaLines) {
    const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    if (key === "title") out.title = value.trim();
    else if (key === "note") out.note = value.trim();
    else if (key === "headers")
      out.headers = value.split("|").map((s) => s.trim()).filter(Boolean);
  }
  const body = sections.length >= 2 ? sections.slice(1).join("\n") : "";
  for (const line of body.split("\n")) {
    if (!line.trim()) continue;
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length >= 2 && parts[0]) {
      out.rows!.push({ label: parts[0], forms: parts.slice(1) });
    }
  }
  if (!out.title || !out.headers?.length) return null;
  return out as FrenchGrammarData;
}
