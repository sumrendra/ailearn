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
import { K8sClusterMap } from "@/components/diagrams/K8sClusterMap";
import { K8sWorkloadStack } from "@/components/diagrams/K8sWorkloadStack";
import { K8sServiceRouting } from "@/components/diagrams/K8sServiceRouting";
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
//
// Code blocks are rendered as their own elevation surface, deeper than the
// reading canvas (`--bg-sunken`). A hairline-top catches ambient light along
// the upper edge — mimicking how the rest of the frosted shell reads on the
// dark canvas. Header strip carries a mono-overline language label and a
// Copy button (12px Lucide icon, flashes Check for 1.6s after click).
//
// Long lines scroll horizontally rather than wrap — code reads better when
// you can see structure at a glance, even if it costs a swipe.

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
    // 1.6s flash — long enough to register, short enough not to linger.
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div style={{
      margin: "24px 0 28px",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      background: "var(--bg-sunken)",
      border: "1px solid var(--border-subtle)",
      boxShadow: "inset 0 1px 0 var(--hairline-top)",
    }}>
      {/* Header strip: mono-overline language label + Copy button */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <span
          className="mono-overline"
          style={{
            fontSize: 10.5,
            color: "var(--text-tertiary)",
            userSelect: "none",
          }}
        >
          {language || "code"}
        </span>
        <button
          onClick={copy}
          aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            borderRadius: 6,
            padding: "4px 9px",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5, fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: copied ? "var(--success)" : "var(--text-tertiary)",
            transition: "color 0.15s, border-color 0.15s",
          }}
        >
          {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code body — overflowX scrolls; never wrap (long lines stay legible) */}
      <pre style={{
        background: "transparent",
        margin: 0,
        padding: "14px 18px",
        overflowX: "auto",
        fontSize: 13.5, lineHeight: 1.7,
        fontFamily: "var(--font-mono)",
        color: "var(--text-primary)",
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
    if (lang === "diagram-k8s-cluster") return <K8sClusterMap />;
    if (lang === "diagram-k8s-workloads") return <K8sWorkloadStack />;
    if (lang === "diagram-k8s-routing") return <K8sServiceRouting />;

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

  // Notes / callouts. On the new drenched-dark canvas, `--bg-subtle` reads
  // too close to canvas — we bump to `--bg-elevated` so the pill catches a
  // hint of ambient light. Inline lightbulb + violet rule preserved from
  // the prior sprint.
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote
      style={{
        display: "flex",
        gap: 14,
        margin: "28px 0",
        padding: "16px 20px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: `0 var(--radius-md) var(--radius-md) 0`,
        boxShadow: "inset 0 1px 0 var(--hairline-top)",
      }}
    >
      <Lightbulb
        size={18}
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
  // pathName, pathColor, lessonIndex, totalLessons are accepted by the prop
  // type for backwards-compat with callers, but no longer drive any visuals
  // — per DESIGN.md, path identity is ambient (mesh tint, slide-over
  // progress) and never colors primary actions in the reader. They're left
  // out of this destructure deliberately so ESLint doesn't flag them as
  // unused locals.
  pathSlug,
  estimatedMins,
  xpReward,
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

      {/* TOC rail hides on small viewports — slide-over panel covers navigation
          there. Mark-complete button gets a hover/active tune that the design
          system can't express purely via tokens. Component-scoped styles. */}
      <style>{`
        @media (max-width: 1023px) {
          .lesson-toc-rail { display: none !important; }
        }
        .mark-complete-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          box-shadow: 0 6px 32px var(--accent-glow);
        }
        .mark-complete-btn:active:not(:disabled) {
          box-shadow: inset 0 2px 6px var(--hairline-bottom), 0 4px 24px var(--accent-glow);
        }
      `}</style>

      {/* ── Reading progress bar ──────────────────────────────────────────────
          Sits at the very top, always visible. On the new drenched-dark canvas
          a 2px violet rule reads as ambient — but the empty track needed to
          come up to `--border-subtle` (was `--bg-tertiary`, which now blends
          almost perfectly into the canvas mesh). The fill is solid accent
          (no path-color gradient — accent stays universal per DESIGN.md). */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100,
        background: "var(--border-subtle)",
      }}>
        <div style={{
          height: "100%", width: `${readPct}%`,
          background: "var(--accent)",
          boxShadow: readPct > 0 ? "0 0 12px var(--accent-glow)" : "none",
          transition: "width 0.25s ease",
        }} />
      </div>

      {/* ── Content scroll area ──────────────────────────────────────────────
          Reading column is constrained to 720px and centered. The TOC rail
          floats as a sticky right sidebar (240–280px) — it's NOT part of the
          reading column's max-width, just lives in the same scroll container.
          Mobile collapses the rail (the slide-over panel handles navigation
          on small viewports). */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          position: "relative",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 48,
          paddingBlock: "56px 140px",
          paddingInline: "clamp(24px, 5vw, 56px)",
          maxWidth: 1200,
          marginInline: "auto",
        }}>

        {/* Left: lesson body — capped at 720px reading column */}
        <div style={{ flex: "1 1 720px", maxWidth: 720, minWidth: 0 }}>

        {/* ── Chapter header ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>

          {/* Lesson title — breadcrumb lives in the lesson topbar above.
              Instrument Serif at 400 (its only weight) — hierarchy comes from
              the typeface, never synthesized bold. A soft accent-glow text
              shadow lets the serif headline feel lit from behind on the new
              dark canvas, matching the atmospheric vocabulary of the rest of
              the redesign. */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            marginBottom: 18,
            textShadow: "0 0 40px var(--accent-glow)",
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
                  background: "var(--bg-elevated)",
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
                  background: "var(--bg-elevated)",
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
                background: tutorOpen ? "var(--bg-elevated)" : "var(--accent)",
                color: tutorOpen ? "var(--text-secondary)" : "var(--text-on-accent)",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                boxShadow: tutorOpen ? "none" : "0 4px 24px var(--accent-glow)",
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
          <div style={{ marginBottom: 8 }}>
            {diagramComponent}
          </div>
        )}

        {/* ── Markdown content ──────────────────────────────────────────── */}
        <div className="lesson-content prose-reader">
          {markdownElement}
        </div>

        {/* ── Lesson complete CTA ───────────────────────────────────────── */}
        <div style={{
          marginTop: 72, padding: "36px 40px",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "inset 0 1px 0 var(--hairline-top)",
          textAlign: "center",
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

          {/* Primary CTA — Mark complete. Locked to var(--accent) per design
              system contract (path color NEVER on primary actions). Hover
              brightens to --accent-hover; active flashes a brief inset
              shadow. Only rendered for authenticated users. */}
          {onMarkComplete && !isCompleted && (
            <button
              onClick={onMarkComplete}
              disabled={marking}
              className="mark-complete-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 26px",
                background: "var(--accent)",
                color: "var(--text-on-accent)",
                border: "none", borderRadius: "var(--radius-md)",
                fontSize: 14, fontWeight: 700,
                cursor: marking ? "wait" : "pointer",
                boxShadow: "0 4px 24px var(--accent-glow)",
                marginBottom: 22,
                opacity: marking ? 0.85 : 1,
                transition: "background 0.15s, box-shadow 0.18s",
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
                padding: "11px 22px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-md)", fontSize: 13.5, fontWeight: 600,
                cursor: "pointer",
              }}>
                <BookOpen size={15} /> Review flashcards
              </div>
            </Link>
            <Link href="/quiz" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 22px", border: "1px solid var(--border-default)",
                background: "var(--bg-surface)", borderRadius: "var(--radius-md)",
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
              borderTop: "1px solid var(--border-subtle)", paddingTop: 20, gap: 12,
            }}>
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-surface)", cursor: "pointer",
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
                    background: "var(--accent)",
                    color: "var(--text-on-accent)", cursor: "pointer",
                    boxShadow: "0 4px 24px var(--accent-glow)",
                  }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: 10,
                        color: "color-mix(in srgb, var(--text-on-accent) 70%, transparent)",
                        marginBottom: 1,
                      }}>Next lesson</div>
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
                    background: "var(--accent)",
                    color: "var(--text-on-accent)",
                    fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 24px var(--accent-glow)",
                  }}>
                    <BookOpen size={13} /> Path complete — view overview
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
        </div>{/* /content body wrapper */}

        {/* ── TOC right rail ─────────────────────────────────────────────────
            Renders ONLY h2/h3. Sticks under the topbar as the user scrolls.
            Active section is tracked by IntersectionObserver against the
            scroll container (see effect above) — that's more accurate than
            a scroll listener since it knows actual viewport coverage and
            avoids state churn on every scroll tick. Hidden on small viewports
            (under 1024px) — the slide-over panel handles navigation there. */}
        {!tutorOpen && headings.length > 2 && (
          <aside
            className="lesson-toc-rail"
            aria-label="On this page"
            style={{
              width: 256, flexShrink: 0,
              position: "sticky", top: 24,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 80px - 48px)",
              overflowY: "auto",
              paddingTop: 8,
            }}
          >
            <div
              className="mono-overline"
              style={{
                color: "var(--text-tertiary)",
                marginBottom: 14,
                padding: "0 12px",
                fontSize: 10.5,
              }}
            >
              On this page
            </div>

            <nav>
              {headings.map(({ level, text, id }) => {
                const active = activeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    aria-current={active ? "location" : undefined}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      background: "transparent",
                      border: "none",
                      borderLeft: active
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                      cursor: "pointer",
                      paddingTop: 6, paddingBottom: 6,
                      paddingLeft: active ? 12 : (level === 3 ? 22 : 12),
                      paddingRight: 12,
                      // Mono on TOC rows per DESIGN.md typography rules.
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                      lineHeight: 1.5,
                      transition: "color 0.15s, padding-left 0.15s",
                    }}
                  >
                    {text}
                  </button>
                );
              })}
            </nav>

            {/* Reading progress — only once scrolling has begun */}
            {readPct > 0 && (
              <div style={{
                marginTop: 24, padding: "16px 12px 0",
                borderTop: "1px solid var(--border-subtle)",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 8,
                }}>
                  <span
                    className="mono-overline"
                    style={{ color: "var(--text-tertiary)", fontSize: 10 }}
                  >
                    Progress
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10, fontWeight: 700,
                    color: readPct === 100 ? "var(--success)" : "var(--accent)",
                  }}>
                    {readPct}%
                  </span>
                </div>
                <div style={{
                  height: 3,
                  background: "var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${readPct}%`,
                    background: readPct === 100 ? "var(--success)" : "var(--accent)",
                    transition: "width 0.3s ease",
                    borderRadius: "var(--radius-full)",
                  }} />
                </div>
              </div>
            )}
          </aside>
        )}

        </div>{/* /content row */}
      </div>

      {/* ── AI Tutor side panel ──────────────────────────────────────────── */}
      {tutorOpen && (
        <aside
          aria-label="AI Tutor"
          style={{
            width: 380, flexShrink: 0,
            borderLeft: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            display: "flex", flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--bg-elevated)",
            boxShadow: "inset 0 1px 0 var(--hairline-top)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 24px var(--accent-glow)",
              }}>
                <Sparkles size={14} color="var(--text-on-accent)" />
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
              aria-label="Close AI Tutor"
              style={{
                background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                padding: 6, borderRadius: 6, color: "var(--text-secondary)",
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
        </aside>
      )}
    </div>
  );
}
