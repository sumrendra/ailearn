"use client";

import { useState } from "react";
import { ArrowRight, Search, FileText, Sparkles, Database, Layers } from "lucide-react";

const DOCS = [
  { id: 1, title: "Refund policy", content: "Refunds available within 30 days. Items must be unworn with tags." },
  { id: 2, title: "Shipping FAQ", content: "Standard shipping is 3–5 business days. Express is next-day." },
  { id: 3, title: "Returns process", content: "Print the prepaid label, drop at any post office. Refund hits your account in 5–7 days." },
  { id: 4, title: "Sizing chart", content: "European sizes run small. Order one size up for the best fit." },
  { id: 5, title: "Contact support", content: "Email support@example.com or call 1-800-…" },
];

const QUESTIONS = [
  {
    text: "How long do I have to return an item?",
    relevant: [1, 3],
  },
  {
    text: "Does shipping take long?",
    relevant: [2],
  },
  {
    text: "What size should I order?",
    relevant: [4],
  },
];

const STEPS = [
  {
    id: "ask",
    label: "User asks a question",
    Icon: Search,
    color: "#6366f1",
    explain:
      "The user types a natural-language question. Without RAG, the LLM would have to answer from its training data alone — which probably doesn't include your refund policy.",
  },
  {
    id: "embed",
    label: "Convert to a vector",
    Icon: Layers,
    color: "#8b5cf6",
    explain:
      "The question is sent to an embedding model, which converts it into a list of numbers (typically 1536 of them) that captures its semantic meaning.",
  },
  {
    id: "search",
    label: "Find similar documents",
    Icon: Database,
    color: "#ec4899",
    explain:
      "We compare the question vector against vectors for every document chunk in our index, and grab the top-k most similar ones. This is the 'retrieval' in RAG.",
  },
  {
    id: "augment",
    label: "Stuff context into the prompt",
    Icon: FileText,
    color: "#f59e0b",
    explain:
      "The retrieved documents are pasted into the prompt as context, alongside the original question. Now the LLM has the facts it needs.",
  },
  {
    id: "generate",
    label: "Model generates the answer",
    Icon: Sparkles,
    color: "#10b981",
    explain:
      "The LLM answers using the provided context. Because the answer is grounded in real documents, it's much less likely to hallucinate.",
  },
];

