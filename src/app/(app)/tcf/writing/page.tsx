"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, RotateCcw, PenLine, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";

interface WritingTask {
  type: 1 | 2 | 3;
  register: string;
  minWords: number;
  maxWords: number;
  timeMin: number;
  context: string;
  prompt: string;
}

const PAPERS: Record<number, WritingTask[]> = {
  1: [
    {
      type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
      context: "Votre ami(e) français(e) vous a envoyé un message pour vous demander comment se passe votre apprentissage du français au Canada.",
      prompt: "Répondez à votre ami(e). Parlez-lui de vos progrès, d'une expérience récente en français et de vos objectifs.",
    },
    {
      type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
      context: "Vous faites partie de l'association de votre quartier. La présidente vous demande d'écrire un article pour la newsletter mensuelle.",
      prompt: "Rédigez un article sur un événement communautaire récent auquel vous avez participé. Décrivez l'événement, son intérêt pour le quartier et encouragez la participation future.",
    },
    {
      type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
      context: "Votre ville souhaite développer de nouveaux espaces verts. La mairie a lancé un appel à propositions des citoyens.",
      prompt: "Écrivez une lettre au maire pour proposer la création d'un jardin communautaire dans votre quartier. Exposez les bénéfices pour les résidents et demandez le soutien de la municipalité.",
    },
  ],
  2: [
    {
      type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
      context: "Vous avez manqué votre cours de français la semaine dernière en raison d'un imprévu.",
      prompt: "Écrivez un message à votre professeur pour expliquer votre absence, vous excuser et lui demander les devoirs à rattraper.",
    },
    {
      type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
      context: "Le blog de votre école de langues organise un débat en ligne sur l'utilisation des technologies dans l'apprentissage.",
      prompt: "Rédigez une contribution pour ce blog. Donnez votre opinion sur l'utilisation des applications et des outils numériques pour apprendre une langue. Appuyez-vous sur des exemples concrets.",
    },
    {
      type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
      context: "Vous avez récemment acheté un appareil électronique qui s'est révélé défectueux. Vos tentatives de contact par téléphone ont été infructueuses.",
      prompt: "Rédigez une lettre de réclamation au service client de la société. Décrivez le problème, expliquez les démarches déjà effectuées et demandez une solution (remboursement ou échange).",
    },
  ],
  3: [
    {
      type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
      context: "Un(e) nouveau(elle) collègue vient de rejoindre votre équipe. Vous souhaitez l'accueillir chaleureusement.",
      prompt: "Envoyez-lui un message pour l'inviter à un déjeuner d'équipe que vous organisez la semaine prochaine. Donnez les détails pratiques et expliquez pourquoi c'est une bonne occasion pour faire connaissance.",
    },
    {
      type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
      context: "Un magazine en ligne francophone publie des guides sur les villes canadiennes pour les nouveaux arrivants.",
      prompt: "Rédigez un article sur une ville canadienne que vous connaissez bien. Présentez ses atouts, sa vie culturelle et les ressources utiles pour les francophones qui s'y installent.",
    },
    {
      type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
      context: "Vous venez d'être admis dans une université canadienne. Vous souhaitez obtenir des informations sur les services d'accompagnement linguistique.",
      prompt: "Écrivez une lettre formelle au Bureau des étudiants internationaux pour demander des renseignements sur les services de soutien en français disponibles pour les étudiants non-natifs.",
    },
  ],
  4: [
    {
      type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
      context: "Votre ami(e) va déménager dans une nouvelle ville pour la première fois. Il/elle vous demande des conseils.",
      prompt: "Écrivez-lui un message avec vos meilleurs conseils pour bien s'installer. Parlez des démarches administratives, des ressources utiles et de la façon de rencontrer des gens.",
    },
    {
      type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
      context: "Un magazine de voyage francophone cherche des contributeurs pour présenter des destinations dans le monde francophone.",
      prompt: "Rédigez un article recommandant une destination francophone (ville, région ou pays) que vous avez visitée ou qui vous inspire. Décrivez ce que les voyageurs francophones peuvent y découvrir.",
    },
    {
      type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
      context: "Votre bibliothèque municipale souhaite élargir ses activités pour mieux servir les nouveaux arrivants francophones.",
      prompt: "Rédigez une lettre au directeur de la bibliothèque pour proposer la création d'un club de lecture en français destiné aux immigrants. Présentez les objectifs, le fonctionnement proposé et les bénéfices pour la communauté.",
    },
  ],
  5: [
    {
      type: 1, register: "Informel", minWords: 60, maxWords: 120, timeMin: 15,
      context: "Vous souhaitez rejoindre un groupe d'échange linguistique en ligne pour pratiquer votre français avec des natifs.",
      prompt: "Rédigez un message de présentation pour la page d'inscription du groupe. Présentez-vous, expliquez votre niveau et vos objectifs, et dites pourquoi vous souhaitez participer.",
    },
    {
      type: 2, register: "Semi-formel", minWords: 120, maxWords: 150, timeMin: 20,
      context: "Le blog communautaire de votre ville publie des articles sur l'environnement local. Vous avez remarqué un problème dans votre quartier.",
      prompt: "Rédigez un billet de blog sur un problème environnemental local (déchets, pollution, manque d'espaces verts…). Décrivez le problème, ses causes et proposez des solutions concrètes.",
    },
    {
      type: 3, register: "Formel", minWords: 120, maxWords: 180, timeMin: 25,
      context: "Vous avez trouvé une offre d'emploi pour un poste de conseiller(ère) clientèle dans une entreprise bilingue qui valorise les compétences en français.",
      prompt: "Rédigez une lettre de motivation formelle pour ce poste. Présentez vos compétences linguistiques et professionnelles, expliquez votre intérêt pour ce rôle et démontrez votre adéquation au profil recherché.",
    },
  ],
};

