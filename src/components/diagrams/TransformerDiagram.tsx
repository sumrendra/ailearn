"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOKENS = ["The", "cat", "sat", "on", "mat"];
const COLORS = ["#6c47ff", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

const ATTENTION_WEIGHTS = [
  [0.8, 0.1, 0.05, 0.03, 0.02],
  [0.1, 0.7, 0.1,  0.05, 0.05],
  [0.05,0.15,0.65, 0.1,  0.05],
  [0.05,0.1, 0.1,  0.6,  0.15],
  [0.02,0.05,0.08, 0.15, 0.7 ],
];

const COMPONENTS = [
  { id: "qkv",    label: "Q, K, V Projection",    icon: "⚡", color: "#6c47ff", desc: "Each token gets 3 vectors: Query (what I'm looking for), Key (what I offer), Value (what I contain). Computed via learned weight matrices." },
  { id: "attn",   label: "Scaled Dot-Product Attn",icon: "🎯", color: "#f59e0b", desc: "Attention score = softmax(QKᵀ / √dₖ) × V. Higher scores mean the token attends more strongly to another token." },
  { id: "heads",  label: "Multi-Head Attention",   icon: "🔀", color: "#0ea5e9", desc: "Run attention h times in parallel (h=8 to 128). Each head learns different relationships: syntax, coreference, semantics, etc." },
  { id: "ffn",    label: "Feed-Forward Network",   icon: "🧮", color: "#10b981", desc: "Two linear layers with ReLU. Applied independently per token. dff is typically 4× the model dimension (e.g. 4096 in GPT-2 medium)." },
  { id: "norm",   label: "Layer Norm + Residual",  icon: "⚖️", color: "#8b5cf6", desc: "Add & Norm: output = LayerNorm(x + Sublayer(x)). Residual connections prevent vanishing gradients in deep stacks." },
];

export function TransformerDiagram() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [showAttention, setShowAttention] = useState(false);
  const [selectedToken, setSelectedToken] = useState(0);

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(135deg, #0a0a18 0%, #141428 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      marginBottom: 40,
      boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
            🔎 Interactive Diagram
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            Transformer Block — inside a single layer
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowAttention(v => !v)}
          style={{
            padding: "7px 16px", borderRadius: 8,
            background: showAttention ? "#f59e0b" : "rgba(245,158,11,0.15)",
            border: "1px solid #f59e0b40",
            color: showAttention ? "#000" : "#f59e0b",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}
        >
          {showAttention ? "Hide" : "Show"} attention matrix
        </motion.button>
      </div>

      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: showAttention ? "1fr 1fr" : "1fr", gap: 20 }}>

          {/* Left: Architecture blocks */}
          <div>
            {/* Input tokens */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Input tokens
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {TOKENS.map((t, i) => (
                  <motion.div
                    key={t}
                    whileHover={{ scale: 1.1, y: -2 }}
                    onClick={() => setSelectedToken(i)}
                    style={{
                      padding: "6px 12px", borderRadius: 8,
                      background: selectedToken === i ? COLORS[i] : `${COLORS[i]}20`,
                      border: `1px solid ${COLORS[i]}60`,
                      color: selectedToken === i ? "#fff" : COLORS[i],
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Architecture components */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {COMPONENTS.map((comp) => (
                <motion.div
                  key={comp.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveComponent(activeComponent === comp.id ? null : comp.id)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: activeComponent === comp.id ? `${comp.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeComponent === comp.id ? comp.color + "50" : "rgba(255,255,255,0.06)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{comp.icon}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: activeComponent === comp.id ? comp.color : "rgba(255,255,255,0.7)",
                    }}>
                      {comp.label}
                    </span>
                  </div>
                  <AnimatePresence>
                    {activeComponent === comp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: 8, marginBottom: 0 }}>
                          {comp.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Attention heatmap */}
          <AnimatePresence>
            {showAttention && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  Attention weights for &quot;{TOKENS[selectedToken]}&quot;
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Heatmap grid */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {TOKENS.map((token, rowI) => (
                      <div key={token} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 36, fontSize: 11.5, color: "rgba(255,255,255,0.5)", textAlign: "right", fontWeight: 600 }}>
                          {token}
                        </div>
                        {TOKENS.map((_, colI) => {
                          const weight = ATTENTION_WEIGHTS[selectedToken][colI];
                          const intensity = rowI === selectedToken ? weight : 0.05;
                          return (
                            <motion.div
                              key={colI}
                              animate={{ opacity: 1 }}
                              style={{
                                flex: 1, height: 32, borderRadius: 6,
                                background: `rgba(245,158,11,${intensity})`,
                                border: `1px solid rgba(245,158,11,${intensity * 0.5})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10.5, fontWeight: 700,
                                color: `rgba(255,255,255,${Math.min(0.9, intensity * 2)})`,
                              }}
                            >
                              {rowI === selectedToken ? (weight * 100).toFixed(0) + "%" : ""}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                    {/* Column labels */}
                    <div style={{ display: "flex", gap: 8, marginLeft: 44 }}>
                      {TOKENS.map(t => (
                        <div key={t} style={{ flex: 1, fontSize: 10.5, color: "rgba(255,255,255,0.35)", textAlign: "center", fontWeight: 600 }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 12, lineHeight: 1.6 }}>
                    Click a token above to see its attention pattern. Brighter = stronger attention.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
