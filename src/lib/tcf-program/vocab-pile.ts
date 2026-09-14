/** Client-side “session pile” of flashcard keys (guest + authed). */

const STORAGE_KEY = "ailearn-tcf-vocab-pile";

export function readVocabPile(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === "string") : [];
  } catch {
    return [];
  }
}

export function writeVocabPile(keys: string[]) {
  if (typeof window === "undefined") return;
  const unique = [...new Set(keys)].slice(0, 80);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
}

export function addToVocabPile(cardKeys: string[]) {
  const merged = [...readVocabPile(), ...cardKeys];
  writeVocabPile(merged);
}

export function clearVocabPile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
