"use client";

import { memo, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeArtifact } from "./CodeArtifact";

/**
 * Markdown renderer shared by Tutor + Interview assistant messages.
 *
 * The visual rules deliberately mirror the lesson body (DESIGN.md):
 * Inter for prose, mono for inline `code`, headings at modest scale (these
 * are inline replies, not lesson chapters — so h1/h2 are downsized vs the
 * lesson reader). Fenced code blocks are routed to CodeArtifact so they
 * read as standalone artifacts on the canvas, not nested in a bubble.
 */

const COMPONENTS: Components = {
  p: ({ children }) => (
    <p style={{ margin: "0 0 12px", lineHeight: 1.65 }}>{children}</p>
  ),
  h1: ({ children }) => (
    <h2
      style={{
        margin: "20px 0 10px",
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3
      style={{
        margin: "18px 0 8px",
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4
      style={{
        margin: "16px 0 6px",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h5
      style={{
        margin: "14px 0 6px",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h5>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: "0 0 12px", paddingLeft: 22, lineHeight: 1.6 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: "0 0 12px", paddingLeft: 22, lineHeight: 1.6 }}>{children}</ol>
  ),
  li: ({ children }) => <li style={{ margin: "4px 0" }}>{children}</li>,
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>{children}</strong>
  ),
  em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      style={{
        color: "var(--accent-text)",
        textDecoration: "underline",
        textDecorationColor: "color-mix(in oklch, var(--accent), transparent 60%)",
        textUnderlineOffset: 3,
      }}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        margin: "14px 0",
        padding: "8px 14px",
        borderLeft: "2px solid var(--accent)",
        color: "var(--text-secondary)",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      style={{
        margin: "20px 0",
        border: "none",
        borderTop: "1px solid var(--border-subtle)",
      }}
    />
  ),
  // Inline `code` (no fenced parent) gets the lesson-reader pill treatment.
  // Fenced blocks come in as <pre><code class="language-x"> — we detect via the
  // `pre` override below and route to CodeArtifact instead.
  code: ({ className, children, ...props }) => {
    const isInline = !(props as { "data-block"?: boolean })["data-block"];
    if (isInline) {
      return (
        <code
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.88em",
            padding: "1px 6px",
            background: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-xs)",
            color: "var(--accent-text)",
          }}
        >
          {children}
        </code>
      );
    }
    // Fenced code reaches here when wrapped in <pre>; let the pre override
    // unwrap it.
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    // ReactMarkdown wraps fenced code blocks as <pre><code className="language-x">...</code></pre>.
    // Pull the language + raw string out and hand to CodeArtifact.
    let lang = "";
    let raw = "";
    const inner: unknown = children;
    if (
      inner &&
      typeof inner === "object" &&
      "props" in (inner as Record<string, unknown>)
    ) {
      const child = inner as { props?: { className?: string; children?: ReactNode } };
      const cls = child.props?.className ?? "";
      const m = /language-([\w-]+)/.exec(cls);
      if (m) lang = m[1];
      const inside = child.props?.children;
      raw = typeof inside === "string" ? inside : Array.isArray(inside) ? inside.join("") : String(inside ?? "");
    } else if (typeof inner === "string") {
      raw = inner;
    }
    return <CodeArtifact code={raw} language={lang} />;
  },
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "14px 0" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13.5,
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th
      style={{
        textAlign: "left",
        padding: "8px 12px",
        background: "var(--bg-sunken)",
        borderBottom: "1px solid var(--border-subtle)",
        fontWeight: 600,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "8px 12px",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {children}
    </td>
  ),
};

interface MessageProseProps {
  content: string;
}

function MessageProseImpl({ content }: MessageProseProps) {
  return (
    <div style={{ color: "var(--text-primary)", fontSize: 14.5, lineHeight: 1.65 }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MessageProse = memo(MessageProseImpl);
