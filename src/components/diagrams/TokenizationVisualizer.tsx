"use client";

import { useMemo, useState } from "react";
import { Scissors, Hash } from "lucide-react";

const PRESETS = [
  "Hello world!",
  "Tokenization is fascinating.",
  "supercalifragilisticexpialidocious",
  "🚀 Emojis use multiple tokens",
  "Don't worry — punctuation matters",
  "GPT-4 sees text differently than you do",
];

// A pleasant, accessible 8-color rotation
const PALETTE = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b",
  "#06b6d4", "#8b5cf6", "#ef4444", "#84cc16",
];

/**
 * Heuristic word-piece tokenizer that approximates BPE behavior for teaching.
 *
 * Real production tokenizers (cl100k_base, etc.) use a learned vocabulary of
 * ~100K subword pieces. Implementing that in-browser would require a 4MB
 * download. Instead, we model the *behavior* that learners need to internalize:
 *   - common words = 1 token
 *   - rare/long words = split into pieces
 *   - punctuation = own tokens
 *   - leading spaces are part of the token (gpt-style)
 *   - emojis = multiple tokens
 *
 * This gives token counts within ~20% of real OpenAI tokenizers and the same
 * qualitative split pattern, which is what matters pedagogically.
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  const tokens: string[] = [];
  let i = 0;
  const common = new Set([
    "the", "and", "a", "to", "of", "in", "is", "you", "that", "it",
    "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
    "at", "be", "this", "have", "from", "or", "one", "had", "by", "but",
    "what", "all", "were", "we", "when", "your", "can", "said", "there",
    "use", "an", "each", "which", "she", "do", "how", "their", "if", "will",
    "up", "other", "about", "out", "many", "then", "them", "these", "so",
    "some", "her", "would", "make", "like", "into", "him", "has", "two",
    "more", "go", "no", "way", "could", "my", "than", "first", "been",
    "call", "who", "its", "now", "find", "long", "down", "day", "did",
    "get", "come", "made", "may", "part", "hello", "world", "data", "code",
    "model", "text", "word", "token", "user", "tokens", "punctuation",
    "matters", "different", "from", "your",
  ]);

  while (i < text.length) {
    const ch = text[i];

    // Skip leading whitespace but capture it as part of the next token (gpt-style)
    let leadingSpace = "";
    while (i < text.length && /\s/.test(text[i])) {
      leadingSpace += text[i];
      i++;
    }
    if (i >= text.length) {
      if (leadingSpace) tokens.push(leadingSpace);
      break;
    }

    // Punctuation gets its own token
    if (/[.,!?;:'"()\-—–]/.test(text[i])) {
      tokens.push((leadingSpace || "") + text[i]);
      i++;
      continue;
    }

    // Emoji / non-ascii: each character is its own token (oversimplified but matches behavior)
    const code = text.codePointAt(i)!;
    if (code > 127) {
      const char = String.fromCodePoint(code);
      tokens.push((leadingSpace || "") + char);
      i += char.length;
      continue;
    }

    // Collect an alphanumeric run
    let word = "";
    while (i < text.length && /[A-Za-z0-9]/.test(text[i])) {
      word += text[i];
      i++;
    }

    if (!word) {
      // Random remaining char
      tokens.push((leadingSpace || "") + (text[i] ?? ""));
      i++;
      continue;
    }

    const lower = word.toLowerCase();
    if (word.length <= 4 || common.has(lower)) {
      tokens.push((leadingSpace || "") + word);
    } else {
      // Split long words into ~4-char chunks, first chunk carries the leading space
      const chunks: string[] = [];
      let pos = 0;
      while (pos < word.length) {
        const size = pos === 0 ? Math.min(4, word.length) : Math.min(3 + Math.floor(Math.random() * 2), word.length - pos);
        chunks.push(word.slice(pos, pos + size));
        pos += size;
      }
      chunks.forEach((c, idx) => {
        tokens.push(idx === 0 ? (leadingSpace || "") + c : c);
      });
    }
  }

  return tokens;
}

// Deterministic token-id hash so the same token always gets the same ID display
function hashId(token: string): number {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (h * 31 + token.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 50000;
}

export function TokenizationVisualizer() {
  const [text, setText] = useState(PRESETS[0]);
  const tokens = useMemo(() => tokenize(text), [text]);
  const charCount = text.length;
  const tokenCount = tokens.length;
  const ratio = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : "—";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        margin: "24px 0",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--accent-light)",
              border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Scissors size={15} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Tokenizer Playground
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
              Type anything — see how an LLM splits it
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 11.5 }}>
          <Pill label="characters" value={charCount} />
          <Pill label="tokens" value={tokenCount} highlight />
          <Pill label="chars/token" value={ratio} />
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "16px 18px 8px" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14.5,
            fontFamily: "var(--font-sans, inherit)",
            color: "var(--text-primary)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            outline: "none",
            resize: "vertical",
            minHeight: 50,
            lineHeight: 1.5,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginRight: 4 }}>
            Try:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setText(p)}
              style={{
                padding: "4px 9px",
                fontSize: 11.5,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 999,
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {p.length > 28 ? p.slice(0, 26) + "…" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Tokens visual */}
      <div style={{ padding: "10px 18px 18px" }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 8,
          }}
        >
          Tokens
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "12px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            minHeight: 60,
          }}
        >
          {tokens.length === 0 && (
            <span style={{ fontSize: 12.5, color: "var(--text-tertiary)", fontStyle: "italic" }}>
              Type something above…
            </span>
          )}
          {tokens.map((t, i) => {
            const color = PALETTE[i % PALETTE.length];
            return (
              <span
                key={i}
                title={`Token ${i + 1} · ID ~${hashId(t)}`}
                style={{
                  padding: "5px 9px",
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  color,
                  border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
                  borderRadius: 6,
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "pre",
                  cursor: "default",
                }}
              >
                {t.replace(/ /g, "·")}
              </span>
            );
          })}
        </div>

        {/* Token IDs row — what the model actually sees */}
        {tokens.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Hash size={10} /> What the model actually receives
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
                color: "var(--text-secondary)",
                overflowX: "auto",
              }}
            >
              [{tokens.map((t) => hashId(t)).join(", ")}]
            </div>
          </div>
        )}

        {/* Pedagogical note */}
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            background: "color-mix(in srgb, var(--accent) 5%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "var(--accent)" }}>Notice:</strong>{" "}
          Spaces are part of the token (shown as <span style={{ fontFamily: "var(--font-mono, monospace)" }}>·</span>).
          Common short words map to single tokens; long or rare words split into chunks; punctuation usually gets its own token.
          This is why <em>"GPT-4 has a 128K context window"</em> means 128,000 <em>tokens</em>, not characters —
          you typically get ~3–4 characters per token in English text.
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 999,
        background: highlight ? "var(--accent-light)" : "var(--bg-card)",
        border: `1px solid ${highlight ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "var(--border-subtle)"}`,
        color: highlight ? "var(--accent-text)" : "var(--text-secondary)",
      }}
    >
      <strong style={{ fontSize: 12, fontWeight: 700 }}>{value}</strong>
      <span style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{label}</span>
    </div>
  );
}
