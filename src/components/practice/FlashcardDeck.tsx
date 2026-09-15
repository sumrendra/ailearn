"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen, Volume2, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PracticeStage } from "./PracticeStage";
import { Kbd } from "./Kbd";
import { speak } from "@/lib/french-tts";

type Card = {
  id: string;
  front: string;
  back: string;
  englishHint?: string | null;
  tags: string[];
  lessonTitle: string | null;
  lessonSlug: string | null;
};

type Rating = "Again" | "Hard" | "Good" | "Easy";

/** SM-2 rating semantics — kept verbatim for compatibility with persistence. */
const RATINGS: { key: string; label: Rating; tint: string }[] = [
  { key: "1", label: "Again", tint: "var(--danger)" },
  { key: "2", label: "Hard",  tint: "var(--warning)" },
  { key: "3", label: "Good",  tint: "var(--success)" },
  { key: "4", label: "Easy",  tint: "var(--accent)" },
];

const FLIP_DURATION = 0.36; // seconds, matches the 360ms in the brief
const FLIP_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * `usePrefersReducedMotion()` — boolean snapshot of the user's preference,
 * read through useSyncExternalStore so we never set state inside an effect.
 * The flip is a 3D rotation; reduced motion swaps it for a cross-fade.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false, // server snapshot — assume motion is fine, hydrate from MQ on client
  );
}

interface Props {
  lessonSlug?: string;
  themeId?: string;
  bandId?: string;
  packId?: string;
  coreTopicId?: string;
  cardKeys?: string;
  deckName?: string;
}

export function FlashcardDeck({
  lessonSlug,
  themeId,
  bandId,
  packId,
  coreTopicId,
  cardKeys,
  deckName = "All flashcards",
}: Props) {
  type DeckState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; cards: Card[] };

  const [deck, setDeck] = useState<DeckState>({ status: "loading" });
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [streak, setStreak] = useState(0); // consecutive Good/Easy in this session
  const [showEnHint, setShowEnHint] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch deck on mount / lessonSlug change. Keeps the existing API contract.
  // setState is wrapped in an async callback to stay clear of the
  // react-hooks/set-state-in-effect lint guard.
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (lessonSlug) params.set("lesson", lessonSlug);
    if (themeId) params.set("theme", themeId);
    if (bandId) params.set("band", bandId);
    if (packId) params.set("pack", packId);
    if (coreTopicId) params.set("coreTopic", coreTopicId);
    if (cardKeys) params.set("keys", cardKeys);
    const url = params.size ? `/api/flashcards?${params}` : "/api/flashcards";

    const load = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        setDeck({ status: "ready", cards: data.cards ?? [] });
      } catch {
        if (cancelled) return;
        setDeck({ status: "error", message: "Couldn't load your deck. Refresh to try again." });
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [lessonSlug, themeId, bandId, packId, coreTopicId, cardKeys]);

  const loading = deck.status === "loading";
  const error = deck.status === "error" ? deck.message : null;
  const cards = deck.status === "ready" ? deck.cards : [];

  const card = cards[idx];

  const rate = useCallback((rating: Rating) => {
    const cardKey = cards[idx]?.id;
    if (cardKey) {
      void fetch("/api/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardKey,
          rating: { Again: 1, Hard: 2, Good: 3, Easy: 4 }[rating],
        }),
      }).catch(() => {});
    }
    setStats((prev) => ({ ...prev, [rating.toLowerCase()]: prev[rating.toLowerCase() as keyof typeof prev] + 1 }));
    setStreak((s) => (rating === "Good" || rating === "Easy" ? s + 1 : 0));
    if (idx >= cards.length - 1) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setShowEnHint(false);
    }
  }, [idx, cards.length, cards]);

  const reset = useCallback(() => {
    setIdx(0);
    setFlipped(false);
    setDone(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
    setStreak(0);
  }, []);

  // Global keyboard map for the deck. Active only while a card is loaded
  // and we haven't hit the end-of-session screen.
  useEffect(() => {
    if (loading || done || !card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFlipped(false);
        return;
      }
      if (flipped) {
        if (e.key === "1") { e.preventDefault(); rate("Again"); }
        else if (e.key === "2") { e.preventDefault(); rate("Hard"); }
        else if (e.key === "3") { e.preventDefault(); rate("Good"); }
        else if (e.key === "4") { e.preventDefault(); rate("Easy"); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, rate, loading, done, card]);

  // Compute a coarse next-review date for the end card. SM-2 is server-side
  // for persisted decks; this is purely an in-session hint.
  const nextReviewLabel = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, []);

  // --- States --------------------------------------------------------------

  if (loading) {
    return (
      <PracticeStage variant="quiz">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "32px 0",
          }}
        >
          <Loader2 size={28} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
          <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading deck…</div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </PracticeStage>
    );
  }

  if (error) {
    return (
      <PracticeStage variant="quiz">
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="mono-overline" style={{ color: "var(--danger)" }}>Error</span>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{error}</p>
        </div>
      </PracticeStage>
    );
  }

  if (cards.length === 0) {
    return (
      <PracticeStage
        variant="quiz"
        above={
          <div style={{ textAlign: "center" }}>
            <span className="mono-overline">Flashcards</span>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "20px 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.2,
              color: "var(--text-primary)",
              margin: 0,
              textAlign: "center",
            }}
          >
            No cards due. Come back tomorrow.
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              margin: 0,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.02em",
            }}
          >
            Next review · {nextReviewLabel}
          </p>
          <Link
            href="/learn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 18px",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 13,
              textDecoration: "none",
              marginTop: 4,
            }}
          >
            <BookOpen size={14} /> Browse decks
          </Link>
        </div>
      </PracticeStage>
    );
  }

  if (done) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    const known = stats.good + stats.easy;
    const toRevisit = stats.again + stats.hard;
    return (
      <PracticeStage
        variant="quiz"
        above={
          <div style={{ textAlign: "center" }}>
            <span className="mono-overline">Session complete · {deckName}</span>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 8 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 56,
              lineHeight: 1,
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            <span style={{ color: "var(--accent)" }}>{known}</span>
            <span style={{ color: "var(--text-tertiary)" }}> / {total}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {known} known · {toRevisit} to revisit
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {RATINGS.map((r) => (
            <div
              key={r.label}
              style={{
                padding: "14px 10px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 20,
                  fontWeight: 500,
                  color: r.tint,
                }}
              >
                {stats[r.label.toLowerCase() as keyof typeof stats]}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  marginTop: 4,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {r.label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="hairline-t"
          style={{ paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Next review · {nextReviewLabel}
          </span>
          <button
            onClick={reset}
            style={{
              padding: "11px 18px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Review again
          </button>
        </div>
      </PracticeStage>
    );
  }

  // --- Mid-session: flashcard --------------------------------------------

  return (
    <PracticeStage
      variant="card"
      cardStyle={{
        // The card sets its own perspective so the inner flip rig rotates
        // around an axis that *feels* held rather than perpendicular.
        perspective: 1400,
        background: "transparent",
        boxShadow: "none",
        border: "none",
        padding: 0,
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
      above={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span
            className="mono-overline"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {idx + 1} / {cards.length} · {deckName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Streak · {streak}
          </span>
        </div>
      }
      below={
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {flipped ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {RATINGS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => rate(r.label)}
                  className="glow-ring"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "12px 8px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: r.tint,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <span>{r.label}</span>
                  <Kbd tint={r.tint}>{r.key}</Kbd>
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 12,
                color: "var(--text-tertiary)",
                padding: "4px 0",
              }}
            >
              Press <Kbd>Space</Kbd> to flip
            </div>
          )}
          {card?.lessonTitle && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-tertiary)",
                textAlign: "center",
                letterSpacing: "0.06em",
              }}
            >
              From {card.lessonTitle}
            </div>
          )}
        </div>
      }
    >
      {/* Flip rig. The outer element is the stage card (transparent); we
       * render front+back faces and rotate via framer-motion. */}
      <FlipRig
        flipped={flipped}
        reducedMotion={reducedMotion}
        onClick={() => setFlipped((f) => !f)}
        front={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {card?.englishHint ? "En français — sens en anglais ?" : "Question"}
            </div>
            <div
              style={{
                fontFamily: card?.englishHint ? "var(--font-sans)" : "var(--font-display)",
                fontSize: card?.englishHint ? 26 : 30,
                fontWeight: card?.englishHint ? 600 : 400,
                color: "var(--text-primary)",
                lineHeight: 1.35,
                letterSpacing: card?.englishHint ? "0" : "-0.005em",
                textAlign: "center",
              }}
            >
              {card?.front}
            </div>
            {card?.englishHint && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void speak(card.front);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-overlay)",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Volume2 size={14} /> Écouter
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEnHint((v) => !v);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border-subtle)",
                    background: showEnHint ? "var(--accent-soft)" : "var(--bg-overlay)",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  {showEnHint ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showEnHint ? "Masquer l'indice" : "Indice EN"}
                </button>
              </div>
            )}
            {showEnHint && card?.englishHint && (
              <p style={{ fontSize: 14, color: "var(--accent)", margin: 0, fontWeight: 600 }}>{card.englishHint}</p>
            )}
          </div>
        }
        back={
          <div
            style={{
              fontSize: 17,
              color: "var(--text-primary)",
              lineHeight: 1.6,
              fontFamily: "var(--font-sans)",
            }}
            className="prose"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{card?.back ?? ""}</ReactMarkdown>
          </div>
        }
        cardRef={cardRef}
      />
    </PracticeStage>
  );
}

