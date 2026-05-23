"use client";

import { useMemo, useState } from "react";
import { Table2, X, Plus, RotateCcw } from "lucide-react";
import { EXCEL_FIXTURES, type ExcelFixtureKey } from "@/lib/excel-fixtures";

type AggFn = "sum" | "count" | "average" | "min" | "max";

interface PivotSimulatorProps {
  fixture?: ExcelFixtureKey;
  /** Pre-configured layout the learner sees on first render */
  initialRows?: string[];
  initialCols?: string[];
  initialValues?: { field: string; agg: AggFn }[];
}

/**
 * Drag-free pivot table simulator. Learners click field names to assign
 * them to Rows / Columns / Values. The pivot updates live.
 *
 * No DnD library — click-based assignment is more accessible, friendlier on
 * mobile, and avoids dragging glitches that distract from learning.
 */
export function PivotSimulator({
  fixture = "customers",
  initialRows = [],
  initialCols = [],
  initialValues = [],
}: PivotSimulatorProps) {
  const meta = EXCEL_FIXTURES[fixture];
  const headers = meta.data[0] as string[];
  const rows = meta.data.slice(1) as (string | number)[][];

  const [rowFields, setRowFields] = useState<string[]>(initialRows);
  const [colFields, setColFields] = useState<string[]>(initialCols);
  const [valueFields, setValueFields] = useState<{ field: string; agg: AggFn }[]>(initialValues);

  const reset = () => {
    setRowFields([]);
    setColFields([]);
    setValueFields([]);
  };

  const isUsed = (field: string) =>
    rowFields.includes(field) || colFields.includes(field) || valueFields.some((v) => v.field === field);

  // Compute the pivot: group rows by (rowFields × colFields), aggregate value fields.
  const pivot = useMemo(() => {
    return computePivot(headers, rows, rowFields, colFields, valueFields);
  }, [headers, rows, rowFields, colFields, valueFields]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        margin: "20px 0",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            }}
          >
            <Table2 size={14} color="#047857" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Pivot Table Builder
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
              {meta.description}
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            fontSize: 11,
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      {/* Workspace */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        {/* Left: field controls */}
        <div>
          <FieldPanel
            label="Fields"
            help="Click to add"
            fields={headers}
            isAdded={isUsed}
            renderField={(f) => (
              <button
                key={f}
                disabled={isUsed(f)}
                onClick={() => setRowFields((r) => [...r, f])}
                style={{
                  ...chipBase,
                  background: isUsed(f) ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                  color: isUsed(f) ? "var(--text-tertiary)" : "var(--text-primary)",
                  cursor: isUsed(f) ? "default" : "pointer",
                  opacity: isUsed(f) ? 0.5 : 1,
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <span>{f}</span>
                <Plus size={10} />
              </button>
            )}
          />

          <DropZone
            label="Rows"
            color="#6366f1"
            fields={rowFields}
            onRemove={(f) => setRowFields((r) => r.filter((x) => x !== f))}
          />
          <DropZone
            label="Columns"
            color="#0891b2"
            fields={colFields}
            onRemove={(f) => setColFields((r) => r.filter((x) => x !== f))}
          />
          <ValueZone
            values={valueFields}
            onAdd={(field) =>
              setValueFields((v) => [...v, { field, agg: numericLikely(headers, rows, field) ? "sum" : "count" }])
            }
            onRemove={(idx) => setValueFields((v) => v.filter((_, i) => i !== idx))}
            onAggChange={(idx, agg) =>
              setValueFields((v) => v.map((x, i) => (i === idx ? { ...x, agg } : x)))
            }
            availableFields={headers.filter((h) => !valueFields.some((v) => v.field === h))}
          />
        </div>

        {/* Right: pivot output */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 8,
            }}
          >
            Result
          </div>
          {valueFields.length === 0 ? (
            <div
              style={{
                padding: "32px 18px",
                textAlign: "center",
                background: "var(--bg-secondary)",
                border: "1.5px dashed var(--border-default)",
                borderRadius: "var(--radius-md)",
                fontSize: 12.5,
                color: "var(--text-tertiary)",
              }}
            >
              Add at least one Value field to see the pivot.
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-card)",
              }}
            >
              <PivotTable pivot={pivot} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function FieldPanel({
  label,
  help,
  fields,
  isAdded,
  renderField,
}: {
  label: string;
  help: string;
  fields: string[];
  isAdded: (f: string) => boolean;
  renderField: (f: string) => React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <ZoneLabel label={label} help={help} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {fields.map((f) => renderField(f))}
      </div>
    </div>
  );
}

function DropZone({
  label,
  color,
  fields,
  onRemove,
}: {
  label: string;
  color: string;
  fields: string[];
  onRemove: (f: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <ZoneLabel label={label} color={color} />
      <div
        style={{
          minHeight: 36,
          padding: 6,
          background: `color-mix(in srgb, ${color} 5%, transparent)`,
          border: `1.5px dashed color-mix(in srgb, ${color} 30%, transparent)`,
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {fields.length === 0 ? (
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontStyle: "italic", padding: "4px 6px" }}>
            (empty)
          </span>
        ) : (
          fields.map((f) => (
            <span
              key={f}
              style={{
                ...chipBase,
                background: color,
                color: "#fff",
                cursor: "default",
              }}
            >
              {f}
              <button
                onClick={() => onRemove(f)}
                style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 0, marginLeft: 3 }}
              >
                <X size={10} />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function ValueZone({
  values,
  onAdd,
  onRemove,
  onAggChange,
  availableFields,
}: {
  values: { field: string; agg: AggFn }[];
  onAdd: (field: string) => void;
  onRemove: (idx: number) => void;
  onAggChange: (idx: number, agg: AggFn) => void;
  availableFields: string[];
}) {
  const color = "#f59e0b";
  return (
    <div>
      <ZoneLabel label="Values" color={color} help="Pick aggregator" />
      <div
        style={{
          minHeight: 36,
          padding: 6,
          background: `color-mix(in srgb, ${color} 5%, transparent)`,
          border: `1.5px dashed color-mix(in srgb, ${color} 30%, transparent)`,
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {values.length === 0 && availableFields.length === 0 && (
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontStyle: "italic", padding: "4px 6px" }}>
            (empty)
          </span>
        )}
        {values.map((v, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 6px",
              background: color,
              color: "#fff",
              borderRadius: 6,
              fontSize: 11.5,
            }}
          >
            <select
              value={v.agg}
              onChange={(e) => onAggChange(i, e.target.value as AggFn)}
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "2px 4px",
                fontSize: 10.5,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <option value="sum">SUM</option>
              <option value="count">COUNT</option>
              <option value="average">AVG</option>
              <option value="min">MIN</option>
              <option value="max">MAX</option>
            </select>
            <span style={{ fontWeight: 500 }}>of {v.field}</span>
            <button
              onClick={() => onRemove(i)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 0, marginLeft: "auto" }}
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {availableFields.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, paddingTop: values.length ? 2 : 0 }}>
            {availableFields.map((f) => (
              <button
                key={f}
                onClick={() => onAdd(f)}
                style={{
                  ...chipBase,
                  background: "transparent",
                  border: "1px solid color-mix(in srgb, " + color + " 40%, transparent)",
                  color: color,
                  fontSize: 10.5,
                  cursor: "pointer",
                }}
              >
                + {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ZoneLabel({ label, color, help }: { label: string; color?: string; help?: string }) {
  return (
    <div style={{ marginBottom: 5, display: "flex", alignItems: "baseline", gap: 6 }}>
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: color ?? "var(--text-tertiary)",
        }}
      >
        {label}
      </span>
      {help && <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{help}</span>}
    </div>
  );
}

const chipBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 9px",
  fontSize: 11.5,
  fontWeight: 500,
  borderRadius: 6,
  border: "1px solid var(--border-subtle)",
};

/* ── Pivot computation ──────────────────────────────────────────────────── */

interface PivotResult {
  rowHeaders: string[];        // hierarchical row labels (joined by ' / ' if multi)
  colHeaders: string[];        // top-level column labels (each is a unique col-field combo)
  cellGrid: (number | string | "")[][]; // rowHeaders.length × (colHeaders.length * valueFields.length)
  valueLabels: string[];       // one entry per value field, repeated per col header
}

function computePivot(
  headers: string[],
  rows: (string | number)[][],
  rowFields: string[],
  colFields: string[],
  valueFields: { field: string; agg: AggFn }[],
): PivotResult {
  if (valueFields.length === 0) {
    return { rowHeaders: [], colHeaders: [], cellGrid: [], valueLabels: [] };
  }

  const colIdxByHeader = new Map<string, number>();
  headers.forEach((h, i) => colIdxByHeader.set(h, i));

  const keyOf = (fields: string[], row: (string | number)[]) =>
    fields.map((f) => String(row[colIdxByHeader.get(f)!])).join(" / ");

  // Discover unique row keys and column keys in source order
  const uniqueRowKeys: string[] = [];
  const uniqueColKeys: string[] = [];
  const seenRow = new Set<string>();
  const seenCol = new Set<string>();

  for (const row of rows) {
    const rk = rowFields.length ? keyOf(rowFields, row) : "Total";
    if (!seenRow.has(rk)) {
      seenRow.add(rk);
      uniqueRowKeys.push(rk);
    }
    const ck = colFields.length ? keyOf(colFields, row) : "";
    if (!seenCol.has(ck)) {
      seenCol.add(ck);
      uniqueColKeys.push(ck);
    }
  }
  uniqueRowKeys.sort();
  uniqueColKeys.sort();

  // Group rows by (rowKey, colKey)
  const buckets = new Map<string, (string | number)[][]>();
  for (const row of rows) {
    const rk = rowFields.length ? keyOf(rowFields, row) : "Total";
    const ck = colFields.length ? keyOf(colFields, row) : "";
    const key = `${rk} ${ck}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(row);
  }

  // Build cell grid
  const cellGrid: (number | string | "")[][] = [];
  for (const rk of uniqueRowKeys) {
    const rowOut: (number | string | "")[] = [];
    for (const ck of uniqueColKeys) {
      const bucket = buckets.get(`${rk} ${ck}`) ?? [];
      for (const vf of valueFields) {
        const ci = colIdxByHeader.get(vf.field)!;
        const values = bucket
          .map((r) => r[ci])
          .filter((v) => v !== "" && v !== null && v !== undefined);
        rowOut.push(aggregate(values, vf.agg));
      }
    }
    cellGrid.push(rowOut);
  }

  const valueLabels = valueFields.map((v) => `${v.agg.toUpperCase()}(${v.field})`);
  return { rowHeaders: uniqueRowKeys, colHeaders: uniqueColKeys, cellGrid, valueLabels };
}

function aggregate(values: (string | number)[], agg: AggFn): number | string | "" {
  if (values.length === 0) return "";
  if (agg === "count") return values.length;
  const nums = values.filter((v) => typeof v === "number" || !isNaN(Number(v))).map(Number);
  if (nums.length === 0) return "";
  if (agg === "sum") return Math.round(nums.reduce((a, b) => a + b, 0) * 100) / 100;
  if (agg === "min") return Math.min(...nums);
  if (agg === "max") return Math.max(...nums);
  if (agg === "average") return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
  return "";
}

function numericLikely(headers: string[], rows: (string | number)[][], field: string): boolean {
  const idx = headers.indexOf(field);
  if (idx < 0) return false;
  const samples = rows.slice(0, 5).map((r) => r[idx]);
  return samples.every((v) => typeof v === "number" || !isNaN(Number(v)));
}

function PivotTable({ pivot }: { pivot: PivotResult }) {
  if (pivot.rowHeaders.length === 0) {
    return (
      <div style={{ padding: 16, fontSize: 12, color: "var(--text-tertiary)" }}>
        No data — add a Row field or a Value field.
      </div>
    );
  }
  const showColHeaders = pivot.colHeaders.length > 1 || pivot.colHeaders[0] !== "";
  return (
    <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5 }}>
      <thead>
        {showColHeaders && (
          <tr>
            <th style={pivotTh}></th>
            {pivot.colHeaders.map((ch) => (
              <th
                key={ch}
                colSpan={pivot.valueLabels.length}
                style={{ ...pivotTh, background: "color-mix(in srgb, #0891b2 8%, transparent)" }}
              >
                {ch}
              </th>
            ))}
          </tr>
        )}
        <tr>
          <th style={{ ...pivotTh, background: "color-mix(in srgb, #6366f1 8%, transparent)" }}>
            {/* spacer */}
          </th>
          {pivot.colHeaders.map((_, ci) =>
            pivot.valueLabels.map((vl, vi) => (
              <th
                key={`${ci}-${vi}`}
                style={{ ...pivotTh, background: "color-mix(in srgb, #f59e0b 8%, transparent)", fontSize: 10.5 }}
              >
                {vl}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {pivot.rowHeaders.map((rh, ri) => (
          <tr key={ri}>
            <th style={{ ...pivotTd, fontWeight: 600, background: "color-mix(in srgb, #6366f1 4%, transparent)", textAlign: "left" }}>
              {rh}
            </th>
            {pivot.cellGrid[ri].map((cell, ci) => (
              <td key={ci} style={pivotTd}>
                {typeof cell === "number" ? cell.toLocaleString() : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const pivotTh: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid var(--border-subtle)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.03em",
  color: "var(--text-secondary)",
  textAlign: "center",
};

const pivotTd: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid var(--border-subtle)",
  fontSize: 12.5,
  color: "var(--text-primary)",
  textAlign: "right",
  fontFamily: "var(--font-mono, monospace)",
};
