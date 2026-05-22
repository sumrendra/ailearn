"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Database, Cpu, Code2, Server, Cloud, Box, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MapPath {
  id: string;
  label: string;
  description: string;
  sub: string;
  slug?: string;            // undefined = planned / coming soon
  color: string;
  glow: string;             // rgba for box-shadow glow
  gradient: string;
  icon: React.ReactNode;
  lessons?: number;
  status: "available" | "planned";
  // pixel positions inside the 960×390 canvas
  x: number;
  y: number;
}

// ── Canvas geometry ────────────────────────────────────────────────────────
// Canvas: 960 × 390 px.  Node: 185 × 92 px.
const W = 185;
const H = 92;

// Helper: center of a node
const cx = (x: number) => x + W / 2;
const cy = (y: number) => y + H / 2;

// ── Nodes ─────────────────────────────────────────────────────────────────────

const NODES: MapPath[] = [
  // ── Available ──────────────────────────────────────────────────────────────
  {
    id: "llm",
    label: "LLM Foundations",
    description: "Transformers, attention, tokenization & prompting",
    sub: "Start here",
    slug: "llm-foundations",
    color: "#7c5cff",
    glow: "rgba(124,92,255,0.45)",
    gradient: "linear-gradient(135deg, #4f35cc 0%, #7c5cff 60%, #9b6dff 100%)",
    icon: <Brain size={22} color="#fff" />,
    lessons: 6,
    status: "available",
    x: 387, y: 28,
  },
  {
    id: "rag",
    label: "RAG & Vector DBs",
    description: "Embeddings, retrieval, chunking & evaluation",
    sub: "Requires: LLM Foundations",
    slug: "rag-vector-dbs",
    color: "#0f766e",
    glow: "rgba(15,118,110,0.4)",
    gradient: "linear-gradient(135deg, #0c5e58 0%, #0f766e 60%, #14b8a6 100%)",
    icon: <Database size={22} color="#fff" />,
    lessons: 6,
    status: "available",
    x: 72, y: 185,
  },
  {
    id: "agents",
    label: "AI Agents",
    description: "Tool use, ReAct pattern, memory & multi-agent",
    sub: "Requires: LLM Foundations",
    slug: "ai-agents",
    color: "#c2670a",
    glow: "rgba(194,103,10,0.4)",
    gradient: "linear-gradient(135deg, #92400e 0%, #c2670a 60%, #d97706 100%)",
    icon: <Cpu size={22} color="#fff" />,
    lessons: 6,
    status: "available",
    x: 702, y: 185,
  },

  // ── Planned ────────────────────────────────────────────────────────────────
  {
    id: "java",
    label: "Java Deep Dive",
    description: "JVM internals, concurrency, Spring & performance",
    sub: "Coming soon",
    color: "#404040",
    glow: "rgba(0,0,0,0)",
    gradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    icon: <Code2 size={20} color="rgba(255,255,255,0.35)" />,
    status: "planned",
    x: 12, y: 310,
  },
  {
    id: "sysdesign",
    label: "System Design",
    description: "Scalability, reliability & distributed systems",
    sub: "Coming soon",
    color: "#404040",
    glow: "rgba(0,0,0,0)",
    gradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    icon: <Server size={20} color="rgba(255,255,255,0.35)" />,
    status: "planned",
    x: 280, y: 310,
  },
  {
    id: "k8s",
    label: "Kubernetes & Infra",
    description: "Containers, orchestration & cloud-native",
    sub: "Coming soon",
    color: "#404040",
    glow: "rgba(0,0,0,0)",
    gradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    icon: <Cloud size={20} color="rgba(255,255,255,0.35)" />,
    status: "planned",
    x: 548, y: 310,
  },
  {
    id: "devops",
    label: "DevOps & CI/CD",
    description: "Pipelines, monitoring, IaC & cloud deployments",
    sub: "Coming soon",
    color: "#404040",
    glow: "rgba(0,0,0,0)",
    gradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    icon: <Box size={20} color="rgba(255,255,255,0.35)" />,
    status: "planned",
    x: 760, y: 310,
  },
];

// ── Connections (bezier paths in SVG px space) ─────────────────────────────

interface Conn { d: string; color: string; dashed: boolean; markerId: string }

// LLM y positions: node starts at y=28, so bottom = 28+H = 120
// RAG/Agents start at y=185, so top=185, bottom=185+H=277
// Planned row starts at y=310

