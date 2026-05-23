/**
 * Sample datasets used by the Excel playground.
 *
 * Each fixture is a name + a 2D array of cells (headers in row 0). The
 * FormulaPlayground component loads one of these into HyperFormula and lets
 * the learner write formulas that reference them by A1 notation.
 */

export interface ExcelFixture {
  name: string;
  description: string;
  /** First row is column headers. */
  data: (string | number)[][];
  /** Suggested formulas the learner can click to try */
  suggestions?: { label: string; formula: string }[];
}

export const EXCEL_FIXTURES: Record<string, ExcelFixture> = {
  customers: {
    name: "Customers",
    description: "B2B SaaS customer list — perfect for CSM / BA scenarios",
    data: [
      ["Name", "City", "Plan", "MRR", "Health", "Renewal Date"],
      ["Acme Corp", "New York", "Enterprise", 4500, "Green", "2025-08-15"],
      ["Beta Inc", "London", "Pro", 1200, "Yellow", "2025-06-30"],
      ["Cygnus LLC", "Berlin", "Pro", 1200, "Red", "2025-05-10"],
      ["Delta Co", "New York", "Enterprise", 8000, "Green", "2026-01-20"],
      ["Echo Ltd", "Paris", "Starter", 200, "Yellow", "2025-09-12"],
      ["Foxtrot Inc", "London", "Enterprise", 6500, "Green", "2025-12-01"],
      ["Gamma Corp", "Berlin", "Pro", 1200, "Red", "2025-05-25"],
      ["Hotel Co", "New York", "Starter", 200, "Green", "2026-02-14"],
      ["India Ltd", "Paris", "Pro", 1500, "Yellow", "2025-07-08"],
      ["Juliet Inc", "London", "Enterprise", 5200, "Green", "2025-11-30"],
    ],
    suggestions: [
      { label: "Total MRR", formula: "=SUM(D2:D11)" },
      { label: "Average MRR", formula: "=AVERAGE(D2:D11)" },
      { label: "Count of customers", formula: "=COUNTA(A2:A11)" },
      { label: "How many in London?", formula: '=COUNTIF(B2:B11,"London")' },
      { label: "MRR from Enterprise plans", formula: '=SUMIF(C2:C11,"Enterprise",D2:D11)' },
      { label: "Customers with health = Red", formula: '=COUNTIF(E2:E11,"Red")' },
      { label: "Average MRR for Pro plan", formula: '=AVERAGEIF(C2:C11,"Pro",D2:D11)' },
      { label: "Acme Corp's MRR (VLOOKUP)", formula: '=VLOOKUP("Acme Corp",A2:D11,4,FALSE)' },
    ],
  },
  bugs: {
    name: "Bug Tracker",
    description: "QA bug-tracking sheet with severity, assignee, status",
    data: [
      ["ID", "Title", "Severity", "Assignee", "Status", "Days Open"],
      ["BUG-101", "Login fails on Safari", "P1", "Alice", "Open", 5],
      ["BUG-102", "Wrong total in invoice", "P0", "Bob", "Open", 2],
      ["BUG-103", "Tooltip overlaps", "P3", "Alice", "Closed", 12],
      ["BUG-104", "Password reset email missing", "P1", "Carol", "Open", 8],
      ["BUG-105", "Export to CSV broken", "P2", "Bob", "In Review", 3],
      ["BUG-106", "Cart doesn't persist", "P1", "Alice", "Open", 1],
      ["BUG-107", "Wrong currency on EU site", "P0", "Carol", "Open", 6],
      ["BUG-108", "Slow dashboard load", "P2", "Bob", "Closed", 25],
      ["BUG-109", "Search returns dup results", "P2", "Alice", "Open", 4],
      ["BUG-110", "Date picker mobile bug", "P3", "Carol", "In Review", 7],
    ],
    suggestions: [
      { label: "Total open bugs", formula: '=COUNTIF(E2:E11,"Open")' },
      { label: "Critical (P0) bugs", formula: '=COUNTIF(C2:C11,"P0")' },
      { label: "Bugs assigned to Alice", formula: '=COUNTIF(D2:D11,"Alice")' },
      { label: "P0 + P1 (critical) count", formula: '=COUNTIF(C2:C11,"P0")+COUNTIF(C2:C11,"P1")' },
      { label: "Average days open", formula: "=AVERAGE(F2:F11)" },
      { label: "Oldest open bug (days)", formula: '=MAX(F2:F11)' },
      { label: "Open P1 bugs", formula: '=COUNTIFS(C2:C11,"P1",E2:E11,"Open")' },
    ],
  },
  sales: {
    name: "Sales Pipeline",
    description: "Deal pipeline — perfect for BA / sales-ops scenarios",
    data: [
      ["Deal", "Owner", "Stage", "Value", "Close Date", "Probability"],
      ["Acme Renewal", "Alice", "Closed Won", 12000, "2025-04-10", 1.0],
      ["Beta Expansion", "Bob", "Negotiation", 24000, "2025-06-15", 0.75],
      ["Cygnus New", "Carol", "Discovery", 8000, "2025-08-30", 0.25],
      ["Delta Upsell", "Alice", "Proposal", 15000, "2025-05-22", 0.50],
      ["Echo Renewal", "Bob", "Closed Won", 5000, "2025-04-01", 1.0],
      ["Foxtrot New", "Carol", "Negotiation", 30000, "2025-07-18", 0.75],
      ["Gamma New", "Alice", "Discovery", 4000, "2025-09-05", 0.25],
      ["Hotel Renewal", "Bob", "Closed Lost", 9000, "2025-03-30", 0.0],
      ["India Expansion", "Carol", "Proposal", 18000, "2025-06-08", 0.50],
      ["Juliet New", "Alice", "Closed Won", 11000, "2025-04-25", 1.0],
    ],
    suggestions: [
      { label: "Total pipeline value", formula: "=SUM(D2:D11)" },
      { label: "Weighted pipeline (Value × Probability)", formula: "=SUMPRODUCT(D2:D11,F2:F11)" },
      { label: "Total Closed Won", formula: '=SUMIF(C2:C11,"Closed Won",D2:D11)' },
      { label: "Alice's pipeline", formula: '=SUMIF(B2:B11,"Alice",D2:D11)' },
      { label: "Deals over $10k", formula: '=COUNTIF(D2:D11,">10000")' },
      { label: "Biggest deal", formula: "=MAX(D2:D11)" },
    ],
  },
};

export type ExcelFixtureKey = keyof typeof EXCEL_FIXTURES;
