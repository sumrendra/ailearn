"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Sparkles, Copy, Check, X, BookOpen, Trophy } from "lucide-react";
import { TutorChat } from "@/components/ai/TutorChat";
import Link from "next/link";

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Recursively pull text from React nodes (works on hljs-highlighted trees) */
function extractText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props?.children);
  }
  return "";
}

function parseHeadings(content: string) {
  return content
    .split("\n")
    .filter((l) => /^#{1,3} /.test(l))
    .map((l) => {
      const level = (l.match(/^(#+)/)?.[1] ?? "").length;
      const text = l.replace(/^#+\s+/, "").trim();
      return { level, text, id: slugify(text) };
    });
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(extractText(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginBottom: 28, marginTop: 4, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.22)" }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#161b2e", padding: "9px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* macOS traffic lights */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#5b6a8a",
          letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          {language || "code"}
        </span>
        <button
          onClick={copy}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6, padding: "3px 10px", cursor: "pointer",
            fontSize: 11, color: copied ? "#34d399" : "#7b8eaa", fontWeight: 500,
            transition: "all 0.15s",
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code body */}
      <pre style={{
        background: "#1a1a2e", margin: 0,
        padding: "22px 26px", overflowX: "auto",
        fontSize: 13.5, lineHeight: 1.75,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        color: "#abb2bf",
      }}>
        {children}
      </pre>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface LessonViewerProps {
  content: string;
  lessonTitle: string;
  lessonSlug: string;
}

export function LessonViewer({ content, lessonTitle, lessonSlug }: LessonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const headings = useMemo(() => parseHeadings(content), [content]);

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const total = el.scrollHeight - el.clientHeight;
    setReadPct(total > 0 ? Math.min(100, Math.round((el.scrollTop / total) * 100)) : 0);
  };

  // Track active heading
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { root: container, rootMargin: "0px 0px -65% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = container.querySelector(`#${CSS.escape(id)}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = scrollRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const headingId = (children: React.ReactNode) =>
    slugify(String(children ?? "").replace(/\s+/g, " ").trim());

  return (
    <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>

      {/* ── Reading progress bar (top of viewport) ─────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: "var(--bg-tertiary)",
      }}>
        <div style={{
          height: "100%", width: `${readPct}%`,
          background: "linear-gradient(90deg, #6c47ff, #c084fc)",
          transition: "width 0.25s ease",
        }} />
      </div>

      {/* ── Content scroll area ─────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          padding: "44px 56px 100px",
        }}
      >
        {/* Action bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 36 }}>
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
            {copied ? "Copied!" : "Copy lesson"}
          </button>
          <button
            onClick={() => setTutorOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", border: "none",
              borderRadius: "var(--radius-md)", background: "var(--accent)",
              fontSize: 12, color: "#fff", fontWeight: 500, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(108,71,255,0.4)",
            }}
          >
            <Sparkles size={12} /> Ask AI Tutor
          </button>
        </div>

        {/* Markdown */}
        <div className="lesson-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // ── Headings ─────────────────────────────────────────────────
              h1: ({ children }) => (
                <h1
                  id={headingId(children)}
                  style={{
                    fontSize: 32, fontWeight: 800, color: "var(--text-primary)",
                    margin: "0 0 20px", lineHeight: 1.2, scrollMarginTop: 20,
                    paddingBottom: 18,
                    borderBottom: "2px solid var(--border-subtle)",
                  }}
                >
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2
                  id={headingId(children)}
                  style={{
                    fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
                    margin: "52px 0 16px", lineHeight: 1.3,
                    paddingLeft: 14,
                    borderLeft: "3px solid var(--accent)",
                    scrollMarginTop: 20,
                  }}
                >
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3
                  id={headingId(children)}
                  style={{
                    fontSize: 17, fontWeight: 600, color: "var(--text-primary)",
                    margin: "32px 0 10px", lineHeight: 1.4,
                    scrollMarginTop: 20,
                  }}
                >
                  {children}
                </h3>
              ),

              // ── Body text ────────────────────────────────────────────────
              p: ({ children }) => (
                <p style={{
                  fontSize: 16, lineHeight: 1.9, color: "var(--text-secondary)",
                  marginBottom: 20, marginTop: 0,
                }}>
                  {children}
                </p>
              ),

              strong: ({ children }) => (
                <strong style={{
                  color: "var(--text-primary)", fontWeight: 600,
                  background: "rgba(108,71,255,0.09)",
                  padding: "1px 4px", borderRadius: 4,
                }}>
                  {children}
                </strong>
              ),

              // ── Lists ────────────────────────────────────────────────────
              ul: ({ children }) => (
                <ul style={{
                  listStyle: "none", padding: 0, marginBottom: 20, marginTop: 8,
                }} className="lesson-ul">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol style={{
                  paddingLeft: 24, marginBottom: 20, marginTop: 8,
                  color: "var(--text-secondary)",
                }} className="lesson-ol">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li style={{
                  fontSize: 16, lineHeight: 1.8, marginBottom: 8,
                  color: "var(--text-secondary)",
                }}>
                  {children}
                </li>
              ),

              // ── Inline code ──────────────────────────────────────────────
              code: ({ className, children, ...props }) => {
                if (!className) {
                  return (
                    <code style={{
                      fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace",
                      background: "rgba(108,71,255,0.1)", color: "var(--accent-text)",
                      padding: "2px 7px", borderRadius: 5,
                      border: "1px solid rgba(108,71,255,0.15)",
                      fontWeight: 500,
                    }}>
                      {children}
                    </code>
                  );
                }
                return <code className={className} {...props}>{children}</code>;
              },

              // ── Code blocks ──────────────────────────────────────────────
              pre: ({ children }) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const lang = ((children as any)?.props?.className ?? "").replace("language-", "") || "code";
                return (
                  <CodeBlock language={lang}>{children}</CodeBlock>
                );
              },

              // ── Blockquote → callout ─────────────────────────────────────
              blockquote: ({ children }) => (
                <div style={{
                  margin: "28px 0",
                  padding: "20px 22px 16px",
                  background: "linear-gradient(135deg, rgba(108,71,255,0.07), rgba(108,71,255,0.02))",
                  borderLeft: "4px solid var(--accent)",
                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                  boxShadow: "0 2px 12px rgba(108,71,255,0.08)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: -11, left: 14,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    color: "var(--accent)", textTransform: "uppercase",
                    background: "var(--bg-card)", padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid rgba(108,71,255,0.2)",
                  }}>
                    💡 Note
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.75, marginTop: 6 }}>
                    {children}
                  </div>
                </div>
              ),

              // ── Tables ───────────────────────────────────────────────────
              table: ({ children }) => (
                <div style={{
                  overflowX: "auto", marginBottom: 28,
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-md)",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead style={{
                  background: "linear-gradient(90deg, rgba(108,71,255,0.1), rgba(108,71,255,0.04))",
                }}>
                  {children}
                </thead>
              ),

              th: ({ children }) => (
                <th style={{
                  padding: "12px 18px", textAlign: "left",
                  fontSize: 11, fontWeight: 700, color: "var(--accent)",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  borderBottom: "2px solid rgba(108,71,255,0.18)",
                }}>
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td style={{
                  padding: "11px 18px",
                  borderBottom: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.6,
                }}>
                  {children}
                </td>
              ),

              // ── Divider ──────────────────────────────────────────────────
              hr: () => (
                <div style={{
                  margin: "44px 0", height: 1,
                  background: "linear-gradient(90deg, var(--accent) 0%, transparent 100%)",
                  opacity: 0.25,
                }} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* ── Lesson complete CTA ──────────────────────────────────────────── */}
        <div style={{
          marginTop: 64, padding: "32px 36px",
          background: "linear-gradient(135deg, rgba(108,71,255,0.08), rgba(155,109,255,0.04))",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(108,71,255,0.18)",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(108,71,255,0.08)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            You've finished this lesson!
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6, maxWidth: 380, margin: "0 auto 24px" }}>
            Reinforce what you just learned — review flashcards or challenge yourself with a quiz.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/flashcards?lesson=${lessonSlug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "12px 22px", background: "var(--accent)", color: "#fff",
                borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(108,71,255,0.4)",
              }}>
                <BookOpen size={15} /> Review flashcards
              </div>
            </Link>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "12px 22px",
                border: "1px solid var(--border-default)", background: "var(--bg-card)",
                borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500, cursor: "pointer",
              }}>
                <Trophy size={15} /> Take a quiz
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Floating TOC (only when tutor is closed) ─────────────────────── */}
      {!tutorOpen && headings.filter((h) => h.level <= 3).length > 2 && (
        <div style={{
          width: 210, flexShrink: 0,
          borderLeft: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          padding: "32px 0 32px 18px",
          position: "sticky", top: 0,
          height: "calc(100vh - 115px)",
          overflowY: "auto",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--text-tertiary)",
            marginBottom: 16, paddingRight: 18,
          }}>
            On this page
          </div>

          {headings.map(({ level, text, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: activeId === id ? "rgba(108,71,255,0.06)" : "none",
                border: "none",
                borderLeft: activeId === id ? "2px solid var(--accent)" : "2px solid transparent",
                cursor: "pointer",
                padding: `5px 10px 5px ${level === 3 ? 14 : 6}px`,
                fontSize: level === 2 ? 12 : 11,
                fontWeight: activeId === id ? 600 : 400,
                color: activeId === id ? "var(--accent)" : "var(--text-tertiary)",
                lineHeight: 1.45,
                transition: "all 0.12s",
                marginBottom: 2,
                borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
              }}
            >
              {text}
            </button>
          ))}

          {/* Progress in TOC */}
          <div style={{
            marginTop: 24, paddingTop: 16, paddingRight: 18,
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 500 }}>Read</span>
              <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>{readPct}%</span>
            </div>
            <div style={{
              height: 4, background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-full)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${readPct}%`,
                background: "linear-gradient(90deg, var(--accent), #c084fc)",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── AI Tutor side panel ──────────────────────────────────────────── */}
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
            background: "var(--bg-secondary)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>AI Tutor</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>{lessonTitle}</div>
              </div>
            </div>
            <button
              onClick={() => setTutorOpen(false)}
              style={{
                background: "var(--bg-tertiary)", border: "none", cursor: "pointer",
                padding: "5px", borderRadius: 6, color: "var(--text-tertiary)",
                display: "flex", alignItems: "center",
              }}
            >
              <X size={15} />
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
