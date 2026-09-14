"use client";

import { useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { TcfVocabQuizSession } from "@/components/tcf/TcfVocabQuizSession";
import { collectVocabPairs, scopeLabel, type VocabQuizScope } from "@/lib/tcf-program/vocab-quiz";
import { EXAM_BAND_META } from "@/lib/content/tcf-exam-lexique";

const COUNT_OPTIONS = [10, 15, 20, 30] as const;

export default function TcfVocabQuizPage() {
  const [started, setStarted] = useState(false);
  const [scope, setScope] = useState<VocabQuizScope>("b");
  const [count, setCount] = useState<number>(15);

  const poolSize = collectVocabPairs(scope).length;

  return (
    <>
      <Topbar title="Vocabulary quiz" subtitle="Multiple choice · French → English · core exam words" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />

        {!started ? (
          <div
            style={{
              padding: 24,
              borderRadius: 16,
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
            }}
          >
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Revise your vocabulary</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 24px" }}>
              This quiz uses the same core word list as the flashcard path. It is separate from the main{" "}
              <Link href="/quiz" style={{ color: "var(--accent)" }}>
                AI topic quizzes
              </Link>{" "}
              (those are for general learning paths).
            </p>

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Word set</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {(
                [
                  { id: "all" as const, hint: "450 words across A + B + C" },
                  ...EXAM_BAND_META.map((b) => ({ id: b.id as VocabQuizScope, hint: `${b.count} words · ${b.cefr}` })),
                ] as { id: VocabQuizScope; hint: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${scope === opt.id ? "#be185d" : "var(--border-subtle)"}`,
                    background: scope === opt.id ? "rgba(190,24,93,0.08)" : "var(--bg-overlay)",
                    cursor: "pointer",
                    color: "inherit",
                    font: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{scopeLabel(opt.id)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{opt.hint}</div>
                </button>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Questions</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(Math.min(n, poolSize))}
                  disabled={poolSize < 1}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${count === n ? "#be185d" : "var(--border-subtle)"}`,
                    background: count === n ? "rgba(190,24,93,0.12)" : "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
              Pool size: {poolSize} unique English headwords in this set.
            </p>

            <button
              type="button"
              disabled={poolSize === 0}
              onClick={() => setStarted(true)}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: poolSize === 0 ? "var(--bg-overlay)" : "#be185d",
                color: poolSize === 0 ? "var(--text-muted)" : "white",
                fontWeight: 700,
                fontSize: 15,
                cursor: poolSize === 0 ? "not-allowed" : "pointer",
              }}
            >
              Start quiz
            </button>
            <p style={{ marginTop: 16, fontSize: 12 }}>
              <Link href="/tcf/vocabulary" style={{ color: "var(--accent)" }}>
                ← Back to vocabulary path
              </Link>
            </p>
          </div>
        ) : (
          <TcfVocabQuizSession
            scope={scope}
            count={Math.min(count, poolSize)}
            onRestartSetup={() => setStarted(false)}
          />
        )}
      </div>
    </>
  );
}
