"use client";

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

  return (
    <nav
      aria-label="Navigation des questions"
      className="glass-pane"
      style={{
        borderRadius: 14,
        padding: "14px 16px 12px",
        marginBottom: 20,
        border: `1px solid ${accent}22`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          All questions (1–39)
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
          Jump to any item · A1→C2 order · exam-style navigation
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  marginBottom: 8,
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
                      type="button"
                      onClick={() => onSelect(qi)}
                      aria-current={isCurrent ? "step" : undefined}
                      title={`Question ${qNum} · ${questions[qi]?.level ?? section.level}`}
                      style={{
                        minWidth: 36,
                        height: 36,
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
                        boxShadow: isCurrent ? `0 0 0 1px ${accent}33` : undefined,
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
    </nav>
  );
}
