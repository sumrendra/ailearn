"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Play, Square, RotateCcw, ChevronRight, ChevronLeft, Check, X, Volume2, Loader2, Lock, BookOpen } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import {
  PAPER_COUNT,
  type TCFListeningQuestion,
} from "@/lib/content/tcf-papers";
import { logTcfAttempt } from "@/lib/tcf-log-attempt";
import { scoreToNclcListening } from "@/lib/tcf-program/nclc";
import { describeComprehensionScore, scoreComprehension } from "@/lib/tcf-program/scoring";
import {
  resolveExamSection,
  sourcePapersOf,
  type DrawnItem,
  type ExamItemSource,
} from "@/lib/tcf-program/exam-draw";
import { useTcfMockFlow } from "@/components/tcf/useTcfMockFlow";
import { TcfMockBanner, TcfMockCompleteBar } from "@/components/tcf/TcfMockUI";
import { TcfLexiqueNextStep } from "@/components/tcf/TcfLexiqueNextStep";
import { TcfPracticeTextHelp } from "@/components/tcf/TcfPracticeTextHelp";
import { practiceTranslationKey } from "@/lib/tcf-program/practice-translation-keys";

const LEVEL_COLOR: Record<string, string> = {
  A1: "#22c55e", A2: "#84cc16",
  B1: "#3b82f6", B2: "#6366f1",
  C1: "#a855f7", C2: "#ec4899",
};

const BAND_LABEL: Record<number, string> = {
  0: "Section 1 · A1–A2 · Documents courts (Q 1–10)",
  1: "Section 2 · B1–B2 · Documents informatifs (Q 11–25)",
  2: "Section 3 · C1–C2 · Documents longs (Q 26–39)",
};

function bandOf(id: number) {
  if (id <= 10) return 0;
  if (id <= 25) return 1;
  return 2;
}

type Phase = "select" | "intro" | "preparing" | "quiz" | "complete";

const PREFETCH_CONCURRENCY = 8;