const TASK_ACCENT = ["#f59e0b", "#3b82f6", "#a855f7"];
const TASK_LABEL = ["Tâche 1", "Tâche 2", "Tâche 3"];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface EvalResult {
  score: number;
  taskCompletion: number;
  coherence: number;
  vocabulary: number;
  grammar: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  wordCount: number;
}

type Phase = "select" | "writing" | "evaluating" | "complete";

export default function TCFWritingPage() {
  const [paper, setPaper] = useState(1);
  const [phase, setPhase] = useState<Phase>("select");
  const [taskIdx, setTaskIdx] = useState(0);
  const [responses, setResponses] = useState(["", "", ""]);
  const [results, setResults] = useState<(EvalResult | null)[]>([null, null, null]);
  const [evalError, setEvalError] = useState<string | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openResult, setOpenResult] = useState<number | null>(null);

  const tasks = PAPERS[paper];
  const task = tasks[taskIdx];
  const currentWords = wordCount(responses[taskIdx]);
  const isMinMet = currentWords >= task.minWords;
  const isOverMax = currentWords > task.maxWords;

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) { clearInterval(timerRef.current!); setTimerRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  function startPaper(p: number) {
    setPaper(p);
    setTaskIdx(0);
    setResponses(["", "", ""]);
    setResults([null, null, null]);
    setEvalError(null);
    setSecondsLeft(60 * 60);
    setTimerRunning(false);
    setPhase("writing");
  }

  function restart() {
    setPhase("select");
    setTaskIdx(0);
    setResponses(["", "", ""]);
    setResults([null, null, null]);
    setEvalError(null);
    setSecondsLeft(60 * 60);
    setTimerRunning(false);
  }

  function handleChange(val: string) {
    if (!timerRunning) setTimerRunning(true);
    const updated = [...responses];
    updated[taskIdx] = val;
    setResponses(updated);
  }

  async function submitAndNext() {
    if (taskIdx < 2) {
      setTaskIdx(taskIdx + 1);
      setTimeout(() => textareaRef.current?.focus(), 100);
      return;
    }
    // Last task — submit all for evaluation
    setPhase("evaluating");
    setTimerRunning(false);
    try {
      const allTasks = PAPERS[paper];
      const evals = await Promise.all(
        allTasks.map((t, i) =>
          fetch("/api/tcf/writing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskNumber: t.type,
              taskPrompt: t.prompt,
              response: responses[i],
              minWords: t.minWords,
              maxWords: t.maxWords,
            }),
          }).then((r) => r.json())
        )
      );
      setResults(evals);
      setPhase("complete");
    } catch {
      setEvalError("Impossible d'obtenir l'évaluation. Veuillez réessayer.");
      setPhase("writing");
      setTaskIdx(2);
    }
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerColor = secondsLeft < 300 ? "#ef4444" : secondsLeft < 600 ? "#f59e0b" : "var(--text-tertiary)";

  // ── Paper Select ───────────────────────────────────────────────
  if (phase === "select") {
    return (
      <>
        <Topbar title="TCF Writing" subtitle="Sélectionnez un examen" />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px" }}>
            <span className="mono-overline" style={{ color: "#f59e0b" }}>TCF Canada · Expression écrite</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
              Choisissez votre examen blanc
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
              5 examens blancs, chacun avec 3 tâches d&apos;écriture progressives. Vos réponses sont évaluées par IA selon les critères officiels TCF (0–20).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => startPaper(p)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 10, cursor: "pointer", textAlign: "left",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b10";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b60";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: "#f59e0b15", border: "1px solid #f59e0b30",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: "#f59e0b", flexShrink: 0,
                    }}>{p}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Examen blanc {p}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>3 tâches · 60 min · Évaluation IA</div>
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
        <Topbar title="TCF Writing" subtitle="Évaluation en cours…" />
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Loader2 size={40} color="#f59e0b" style={{ animation: "spin 1.2s linear infinite", marginBottom: 24 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", marginBottom: 10 }}>
            Évaluation de vos productions
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            L&apos;IA analyse vos 3 tâches selon les critères officiels TCF.<br />Cela prend environ 15–30 secondes.
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────
  if (phase === "complete") {
    const validResults = results.filter(Boolean) as EvalResult[];
    const totalScore = validResults.reduce((s, r) => s + r.score, 0);
    const maxScore = validResults.length * 20;
    const pct = Math.round((totalScore / maxScore) * 100);

    const RUBRIC_LABELS = [
      { key: "taskCompletion", label: "Réalisation de la tâche" },
      { key: "coherence", label: "Cohérence et organisation" },
      { key: "vocabulary", label: "Vocabulaire" },
      { key: "grammar", label: "Grammaire" },
    ] as const;

    return (
      <>
        <Topbar title="TCF Writing" subtitle={`Examen ${paper} · Résultats`} />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="glass-pane" style={{ borderRadius: 20, padding: "36px 36px 32px", marginBottom: 20 }}>
            <span className="mono-overline" style={{ color: "#f59e0b" }}>Examen {paper} terminé</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-primary)", margin: "10px 0 20px" }}>
              Score total : {totalScore} / {maxScore}
            </h1>
            <div style={{ height: 8, background: "var(--bg-overlay)", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 60 ? "#f59e0b" : pct >= 40 ? "#ef4444" : "#ef4444", borderRadius: 4, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 24 }}>{pct}% · {totalScore}/{maxScore} pts</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Développez chaque tâche ci-dessous pour voir les scores détaillés, la transcription de vos points forts et les axes d&apos;amélioration.
            </p>
          </div>

          {tasks.map((t, i) => {
            const r = results[i];
            const isOpen = openResult === i;
            const accent = TASK_ACCENT[i];
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
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PenLine size={15} color={accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{TASK_LABEL[i]} — {t.register}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>{t.minWords}–{t.maxWords} mots</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {r && (
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700,
                        color: r.score >= 14 ? "#22c55e" : r.score >= 10 ? accent : "#ef4444",
                      }}>
                        {r.score}/20
                      </div>
                    )}
                    {isOpen ? <ChevronUp size={14} color="var(--text-tertiary)" /> : <ChevronDown size={14} color="var(--text-tertiary)" />}
                  </div>
                </button>

                {isOpen && r && (
                  <div style={{ padding: "0 22px 22px", borderTop: "1px solid var(--border-subtle)" }}>
                    {/* Rubric bars */}
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
                              <div style={{ height: "100%", width: `${(val / 5) * 100}%`, background: accent, borderRadius: 2 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    <div style={{ padding: "12px 16px", background: "var(--bg-overlay)", borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: 6 }}>Retour global</div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{r.feedback}</p>
                    </div>

                    {/* Strengths / improvements */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ padding: "12px 14px", background: "#22c55e0a", border: "1px solid #22c55e22", borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Points forts</div>
                        {r.strengths.map((s, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                            <CheckCircle size={12} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "12px 14px", background: "#f59e0b0a", border: "1px solid #f59e0b22", borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>À améliorer</div>
                        {r.improvements.map((s, j) => (
                          <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #f59e0b", flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Original response */}
                    <details style={{ marginTop: 14 }}>
                      <summary style={{ fontSize: 11, color: "var(--text-tertiary)", cursor: "pointer", userSelect: "none" }}>
                        Voir votre réponse ({r.wordCount} mots)
                      </summary>
                      <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                        {responses[i]}
                      </p>
                    </details>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={restart} style={{
              flex: 1, padding: "12px", background: "var(--bg-overlay)", color: "var(--text-primary)",
              border: "1px solid var(--border-default)", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <RotateCcw size={14} /> Autre examen
            </button>
            <Link href="/tcf" style={{
              flex: 1, padding: "12px", background: "#f59e0b", color: "white",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              Hub TCF
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── Writing ────────────────────────────────────────────────────
  const accent = TASK_ACCENT[taskIdx];
  const wordPct = Math.min(100, (currentWords / task.maxWords) * 100);
  const wordColor = isOverMax ? "#ef4444" : isMinMet ? "#22c55e" : "#f59e0b";

  return (
    <>
      <Topbar
        title={`TCF Writing · Examen ${paper}`}
        subtitle={`${TASK_LABEL[taskIdx]} / 3 · ${task.register}`}
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
              title={timerRunning ? "Pause" : "Démarrer"}
            >
              {mm}:{ss}
            </button>
          </div>
        }
      />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 80px" }}>
        {/* Task progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < taskIdx ? accent : i === taskIdx ? accent : "var(--bg-overlay)",
                opacity: i < taskIdx ? 0.4 : 1,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Task card */}
        <div className="glass-pane" style={{ borderRadius: 16, padding: "24px 28px", marginBottom: 16, border: `1px solid ${accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: `${accent}22`, color: accent, padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-mono)",
            }}>
              {TASK_LABEL[taskIdx]}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{task.register} · {task.minWords}–{task.maxWords} mots · ~{task.timeMin} min</span>
          </div>

          <div style={{ padding: "10px 14px", background: "var(--bg-overlay)", borderRadius: 8, marginBottom: 14, borderLeft: `3px solid ${accent}` }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{task.context}</p>
          </div>

          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 20 }}>
            {task.prompt}
          </p>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={responses[taskIdx]}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Rédigez votre réponse ici…"
            rows={10}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "14px 16px",
              background: "var(--bg-surface)",
              border: `1.5px solid ${isOverMax ? "#ef4444" : isMinMet ? "#22c55e44" : "var(--border-default)"}`,
              borderRadius: 10,
              fontSize: 14,
              color: "var(--text-primary)",
              lineHeight: 1.65,
              resize: "vertical",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />

          {/* Word count bar */}
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 3, background: "var(--bg-overlay)", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${wordPct}%`, background: wordColor, borderRadius: 2, transition: "all 0.2s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: wordColor, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                {currentWords} mot{currentWords !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                {isOverMax ? `⚠ Dépassement (max ${task.maxWords})` : isMinMet ? `✓ Minimum atteint` : `Minimum : ${task.minWords} mots`}
              </span>
            </div>
          </div>

          {evalError && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#ef444412", border: "1px solid #ef444433", borderRadius: 8, fontSize: 13, color: "#ef4444" }}>
              {evalError}
            </div>
          )}
        </div>

        <button
          onClick={isMinMet ? submitAndNext : undefined}
          disabled={!isMinMet}
          style={{
            width: "100%", padding: "14px",
            background: isMinMet ? accent : "var(--bg-overlay)",
            border: `1px solid ${isMinMet ? accent : "var(--border-subtle)"}`,
            borderRadius: 12, fontSize: 15, fontWeight: 600,
            color: isMinMet ? "white" : "var(--text-tertiary)",
            cursor: isMinMet ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s ease",
          }}
        >
          {taskIdx < 2 ? (
            <><PenLine size={16} /> Passer à la tâche {taskIdx + 2} <ChevronRight size={16} /></>
          ) : (
            <><CheckCircle size={16} /> Soumettre et obtenir l&apos;évaluation</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
