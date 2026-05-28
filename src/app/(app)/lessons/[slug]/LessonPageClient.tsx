"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, BookOpen, ListOrdered,
  CheckCircle2, Clock, X, ArrowLeft, Check, Loader2,
} from "lucide-react";
import { LessonViewer } from "@/components/learn/LessonViewer";
import { ShortcutsHelp } from "@/components/learn/ShortcutsHelp";
import { useLessonShortcuts } from "@/hooks/useLessonShortcuts";
import dynamic from "next/dynamic";

// Lazy-load the new clean diagrams (replace the old emoji-based ones)
const AttentionVisualizer   = dynamic(() => import("@/components/diagrams/AttentionVisualizer").then(m => ({ default: m.AttentionVisualizer })), { ssr: false });
const EmbeddingExplorer     = dynamic(() => import("@/components/diagrams/EmbeddingExplorer").then(m => ({ default: m.EmbeddingExplorer })), { ssr: false });
const TokenizationVisualizer= dynamic(() => import("@/components/diagrams/TokenizationVisualizer").then(m => ({ default: m.TokenizationVisualizer })), { ssr: false });
const RAGFlowExplorer       = dynamic(() => import("@/components/diagrams/RAGFlowExplorer").then(m => ({ default: m.RAGFlowExplorer })), { ssr: false });
const AgentLoopInteractive  = dynamic(() => import("@/components/diagrams/AgentLoopInteractive").then(m => ({ default: m.AgentLoopInteractive })), { ssr: false });

// Slug → diagram map. Each slug gets the diagram that best matches its concept.
// LLM lessons mostly inline diagrams via ```diagram-tokenization etc. fences in
// the lesson content; this map provides the *default* sidebar diagram per lesson.
const LESSON_DIAGRAMS: Record<string, React.ReactNode> = {
  // LLM Foundations
  "what-is-an-llm":                        <TokenizationVisualizer />,
  "transformer-architecture":              <AttentionVisualizer />,
  "tokenization-sampling-temperature":     <TokenizationVisualizer />,
  "attention-mechanism":                   <AttentionVisualizer />,
  "context-windows":                       <TokenizationVisualizer />,
  "prompt-engineering":                    <TokenizationVisualizer />,
  // RAG & Vector DBs
  "why-rag":                               <RAGFlowExplorer />,
  "embeddings-vector-search":              <EmbeddingExplorer />,
  "production-rag-pipeline":               <RAGFlowExplorer />,
  "chunking-strategies":                   <RAGFlowExplorer />,
  "vector-database-choices":               <EmbeddingExplorer />,
  "rag-evaluation":                        <RAGFlowExplorer />,
  // AI Agents
  "what-are-agents":                       <AgentLoopInteractive />,
  "tool-use-function-calling":             <AgentLoopInteractive />,
  "react-framework":                       <AgentLoopInteractive />,
  "agent-memory":                          <AgentLoopInteractive />,
  "multi-agent-systems":                   <AgentLoopInteractive />,
  "agent-reliability":                     <AgentLoopInteractive />,
};

interface Lesson {
  id: string; slug: string; title: string; order: number;
  estimatedMins: number | null; xpReward: number | null;
}

interface Props {
  lesson: {
    id: string; slug: string; title: string;
    content: string | null; estimatedMins: number | null; xpReward: number | null;
    tags: string[];
  };
  path: { slug: string; title: string };
  pathColors: { color: string; light: string; label: string };
  lessons: Lesson[];
  currentIdx: number;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  /** Whether the current lesson is already marked COMPLETED for this user */
  initialCompleted?: boolean;
  /** Set of slugs in this path the current user has completed */
  completedSlugs?: string[];
  /** Whether the user is signed in (controls whether the Mark complete CTA is shown) */
  isAuthed?: boolean;
}