const LLM_BOTTOM_X = cx(387);  // 479.5
const LLM_BOTTOM_Y = 28 + H;   // 120
const RAG_TOP_X    = cx(72);    // 164.5
const RAG_BOTTOM_X = cx(72);
const RAG_BOTTOM_Y = 185 + H;  // 277
const AGT_TOP_X    = cx(702);   // 794.5
const AGT_BOTTOM_X = cx(702);
const AGT_BOTTOM_Y = 185 + H;  // 277
const PLANNED_Y    = 310;

const CONNECTIONS: Conn[] = [
  // LLM → RAG
  {
    d: `M ${LLM_BOTTOM_X} ${LLM_BOTTOM_Y} C ${LLM_BOTTOM_X} 158, ${RAG_TOP_X} 155, ${RAG_TOP_X} 185`,
    color: "#7c5cff",
    dashed: false,
    markerId: "arr-active",
  },
  // LLM → Agents
  {
    d: `M ${LLM_BOTTOM_X} ${LLM_BOTTOM_Y} C ${LLM_BOTTOM_X} 158, ${AGT_TOP_X} 155, ${AGT_TOP_X} 185`,
    color: "#7c5cff",
    dashed: false,
    markerId: "arr-active",
  },
  // RAG → Java (planned)
  {
    d: `M ${RAG_BOTTOM_X} ${RAG_BOTTOM_Y} C ${RAG_BOTTOM_X} 300, ${cx(12)} 296, ${cx(12)} ${PLANNED_Y}`,
    color: "#555",
    dashed: true,
    markerId: "arr-planned",
  },
  // RAG → System Design (planned)
  {
    d: `M ${RAG_BOTTOM_X} ${RAG_BOTTOM_Y} C ${RAG_BOTTOM_X} 300, ${cx(280)} 296, ${cx(280)} ${PLANNED_Y}`,
    color: "#555",
    dashed: true,
    markerId: "arr-planned",
  },
  // Agents → System Design (planned)
  {
    d: `M ${AGT_BOTTOM_X} ${AGT_BOTTOM_Y} C ${AGT_BOTTOM_X} 300, ${cx(280)} 296, ${cx(280)} ${PLANNED_Y}`,
    color: "#555",
    dashed: true,
    markerId: "arr-planned",
  },
  // Agents → K8s (planned)
  {
    d: `M ${AGT_BOTTOM_X} ${AGT_BOTTOM_Y} C ${AGT_BOTTOM_X} 300, ${cx(548)} 296, ${cx(548)} ${PLANNED_Y}`,
    color: "#555",
    dashed: true,
    markerId: "arr-planned",
  },
  // Agents → DevOps (planned)
  {
    d: `M ${AGT_BOTTOM_X} ${AGT_BOTTOM_Y} C ${AGT_BOTTOM_X} 300, ${cx(760)} 296, ${cx(760)} ${PLANNED_Y}`,
    color: "#555",
    dashed: true,
    markerId: "arr-planned",
  },
];

// ── Node card ─────────────────────────────────────────────────────────────────

