"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Layers, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { EXAM_BAND_META, TCF_CONTEXT_PACKS } from "@/lib/content/tcf-exam-lexique";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { readVocabPile } from "@/lib/tcf-program/vocab-pile";
import { VocabThemeGrid } from "@/components/tcf/GrammarMap";

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

export function TcfVocabularyHub() {
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

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: 16,
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(190,24,93,0.12) 0%, var(--bg-card) 70%)",
            border: "1px solid rgba(190,24,93,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Zap size={18} color="#be185d" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>À réviser</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#be185d" }}>
            {dash?.vocabDue ?? "—"}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 10px" }}>cartes TCF (connecté)</p>
          <Link href="/flashcards?band=b" style={{ fontSize: 13, color: "#be185d", fontWeight: 600 }}>
            Lancer une session →
          </Link>
        </motion.div>

        {pileSize > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              padding: 16,
              borderRadius: 14,
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Sparkles size={18} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Mon paquet</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{pileSize}</div>
            <Link
              href={`/flashcards?keys=${encodeURIComponent(pileKeys)}`}
              style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}
            >
              Réviser le paquet →
            </Link>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: 16,
            borderRadius: 14,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Layers size={18} color="#6366f1" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Lexique examen</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>
            ~{bands.reduce((s, b) => s + b.count, 0)} mots par bandes A/B/C + {TCF_CONTEXT_PACKS.length} packs en contexte.
          </p>
          <Link href="/docs/lexique-sources.md" style={{ display: "none" }} />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
            Curated from Lexique 4 + nos sujets (voir docs/lexique-sources.md in repo)
          </p>
        </motion.div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <BookOpen size={18} color="#22c55e" /> Bandes d&apos;examen
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: 36 }}>
        {bands.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link
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
                <div style={{ fontSize: 11, fontWeight: 700, color: BAND_COLOR[b.id], letterSpacing: "0.06em" }}>{b.cefr}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{b.count} cartes · flashcards SM-2</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Dans le contexte — mini-jeu</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
        {TCF_CONTEXT_PACKS.map((p, i) => (
          <motion.div key={p.id} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            <Link
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
                  whiteSpace: "nowrap",
                }}
              >
                Match · {p.items.length} mots
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Thèmes Canada</h2>
      <VocabThemeGrid themes={themes} />
    </>
  );
}
