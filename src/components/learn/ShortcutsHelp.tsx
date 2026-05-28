"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Shortcut {
  /** Human-readable description of what the shortcut does. */
  label: string;
  /** Ordered key combos that trigger this shortcut (rendered as kbd pills). */
  keys: string[];
}

const SHORTCUTS: Shortcut[] = [
  { label: "Next lesson",            keys: ["J", "→"] },
  { label: "Previous lesson",        keys: ["K", "←"] },
  { label: "Mark lesson complete",   keys: ["M"] },
  { label: "Toggle lesson list",     keys: ["T"] },
  { label: "Close panel / dialog",   keys: ["Esc"] },
  { label: "Show this help",         keys: ["?"] },
];

/**
 * Modal overlay listing the reader's keyboard shortcuts. Rendered to
 * document.body via a portal so it sits above the topbar, side panel, and
 * XP banner. Visibility is controlled by the parent (`open`); pressing Esc
 * or clicking the backdrop calls `onClose`.
 *
 * Why a portal: matches the pattern used by the slide-over lesson panel in
 * LessonPageClient — it lets the overlay escape any ancestor `overflow:
 * hidden` or stacking-context boundaries.
 */
export function ShortcutsHelp({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Esc-to-dismiss handled internally so the overlay works even when used
  // outside the lesson reader. The global lesson shortcuts hook also exposes
  // an Esc handler, but it's gated on the slide-over panel being open — this
  // listener ensures the help overlay is always Esc-dismissable.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="shortcuts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            style={{
              position: "fixed", inset: 0, zIndex: 10010,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Dialog */}
          <motion.div
            key="shortcuts-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-help-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10011,
              width: "min(440px, calc(100vw - 32px))",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
              padding: "20px 22px 22px",
              color: "var(--text-primary)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-secondary)",
                }}>
                  <Keyboard size={16} />
                </div>
                <h2
                  id="shortcuts-help-title"
                  style={{
                    margin: 0,
                    fontSize: 15, fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Keyboard shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close keyboard shortcuts"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-tertiary)", padding: 4, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Shortcut list */}
            <ul style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              {SHORTCUTS.map((sc) => (
                <li
                  key={sc.label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 4px",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{sc.label}</span>
                  <span style={{ display: "flex", gap: 6 }}>
                    {sc.keys.map((k, i) => (
                      <kbd
                        key={`${sc.label}-${i}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center", justifyContent: "center",
                          minWidth: 26, height: 24,
                          padding: "0 7px",
                          background: "var(--bg-sunken)",
                          border: "1px solid var(--border-subtle)",
                          borderBottomWidth: 2,
                          borderRadius: 6,
                          fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
                          fontSize: 11.5, fontWeight: 600,
                          color: "var(--text-primary)",
                          lineHeight: 1,
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <p style={{
              margin: "14px 0 0",
              fontSize: 11.5, color: "var(--text-tertiary)",
              lineHeight: 1.5,
            }}>
              Shortcuts are disabled while typing in a form field.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
