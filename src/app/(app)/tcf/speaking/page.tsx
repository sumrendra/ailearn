"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, RotateCcw, Mic, Square, Loader2, CheckCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { SPEAKING_PAPERS } from "@/lib/content/tcf-papers";
import { logTcfAttempt } from "@/lib/tcf-log-attempt";
import { scoreToNclcProduction } from "@/lib/tcf-program/nclc";
import { useTcfMockFlow } from "@/components/tcf/useTcfMockFlow";
import { TcfMockBanner, TcfMockCompleteBar } from "@/components/tcf/TcfMockUI";

const TASK_ACCENT = ["#ef4444", "#8b5cf6", "#3b82f6"];

interface EvalResult {
  score: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  transcript: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

type Phase = "select" | "prep" | "recording" | "evaluating" | "complete";

export default function TCFSpeakingPage() {
  const [paper, setPaper] = useState(1);
  const [phase, setPhase] = useState<Phase>("select");
  const [taskIdx, setTaskIdx] = useState(0);
  const [prepLeft, setPrepLeft] = useState(0);
  const [recLeft, setRecLeft] = useState(0);
  const [results, setResults] = useState<(EvalResult | null)[]>([null, null, null]);
  const [openResult, setOpenResult] = useState<number | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  /** Refs avoid stale closures when the recording timer fires or tasks chain. */
  const audioBlobsRef = useRef<(Blob | null)[]>([null, null, null]);
  const mimeTypesRef = useRef<(string | null)[]>([null, null, null]);
  const chunksRef = useRef<Blob[]>([]);
  const prepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptLoggedRef = useRef(false);
  const { isMock, mockPaper, bootedRef } = useTcfMockFlow("speaking");

  const tasks = SPEAKING_PAPERS[paper];
  const task = tasks[taskIdx];
  const accent = TASK_ACCENT[taskIdx];

  useEffect(() => {
    return () => {
      clearInterval(prepTimerRef.current!);
      clearInterval(recTimerRef.current!);
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function selectPaper(p: number) {
    setPaper(p);
    setTaskIdx(0);
    setResults([null, null, null]);
    audioBlobsRef.current = [null, null, null];
    mimeTypesRef.current = [null, null, null];
    setEvalError(null);
    const t = SPEAKING_PAPERS[p][0];
    if (t.prepSeconds > 0) {
      setPrepLeft(t.prepSeconds);
      setPhase("prep");
      startPrepTimer(t.prepSeconds);
    } else {
      setPhase("prep");
      setPrepLeft(0);
    }
  }

  useEffect(() => {
    if (!isMock || bootedRef.current) return;
    bootedRef.current = true;
    selectPaper(mockPaper);
  }, [isMock, mockPaper, bootedRef]);

  function startPrepTimer(seconds: number) {
    clearInterval(prepTimerRef.current!);
    let s = seconds;
    prepTimerRef.current = setInterval(() => {
      s--;
      setPrepLeft(s);
      if (s <= 0) {
        clearInterval(prepTimerRef.current!);
        startRecording();
      }
    }, 1000);
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl.split(",")[1] ?? "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const evaluateAll = useCallback(async (blobs: (Blob | null)[], mimes: (string | null)[]) => {
    setPhase("evaluating");
    try {
      const evalTasks = tasks.map(async (t, i) => {
        const blob = blobs[i];
        if (!blob || blob.size < 1000) {
          return {
            score: 0, fluency: 0, vocabulary: 0, grammar: 0, pronunciation: 0,
            transcript: "", feedback: "Aucun audio enregistré pour cette tâche.",
            strengths: [], improvements: ["Enregistrez une réponse vocale complète"],
          } as EvalResult;
        }
        const base64 = await blobToBase64(blob);

        const res = await fetch("/api/tcf/speaking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskNumber: t.type,
            taskPrompt: t.prompt,
            audioBase64: base64,
            mimeType: mimes[i] ?? blob.type ?? "audio/webm",
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(err.error ?? "Evaluation failed");
        }
        const data = await res.json() as EvalResult & { error?: string };
        if (typeof data.score !== "number") {
          throw new Error(data.error ?? "Invalid evaluation response");
        }
        return data;
      });

      const evals = await Promise.all(evalTasks);
      setResults(evals);
      setPhase("complete");
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : "Impossible d'obtenir l'évaluation. Veuillez réessayer.");
      setPhase("select");
    }
  }, [tasks]);

  const finishRecording = useCallback((currentTaskIdx: number) => {
    clearInterval(recTimerRef.current!);
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === "inactive") return;
    mr.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    mr.onstop = () => {
      const mime = mimeTypeRef.current;
      const blob = new Blob(chunksRef.current, { type: mime });
      const updated = [...audioBlobsRef.current];
      updated[currentTaskIdx] = blob;
      const updatedMimes = [...mimeTypesRef.current];
      updatedMimes[currentTaskIdx] = mime;
      audioBlobsRef.current = updated;
      mimeTypesRef.current = updatedMimes;

      if (currentTaskIdx < 2) {
        const nextTaskIdx = currentTaskIdx + 1;
        setTaskIdx(nextTaskIdx);
        const nextTask = tasks[nextTaskIdx];
        if (nextTask.prepSeconds > 0) {
          setPrepLeft(nextTask.prepSeconds);
          setPhase("prep");
          startPrepTimer(nextTask.prepSeconds);
        } else {
          setPhase("prep");
          setPrepLeft(0);
        }
      } else {
        evaluateAll(updated, updatedMimes);
      }
    };
  }, [tasks, evaluateAll]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      chunksRef.current = [];
      // Prefer webm/opus (Chrome/Firefox), fall back to mp4 (Safari), then bare webm
      const supported = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
      const mimeType = supported.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      mimeTypeRef.current = mimeType || "audio/webm";
      const mr = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32000, // ~240KB/min → stays well under 4.5MB Vercel limit
      });
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setPhase("recording");

