"use client";

/**
 * AtlasCanvas — the force-directed knowledge graph renderer.
 *
 * Physics: d3-force (link / charge / collide / positioning) pre-settled at
 * mount so the map appears calm, then re-heated only while dragging nodes.
 * Rendering: a single DPR-scaled <canvas> redrawn on demand (dirty flag), so
 * an idle map costs nothing. Pan, zoom-to-cursor, pinch, node dragging and
 * hover hit-testing are all handled with pointer events on the canvas.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import type { AtlasLink, AtlasNode } from "@/lib/map-graph";

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface AtlasCanvasHandle {
  /** Animated pan/zoom to a node (also used by search) */
  focusNode(id: string): void;
  zoomBy(factor: number): void;
  fitView(): void;
}

interface AtlasCanvasProps {
  nodes: AtlasNode[];
  links: AtlasLink[];
  selectedId: string | null;
  /** Node ids matching the active search, or null when not searching */
  searchIds: ReadonlySet<string> | null;
  onSelect(id: string | null): void;
  onNavigate(url: string): void;
  onHover?(id: string | null): void;
}

type SimNode = AtlasNode & SimulationNodeDatum;

interface SimLink {
  source: SimNode;
  target: SimNode;
  kind: AtlasLink["kind"];
}

interface Camera {
  x: number;
  y: number;
  k: number;
}