function NodeCard({ node, hovered }: { node: MapPath; hovered: boolean }) {
  const isPlanned = node.status === "planned";

  return (
    <motion.div
      whileHover={isPlanned ? {} : { scale: 1.05, y: -5 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: W,
        height: H,
        borderRadius: 14,
        background: node.gradient,
        border: `1px solid ${isPlanned ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.22)"}`,
        boxShadow: hovered && !isPlanned
          ? `0 16px 40px ${node.glow}, 0 4px 12px rgba(0,0,0,0.25)`
          : isPlanned
          ? "0 2px 8px rgba(0,0,0,0.2)"
          : `0 6px 20px ${node.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
        padding: "11px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: isPlanned ? "default" : "pointer",
        opacity: isPlanned ? 0.5 : 1,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", right: -20, top: -20,
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: -10, bottom: -20,
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
        pointerEvents: "none",
      }} />

      {/* Top row: icon + badge */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {node.icon}
        </div>

        {isPlanned ? (
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.08)",
            padding: "2px 7px", borderRadius: 999,
            textTransform: "uppercase",
          }}>
            planned
          </span>
        ) : node.lessons ? (
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            background: "rgba(255,255,255,0.18)",
            padding: "2px 8px", borderRadius: 999,
          }}>
            {node.lessons} lessons
          </span>
        ) : null}
      </div>

      {/* Label + sub */}
      <div style={{ position: "relative" }}>
        <div style={{
          fontSize: 13.5, fontWeight: 700,
          color: isPlanned ? "rgba(255,255,255,0.45)" : "#fff",
          lineHeight: 1.2, marginBottom: 3,
        }}>
          {node.label}
        </div>
        <div style={{
          fontSize: 10, fontWeight: 500,
          color: isPlanned ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.65)",
          lineHeight: 1.3,
        }}>
          {node.sub}
        </div>
      </div>
    </motion.div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function Tooltip({ node }: { node: MapPath }) {
  if (node.status === "planned") return null;
  // Show below node if it's in the top row (avoids clipping above canvas)
  const showBelow = node.y < 120;
  const tooltipTop = showBelow ? node.y + H + 10 : node.y - 72;

  return (
    <motion.div
      initial={{ opacity: 0, y: showBelow ? -6 : 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        left: node.x + W / 2,
        top: tooltipTop,
        transform: "translateX(-50%)",
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 20,
        minWidth: 210,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
        {node.label}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.4 }}>
        {node.description}
      </div>
      {/* Arrow: points toward the node */}
      <div style={{
        position: "absolute",
        ...(showBelow
          ? { top: -6, left: "50%", transform: "translateX(-50%) rotate(225deg)" }
          : { bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
        width: 10, height: 10,
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderTop: "none", borderLeft: "none",
      }} />
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function KnowledgeMap({ pathLessonCounts }: { pathLessonCounts?: Record<string, number> }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = NODES.find((n) => n.id === hoveredId) ?? null;

  return (
    <div style={{
      background: "var(--bg-secondary)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      boxShadow: "var(--shadow-md)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px 12px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
            Knowledge Map
          </div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>
            Your learning roadmap — click any path to begin
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {[
            { color: "#7c5cff", label: "Available" },
            { color: "#555", label: "Planned" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas — horizontally scrollable on smaller screens */}
      <div style={{ overflowX: "auto" }}>
        <div style={{
          position: "relative",
          width: 960,
          height: 415,
        }}>

          {/* SVG: dot grid + connections */}
          <svg
            style={{ position: "absolute", inset: 0, width: 960, height: 415, pointerEvents: "none" }}
            viewBox="0 0 960 415"
          >
            <defs>
              {/* Dot grid pattern */}
              <pattern id="km-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="1" fill="var(--border-subtle)" opacity="0.8" />
              </pattern>

              {/* Edge fade gradient */}
              <linearGradient id="km-fade-h" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="var(--bg-secondary)" stopOpacity="0.8" />
                <stop offset="8%"   stopColor="var(--bg-secondary)" stopOpacity="0" />
                <stop offset="92%"  stopColor="var(--bg-secondary)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--bg-secondary)" stopOpacity="0.8" />
              </linearGradient>

              {/* Arrow markers */}
              <marker id="arr-active" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M 0 1 L 7 4.5 L 0 8 Z" fill="#7c5cff" opacity="0.75" />
              </marker>
              <marker id="arr-planned" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                <path d="M 0 1 L 7 4.5 L 0 8 Z" fill="#555" opacity="0.5" />
              </marker>
            </defs>

            {/* Dot grid background */}
            <rect width="960" height="415" fill="url(#km-dots)" />

            {/* Connections */}
            {CONNECTIONS.map((conn, i) => (
              <path
                key={i}
                d={conn.d}
                fill="none"
                stroke={conn.color}
                strokeWidth={conn.dashed ? 1.5 : 2.5}
                strokeDasharray={conn.dashed ? "6 5" : undefined}
                opacity={conn.dashed ? 0.3 : 0.6}
                markerEnd={`url(#${conn.markerId})`}
              />
            ))}

            {/* Horizontal edge fade overlay */}
            <rect width="960" height="415" fill="url(#km-fade-h)" />
          </svg>

          {/* Nodes */}
          {NODES.map((node) => {
            const isHovered = hoveredId === node.id;
            const card = (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ position: "absolute", left: node.x, top: node.y, zIndex: 10 }}
              >
                <NodeCard node={node} hovered={isHovered} />
              </div>
            );

            if (node.slug && node.status === "available") {
              return (
                <Link key={node.id} href={`/learn/${node.slug}`} style={{ textDecoration: "none" }}>
                  {card}
                </Link>
              );
            }
            return card;
          })}

          {/* Tooltips */}
          <AnimatePresence>
            {hovered && hovered.status === "available" && (
              <div key={hovered.id} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30 }}>
                <Tooltip node={hovered} />
              </div>
            )}
          </AnimatePresence>

          {/* Bottom label row */}
          <div style={{
            position: "absolute",
            bottom: 10, left: 0, right: 0,
            display: "flex", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize: 10, color: "var(--text-tertiary)",
              background: "var(--bg-secondary)",
              padding: "3px 10px", borderRadius: 999,
              border: "1px solid var(--border-subtle)",
            }}>
              More topics coming soon — the map grows as you learn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
