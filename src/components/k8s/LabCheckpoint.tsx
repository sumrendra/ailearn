"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Circle, Cloud } from "lucide-react";
import type { K8sCheckpointData } from "@/lib/k8s-blocks";

interface LabCheckpointProps extends K8sCheckpointData {}

/**
 * Hands-on lab step: copy command, compare terminal output, confirm checkpoint.
 */
export function LabCheckpoint({ step, title, command, expect, hint }: LabCheckpointProps) {
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${done ? "var(--success)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 16,
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#326ce5",
          }}
        >
          <Cloud size={11} /> Lab step {step}
        </div>
        {done && (
          <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600, marginLeft: "auto" }}>
            Checkpoint passed
          </span>
        )}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{title}</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          borderRadius: 8,
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          marginBottom: 10,
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: 12.5,
        }}
      >
        <Terminal size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
        <code style={{ flex: 1, wordBreak: "break-all" }}>{command}</code>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy command"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-elevated)",
            cursor: "pointer",
            fontSize: 11,
            color: "var(--text-secondary)",
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {hint && (
        <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--text-muted)" }}>{hint}</p>
      )}

      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        You should see something like:
      </div>
      <pre
        style={{
          margin: "0 0 14px",
          padding: 12,
          borderRadius: 8,
          background: "#0d1117",
          color: "#3fb950",
          fontSize: 11.5,
          lineHeight: 1.5,
          overflow: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {expect}
      </pre>

      <button
        type="button"
        onClick={() => setDone(true)}
        disabled={done}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          borderRadius: 8,
          border: "none",
          background: done ? "var(--success)" : "#326ce5",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: done ? "default" : "pointer",
          opacity: done ? 0.85 : 1,
        }}
      >
        {done ? <Check size={14} /> : <Circle size={14} />}
        {done ? "Done" : "I ran this — output matches"}
      </button>
    </div>
  );
}
