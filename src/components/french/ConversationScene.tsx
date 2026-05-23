"use client";

import { useState } from "react";
import { Volume2, Play, MessageCircle } from "lucide-react";
import { speak } from "@/lib/french-tts";

export interface DialogueLine {
  speaker: string;
  fr: string;
  en: string;
}

interface ConversationSceneProps {
  title?: string;
  /** Brief context for the scene (e.g. "At a café in Paris") */
  scene?: string;
  lines: DialogueLine[];
}

/**
 * A chat-bubble style French dialogue. Click any bubble to hear it spoken.
 * Hit "Play all" to walk through the whole conversation one line at a time.
 *
 * The two speakers are color-coded automatically so the visual flow reads
 * like a messaging app.
 */
export function ConversationScene({ title, scene, lines }: ConversationSceneProps) {
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);

  // Map each unique speaker name to a side (left/right) for visual alternation.
  const speakerOrder = Array.from(new Set(lines.map((l) => l.speaker)));
  const speakerSide = new Map(speakerOrder.map((s, i) => [s, i % 2 === 0 ? "left" : "right"]));

  const playOne = async (idx: number) => {
    setActiveLineIdx(idx);
    await speak(lines[idx].fr);
    setTimeout(() => setActiveLineIdx(null), 250);
  };

  const playAll = async () => {
    setPlayingAll(true);
    for (let i = 0; i < lines.length; i++) {
      setActiveLineIdx(i);
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(lines[i].fr);
        utterance.lang = "fr-FR";
        utterance.rate = 0.9;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        // Use the helper to also pick a French voice if available
        speak(lines[i].fr);
        // approximate completion by line length
        setTimeout(resolve, Math.max(900, lines[i].fr.length * 70));
      });
    }
    setActiveLineIdx(null);
    setPlayingAll(false);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--accent-light)",
              border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MessageCircle size={15} color="var(--accent)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              {title ?? "Dialogue"}
            </div>
            {scene && (
              <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 1 }}>
                {scene}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={playAll}
          disabled={playingAll}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: playingAll ? "var(--bg-tertiary)" : "var(--accent)",
            color: playingAll ? "var(--text-tertiary)" : "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: playingAll ? "default" : "pointer",
          }}
        >
          <Play size={12} fill="currentColor" />
          {playingAll ? "Playing…" : "Play all"}
        </button>
      </div>

      {/* Lines */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {lines.map((line, i) => {
          const side = speakerSide.get(line.speaker);
          const isLeft = side === "left";
          const isActive = activeLineIdx === i;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: isLeft ? "row" : "row-reverse",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: isLeft ? "var(--accent-light)" : "color-mix(in srgb, var(--info) 12%, transparent)",
                  border: `1px solid ${isLeft ? "color-mix(in srgb, var(--accent) 20%, transparent)" : "color-mix(in srgb, var(--info) 25%, transparent)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: isLeft ? "var(--accent-text)" : "var(--info)",
                  flexShrink: 0,
                }}
              >
                {line.speaker.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => playOne(i)}
                style={{
                  maxWidth: "80%",
                  textAlign: "left",
                  background: isLeft
                    ? isActive
                      ? "var(--accent-light)"
                      : "var(--bg-secondary)"
                    : isActive
                    ? "color-mix(in srgb, var(--info) 12%, transparent)"
                    : "var(--bg-secondary)",
                  border: `1px solid ${
                    isActive
                      ? isLeft
                        ? "var(--accent)"
                        : "var(--info)"
                      : "var(--border-subtle)"
                  }`,
                  borderRadius: isLeft
                    ? "var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)"
                    : "var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)",
                  padding: "10px 14px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                    {line.speaker}
                  </span>
                  <Volume2 size={11} color={isActive ? "var(--accent)" : "var(--text-tertiary)"} />
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.45 }}>
                  {line.fr}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 3, lineHeight: 1.45 }}>
                  {line.en}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
