"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Below-input hint row (e.g. shortcut legend). */
  hint?: React.ReactNode;
  /** Aria label for the submit button. */
  submitLabel?: string;
  /** Auto-focus on mount. Tutor wants this; Interview answer-pane also benefits. */
  autoFocus?: boolean;
}

/**
 * Pinned composer for Tutor + Interview.
 *
 * Frosted glass background per DESIGN.md so the input feels distinct from
 * the canvas without needing a hard border. Auto-resizing textarea capped
 * at ~6 lines. Submit button sits in the bottom-right corner of the input.
 *
 * Keyboard: Enter submits; Shift+Enter inserts a newline.
 */
export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  hint,
  submitLabel = "Send",
  autoFocus,
}: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic. Recompute on every value change.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 22; // matches font-size:15 / line-height:1.5
    const maxH = lineHeight * 6 + 8; // 6 lines + a hair of padding
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim().length > 0) onSubmit();
    }
  };

  const canSubmit = !disabled && value.trim().length > 0;

  return (
    <div
      className="glass-pane"
      style={{
        borderRadius: "var(--radius-lg)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          minHeight: 24,
        }}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          autoFocus={autoFocus}
          aria-label="Message"
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontFamily: "inherit",
            fontSize: 15,
            lineHeight: 1.5,
            resize: "none",
            maxHeight: 22 * 6 + 8,
            overflowY: "auto",
            padding: "2px 4px",
          }}
        />

        <button
          type="button"
          onClick={() => canSubmit && onSubmit()}
          disabled={!canSubmit}
          aria-label={submitLabel}
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: "var(--radius-md)",
            background: canSubmit ? "var(--accent)" : "var(--bg-overlay)",
            color: canSubmit ? "white" : "var(--text-muted)",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.22s ease",
            boxShadow: canSubmit ? "0 0 30px var(--accent-glow)" : "none",
          }}
        >
          <Send size={14} strokeWidth={2.2} />
        </button>
      </div>

      {hint && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
