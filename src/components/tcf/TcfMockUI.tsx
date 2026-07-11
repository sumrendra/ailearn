"use client";

import type { MockModule, MockModuleScore } from "@/lib/tcf-program/mock-session";
import { MOCK_MODULE_LABELS } from "@/lib/tcf-program/mock-session";
import { useTcfMockFlow } from "./useTcfMockFlow";

const NEXT_LABEL: Partial<Record<MockModule, string>> = {
  listening: "Reading",
  reading: "Writing",
  writing: "Speaking",
  speaking: "Results",
};

export function TcfMockCompleteBar({
  module,
  score,
}: {
  module: MockModule;
  score: MockModuleScore;
}) {
  const { isMock, advanceMock } = useTcfMockFlow(module);
  if (!isMock) return null;

  const next = NEXT_LABEL[module] ?? "Next section";

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "14px 18px",
        borderRadius: 10,
        background: "#be185d12",
        border: "1px solid #be185d44",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#be185d", marginBottom: 6 }}>
        Full mock exam · {MOCK_MODULE_LABELS[module]} complete
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.5 }}>
        Take a moment to review, then continue. Exam mode stays on for the remaining sections.
      </p>
      <button
        type="button"
        onClick={() => advanceMock(score)}
        style={{
          width: "100%",
          padding: "12px",
          background: "#be185d",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Continue to {next} →
      </button>
    </div>
  );
}

export function TcfMockBanner({ module }: { module: MockModule }) {
  const { isMock, mockPaper } = useTcfMockFlow(module);
  if (!isMock) return null;

  return (
    <div
      style={{
        maxWidth: 620,
        margin: "0 auto 16px",
        padding: "10px 16px",
        borderRadius: 8,
        background: "#be185d10",
        border: "1px solid #be185d33",
        fontSize: 13,
        color: "var(--text-secondary)",
      }}
    >
      <strong style={{ color: "#be185d" }}>Full mock · Paper {mockPaper}</strong>
      {" "}— {MOCK_MODULE_LABELS[module]}. Complete this section, then continue to the next.
    </div>
  );
}
