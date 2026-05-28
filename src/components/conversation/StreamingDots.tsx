"use client";

/**
 * Streaming indicator — slim "..." dots pulsing in mono.
 *
 * Sits below the last user message while the assistant composes a reply.
 * Intentionally NOT a skeleton block: a skeleton implies "we know the shape
 * of what's coming"; for free-form generation we don't, so the right read is
 * "thinking", not "loading content of known size".
 */
export function StreamingDots({ label = "Thinking" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        paddingLeft: 40, // align with bubble column (avatar 28 + 12 gap)
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)",
      }}
    >
      <span>{label}</span>
      <span aria-hidden style={{ display: "inline-flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "currentColor",
              opacity: 0.4,
              animation: "conversation-dot-pulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.18}s`,
              display: "inline-block",
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes conversation-dot-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-1px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] span[aria-hidden] span {
            animation: none !important;
            opacity: 0.6 !important;
          }
        }
      `}</style>
    </div>
  );
}
