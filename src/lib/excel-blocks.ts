/**
 * Parsers for Excel lesson interactive blocks.
 *
 *   ```excel-formula
 *   fixture: customers
 *   hint: Try changing the criterion in COUNTIF.
 *   formula: =COUNTIF(B2:B11,"London")
 *   ```
 *
 *   ```excel-pivot
 *   fixture: customers
 *   rows: City
 *   cols: Plan
 *   values: MRR:sum | Name:count
 *   ```
 *
 *   ```excel-quiz
 *   q: What does =COUNTIF(B2:B5,">100") return given B2:B5 = [50, 120, 80, 200]?
 *   options: 1 | 2 | 3 | 4
 *   correct: 1
 *   explain: COUNTIF counts cells that meet the criterion. Two values (120 and 200) exceed 100.
 *   ```
 */
import type { ExcelFixtureKey } from "./excel-fixtures";

export interface ExcelFormulaData {
  fixture: ExcelFixtureKey;
  formula?: string;
  hint?: string;
}

export function parseExcelFormula(raw: string): ExcelFormulaData {
  const out: ExcelFormulaData = { fixture: "customers" };
  for (const line of raw.split("\n")) {
    const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    if (key === "fixture") out.fixture = value.trim() as ExcelFixtureKey;
    else if (key === "formula") out.formula = value.trim();
    else if (key === "hint") out.hint = value.trim();
  }
  return out;
}

export interface ExcelPivotData {
  fixture: ExcelFixtureKey;
  rows: string[];
  cols: string[];
  values: { field: string; agg: "sum" | "count" | "average" | "min" | "max" }[];
}

export function parseExcelPivot(raw: string): ExcelPivotData {
  const out: ExcelPivotData = { fixture: "customers", rows: [], cols: [], values: [] };
  for (const line of raw.split("\n")) {
    const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    if (key === "fixture") out.fixture = value.trim() as ExcelFixtureKey;
    else if (key === "rows") out.rows = value.split("|").map((s) => s.trim()).filter(Boolean);
    else if (key === "cols") out.cols = value.split("|").map((s) => s.trim()).filter(Boolean);
    else if (key === "values") {
      out.values = value
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((token) => {
          const [field, agg] = token.split(":").map((s) => s.trim());
          return {
            field,
            agg: ((agg ?? "sum") as "sum" | "count" | "average" | "min" | "max"),
          };
        });
    }
  }
  return out;
}

export interface ExcelQuizData {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export function parseExcelQuiz(raw: string): ExcelQuizData | null {
  const out: Partial<ExcelQuizData> = {};
  for (const line of raw.split("\n")) {
    const m = /^\s*(\w+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    if (key === "q" || key === "question") out.question = value.trim();
    else if (key === "options") out.options = value.split("|").map((s) => s.trim()).filter(Boolean);
    else if (key === "correct") out.correct = parseInt(value.trim(), 10);
    else if (key === "explain" || key === "explanation") out.explanation = value.trim();
  }
  if (!out.question || !out.options || typeof out.correct !== "number") return null;
  return out as ExcelQuizData;
}
