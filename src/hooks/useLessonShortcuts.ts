"use client";

import { useEffect } from "react";

export interface LessonShortcutHandlers {
  /** Navigate to the previous lesson (J / ←). */
  onPrev?: () => void;
  /** Navigate to the next lesson (K / →). Note: J=next, K=prev per spec. */
  onNext?: () => void;
  /** Mark the current lesson complete (M). */
  onMarkComplete?: () => void;
  /** Toggle the lesson-list slide-over panel (T). */
  onTogglePanel?: () => void;
  /** Close the slide-over panel (Esc). No-op if panel is closed. */
  onCloseOnEsc?: () => void;
  /** Toggle the keyboard-shortcuts help overlay (Shift+/ aka ?). */
  onToggleHelp?: () => void;
}

/**
 * Detects whether a key event originated from a typing surface (input/textarea/
 * contenteditable) so we don't hijack keystrokes inside the AI tutor, signup
 * forms, or any other text field.
 */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  // Common ARIA roles for editable surfaces.
  const role = target.getAttribute("role");
  if (role === "textbox" || role === "searchbox" || role === "combobox") return true;
  return false;
}

/**
 * Global keyboard shortcuts for the lesson reader.
 *
 * Bindings:
 *   J or →  — next lesson
 *   K or ←  — previous lesson
 *   M       — mark current lesson complete
 *   T       — toggle slide-over lesson list
 *   Esc     — close slide-over (if open)
 *   ?       — toggle the keyboard-shortcuts help overlay
 *
 * Each handler is optional. If the handler is `undefined`, the key is ignored
 * (e.g. `onNext` is undefined on the last lesson; pressing J / → does nothing).
 *
 * Typing-context detection: events whose target is an <input>, <textarea>,
 * <select>, [contenteditable], or has role="textbox|searchbox|combobox" are
 * ignored entirely, so users can type freely in forms.
 */
export function useLessonShortcuts(handlers: LessonShortcutHandlers): void {
  const {
    onPrev,
    onNext,
    onMarkComplete,
    onTogglePanel,
    onCloseOnEsc,
    onToggleHelp,
  } = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't steal keystrokes from form fields / editable surfaces.
      if (isTypingTarget(e.target)) return;

      // Don't fight with browser/OS modifier combos (Ctrl+J = downloads, etc.).
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // `?` is Shift+/ on US layouts. Match the produced character, not key code,
      // so it works on layouts where ? lives elsewhere.
      if (e.key === "?") {
        if (onToggleHelp) {
          e.preventDefault();
          onToggleHelp();
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          if (onCloseOnEsc) {
            e.preventDefault();
            onCloseOnEsc();
          }
          return;
        case "ArrowRight":
        case "j":
        case "J":
          if (onNext) {
            e.preventDefault();
            onNext();
          }
          return;
        case "ArrowLeft":
        case "k":
        case "K":
          if (onPrev) {
            e.preventDefault();
            onPrev();
          }
          return;
        case "m":
        case "M":
          if (onMarkComplete) {
            e.preventDefault();
            onMarkComplete();
          }
          return;
        case "t":
        case "T":
          if (onTogglePanel) {
            e.preventDefault();
            onTogglePanel();
          }
          return;
        default:
          return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPrev, onNext, onMarkComplete, onTogglePanel, onCloseOnEsc, onToggleHelp]);
}