export function LessonPageClient({
  lesson, path, pathColors, lessons, currentIdx, prevLesson, nextLesson,
  initialCompleted = false, completedSlugs = [], isAuthed = false,
}: Props) {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [completed, setCompleted] = useState(initialCompleted);
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => new Set(completedSlugs));
  const [marking, setMarking] = useState(false);
  const [justCompleted, setJustCompleted] = useState<{ xp: number } | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  // Refs for focus management: when the slide-over closes we restore focus to
  // the button that opened it (a11y best practice — keyboard users shouldn't
  // get stranded). `panelRef` lets us focus the first lesson link on open.
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const diagram = LESSON_DIAGRAMS[lesson.slug] ?? null;

  useEffect(() => { setMounted(true); }, []);

  // Resync when navigating between lessons (server re-renders with new props).
  useEffect(() => {
    setCompleted(initialCompleted);
    setCompletedSet(new Set(completedSlugs));
    setJustCompleted(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.slug]);

  // ── Per-path mesh tint ─────────────────────────────────────────────────────
  // The CanvasBackdrop reads `--path-tint` to bias its primary gradient blob
  // toward this path's color while the user is reading. We set it on
  // documentElement (so it cascades through to the fixed-position backdrop
  // which is outside this component's tree) and restore the default on
  // unmount / when the lesson navigates to a different path.
  useEffect(() => {
    const prev = document.documentElement.style.getPropertyValue("--path-tint");
    document.documentElement.style.setProperty("--path-tint", pathColors.color);
    return () => {
      // Restore previous inline value (if any), otherwise clear so the
      // stylesheet default (`--mesh-violet`) takes over again.
      if (prev) {
        document.documentElement.style.setProperty("--path-tint", prev);
      } else {
        document.documentElement.style.removeProperty("--path-tint");
      }
    };
  }, [pathColors.color]);

  // Mark the current lesson complete. Optimistic — flips local state first,
  // then POSTs. Rolls back if the server rejects.
  const markComplete = async () => {
    if (completed || marking || !isAuthed) return;
    setMarking(true);
    setCompleted(true);
    setCompletedSet((s) => {
      const next = new Set(s);
      next.add(lesson.slug);
      return next;
    });
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug: lesson.slug, status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJustCompleted({ xp: data?.awardedXP ?? 0 });
    } catch (err) {
      // Roll back optimistic state on failure.
      console.error("Failed to mark complete:", err);
      setCompleted(false);
      setCompletedSet((s) => {
        const next = new Set(s);
        next.delete(lesson.slug);
        return next;
      });
    } finally {
      setMarking(false);
    }
  };

  // Auto-dismiss the XP confetti banner.
  useEffect(() => {
    if (!justCompleted) return;
    const t = setTimeout(() => setJustCompleted(null), 4200);
    return () => clearTimeout(t);
  }, [justCompleted]);

  // Focus management for the slide-over lesson list.
  //   open  → focus the first lesson link in the panel
  //   close → return focus to the toggle button (only if it had been opened,
  //           so we don't snatch focus on the initial render).
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (panelOpen) {
      wasOpenRef.current = true;
      // Defer until after framer-motion animates the panel in.
      const t = setTimeout(() => {
        const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
        firstLink?.focus();
      }, 80);
      return () => clearTimeout(t);
    } else if (wasOpenRef.current) {
      toggleButtonRef.current?.focus();
    }
  }, [panelOpen]);

  // Wire the keyboard shortcuts to local handlers. Handlers are `undefined`
  // when the action isn't valid for the current state (e.g. no next lesson),
  // which the hook treats as "ignore this key".
  useLessonShortcuts({
    onPrev: prevLesson ? () => router.push(`/lessons/${prevLesson.slug}`) : undefined,
    onNext: nextLesson ? () => router.push(`/lessons/${nextLesson.slug}`) : undefined,
    onMarkComplete: !completed && isAuthed ? markComplete : undefined,
    onTogglePanel: () => setPanelOpen((v) => !v),
    onCloseOnEsc: panelOpen ? () => setPanelOpen(false) : undefined,
    onToggleHelp: () => setHelpOpen((v) => !v),
  });

  const completedCount = completedSet.size;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* ── Slim lesson topbar ───────────────────────────────────────────────
          Uses the shared `.glass-pane` utility — frosted blur, hairline-top
          highlight, no solid background tint. Reads as glass on the canvas
          mesh below; the mesh drifts into view through it. */}
      <div
        className="glass-pane"
        style={{
          height: 56, flexShrink: 0,
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 14,
          zIndex: 20,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        {/* Back */}
        <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
          <motion.div whileHover={{ x: -2 }} style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12.5, color: "var(--text-tertiary)", fontWeight: 500,
          }}>
            <ArrowLeft size={14} /> <span style={{ display: "flex", alignItems: "center" }}>Paths</span>
          </motion.div>
        </Link>

        <span style={{ color: "var(--border-default)", fontSize: 14 }}>/</span>

        {/* Path badge */}
        <span style={{
          fontSize: 12, fontWeight: 700, color: "#fff",
          background: pathColors.color,
          padding: "3px 10px", borderRadius: 999,
        }}>
          {pathColors.label}
        </span>

        <span style={{ color: "var(--border-default)", fontSize: 14 }}>/</span>

        {/* Current lesson title (truncated) */}
        <span style={{
          fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          flex: 1, minWidth: 0,
        }}>
          {lesson.title}
        </span>

        {/* Mark complete — only shown when signed in. Becomes a static
            "Completed" pill once marked. */}
        {isAuthed && (
          <motion.button
            whileHover={completed ? {} : { scale: 1.03 }}
            whileTap={completed ? {} : { scale: 0.97 }}
            onClick={markComplete}
            disabled={completed || marking}
            aria-pressed={completed}
            aria-label={
              completed
                ? "Lesson marked complete"
                : marking
                ? "Marking lesson complete"
                : "Mark this lesson complete"
            }
            title={completed ? "You've completed this lesson" : "Mark this lesson complete (M)"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 8, flexShrink: 0,
              background: completed ? "var(--success)" : "var(--accent)",
              border: "none",
              color: "#fff",
              fontSize: 12.5, fontWeight: 600,
              cursor: completed ? "default" : marking ? "wait" : "pointer",
              boxShadow: completed
                ? "0 2px 8px color-mix(in srgb, var(--success) 35%, transparent)"
                : "0 2px 8px color-mix(in srgb, var(--accent) 30%, transparent)",
              opacity: marking ? 0.85 : 1,
              transition: "all 0.18s",
            }}
          >
            {marking ? (
              <>
                <Loader2 size={13} className="spin-slow" /> Saving…
              </>
            ) : completed ? (
              <>
                <Check size={13} strokeWidth={3} /> Completed
              </>
            ) : (
              <>
                <CheckCircle2 size={13} /> Mark complete
              </>
            )}
          </motion.button>
        )}

        {/* Polite SR announcement for completion. Visually hidden but spoken
            by screen readers when `completed` flips true. */}
        <span
          aria-live="polite"
          style={{
            position: "absolute",
            width: 1, height: 1,
            padding: 0, margin: -1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {completed ? "Lesson marked complete" : ""}
        </span>

        {/* Lessons toggle button */}
        <motion.button
          ref={toggleButtonRef}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPanelOpen(v => !v)}
          aria-expanded={panelOpen}
          aria-haspopup="dialog"
          aria-label={panelOpen ? "Close lesson list" : "Open lesson list"}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8, flexShrink: 0,
            background: panelOpen ? pathColors.color : "var(--bg-sunken)",
            border: `1px solid ${panelOpen ? pathColors.color : "var(--border-subtle)"}`,
            color: panelOpen ? "#fff" : "var(--text-secondary)",
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <ListOrdered size={14} />
          <span>{completedCount}/{lessons.length} done</span>
        </motion.button>

        {/* Prev/next compact */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {prevLesson ? (
            <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.05 }} style={{
                width: 32, height: 32, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-sunken)", border: "1px solid var(--border-subtle)",
                cursor: "pointer", color: "var(--text-secondary)",
              }}>
                <ChevronLeft size={16} />
              </motion.div>
            </Link>
          ) : <div style={{ width: 32 }} />}

          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.05 }} style={{
                width: 32, height: 32, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: pathColors.color, color: "#fff",
                cursor: "pointer",
                boxShadow: `0 2px 8px ${pathColors.color}50`,
              }}>
                <ChevronRight size={16} />
              </motion.div>
            </Link>
          ) : (
            <Link href={`/learn/${path.slug}`} style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.05 }} style={{
                height: 32, padding: "0 12px", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 5,
                background: pathColors.color, color: "#fff",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}>
                <BookOpen size={12} /> Done
              </motion.div>
            </Link>
          )}
        </div>
      </div>

      {/* ── Slide-over lesson panel + backdrop (portalled to body) ─────────── */}
      {mounted && createPortal(
        <AnimatePresence>
          {panelOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPanelOpen(false)}
                aria-label="Close lesson list"
                style={{
                  position: "fixed", inset: 0, zIndex: 9990,
                  background: "hsl(220 20% 2% / 0.55)",
                  backdropFilter: "blur(4px)",
                }}
              />

              {/* Panel */}
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Lesson list"
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 38 }}
                style={{
                  position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 9999,
                  width: 320,
                  background: "var(--bg-surface)",
                  borderRight: "1px solid var(--border-subtle)",
                  boxShadow: "12px 0 48px hsl(220 30% 2% / 0.45)",
                  display: "flex", flexDirection: "column",
                  overflowY: "auto",
                }}
              >
                {/* Panel header */}
                <div style={{
                  padding: "16px 16px 12px",
                  background: pathColors.light,
                  borderBottom: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: pathColors.color, marginBottom: 4 }}>
                        Learning path
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25 }}>
                        {path.title}
                      </div>
                    </div>
                    <button
                      onClick={() => setPanelOpen(false)}
                      aria-label="Close lesson list"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 4, borderRadius: 6 }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Progress bar — uses real per-user completion data */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-tertiary)", marginBottom: 5 }}>
                      <span>{completedCount} of {lessons.length} done</span>
                      <span style={{ fontWeight: 600, color: pathColors.color }}>
                        {Math.round((completedCount / lessons.length) * 100)}%
                      </span>
                    </div>
                    <div style={{ height: 5, background: "var(--bg-tertiary)", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((completedCount / lessons.length) * 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ height: "100%", background: pathColors.color, borderRadius: 99 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lesson list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                  {lessons.map((l, idx) => {
                    const isCurrent = l.slug === lesson.slug;
                    // "Done" is a per-user fact (completedSet) not a position
                    // in the path. A user might skip ahead, or finish out of
                    // order, and we want the green checkmark to reflect what
                    // they've actually marked complete.
                    const isDone   = completedSet.has(l.slug);
                    const isFuture = idx > currentIdx && !isDone;
                    return (
                      <Link key={l.id} href={`/lessons/${l.slug}`} style={{ textDecoration: "none" }}
                        onClick={() => setPanelOpen(false)}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "10px 14px",
                            background: isCurrent ? pathColors.light : "transparent",
                            borderLeft: isCurrent ? `3px solid ${pathColors.color}` : "3px solid transparent",
                            opacity: isFuture ? 0.5 : 1,
                            transition: "background 0.12s",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isDone ? "var(--success)" : isCurrent ? pathColors.color : "transparent",
                            border: `2px solid ${isDone ? "var(--success)" : isCurrent ? pathColors.color : "var(--border-default)"}`,
                            fontSize: 10, fontWeight: 700,
                            color: (isDone || isCurrent) ? "#fff" : "var(--text-tertiary)",
                          }}>
                            {isDone ? <CheckCircle2 size={13} strokeWidth={2.5} /> : <span>{idx + 1}</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 12.5, lineHeight: 1.4,
                              color: isCurrent ? pathColors.color : isDone ? "var(--text-secondary)" : "var(--text-tertiary)",
                              fontWeight: isCurrent ? 600 : 400,
                              overflow: "hidden", textOverflow: "ellipsis",
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                            }}>
                              {l.title}
                            </div>
                            {l.estimatedMins && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "var(--text-tertiary)", marginTop: 3 }}>
                                <Clock size={9} /> {l.estimatedMins} min
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* XP celebration banner — appears for ~4s after marking complete */}
      {mounted && createPortal(
        <AnimatePresence>
          {justCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              style={{
                position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
                zIndex: 10000,
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 20px",
                background: "var(--bg-card)",
                border: `1.5px solid var(--success)`,
                borderRadius: 999,
                boxShadow: "0 10px 32px color-mix(in srgb, var(--success) 30%, transparent)",
                fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)",
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "var(--success)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Check size={14} color="#fff" strokeWidth={3} />
              </div>
              <span>Lesson complete!</span>
              {justCompleted.xp > 0 && (
                <span style={{
                  padding: "2px 10px", borderRadius: 999,
                  background: "color-mix(in srgb, var(--success) 12%, transparent)",
                  color: "var(--success)", fontWeight: 700, fontSize: 12.5,
                }}>
                  +{justCompleted.xp} XP
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Keyboard shortcuts help overlay (own portal). */}
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <LessonViewer
          content={lesson.content ?? "No content available for this lesson yet."}
          lessonTitle={lesson.title}
          lessonSlug={lesson.slug}
          pathName={path.title}
          pathSlug={path.slug}
          pathColor={pathColors.color}
          estimatedMins={lesson.estimatedMins}
          xpReward={lesson.xpReward}
          lessonIndex={currentIdx}
          totalLessons={lessons.length}
          tags={lesson.tags}
          diagramComponent={diagram}
          prevLesson={prevLesson ? { title: prevLesson.title, slug: prevLesson.slug } : null}
          nextLesson={nextLesson ? { title: nextLesson.title, slug: nextLesson.slug } : null}
          isCompleted={completed}
          onMarkComplete={isAuthed ? markComplete : undefined}
          marking={marking}
        />
      </div>
    </div>
  );
}
