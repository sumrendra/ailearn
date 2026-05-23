"use client";

import { useState } from "react";
import { Volume2, Eye, EyeOff } from "lucide-react";
import { speak } from "@/lib/french-tts";

export interface VocabItem {
  fr: string;
  en: string;
  /** Optional IPA or French phonetic guide */
  pronunciation?: string;
  /** Optional example sentence */
  example?: { fr: string; en: string };
}

interface VocabListProps {
  items: VocabItem[];
  /** Show English by default (false to hide for self-test) */
  showEnglish?: boolean;
  title?: string;
}

/**
 * Grid of clickable French vocabulary cards. Each card:
 * - speaks the French word on click (browser TTS)
 * - shows the English translation (optionally hidden for self-test)
 * - optionally shows pronunciation guide and example sentence
 *
 * No audio file needed. Works fully offline once the page loads.
 */
export function VocabList({ items, showEnglish = true, title }: VocabListProps) {
  const [revealed, setRevealed] = useState<boolean>(showEnglish);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 18px 14px",
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
          <Volume2 size={12} /> {title ?? "Vocabulary — click to hear"}
        </div>
        <button
          onClick={() => setRevealed((r) => !r)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 9px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            fontSize: 11,
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          {revealed ? <EyeOff size={11} /> : <Eye size={11} />}
          {revealed ? "Hide English" : "Show English"}
        </button>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        {items.map((item, i) => (
          <VocabCard key={i} item={item} showEnglish={revealed} />
        ))}
      </div>
    </div>
  );
}

function VocabCard({ item, showEnglish }: { item: VocabItem; showEnglish: boolean }) {
  const [playing, setPlaying] = useState(false);

  const handleSpeak = async () => {
    setPlaying(true);
    try {
      await speak(item.fr);
    } finally {
      setTimeout(() => setPlaying(false), 600);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      title="Click to hear"
      style={{
        textAlign: "left",
        background: playing ? "var(--accent-light)" : "var(--bg-secondary)",
        border: `1px solid ${playing ? "var(--accent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.005em",
          }}
        >
          {item.fr}
        </span>
        <Volume2
          size={14}
          color={playing ? "var(--accent)" : "var(--text-tertiary)"}
          style={{ flexShrink: 0 }}
        />
      </div>
      {item.pronunciation && (
        <span
          style={{
            fontSize: 11.5,
            color: "var(--text-tertiary)",
            fontStyle: "italic",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {item.pronunciation}
        </span>
      )}
      {showEnglish && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {item.en}
        </span>
      )}
      {item.example && showEnglish && (
        <div
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTop: "1px dashed var(--border-subtle)",
            fontSize: 11.5,
            color: "var(--text-tertiary)",
            lineHeight: 1.5,
          }}
        >
          <em>{item.example.fr}</em>
          <br />
          {item.example.en}
        </div>
      )}
    </button>
  );
}
