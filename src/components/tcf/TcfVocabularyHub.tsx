"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Headphones, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { readVocabPile } from "@/lib/tcf-program/vocab-pile";
import { getFirstContextPackId } from "@/lib/tcf-program/vocab-catalog";
import { VocabThemeGrid } from "@/components/tcf/GrammarMap";

type BandId = "a" | "b" | "c";

interface VocabDashboard {
  authed?: boolean;
  vocabDue?: number;
  vocabCatalog?: {
    coreInApp: number;
    coreTarget: number;
    stillToAuthor: number;
    optionalTotal: number;
  };
  vocabProgress?: {
    mastered: number;
    total: number;
    due: number;
    byBand: Record<BandId, { mastered: number; total: number }>;
  } | null;
  examBands?: { id: string; percent: number; count: number; title: string; cefr: string }[];
  vocabThemes?: { id: string; percent: number; cardCount: number }[];
}

const BAND_COLOR: Record<string, string> = { a: "#22c55e", b: "#6366f1", c: "#be185d" };

const BAND_STEP: Record<BandId, { step: number; titleEn: string; descEn: string; questions: string }> = {
  a: {
    step: 1,
    titleEn: "Easier exam words (Band A)",
    descEn: "Forms, schedules, everyday instructions. Matches easier listening/reading questions.",
    questions: "Q1–10",
  },
  b: {
    step: 2,
    titleEn: "Main exam words (Band B)",
    descEn: "Work, housing, health, life in Canada. Most important for NCLC 7 prep.",
    questions: "Q11–29",
  },
  c: {
    step: 3,
    titleEn: "Harder exam words (Band C)",
    descEn: "Opinion, nuance, formal register. Matches the hardest questions.",
    questions: "Q30–39",
  },
};

