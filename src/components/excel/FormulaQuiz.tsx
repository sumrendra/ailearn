"use client";

import { useState } from "react";
import { CheckCircle2, X, Sparkles, RotateCcw } from "lucide-react";

interface FormulaQuizProps {
  question: string;
  /** Optional data table shown above the question for reference */
  dataTable?: { headers: string[]; rows: (string | number)[][] };
  options: string[];
  /** 0-indexed correct answer */
  correct: number;
  explanation?: string;
}

/**
 * Multiple-choice quiz card for formula comprehension.
 * Used to test "what does this return given this data?" — the kind of
 * question Excel interviewers love to ask.
 */
export function FormulaQuiz({ question, dataTable, options, correct, explanation }: FormulaQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === correct;
  const isWrong = submitted && selected !== correct;

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
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#047857",
          marginBottom: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Sparkles size={11} /> Quick check
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 14,
          lineHeight: 1.55,
        }}
      >
        {question}
      </div>

      {dataTable && (
        <div style={{ overflowX: "auto", marginBottom: 14 }}>
          <table
            style={{
              borderCollapse: "collapse",
              fontSize: 11.5,
              fontFamily: "var(--font-mono, monospace)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <thead>
              <tr>
                {dataTable.headers.map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "4px 10px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      fontWeight: 700,
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTable.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{ padding: "4px 10px", border: "1px solid var(--border-subtle)" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  ? "var(--accent-light)"
                  : "var(--bg-secondary)",
                border: `1.5px solid ${
                  isThisCorrect
                    ? "var(--success)"
                    : isThisWrong
                    ? "var(--danger)"
                    : selected === i
                    ? "var(--accent)"
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
                    ? "var(--accent)"
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
              background: selected === null ? "var(--bg-tertiary)" : "var(--accent)",
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
            Correct!
          </span>
        )}
        {isWrong && (
          <span style={{ color: "var(--danger)", fontSize: 13, fontWeight: 600 }}>
            Not quite — see explanation below
          </span>
        )}
      </div>

      {submitted && explanation && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "color-mix(in srgb, var(--accent) 5%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: "var(--accent)" }}>Why:</strong> {explanation}
        </div>
      )}
    </div>
  );
}
