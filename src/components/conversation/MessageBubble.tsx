"use client";

import { Sparkles } from "lucide-react";
import { MessageProse } from "./MessageProse";

export type Role = "user" | "assistant";

interface MessageBubbleProps {
  role: Role;
  content: string;
  /** Author monogram for the user avatar (single letter). */
  userInitial?: string;
  /** ISO-ish timestamp (or pre-formatted "HH:MM"). Renders below the bubble. */
  timestamp?: string;
  /** Label shown for assistant variant: "Tutor" or "Interviewer". */
  assistantLabel?: string;
}

/**
 * Message bubble — shared between Tutor and Interview.
 *
 * Decisions (intentional, per Wave 4b brief):
 * - User: right-aligned, `--accent-soft` background, hairline accent border
 *   (color-mix at 25% accent), max-width 70%, padding 12/16. Reads as a chip,
 *   not a quote.
 * - Assistant: left-aligned, NO bubble background, NO border. The assistant's
 *   prose IS the reading material — treat it like lesson text flowing on the
 *   canvas. This is the central typographic decision of this surface.
 * - Avatars: 28px circle, user gets a monogram in accent-soft, assistant
 *   gets a Sparkles glyph in text-tertiary (abstract, not a personification).
 * - Timestamp: 10.5px mono in text-muted, below the bubble.
 *
 * The component renders nothing chrome-y for the assistant beyond the
 * avatar — the prose itself carries weight. Code blocks inside the prose
 * are surfaced as artifacts (see CodeArtifact).
 */
export function MessageBubble({
  role,
  content,
  userInitial = "Y",
  timestamp,
  assistantLabel = "Tutor",
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className="conversation-message"
      data-role={role}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      {/* Avatar */}
      <div
        aria-hidden
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isUser ? "var(--accent-soft)" : "transparent",
          border: isUser
            ? "1px solid color-mix(in oklch, var(--accent), transparent 70%)"
            : "1px solid var(--border-subtle)",
          color: isUser ? "var(--accent-text)" : "var(--text-tertiary)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.04em",
          marginTop: 2,
        }}
      >
        {isUser ? userInitial.slice(0, 1).toUpperCase() : <Sparkles size={14} strokeWidth={2} />}
      </div>

      {/* Bubble column */}
      <div
        style={{
          maxWidth: isUser ? "70%" : "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          gap: 4,
        }}
      >
        {!isUser && (
          <span
            className="mono-overline"
            style={{
              color: "var(--text-tertiary)",
              fontSize: 9.5,
              letterSpacing: "0.16em",
              marginBottom: 2,
            }}
          >
            {assistantLabel}
          </span>
        )}

        <div
          style={
            isUser
              ? {
                  background: "var(--accent-soft)",
                  border:
                    "1px solid color-mix(in oklch, var(--accent), transparent 75%)",
                  borderRadius: "var(--radius-lg)",
                  padding: "12px 16px",
                  color: "var(--text-primary)",
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }
              : {
                  // No bubble. Prose floats on the canvas.
                  width: "100%",
                  minWidth: 0,
                  color: "var(--text-primary)",
                }
          }
        >
          {isUser ? content : <MessageProse content={content} />}
        </div>

        {timestamp && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              marginTop: 2,
            }}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
