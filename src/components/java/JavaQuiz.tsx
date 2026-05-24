"use client";

import { useState } from "react";
import { CheckCircle2, X, Coffee, RotateCcw, Brain } from "lucide-react";

interface JavaQuizProps {
  question: string;
  /** Optional code snippet shown above the question */
  code?: string;
  options: string[];
  correct: number;
  explanation?: string;
  /** Optional "difficulty" tag: "easy" | "medium" | "tricky" */
  level?: "easy" | "medium" | "tricky";
}

/**
 * "What does this print?" / "What's the time complexity?" / "Why does this
 * compile but throw?" style quiz card for Java interview prep. Looks slightly
 * different from FormulaQuiz (Java-themed coffee accent, optional code block)
 * so each course has its own visual identity.
 */
export function JavaQuiz({ question, code, options, correct, explanation, level = "medium" }: JavaQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === correct;
  const isWrong = submitted && selected !== correct;

  const levelColor =
    level === "tricky" ? "var(--danger)" : level === "easy" ? "var(--success)" : "var(--warning)";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${
          isCorrect ? "var(--success)" : isWrong ? "var(--danger)" : "var(--border-subtle)"
        }`,
        borderRadius: "var(--radius-lg)",
        padding: 18,
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ea580c",
          }}
        >
          <Coffee size={11} /> Interview check
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 7px",
            background: `color-mix(in srgb, ${levelColor} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${levelColor} 30%, transparent)`,
            borderRadius: 999,
            fontSize: 9.5,
            fontWeight: 700,
            color: levelColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {level === "tricky" && <Brain size={9} />}
          {level}
        </span>
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: code ? 10 : 14,
          lineHeight: 1.55,
        }}
      >
        {question}
      </div>

      {code && (
        <pre
          style={{
            margin: "0 0 14px",
            padding: "12px 14px",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 12.5,
            color: "var(--text-primary)",
            overflowX: "auto",
            lineHeight: 1.55,
          }}
        >
          {code}
        </pre>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {options.map((opt, i) => {
          const isThisCorrect = submitted && i === correct;
          const isThisWrong = submitted && selected === i && i !== correct;
          return (
            <button
              key={i}
              onClick={() => {
                if (submitted) return;
                setSelected(i);
              }}
              disabled={submitted && !isThisCorrect && !isThisWrong}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: isThisCorrect
                  ? "color-mix(in srgb, var(--success) 10%, transparent)"
                  : isThisWrong
                  ? "color-mix(in srgb, var(--danger) 10%, transparent)"
                  : selected === i
                  ? "color-mix(in srgb, #ea580c 10%, transparent)"
                  : "var(--bg-secondary)",
                border: `1.5px solid ${
                  isThisCorrect
                    ? "var(--success)"
                    : isThisWrong
                    ? "var(--danger)"
                    : selected === i
                    ? "#ea580c"
                    : "var(--border-subtle)"
                }`,
                borderRadius: "var(--radius-md)",
                cursor: submitted ? "default" : "pointer",
                fontSize: 13,
                fontFamily: "var(--font-mono, monospace)",
                color: "var(--text-primary)",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: isThisCorrect
                    ? "var(--success)"
                    : isThisWrong
                    ? "var(--danger)"
                    : selected === i
                    ? "#ea580c"
                    : "var(--bg-tertiary)",
                  color: isThisCorrect || isThisWrong || selected === i ? "#fff" : "var(--text-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  fontFamily: "var(--font-sans, inherit)",
                }}
              >
                {isThisCorrect ? <CheckCircle2 size={13} /> : isThisWrong ? <X size={13} /> : String.fromCharCode(65 + i)}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={selected === null}
            style={{
              padding: "8px 16px",
              background: selected === null ? "var(--bg-tertiary)" : "#ea580c",
              color: selected === null ? "var(--text-tertiary)" : "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 600,
              cursor: selected === null ? "not-allowed" : "pointer",
            }}
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 14px",
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={12} /> Try again
          </button>
        )}
        {isCorrect && (
          <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
            Correct
          </span>
        )}
        {isWrong && (
          <span style={{ color: "var(--danger)", fontSize: 13, fontWeight: 600 }}>
            See explanation below
          </span>
        )}
      </div>

      {submitted && explanation && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "color-mix(in srgb, #ea580c 5%, transparent)",
            border: "1px solid color-mix(in srgb, #ea580c 18%, transparent)",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#ea580c" }}>Why:</strong> {explanation}
        </div>
      )}
    </div>
  );
}
