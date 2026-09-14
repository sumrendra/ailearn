"use client";

import Link from "next/link";
import { Gamepad2, Library, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { readVocabPile } from "@/lib/tcf-program/vocab-pile";
import { VocabThemeGrid } from "@/components/tcf/GrammarMap";

const P0_TARGET = 450;
const TOTAL_LEMMAS =
  EXAM_BAND_META.reduce((s, b) => s + b.count, 0) + TCF_CONTEXT_PACKS.reduce((s, p) => s + p.items.length, 0);

type TabId = "start" | "bands" | "packs" | "themes";

interface VocabDashboard {
  vocabDue?: number;
  examBands?: { id: string; percent: number; count: number; title: string; cefr: string }[];
  vocabThemes?: { id: string; percent: number; cardCount: number }[];
}

function Ring({ percent, color }: { percent: number; color: string }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `conic-gradient(${color} ${p * 3.6}deg, var(--bg-overlay) 0)`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "var(--bg-card)",
          fontSize: 11,
          fontWeight: 700,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
        }}
      >
        {p}%
      </div>
    </div>
  );
}

const BAND_COLOR: Record<string, string> = { a: "#22c55e", b: "#6366f1", c: "#be185d" };

const TABS: { id: TabId; label: string }[] = [
  { id: "start", label: "Par où commencer" },
  { id: "bands", label: "Bandes examen" },
  { id: "packs", label: "Packs + quiz" },
  { id: "themes", label: "Thèmes" },
];

function ActionCard({
  href,
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  href: string;
  icon: typeof Zap;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${accent}44`,
        background: `linear-gradient(135deg, ${accent}14 0%, var(--bg-card) 65%)`,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={20} color={accent} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.45 }}>{subtitle}</p>
      <span style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 700, color: accent }}>
        Ouvrir →
      </span>
    </Link>
  );
}

export function TcfVocabularyHub() {
  const [tab, setTab] = useState<TabId>("start");
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

  const themes = VOCAB_THEMES.map((t) => {
    const remote = dash?.vocabThemes?.find((v) => v.id === t.id);
    return { ...t, percent: remote?.percent ?? 0 };
  });

  const bands = EXAM_BAND_META.map((b) => {
    const remote = dash?.examBands?.find((x) => x.id === b.id);
    return { ...b, percent: remote?.percent ?? 0 };
  });

  const totalWithThemes = TOTAL_LEMMAS + VOCAB_THEMES.reduce((s, t) => s + t.cardCount, 0);
  const pctOfP0 = Math.round((totalWithThemes / P0_TARGET) * 100);

  return (
    <>
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid rgba(245,158,11,0.35)",
          background: "rgba(245,158,11,0.08)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Target size={18} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Couverture lexique (estimation)</div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Environ <strong>{totalWithThemes}</strong> entrées ici (~{pctOfP0}% du objectif « must-know » ~{P0_TARGET} mots).
              Ce n&apos;est <strong>pas suffisant seul</strong> pour l&apos;examen : combinez avec les{" "}
              <Link href="/tcf/mocks" style={{ color: "#be185d", fontWeight: 600 }}>
                examens blancs
              </Link>{" "}
              (390 Q par compétence). Nous enrichissons la banque en continu.
            </p>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 20,
          padding: 4,
          borderRadius: 10,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 500,
              background: tab === t.id ? "rgba(190,24,93,0.15)" : "transparent",
              color: tab === t.id ? "#be185d" : "var(--text-secondary)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "start" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>
            Trois parcours — choisissez <strong>un</strong> point d&apos;entrée. Les cartes montrent le{" "}
            <strong>français d&apos;abord</strong> ; retournez pour l&apos;anglais (bouton « Indice EN » avant de retourner).
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <ActionCard
              href="/tcf/vocabulary/band/b"
              icon={Zap}
              title="Révision rapide"
              subtitle={
                dash?.vocabDue
                  ? `${dash.vocabDue} cartes dues · bande B (Q11–29)`
                  : "Bande B — le cœur de l'examen CO/CE"
              }
              accent="#be185d"
            />
            <ActionCard
              href={`/tcf/vocabulary/pack/${TCF_CONTEXT_PACKS[0]?.id ?? "p6-work-orientation"}`}
              icon={Gamepad2}
              title="Apprendre en contexte"
              subtitle="Extrait + quiz associer · puis flashcards"
              accent="#6366f1"
            />
            <ActionCard
              href="/tcf/vocabulary/theme/immigration"
              icon={Library}
              title="Thème Canada"
              subtitle="150 cartes par thème immigration, travail…"
              accent="#0f766e"
            />
          </div>

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
              }}
            >
              <Sparkles size={18} color="var(--accent)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Mon paquet ({pileSize} mots)</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Suite à un examen blanc · réviser →</div>
              </div>
            </Link>
          )}

          <Link
            href="/flashcards?band=b"
            style={{
              fontSize: 13,
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            Ouvrir les flashcards bande B directement →
          </Link>
        </div>
      )}

      {tab === "bands" && (
        <>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Q1–10 · Q11–29 · Q30–39 — aligné sur la difficulté progressive du TCF.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {bands.map((b) => (
              <Link
                key={b.id}
                href={`/tcf/vocabulary/band/${b.id}`}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Ring percent={b.percent} color={BAND_COLOR[b.id] ?? "#6366f1"} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BAND_COLOR[b.id] }}>{b.cefr}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{b.count} cartes</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === "packs" && (
        <>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Lisez l&apos;extrait, jouez au match, puis passez aux cartes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TCF_CONTEXT_PACKS.map((p) => (
              <Link
                key={p.id}
                href={`/tcf/vocabulary/pack/${p.id}`}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.subtitle}</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: `${BAND_COLOR[p.band]}22`,
                    color: BAND_COLOR[p.band],
                  }}
                >
                  {p.items.length} mots
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === "themes" && (
        <>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Decks thématiques (anglais → français à l&apos;origine ; affichage FR d&apos;abord dans les cartes).
          </p>
          <VocabThemeGrid themes={themes} />
        </>
      )}
    </>
  );
}
