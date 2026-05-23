"use client";

import { useState } from "react";
import { Brain, Wrench, MessageSquare, CheckCircle2, ArrowDown, RotateCw } from "lucide-react";

interface Step {
  iter: number;
  thought: string;
  action: string | null;
  observation: string | null;
  isFinal?: boolean;
}

const SCENARIOS: Record<string, { task: string; steps: Step[] }> = {
  weather: {
    task: "What should I wear to the meeting in Paris tomorrow?",
    steps: [
      {
        iter: 1,
        thought: "I need to know the weather in Paris tomorrow to recommend an outfit. I'll call the weather tool.",
        action: 'get_weather(city="Paris", date="tomorrow")',
        observation: "{ temp_c: 9, condition: 'rain', wind_kmh: 22 }",
      },
      {
        iter: 2,
        thought: "9°C with rain and moderate wind. The user is going to a meeting, so they want to look professional but stay dry and warm. I have enough info to answer — no more tool calls needed.",
        action: null,
        observation: null,
        isFinal: true,
      },
    ],
  },
  research: {
    task: "How much revenue did Anthropic generate in 2024?",
    steps: [
      {
        iter: 1,
        thought: "This requires recent information that may not be in my training data. I'll search the web.",
        action: 'web_search(query="Anthropic 2024 annual revenue")',
        observation: "5 results. Top: 'Anthropic Hits $1B Annualized Revenue Run-Rate' (TheInformation, Dec 2024)",
      },
      {
        iter: 2,
        thought: "That's an annualized run rate, not total annual revenue. I need to dig deeper into one of these sources.",
        action: 'fetch_url(url="theinformation.com/anthropic-revenue-2024")',
        observation: "Article reports Anthropic reached $1B annualized run-rate by end of 2024, up from $100M earlier in the year. Total 2024 revenue ~$300-400M.",
      },
      {
        iter: 3,
        thought: "I now have a concrete figure and the context (run rate vs total revenue). I can answer with appropriate qualification.",
        action: null,
        observation: null,
        isFinal: true,
      },
    ],
  },
  booking: {
    task: "Book me a table for 2 at any Italian restaurant near Times Square for tomorrow at 7pm.",
    steps: [
      {
        iter: 1,
        thought: "I need to find Italian restaurants near Times Square first.",
        action: 'search_restaurants(area="Times Square", cuisine="italian")',
        observation: "12 results. Top 3: Carmine's (3 stars, $$), Becco (4 stars, $$$), Trattoria Trecolori (4 stars, $$)",
      },
      {
        iter: 2,
        thought: "Trattoria Trecolori has good ratings and a moderate price. I'll check availability there first.",
        action: 'check_availability(restaurant="Trattoria Trecolori", party=2, datetime="tomorrow 7pm")',
        observation: "Available. Confirmation required to book.",
      },
      {
        iter: 3,
        thought: "Booking requires the user's consent before I take an irreversible action. I should not auto-book — instead surface the option.",
        action: null,
        observation: null,
        isFinal: true,
      },
    ],
  },
};

export function AgentLoopInteractive() {
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>("weather");
  const [revealed, setRevealed] = useState(1);

  const s = SCENARIOS[scenario];
  const visibleSteps = s.steps.slice(0, revealed);
  const canStep = revealed < s.steps.length;

  const reset = (key: keyof typeof SCENARIOS) => {
    setScenario(key);
    setRevealed(1);
  };

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "color-mix(in srgb, #b45309 12%, transparent)",
              border: "1px solid color-mix(in srgb, #b45309 25%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={15} color="#b45309" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Agent ReAct Loop — step through reasoning
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>
              Watch an agent Think → Act → Observe until it has its answer
            </div>
          </div>
        </div>
        <button
          onClick={() => setRevealed(1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            fontSize: 11.5,
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          <RotateCw size={11} /> Reset
        </button>
      </div>

      {/* Scenario picker */}
      <div style={{ padding: "12px 18px 8px" }}>
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
          Scenario
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map((key) => (
            <button
              key={key}
              onClick={() => reset(key)}
              style={{
                padding: "6px 11px",
                fontSize: 12,
                background: scenario === key ? "color-mix(in srgb, #b45309 12%, transparent)" : "var(--bg-secondary)",
                color: scenario === key ? "#b45309" : "var(--text-secondary)",
                border: `1px solid ${scenario === key ? "#b45309" : "var(--border-subtle)"}`,
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: scenario === key ? 600 : 500,
                textTransform: "capitalize",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* User task */}
      <div style={{ padding: "10px 18px 8px" }}>
        <div
          style={{
            padding: "12px 14px",
            background: "var(--accent-light)",
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
            borderRadius: 10,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <MessageSquare size={14} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 3,
              }}
            >
              User task
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-primary)", lineHeight: 1.5, fontWeight: 500 }}>
              {s.task}
            </div>
          </div>
        </div>
      </div>

      {/* Iterations */}
      <div style={{ padding: "8px 18px 18px" }}>
        {visibleSteps.map((step, idx) => (
          <div key={idx}>
            <IterationCard step={step} totalSteps={s.steps.length} />
            {idx < visibleSteps.length - 1 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
                <ArrowDown size={16} color="var(--text-tertiary)" />
              </div>
            )}
          </div>
        ))}

        {canStep && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setRevealed((r) => r + 1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 18px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px color-mix(in srgb, var(--accent) 30%, transparent)",
              }}
            >
              Next iteration <ArrowDown size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function IterationCard({ step, totalSteps }: { step: Step; totalSteps: number }) {
  const isFinal = step.isFinal;

  return (
    <div
      style={{
        background: isFinal ? "color-mix(in srgb, var(--success) 5%, transparent)" : "var(--bg-secondary)",
        border: `1px solid ${isFinal ? "color-mix(in srgb, var(--success) 25%, transparent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-md)",
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: isFinal ? "var(--success)" : "var(--text-tertiary)",
          marginBottom: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {isFinal ? <CheckCircle2 size={11} /> : null}
        Iteration {step.iter} {isFinal && "— final answer"} of up to {totalSteps}
      </div>

      {/* Thought */}
      <Section
        Icon={Brain}
        color="#6366f1"
        label="Thought"
      >
        {step.thought}
      </Section>

      {/* Action */}
      {step.action && (
        <Section
          Icon={Wrench}
          color="#f59e0b"
          label="Action (tool call)"
          mono
        >
          {step.action}
        </Section>
      )}

      {/* Observation */}
      {step.observation && (
        <Section
          Icon={MessageSquare}
          color="#10b981"
          label="Observation (tool result)"
          mono
        >
          {step.observation}
        </Section>
      )}

      {isFinal && (
        <div
          style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "color-mix(in srgb, var(--success) 8%, transparent)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <CheckCircle2 size={12} />
          The agent decided no further tools are needed and produced the answer.
        </div>
      )}
    </div>
  );
}

function Section({
  Icon,
  color,
  label,
  mono,
  children,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 9, alignItems: "flex-start" }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <Icon size={11} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color,
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--text-primary)",
            lineHeight: 1.55,
            fontFamily: mono ? "var(--font-mono, monospace)" : "inherit",
            wordBreak: mono ? "break-all" : "normal",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