export function RAGFlowExplorer() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const q = QUESTIONS[questionIdx];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        margin: "24px 0",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          RAG Pipeline — step through a real query
        </div>
        <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 2 }}>
          Click each step below to see what happens. Try different questions.
        </div>
      </div>

      {/* Question selector */}
      <div style={{ padding: "14px 18px 8px" }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 6,
          }}
        >
          Pick a question
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {QUESTIONS.map((qq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestionIdx(i);
                setActiveStep(0);
              }}
              style={{
                padding: "6px 11px",
                fontSize: 12,
                background: questionIdx === i ? "var(--accent-light)" : "var(--bg-secondary)",
                color: questionIdx === i ? "var(--accent-text)" : "var(--text-secondary)",
                border: `1px solid ${questionIdx === i ? "var(--accent)" : "var(--border-subtle)"}`,
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: questionIdx === i ? 600 : 500,
              }}
            >
              {qq.text}
            </button>
          ))}
        </div>
      </div>

      {/* Steps strip */}
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          gap: 6,
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        {STEPS.map((s, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 12px",
                background: isActive
                  ? `color-mix(in srgb, ${s.color} 15%, transparent)`
                  : isPast
                  ? "var(--bg-secondary)"
                  : "var(--bg-secondary)",
                border: `1.5px solid ${isActive ? s.color : isPast ? "color-mix(in srgb, " + s.color + " 30%, transparent)" : "var(--border-subtle)"}`,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <s.Icon size={14} color={isActive || isPast ? s.color : "var(--text-tertiary)"} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? s.color : isPast ? "var(--text-secondary)" : "var(--text-tertiary)",
                }}
              >
                {i + 1}. {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <ArrowRight size={11} color="var(--text-tertiary)" style={{ marginLeft: 4, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Step explanation */}
      <div
        style={{
          margin: "0 18px 14px",
          padding: "14px 16px",
          background: `color-mix(in srgb, ${STEPS[activeStep].color} 6%, transparent)`,
          border: `1px solid color-mix(in srgb, ${STEPS[activeStep].color} 20%, transparent)`,
          borderRadius: "var(--radius-md)",
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.55,
        }}
      >
        {STEPS[activeStep].explain}
      </div>

      {/* Visual state for the current step */}
      <div style={{ padding: "0 18px 20px" }}>
        {activeStep === 0 && (
          <StepBox label="Question received">
            <BubbleQuote>{q.text}</BubbleQuote>
          </StepBox>
        )}

        {activeStep === 1 && (
          <StepBox label="Embedding vector (truncated to 8 of 1,536 dimensions)">
            <code style={vectorBox}>
              [{Array.from({ length: 8 }, () => (Math.random() * 2 - 1).toFixed(3)).join(", ")}, …]
            </code>
          </StepBox>
        )}

        {activeStep === 2 && (
          <StepBox label={`Top results from ${DOCS.length} indexed documents`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DOCS.map((d) => {
                const isMatch = q.relevant.includes(d.id);
                const score = isMatch
                  ? (0.82 + Math.random() * 0.12).toFixed(2)
                  : (0.15 + Math.random() * 0.35).toFixed(2);
                return (
                  <div
                    key={d.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      background: isMatch
                        ? "color-mix(in srgb, var(--success) 8%, transparent)"
                        : "var(--bg-secondary)",
                      border: `1px solid ${isMatch ? "color-mix(in srgb, var(--success) 25%, transparent)" : "var(--border-subtle)"}`,
                      borderRadius: 8,
                      opacity: isMatch ? 1 : 0.65,
                    }}
                  >
                    <FileText size={13} color={isMatch ? "var(--success)" : "var(--text-tertiary)"} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)" }}>
                        {d.title}
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
                        {d.content}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 600,
                        color: isMatch ? "var(--success)" : "var(--text-tertiary)",
                        background: isMatch ? "rgba(22,163,74,0.1)" : "transparent",
                        padding: "2px 7px",
                        borderRadius: 999,
                      }}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </StepBox>
        )}

        {activeStep === 3 && (
          <StepBox label="Final prompt sent to the LLM">
            <pre style={promptBox}>
{`System: You are a helpful support agent. Use only the context below.

Context:
${q.relevant
  .map((id) => `- ${DOCS.find((d) => d.id === id)!.content}`)
  .join("\n")}

User: ${q.text}`}
            </pre>
          </StepBox>
        )}

        {activeStep === 4 && (
          <StepBox label="LLM response (grounded in retrieved context)">
            <BubbleAnswer>
              {answerFor(q.text, q.relevant.map((id) => DOCS.find((d) => d.id === id)!.content))}
            </BubbleAnswer>
          </StepBox>
        )}
      </div>
    </div>
  );
}

function answerFor(question: string, contexts: string[]): string {
  // Plausible canned answers — this isn't a real LLM, it's a demo
  if (/return|refund/i.test(question)) {
    return "You have 30 days to return an item. It must be unworn with tags. Print the prepaid label from the returns page, drop it at any post office, and your refund will appear in 5–7 business days.";
  }
  if (/shipping/i.test(question)) {
    return "Standard shipping is 3–5 business days. If you need it faster, choose Express at checkout — it arrives next day.";
  }
  if (/size/i.test(question)) {
    return "European sizes on our site run a bit small. We recommend ordering one size up for the best fit.";
  }
  return contexts[0] ?? "I couldn't find relevant information for your question.";
}

function StepBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
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
        {label}
      </div>
      {children}
    </div>
  );
}

function BubbleQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--accent-light)",
        border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        color: "var(--accent-text)",
        maxWidth: "max-content",
      }}
    >
      “{children}”
    </div>
  );
}

function BubbleAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "color-mix(in srgb, var(--success) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)",
        borderRadius: 12,
        fontSize: 13.5,
        color: "var(--text-primary)",
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

const vectorBox: React.CSSProperties = {
  display: "block",
  padding: "12px 14px",
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 8,
  fontFamily: "var(--font-mono, monospace)",
  fontSize: 12.5,
  color: "var(--text-secondary)",
  overflowX: "auto",
  whiteSpace: "nowrap",
};

const promptBox: React.CSSProperties = {
  margin: 0,
  padding: "12px 14px",
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 8,
  fontFamily: "var(--font-mono, monospace)",
  fontSize: 11.5,
  color: "var(--text-secondary)",
  lineHeight: 1.6,
  overflowX: "auto",
  whiteSpace: "pre-wrap",
};
