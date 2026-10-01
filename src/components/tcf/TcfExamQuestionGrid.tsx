"use client";

import { useEffect, useRef } from "react";
import type { TCFLevel } from "@/lib/content/tcf-listening";

export const TCF_LEVEL_COLOR: Record<string, string> = {
  A1: "#22c55e",
  A2: "#84cc16",
  B1: "#3b82f6",
  B2: "#6366f1",
  C1: "#a855f7",
  C2: "#ec4899",
};

type QuestionMeta = { id: number; level: TCFLevel };

function levelSections(questions: QuestionMeta[]): { level: TCFLevel; indices: number[] }[] {
  const sections: { level: TCFLevel; indices: number[] }[] = [];
  for (let i = 0; i < questions.length; i++) {
    const level = questions[i]!.level;
    const last = sections[sections.length - 1];
    if (last && last.level === level) {
      last.indices.push(i);
    } else {
      sections.push({ level, indices: [i] });
    }
  }
  return sections;
}

export function TcfExamQuestionGrid({
  questions,
  currentIdx,
  answers,
  onSelect,
  accent,
}: {
  questions: QuestionMeta[];
  currentIdx: number;
  answers: (number | null)[];
  onSelect: (idx: number) => void;
  accent: string;
}) {
  const sections = levelSections(questions);
  const currentRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [currentIdx]);

  return (
    <nav
      aria-label="Navigation des questions"
      className="tcf-exam-panel"
      style={{
        borderRadius: 14,
        padding: "12px 14px 10px",
        marginBottom: 16,
        border: `1px solid ${accent}33`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          Questions 1–39 · jump to any
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          Current: <strong style={{ color: accent }}>{currentIdx + 1}</strong>
        </span>
      </div>

      <div style={{ maxHeight: 152, overflowY: "auto", paddingRight: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map((section) => {
            const levelColor = TCF_LEVEL_COLOR[section.level] ?? accent;
            return (
              <div key={`${section.level}-${section.indices[0]}`}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: levelColor,
                    marginBottom: 6,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {section.level}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {section.indices.map((qi) => {
                    const qNum = qi + 1;
                    const isCurrent = qi === currentIdx;
                    const answered = answers[qi] !== null;
                    return (
                      <button
                        key={qi}
                        ref={isCurrent ? currentRef : undefined}
                        type="button"
                        onClick={() => onSelect(qi)}
                        aria-current={isCurrent ? "step" : undefined}
                        aria-label={`Question ${qNum}, level ${questions[qi]?.level ?? section.level}`}
                        title={`Question ${qNum} · ${questions[qi]?.level ?? section.level}`}
                        style={{
                          minWidth: 34,
                          height: 34,
                          padding: "0 6px",
                          borderRadius: 8,
                          border: isCurrent
                            ? `2px solid ${accent}`
                            : answered
                              ? `1.5px solid ${levelColor}`
                              : "1px solid var(--border-subtle)",
                          background: isCurrent
                            ? `${accent}22`
                            : answered
                              ? `${levelColor}18`
                              : "var(--bg-overlay)",
                          color: isCurrent ? accent : answered ? levelColor : "var(--text-secondary)",
                          fontSize: 12,
                          fontWeight: isCurrent ? 800 : 600,
                          fontFamily: "var(--font-mono)",
                          cursor: "pointer",
                        }}
                      >
                        {qNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
