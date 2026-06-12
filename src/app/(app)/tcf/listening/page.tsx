"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Play, Square, RotateCcw, ChevronRight, ChevronLeft, Check, X, Volume2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { TCF_LISTENING, estimateCLBFromListening } from "@/lib/content/tcf-listening";
import { createFrenchUtterance } from "@/lib/french-tts";

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

type Phase = "intro" | "quiz" | "complete";

export default function TCFListeningPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(39).fill(null));

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [rate, setRate] = useState<0.65 | 0.9>(0.9);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(35 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = TCF_LISTENING[idx];
  const userAnswer = answers[idx];
  const answered = userAnswer !== null;

  // Clean up TTS on unmount / question change
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setPlayCount(0);
  }, [idx]);

  // Timer
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

  const handlePlay = useCallback(async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = await createFrenchUtterance(q.audioScript, rate);
    if (!utterance) return;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setPlayCount((c) => c + 1);
    if (!timerRunning && phase === "quiz") setTimerRunning(true);
  }, [isSpeaking, q, rate, timerRunning, phase]);

  function selectAnswer(optIdx: number) {
    if (answered) return;
    const updated = [...answers];
    updated[idx] = optIdx;
    setAnswers(updated);
  }

  function goNext() {
    window.speechSynthesis.cancel();
    if (idx < 38) {
      setIdx(idx + 1);
    } else {
      setPhase("complete");
      setTimerRunning(false);
    }
  }

  function goPrev() {
    if (idx > 0) {
      window.speechSynthesis.cancel();
      setIdx(idx - 1);
    }
  }

  function restart() {
    window.speechSynthesis.cancel();
    setIdx(0);
    setAnswers(Array(39).fill(null));
    setPhase("intro");
    setSecondsLeft(35 * 60);
    setTimerRunning(false);
    setPlayCount(0);
    setIsSpeaking(false);
  }

  const totalAnswered = answers.filter((a) => a !== null).length;
  const totalCorrect = answers.filter((a, i) => a === TCF_LISTENING[i].correctIndex).length;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerColor = secondsLeft < 300 ? "#ef4444" : secondsLeft < 600 ? "#f59e0b" : "var(--text-tertiary)";

  // ── Intro ──────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <>
        <Topbar title="TCF Listening" subtitle="Compréhension orale — 39 questions" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <span className="mono-overline" style={{ color: "#5b6af0" }}>TCF Canada · Listening</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Compréhension orale
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
              39 multiple-choice questions across three difficulty bands. Click <strong style={{ color: "var(--text-primary)" }}>Listen</strong> to hear the audio, then select your answer. In the real exam audio plays once — here you can replay in practice mode.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {Object.entries(BAND_LABEL).map(([band, label]) => (
                <div
                  key={band}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "var(--bg-overlay)",
                    borderRadius: 8,
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: band === "0" ? "#84cc16" : band === "1" ? "#6366f1" : "#ec4899",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28, padding: "10px 14px", background: "var(--bg-overlay)", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <Volume2 size={14} color="var(--text-tertiary)" />
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                Rate control: choose <strong>Normal (0.9×)</strong> or <strong>Slow (0.65×)</strong> before each play. Real TCF audio is native speed — challenge yourself!
              </span>
            </div>

            <button
              onClick={() => setPhase("quiz")}
              style={{
                width: "100%",
                padding: "14px",
                background: "#5b6af0",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Start Practice
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────
  if (phase === "complete") {
    const clbResult = estimateCLBFromListening(totalCorrect);
    const pct = Math.round((totalCorrect / 39) * 100);

    const byBand = [0, 1, 2].map((b) => {
      const qs = TCF_LISTENING.filter((q) => bandOf(q.id) === b);
      const correct = qs.filter((q) => answers[q.id - 1] === q.correctIndex).length;
      return { label: BAND_LABEL[b], correct, total: qs.length };
    });

    return (
      <>
        <Topbar title="TCF Listening" subtitle="Results" />
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <span className="mono-overline" style={{ color: "#5b6af0" }}>Session complete</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 24px", letterSpacing: "-0.01em" }}>
              {totalCorrect} / 39 correct
            </h1>

            {/* Score bar */}
            <div style={{ height: 8, background: "var(--bg-overlay)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct >= 67 ? "#5b6af0" : pct >= 41 ? "#f59e0b" : "#ef4444",
                  borderRadius: 4,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 24 }}>{pct}%</div>

            {/* CLB estimate */}
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

            {/* Band breakdown */}
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
                    <div
                      style={{
                        height: "100%",
                        width: `${(correct / total) * 100}%`,
                        background: "#5b6af0",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={restart}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "var(--bg-overlay)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <RotateCcw size={14} /> Restart
              </button>
              <Link
                href="/tcf"
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#5b6af0",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Back to TCF Hub
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

  return (
    <>
      <Topbar
        title="TCF Listening"
        subtitle={`Q ${idx + 1} of 39 · ${BAND_LABEL[band]}`}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Timer */}
            <button
              onClick={() => setTimerRunning((r) => !r)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "transparent",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                color: timerColor,
                cursor: "pointer",
              }}
              title={timerRunning ? "Pause timer" : "Start timer"}
            >
              {mm}:{ss}
            </button>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              {totalAnswered}/39
            </span>
          </div>
        }
      />

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden", marginBottom: 28 }}>
          <div
            style={{
              height: "100%",
              width: `${((idx + 1) / 39) * 100}%`,
              background: "#5b6af0",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div className="glass-pane" style={{ borderRadius: 20, padding: "28px 32px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Level badge + topic */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                background: `${levelColor}20`,
                color: levelColor,
                padding: "2px 8px",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              {q.level}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{q.topic}</span>
            <span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-tertiary)" }}>
              {idx + 1} / 39
            </span>
          </div>

          {/* Audio player */}
          <div
            style={{
              background: "var(--bg-overlay)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handlePlay}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: isSpeaking ? "#ef444422" : "#5b6af022",
                  border: `1.5px solid ${isSpeaking ? "#ef4444" : "#5b6af0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                title={isSpeaking ? "Stop" : "Play audio"}
              >
                {isSpeaking ? (
                  <Square size={16} color="#ef4444" />
                ) : (
                  <Play size={16} color="#5b6af0" style={{ marginLeft: 2 }} />
                )}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  {isSpeaking ? "Playing…" : playCount === 0 ? "Press to listen" : `Played ${playCount}×`}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                  {playCount === 0 ? "Audio plays automatically on first listen" : playCount === 1 ? "In the real exam, audio plays once only" : "Practice mode — unlimited replays"}
                </div>
              </div>

              {/* Rate toggle */}
              <div style={{ display: "flex", gap: 4 }}>
                {([0.9, 0.65] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => { if (!isSpeaking) setRate(r); }}
                    disabled={isSpeaking}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 5,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      cursor: isSpeaking ? "not-allowed" : "pointer",
                      background: rate === r ? "#5b6af0" : "var(--bg-overlay)",
                      color: rate === r ? "white" : "var(--text-tertiary)",
                      border: rate === r ? "1px solid #5b6af0" : "1px solid var(--border-subtle)",
                      opacity: isSpeaking && rate !== r ? 0.5 : 1,
                    }}
                    title={r === 0.9 ? "Normal speed" : "Slow speed"}
                  >
                    {r === 0.9 ? "Normal" : "Slow"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            {q.question}
          </p>

          {/* Options */}
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
                bg = "#5b6af022"; border = "#5b6af0";
              }

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(oi)}
                  disabled={answered}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 10,
                    cursor: answered ? "default" : "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: `1.5px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color,
                      flexShrink: 0,
                      background: answered && isCorrect ? "#22c55e" : answered && isSelected && !isCorrect ? "#ef4444" : "transparent",
                    }}
                  >
                    {answered && isCorrect ? (
                      <Check size={12} color="white" />
                    ) : answered && isSelected && !isCorrect ? (
                      <X size={12} color="white" />
                    ) : (
                      String.fromCharCode(65 + oi)
                    )}
                  </span>
                  <span style={{ fontSize: 14, color, lineHeight: 1.4 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              style={{
                marginTop: 20,
                padding: "14px 16px",
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
              <details style={{ marginTop: 10 }}>
                <summary style={{ fontSize: 11, color: "var(--text-tertiary)", cursor: "pointer", userSelect: "none" }}>
                  Show audio transcript
                </summary>
                <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
                  {q.audioScript}
                </p>
              </details>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "space-between" }}>
          <button
            onClick={goPrev}
            disabled={idx === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 10,
              fontSize: 13,
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
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: answered ? "#5b6af0" : "var(--bg-overlay)",
              border: `1px solid ${answered ? "#5b6af0" : "var(--border-subtle)"}`,
              borderRadius: 10,
              fontSize: 13,
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
