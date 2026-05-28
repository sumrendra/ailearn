"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeArtifactProps {
  /** Raw source text. Stripped of any trailing newlines. */
  code: string;
  /** Language label shown in the header strip (e.g. "python", "ts"). */
  language?: string;
  /** Inline / pre prop: when true, render no header strip. */
  bare?: boolean;
}

/**
 * Shared code-block surface for any AI conversation message (Tutor + Interview).
 *
 * Treats code blocks as small artifacts in their own right: sunken background,
 * hairline border, a thin header strip with the language label on the left and
 * a copy button on the right. This is intentionally heavier than inline code —
 * code IS often the answer in this product, so it deserves to be read as a
 * standalone object, not as inline prose.
 *
 * DESIGN.md: sunken bg = `--bg-sunken`. Hairline border = `--border-subtle`.
 * Mono font for label and code. Copy affordance always present (not hover-only)
 * because the dominant action for code in AI output is "take it elsewhere".
 */
export function CodeArtifact({ code, language, bare }: CodeArtifactProps) {
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/\n+$/u, "");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard can fail silently in insecure contexts; UI already shows the code.
    }
  };

  return (
    <div
      style={{
        margin: "16px 0",
        background: "var(--bg-sunken)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        // Hairline highlight at the top to imply ambient light on the recess.
        boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.03)",
      }}
    >
      {!bare && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px 6px 14px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "color-mix(in oklch, var(--bg-sunken), transparent 30%)",
          }}
        >
          <span
            className="mono-overline"
            style={{
              color: "var(--text-tertiary)",
              letterSpacing: "0.14em",
              fontSize: 10,
            }}
          >
            {language && language.length > 0 ? language : "code"}
          </span>
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              padding: "4px 8px",
              borderRadius: "var(--radius-xs)",
              color: copied ? "var(--success)" : "var(--text-tertiary)",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.16s ease",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          overflowX: "auto",
          background: "transparent",
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <code style={{ background: "transparent", padding: 0 }}>{trimmed}</code>
      </pre>
    </div>
  );
}