/**
 * The 3D rig. Front and back faces share a 520x340 frame; the outer wrapper
 * gets the .glass-pane + glow + shadow so the card reads as one held object
 * regardless of which face is showing. The flip is the one allowed 3D
 * transform on the surface — gated by prefers-reduced-motion.
 */
function FlipRig({
  flipped,
  reducedMotion,
  onClick,
  front,
  back,
  cardRef,
}: {
  flipped: boolean;
  reducedMotion: boolean;
  onClick: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Single face style for both sides — sized identically so they stack.
  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "var(--radius-xl, 20px)",
  };

  if (reducedMotion) {
    // Cross-fade fallback. No 3D transform, no rotation.
    return (
      <div
        ref={cardRef}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
        className="glass-pane"
        style={{
          position: "relative",
          width: "100%",
          height: 340,
          borderRadius: "var(--radius-xl, 20px)",
          boxShadow: "var(--shadow-glow), var(--shadow-2xl)",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: FLIP_EASE }}
            style={faceStyle}
          >
            {flipped ? back : front}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      style={{
        position: "relative",
        width: "100%",
        height: 340,
        cursor: "pointer",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Front face */}
        <div
          className="glass-pane"
          style={{
            ...faceStyle,
            boxShadow: "var(--shadow-glow), var(--shadow-2xl)",
          }}
        >
          {front}
        </div>
        {/* Back face — pre-rotated 180° so it shows right-side-up when the
         * rig flips. */}
        <div
          className="glass-pane"
          style={{
            ...faceStyle,
            transform: "rotateY(180deg)",
            boxShadow: "var(--shadow-glow), var(--shadow-2xl)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
