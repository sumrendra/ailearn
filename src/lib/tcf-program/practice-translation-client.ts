import { TCF_PRACTICE_TRANSLATIONS_EN } from "@/lib/content/tcf-practice-translations.generated";

const SESSION_PREFIX = "tcf-practice-en:";

export function getBundledPracticeTranslation(key: string): string | undefined {
  const v = TCF_PRACTICE_TRANSLATIONS_EN[key];
  return v && v.trim().length > 0 ? v : undefined;
}

export function readSessionPracticeTranslation(key: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const v = sessionStorage.getItem(SESSION_PREFIX + key);
    return v && v.trim().length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

export function writeSessionPracticeTranslation(key: string, english: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_PREFIX + key, english);
  } catch {
    /* ignore quota */
  }
}

export async function fetchPracticeTranslation(params: {
  key: string;
  text: string;
  skill: "listening" | "reading";
}): Promise<string> {
  const bundled = getBundledPracticeTranslation(params.key);
  if (bundled) return bundled;

  const res = await fetch("/api/tcf/practice-translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: params.key,
      text: params.text,
      skill: params.skill,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { english?: string; error?: string };
  if (!res.ok || !data.english) {
    throw new Error(data.error ?? "Translation unavailable");
  }
  return data.english;
}
