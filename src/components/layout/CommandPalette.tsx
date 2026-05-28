"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, CornerDownLeft, Sparkles, MessageSquare,
  Trophy, FileText, ListChecks, Brain, type LucideIcon,
} from "lucide-react";
import { getPathMeta } from "@/lib/learning-paths";

export interface PaletteLesson {
  slug: string;
  title: string;
  pathSlug: string;
  pathTitle: string;
}

export interface PalettePath {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
}

interface CommandPaletteProps {
  paths: PalettePath[];
  lessons: PaletteLesson[];
}

interface PaletteItem {
  id: string;
  type: "path" | "lesson" | "tool";
  title: string;
  subtitle: string;
  href: string;
  Icon: LucideIcon;
  /** Lower-cased search haystack — concat of all searchable fields. */
  haystack: string;
}

const TOOL_ITEMS: PaletteItem[] = [
  {
    id: "tool-tutor",
    type: "tool",
    title: "AI Tutor",
    subtitle: "Ask anything — get an answer framed for a senior engineer",
    href: "/tutor",
    Icon: Sparkles,
    haystack: "ai tutor chat ask question help",
  },
  {
    id: "tool-interview",
    type: "tool",
    title: "Interview Practice",
    subtitle: "Mock AI engineering interview with scored feedback",
    href: "/interview",
    Icon: MessageSquare,
    haystack: "interview mock practice prep feedback",
  },
  {
    id: "tool-quiz",
    type: "tool",
    title: "Quiz Generator",
    subtitle: "Generate a custom quiz for any topic",
    href: "/quiz",
    Icon: ListChecks,
    haystack: "quiz generate test mcq questions",
  },
  {
    id: "tool-flashcards",
    type: "tool",
    title: "Flashcards",
    subtitle: "Spaced-repetition review of every concept",
    href: "/flashcards",
    Icon: Brain,
    haystack: "flashcards srs review spaced repetition",
  },
  {
    id: "tool-challenge",
    type: "tool",
    title: "Daily Challenge",
    subtitle: "Today's bite-sized concept or scenario",
    href: "/challenge",
    Icon: Trophy,
    haystack: "daily challenge today",
  },
  {
    id: "tool-notes",
    type: "tool",
    title: "Notes",
    subtitle: "Your saved notes across lessons",
    href: "/notes",
    Icon: FileText,
    haystack: "notes saved",
  },
];

/**
 * Global Cmd-K command palette.
 *
 * A glowing glass artifact suspended in the canvas (BRIEF §1.4): frosted
 * 640px pane with an ambient violet glow ring, mono input, and section
 * overlines. Renders into a body portal so it floats above all chrome.
 *
 * Keyboard-driven: ⌘K / Ctrl+K to toggle, ↑/↓ to navigate, ↵ to activate,
 * Esc to dismiss. Open/close animates fade + scale via framer-motion;
 * `prefers-reduced-motion` collapses the scale step automatically.
 */
