"use client";

import { useEffect, useMemo, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;  // 2 or 3
}

interface TableOfContentsProps {
  /** Raw markdown — we extract H2/H3 from it without rendering */
  markdown: string;
  /** Scrolling container; defaults to window */
  scrollContainer?: React.RefObject<HTMLElement | null>;
}

/**
 * Right-side TOC for the lesson reader. Reads H2/H3 from the lesson markdown,
 * slugifies them to match what react-markdown produces (no `rehype-slug`
 * dependency — we slugify identically), and highlights the active section
 * based on scroll position.
 */
export function TableOfContents({ markdown, scrollContainer }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const handler = () => {
      // Find the topmost heading that's still above the viewport top + 120px buffer
      const buffer = 120;
      let active = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - buffer <= 0) active = h.id;
        else break;
      }
      setActiveId(active);
    };

    handler();
    const node: EventTarget = scrollContainer?.current ?? window;
    node.addEventListener("scroll", handler, { passive: true });
    return () => node.removeEventListener("scroll", handler);
  }, [headings, scrollContainer]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      style={{
        position: "sticky",
        top: 84,
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        padding: "4px 0 16px",
        width: 220,
        flexShrink: 0,
      }}
    >
      <div
        className="text-eyebrow"
        style={{ color: "var(--text-quaternary)", marginBottom: 12, paddingLeft: 12 }}
      >
        On this page
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", `#${h.id}`);
              }}
              style={{
                display: "block",
                padding: "5px 12px",
                marginLeft: h.level === 3 ? 12 : 0,
                fontSize: 12.5,
                color: activeId === h.id ? "var(--accent)" : "var(--text-tertiary)",
                fontWeight: activeId === h.id ? 600 : 400,
                lineHeight: 1.45,
                borderLeft: `2px solid ${activeId === h.id ? "var(--accent)" : "transparent"}`,
                transition: "all 0.15s ease",
                textDecoration: "none",
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Pull H2 and H3 from raw markdown. Slugify the same way react-markdown
 * + GitHub does: lowercase, strip non-word characters, hyphenate spaces.
 */
function extractHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  const lines = md.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/`/g, "").trim();
    out.push({ id: slugify(text), text, level });
  }
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}
