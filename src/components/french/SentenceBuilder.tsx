"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Volume2, Lightbulb } from "lucide-react";
import { speak } from "@/lib/french-tts";

interface SentenceBuilderProps {
  /** The English prompt the learner is translating */
  prompt: string;
  /** The correct French sentence (words separated by spaces) */
  answer: string;
  /** Optional extra "distractor" words to make it less obvious */
  distractors?: string[];
  /** Optional grammar hint shown on first wrong attempt */
  hint?: string;
}

/**
 * Tap-to-build French sentence exercise. The learner gets a scrambled word
 * bank (correct words + a few distractors), constructs a sentence one tap
 * at a time, then hits Check. Wrong attempts highlight in red and surface a
 * hint; correct ones speak the sentence aloud and celebrate.
 *
 * Pure client; no backend.
 */
export function SentenceBuilder({ prompt, answer, distractors = [], hint }: SentenceBuilderProps) {
  // Build the shuffled word pool ONCE, on mount. We can't use useMemo here
  // because the parent (lesson markdown rendering) creates a fresh
  // `distractors` array on every re-render — useMemo would invalidate, the
  // pool would reshuffle, and any indexes the user had selected would now
  // point at different words. useState lazy initializer runs exactly once.
  //
  // `pool` is the SHUFFLED word bank. The user's selection — and every other
  // pool lookup — uses the array index into this shuffled array. Earlier
  // versions tried to store a stable "id" (original pre-shuffle position) and
  // then did `pool[id]` to look up the word — which is wrong, because after
  // shuffle the array index and the id don't agree. That caused "I click 'le'
  // and 'avec' shows up in the answer box" — the textbook symptom. Using the
  // shuffled array index throughout is both simpler and correct.
  const [pool] = useState<string[]>(() => {
    const answerTokens = answer.split(/\s+/).filter(Boolean);
    const all = [...answerTokens, ...distractors];
    return all
      .map((w) => ({ word: w, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.word);
  });

  /** Indices into `pool` (the shuffled word bank) that the user has tapped. */
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [revealHint, setRevealHint] = useState(false);

  const usedSet = new Set(selected);
  const built = selected.map((i) => pool[i]).join(" ");

  const check = async () => {
    const normalize = (s: string) => s.replace(/[.,!?;:]/g, "").trim().toLowerCase();
    const ok = normalize(built) === normalize(answer);
    setResult(ok ? "correct" : "wrong");
    if (ok) {
      await speak(answer);
    } else if (hint) {
      setRevealHint(true);
    }
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${
          result === "correct"
            ? "var(--success)"
            : result === "wrong"
            ? "var(--danger)"
            : "var(--border-subtle)"
        }`,
        borderRadius: "var(--radius-lg)",
        padding: 18,
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s",
      }}
    >
      {/* Prompt */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        Translate to French
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        “{prompt}”
      </div>

      {/* Builder area */}
      <div
        style={{
          minHeight: 56,
          padding: "12px 14px",
          background: "var(--bg-secondary)",
          border: "1.5px dashed var(--border-default)",
          borderRadius: "var(--radius-md)",
          marginBottom: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "center",
        }}
      >
        {selected.length === 0 && (
          <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontStyle: "italic" }}>
            Tap words below to build your sentence…
          </span>
        )}
        {selected.map((poolIdx, i) => (
          <button
            key={i}
            onClick={() => setSelected((s) => s.filter((_, idx) => idx !== i))}
            disabled={result === "correct"}
            style={{
              padding: "6px 12px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-primary)",
              cursor: result === "correct" ? "default" : "pointer",
            }}
          >
            {pool[poolIdx]}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {pool.map((word, idx) =>
          usedSet.has(idx) ? null : (
            <button
              key={idx}
              onClick={() => {
                setSelected((s) => [...s, idx]);
                setResult(null);
              }}
              disabled={result === "correct"}
              style={{
                padding: "8px 13px",
                background: "var(--accent-light)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--accent-text)",
                cursor: result === "correct" ? "default" : "pointer",
              }}
            >
              {word}
            </button>
          ),
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={check}
          disabled={selected.length === 0 || result === "correct"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: selected.length === 0 ? "var(--bg-tertiary)" : "var(--accent)",
            color: selected.length === 0 ? "var(--text-tertiary)" : "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 600,
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          <Check size={14} /> Check
        </button>
        <button
          onClick={reset}
          disabled={selected.length === 0}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>

        {result === "correct" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: "auto", color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
            <Check size={14} /> Parfait! <Volume2 size={13} />
          </span>
        )}
        {result === "wrong" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: "auto", color: "var(--danger)", fontSize: 13, fontWeight: 600 }}>
            <X size={14} /> Not quite — try again
          </span>
        )}
      </div>

      {revealHint && hint && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "color-mix(in srgb, var(--accent) 6%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--text-secondary)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Lightbulb size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}
