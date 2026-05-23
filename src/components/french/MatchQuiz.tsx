"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2, Sparkles, RotateCcw } from "lucide-react";
import { speak } from "@/lib/french-tts";

export interface MatchPair {
  fr: string;
  en: string;
}

interface MatchQuizProps {
  title?: string;
  pairs: MatchPair[];
}

/**
 * Click-to-match quiz: shuffled French chips on the left, shuffled English
 * chips on the right. Tap one from each side — if they match, both light
 * green and lock; if not, both shake red for 600ms and clear. Game ends when
 * every pair is matched. The French chip also speaks itself when selected.
 */
export function MatchQuiz({ title, pairs }: MatchQuizProps) {
  const [frOrder, enOrder] = useMemo(() => {
    const fr = pairs.map((_, i) => i).sort(() => Math.random() - 0.5);
    const en = pairs.map((_, i) => i).sort(() => Math.random() - 0.5);
    return [fr, en];
  }, [pairs]);

  const [selectedFr, setSelectedFr] = useState<number | null>(null);
  const [selectedEn, setSelectedEn] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ fr: number; en: number } | null>(null);

  const allDone = matched.size === pairs.length;

  // When both sides selected, evaluate.
  useEffect(() => {
    if (selectedFr === null || selectedEn === null) return;
    if (selectedFr === selectedEn) {
      // Correct match
      setMatched((m) => new Set(m).add(selectedFr));
      setSelectedFr(null);
      setSelectedEn(null);
    } else {
      // Wrong — flash, then clear
      setWrongFlash({ fr: selectedFr, en: selectedEn });
      const t = setTimeout(() => {
        setSelectedFr(null);
        setSelectedEn(null);
        setWrongFlash(null);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [selectedFr, selectedEn]);

  const reset = () => {
    setSelectedFr(null);
    setSelectedEn(null);
    setMatched(new Set());
    setWrongFlash(null);
  };

  const handleFrClick = async (pairIdx: number) => {
    if (matched.has(pairIdx) || allDone) return;
    setSelectedFr(pairIdx);
    await speak(pairs[pairIdx].fr);
  };

  const handleEnClick = (pairIdx: number) => {
    if (matched.has(pairIdx) || allDone) return;
    setSelectedEn(pairIdx);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 18,
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={12} /> {title ?? "Match the pairs"}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
          {matched.size} / {pairs.length}
        </div>
      </div>

      {allDone ? (
        <div
          style={{
            padding: "24px 16px",
            textAlign: "center",
            background: "color-mix(in srgb, var(--success) 8%, transparent)",
            borderRadius: "var(--radius-md)",
            border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>
            Tout est correct! 🎉
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            All pairs matched.
          </div>
          <button
            onClick={reset}
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              fontSize: 12.5,
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={12} /> Play again
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            alignItems: "start",
          }}
        >
          {/* French column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {frOrder.map((idx) => (
              <Chip
                key={`fr-${idx}`}
                label={pairs[idx].fr}
                selected={selectedFr === idx}
                matched={matched.has(idx)}
                wrong={wrongFlash?.fr === idx}
                onClick={() => handleFrClick(idx)}
                side="fr"
              />
            ))}
          </div>
          {/* English column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {enOrder.map((idx) => (
              <Chip
                key={`en-${idx}`}
                label={pairs[idx].en}
                selected={selectedEn === idx}
                matched={matched.has(idx)}
                wrong={wrongFlash?.en === idx}
                onClick={() => handleEnClick(idx)}
                side="en"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  selected,
  matched,
  wrong,
  onClick,
  side,
}: {
  label: string;
  selected: boolean;
  matched: boolean;
  wrong: boolean;
  onClick: () => void;
  side: "fr" | "en";
}) {
  const bg = matched
    ? "color-mix(in srgb, var(--success) 12%, transparent)"
    : wrong
    ? "color-mix(in srgb, var(--danger) 12%, transparent)"
    : selected
    ? "var(--accent-light)"
    : "var(--bg-secondary)";
  const border = matched
    ? "var(--success)"
    : wrong
    ? "var(--danger)"
    : selected
    ? "var(--accent)"
    : "var(--border-subtle)";
  const color = matched
    ? "var(--success)"
    : wrong
    ? "var(--danger)"
    : "var(--text-primary)";

  return (
    <button
      onClick={onClick}
      disabled={matched}
      style={{
        padding: "10px 12px",
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: "var(--radius-md)",
        fontSize: 13.5,
        fontWeight: side === "fr" ? 600 : 500,
        color,
        cursor: matched ? "default" : "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {side === "fr" && <Volume2 size={11} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />}
      <span>{label}</span>
    </button>
  );
}
