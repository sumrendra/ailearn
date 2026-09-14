"use client";

import { useCallback, useEffect, useState } from "react";
import { Languages, FileText, Loader2 } from "lucide-react";
import {
  fetchPracticeTranslation,
  getBundledPracticeTranslation,
  readSessionPracticeTranslation,
  writeSessionPracticeTranslation,
} from "@/lib/tcf-program/practice-translation-client";

type Props = {
  /** Practice mode only — hide in exam mode and mocks. */
  enabled: boolean;
  skill: "listening" | "reading";
  cacheKey: string;
  frenchText: string;
};

export function TcfPracticeTextHelp({ enabled, skill, cacheKey, frenchText }: Props) {
  const [open, setOpen] = useState(false);
  const [english, setEnglish] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setError(null);
    const bundled = getBundledPracticeTranslation(cacheKey);
    const session = readSessionPracticeTranslation(cacheKey);
    setEnglish(bundled ?? session ?? null);
  }, [cacheKey, frenchText]);

  const loadEnglish = useCallback(async () => {
    if (english?.trim()) return;
    const session = readSessionPracticeTranslation(cacheKey);
    if (session) {
      setEnglish(session);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const en = await fetchPracticeTranslation({ key: cacheKey, text: frenchText, skill });
      setEnglish(en);
      writeSessionPracticeTranslation(cacheKey, en);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load English translation");
    } finally {
      setLoading(false);
    }
  }, [cacheKey, english, frenchText, skill]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) void loadEnglish();
  };

  if (!enabled || !frenchText.trim()) return null;

  const buttonLabel =
    skill === "listening"
      ? open
        ? "Hide transcript & translation"
        : "Show transcript & English translation"
      : open
        ? "Hide English translation"
        : "Translate passage to English";

  return (
    <div style={{ marginBottom: skill === "listening" ? 20 : 0, marginTop: skill === "reading" ? 12 : 0 }}>
      <button
        type="button"
        onClick={toggle}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--border-subtle)",
          background: open ? "rgba(91,106,240,0.12)" : "var(--bg-overlay)",
          fontSize: 12,
          fontWeight: 600,
          color: open ? "#5b6af0" : "var(--text-secondary)",
          cursor: "pointer",
        }}
      >
        {skill === "listening" ? <FileText size={14} /> : <Languages size={14} />}
        {buttonLabel}
      </button>

      {open && (
        <div
          style={{
            marginTop: 12,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px solid #5b6af033",
            background: "rgba(91,106,240,0.06)",
          }}
        >
          {skill === "listening" && (
            <div style={{ marginBottom: english || loading || error ? 14 : 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                French transcript (what you hear)
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--text-primary)",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}
              >
                {frenchText}
              </p>
            </div>
          )}

          {skill === "reading" && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              English translation (practice aid only)
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              Loading English…
            </div>
          )}

          {error && (
            <p style={{ margin: 0, fontSize: 12, color: "#ef4444", lineHeight: 1.5 }}>
              {error}. You can still use the French {skill === "listening" ? "transcript" : "passage"} above.
            </p>
          )}

          {english && !loading && (
            <p
              style={{
                margin: skill === "reading" ? 0 : "0",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              {english}
            </p>
          )}

          <p style={{ margin: "10px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.45 }}>
            Practice mode only. Real exam mode does not show this help.
          </p>
        </div>
      )}
    </div>
  );
}
