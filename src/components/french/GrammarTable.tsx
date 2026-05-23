"use client";

import { useState } from "react";
import { Volume2, Eye, EyeOff } from "lucide-react";
import { speak } from "@/lib/french-tts";

interface GrammarTableProps {
  title: string;
  /** Optional grammatical note shown above the table */
  note?: string;
  /** Column headers — typically pronouns or persons */
  headers: string[];
  /** Each row: [label, ...forms]. Forms align to headers. */
  rows: Array<{ label: string; forms: string[] }>;
}

/**
 * Conjugation / declension table with click-to-hear cells.
 *
 * Designed for things like verb conjugation (être, avoir), pronoun tables,
 * article+noun pairings. Click any French form to hear it pronounced. A
 * "self-test" mode hides the forms behind a tap so you can practice recall.
 */
export function GrammarTable({ title, note, headers, rows }: GrammarTableProps) {
  const [selfTest, setSelfTest] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const cellKey = (r: number, c: number) => `${r}:${c}`;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 18,
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {title}
        </div>
        <button
          onClick={() => {
            setSelfTest((s) => !s);
            setRevealed(new Set());
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            fontSize: 11,
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          {selfTest ? <EyeOff size={11} /> : <Eye size={11} />}
          {selfTest ? "Self-test" : "Show forms"}
        </button>
      </div>

      {note && (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--text-secondary)",
            marginBottom: 12,
            lineHeight: 1.55,
          }}
        >
          {note}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            <th style={th} />
            {headers.map((h) => (
              <th key={h} style={{ ...th, color: "var(--text-tertiary)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <th
                style={{
                  ...th,
                  textAlign: "left",
                  color: "var(--text-tertiary)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {row.label}
              </th>
              {row.forms.map((form, ci) => {
                const key = cellKey(ri, ci);
                const isHidden = selfTest && !revealed.has(key);
                return (
                  <td
                    key={ci}
                    onClick={async () => {
                      if (isHidden) {
                        setRevealed((s) => new Set(s).add(key));
                      } else {
                        await speak(form);
                      }
                    }}
                    style={{
                      ...td,
                      cursor: "pointer",
                      fontWeight: 500,
                      color: isHidden ? "transparent" : "var(--text-primary)",
                      background: isHidden ? "var(--bg-tertiary)" : "transparent",
                      borderRadius: 6,
                      transition: "background 0.15s",
                    }}
                  >
                    {!isHidden && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        {form}
                        <Volume2 size={10} color="var(--text-tertiary)" />
                      </span>
                    )}
                    {isHidden && <span style={{ visibility: "hidden" }}>{form}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--border-subtle)",
};

const td: React.CSSProperties = {
  padding: "10px",
  textAlign: "center",
  borderBottom: "1px solid var(--border-subtle)",
};
