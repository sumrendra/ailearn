/**
 * Parsers for Java lesson interactive blocks.
 *
 *   ```java-quiz
 *   level: tricky
 *   q: What does this print?
 *   code:
 *     Integer a = 127;
 *     Integer b = 127;
 *     System.out.println(a == b);
 *   options: true | false | NullPointerException | won't compile
 *   correct: 0
 *   explain: Java caches Integer values from -128 to 127. Both a and b point to the same cached Integer instance, so == (reference equality) is true.
 *   ```
 *
 * Code can span multiple lines if indented under the "code:" key.
 * Other interactive components (HashMapVisualizer, CollectionsHierarchy) take no body — empty fence.
 */

export interface JavaQuizData {
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation?: string;
  level?: "easy" | "medium" | "tricky";
}

export function parseJavaQuiz(raw: string): JavaQuizData | null {
  const out: Partial<JavaQuizData> = {};
  const lines = raw.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^(\w+)\s*:\s*(.*)$/.exec(line.trim());
    if (!m) {
      i++;
      continue;
    }
    const [, key, valueRest] = m;
    if (key === "q" || key === "question") out.question = valueRest.trim();
    else if (key === "options")
      out.options = valueRest.split("|").map((s) => s.trim()).filter(Boolean);
    else if (key === "correct") out.correct = parseInt(valueRest.trim(), 10);
    else if (key === "explain" || key === "explanation") out.explanation = valueRest.trim();
    else if (key === "level") out.level = valueRest.trim() as "easy" | "medium" | "tricky";
    else if (key === "code") {
      // Multi-line code: take all subsequent indented lines (or until next top-level key)
      if (valueRest.trim()) {
        out.code = valueRest.trim();
      } else {
        const codeLines: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j];
          // Stop if the next non-empty line is another top-level key
          if (next.trim() && /^\w+\s*:/.test(next.trim()) && !next.startsWith(" ") && !next.startsWith("\t")) {
            break;
          }
          codeLines.push(next.startsWith("  ") ? next.slice(2) : next.startsWith("\t") ? next.slice(1) : next);
          j++;
        }
        out.code = codeLines.join("\n").trim();
        i = j - 1; // advance outer index
      }
    }
    i++;
  }
  if (!out.question || !out.options || typeof out.correct !== "number") return null;
  return out as JavaQuizData;
}
