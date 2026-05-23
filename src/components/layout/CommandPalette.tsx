"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search, BookOpen, ArrowRight, Sparkles, MessageSquare,
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
  iconColor: string;
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
    iconColor: "var(--accent)",
    haystack: "ai tutor chat ask question help",
  },
  {
    id: "tool-interview",
    type: "tool",
    title: "Interview Practice",
    subtitle: "Mock AI engineering interview with scored feedback",
    href: "/interview",
    Icon: MessageSquare,
    iconColor: "#ef4444",
    haystack: "interview mock practice prep feedback",
  },
  {
    id: "tool-quiz",
    type: "tool",
    title: "Quiz Generator",
    subtitle: "Generate a custom quiz for any topic",
    href: "/quiz",
    Icon: ListChecks,
    iconColor: "#0f766e",
    haystack: "quiz generate test mcq questions",
  },
  {
    id: "tool-flashcards",
    type: "tool",
    title: "Flashcards",
    subtitle: "Spaced-repetition review of every concept",
    href: "/flashcards",
    Icon: Brain,
    iconColor: "#7c5cff",
    haystack: "flashcards srs review spaced repetition",
  },
  {
    id: "tool-challenge",
    type: "tool",
    title: "Daily Challenge",
    subtitle: "Today's bite-sized concept or scenario",
    href: "/challenge",
    Icon: Trophy,
    iconColor: "var(--xp-gold)",
    haystack: "daily challenge today",
  },
  {
    id: "tool-notes",
    type: "tool",
    title: "Notes",
    subtitle: "Your saved notes across lessons",
    href: "/notes",
    Icon: FileText,
    iconColor: "#475569",
    haystack: "notes saved",
  },
];

/**
 * Global Cmd-K command palette.
 *
 * Renders into a portal at the document root so it floats above everything.
 * Keyboard-driven: open with Cmd+K / Ctrl+K, navigate with ↑/↓, Enter to
 * activate, Esc to dismiss.
 *
 * Items are flattened across courses, lessons, and tools — a single fuzzy
 * search field lets the user jump anywhere without clicking through menus.
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
        iconColor: meta.color,
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
        iconColor: meta.color,
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

  return (
    <>
      {/* Hidden trigger button — keyboard only, no UI; we expose Cmd-K hint elsewhere */}
      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "color-mix(in srgb, var(--text-primary) 35%, transparent)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "10vh 16px 0",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 620,
              background: "var(--bg-card)",
              borderRadius: 14,
              border: "1px solid var(--border-default)",
              boxShadow: "0 24px 56px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "70vh",
            }}
          >
            {/* Search row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 18px",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <Search size={16} color="var(--text-tertiary)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search courses, lessons, or tools…"
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: "transparent", fontSize: 15,
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                }}
              />
              <kbd style={{
                fontSize: 10, fontFamily: "var(--font-mono)",
                color: "var(--text-tertiary)",
                padding: "2px 6px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 4,
              }}>
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ overflow: "auto", maxHeight: "60vh", padding: "6px 0" }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: "30px 18px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontSize: 13.5,
                }}>
                  Nothing matches <code style={{ fontFamily: "var(--font-mono)" }}>&quot;{q}&quot;</code>
                </div>
              ) : (
                groupItems(filtered).map((group) => (
                  <div key={group.label} style={{ padding: "4px 0" }}>
                    <div style={{
                      padding: "6px 18px 4px",
                      fontSize: 10.5, fontWeight: 700,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}>
                      {group.label}
                    </div>
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        data-idx={item.flatIdx}
                        onMouseEnter={() => setActiveIdx(item.flatIdx)}
                        onClick={() => activate(item)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "9px 18px",
                          cursor: "pointer",
                          background: item.flatIdx === activeIdx ? "var(--accent-light)" : "transparent",
                        }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 7,
                          background: `color-mix(in srgb, ${item.iconColor} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${item.iconColor} 22%, transparent)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <item.Icon size={14} color={item.iconColor} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13.5, fontWeight: 600,
                            color: "var(--text-primary)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            fontSize: 11.5, color: "var(--text-tertiary)",
                            marginTop: 1,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {item.subtitle}
                          </div>
                        </div>
                        <ArrowRight size={13} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div style={{
              padding: "8px 18px",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
              display: "flex", gap: 16, alignItems: "center",
              fontSize: 11, color: "var(--text-tertiary)",
            }}>
              <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
              <span><Kbd>↵</Kbd> open</span>
              <span><Kbd>esc</Kbd> close</span>
              <span style={{ marginLeft: "auto" }}>
                <Kbd>⌘</Kbd> <Kbd>K</Kbd> anywhere
              </span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      fontFamily: "var(--font-mono)", fontSize: 10,
      padding: "1px 5px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 3,
      color: "var(--text-secondary)",
    }}>{children}</kbd>
  );
}

interface GroupedItem extends PaletteItem { flatIdx: number }
interface ItemGroup { label: string; items: GroupedItem[] }

function groupItems(items: PaletteItem[]): ItemGroup[] {
  const groups: Record<string, GroupedItem[]> = {};
  items.forEach((it, idx) => {
    const label = it.type === "path" ? "Courses" : it.type === "lesson" ? "Lessons" : "Tools";
    if (!groups[label]) groups[label] = [];
    groups[label].push({ ...it, flatIdx: idx });
  });
  const order = ["Courses", "Lessons", "Tools"];
  return order.filter((l) => groups[l]?.length).map((l) => ({ label: l, items: groups[l] }));
}
