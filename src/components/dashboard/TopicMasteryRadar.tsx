"use client";

import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const data = [
  { topic: "LLMs",     score: 20 },
  { topic: "RAG",      score: 10 },
  { topic: "Agents",   score: 5  },
  { topic: "Prompting",score: 35 },
  { topic: "MLOps",    score: 10 },
  { topic: "Vectors",  score: 5  },
];

export function TopicMasteryRadar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: 4 }}>
        Topic mastery
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>
        Complete lessons to level up
      </div>

      {mounted ? (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border-subtle)" />
            <PolarAngleAxis
              dataKey="topic"
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            />
            <Radar
              name="Mastery"
              dataKey="score"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.18}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* Pulsing radar circular skeleton */}
          <div style={{
            width: 140, height: 140,
            borderRadius: "50%",
            border: "1.5px dashed var(--border-subtle)",
            animation: "pulse-soft 2s ease-in-out infinite",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: "50%",
              border: "1.5px dashed var(--border-subtle)",
            }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {data.map((d) => (
          <div key={d.topic} style={{ flex: "1 1 45%", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: d.score > 50 ? "var(--success)" : d.score > 20 ? "var(--warning)" : "var(--border-default)",
            }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.topic}</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: "auto" }}>{d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
