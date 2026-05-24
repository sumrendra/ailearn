/**
 * Single source of truth for learning path presentation metadata.
 *
 * The Prisma `LearningPath` row carries the *content* (title, description,
 * lessons, difficulty). This file maps the path's `slug` to its *presentation*
 * — Lucide icon, color, gradient, accent surfaces. Keep them here so adding a
 * new path is one entry, not three.
 *
 * Pure module: no React imports, safe in server components.
 */
import {
  Brain, Database, Cpu, Table2, Server, Cloud, Code2, Box, Languages, FileSpreadsheet, Coffee,
  Leaf, Share2, Network, Blocks, Shield, GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type PathTier = "foundation" | "specialization" | "advanced";

export interface PathMeta {
  /** Lucide icon component */
  Icon: LucideIcon;
  /** Solid brand color — buttons, accent strokes */
  color: string;
  /** Dim background tint for chips and icon tiles */
  tint: string;
  /** Subtle ring color for icon tile border (color @ ~25% alpha) */
  ring: string;
  /** Hero gradient — used on path detail page and feature cards */
  gradient: string;
  /** Drop-shadow color for the gradient surface */
  glow: string;
  /** Where it sits in the learning graph */
  tier: PathTier;
}

const META: Record<string, PathMeta> = {
  "llm-foundations": {
    Icon: Brain,
    color: "#6c47ff",
    tint: "rgba(108,71,255,0.08)",
    ring: "rgba(108,71,255,0.22)",
    gradient: "linear-gradient(135deg, #4f35cc 0%, #7c5cff 55%, #9b6dff 100%)",
    glow: "rgba(108,71,255,0.32)",
    tier: "foundation",
  },
  "rag-vector-dbs": {
    Icon: Database,
    color: "#0f766e",
    tint: "rgba(15,118,110,0.08)",
    ring: "rgba(15,118,110,0.22)",
    gradient: "linear-gradient(135deg, #0c5e58 0%, #0f766e 55%, #14b8a6 100%)",
    glow: "rgba(15,118,110,0.30)",
    tier: "specialization",
  },
  "ai-agents": {
    Icon: Cpu,
    color: "#b45309",
    tint: "rgba(180,83,9,0.08)",
    ring: "rgba(180,83,9,0.22)",
    gradient: "linear-gradient(135deg, #92400e 0%, #b45309 55%, #d97706 100%)",
    glow: "rgba(180,83,9,0.28)",
    tier: "specialization",
  },
  "sql-mastery": {
    Icon: Table2,
    color: "#1d4ed8",
    tint: "rgba(29,78,216,0.08)",
    ring: "rgba(29,78,216,0.22)",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
    glow: "rgba(29,78,216,0.30)",
    tier: "foundation",
  },
  "french-fundamentals": {
    Icon: Languages,
    color: "#be185d",
    tint: "rgba(190,24,93,0.08)",
    ring: "rgba(190,24,93,0.22)",
    gradient: "linear-gradient(135deg, #831843 0%, #be185d 55%, #ec4899 100%)",
    glow: "rgba(190,24,93,0.30)",
    tier: "foundation",
  },
  "excel-mastery": {
    Icon: FileSpreadsheet,
    color: "#047857",
    tint: "rgba(4,120,87,0.08)",
    ring: "rgba(4,120,87,0.22)",
    gradient: "linear-gradient(135deg, #064e3b 0%, #047857 55%, #10b981 100%)",
    glow: "rgba(4,120,87,0.30)",
    tier: "foundation",
  },
  "java-complete": {
    Icon: Coffee,
    color: "#ea580c",
    tint: "rgba(234,88,12,0.08)",
    ring: "rgba(234,88,12,0.22)",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 55%, #fb923c 100%)",
    glow: "rgba(234,88,12,0.30)",
    tier: "foundation",
  },
  "java-frameworks": {
    Icon: Leaf,
    color: "#16a34a",
    tint: "rgba(22,163,74,0.08)",
    ring: "rgba(22,163,74,0.22)",
    gradient: "linear-gradient(135deg, #14532d 0%, #16a34a 55%, #4ade80 100%)",
    glow: "rgba(22,163,74,0.28)",
    tier: "specialization",
  },
  "kafka-essentials": {
    Icon: Share2,
    color: "#7c3aed",
    tint: "rgba(124,58,237,0.08)",
    ring: "rgba(124,58,237,0.22)",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",
    glow: "rgba(124,58,237,0.30)",
    tier: "specialization",
  },
  "microservices-architecture": {
    Icon: Network,
    color: "#0891b2",
    tint: "rgba(8,145,178,0.08)",
    ring: "rgba(8,145,178,0.22)",
    gradient: "linear-gradient(135deg, #155e75 0%, #0891b2 55%, #22d3ee 100%)",
    glow: "rgba(8,145,178,0.28)",
    tier: "advanced",
  },
  "system-design": {
    Icon: Blocks,
    color: "#dc2626",
    tint: "rgba(220,38,38,0.08)",
    ring: "rgba(220,38,38,0.22)",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 55%, #f87171 100%)",
    glow: "rgba(220,38,38,0.30)",
    tier: "advanced",
  },
  "java-advanced": {
    Icon: Shield,
    color: "#7c2d12",
    tint: "rgba(124,45,18,0.08)",
    ring: "rgba(124,45,18,0.22)",
    gradient: "linear-gradient(135deg, #431407 0%, #7c2d12 55%, #c2410c 100%)",
    glow: "rgba(124,45,18,0.30)",
    tier: "advanced",
  },
  "french-advanced": {
    Icon: GraduationCap,
    color: "#9d174d",
    tint: "rgba(157,23,77,0.08)",
    ring: "rgba(157,23,77,0.22)",
    gradient: "linear-gradient(135deg, #500724 0%, #9d174d 55%, #db2777 100%)",
    glow: "rgba(157,23,77,0.30)",
    tier: "specialization",
  },
};

/** Generic fallback when a path doesn't have a meta entry (e.g. brand new). */
const FALLBACK: PathMeta = {
  Icon: Box,
  color: "#475569",
  tint: "rgba(71,85,105,0.08)",
  ring: "rgba(71,85,105,0.22)",
  gradient: "linear-gradient(135deg, #334155 0%, #475569 55%, #64748b 100%)",
  glow: "rgba(71,85,105,0.22)",
  tier: "specialization",
};

export function getPathMeta(slug: string): PathMeta {
  return META[slug] ?? FALLBACK;
}

/* ── Planned (DB-less) tiles for the Knowledge Map ──────────────────────── */

export interface PlannedPath {
  slug: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  tier: PathTier;
}

export const PLANNED_PATHS: PlannedPath[] = [
  {
    slug: "system-design",
    title: "System Design",
    description: "Scalability, reliability & distributed systems patterns.",
    Icon: Server,
    tier: "advanced",
  },
  {
    slug: "kubernetes-infra",
    title: "Kubernetes & Infra",
    description: "Containers, orchestration & cloud-native deployment.",
    Icon: Cloud,
    tier: "advanced",
  },
  {
    slug: "java-deep-dive",
    title: "Java Deep Dive",
    description: "JVM internals, concurrency, Spring & performance.",
    Icon: Code2,
    tier: "advanced",
  },
];
