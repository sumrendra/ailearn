"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Check, X, RotateCcw } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import {
  READING_PAPERS,
  estimateCLBFromReading,
  PAPER_COUNT,
  type TCFReadingQuestion,
} from "@/lib/content/tcf-papers";

const LEVEL_COLOR: Record<string, string> = {
  A1: "#22c55e", A2: "#84cc16",
  B1: "#3b82f6", B2: "#6366f1",
  C1: "#a855f7", C2: "#ec4899",
};

const BAND_LABEL: Record<number, string> = {
  0: "A1–A2 · Basic (Q 1–10)",
  1: "B1–B2 · Intermediate (Q 11–25)",
  2: "C1–C2 · Advanced (Q 26–39)",
};

function bandOf(id: number) {
  if (id <= 10) return 0;
  if (id <= 25) return 1;
  return 2;
}

type Phase = "select" | "intro" | "quiz" | "complete";

export default function TCFReadingPage() {
  const [paper, setPaper] = useState(1);
  const [phase, setPhase] = useState<Phase>("select");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(39).fill(null));

  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions: TCFReadingQuestion[] = READING_PAPERS[paper] ?? READING_PAPERS[1];
  const q = questions[idx];
  const userAnswer = answers[idx];
  const answered = userAnswer !== null;

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  function selectAnswer(optIdx: number) {
    if (answered) return;
    if (!timerRunning && phase === "quiz") setTimerRunning(true);
    const updated = [...answers];
    updated[idx] = optIdx;
    setAnswers(updated);
  }

  function goNext() {
    if (idx < 38) {
      setIdx(idx + 1);
    } else {
      setPhase("complete");
      setTimerRunning(false);
    }
  }

  function goPrev() {
    if (idx > 0) setIdx(idx - 1);
  }

  function startPaper(p: number) {
    setPaper(p);
    setIdx(0);
    setAnswers(Array(39).fill(null));
    setSecondsLeft(60 * 60);
    setTimerRunning(false);
    setPhase("intro");
  }

  function restart() {
    setIdx(0);
    setAnswers(Array(39).fill(null));
    setPhase("select");
    setSecondsLeft(60 * 60);
    setTimerRunning(false);
  }

  const totalAnswered = answers.filter((a) => a !== null).length;
  const totalCorrect = answers.filter((a, i) => a === questions[i].correctIndex).length;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerColor = secondsLeft < 600 ? "#ef4444" : secondsLeft < 1200 ? "#f59e0b" : "var(--text-tertiary)";

  // ── Paper Select ───────────────────────────────────────────────
  if (phase === "select") {
    return (
      <>
        <Topbar title="TCF Reading" subtitle="Sélectionnez un examen" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px" }}>
            <span className="mono-overline" style={{ color: "#10b981" }}>TCF Canada · Reading</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Choisissez votre examen blanc
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
              5 examens blancs complets, chacun avec 39 questions de niveau A1 à C2. Textes variés : annonces, articles, extraits académiques et littéraires.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {Array.from({ length: PAPER_COUNT }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => startPaper(p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#10b98110";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#10b98160";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#10b98115",
                        border: "1px solid #10b98130",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#10b981",
                        flexShrink: 0,
                      }}
                    >
                      {p}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        Examen blanc {p}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>
                        39 questions · 60 min · A1–C2
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)" />
                </button>
              ))}
            </div>

            <Link
              href="/tcf"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                background: "transparent",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                fontSize: 13,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Retour au hub TCF
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Intro ──────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <>
        <Topbar title="TCF Reading" subtitle={`Examen ${paper} · Compréhension écrite`} />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <span className="mono-overline" style={{ color: "#10b981" }}>TCF Canada · Examen {paper}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Compréhension écrite
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
              39 questions à choix multiples dans trois bandes de difficulté. Un texte en français est affiché pour chaque question — lisez-le attentivement, puis sélectionnez la bonne réponse.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { band: "A1–A2", desc: "Panneaux, annonces, emails courts, publicités (Q 1–10)", color: "#84cc16" },
                { band: "B1–B2", desc: "Articles, lettres officielles, reportages (Q 11–25)", color: "#6366f1" },
                { band: "C1–C2", desc: "Éditoriaux, textes académiques, extraits littéraires (Q 26–39)", color: "#ec4899" },
              ].map(({ band, desc, color }) => (
                <div
                  key={band}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 14px",
                    background: "var(--bg-overlay)",
                    borderRadius: 8,
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{band}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPhase("select")}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "var(--bg-overlay)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Changer
              </button>
              <button
                onClick={() => setPhase("quiz")}
                style={{
                  flex: 2,
                  padding: "14px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Commencer l&apos;examen {paper}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────
  if (phase === "complete") {
    const clbResult = estimateCLBFromReading(totalCorrect);
    const pct = Math.round((totalCorrect / 39) * 100);

    const byBand = [0, 1, 2].map((b) => {
      const qs = questions.filter((q) => bandOf(q.id) === b);
      const correct = qs.filter((q) => answers[q.id - 1] === q.correctIndex).length;
      return { label: BAND_LABEL[b], correct, total: qs.length };
    });

    return (
      <>
        <Topbar title="TCF Reading" subtitle={`Examen ${paper} · Résultats`} />
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <span className="mono-overline" style={{ color: "#10b981" }}>Examen {paper} terminé</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 24px", letterSpacing: "-0.01em" }}>
              {totalCorrect} / 39 correct
            </h1>

            <div style={{ height: 8, background: "var(--bg-overlay)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct >= 67 ? "#10b981" : pct >= 41 ? "#f59e0b" : "#ef4444",
                  borderRadius: 4,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 24 }}>{pct}%</div>

            <div
              style={{
                padding: "16px 20px",
                background: "var(--accent-soft)",
                borderRadius: 10,
                border: "1px solid var(--accent)44",
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>
                Estimated CLB level
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                {clbResult.clb}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                {clbResult.cefr} · {clbResult.description}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6 }}>
                Estimate only — based on practice performance, not official TCF scoring.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {byBand.map(({ label, correct, total }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                      {correct}/{total}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(correct / total) * 100}%`, background: "#10b981", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={restart}
                style={{
                  flex: 1, padding: "12px",
                  background: "var(--bg-overlay)", color: "var(--text-primary)",
                  border: "1px solid var(--border-default)", borderRadius: 10,
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <RotateCcw size={14} /> Autre examen
              </button>
              <Link
                href="/tcf"
                style={{
                  flex: 1, padding: "12px",
                  background: "#10b981", color: "white",
                  border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                Hub TCF
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────
  const levelColor = LEVEL_COLOR[q.level] ?? "var(--accent)";
  const band = bandOf(q.id);
  const isLongPassage = q.passage.length > 400;

  return (
    <>
      <Topbar
        title={`TCF Reading · Examen ${paper}`}
        subtitle={`Q ${idx + 1} de 39 · ${BAND_LABEL[band]}`}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setTimerRunning((r) => !r)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "transparent", border: "1px solid var(--border-subtle)",
                borderRadius: 6, padding: "4px 10px",
                fontSize: 13, fontFamily: "var(--font-mono)",
                color: timerColor, cursor: "pointer",
              }}
              title={timerRunning ? "Pause timer" : "Start timer"}
            >
              {mm}:{ss}
            </button>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{totalAnswered}/39</span>
          </div>
        }
      />

      <div
        style={{
          maxWidth: isLongPassage ? 1100 : 760,
          margin: "0 auto",
          padding: "28px 20px 80px",
        }}
      >
        {/* Progress */}
        <div style={{ height: 3, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
          <div
            style={{
              height: "100%",
              width: `${((idx + 1) / 39) * 100}%`,
              background: "#10b981",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div style={{ display: isLongPassage ? "grid" : "block", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          {/* Passage panel */}
          <div
            className="glass-pane"
            style={{
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: isLongPassage ? 0 : 16,
              border: "1px solid #10b98122",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: `${levelColor}20`, color: levelColor,
                  padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-mono)",
                }}
              >
                {q.level}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{q.passageType}</span>
            </div>
            <div
              style={{
                fontSize: isLongPassage ? 14 : 15,
                color: "var(--text-primary)",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                maxHeight: isLongPassage ? 520 : "none",
                overflowY: isLongPassage ? "auto" : "visible",
                paddingRight: isLongPassage ? 4 : 0,
              }}
            >
              {q.passage}
            </div>
          </div>

          {/* Question + options panel */}
          <div className="glass-pane" style={{ borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-tertiary)" }}>
                {idx + 1} / 39
              </span>
            </div>

            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 20 }}>
              {q.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map((opt, oi) => {
                const isSelected = userAnswer === oi;
                const isCorrect = oi === q.correctIndex;
                let bg = "var(--bg-overlay)";
                let border = "var(--border-subtle)";
                let color = "var(--text-primary)";

                if (answered) {
                  if (isCorrect) { bg = "#22c55e18"; border = "#22c55e"; color = "#22c55e"; }
                  else if (isSelected && !isCorrect) { bg = "#ef444418"; border = "#ef4444"; color = "#ef4444"; }
                  else { color = "var(--text-tertiary)"; }
                } else if (isSelected) {
                  bg = "#10b98122"; border = "#10b981";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(oi)}
                    disabled={answered}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 14px",
                      background: bg, border: `1.5px solid ${border}`,
                      borderRadius: 10,
                      cursor: answered ? "default" : "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `1.5px solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700,
                        fontFamily: "var(--font-mono)", color,
                        flexShrink: 0, marginTop: 1,
                        background: answered && isCorrect ? "#22c55e" : answered && isSelected && !isCorrect ? "#ef4444" : "transparent",
                      }}
                    >
                      {answered && isCorrect ? (
                        <Check size={11} color="white" />
                      ) : answered && isSelected && !isCorrect ? (
                        <X size={11} color="white" />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    <span style={{ fontSize: 13, color, lineHeight: 1.45 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 14px",
                  background: userAnswer === q.correctIndex ? "#22c55e0e" : "#ef44440e",
                  border: `1px solid ${userAnswer === q.correctIndex ? "#22c55e33" : "#ef444433"}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: userAnswer === q.correctIndex ? "#22c55e" : "#ef4444", marginBottom: 4 }}>
                  {userAnswer === q.correctIndex ? "Correct" : "Incorrect"}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "space-between" }}>
          <button
            onClick={goPrev}
            disabled={idx === 0}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 16px",
              background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)",
              borderRadius: 10, fontSize: 13,
              color: idx === 0 ? "var(--text-tertiary)" : "var(--text-primary)",
              cursor: idx === 0 ? "not-allowed" : "pointer",
              opacity: idx === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <button
            onClick={answered ? goNext : undefined}
            disabled={!answered}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 20px",
              background: answered ? "#10b981" : "var(--bg-overlay)",
              border: `1px solid ${answered ? "#10b981" : "var(--border-subtle)"}`,
              borderRadius: 10, fontSize: 13,
              fontWeight: answered ? 600 : 400,
              color: answered ? "white" : "var(--text-tertiary)",
              cursor: answered ? "pointer" : "not-allowed",
              opacity: answered ? 1 : 0.5,
            }}
          >
            {idx === 38 ? "Finish" : "Next"} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
