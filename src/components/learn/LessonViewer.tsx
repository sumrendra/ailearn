"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Sparkles, Copy, Check, X, BookOpen, Trophy,
  Clock, Zap, ChevronLeft, ChevronRight, Lightbulb, CheckCircle2,
} from "lucide-react";
import { TutorChat } from "@/components/ai/TutorChat";
import { SqlPlayground } from "@/components/playground/SqlPlayground";
import { AttentionVisualizer } from "@/components/diagrams/AttentionVisualizer";
import { EmbeddingExplorer } from "@/components/diagrams/EmbeddingExplorer";
import { TokenizationVisualizer } from "@/components/diagrams/TokenizationVisualizer";
import { RAGFlowExplorer } from "@/components/diagrams/RAGFlowExplorer";
import { AgentLoopInteractive } from "@/components/diagrams/AgentLoopInteractive";
import { VocabList } from "@/components/french/VocabList";
import { SentenceBuilder } from "@/components/french/SentenceBuilder";
import { ConversationScene } from "@/components/french/ConversationScene";
import { MatchQuiz } from "@/components/french/MatchQuiz";
import { GrammarTable } from "@/components/french/GrammarTable";
import { FormulaPlayground } from "@/components/excel/FormulaPlayground";
import { PivotSimulator } from "@/components/excel/PivotSimulator";
import { FormulaQuiz } from "@/components/excel/FormulaQuiz";
import { HashMapVisualizer } from "@/components/java/HashMapVisualizer";
import { CollectionsHierarchy } from "@/components/java/CollectionsHierarchy";
import { JavaQuiz } from "@/components/java/JavaQuiz";
import { parseLessonBlock } from "@/lib/lesson-blocks";
import {
  parseFrenchVocab, parseFrenchSentence, parseFrenchDialogue,
  parseFrenchMatch, parseFrenchGrammar,
} from "@/lib/french-blocks";
import {
  parseExcelFormula, parseExcelPivot, parseExcelQuiz,
} from "@/lib/excel-blocks";
import { parseJavaQuiz } from "@/lib/java-blocks";
import { TableOfContents } from "./TableOfContents";
import { type FixtureKey } from "@/lib/sql-fixtures";
import Link from "next/link";

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Walk a react-markdown child tree and pull out the raw text content.
 * Used to recover the source body of a fenced code block (e.g. ```sql-playground)
 * so we can hand it to an interactive component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextContent(node: any): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (typeof node === "object") {
    if (typeof node.props?.children !== "undefined") return extractTextContent(node.props.children);
    if (node.value) return String(node.value);
  }
  return "";
}

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

// ── Stable references for react-markdown ─────────────────────────────────────
//
// These MUST be module-level constants, not inline arrays/objects in the JSX.
// react-markdown@10 calls `React.createElement(components[tag], props, ...)`
// for every tag in the markdown AST — meaning each *value* in `components`
// becomes the element TYPE. If those values are fresh function refs on every
// render (which they are when defined inline), React sees a new type at the
// same tree position and unmounts/remounts the entire subtree. For
// interactive children like SentenceBuilder / MatchQuiz, that re-runs their
// useState lazy initializer and reshuffles the word order on every parent
// re-render. Since LessonViewer re-renders on every scroll (for the reading-
// progress bar), the puzzle pieces literally jumble as you scroll.
//
// Hoisting the plugin arrays and the `components` map to module scope makes
// them reference-stable across renders. The components below only depend on
// module-level imports and the pure `slugify` / `extractText` helpers, so
// none of them need to close over LessonViewer's state.

const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeHighlight];

const headingId = (children: React.ReactNode) =>
  slugify(String(children ?? "").replace(/\s+/g, " ").trim());

// Components map for react-markdown. Hoisted to module scope so it's a
// stable reference across LessonViewer renders. (See the long comment with
// REMARK_PLUGINS above for why this matters — TL;DR: react-markdown@10
// uses these function refs as React element types, and changing refs
// remount the entire subtree.)
const MD_COMPONENTS = {

  // h1 is shown in chapter header — suppress the in-content one
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  h1: (_props: unknown) => null,

  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 id={headingId(children)} style={{ scrollMarginTop: 24 }}>
      {children}
    </h2>
  ),

  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 id={headingId(children)} style={{ scrollMarginTop: 24 }}>
      {children}
    </h3>
  ),

  p: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong>{children}</strong>,

  // Inline code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ className, children, ...props }: any) => {
    if (!className) {
      return <code {...props}>{children}</code>;
    }
    return <code className={className} {...props}>{children}</code>;
  },

  // Code block — either an interactive block or the CodeBlock fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: ({ children }: any) => {
    // rehype-highlight prepends "hljs " to className — extract lang via regex.
    const className = children?.props?.className ?? "";
    const langMatch = /language-([\w-]+)/.exec(className);
    const lang = langMatch ? langMatch[1] : "code";

    if (lang === "sql-playground") {
      const raw = extractTextContent(children);
      const { meta, challenges, body } = parseLessonBlock(raw);
      const fixture = (meta.fixture as FixtureKey) || "ecommerce";
      return (
        <SqlPlayground
          fixture={fixture}
          initial={body}
          hint={meta.hint}
          challenges={challenges.length ? challenges : undefined}
        />
      );
    }

    if (lang === "diagram-attention") return <AttentionVisualizer />;
    if (lang === "diagram-embeddings") return <EmbeddingExplorer />;
    if (lang === "diagram-tokenization") return <TokenizationVisualizer />;
    if (lang === "diagram-rag") return <RAGFlowExplorer />;
    if (lang === "diagram-agent-loop") return <AgentLoopInteractive />;

    if (lang === "french-vocab") {
      const items = parseFrenchVocab(extractTextContent(children));
      return items.length ? <VocabList items={items} /> : null;
    }
    if (lang === "french-sentence") {
      const data = parseFrenchSentence(extractTextContent(children));
      return data ? (
        <SentenceBuilder
          prompt={data.prompt}
          answer={data.answer}
          distractors={data.distractors}
          hint={data.hint}
        />
      ) : null;
    }
    if (lang === "french-dialogue") {
      const data = parseFrenchDialogue(extractTextContent(children));
      return data.lines.length ? (
        <ConversationScene title={data.title} scene={data.scene} lines={data.lines} />
      ) : null;
    }
    if (lang === "french-match") {
      const data = parseFrenchMatch(extractTextContent(children));
      return data.pairs.length ? <MatchQuiz title={data.title} pairs={data.pairs} /> : null;
    }
    if (lang === "french-grammar") {
      const data = parseFrenchGrammar(extractTextContent(children));
      return data ? (
        <GrammarTable title={data.title} note={data.note} headers={data.headers} rows={data.rows} />
      ) : null;
    }

    if (lang === "excel-formula") {
      const data = parseExcelFormula(extractTextContent(children));
      return <FormulaPlayground fixture={data.fixture} initial={data.formula ?? ""} hint={data.hint} />;
    }
    if (lang === "excel-pivot") {
      const data = parseExcelPivot(extractTextContent(children));
      return (
        <PivotSimulator
          fixture={data.fixture}
          initialRows={data.rows}
          initialCols={data.cols}
          initialValues={data.values}
        />
      );
    }
    if (lang === "excel-quiz") {
      const data = parseExcelQuiz(extractTextContent(children));
      return data ? (
        <FormulaQuiz
          question={data.question}
          options={data.options}
          correct={data.correct}
          explanation={data.explanation}
        />
      ) : null;
    }

    if (lang === "java-hashmap") return <HashMapVisualizer />;
    if (lang === "java-collections") return <CollectionsHierarchy />;
    if (lang === "java-quiz") {
      const data = parseJavaQuiz(extractTextContent(children));
      return data ? (
        <JavaQuiz
          question={data.question}
          code={data.code}
          options={data.options}
          correct={data.correct}
          explanation={data.explanation}
          level={data.level}
        />
      ) : null;
    }

    return <CodeBlock language={lang}>{children}</CodeBlock>;
  },

  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote
      style={{
        display: "flex",
        gap: 14,
        margin: "28px 0",
        padding: "18px 20px",
        background: "color-mix(in srgb, var(--accent) 5%, transparent)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: `0 var(--radius-md) var(--radius-md) 0`,
      }}
    >
      <Lightbulb
        size={20}
        strokeWidth={2}
        color="var(--accent)"
        style={{ flexShrink: 0, marginTop: 4 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </blockquote>
  ),

  table: ({ children }: { children?: React.ReactNode }) => (
    <div style={{ overflowX: "auto", marginBottom: 28 }}>
      <table style={{ margin: 0 }}>{children}</table>
    </div>
  ),

  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead style={{ background: "var(--accent-light)" }}>{children}</thead>
  ),

  th: ({ children }: { children?: React.ReactNode }) => (
    <th
      style={{
        padding: "11px 16px",
        textAlign: "left",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--accent-text)",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        borderBottom: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
      }}
    >
      {children}
    </th>
  ),

  td: ({ children }: { children?: React.ReactNode }) => (
    <td
      style={{
        padding: "11px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        color: "var(--text-secondary)",
        fontSize: 14.5,
        lineHeight: 1.6,
      }}
    >
      {children}
    </td>
  ),

  hr: () => (
    <div
      style={{
        margin: "44px 0",
        height: 1,
        background: "var(--border-subtle)",
      }}
    />
  ),

  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        color: "var(--accent)",
        textDecoration: "underline",
        textDecorationColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
        textUnderlineOffset: 3,
      }}
    >
      {children}
    </a>
  ),
};

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
  /** Whether this lesson is already marked complete for the current user */
  isCompleted?: boolean;
  /** Handler that marks the lesson complete. Undefined for unauthenticated viewers. */
  onMarkComplete?: () => void;
  /** True while the mark-complete request is in flight */
  marking?: boolean;
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
  isCompleted = false,
  onMarkComplete,
  marking = false,
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

  // Memoize the ReactMarkdown element so its subtree is reference-stable
  // across re-renders. LessonViewer re-renders on every scroll (to update
  // readPct for the progress bar). Without this memo, the inline
  // `components={{...}}` object below is rebuilt every render — every
  // function ref inside changes — and react-markdown@10 uses those
  // function refs as React element TYPES when rendering the AST. New types
  // at the same tree position make React unmount + remount each child, which
  // would tear down SentenceBuilder / MatchQuiz state every scroll and
  // reshuffle the word bank. Pinning the element by [content] means the
  // entire markdown subtree (and the captured components prop inside it)
  // is reused as long as content doesn't change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const markdownElement = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={MD_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  ), [content]);

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
          padding: "56px 64px 140px",
          display: "flex",
          gap: 56,
          justifyContent: "center",
        }}
      >

        {/* Left: lesson body */}
        <div style={{ flex: "1 1 720px", maxWidth: 800, minWidth: 0 }}>

        {/* ── Chapter header ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36, maxWidth: 800 }}>

          {/* Lesson title — breadcrumb lives in the lesson topbar above.
              Instrument Serif (display) paired with Inter body for an
              editorial feel. The serif is set at 400 (its only weight) and
              sized up to carry hierarchy via the typeface, not the weight. */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 52,
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            marginBottom: 18,
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
                  border: "1px solid color-mix(in srgb, var(--xp-gold) 25%, transparent)",
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

          {/* Inline Ask AI Tutor — small, right-aligned, sits below the meta row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            marginTop: 18,
            paddingTop: 18,
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <button
              onClick={() => setTutorOpen((v) => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "7px 14px", border: "none",
                borderRadius: 999,
                background: tutorOpen ? "var(--bg-tertiary)" : "var(--accent)",
                color: tutorOpen ? "var(--text-secondary)" : "#fff",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                boxShadow: tutorOpen ? "none" : "0 4px 14px hsl(258 87% 64% / 0.35)",
                transition: "all 0.15s",
              }}
            >
              <Sparkles size={12} />
              {tutorOpen ? "Close tutor" : "Ask AI Tutor"}
            </button>
          </div>
        </div>

        {/* ── Visual diagram ────────────────────────────────────────────── */}
        {diagramComponent && (
          <div style={{ maxWidth: 740, marginBottom: 8 }}>
            {diagramComponent}
          </div>
        )}

        {/* ── Markdown content ──────────────────────────────────────────── */}
        <div className="lesson-content prose-reader">
          {markdownElement}
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, lineHeight: 1 }}>
            {isCompleted
              ? <CheckCircle2 size={38} strokeWidth={2} color="var(--success)" />
              : <Trophy size={38} strokeWidth={2} color="var(--success)" />}
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
            {isCompleted ? "You've completed this lesson" : "Finished reading?"}
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 380, margin: "0 auto 20px" }}>
            {isCompleted
              ? "Keep it warm. Flashcards or a quiz will lock it in."
              : "Mark this lesson complete to lock in your progress, then reinforce it with flashcards or a quiz."}
          </p>

          {/* Primary CTA — Mark complete. Only rendered for authenticated
              users (when a handler was provided). Hides once already done. */}
          {onMarkComplete && !isCompleted && (
            <button
              onClick={onMarkComplete}
              disabled={marking}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 26px",
                background: "var(--accent)", color: "#fff",
                border: "none", borderRadius: "var(--radius-md)",
                fontSize: 14, fontWeight: 700,
                cursor: marking ? "wait" : "pointer",
                boxShadow: "0 6px 20px color-mix(in srgb, var(--accent) 35%, transparent)",
                marginBottom: 22,
                opacity: marking ? 0.85 : 1,
                transition: "all 0.18s",
              }}
            >
              <Check size={16} strokeWidth={3} />
              {marking ? "Saving…" : `Mark complete${xpReward ? ` · +${xpReward} XP` : ""}`}
            </button>
          )}
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
        </div>{/* /content body wrapper */}
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
                background: activeId === id ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent",
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

          {/* Reading progress — only show once the user has actually started scrolling */}
          {readPct > 0 && (
            <div style={{
              marginTop: 24, padding: "16px 20px 0",
              borderTop: "1px solid var(--border-subtle)",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 8,
              }}>
                <span className="text-eyebrow" style={{ color: "var(--text-quaternary)" }}>
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
                    : `linear-gradient(90deg, ${pathColor}, hsl(258 87% 72%))`,
                  transition: "width 0.3s ease",
                  borderRadius: "var(--radius-full)",
                }} />
              </div>
            </div>
          )}
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
