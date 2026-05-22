"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Sparkles, Copy, Check, X, BookOpen, Trophy,
  Clock, Zap, ChevronLeft, ChevronRight,
} from "lucide-react";
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

/** Recursively pull plain text from React nodes (for copy). */
function extractText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof node === "object" && "props" in (node as object)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props?.children);
  }
  return "";
}

function parseHeadings(content: string) {
  return content
    .split("\n")
    .filter((l) => /^#{2,3} /.test(l))   // skip h1 — shown in chapter header
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
    <div style={{
      margin: "6px 0 28px",
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      {/* Header: language + copy button */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-code-header)",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: "#5b6a8a",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          userSelect: "none",
        }}>
          {language || "code"}
        </span>
        <button
          onClick={copy}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: copied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
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
        background: "var(--bg-code)", margin: 0,
        padding: "22px 26px", overflowX: "auto",
        fontSize: 13.5, lineHeight: 1.75,
        fontFamily: "var(--font-mono)",
        color: "#abb2bf",
      }}>
        {children}
      </pre>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface LessonViewerProps {
  content: string;
  lessonTitle: string;
  lessonSlug: string;
  pathName?: string;
  pathSlug?: string;
  pathColor?: string;
  estimatedMins?: number | null;
  xpReward?: number | null;
  lessonIndex?: number;
  totalLessons?: number;
  tags?: string[];
  diagramComponent?: React.ReactNode;
  prevLesson?: { title: string; slug: string } | null;
  nextLesson?: { title: string; slug: string } | null;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function LessonViewer({
  content,
  lessonTitle,
  lessonSlug,
  pathName,
  pathSlug,
  pathColor = "#6c47ff",
  estimatedMins,
  xpReward,
  lessonIndex,
  totalLessons,
  tags,
  diagramComponent,
  prevLesson,
  nextLesson,
}: LessonViewerProps) {
  const [tutorOpen, setTutorOpen]   = useState(false);
  const [readPct,   setReadPct]     = useState(0);
  const [activeId,  setActiveId]    = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only parse h2/h3 for TOC (h1 is in chapter header)
  const headings = useMemo(() => parseHeadings(content), [content]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const total = el.scrollHeight - el.clientHeight;
    setReadPct(total > 0 ? Math.min(100, Math.round((el.scrollTop / total) * 100)) : 0);
  };

  // Track active heading via IntersectionObserver
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

      {/* ── Reading progress bar ──────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: "var(--bg-tertiary)",
      }}>
        <div style={{
          height: "100%", width: `${readPct}%`,
          background: `linear-gradient(90deg, ${pathColor}, #c084fc)`,
          transition: "width 0.25s ease",
        }} />
      </div>

      {/* ── Content scroll area ──────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          padding: "48px 64px 120px",
        }}
      >

        {/* ── Chapter header ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 52, maxWidth: 740 }}>

          {/* Breadcrumb row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            {pathSlug && (
              <Link href={`/learn/${pathSlug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500,
                  transition: "color 0.12s",
                }}>
                  <ChevronLeft size={12} /> Paths
                </div>
              </Link>
            )}

            {pathName && (
              <>
                <span style={{ color: "var(--border-default)", fontSize: 11 }}>/</span>
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  fontSize: 11.5, fontWeight: 600, color: "#fff",
                  background: pathColor,
                  padding: "3px 10px", borderRadius: 999,
                  letterSpacing: "0.02em",
                }}>
                  {pathName}
                </span>
              </>
            )}

            {lessonIndex !== undefined && totalLessons !== undefined && (
              <span style={{
                fontSize: 11.5, color: "var(--text-tertiary)", fontWeight: 500,
              }}>
                Lesson {lessonIndex + 1} of {totalLessons}
              </span>
            )}
          </div>

          {/* Lesson title */}
          <h1 style={{
            fontSize: 36,
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}>
            {lessonTitle}
          </h1>

          {/* Meta badges row */}
          {(estimatedMins || xpReward || (tags && tags.length > 0)) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {estimatedMins && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12.5, color: "var(--text-secondary)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  padding: "4px 11px", borderRadius: 999,
                }}>
                  <Clock size={12} color="var(--text-tertiary)" /> {estimatedMins} min read
                </span>
              )}
              {xpReward && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12.5, fontWeight: 600, color: "var(--xp-gold)",
                  background: "var(--xp-gold-light)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  padding: "4px 11px", borderRadius: 999,
                }}>
                  <Zap size={12} /> +{xpReward} XP
                </span>
              )}
              {tags?.map((tag) => (
                <span key={tag} style={{
                  fontSize: 11.5, color: "var(--text-tertiary)",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  padding: "3px 9px", borderRadius: 4, fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{
            height: 1,
            background: "var(--border-subtle)",
            marginTop: 28,
          }} />
        </div>

        {/* ── Action bar ────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "flex-end",
          marginBottom: diagramComponent ? 28 : 36, maxWidth: 740,
        }}>
          <button
            onClick={() => setTutorOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", border: "none",
              borderRadius: "var(--radius-md)",
              background: tutorOpen ? "var(--bg-tertiary)" : "var(--accent)",
              color: tutorOpen ? "var(--text-secondary)" : "#fff",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              boxShadow: tutorOpen ? "none" : "0 2px 10px rgba(108,71,255,0.4)",
              transition: "all 0.15s",
            }}
          >
            <Sparkles size={13} />
            {tutorOpen ? "Close tutor" : "Ask AI Tutor"}
          </button>
        </div>

        {/* ── Visual diagram ────────────────────────────────────────────── */}
        {diagramComponent && (
          <div style={{ maxWidth: 740, marginBottom: 8 }}>
            {diagramComponent}
          </div>
        )}

        {/* ── Markdown content ──────────────────────────────────────────── */}
        <div className="lesson-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{

              // h1 is shown in chapter header — suppress the in-content one
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h1: (_props) => null,

              h2: ({ children }) => (
                <h2
                  id={headingId(children)}
                  style={{ scrollMarginTop: 24 }}
                >
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3
                  id={headingId(children)}
                  style={{ scrollMarginTop: 24 }}
                >
                  {children}
                </h3>
              ),

              // Paragraph — let globals.css handle sizing/spacing, just add margin reset
              p: ({ children }) => (
                <p>{children}</p>
              ),

              // Bold — highlighted background
              strong: ({ children }) => (
                <strong>{children}</strong>
              ),

              // ul, ol, li → NOT overridden — globals.css handles all styling

              // Inline code
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({ className, children, ...props }: any) => {
                if (!className) {
                  return (
                    <code {...props}>{children}</code>
                  );
                }
                return <code className={className} {...props}>{children}</code>;
              },

              // Code block → CodeBlock component
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pre: ({ children }: any) => {
                const lang =
                  (children?.props?.className ?? "").replace("language-", "") || "code";
                return (
                  <CodeBlock language={lang}>{children}</CodeBlock>
                );
              },

              // Blockquote → styled callout card
              blockquote: ({ children }) => (
                <blockquote style={{
                  position: "relative",
                  margin: "28px 0",
                  padding: "20px 20px 16px 20px",
                  background: "rgba(108,71,255,0.05)",
                  borderLeft: "4px solid var(--accent)",
                  borderRadius: `0 var(--radius-md) var(--radius-md) 0`,
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
                  <div style={{ marginTop: 6 }}>
                    {children}
                  </div>
                </blockquote>
              ),

              // Table — overflow wrapper only; CSS handles border/radius/shadow
              table: ({ children }) => (
                <div style={{ overflowX: "auto", marginBottom: 28 }}>
                  <table style={{ margin: 0 }}>
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead style={{ background: "var(--accent-light)" }}>
                  {children}
                </thead>
              ),

              th: ({ children }) => (
                <th style={{
                  padding: "11px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 700, color: "var(--accent-text)",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  borderBottom: "1px solid rgba(108,71,255,0.2)",
                }}>
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td style={{
                  padding: "11px 16px",
                  borderBottom: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.6,
                }}>
                  {children}
                </td>
              ),

              // Divider
              hr: () => (
                <div style={{
                  margin: "44px 0", height: 1,
                  background: "linear-gradient(90deg, var(--accent), transparent)",
                  opacity: 0.2,
                }} />
              ),

              // Links
              a: ({ children, href }) => (
                <a
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    color: "var(--accent)", textDecoration: "underline",
                    textDecorationColor: "rgba(108,71,255,0.3)",
                    textUnderlineOffset: 3,
                  }}
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* ── Lesson complete CTA ───────────────────────────────────────── */}
        <div style={{
          maxWidth: 740,
          marginTop: 72, padding: "36px 40px",
          background: `linear-gradient(135deg, ${pathColor}10, ${pathColor}04)`,
          borderRadius: "var(--radius-xl)",
          border: `1px solid ${pathColor}20`,
          textAlign: "center",
          boxShadow: `0 8px 32px ${pathColor}10`,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>🎉</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
            Lesson complete!
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 380, margin: "0 auto 28px" }}>
            Reinforce what you learned — practice with flashcards or test yourself with a quick quiz.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: prevLesson || nextLesson ? 24 : 0 }}>
            <Link href={`/flashcards?lesson=${lessonSlug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 22px", background: pathColor, color: "#fff",
                borderRadius: "var(--radius-md)", fontSize: 13.5, fontWeight: 600,
                boxShadow: `0 4px 14px ${pathColor}40`, cursor: "pointer",
              }}>
                <BookOpen size={15} /> Review flashcards
              </div>
            </Link>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 22px", border: "1px solid var(--border-default)",
                background: "var(--bg-card)", borderRadius: "var(--radius-md)",
                fontSize: 13.5, color: "var(--text-primary)", fontWeight: 500, cursor: "pointer",
              }}>
                <Trophy size={15} /> Take a quiz
              </div>
            </Link>
          </div>

          {/* Prev / next inside the CTA */}
          {(prevLesson || nextLesson) && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderTop: `1px solid ${pathColor}15`, paddingTop: 20, gap: 12,
            }}>
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-secondary)", cursor: "pointer",
                  }}>
                    <ChevronLeft size={14} color="var(--text-tertiary)" />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 1 }}>Previous</div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-primary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {prevLesson.title}
                      </div>
                    </div>
                  </div>
                </Link>
              ) : <div />}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--radius-md)",
                    background: pathColor, color: "#fff", cursor: "pointer",
                    boxShadow: `0 4px 14px ${pathColor}40`,
                  }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>Next lesson</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {nextLesson.title}
                      </div>
                    </div>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              ) : (
                <Link href={pathSlug ? `/learn/${pathSlug}` : "/learn"} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "9px 18px", borderRadius: "var(--radius-md)",
                    background: pathColor, color: "#fff", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer", boxShadow: `0 4px 14px ${pathColor}40`,
                  }}>
                    <BookOpen size={13} /> Path complete — view overview
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Table of Contents (when tutor is closed) ─────────────────────── */}
      {!tutorOpen && headings.length > 2 && (
        <div style={{
          width: 216, flexShrink: 0,
          borderLeft: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          padding: "36px 0 36px 0",
          position: "sticky", top: 0,
          height: "calc(100vh - 115px)",
          overflowY: "auto",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--text-tertiary)",
            marginBottom: 14, padding: "0 20px",
          }}>
            On this page
          </div>

          {headings.map(({ level, text, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: activeId === id ? "rgba(108,71,255,0.06)" : "transparent",
                border: "none",
                borderLeft: activeId === id ? "2px solid var(--accent)" : "2px solid transparent",
                cursor: "pointer",
                padding: `5px 18px 5px ${level === 3 ? 28 : 18}px`,
                fontSize: level === 2 ? 12 : 11,
                fontWeight: activeId === id ? 600 : 400,
                color: activeId === id ? "var(--accent)" : "var(--text-tertiary)",
                lineHeight: 1.5,
                transition: "all 0.12s",
                marginBottom: 2,
              }}
            >
              {text}
            </button>
          ))}

          {/* Reading progress */}
          <div style={{
            marginTop: 24, padding: "16px 20px 0",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 8,
            }}>
              <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 500 }}>
                Progress
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: readPct === 100 ? "var(--success)" : "var(--accent)",
              }}>
                {readPct}%
              </span>
            </div>
            <div style={{
              height: 4, background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-full)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${readPct}%`,
                background: readPct === 100
                  ? "var(--success)"
                  : `linear-gradient(90deg, ${pathColor}, #c084fc)`,
                transition: "width 0.3s ease",
                borderRadius: "var(--radius-full)",
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
          {/* Panel header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--bg-secondary)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "linear-gradient(135deg, var(--accent), #9b6dff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: "var(--text-primary)", lineHeight: 1.1,
                }}>
                  AI Tutor
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                  {lessonTitle}
                </div>
              </div>
            </div>
            <button
              onClick={() => setTutorOpen(false)}
              style={{
                background: "var(--bg-tertiary)", border: "none", cursor: "pointer",
                padding: 6, borderRadius: 6, color: "var(--text-tertiary)",
                display: "flex", alignItems: "center",
                transition: "background 0.12s",
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TutorChat
              lessonContext={`Lesson: ${lessonTitle}\n\n${content.slice(0, 2500)}`}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
}
