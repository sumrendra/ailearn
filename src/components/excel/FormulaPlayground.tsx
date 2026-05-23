"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, Play, RotateCcw, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { EXCEL_FIXTURES, type ExcelFixtureKey } from "@/lib/excel-fixtures";

// Lazy-import — HyperFormula is ~250KB; we don't want it on the critical path.
import type { HyperFormula as HyperFormulaType } from "hyperformula";

interface FormulaPlaygroundProps {
  fixture?: ExcelFixtureKey;
  initial?: string;
  hint?: string;
  /** Suggested formulas — overrides the fixture defaults if provided */
  suggestions?: { label: string; formula: string }[];
}

/* Module-level singleton per fixture so a page with several playgrounds
 * doesn't spin up multiple HyperFormula engines. Same pattern as SqlPlayground. */
const hfCache = new Map<ExcelFixtureKey, Promise<HyperFormulaType>>();

function getSharedEngine(fixture: ExcelFixtureKey): Promise<HyperFormulaType> {
  let promise = hfCache.get(fixture);
  if (!promise) {
    promise = (async () => {
      const mod = await import("hyperformula");
      // HyperFormula needs a license key (free for non-commercial / open source uses).
      const hf = mod.HyperFormula.buildEmpty({ licenseKey: "gpl-v3" });
      // addSheet returns the sheet *name*; getSheetId converts to the numeric ID.
      const sheetName = hf.addSheet(EXCEL_FIXTURES[fixture].name);
      const sheetId = hf.getSheetId(sheetName);
      if (sheetId === undefined) throw new Error(`Could not get sheet ID for ${sheetName}`);
      hf.setSheetContent(sheetId, EXCEL_FIXTURES[fixture].data as unknown as string[][]);
      return hf;
    })();
    promise.catch(() => hfCache.delete(fixture));
    hfCache.set(fixture, promise);
  }
  return promise;
}

