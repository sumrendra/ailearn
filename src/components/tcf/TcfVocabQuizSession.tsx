"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw, Volume2, X } from "lucide-react";
import { PracticeStage } from "@/components/practice/PracticeStage";
import { ProgressDots, type DotState } from "@/components/practice/ProgressDots";
import { speak } from "@/lib/french-tts";
import {
  buildVocabQuiz,
  scoreVocabQuiz,
  scopeLabel,
  type VocabMcqQuestion,
  type VocabQuizScope,
} from "@/lib/tcf-program/vocab-quiz";

type Phase = "quiz" | "results";

export function TcfVocabQuizSession({
  scope,
  count,
  onRestartSetup,
}: {
  scope: VocabQuizScope;
  count: number;
  onRestartSetup: () => void;
}) {
  const questions = useMemo(
    () => buildVocabQuiz({ scope, count, seed: (scope.charCodeAt(0) ?? 0) + count * 997 }),
    [scope, count],
  );

  const [phase, setPhase] = useState<Phase>("quiz");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[idx];
  const result = useMemo(
    () => (phase === "results" ? scoreVocabQuiz(answers, questions) : null),
    [phase, answers, questions],
  );

  const dotStates: DotState[] = questions.map((_, i) => {
    if (phase === "quiz" && i === idx && !submitted) return "current";
    if (answers[i] === null) return "remaining";
    return answers[i] === questions[i].correctIndex ? "correct" : "incorrect";
  });

  const submit = useCallback(() => {
    if (selected === null || !q) return;
    const next = [...answers];
    next[idx] = selected;
    setAnswers(next);
    setSubmitted(true);
  }, [answers, idx, q, selected]);

  const goNext = useCallback(() => {
    if (idx >= questions.length - 1) {
      setPhase("results");
      return;
    }
    setIdx((i) => i + 1);
    setSelected(answers[idx + 1]);
    setSubmitted(answers[idx + 1] !== null);
  }, [answers, idx, questions.length]);

  const restartSame = () => {
    setPhase("quiz");
    setIdx(0);
    setAnswers(Array(questions.length).fill(null));
    setSelected(null);
    setSubmitted(false);
  };

  if (questions.length === 0) {
    return (
      <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
        No words available for this scope.{" "}
        <Link href="/tcf/vocabulary" style={{ color: "var(--accent)" }}>
          Back to vocabulary
        </Link>
      </p>
    );
  }

  if (phase === "results" && result) {
    return (
      <PracticeStage variant="quiz">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{scopeLabel(scope)}</div>
          <div style={{ fontSize: 40, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#be185d" }}>
            {result.percent}%
          </div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "8px 0 24px" }}>
            {result.correct} of {result.total} correct
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <button
              type="button"
              onClick={restartSame}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-overlay)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <RotateCcw size={14} /> Same quiz again
            </button>
            <button
              type="button"
              onClick={onRestartSetup}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#be185d",
                color: "white",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              New quiz setup
            </button>
            <Link
              href={`/flashcards?band=${scope === "all" ? "b" : scope}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid rgba(190,24,93,0.35)",
                color: "#be185d",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Flashcards <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </PracticeStage>
    );
  }

  if (!q) return null;

  const isCorrect = submitted && selected === q.correctIndex;

  return (
    <PracticeStage
      variant="quiz"
      above={<ProgressDots states={dotStates} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Question {idx + 1} / {questions.length}
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
            French word or phrase
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.35 }}>
              {q.french}
            </p>
            <button
              type="button"
              onClick={() => void speak(q.french)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-overlay)",
                fontSize: 11,
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <Volume2 size={12} /> Listen
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>
            Choose the correct English meaning.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, oi) => {
            const isSelected = selected === oi;
            const isAnswer = oi === q.correctIndex;
            let bg = "var(--bg-overlay)";
            let border = "var(--border-subtle)";
            let color = "var(--text-primary)";
            if (submitted) {
              if (isAnswer) {
                bg = "#22c55e18";
                border = "#22c55e";
                color = "#22c55e";
              } else if (isSelected && !isAnswer) {
                bg = "#ef444418";
                border = "#ef4444";
                color = "#ef4444";
              } else {
                color = "var(--text-muted)";
              }
            } else if (isSelected) {
              bg = "rgba(190,24,93,0.12)";
              border = "#be185d";
            }
            return (
              <button
                key={oi}
                type="button"
                disabled={submitted}
                onClick={() => setSelected(oi)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  textAlign: "left",
                  borderRadius: 10,
                  border: `1.5px solid ${border}`,
                  background: bg,
                  color,
                  cursor: submitted ? "default" : "pointer",
                  fontSize: 14,
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `1.5px solid ${border}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {submitted && isAnswer ? (
                    <Check size={12} />
                  ) : submitted && isSelected && !isAnswer ? (
                    <X size={12} />
                  ) : (
                    String.fromCharCode(65 + oi)
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {submitted && (
          <p style={{ margin: 0, fontSize: 13, color: isCorrect ? "#22c55e" : "var(--text-secondary)" }}>
            {isCorrect ? "Correct." : (
              <>
                Not quite. Correct answer: <strong>{q.english}</strong>
              </>
            )}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={selected === null}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: selected === null ? "var(--bg-overlay)" : "#be185d",
                color: selected === null ? "var(--text-muted)" : "white",
                fontWeight: 600,
                fontSize: 13,
                cursor: selected === null ? "not-allowed" : "pointer",
              }}
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: "#be185d",
                color: "white",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {idx >= questions.length - 1 ? "See results" : "Next"}
            </button>
          )}
        </div>
      </div>
    </PracticeStage>
  );
}
