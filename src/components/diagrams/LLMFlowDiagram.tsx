"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

const STEPS = [
  {
    id: "input",
    icon: "💬",
    label: "Input",
    color: "#6c47ff",
    detail: "Raw text prompt",
    example: '"What is AI?"',
    desc: "User types a prompt. The model receives raw text as input.",
  },
  {
    id: "tokenize",
    icon: "✂️",
    label: "Tokenize",
    color: "#0ea5e9",
    detail: "Split into tokens",
    example: '["What", "▁is", "▁AI", "?"]',
    desc: "Text is split into tokens (subwords). Each token maps to an integer ID.",
  },
  {
    id: "embed",
    icon: "⬡",
    label: "Embed",
    color: "#8b5cf6",
    detail: "Vectors in high-dim space",
    example: "[0.42, -0.71, 0.18 …]",
    desc: "Each token ID becomes a 768–4096 dimension float vector via an embedding table.",
  },
  {
    id: "attend",
    icon: "🧠",
    label: "Attention",
    color: "#f59e0b",
    detail: "Attend across context",
    example: "Q·Kᵀ / √d → softmax",
    desc: "Multi-head self-attention lets every token look at every other token and weigh importance.",
  },
  {
    id: "predict",
    icon: "📊",
    label: "Predict",
    color: "#10b981",
    detail: "Next-token probabilities",
    example: '"AI": 38%, "Artificial": 31%',
    desc: "A linear layer projects to vocab size (~50k). Softmax gives a probability distribution.",
  },
  {
    id: "output",
    icon: "✨",
    label: "Output",
    color: "#ef4444",
    detail: "Sampled token appended",
    example: '"Artificial Intelligence…"',
    desc: "The highest-probability token is selected (or sampled) and appended. Repeat until done.",
  },
];

export function LLMFlowDiagram() {
  const [active, setActive]   = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (active >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setActive(v => v + 1), 700);
    return () => clearTimeout(t);
  }, [playing, active]);

  function play() {
    setActive(-1);
    setPlaying(true);
    setTimeout(() => setActive(0), 50);
  }

  function reset() {
    setPlaying(false);
    setActive(-1);
  }

  const shown = hovered !== null ? hovered : active;

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0a1628 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      marginBottom: 40,
      boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 24px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6c47ff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
            ⚡ Interactive Diagram
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            How an LLM generates text
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {active >= 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 14px", borderRadius: 8,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={12} /> Reset
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={play}
            disabled={playing}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 8,
              background: playing ? "rgba(108,71,255,0.3)" : "linear-gradient(135deg, #6c47ff, #9b6dff)",
              border: "none", color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: playing ? "default" : "pointer",
              boxShadow: playing ? "none" : "0 4px 16px rgba(108,71,255,0.5)",
            }}
          >
            <Play size={13} fill="#fff" /> {playing ? "Running…" : "Run demo"}
          </motion.button>
        </div>
      </div>

      {/* Flow steps */}
      <div style={{ padding: "28px 24px 8px", overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 600 }}>
          {STEPS.map((step, i) => {
            const isActive = i <= active;
            const isCurrent = i === active;
            return (
              <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                {/* Step node */}
                <motion.div
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  animate={{
                    scale: isCurrent ? [1, 1.12, 1] : 1,
                    boxShadow: isActive
                      ? [`0 0 0px ${step.color}00`, `0 0 20px ${step.color}60`, `0 0 12px ${step.color}40`]
                      : "none",
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    flex: 1,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "14px 8px",
                    borderRadius: 14,
                    background: isActive ? `${step.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? step.color + "40" : "rgba(255,255,255,0.06)"}`,
                    cursor: "pointer",
                    transition: "background 0.3s, border-color 0.3s",
                    position: "relative",
                    minWidth: 0,
                  }}
                >
                  {/* Glow ring when current */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      style={{
                        position: "absolute", inset: -4, borderRadius: 18,
                        border: `2px solid ${step.color}`,
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  <div style={{ fontSize: 24 }}>{step.icon}</div>
                  <div style={{
                    fontSize: 11.5, fontWeight: 700,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.3)",
                    transition: "color 0.3s",
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize: 9.5, fontWeight: 500,
                    color: isActive ? step.color : "rgba(255,255,255,0.15)",
                    textAlign: "center",
                    transition: "color 0.3s",
                  }}>
                    {step.detail}
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {i < STEPS.length - 1 && (
                  <div style={{ width: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <motion.div
                      animate={{ opacity: i < active ? 1 : 0.15 }}
                      transition={{ duration: 0.4 }}
                      style={{ fontSize: 16, color: STEPS[i].color }}
                    >
                      →
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ padding: "0 24px 24px" }}>
        <AnimatePresence mode="wait">
          {shown >= 0 && (
            <motion.div
              key={shown}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{
                marginTop: 16,
                padding: "16px 20px",
                borderRadius: 12,
                background: `${STEPS[shown].color}12`,
                border: `1px solid ${STEPS[shown].color}30`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${STEPS[shown].color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {STEPS[shown].icon}
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
                    Step {shown + 1}: {STEPS[shown].label}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 8 }}>
                    {STEPS[shown].desc}
                  </div>
                  <code style={{
                    fontSize: 12, color: STEPS[shown].color,
                    background: "rgba(0,0,0,0.3)",
                    padding: "3px 10px", borderRadius: 6,
                    fontFamily: "var(--font-mono)",
                  }}>
                    {STEPS[shown].example}
                  </code>
                </div>
              </div>
            </motion.div>
          )}
          {shown < 0 && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: 16, padding: "14px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
                fontSize: 13, color: "rgba(255,255,255,0.3)",
              }}
            >
              Press <strong style={{ color: "rgba(255,255,255,0.5)" }}>Run demo</strong> to animate the pipeline, or hover any step to explore.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
