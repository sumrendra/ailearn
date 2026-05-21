"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Result {
  slug: string;
  title: string;
  description: string | null;
  pathTitle: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search(query);
  };

  return (
    <>
      <Topbar title="Search" subtitle="Find lessons, concepts, and topics" />
      <div style={{ padding: "24px", maxWidth: 700, width: "100%" }}>
        {/* Search input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--bg-card)", border: "1.5px solid var(--border-default)",
          borderRadius: "var(--radius-lg)", padding: "12px 18px",
          boxShadow: "var(--shadow-sm)", marginBottom: 24,
        }}>
          <Search size={18} color="var(--text-tertiary)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search lessons, topics, concepts…"
            autoFocus
            style={{
              flex: 1, border: "none", outline: "none",
              background: "transparent", fontSize: 15,
              color: "var(--text-primary)", fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => search(query)}
            style={{
              padding: "8px 16px", background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div style={{ color: "var(--text-tertiary)", fontSize: 14 }}>Searching…</div>
        )}
        {!loading && searched && results.length === 0 && (
          <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            No lessons found for &ldquo;{query}&rdquo;. Try different keywords.
          </div>
        )}
        {!loading && results.length > 0 && (
          <div style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)", overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}>
            {results.map((r, idx) => (
              <Link key={r.slug} href={`/lessons/${r.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
                  borderBottom: idx < results.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "var(--accent-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <BookOpen size={16} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      {r.pathTitle} {r.description ? `· ${r.description.slice(0, 80)}…` : ""}
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-tertiary)" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !searched && (
          <div style={{
            textAlign: "center", padding: "60px 32px",
            color: "var(--text-tertiary)",
          }}>
            <Search size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 15, marginBottom: 8 }}>Search across all lessons and topics</p>
            <p style={{ fontSize: 13 }}>Try &ldquo;RAG&rdquo;, &ldquo;attention mechanism&rdquo;, or &ldquo;tool use&rdquo;</p>
          </div>
        )}
      </div>
    </>
  );
}