function PathRow({
  href,
  step,
  title,
  description,
  mastered,
  total,
  accent,
  badge,
}: {
  href: string;
  step: number;
  title: string;
  description: string;
  mastered: number;
  total: number;
  accent: string;
  badge?: string;
}) {
  const router = useRouter();
  const remaining = Math.max(0, total - mastered);
  const pct = total ? Math.round((mastered / total) * 100) : 0;

  const go = () => router.push(href);

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}
    >
      <button
        type="button"
        onClick={go}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 16px 14px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "inherit",
          font: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${accent}22`,
              color: accent,
              fontWeight: 800,
              fontSize: 14,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {step}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
              {badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "rgba(190,24,93,0.15)",
                    color: "#be185d",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "6px 0 0", lineHeight: 1.45 }}>
              {description}
            </p>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              <span>
                <strong style={{ color: "var(--text-primary)" }}>{mastered}</strong> learned ·{" "}
                <strong style={{ color: "var(--text-primary)" }}>{remaining}</strong> left · {total} total
              </span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{pct}%</span>
            </div>
            <div
              style={{
                marginTop: 8,
                height: 6,
                borderRadius: 999,
                background: "var(--bg-overlay)",
                overflow: "hidden",
              }}
              aria-hidden
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: accent,
                  borderRadius: 999,
                  transition: "width 0.25s ease-out",
                }}
              />
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
        </div>
      </button>
    </div>
  );
}

export function TcfVocabularyHub() {
  const router = useRouter();
  const [dash, setDash] = useState<VocabDashboard | null>(null);
  const [pileSize, setPileSize] = useState(0);
  const [pileKeys, setPileKeys] = useState("");

  useEffect(() => {
    const pile = readVocabPile();
    setPileSize(pile.length);
    setPileKeys(pile.join(","));
    fetch("/api/tcf/dashboard")
      .then((r) => r.json())
      .then((d) => setDash(d))
      .catch(() => null);
  }, []);

  const catalog = dash?.vocabCatalog;
  const progress = dash?.vocabProgress;
  const coreInApp = catalog?.coreInApp ?? EXAM_BAND_META.reduce((s, b) => s + b.count, 0);
  const coreTarget = catalog?.coreTarget ?? 450;
  const stillToAuthor = catalog?.stillToAuthor ?? Math.max(0, coreTarget - coreInApp);
  const mastered = progress?.mastered ?? 0;
  const coreTotal = progress?.total ?? coreInApp;
  const coreRemaining = Math.max(0, coreTotal - mastered);
  const corePct = coreTotal ? Math.round((mastered / coreTotal) * 100) : 0;

  const firstPackId = getFirstContextPackId();

  const themes = VOCAB_THEMES.map((t) => {
    const remote = dash?.vocabThemes?.find((v) => v.id === t.id);
    return { ...t, percent: remote?.percent ?? 0 };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <section aria-labelledby="vocab-progress-heading">
        <h2 id="vocab-progress-heading" style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", color: "var(--text-muted)" }}>
          Your progress (core exam words)
        </h2>
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-elevated)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1.1 }}>
                {mastered}
                <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}> / {coreTotal}</span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
                words marked learned in the main path · <strong>{coreRemaining}</strong> still to study here
              </p>
            </div>
            {dash?.authed === false && (
              <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                Sign in to save progress
              </Link>
            )}
          </div>
          <div
            style={{
              marginTop: 14,
              height: 10,
              borderRadius: 999,
              background: "var(--bg-overlay)",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "100%", width: `${corePct}%`, background: "#be185d", borderRadius: 999 }} />
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.5 }}>
            This site ships <strong>{coreInApp}</strong> core exam words (target <strong>{coreTarget}</strong>
            {stillToAuthor > 0 ? (
              <>
                , about <strong>{stillToAuthor}</strong> still to add
              </>
            ) : (
              <> · core list complete</>
            )}
            . NCLC 7 also requires full mock exams in all four skills.
          </p>
        </div>
      </section>

      {dash?.vocabDue != null && dash.vocabDue > 0 && (
        <Link
          href="/flashcards?band=b"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: 14,
            borderRadius: 12,
            border: "1px solid rgba(190,24,93,0.35)",
            background: "rgba(190,24,93,0.08)",
            textDecoration: "none",
            color: "inherit",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {dash.vocabDue} flashcards due for review today
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#be185d" }}>Review →</span>
        </Link>
      )}

      {pileSize > 0 && (
        <Link
          href={`/flashcards?keys=${encodeURIComponent(pileKeys)}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 14,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            textDecoration: "none",
            color: "inherit",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Sparkles size={18} color="var(--accent)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Words from your last mock ({pileSize})</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Tap to review</div>
          </div>
        </Link>
      )}

      <section aria-labelledby="vocab-path-heading">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <h2 id="vocab-path-heading" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Main path
          </h2>
          <Link
            href="/tcf/vocabulary/quiz"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid rgba(190,24,93,0.35)",
              background: "rgba(190,24,93,0.08)",
              color: "#be185d",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Vocabulary quiz →
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
          Work in order. Each step opens flashcards: French on the front, English on the back (use &quot;EN hint&quot; or flip).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(["a", "b", "c"] as const).map((band) => {
            const meta = EXAM_BAND_META.find((b) => b.id === band)!;
            const step = BAND_STEP[band];
            const bandProg = progress?.byBand?.[band];
            return (
              <PathRow
                key={band}
                href={`/tcf/vocabulary/band/${band}`}
                step={step.step}
                title={step.titleEn}
                description={`${step.descEn} (${step.questions}).`}
                mastered={bandProg?.mastered ?? 0}
                total={bandProg?.total ?? meta.count}
                accent={BAND_COLOR[band] ?? "#6366f1"}
                badge={band === "b" ? "Recommended next" : undefined}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="vocab-context-heading">
        <h2 id="vocab-context-heading" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
          Learn in a short text
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
          Optional. Read a paragraph, match words, then drill flashcards.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/tcf/vocabulary/pack/${firstPackId}`)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: 16,
            borderRadius: 14,
            border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.08)",
            cursor: "pointer",
            color: "inherit",
            font: "inherit",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>Start first context pack</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
            {TCF_CONTEXT_PACKS[0]?.title ?? "Work & orientation"} · {TCF_CONTEXT_PACKS[0]?.items.length ?? 0} words
          </div>
          <span style={{ display: "inline-block", marginTop: 10, fontSize: 13, fontWeight: 700, color: "#6366f1" }}>
            Open pack →
          </span>
        </button>
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            All {TCF_CONTEXT_PACKS.length} context packs
          </summary>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {TCF_CONTEXT_PACKS.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/tcf/vocabulary/pack/${p.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-card)",
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: 13,
                  }}
                >
                  <span>{p.title}</span>
                  <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{p.items.length} words</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <details>
        <summary style={{ cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
          Extra word decks (optional)
        </summary>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "12px 0 16px" }}>
          Themed lists (immigration, work, etc.). Not required for the main path.
        </p>
        <VocabThemeGrid themes={themes} />
      </details>

      <section
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Headphones size={18} color="#be185d" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>NCLC 7 needs more than vocabulary</div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "6px 0 0", lineHeight: 1.5 }}>
              IRCC expects minimum scores in listening, reading, writing, and speaking separately (for example listening
              about 458/699, reading about 453/699, writing and speaking about 10/20 each). Use{" "}
              <Link href="/tcf/mocks" style={{ color: "#be185d", fontWeight: 600 }}>
                mock exams
              </Link>{" "}
              alongside this word path.
            </p>
          </div>
        </div>
      </section>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
        <Link href="/tcf/vocabulary/content-status" style={{ color: "var(--text-muted)" }}>
          Content status (admin)
        </Link>
      </p>
    </div>
  );
}
