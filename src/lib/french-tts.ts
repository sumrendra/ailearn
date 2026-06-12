/**
 * Browser-native French text-to-speech helper.
 *
 * Uses the SpeechSynthesis Web API — supported in all modern browsers, no
 * server, no API key, no network call. Voice quality varies by OS:
 *   - macOS: "Amélie", "Thomas" (very natural)
 *   - Windows: "Microsoft Hortense" / "Microsoft Julie" (good)
 *   - Linux: usually espeak (mechanical but understandable)
 *
 * We cache the chosen voice once it's available — voices load asynchronously
 * on first use.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady: Promise<void> | null = null;

function ensureVoicesLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!voicesReady) {
    voicesReady = new Promise<void>((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }
      const handler = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        resolve();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      // Safety net — some browsers never fire the event
      setTimeout(resolve, 1500);
    });
  }
  return voicesReady;
}

async function pickFrenchVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedVoice) return cachedVoice;
  await ensureVoicesLoaded();
  const voices = window.speechSynthesis.getVoices();

  // Preference order: native French speakers first, then any fr-* locale.
  const preferred = [
    /Amélie|Amelie|Thomas|Audrey/i, // macOS premium
    /Hortense|Julie/i, // Windows
    /Marie|Virginie/i, // other vendors
  ];
  for (const pattern of preferred) {
    const match = voices.find((v) => pattern.test(v.name) && v.lang.startsWith("fr"));
    if (match) {
      cachedVoice = match;
      return match;
    }
  }
  // Fall back to any French-locale voice.
  const anyFrench = voices.find((v) => v.lang.startsWith("fr"));
  if (anyFrench) {
    cachedVoice = anyFrench;
    return anyFrench;
  }
  return null;
}

export async function speak(text: string, rate: number = 0.9): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Cancel any in-flight utterance so rapid clicks feel snappy.
  window.speechSynthesis.cancel();
  const voice = await pickFrenchVoice();
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) utterance.voice = voice;
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

/** True if any fr-* voice is available right now. */
export async function isFrenchTtsAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return (await pickFrenchVoice()) !== null;
}

/**
 * Creates a configured French utterance without speaking it.
 * Lets callers attach their own onend/onerror handlers before speaking.
 * Returns null if TTS is unavailable.
 */
export async function createFrenchUtterance(
  text: string,
  rate = 0.9,
): Promise<SpeechSynthesisUtterance | null> {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voice = await pickFrenchVoice();
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) utterance.voice = voice;
  utterance.lang = "fr-FR";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  return utterance;
}