async function fetchStoredAudio(paper: number, qIdx: number): Promise<Blob> {
  const res = await fetch(`/api/tcf/listening/audio/${paper}/${qIdx}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Audio not found in database");
  }
  return res.blob();
}

export default function TCFListeningPage() {
  const [paper, setPaper] = useState(1);
  const [phase, setPhase] = useState<Phase>("select");
  const [examMode, setExamMode] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(39).fill(null));

  // Audio state
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [slow, setSlow] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [prefetchDone, setPrefetchDone] = useState(0);
  const [prefetchError, setPrefetchError] = useState<string | null>(null);
  const [dbAudioReady, setDbAudioReady] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());
  const idxRef = useRef(0);
  const paperRef = useRef(1);
  const questionsRef = useRef<DrawnItem<TCFListeningQuestion>[]>([]);
  const prefetchAbortRef = useRef(false);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(35 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptLoggedRef = useRef(false);
  const { isMock, mockPaper, mockSeed, bootedRef } = useTcfMockFlow("listening");

  /** Mock sittings draw from the whole bank; practice keeps the chosen paper. */
  const questions = useMemo(
    () => resolveExamSection<TCFListeningQuestion>("listening", { paper, seed: mockSeed }),
    [paper, mockSeed],
  );
  const q = questions[idx];
  const userAnswer = answers[idx];
  const hasSelection = userAnswer !== null;
  /** Real TCF exam: no correct/incorrect feedback until the section ends. */
  const showFeedback = !examMode && hasSelection;

  /** Timers and audio callbacks read these outside render, so keep them synced. */
  useEffect(() => {
    idxRef.current = idx;
    paperRef.current = paper;
    questionsRef.current = questions;
  }, [idx, paper, questions]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      for (const url of audioCache.current.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  function clearAudioCache() {
    for (const url of audioCache.current.values()) {
      URL.revokeObjectURL(url);
    }
    audioCache.current.clear();
  }

  /** Audio is keyed by where an item came from, not by its position in the exam. */
  function sourceOf(position: number): ExamItemSource {
    const item = questionsRef.current[position];
    return {
      sourcePaper: item?.sourcePaper ?? paperRef.current,
      sourceQuestionIndex: item?.sourceQuestionIndex ?? position,
    };
  }

  function cacheKeyFor(position: number) {
    const { sourcePaper, sourceQuestionIndex } = sourceOf(position);
    return `p${sourcePaper}-q${sourceQuestionIndex}`;
  }

  async function ensureAudioCached(position: number): Promise<string> {
    const cacheKey = cacheKeyFor(position);
    const existing = audioCache.current.get(cacheKey);
    if (existing) return existing;
    const { sourcePaper, sourceQuestionIndex } = sourceOf(position);
    const blob = await fetchStoredAudio(sourcePaper, sourceQuestionIndex);
    const blobUrl = URL.createObjectURL(blob);
    audioCache.current.set(cacheKey, blobUrl);
    return blobUrl;
  }

  async function prefetchExamAudio(): Promise<boolean> {
    prefetchAbortRef.current = false;
    setPrefetchError(null);
    setPrefetchDone(0);
    const positions = questionsRef.current.map((_, i) => i);
    let done = 0;
    const missing: number[] = [];

    for (let i = 0; i < positions.length; i += PREFETCH_CONCURRENCY) {
      if (prefetchAbortRef.current) return false;
      const batch = positions.slice(i, i + PREFETCH_CONCURRENCY);
      await Promise.all(
        batch.map(async (position) => {
          if (audioCache.current.has(cacheKeyFor(position))) {
            done++;
            setPrefetchDone(done);
            return;
          }
          try {
            const { sourcePaper, sourceQuestionIndex } = sourceOf(position);
            const blob = await fetchStoredAudio(sourcePaper, sourceQuestionIndex);
            audioCache.current.set(cacheKeyFor(position), URL.createObjectURL(blob));
            done++;
            setPrefetchDone(done);
          } catch {
            missing.push(position);
          }
        }),
      );
    }

    if (prefetchAbortRef.current) return false;
    if (missing.length > 0) {
      setPrefetchError(
        `${missing.length} audio(s) manquant(s). Lancez : npm run upload:tcf-audio:server`,
      );
      return false;
    }
    return true;
  }

  async function handlePlay(questionIdx?: number) {
    const qIdx = questionIdx ?? idxRef.current;
    if (examMode && playCount >= 1 && qIdx === idxRef.current) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setTtsError(null);
    try {
      const blobUrl = await ensureAudioCached(qIdx);
      if (qIdx !== idxRef.current) return;

      const audio = new Audio(blobUrl);
      audio.playbackRate = slow ? 0.72 : 1.0;
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audioRef.current = audio;
      await audio.play();
      setIsPlaying(true);
      if (qIdx === idxRef.current) setPlayCount((c) => c + 1);
    } catch (err) {
      if (qIdx === idxRef.current) {
        setTtsError(err instanceof Error ? err.message : "Impossible de charger l'audio.");
      }
    } finally {
      if (qIdx === idxRef.current) setIsLoading(false);
    }
  }

  function scheduleExamAutoPlay(questionIdx: number) {
    if (!examMode) return;
    setTimeout(() => void handlePlay(questionIdx), 400);
  }

  function resetAudioUi() {
    audioRef.current?.pause();
    setIsPlaying(false);
    setPlayCount(0);
    setIsLoading(false);
    setTtsError(null);
  }

  function goToIdx(newIdx: number) {
    resetAudioUi();
    setIdx(newIdx);
    scheduleExamAutoPlay(newIdx);
  }

  // Timer — auto-finishes exam when it expires (real TCF behaviour)
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            setPhase("complete");
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
    if (!examMode && hasSelection) return;
    const updated = [...answers];
    updated[idx] = optIdx;
    setAnswers(updated);
  }

  function goNext() {
    audioRef.current?.pause();
    if (idx < 38) {
      goToIdx(idx + 1);
    } else {
      setPhase("complete");
      setTimerRunning(false);
    }
  }

  function goPrev() {
    if (idx > 0) {
      goToIdx(idx - 1);
    }
  }

  function startPaper(p: number) {
    prefetchAbortRef.current = true;
    setPaper(p);
    setIdx(0);
    setAnswers(Array(39).fill(null));
    setSecondsLeft(35 * 60);
    setTimerRunning(false);
    setPlayCount(0);
    setIsPlaying(false);
    setIsLoading(false);
    setTtsError(null);
    setPrefetchDone(0);
    setPrefetchError(null);
    setDbAudioReady(null);
    clearAudioCache();
    setPhase("intro");
  }

  useEffect(() => {
    if (!isMock || bootedRef.current) return;
    bootedRef.current = true;
    setExamMode(true);
    startPaper(mockPaper);
  }, [isMock, mockPaper, bootedRef]);

  async function beginExam() {
    if (examMode) {
      setPhase("preparing");
      const ok = await prefetchExamAudio();
      if (!ok) {
        setPhase("intro");
        return;
      }
    }
    setTimerRunning(true);
    setPhase("quiz");
    if (examMode) scheduleExamAutoPlay(0);
  }

  const neededPapers = useMemo(() => sourcePapersOf(questions).join(","), [questions]);

  useEffect(() => {
    if (phase !== "intro") return;
    let cancelled = false;
    fetch(`/api/tcf/listening/audio/status?papers=${neededPapers}`)
      .then((r) => r.json())
      .then((data: { ready?: boolean }) => {
        if (!cancelled) setDbAudioReady(Boolean(data.ready));
      })
      .catch(() => {
        if (!cancelled) setDbAudioReady(false);
      });
    return () => { cancelled = true; };
  }, [phase, neededPapers]);

  function restart() {
    prefetchAbortRef.current = true;
    attemptLoggedRef.current = false;
    audioRef.current?.pause();
    clearAudioCache();
    setIdx(0);
    setAnswers(Array(39).fill(null));
    setPhase("select");
    setExamMode(false);
    setSecondsLeft(35 * 60);
    setTimerRunning(false);
    setPlayCount(0);
    setIsPlaying(false);
    setIsLoading(false);
    setTtsError(null);
    setPrefetchDone(0);
    setPrefetchError(null);
    setDbAudioReady(null);
  }

  const totalAnswered = answers.filter((a) => a !== null).length;

  const sectionScore = useMemo(
    () => scoreComprehension("listening", answers, questions.map((q) => q.correctIndex)),
    [answers, questions],
  );

  useEffect(() => {
    if (phase !== "complete" || attemptLoggedRef.current) return;
    attemptLoggedRef.current = true;
    logTcfAttempt({
      module: "listening",
      paper,
      scoreRaw: sectionScore.correct,
      scoreNclc: scoreToNclcListening(sectionScore.score699),
      score699: sectionScore.score699,
    });
  }, [phase, sectionScore, paper]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerColor = secondsLeft < 300 ? "#ef4444" : secondsLeft < 600 ? "#f59e0b" : "var(--text-tertiary)";

  // ── Paper Select ───────────────────────────────────────────────
  if (phase === "select") {
    return (
      <>
        <Topbar title="TCF Listening" subtitle="Sélectionnez un examen" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px" }}>
            <span className="mono-overline" style={{ color: "#5b6af0" }}>TCF Canada · Listening</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Choisissez votre examen blanc
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
              5 examens blancs complets, chacun avec 39 questions de niveau A1 à C2. L&apos;audio est généré par IA (voix naturelle française).
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
                    (e.currentTarget as HTMLButtonElement).style.background = "#5b6af010";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#5b6af060";
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
                        background: "#5b6af015",
                        border: "1px solid #5b6af030",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#5b6af0",
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
                        39 questions · 35 min · A1–C2
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
        <Topbar title="TCF Listening" subtitle={`Examen ${paper} · Compréhension orale`} />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <span className="mono-overline" style={{ color: "#5b6af0" }}>TCF Canada · Examen {paper}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Compréhension orale
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
              39 questions à choix multiples dans trois bandes de difficulté. Cliquez sur <strong style={{ color: "var(--text-primary)" }}>Écouter</strong> pour entendre l&apos;audio (voix naturelle), puis sélectionnez votre réponse.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
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

            {/* Mode selection */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Mode d&apos;entraînement
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: false, label: "Mode pratique", desc: "Réécoutes illimitées · aide à l'apprentissage", icon: <BookOpen size={15} color={!examMode ? "#5b6af0" : "var(--text-tertiary)"} /> },
                  { value: true, label: "Mode examen", desc: "Audios PostgreSQL · 1 écoute · retour impossible", icon: <Lock size={15} color={examMode ? "#ef4444" : "var(--text-tertiary)"} /> },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setExamMode(opt.value)}
                    style={{
                      flex: 1, padding: "12px 14px", textAlign: "left",
                      background: examMode === opt.value ? (opt.value ? "#ef444410" : "#5b6af010") : "var(--bg-overlay)",
                      border: `1.5px solid ${examMode === opt.value ? (opt.value ? "#ef4444" : "#5b6af0") : "var(--border-subtle)"}`,
                      borderRadius: 10, cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      {opt.icon}
                      <span style={{ fontSize: 13, fontWeight: 600, color: examMode === opt.value ? (opt.value ? "#ef4444" : "#5b6af0") : "var(--text-primary)" }}>
                        {opt.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {dbAudioReady === false && (
              <div style={{
                padding: "10px 14px", background: "#f59e0b12", border: "1px solid #f59e0b44",
                borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#b45309",
              }}>
                Audios pas encore en base pour cet examen. Ils seront générés automatiquement via le script de push.
              </div>
            )}
            {dbAudioReady === true && (
              <div style={{
                padding: "10px 14px", background: "#22c55e12", border: "1px solid #22c55e33",
                borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#16a34a",
              }}>
                ✓ 39 audios en base pour l&apos;examen {paper}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, padding: "10px 14px", background: "var(--bg-overlay)", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <Volume2 size={14} color="var(--text-tertiary)" />
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                {examMode
                  ? "Mode examen : audios chargés depuis PostgreSQL avant le début."
                  : "Mode pratique : audios servis depuis PostgreSQL (pas de génération à la volée)."}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPhase("select")}
                style={{
                  flex: 1, padding: "13px", background: "var(--bg-overlay)",
                  color: "var(--text-secondary)", border: "1px solid var(--border-subtle)",
                  borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
                }}
              >
                Changer
              </button>
              <button
                onClick={() => void beginExam()}
                style={{
                  flex: 2, padding: "14px",
                  background: examMode ? "#ef4444" : "#5b6af0",
                  color: "white", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em",
                }}
              >
                {examMode ? "🔒 Commencer (mode examen)" : "Commencer l'examen " + paper}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === "preparing") {
    const pct = Math.round((prefetchDone / 39) * 100);
    return (
      <>
        <Topbar title="TCF Listening" subtitle={`Examen ${paper} · Chargement`} />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 36px", textAlign: "center" }}>
            <Loader2 size={36} color="#5b6af0" style={{ animation: "spin 1s linear infinite", marginBottom: 20 }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 8px" }}>
              Chargement des audios
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              Récupération des 39 pistes depuis PostgreSQL…
            </p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "#5b6af0", marginBottom: 8 }}>
              {prefetchDone} / 39
            </div>
            <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#5b6af0", borderRadius: 3, transition: "width 0.3s ease" }} />
            </div>
            {prefetchError && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "#ef444412", border: "1px solid #ef444433", borderRadius: 8, fontSize: 13, color: "#ef4444" }}>
                {prefetchError}
              </div>
            )}
            <button
              onClick={() => { prefetchAbortRef.current = true; setPhase("intro"); }}
              style={{ marginTop: 24, padding: "10px 20px", background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)", borderRadius: 8, fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Annuler
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────
  if (phase === "complete") {
    const clbResult = describeComprehensionScore("listening", sectionScore.score699);
    const pct = Math.round((sectionScore.score699 / sectionScore.maxScore) * 100);

    const byBand = [0, 1, 2].map((b) => {
      const qs = questions.filter((q) => bandOf(q.id) === b);
      const correct = qs.filter((q) => answers[q.id - 1] === q.correctIndex).length;
      return { label: BAND_LABEL[b], correct, total: qs.length };
    });

    return (
      <>
        <Topbar title="TCF Listening" subtitle={`Examen ${paper} · Résultats`} />
        <TcfMockBanner module="listening" />
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "40px 40px 36px" }}>
            <TcfMockCompleteBar
              module="listening"
              score={{
                scoreRaw: sectionScore.correct,
                scoreNclc: scoreToNclcListening(sectionScore.score699),
                score699: sectionScore.score699,
              }}
            />
            <span className="mono-overline" style={{ color: "#5b6af0" }}>Examen {paper} terminé</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 8px", letterSpacing: "-0.01em" }}>
              {sectionScore.score699} / 699
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.55 }}>
              {sectionScore.correct} / 39 bonnes réponses — converties avec le barème officiel,
              où les questions difficiles pèsent beaucoup plus que les premières.
            </p>

            {/* Score bar */}
            <div style={{ height: 8, background: "var(--bg-overlay)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct >= 65 ? "#5b6af0" : pct >= 41 ? "#f59e0b" : "#ef4444",
                  borderRadius: 4,
                  transition: "width 0.8s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 24 }}>{pct}%</div>

            {/* NCLC estimate */}
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
                Niveau NCLC estimé
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                  {clbResult.clb}
                </div>
                <div style={{ fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                  ~{clbResult.score699} / 699
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                {clbResult.cefr} · {clbResult.description}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6 }}>
                Estimation calibrée sur le barème pondéré du TCF. La notation officielle utilise
                un modèle IRT propriétaire : prévoyez une marge d&apos;environ ±1 niveau NCLC.
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border-subtle)", fontSize: 12, color: "var(--text-secondary)" }}>
                <strong style={{ color: clbResult.score699 >= 458 ? "#22c55e" : "#f59e0b" }}>
                  {clbResult.score699 >= 458 ? "✓ Seuil IRCC atteint" : "✗ Seuil IRCC non atteint"}
                </strong>
                {" "}— Entrée express exige NCLC 7 (≥ 458/699 en écoute). Votre estimation : {clbResult.score699}/699.
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

            <TcfLexiqueNextStep bands={byBand} accent="#5b6af0" />

            {/* Per-question review — essential in exam mode where inline feedback is hidden */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
                Revue des réponses
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
                {questions.map((question, i) => {
                  const chosen = answers[i];
                  const ok = chosen === question.correctIndex;
                  return (
                    <details
                      key={question.id}
                      style={{
                        padding: "10px 14px",
                        background: "var(--bg-overlay)",
                        borderRadius: 8,
                        border: `1px solid ${ok ? "#22c55e33" : chosen !== null ? "#ef444433" : "var(--border-subtle)"}`,
                      }}
                    >
                      <summary style={{ cursor: "pointer", fontSize: 13, color: "var(--text-primary)", listStyle: "none" }}>
                        <span style={{ fontFamily: "var(--font-mono)", marginRight: 8, color: ok ? "#22c55e" : chosen !== null ? "#ef4444" : "var(--text-tertiary)" }}>
                          {ok ? "✓" : chosen !== null ? "✗" : "—"}
                        </span>
                        Q{i + 1} · {question.level} · {question.topic}
                      </summary>
                      <p style={{ margin: "10px 0 6px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {question.question}
                      </p>
                      {chosen !== null && (
                        <p style={{ margin: "0 0 6px", fontSize: 12, color: ok ? "#22c55e" : "#ef4444" }}>
                          Votre réponse : {question.options[chosen]}
                        </p>
                      )}
                      {!ok && (
                        <p style={{ margin: "0 0 6px", fontSize: 12, color: "#22c55e" }}>
                          Bonne réponse : {question.options[question.correctIndex]}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.55 }}>
                        {question.explanation}
                      </p>
                    </details>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {!isMock && (
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
                <RotateCcw size={14} /> Autre examen
              </button>
              )}
              {!isMock && (
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
                Hub TCF
              </Link>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────
  const levelColor = LEVEL_COLOR[q.level] ?? "var(--accent)";
  const band = bandOf(q.id);
  const examLocked = examMode && playCount >= 1;
  const btnDisabled = isLoading || examLocked;
  const btnColor = examLocked ? "#6b7280" : isPlaying ? "#ef4444" : "#5b6af0";

  return (
    <>
      <Topbar
        title={`TCF Listening · Examen ${paper}`}
        subtitle={`Q ${idx + 1} de 39 · ${BAND_LABEL[band]}`}
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
              title={timerRunning ? "Pause" : "Démarrer"}
            >
              {mm}:{ss}
            </button>
            {examMode && (
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: "#ef444415", color: "#ef4444", padding: "2px 7px", borderRadius: 4 }}>
                Examen
              </span>
            )}
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
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              background: "var(--bg-overlay)",
              border: `1px solid ${examLocked ? "#ef444433" : "var(--border-subtle)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => void handlePlay()}
                disabled={btnDisabled}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: examLocked ? "#6b728015" : isPlaying ? "#ef444422" : isLoading ? "var(--bg-overlay)" : "#5b6af022",
                  border: `1.5px solid ${btnColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: btnDisabled ? "not-allowed" : "pointer",
                  flexShrink: 0, opacity: btnDisabled && !examLocked ? 0.7 : 1,
                }}
                title={examLocked ? "Audio déjà joué — mode examen" : isPlaying ? "Stop" : isLoading ? "Chargement…" : "Écouter"}
              >
                {isLoading ? (
                  <Loader2 size={16} color="var(--text-tertiary)" style={{ animation: "spin 1s linear infinite" }} />
                ) : examLocked ? (
                  <Lock size={16} color="#6b7280" />
                ) : isPlaying ? (
                  <Square size={16} color="#ef4444" />
                ) : (
                  <Play size={16} color="#5b6af0" style={{ marginLeft: 2 }} />
                )}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  {isLoading ? "Génération audio…" : examLocked ? "Audio joué — 1 écoute (mode examen)" : isPlaying ? "Lecture en cours…" : playCount === 0 ? "Appuyez pour écouter" : `Écouté ${playCount}×`}
                </div>
                <div style={{ fontSize: 11, color: examLocked ? "#ef4444" : ttsError ? "#ef4444" : "var(--text-tertiary)", marginTop: 2 }}>
                  {ttsError
                    ? ttsError
                    : isLoading ? "Chargement depuis PostgreSQL…"
                    : examLocked ? "TCF réel : l'audio passe une seule fois par question"
                    : playCount === 0 ? "Audio stocké en base — lecture instantanée"
                    : examMode ? "1 seule écoute autorisée en mode examen"
                    : "Mode pratique — réécoutes illimitées"}
                </div>
              </div>

              {/* Rate toggle — hidden in exam mode after play */}
              {!examLocked && (
                <div style={{ display: "flex", gap: 4 }}>
                  {[false, true].map((s) => (
                    <button
                      key={String(s)}
                      onClick={() => { if (!isPlaying && !isLoading) setSlow(s); }}
                      disabled={isPlaying || isLoading}
                      style={{
                        padding: "4px 9px", borderRadius: 5, fontSize: 11,
                        fontFamily: "var(--font-mono)", fontWeight: 600,
                        cursor: (isPlaying || isLoading) ? "not-allowed" : "pointer",
                        background: slow === s ? "#5b6af0" : "var(--bg-overlay)",
                        color: slow === s ? "white" : "var(--text-tertiary)",
                        border: slow === s ? "1px solid #5b6af0" : "1px solid var(--border-subtle)",
                        opacity: (isPlaying || isLoading) && slow !== s ? 0.5 : 1,
                      }}
                      title={s ? "Vitesse lente (72%)" : "Vitesse normale"}
                    >
                      {s ? "Lent" : "Normal"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <TcfPracticeTextHelp
            enabled={!examMode}
            skill="listening"
            cacheKey={practiceTranslationKey("listening", q.sourcePaper, q.sourceQuestionIndex)}
            frenchText={q.audioScript}
          />

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

              if (showFeedback) {
                if (isCorrect) { bg = "#22c55e18"; border = "#22c55e"; color = "#22c55e"; }
                else if (isSelected && !isCorrect) { bg = "#ef444418"; border = "#ef4444"; color = "#ef4444"; }
                else { color = "var(--text-tertiary)"; }
              } else if (isSelected) {
                bg = examMode ? "#5b6af018" : "#5b6af022";
                border = "#5b6af0";
              }

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(oi)}
                  disabled={!examMode && hasSelection}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 10,
                    cursor: !examMode && hasSelection ? "default" : "pointer",
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
                      background: showFeedback && isCorrect ? "#22c55e" : showFeedback && isSelected && !isCorrect ? "#ef4444" : "transparent",
                    }}
                  >
                    {showFeedback && isCorrect ? (
                      <Check size={12} color="white" />
                    ) : showFeedback && isSelected && !isCorrect ? (
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
          {showFeedback && (
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
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "space-between" }}>
          <button
            onClick={goPrev}
            disabled={idx === 0 || examMode}
            title={examMode ? "Retour désactivé en mode examen" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 10,
              fontSize: 13,
              color: (idx === 0 || examMode) ? "var(--text-tertiary)" : "var(--text-primary)",
              cursor: (idx === 0 || examMode) ? "not-allowed" : "pointer",
              opacity: (idx === 0 || examMode) ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={14} /> Précédent
          </button>

          <button
            onClick={examMode || hasSelection ? goNext : undefined}
            disabled={!examMode && !hasSelection}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: examMode || hasSelection ? "#5b6af0" : "var(--bg-overlay)",
              border: `1px solid ${examMode || hasSelection ? "#5b6af0" : "var(--border-subtle)"}`,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: examMode || hasSelection ? 600 : 400,
              color: examMode || hasSelection ? "white" : "var(--text-tertiary)",
              cursor: examMode || hasSelection ? "pointer" : "not-allowed",
              opacity: examMode || hasSelection ? 1 : 0.5,
            }}
          >
            {idx === 38 ? "Terminer" : "Suivant"} <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
