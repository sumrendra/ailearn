"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Sparkles, Copy, Check, X, MessageSquare } from "lucide-react";
import { TutorChat } from "@/components/ai/TutorChat";

interface LessonViewerProps {
  content: string;
  lessonTitle: string;
  lessonSlug: string;
}

export function LessonViewer({ content, lessonTitle, lessonSlug }: LessonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      {/* Content area */}
      <div style={{
        flex: 1,
        padding: "40px 48px",
        maxWidth: 820,
        overflowY: "auto",
      }}>
        {/* Action bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 24 }}>
          <button
            onClick={copyContent}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)", background: "var(--bg-secondary)",
              fontSize: 12, color: "var(--text-tertiary)", cursor: "pointer",
            }}
          >
            {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => setTutorOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", border: "none",
              borderRadius: "var(--radius-md)", background: "var(--accent)",
              fontSize: 12, color: "#fff", fontWeight: 500, cursor: "pointer",
            }}
          >
            <Sparkles size={12} /> Ask AI Tutor
          </button>
        </div>

        {/* Markdown content */}
        <div className="lesson-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 style={{
                  fontSize: 28, fontWeight: 800, color: "var(--text-primary)",
                  marginBottom: 8, marginTop: 0, lineHeight: 1.25,
                  borderBottom: "2px solid var(--border-subtle)", paddingBottom: 12,
                }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{
                  fontSize: 20, fontWeight: 700, color: "var(--text-primary)",
                  marginTop: 36, marginBottom: 12, lineHeight: 1.3,
                }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{
                  fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
                  marginTop: 24, marginBottom: 8, lineHeight: 1.4,
                }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{
                  fontSize: 15, lineHeight: 1.8, color: "var(--text-secondary)",
                  marginBottom: 16, marginTop: 0,
                }}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul style={{
                  paddingLeft: 20, marginBottom: 16, marginTop: 4,
                  color: "var(--text-secondary)",
                }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{
                  paddingLeft: 20, marginBottom: 16, marginTop: 4,
                  color: "var(--text-secondary)",
                }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 6 }}>
                  {children}
                </li>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code style={{
                      fontSize: 13, fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                      background: "var(--bg-tertiary)", color: "var(--accent)",
                      padding: "2px 6px", borderRadius: 4,
                      border: "1px solid var(--border-subtle)",
                    }}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre style={{
                  background: "var(--bg-code, #1a1a2e)", borderRadius: "var(--radius-md)",
                  padding: "20px 24px", overflowX: "auto",
                  marginBottom: 20, marginTop: 4,
                  border: "1px solid var(--border-subtle)",
                  fontSize: 13, lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}>
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div style={{ overflowX: "auto", marginBottom: 20 }}>
                  <table style={{
                    width: "100%", borderCollapse: "collapse",
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead style={{ background: "var(--bg-secondary)" }}>{children}</thead>
              ),
              th: ({ children }) => (
                <th style={{
                  padding: "10px 14px", textAlign: "left",
                  fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  borderBottom: "2px solid var(--border-default)",
                }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", fontSize: 14,
                }}>
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote style={{
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: 16, marginLeft: 0, marginBottom: 16,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                }}>
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "28px 0" }} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* AI Tutor side panel */}
      {tutorOpen && (
        <div style={{
          width: 380, flexShrink: 0,
          borderLeft: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          display: "flex", flexDirection: "column",
          height: "calc(100vh - 115px)",
          position: "sticky", top: 0,
        }}>
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                AI Tutor — {lessonTitle}
              </span>
            </div>
            <button
              onClick={() => setTutorOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-tertiary)" }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TutorChat lessonContext={`Current lesson: ${lessonTitle}\n\n${content.slice(0, 2000)}`} compact />
          </div>
        </div>
      )}
    </div>
  );
}