export function CommandPalette({ paths, lessons }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten everything into searchable items.
  const items: PaletteItem[] = useMemo(() => {
    const pathItems: PaletteItem[] = paths.map((p) => {
      const meta = getPathMeta(p.slug);
      return {
        id: `path-${p.slug}`,
        type: "path",
        title: p.title,
        subtitle: `${p.lessonCount} lessons · ${p.description}`,
        href: `/learn/${p.slug}`,
        Icon: meta.Icon,
        haystack: `${p.title} ${p.description} course path`.toLowerCase(),
      };
    });

    const lessonItems: PaletteItem[] = lessons.map((l) => {
      const meta = getPathMeta(l.pathSlug);
      return {
        id: `lesson-${l.slug}`,
        type: "lesson",
        title: l.title,
        subtitle: l.pathTitle,
        href: `/lessons/${l.slug}`,
        Icon: meta.Icon,
        haystack: `${l.title} ${l.pathTitle} lesson`.toLowerCase(),
      };
    });

    return [...pathItems, ...lessonItems, ...TOOL_ITEMS];
  }, [paths, lessons]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      // Show a curated default: all paths + tools (no lesson list noise)
      return items.filter((i) => i.type !== "lesson").slice(0, 16);
    }
    // Fuzzy-ish: every token in query must appear in haystack.
    const tokens = query.split(/\s+/);
    return items.filter((i) => tokens.every((t) => i.haystack.includes(t))).slice(0, 30);
  }, [q, items]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIdx(0);
  }, [q]);

  // Global keyboard listener for Cmd-K / Ctrl-K, plus a custom event so
  // any visible "Search" button anywhere in the app can open the palette
  // without prop-drilling.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ailearn:open-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ailearn:open-palette", onOpenEvent);
    };
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      setQ("");
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) activate(item);
    }
  };

  const activate = (item: PaletteItem) => {
    setOpen(false);
    router.push(item.href);
  };

  // SSR safety
  if (typeof document === "undefined") return null;

  // Motion config — functional easing from DESIGN.md motion budget.
  // framer-motion respects prefers-reduced-motion via MotionConfig at
  // app level; if absent, the scale delta here (0.96 → 1) is small
  // enough to read as a clean fade for users who'd skip transforms.
  const EASE = [0.16, 1, 0.3, 1] as const;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            // Tuned backdrop — keep canvas mesh visible through the scrim
            // so the palette feels suspended in the room, not pinned to a wall.
            background: "hsl(220 20% 4% / 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "12vh 16px 0",
          }}
        >
          <motion.div
            className="glass-pane"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{
              width: "100%",
              maxWidth: 640,
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "70vh",
              // Lit-from-within ambient glow grounded by deep 2xl shadow.
              // .glass-pane already provides inset hairline-top highlight,
              // so we only compose the outward layers here.
              boxShadow: "0 0 80px var(--accent-glow), var(--shadow-2xl)",
            }}
          >
            {/* Search row — no border on the input; section structure defines edges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 22px",
                borderBottom: "1px solid var(--hairline-top)",
              }}
            >
              <Search size={16} strokeWidth={2} color="var(--text-tertiary)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command, search lessons, or ask the tutor…"
                aria-label="Search"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  lineHeight: 1.3,
                  letterSpacing: "-0.005em",
                  color: "var(--text-primary)",
                  // Placeholder color via inline style isn't possible cross-browser;
                  // the input inherits --text-primary, and the ::placeholder rule
                  // in globals sets tertiary by default for inputs. Belt-and-braces:
                  caretColor: "var(--accent)",
                }}
              />
              <kbd
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  padding: "3px 7px",
                  color: "var(--text-tertiary)",
                  background: "color-mix(in srgb, var(--text-primary) 6%, transparent)",
                  border: "1px solid var(--hairline-top)",
                  borderRadius: 5,
                  textTransform: "uppercase",
                }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{
                overflow: "auto",
                maxHeight: "60vh",
                padding: "10px 0 12px",
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "36px 22px",
                    textAlign: "center",
                    color: "var(--text-tertiary)",
                    fontSize: 13.5,
                  }}
                >
                  No matches for{" "}
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    &quot;{q}&quot;
                  </code>
                </div>
              ) : (
                groupItems(filtered).map((group) => (
                  <div key={group.label} style={{ padding: "6px 0 8px" }}>
                    <div
                      className="mono-overline"
                      style={{
                        padding: "8px 22px 6px",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const isActive = item.flatIdx === activeIdx;
                      return (
                        <div
                          key={item.id}
                          data-idx={item.flatIdx}
                          onMouseEnter={() => setActiveIdx(item.flatIdx)}
                          onClick={() => activate(item)}
                          role="button"
                          tabIndex={-1}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            // Tactile left padding shift when selected — 22 → 26
                            padding: isActive ? "11px 22px 11px 26px" : "11px 22px",
                            cursor: "pointer",
                            background: isActive ? "var(--accent-soft)" : "transparent",
                            outline: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                            outlineOffset: -1,
                            boxShadow: isActive ? "0 0 32px var(--accent-glow)" : "none",
                            transition:
                              "padding 160ms cubic-bezier(0.16, 1, 0.3, 1), background 160ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), outline-color 160ms ease",
                            marginInline: 10,
                            borderRadius: 10,
                          }}
                        >
                          <item.Icon
                            size={16}
                            strokeWidth={2}
                            color="var(--text-tertiary)"
                            style={{ flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "var(--text-primary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                lineHeight: 1.35,
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12.5,
                                color: "var(--text-tertiary)",
                                marginTop: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.subtitle}
                            </div>
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              fontWeight: 500,
                              letterSpacing: "0.04em",
                              color: isActive ? "var(--accent-text)" : "var(--text-muted)",
                              flexShrink: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {isActive ? (
                              <>
                                <CornerDownLeft size={12} strokeWidth={2.5} />
                                <span>open</span>
                              </>
                            ) : (
                              <span style={{ opacity: 0.7 }}>{routeTag(item.href)}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints — hairline-top separator, mono eyebrow sizing */}
            <div
              style={{
                padding: "10px 22px",
                borderTop: "1px solid var(--hairline-top)",
                background: "color-mix(in srgb, var(--bg-app) 30%, transparent)",
                display: "flex",
                gap: 18,
                alignItems: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                <span>navigate</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Kbd>↵</Kbd>
                <span>select</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Kbd>esc</Kbd>
                <span>close</span>
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
                <span>anywhere</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "2px 6px",
        background: "color-mix(in srgb, var(--text-primary) 5%, transparent)",
        border: "1px solid var(--hairline-top)",
        borderRadius: 4,
        color: "var(--text-secondary)",
        textTransform: "none",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}

/** Slim route-tag shown in the right gutter when a row isn't active. */
function routeTag(href: string): string {
  // strip leading slash, keep first segment
  const seg = href.replace(/^\//, "").split("/")[0] ?? "";
  return seg.toUpperCase();
}

interface GroupedItem extends PaletteItem {
  flatIdx: number;
}
interface ItemGroup {
  label: string;
  items: GroupedItem[];
}

function groupItems(items: PaletteItem[]): ItemGroup[] {
  const groups: Record<string, GroupedItem[]> = {};
  items.forEach((it, idx) => {
    const label =
      it.type === "path" ? "Paths" : it.type === "lesson" ? "Lessons" : "AI Tutor & Tools";
    if (!groups[label]) groups[label] = [];
    groups[label].push({ ...it, flatIdx: idx });
  });
  const order = ["Paths", "Lessons", "AI Tutor & Tools"];
  return order.filter((l) => groups[l]?.length).map((l) => ({ label: l, items: groups[l] }));
}
