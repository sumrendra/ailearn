"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

const LOOP_STEPS = [
  { id: "perceive", icon: "👁️", label: "Perceive",  color: "#6c47ff", desc: "The agent observes its environment — receives the user message, tool results, or system state. Everything is formatted as context for the LLM." },
  { id: "think",   icon: "💭", label: "Think",     color: "#f59e0b", desc: "The LLM reasons over the context using chain-of-thought. It decides: should I use a tool, respond to the user, or ask for clarification?" },
  { id: "act",     icon: "⚡", label: "Act",       color: "#ef4444", desc: "The agent executes the chosen action: calls an API, searches the web, writes code, queries a database, or generates a response." },
  { id: "observe", icon: "📋", label: "Observe",   color: "#10b981", desc: "The action result (tool output, API response, code execution result) is captured and added back to the agent's context window." },
  { id: "reflect", icon: "🔄", label: "Loop/Stop", color: "#0ea5e9", desc: "The agent checks: is the goal achieved? If yes, respond to the user. If no, loop back to Perceive with the new observation as context." },
];

const TOOLS = [
  { name: "web_search", icon: "🌐", example: 'search("latest AI news")' },
  { name: "code_exec",  icon: "💻", example: 'run_python("import pandas…")' },
  { name: "database",   icon: "🗄️", example: 'query("SELECT * FROM …")' },
  { name: "browser",    icon: "🖥️", example: 'navigate("https://…")' },
];

export function AgentLoopDiagram() {
  const [active, setActive]   = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (active >= LOOP_STEPS.length - 1) {
      // Loop back
      setTimeout(() => { setActive(-1); setTimeout(() => setActive(0), 200); }, 600);
      return;
    }
    const t = setTimeout(() => setActive(v => v + 1), 800);
    return () => clearTimeout(t);
  }, [playing, active]);

  function play() {
    setActive(-1);
    setPlaying(true);
    setTimeout(() => setActive(0), 50);
  }
  function stop() { setPlaying(false); setActive(-1); }

  const R = 100; // circle radius
  const CX = 150, CY = 150; // center

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(135deg, #0d0d1a 0%, #0a1628 100%)",
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
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
            🤖 Interactive Diagram
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            Agent ReAct Loop — how agents think and act
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {playing ? (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={stop}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <RotateCcw size={12} /> Stop
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={play}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 8, background: "linear-gradient(135deg, #10b981, #34d399)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,0.4)" }}>
              <Play size={13} fill="#fff" /> Animate loop
            </motion.button>
          )}
        </div>
      </div>

      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        {/* Circular flow diagram */}
        <div>
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Connection arcs */}
            {LOOP_STEPS.map((_, i) => {
              const angle = (i / LOOP_STEPS.length) * 2 * Math.PI - Math.PI / 2;
              const nextAngle = ((i + 1) / LOOP_STEPS.length) * 2 * Math.PI - Math.PI / 2;
              const x1 = CX + R * Math.cos(angle);
              const y1 = CY + R * Math.sin(angle);
              const x2 = CX + R * Math.cos(nextAngle);
              const y2 = CY + R * Math.sin(nextAngle);
              const isActive = i < active || (i === LOOP_STEPS.length - 1 && active >= 0);

              return (
                <motion.path
                  key={i}
                  d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={isActive ? LOOP_STEPS[i].color : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray="4 3"
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}

            {/* Center label */}
            <text x={CX} y={CY - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="700">
              LLM
            </text>
            <text x={CX} y={CY + 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="700">
              AGENT
            </text>
            <circle cx={CX} cy={CY} r={36} fill="rgba(108,71,255,0.12)" stroke="rgba(108,71,255,0.3)" strokeWidth="1.5" />

            {/* Step nodes */}
            {LOOP_STEPS.map((step, i) => {
              const angle = (i / LOOP_STEPS.length) * 2 * Math.PI - Math.PI / 2;
              const x = CX + R * Math.cos(angle);
              const y = CY + R * Math.sin(angle);
              const isActive = i === active;
              const isPast   = i < active;

              return (
                <g key={step.id}>
                  {isActive && (
                    <motion.circle
                      cx={x} cy={y} r={26}
                      fill="none"
                      stroke={step.color}
                      strokeWidth={2}
                      animate={{ r: [22, 30, 22], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <circle
                    cx={x} cy={y} r={22}
                    fill={isActive ? step.color + "30" : isPast ? step.color + "15" : "rgba(255,255,255,0.04)"}
                    stroke={isActive || isPast ? step.color + "80" : "rgba(255,255,255,0.12)"}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: "all 0.4s" }}
                  />
                  <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="16">
                    {step.icon}
                  </text>
                  <text
                    x={x} y={y + 32}
                    textAnchor="middle"
                    fill={isActive ? "#fff" : isPast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
                    fontSize="9.5"
                    fontWeight="700"
                    style={{ transition: "fill 0.4s" }}
                  >
                    {step.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: detail + tools */}
        <div>
          {/* Active step detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "16px",
                borderRadius: 12,
                background: active >= 0 ? `${LOOP_STEPS[Math.max(0, active)].color}12` : "rgba(255,255,255,0.03)",
                border: `1px solid ${active >= 0 ? LOOP_STEPS[Math.max(0, active)].color + "30" : "rgba(255,255,255,0.06)"}`,
                marginBottom: 16,
                minHeight: 80,
              }}
            >
              {active >= 0 ? (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: LOOP_STEPS[active].color, marginBottom: 6 }}>
                    {LOOP_STEPS[active].icon} {LOOP_STEPS[active].label}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                    {LOOP_STEPS[active].desc}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textAlign: "center", paddingTop: 20 }}>
                  Press <strong style={{ color: "rgba(255,255,255,0.4)" }}>Animate loop</strong> to see the agent think step by step.
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Available tools */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Available tools
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveTool(activeTool === i ? null : i)}
                style={{
                  padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                  background: activeTool === i ? "rgba(108,71,255,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeTool === i ? "rgba(108,71,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 14, marginBottom: 4 }}>{tool.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                  {tool.name}
                </div>
                {activeTool === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <code style={{ fontSize: 10, color: "#6c47ff", fontFamily: "var(--font-mono)" }}>
                      {tool.example}
                    </code>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
