"use client";

import { useState, useEffect } from "react";
import { RotateCcw, ThumbsUp, ThumbsDown, Minus, CheckCheck, Trophy, TrendingUp, BookOpen, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

type Card = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  lessonTitle: string | null;
  lessonSlug: string | null;
};

type Rating = "Again" | "Hard" | "Good" | "Easy";

export function FlashcardReviewer({ lessonSlug }: { lessonSlug?: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    const url = lessonSlug ? `/api/flashcards?lesson=${encodeURIComponent(lessonSlug)}` : "/api/flashcards";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setCards(data.cards ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonSlug]);

  const card = cards[currentIdx];

  const rate = (rating: Rating) => {
    const next = { ...stats };
    next[rating.toLowerCase() as keyof typeof stats]++;
    setStats(next);
    if (currentIdx >= cards.length - 1) {
      setDone(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setDone(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  if (loading) {
    return (
      <div style={{
        background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)", padding: "60px 32px",
        textAlign: "center", boxShadow: "var(--shadow-sm)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        <Loader2 size={36} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>Loading flashcards…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div style={{
        background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)", padding: "60px 32px",
        textAlign: "center", boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: "0 auto 20px",
          background: "var(--accent-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BookOpen size={28} color="var(--accent)" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>
          No flashcards yet
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 24px" }}>
          Flashcards are generated when you complete lessons. Start learning to unlock your deck!
        </p>
        <Link href="/learn" style={{ textDecoration: "none" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "11px 22px", background: "var(--accent)", color: "#fff",
            borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>
            <BookOpen size={14} /> Browse learning paths
          </div>
        </Link>
      </div>
    );
  }

  if (done) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    const pct = Math.round(((stats.good + stats.easy) / total) * 100);
    return (
      <div style={{
        background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)", padding: "40px 32px",
        textAlign: "center", boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: pct >= 80 ? "var(--xp-gold-light)" : pct >= 60 ? "var(--success-light)" : "var(--accent-light)",
            border: `2px solid ${pct >= 80 ? "var(--xp-gold)" : pct >= 60 ? "var(--success)" : "var(--accent)"}25`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}>
            {pct >= 80 ? <Trophy size={32} color="var(--xp-gold)" />
              : pct >= 60 ? <TrendingUp size={32} color="var(--success)" />
              : <BookOpen size={32} color="var(--accent)" />}
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Session complete!
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28 }}>
          You reviewed {total} cards · {pct}% known
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Again", count: stats.again, color: "var(--danger)" },
            { label: "Hard",  count: stats.hard,  color: "var(--warning)" },
            { label: "Good",  count: stats.good,  color: "var(--info)" },
            { label: "Easy",  count: stats.easy,  color: "var(--success)" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "16px 12px", background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={reset} style={{
          display: "flex", alignItems: "center", gap: 8, margin: "0 auto",
          padding: "12px 24px", background: "var(--accent)", color: "#fff",
          border: "none", borderRadius: "var(--radius-md)", fontSize: 15, fontWeight: 500, cursor: "pointer",
        }}>
          <RotateCcw size={15} /> Review again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, flexShrink: 0 }}>
          Card {currentIdx + 1} of {cards.length}
        </span>
        <div style={{
          flex: 1, height: 4, background: "var(--bg-tertiary)",
          borderRadius: "var(--radius-full)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${(currentIdx / cards.length) * 100}%`,
            background: "var(--accent)", borderRadius: "var(--radius-full)",
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {card?.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              fontSize: 11, background: "var(--accent-light)", color: "var(--accent)",
              padding: "2px 8px", borderRadius: "var(--radius-full)",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Lesson context */}
      {card?.lessonTitle && (
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 10, textAlign: "center" }}>
          From: {card.lessonTitle}
        </div>
      )}

      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-md)",
          minHeight: 280, padding: "36px 32px",
          cursor: "pointer", transition: "all 0.2s",
          display: "flex", flexDirection: "column", justifyContent: "center",
          marginBottom: 20, position: "relative",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; }}
      >
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: flipped ? "var(--success)" : "var(--text-tertiary)", marginBottom: 20,
        }}>
          {flipped ? "Answer" : "Question — click to reveal"}
        </div>

        {!flipped ? (
          <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.6, textAlign: "center" }}>
            {card?.front}
          </p>
        ) : (
          <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7 }} className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{card?.back}</ReactMarkdown>
          </div>
        )}

        {!flipped && (
          <div style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            fontSize: 12, color: "var(--text-tertiary)",
          }}>
            Click anywhere to flip
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Again", icon: <RotateCcw size={14} />, color: "var(--danger)", bg: "var(--danger-light)", rating: "Again" as Rating },
            { label: "Hard",  icon: <ThumbsDown size={14} />, color: "var(--warning)", bg: "var(--warning-light)", rating: "Hard" as Rating },
            { label: "Good",  icon: <Minus size={14} />, color: "var(--info)", bg: "var(--info-light)", rating: "Good" as Rating },
            { label: "Easy",  icon: <CheckCheck size={14} />, color: "var(--success)", bg: "var(--success-light)", rating: "Easy" as Rating },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => rate(btn.rating)}
              style={{
                padding: "12px 0", border: `1.5px solid ${btn.color}30`,
                borderRadius: "var(--radius-md)", background: btn.bg,
                color: btn.color, fontSize: 13, fontWeight: 500,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = btn.color; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = btn.color + "30"; }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