      const t = tasks[taskIdx];
      let s = t.recordSeconds;
      setRecLeft(s);
      const capturedIdx = taskIdx;
      recTimerRef.current = setInterval(() => {
        s--;
        setRecLeft(s);
        if (s <= 0) {
          finishRecording(capturedIdx);
        }
      }, 1000);
    } catch {
      setEvalError("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  }, [tasks, taskIdx, finishRecording]);

  function stopEarly() {
    finishRecording(taskIdx);
  }

  function restart() {
    clearInterval(prepTimerRef.current!);
    clearInterval(recTimerRef.current!);
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("select");
    setTaskIdx(0);
    setResults([null, null, null]);
    audioBlobsRef.current = [null, null, null];
    mimeTypesRef.current = [null, null, null];
    setEvalError(null);
    attemptLoggedRef.current = false;
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (phase !== "complete" || attemptLoggedRef.current) return;
    const valid = results.filter((r): r is EvalResult => r != null && typeof r.score === "number");
    if (valid.length === 0) return;
    const minTaskScore = Math.min(...valid.map((r) => r.score));
    const avgTaskScore = Math.round(valid.reduce((s, r) => s + r.score, 0) / valid.length);
    attemptLoggedRef.current = true;
    logTcfAttempt({
      module: "speaking",
      paper,
      scoreRaw: avgTaskScore,
      scoreNclc: scoreToNclcProduction(minTaskScore),
    });
  }, [phase, results, paper]);

  // ── Paper Select ───────────────────────────────────────────────
  if (phase === "select") {
    return (
      <>
        <Topbar title="TCF Speaking" subtitle="Sélectionnez un examen" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px" }}>
            <span className="mono-overline" style={{ color: "#ef4444" }}>TCF Canada · Expression orale</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Choisissez votre examen blanc
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
              5 examens blancs de 3 tâches orales. Enregistrez vos réponses via le microphone — l&apos;IA évalue votre fluidité, vocabulaire, grammaire et prononciation (0–20).
            </p>
            <div style={{ padding: "10px 14px", background: "#ef444410", border: "1px solid #ef444422", borderRadius: 8, marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 4 }}>Autorisation microphone requise</div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Votre navigateur vous demandera l&apos;accès au microphone au début de la première tâche. Assurez-vous d&apos;être dans un endroit calme.
              </p>
            </div>

            {evalError && (
              <div style={{ padding: "10px 14px", background: "#ef444412", border: "1px solid #ef444433", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#ef4444" }}>
                {evalError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => selectPaper(p)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 10, cursor: "pointer", textAlign: "left",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#ef444410";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef444460";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: "#ef444415", border: "1px solid #ef444430",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: "#ef4444", flexShrink: 0,
                    }}>{p}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Examen blanc {p}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>3 tâches · ~12 min · Évaluation IA</div>
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)" />
                </button>
              ))}
            </div>

            <Link href="/tcf" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "10px", background: "transparent",
              border: "1px solid var(--border-subtle)", borderRadius: 8,
              fontSize: 13, color: "var(--text-secondary)", textDecoration: "none",
            }}>
              Retour au hub TCF
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Evaluating ─────────────────────────────────────────────────
  if (phase === "evaluating") {
    return (
      <>
        <Topbar title="TCF Speaking" subtitle="Évaluation en cours…" />
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Loader2 size={40} color="#ef4444" style={{ animation: "spin 1.2s linear infinite", marginBottom: 24 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", marginBottom: 10 }}>
            Analyse de vos productions orales
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            L&apos;IA transcrit et évalue vos 3 enregistrements.<br />Cela prend environ 20–40 secondes.
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────
  if (phase === "complete") {
    const validResults = results.filter((r): r is EvalResult => r != null && typeof r.score === "number");
    const totalScore = validResults.reduce((s, r) => s + r.score, 0);
    const maxScore = validResults.length * 20;
    const pct = Math.round((totalScore / maxScore) * 100);
    const minTaskScore = validResults.length ? Math.min(...validResults.map((r) => r.score)) : 0;
    const avgTaskScore = validResults.length ? Math.round(totalScore / validResults.length) : 0;

    const RUBRIC_LABELS = [
      { key: "fluency", label: "Aisance et fluidité" },
      { key: "vocabulary", label: "Vocabulaire" },
      { key: "grammar", label: "Grammaire" },
      { key: "pronunciation", label: "Prononciation" },
    ] as const;

    return (
      <>
        <Topbar title="TCF Speaking" subtitle={`Examen ${paper} · Résultats`} />
        <TcfMockBanner module="speaking" />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px", marginBottom: 20 }}>
            <TcfMockCompleteBar
              module="speaking"
              score={{ scoreRaw: avgTaskScore, scoreNclc: scoreToNclcProduction(minTaskScore) }}
            />
            <span className="mono-overline" style={{ color: "#ef4444" }}>Examen {paper} terminé</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 20px" }}>
              Score total : {totalScore} / {maxScore}
            </h1>
            <div style={{ height: 8, background: "var(--bg-overlay)", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 60 ? "#ef4444" : "#f59e0b", borderRadius: 4, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 20 }}>{pct}% · {totalScore}/{maxScore} pts</div>

            {/* IRCC context */}
            <div style={{ padding: "12px 16px", background: totalScore >= 30 ? "#22c55e0a" : "#f59e0b0a", border: `1px solid ${totalScore >= 30 ? "#22c55e22" : "#f59e0b22"}`, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: totalScore >= 30 ? "#22c55e" : "#f59e0b", marginBottom: 4 }}>
                Seuil IRCC — Expression orale
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Pour la Résidence permanente (Entrée express), NCLC 7 correspond à environ <strong>10–12 / 20</strong> par tâche orale.{" "}
                {totalScore >= 30 ? "Votre score global est dans la fourchette NCLC 7+." : "Visez ≥ 10/20 par tâche pour atteindre le seuil NCLC 7."}
              </p>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Développez chaque tâche pour voir la transcription de votre réponse, les scores détaillés et les conseils personnalisés.
            </p>
          </div>

          {tasks.map((t, i) => {
            const r = results[i];
            const isOpen = openResult === i;
            const ac = TASK_ACCENT[i];
            return (
              <div key={i} className="glass-pane" style={{ borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenResult(isOpen ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ac}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mic size={15} color={ac} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Tâche {i + 1} — {t.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>~{Math.round(t.recordSeconds / 60)} min</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {r && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: r.score >= 14 ? "#22c55e" : r.score >= 10 ? ac : "#ef4444" }}>
                        {r.score}/20
                      </div>
                    )}
                    {isOpen ? <ChevronUp size={14} color="var(--text-tertiary)" /> : <ChevronDown size={14} color="var(--text-tertiary)" />}
                  </div>
                </button>

                {isOpen && r && (
                  <div style={{ padding: "0 22px 22px", borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, marginBottom: 18 }}>
                      {RUBRIC_LABELS.map(({ key, label }) => {
                        const val = r[key as keyof EvalResult] as number;
                        return (
                          <div key={key}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
                              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{val}/5</span>
                            </div>
                            <div style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${(val / 5) * 100}%`, background: ac, borderRadius: 2 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ padding: "12px 16px", background: "var(--bg-overlay)", borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ac, marginBottom: 6 }}>Retour global</div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{r.feedback}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: "12px 14px", background: "#22c55e0a", border: "1px solid #22c55e22", borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Points forts</div>
                        {r.strengths.map((s, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                            <CheckCircle size={12} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "12px 14px", background: "#ef44440a", border: "1px solid #ef444422", borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>À améliorer</div>
                        {r.improvements.map((s, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #ef4444", flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {r.transcript && (
                      <details>
                        <summary style={{ fontSize: 11, color: "var(--text-tertiary)", cursor: "pointer", userSelect: "none" }}>
                          Voir la transcription
                        </summary>
                        <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.65 }}>
                          {r.transcript}
                        </p>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {!isMock && (
            <button onClick={restart} style={{
              flex: 1, padding: "12px", background: "var(--bg-overlay)", color: "var(--text-primary)",
              border: "1px solid var(--border-default)", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <RotateCcw size={14} /> Autre examen
            </button>
            )}
            {!isMock && (
            <Link href="/tcf" style={{
              flex: 1, padding: "12px", background: "#ef4444", color: "white",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
              textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              Hub TCF
            </Link>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Prep / Recording ───────────────────────────────────────────
  const isPrepping = phase === "prep" && task.prepSeconds > 0 && prepLeft > 0;
  const isReadyToRecord = phase === "prep" && (task.prepSeconds === 0 || prepLeft === 0);
  const isRecording = phase === "recording";

  const recPct = isRecording ? Math.round(((task.recordSeconds - recLeft) / task.recordSeconds) * 100) : 0;

  return (
    <>
      <Topbar
        title={`TCF Speaking · Examen ${paper}`}
        subtitle={`Tâche ${taskIdx + 1} / 3 · ${task.label}`}
      />

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Task progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < taskIdx ? accent : i === taskIdx ? accent : "var(--bg-overlay)",
              opacity: i < taskIdx ? 0.4 : 1,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <div className="glass-pane" style={{ borderRadius: 20, padding: "28px 32px", border: `1px solid ${accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: `${accent}22`, color: accent, padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-mono)",
            }}>
              Tâche {taskIdx + 1}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              {task.label}
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
              <Clock size={12} />
              {task.prepSeconds > 0 && <span>{Math.round(task.prepSeconds / 60)} min prep + </span>}
              <span>{Math.round(task.recordSeconds / 60)} min réponse</span>
            </div>
          </div>

          <div style={{ padding: "10px 14px", background: "var(--bg-overlay)", borderRadius: 8, marginBottom: 16, borderLeft: `3px solid ${accent}` }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{task.context}</p>
          </div>

          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.65, marginBottom: 20 }}>
            {task.prompt}
          </p>

          {/* Tips */}
          <div style={{ marginBottom: 24 }}>
            {task.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${accent}20`, border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: accent, fontFamily: "var(--font-mono)" }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Prep countdown */}
          {isPrepping && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#f59e0b", marginBottom: 10 }}>
                Temps de préparation
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                {formatTime(prepLeft)}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Préparez mentalement votre réponse. L&apos;enregistrement démarrera automatiquement.
              </p>
              <div style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden", marginTop: 16 }}>
                <div style={{ height: "100%", width: `${((task.prepSeconds - prepLeft) / task.prepSeconds) * 100}%`, background: "#f59e0b", borderRadius: 2, transition: "width 1s linear" }} />
              </div>
            </div>
          )}

          {/* Ready to record (no prep or prep done) */}
          {isReadyToRecord && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${accent}15`, border: `2px solid ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Mic size={32} color={accent} />
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
                {task.prepSeconds > 0
                  ? "Le temps de préparation est écoulé. Cliquez pour démarrer l'enregistrement."
                  : "Aucun temps de préparation pour cette tâche. Cliquez pour démarrer directement."}
              </p>
              <button
                onClick={startRecording}
                style={{
                  padding: "14px 32px", background: accent, color: "white",
                  border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, margin: "0 auto",
                }}
              >
                <Mic size={18} /> Démarrer l&apos;enregistrement
              </button>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-tertiary)" }}>
                Durée maximale : {formatTime(task.recordSeconds)}
              </div>
            </div>
          )}

          {/* Recording */}
          {isRecording && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 16px" }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: `${accent}15`, border: `2px solid ${accent}`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Mic size={28} color={accent} />
                </div>
              </div>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: accent, marginBottom: 4 }}>
                {formatTime(recLeft)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>
                Enregistrement en cours…
              </div>

              <div style={{ height: 4, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ height: "100%", width: `${recPct}%`, background: accent, borderRadius: 2, transition: "width 1s linear" }} />
              </div>

              <button
                onClick={stopEarly}
                style={{
                  padding: "10px 24px", background: "var(--bg-overlay)", color: "var(--text-primary)",
                  border: "1px solid var(--border-default)", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6, margin: "0 auto",
                }}
              >
                <Square size={14} /> Terminer l&apos;enregistrement
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 1; }
        }
      `}</style>
    </>
  );
}