export function FormulaPlayground({
  fixture = "customers",
  initial = "",
  hint,
  suggestions,
}: FormulaPlaygroundProps) {
  const meta = EXCEL_FIXTURES[fixture];
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HyperFormulaType | null>(null);
  const editorRef = useRef<HTMLInputElement>(null);

  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("Tap Run to load the formula engine");
  const [formula, setFormula] = useState(initial.trim() || meta.suggestions?.[0]?.formula || "=SUM(D2:D11)");
  const [result, setResult] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chips = suggestions ?? meta.suggestions ?? [];

  // Lazy mount when scrolled into view (200px lookahead).
  useEffect(() => {
    if (!containerRef.current || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [inView]);

  // Once in view, attach to the shared engine.
  useEffect(() => {
    if (!inView || status !== "idle") return;
    let cancelled = false;
    setStatus("loading");
    setStatusMsg("Loading formula engine…");
    (async () => {
      try {
        const hf = await getSharedEngine(fixture);
        if (cancelled) return;
        engineRef.current = hf;
        setStatus("ready");
        setStatusMsg("Ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setStatusMsg(`Failed: ${(err as Error).message}`);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView, fixture, status]);

  const runFormula = () => {
    if (!engineRef.current) return;
    setError(null);
    try {
      const sheetId = engineRef.current.getSheetId(meta.name);
      if (sheetId === undefined) {
        setError(`Sheet ${meta.name} not found`);
        return;
      }
      // HyperFormula expects formulas in cells — we use a scratch cell at the end of the sheet.
      const scratchRow = meta.data.length + 2;
      engineRef.current.setCellContents({ sheet: sheetId, row: scratchRow, col: 0 }, formula);
      const value = engineRef.current.getCellValue({ sheet: sheetId, row: scratchRow, col: 0 });

      if (value && typeof value === "object" && "type" in value && "value" in value) {
        // HyperFormula error type
        setError(`#${(value as { type: string }).type}`);
        setResult(null);
      } else {
        setResult(value as string | number);
      }
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runFormula();
    }
  };

  const reset = () => {
    setFormula(chips[0]?.formula ?? "=SUM(D2:D11)");
    setResult(null);
    setError(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        margin: "20px 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "color-mix(in srgb, #047857 12%, transparent)",
              border: "1px solid color-mix(in srgb, #047857 25%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Calculator size={14} color="#047857" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Excel Playground
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "var(--text-tertiary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {meta.description}
            </div>
          </div>
        </div>
        <StatusPill status={status} message={statusMsg} />
      </div>

      {/* Data grid */}
      <div style={{ padding: "12px 16px 0", overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: 12.5,
            fontFamily: "var(--font-mono, monospace)",
            width: "100%",
            minWidth: meta.data[0].length * 100,
          }}
        >
          <thead>
            <tr>
              <th style={cornerCell}></th>
              {meta.data[0].map((_, ci) => (
                <th key={ci} style={colHeaderCell}>
                  {String.fromCharCode(65 + ci)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meta.data.map((row, ri) => (
              <tr key={ri}>
                <th style={rowHeaderCell}>{ri + 1}</th>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      ...dataCell,
                      fontWeight: ri === 0 ? 600 : 400,
                      background: ri === 0 ? "var(--bg-tertiary)" : "transparent",
                      color: ri === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hint && (
        <div
          style={{
            margin: "12px 16px 0",
            padding: "9px 12px",
            background: "color-mix(in srgb, var(--accent) 6%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--text-secondary)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Sparkles size={12} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          {hint}
        </div>
      )}

      {/* Formula bar */}
      <div
        style={{
          padding: "14px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#047857",
            fontFamily: "var(--font-mono, monospace)",
            paddingRight: 4,
          }}
        >
          ƒx
        </span>
        <input
          ref={editorRef}
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={handleKey}
          placeholder="=SUM(D2:D11)"
          spellCheck={false}
          style={{
            flex: 1,
            padding: "9px 12px",
            fontSize: 13.5,
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--text-primary)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            outline: "none",
          }}
        />
        <button
          onClick={runFormula}
          disabled={status !== "ready"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            background: status === "ready" ? "#047857" : "var(--bg-tertiary)",
            color: status === "ready" ? "#fff" : "var(--text-tertiary)",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 600,
            cursor: status === "ready" ? "pointer" : "not-allowed",
          }}
        >
          <Play size={12} fill="currentColor" /> Run
        </button>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 12px",
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={11} />
        </button>
      </div>

      {/* Result */}
      <div style={{ padding: "10px 16px 0" }}>
        {error ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "color-mix(in srgb, var(--danger) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--danger)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <AlertCircle size={13} /> {error}
          </div>
        ) : result !== null ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "color-mix(in srgb, var(--success) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)",
              borderRadius: 8,
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <CheckCircle2 size={13} color="var(--success)" />
            <span style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>=</span>
            <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>
              {typeof result === "number" ? (Number.isInteger(result) ? result : Number(result).toFixed(2)) : String(result)}
            </strong>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic", padding: "6px 0" }}>
            Tap Run to evaluate.
          </div>
        )}
      </div>

      {/* Suggested formulas */}
      {chips.length > 0 && (
        <div style={{ padding: "12px 16px 16px" }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 7,
            }}
          >
            Try these
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setFormula(c.formula);
                  editorRef.current?.focus();
                }}
                style={{
                  padding: "6px 11px",
                  fontSize: 11.5,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 999,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, message }: { status: string; message: string }) {
  const palette: Record<string, { bg: string; fg: string; Icon: React.ComponentType<{ size?: number }> }> = {
    idle:    { bg: "var(--bg-tertiary)", fg: "var(--text-tertiary)", Icon: Calculator },
    loading: { bg: "var(--bg-tertiary)", fg: "var(--text-tertiary)", Icon: Loader2 },
    ready:   { bg: "color-mix(in srgb, var(--success) 10%, transparent)", fg: "var(--success)", Icon: CheckCircle2 },
    error:   { bg: "color-mix(in srgb, var(--danger) 10%, transparent)", fg: "var(--danger)", Icon: AlertCircle },
  };
  const { bg, fg, Icon } = palette[status] ?? palette.loading;
  const isSpinning = status === "loading";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span className={isSpinning ? "spin-slow" : ""} style={{ display: "inline-flex" }}>
        <Icon size={11} />
      </span>
      {message}
    </div>
  );
}

const cornerCell: React.CSSProperties = {
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  padding: "4px 6px",
  width: 32,
};

const colHeaderCell: React.CSSProperties = {
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  padding: "4px 8px",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-tertiary)",
  fontFamily: "var(--font-mono, monospace)",
};

const rowHeaderCell: React.CSSProperties = {
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  padding: "4px 8px",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-tertiary)",
  fontFamily: "var(--font-mono, monospace)",
  width: 32,
};

const dataCell: React.CSSProperties = {
  border: "1px solid var(--border-subtle)",
  padding: "5px 10px",
  textAlign: "left",
  whiteSpace: "nowrap",
};