interface ThemeTokens {
  bg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  fontSans: string;
  fontMono: string;
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const MIN_K = 0.18;
const MAX_K = 4;
const CLICK_SLOP = 5; // px of movement that still counts as a click
const DOUBLE_MS = 350;
const LABEL_RAMP_START = 1.0; // zoom level where lesson labels start fading in
const LABEL_RAMP_END = 1.5;

function clampK(k: number) {
  return Math.max(MIN_K, Math.min(MAX_K, k));
}

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

function readTokens(): ThemeTokens {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    bg: v("--bg-app", "hsl(220 20% 4%)"),
    textPrimary: v("--text-primary", "hsl(220 15% 96%)"),
    textSecondary: v("--text-secondary", "hsl(220 12% 72%)"),
    textMuted: v("--text-muted", "hsl(220 8% 38%)"),
    accent: v("--accent", "hsl(258 92% 72%)"),
    fontSans: v("--font-sans", "Inter, sans-serif"),
    fontMono: v("--font-mono", "monospace"),
  };
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const AtlasCanvas = forwardRef<AtlasCanvasHandle, AtlasCanvasProps>(
  function AtlasCanvas({ nodes, links, selectedId, searchIds, onSelect, onNavigate, onHover }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Everything mutable lives in one ref so the render loop never closes over
    // stale state.
    const world = useRef<{
      sim: Simulation<SimNode, SimLink> | null;
      nodes: SimNode[];
      links: SimLink[];
      byId: Map<string, SimNode>;
      adjacency: Map<string, Set<string>>;
      cam: Camera;
      camAnim: { from: Camera; to: Camera; start: number; ms: number } | null;
      size: { w: number; h: number; dpr: number };
      tokens: ThemeTokens;
      hovered: string | null;
      selected: string | null;
      search: ReadonlySet<string> | null;
      dirty: boolean;
      raf: number;
      reducedMotion: boolean;
    }>({
      sim: null,
      nodes: [],
      links: [],
      byId: new Map(),
      adjacency: new Map(),
      cam: { x: 0, y: 0, k: 0.6 },
      camAnim: null,
      size: { w: 0, h: 0, dpr: 1 },
      tokens: {
        bg: "#0a0c10",
        textPrimary: "#f2f3f7",
        textSecondary: "#adb2c2",
        textMuted: "#5b6172",
        accent: "#a78bfa",
        fontSans: "Inter, sans-serif",
        fontMono: "monospace",
      },
      hovered: null,
      selected: null,
      search: null,
      dirty: true,
      raf: 0,
      reducedMotion: false,
    });

    // Camera API installed by the main effect, consumed by the handle
    const camApi = useRef<{
      fitCamera(): Camera;
      animateTo(target: Camera, ms?: number): void;
    } | null>(null);

    // Keep externally-controlled state mirrored into the world ref
    useEffect(() => {
      const w = world.current;
      w.selected = selectedId;
      w.search = searchIds;
      w.dirty = true;
    }, [selectedId, searchIds]);

    /* ── Simulation + render loop (mount once per graph) ─────────────────── */
    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = world.current;

      w.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      w.tokens = readTokens();

      /* Seed positions: hubs on a ring, lessons orbiting their hub. A
         deterministic start keeps the settled layout stable across visits. */
      const hubs = nodes.filter((n) => n.kind === "path" || n.kind === "hub");
      const hubAngle = new Map<string, number>();
      const RING = 90 + hubs.length * 26;
      hubs.forEach((h, i) => {
        hubAngle.set(h.id, (i / hubs.length) * Math.PI * 2 - Math.PI / 2);
      });

      const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
      const byId = new Map(simNodes.map((n) => [n.id, n]));

      const childIdx = new Map<string, number>();
      for (const n of simNodes) {
        if (n.kind === "path" || n.kind === "hub") {
          const a = hubAngle.get(n.id) ?? 0;
          n.x = Math.cos(a) * RING;
          n.y = Math.sin(a) * RING;
        }
      }
      for (const n of simNodes) {
        if (n.parent) {
          const p = byId.get(n.parent);
          const siblings = nodes.filter((m) => m.parent === n.parent).length;
          const idx = childIdx.get(n.parent) ?? 0;
          childIdx.set(n.parent, idx + 1);
          const base = hubAngle.get(n.parent) ?? 0;
          const a = base + (idx / Math.max(1, siblings)) * Math.PI * 2;
          const orbit = (p?.r ?? 14) + 46;
          n.x = (p?.x ?? 0) + Math.cos(a) * orbit;
          n.y = (p?.y ?? 0) + Math.sin(a) * orbit;
        }
      }

      const simLinks: SimLink[] = links
        .filter((l) => byId.has(l.source) && byId.has(l.target))
        .map((l) => ({
          source: byId.get(l.source)!,
          target: byId.get(l.target)!,
          kind: l.kind,
        }));

      const adjacency = new Map<string, Set<string>>();
      for (const n of simNodes) adjacency.set(n.id, new Set());
      for (const l of simLinks) {
        adjacency.get(l.source.id)!.add(l.target.id);
        adjacency.get(l.target.id)!.add(l.source.id);
      }

      const sim = forceSimulation<SimNode>(simNodes)
        .force(
          "link",
          forceLink<SimNode, SimLink>(simLinks)
            .id((d) => d.id)
            .distance((l) =>
              l.kind === "spoke"
                ? (l.source.r ?? 12) + 52
                : l.kind === "chain"
                  ? 40
                  : 250,
            )
            .strength((l) => (l.kind === "spoke" ? 0.85 : l.kind === "chain" ? 0.3 : 0.12)),
        )
        .force(
          "charge",
          forceManyBody<SimNode>()
            .strength((d) => (d.kind === "path" || d.kind === "hub" ? -560 : -52))
            .distanceMax(640),
        )
        .force("collide", forceCollide<SimNode>((d) => d.r + 7).strength(0.9))
        .force("x", forceX<SimNode>(0).strength((d) => (d.parent ? 0.018 : 0.055)))
        .force("y", forceY<SimNode>(0).strength((d) => (d.parent ? 0.018 : 0.055)))
        .stop();

      // Pre-settle so the first paint is already a calm constellation
      for (let i = 0; i < 320 && sim.alpha() > 0.02; i++) sim.tick();

      sim.on("tick", () => {
        w.dirty = true;
      });

      w.sim = sim;
      w.nodes = simNodes;
      w.links = simLinks;
      w.byId = byId;
      w.adjacency = adjacency;

      /* ── Sizing ─────────────────────────────────────────────────────── */
      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        w.size = { w: rect.width, h: rect.height, dpr };
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        w.dirty = true;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      /* ── Camera helpers ─────────────────────────────────────────────── */
      const fitCamera = (): Camera => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const n of w.nodes) {
          minX = Math.min(minX, (n.x ?? 0) - n.r);
          maxX = Math.max(maxX, (n.x ?? 0) + n.r);
          minY = Math.min(minY, (n.y ?? 0) - n.r);
          maxY = Math.max(maxY, (n.y ?? 0) + n.r);
        }
        const pad = 90;
        const bw = maxX - minX + pad * 2;
        const bh = maxY - minY + pad * 2;
        const k = clampK(Math.min(w.size.w / bw, w.size.h / bh));
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, k };
      };

      const animateTo = (target: Camera, ms = 550) => {
        if (w.reducedMotion || ms <= 0) {
          w.cam = { ...target };
          w.camAnim = null;
          w.dirty = true;
          return;
        }
        w.camAnim = { from: { ...w.cam }, to: { ...target }, start: performance.now(), ms };
        w.dirty = true;
      };

      // Initial view: fitted, instant
      w.cam = fitCamera();
      camApi.current = { fitCamera, animateTo };

      /* ── Coordinate transforms + hit testing ────────────────────────── */
      const toWorld = (sx: number, sy: number) => ({
        x: (sx - w.size.w / 2) / w.cam.k + w.cam.x,
        y: (sy - w.size.h / 2) / w.cam.k + w.cam.y,
      });

      const hitTest = (sx: number, sy: number): SimNode | null => {
        const p = toWorld(sx, sy);
        let best: SimNode | null = null;
        let bestDist = Infinity;
        for (const n of w.nodes) {
          const dx = p.x - (n.x ?? 0);
          const dy = p.y - (n.y ?? 0);
          const d = Math.hypot(dx, dy);
          const reach = Math.max(n.r, 9 / w.cam.k) + 2;
          if (d < reach && d < bestDist) {
            best = n;
            bestDist = d;
          }
        }
        return best;
      };

      /* ── Pointer interactions ───────────────────────────────────────── */
      const pointers = new Map<number, { x: number; y: number }>();
      let mode: "idle" | "pan" | "node" | "pinch" = "idle";
      let dragNode: SimNode | null = null;
      let moved = 0;
      let pinchBase = { dist: 1, k: 1 };
      let lastClick = { id: "", t: 0 };

      const localPos = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      const onPointerDown = (e: PointerEvent) => {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Synthetic events (tests, automation) may carry inactive pointer ids
        }
        const pos = localPos(e);
        pointers.set(e.pointerId, pos);

        if (pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          pinchBase = { dist: Math.max(24, Math.hypot(a.x - b.x, a.y - b.y)), k: w.cam.k };
          if (dragNode) {
            dragNode.fx = null;
            dragNode.fy = null;
            dragNode = null;
          }
          mode = "pinch";
          return;
        }

        moved = 0;
        const hit = hitTest(pos.x, pos.y);
        if (hit) {
          mode = "node";
          dragNode = hit;
          const p = toWorld(pos.x, pos.y);
          hit.fx = p.x;
          hit.fy = p.y;
        } else {
          mode = "pan";
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        const pos = localPos(e);
        const prev = pointers.get(e.pointerId);
        pointers.set(e.pointerId, pos);

        if (mode === "pinch" && pointers.size >= 2) {
          const [a, b] = [...pointers.values()];
          const dist = Math.max(24, Math.hypot(a.x - b.x, a.y - b.y));
          w.cam.k = clampK(pinchBase.k * (dist / pinchBase.dist));
          w.camAnim = null;
          w.dirty = true;
          return;
        }

        if (!prev) return;
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        moved += Math.abs(dx) + Math.abs(dy);

        if (mode === "node" && dragNode) {
          if (moved > CLICK_SLOP && w.sim) {
            // Only heat the sim once it's a real drag, not a sloppy click
            if (w.sim.alphaTarget() === 0) w.sim.alphaTarget(0.28).restart();
          }
          const p = toWorld(pos.x, pos.y);
          dragNode.fx = p.x;
          dragNode.fy = p.y;
          w.dirty = true;
        } else if (mode === "pan") {
          w.cam.x -= dx / w.cam.k;
          w.cam.y -= dy / w.cam.k;
          w.camAnim = null;
          w.dirty = true;
        } else if (mode === "idle") {
          const hit = hitTest(pos.x, pos.y);
          const id = hit?.id ?? null;
          if (id !== w.hovered) {
            w.hovered = id;
            onHover?.(id);
            canvas.style.cursor = id ? "pointer" : "grab";
            w.dirty = true;
          }
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        pointers.delete(e.pointerId);

        if (mode === "node" && dragNode) {
          dragNode.fx = null;
          dragNode.fy = null;
          w.sim?.alphaTarget(0);
        }

        if ((mode === "node" || mode === "pan") && moved <= CLICK_SLOP) {
          const now = performance.now();
          if (mode === "node" && dragNode) {
            if (lastClick.id === dragNode.id && now - lastClick.t < DOUBLE_MS) {
              onNavigate(dragNode.url);
              lastClick = { id: "", t: 0 };
            } else {
              onSelect(dragNode.id);
              lastClick = { id: dragNode.id, t: now };
            }
          } else if (mode === "pan") {
            onSelect(null);
            lastClick = { id: "", t: 0 };
          }
        }

        dragNode = null;
        mode = pointers.size === 0 ? "idle" : mode;
        if (pointers.size < 2 && mode === "pinch") mode = pointers.size === 1 ? "pan" : "idle";
        w.dirty = true;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const pos = { x: e.offsetX, y: e.offsetY };
        const before = toWorld(pos.x, pos.y);
        const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.008 : 0.0022));
        w.cam.k = clampK(w.cam.k * factor);
        // Keep the world point under the cursor fixed
        w.cam.x = before.x - (pos.x - w.size.w / 2) / w.cam.k;
        w.cam.y = before.y - (pos.y - w.size.h / 2) / w.cam.k;
        w.camAnim = null;
        w.dirty = true;
      };

      const onLeave = () => {
        if (w.hovered) {
          w.hovered = null;
          onHover?.(null);
          canvas.style.cursor = "grab";
          w.dirty = true;
        }
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("wheel", onWheel, { passive: false });
      canvas.style.cursor = "grab";
      canvas.style.touchAction = "none";

      /* ── Theme changes ──────────────────────────────────────────────── */
      const themeObserver = new MutationObserver(() => {
        w.tokens = readTokens();
        w.dirty = true;
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      /* ── Draw ───────────────────────────────────────────────────────── */
      const draw = () => {
        const { w: vw, h: vh, dpr } = w.size;
        const t = w.tokens;
        const cam = w.cam;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, vw, vh);

        // Focus set: hover wins, then selection. Search overrides both.
        const focusId = w.hovered ?? w.selected;
        const searching = w.search !== null;
        const focusSet: Set<string> | null =
          !searching && focusId && w.adjacency.has(focusId)
            ? new Set([focusId, ...w.adjacency.get(focusId)!])
            : null;

        const nodeAlpha = (n: SimNode): number => {
          if (searching) return w.search!.has(n.id) ? 1 : 0.1;
          if (focusSet) return focusSet.has(n.id) ? 1 : 0.13;
          return 1;
        };

        ctx.save();
        ctx.translate(vw / 2, vh / 2);
        ctx.scale(cam.k, cam.k);
        ctx.translate(-cam.x, -cam.y);

        /* links */
        const minW = 0.7 / cam.k;
        for (const l of w.links) {
          const a = Math.min(nodeAlpha(l.source), nodeAlpha(l.target));
          const inFocus =
            focusSet !== null && focusSet.has(l.source.id) && focusSet.has(l.target.id) &&
            (l.source.id === focusId || l.target.id === focusId);
          const base = l.kind === "bridge" ? 0.4 : l.kind === "spoke" ? 0.3 : 0.2;
          ctx.globalAlpha = a * (inFocus ? Math.min(1, base * 2.6) : base);
          if (l.kind === "bridge") {
            const g = ctx.createLinearGradient(
              l.source.x ?? 0, l.source.y ?? 0, l.target.x ?? 0, l.target.y ?? 0,
            );
            g.addColorStop(0, l.source.color);
            g.addColorStop(1, l.target.color);
            ctx.strokeStyle = g;
            ctx.lineWidth = Math.max(1.7, minW);
          } else {
            ctx.strokeStyle = l.source.kind === "lesson" ? l.source.color : l.target.color;
            ctx.lineWidth = Math.max(l.kind === "spoke" ? 1.2 : 1, minW);
          }
          ctx.beginPath();
          ctx.moveTo(l.source.x ?? 0, l.source.y ?? 0);
          ctx.lineTo(l.target.x ?? 0, l.target.y ?? 0);
          ctx.stroke();
        }

        /* nodes */
        for (const n of w.nodes) {
          const x = n.x ?? 0;
          const y = n.y ?? 0;
          const alpha = nodeAlpha(n);
          const isHub = n.kind === "path" || n.kind === "hub";
          const isSelected = n.id === w.selected;
          const isHovered = n.id === w.hovered;

          if (isHub) {
            // Ambient glow — the node is a light source on the canvas
            const glowR = n.r * 2.8;
            const grad = ctx.createRadialGradient(x, y, n.r * 0.5, x, y, glowR);
            grad.addColorStop(0, n.color);
            grad.addColorStop(1, "transparent");
            ctx.globalAlpha = alpha * (isHovered || isSelected ? 0.4 : 0.22);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // Disc
            ctx.globalAlpha = alpha;
            ctx.fillStyle = n.color;
            ctx.beginPath();
            ctx.arc(x, y, n.r, 0, Math.PI * 2);
            ctx.fill();

            // Progress ring
            if (n.lessonCount && n.lessonCount > 0) {
              const frac = (n.completedCount ?? 0) / n.lessonCount;
              ctx.lineWidth = 2.4;
              ctx.globalAlpha = alpha * 0.25;
              ctx.strokeStyle = n.color;
              ctx.beginPath();
              ctx.arc(x, y, n.r + 5.5, 0, Math.PI * 2);
              ctx.stroke();
              if (frac > 0) {
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = t.textPrimary;
                ctx.beginPath();
                ctx.arc(x, y, n.r + 5.5, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
                ctx.stroke();
              }
            }
          } else {
            const done = n.status === "COMPLETED";
            const started = n.status === "IN_PROGRESS";
            ctx.globalAlpha = alpha * (done ? 1 : 0.38);
            ctx.fillStyle = n.color;
            ctx.beginPath();
            ctx.arc(x, y, n.r, 0, Math.PI * 2);
            ctx.fill();
            if (started) {
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = n.color;
              ctx.lineWidth = Math.max(1.6, minW);
              ctx.beginPath();
              ctx.arc(x, y, n.r + 1.6, 0, Math.PI * 2);
              ctx.stroke();
            } else if (done) {
              ctx.globalAlpha = alpha * 0.35;
              ctx.strokeStyle = n.color;
              ctx.lineWidth = Math.max(2.2, minW);
              ctx.beginPath();
              ctx.arc(x, y, n.r + 2.2, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          if (isSelected || isHovered) {
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = isSelected ? t.accent : t.textPrimary;
            ctx.lineWidth = Math.max(isSelected ? 2 : 1.4, minW);
            ctx.beginPath();
            ctx.arc(x, y, n.r + (isHub ? 9 : 4.5), 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        ctx.restore();

        /* labels — screen space so they stay crisp at every zoom */
        const lessonRamp = Math.max(
          0,
          Math.min(1, (cam.k - LABEL_RAMP_START) / (LABEL_RAMP_END - LABEL_RAMP_START)),
        );
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.lineJoin = "round";

        for (const n of w.nodes) {
          const isHub = n.kind === "path" || n.kind === "hub";
          const base = nodeAlpha(n);
          let labelAlpha: number;
          if (isHub) {
            labelAlpha = base;
          } else if (n.id === w.hovered || n.id === w.selected) {
            labelAlpha = 1;
          } else {
            const inFocus =
              (focusSet !== null && focusSet.has(n.id)) || (searching && w.search!.has(n.id));
            // Neighbor/search labels only once there's room for them; below
            // that zoom they'd pile on top of each other inside a cluster.
            labelAlpha = inFocus && cam.k >= 0.75 ? 1 : lessonRamp * base;
          }
          if (labelAlpha < 0.04) continue;

          const sx = ((n.x ?? 0) - cam.x) * cam.k + vw / 2;
          const sy = ((n.y ?? 0) - cam.y) * cam.k + vh / 2 + (n.r + (isHub ? 8 : 5)) * cam.k;
          if (sx < -160 || sx > vw + 160 || sy < -40 || sy > vh + 40) continue;

          const text = truncate(n.label, isHub ? 34 : 30);
          ctx.font = isHub
            ? `600 12.5px ${t.fontSans}`
            : `500 10.5px ${t.fontSans}`;
          ctx.globalAlpha = labelAlpha;
          ctx.strokeStyle = t.bg;
          ctx.lineWidth = 3;
          ctx.strokeText(text, sx, sy + 3);
          ctx.fillStyle = isHub ? t.textPrimary : t.textSecondary;
          ctx.fillText(text, sx, sy + 3);
        }

        ctx.globalAlpha = 1;
      };

      /* ── Render loop (draws only when dirty) ────────────────────────── */
      const loop = (now: number) => {
        w.raf = requestAnimationFrame(loop);

        if (w.camAnim) {
          const { from, to, start, ms } = w.camAnim;
          const p = Math.min(1, (now - start) / ms);
          const e = easeOutQuint(p);
          w.cam = {
            x: from.x + (to.x - from.x) * e,
            y: from.y + (to.y - from.y) * e,
            k: from.k + (to.k - from.k) * e,
          };
          if (p >= 1) w.camAnim = null;
          w.dirty = true;
        }

        if (!w.dirty) return;
        w.dirty = false;
        draw();
      };
      w.raf = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(w.raf);
        ro.disconnect();
        themeObserver.disconnect();
        sim.stop();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("wheel", onWheel);
      };
      // The graph payload is static per page load; interactions use refs.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, links]);

    useImperativeHandle(ref, () => ({
      focusNode(id: string) {
        const w = world.current;
        const n = w.byId.get(id);
        if (!n || !camApi.current) return;
        camApi.current.animateTo(
          { x: n.x ?? 0, y: n.y ?? 0, k: Math.max(w.cam.k, 1.25) },
          600,
        );
      },
      zoomBy(factor: number) {
        const w = world.current;
        if (!camApi.current) return;
        camApi.current.animateTo(
          { x: w.cam.x, y: w.cam.y, k: clampK(w.cam.k * factor) },
          260,
        );
      },
      fitView() {
        if (!camApi.current) return;
        camApi.current.animateTo(camApi.current.fitCamera(), 550);
      },
    }));

    return (
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        <canvas ref={canvasRef} aria-label="Course knowledge map" role="application" />
      </div>
    );
  },
);
