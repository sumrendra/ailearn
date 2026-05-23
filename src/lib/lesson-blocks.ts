/**
 * Parses directive lines from a fenced code block.
 *
 * In lesson markdown we use a convention like:
 *
 *   ```sql-playground
 *   -- @fixture: ecommerce
 *   -- @hint: Try filtering by city.
 *   -- @challenge: Top 3 customers by spend | SELECT customer_id, SUM(total) ... LIMIT 3;
 *   SELECT * FROM customers LIMIT 5;
 *   ```
 *
 * Lines starting with `-- @key: value` (or `// @key: value` for non-SQL blocks)
 * become metadata. Everything else is the body (default code).
 */

export interface ParsedBlock {
  meta: Record<string, string>;
  challenges: { label: string; sql: string }[];
  body: string;
}

const DIRECTIVE = /^\s*(?:--|\/\/)\s*@([\w-]+)\s*:\s*(.*)$/;

export function parseLessonBlock(raw: string): ParsedBlock {
  const meta: Record<string, string> = {};
  const challenges: { label: string; sql: string }[] = [];
  const bodyLines: string[] = [];

  for (const line of raw.split("\n")) {
    const m = line.match(DIRECTIVE);
    if (!m) {
      bodyLines.push(line);
      continue;
    }
    const [, key, value] = m;
    if (key === "challenge") {
      // challenge format: "label | sql"
      const sepIdx = value.indexOf("|");
      if (sepIdx > 0) {
        challenges.push({
          label: value.slice(0, sepIdx).trim(),
          sql: value.slice(sepIdx + 1).trim(),
        });
      }
    } else {
      meta[key] = value.trim();
    }
  }

  return {
    meta,
    challenges,
    body: bodyLines.join("\n").trim(),
  };
}
