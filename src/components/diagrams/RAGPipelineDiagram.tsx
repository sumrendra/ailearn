"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

const STAGES = [
  {
    id: "query",
    icon: "❓",
    label: "User Query",
    color: "#6c47ff",
    example: '"How does RAFT training work?"',
    desc: "A user submits a natural-language question. The system needs context the LLM wasn't trained on.",
  },
  {
    id: "embed",
    icon: "⬡",
    label: "Embed Query",
    color: "#0ea5e9",
    example: "[0.23, -0.71, 0.44 …] dim=1536",
    desc: "An embedding model (e.g. text-embedding-ada-002) converts the query into a vector in semantic space.",
  },
  {
    id: "search",
    icon: "🔍",
    label: "Vector Search",
    color: "#8b5cf6",
    example: "cosine_similarity(q, docs) → top-k",
    desc: "The query vector is compared against millions of stored document vectors using ANN search (FAISS, pgvector, Pinecone).",
  },
  {
    id: "retrieve",
    icon: "📄",
    label: "Top-K Chunks",
    color: "#f59e0b",
    example: "k=3 most similar passages",
    desc: "The k most semantically similar document chunks are retrieved. These become the grounding context for the LLM.",
  },
  {
    id: "augment",
    icon: "🧩",
    label: "Augment Prompt",
    color: "#10b981",
    example: "System: Use context below…\nContext: …\nQ: …",
    desc: "Retrieved chunks are injected into the prompt template alongside the original query before sending to the LLM.",
  },
  {
    id: "generate",
    icon: "✨",
    label: "LLM Generates",
    color: "#ef4444",
    example: '"RAFT fine-tunes models to…"',
    desc: "The LLM generates a grounded, factual answer using the retrieved context. Hallucinations are dramatically reduced.",
  },
];

export function RAGPipelineDiagram() {
  const [active, setActive]   = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (active >= STAGES.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setActive(v => v + 1), 650);
    return () => clearTimeout(t);
  }, [playing, active]);

  function play() { setActive(-1); setPlaying(true); setTimeout(() => setActive(0), 50); }
  function reset() { setPlaying(false); setActive(-1); }

  const shown = hovered !== null ? hovered : active;

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(135deg, #0a1628 0%, #0d1a2e 50%, #0a0a18 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      marginBottom: 40,
      boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
            🗄️ Interactive Diagram
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            RAG Pipeline — from query to grounded answer
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {active >= 0 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={reset}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <RotateCcw size={12} /> Reset
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={play} disabled={playing}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 8, background: playing ? "rgba(14,165,233,0.2)" : "linear-gradient(135deg, #0ea5e9, #38bdf8)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: playing ? "default" : "pointer", boxShadow: playing ? "none" : "0 4px 16px rgba(14,165,233,0.4)" }}>
            <Play size={13} fill="#fff" /> {playing ? "Running…" : "Animate"}
          </motion.button>
        </div>
      </div>

      {/* Vertical pipeline */}
      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {STAGES.map((stage, i) => {
            const isActive = i <= active;
            const isCurrent = i === active;
            return (
              <motion.div
                key={stage.id}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.03, y: -3 }}
                animate={{
                  boxShadow: isCurrent
                    ? [`0 0 0px ${stage.color}00`, `0 0 24px ${stage.color}50`, `0 0 16px ${stage.color}30`]
                    : isActive ? `0 4px 16px ${stage.color}20` : "none",
                }}
                transition={{ duration: 0.5 }}
                style={{
                  padding: "16px",
                  borderRadius: 14,
                  background: isActive ? `${stage.color}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? stage.color + "40" : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer",
                  transition: "background 0.3s, border-color 0.3s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: isActive ? `${stage.color}25` : "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17,
                    transition: "background 0.3s",
                  }}>
                    {stage.icon}
                  </div>
                  <div style={{
                    fontSize: 12.5, fontWeight: 700,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.25)",
                    transition: "color 0.3s",
                  }}>
                    {stage.label}
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: isActive ? stage.color : "rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.2)",
                  padding: "4px 8px", borderRadius: 5,
                  transition: "color 0.3s",
                }}>
                  {stage.example}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          {shown >= 0 ? (
            <motion.div
              key={shown}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: `${STAGES[shown].color}12`, border: `1px solid ${STAGES[shown].color}30` }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: STAGES[shown].color, marginBottom: 4 }}>
                {STAGES[shown].icon} {STAGES[shown].label}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                {STAGES[shown].desc}
              </div>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 16, padding: "12px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
              Press <strong style={{ color: "rgba(255,255,255,0.4)" }}>Animate</strong> to walk through the pipeline, or hover any card.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
