"use client";

import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const data = [
  { topic: "LLMs",      score: 0 },
  { topic: "RAG",       score: 0 },
  { topic: "Agents",    score: 0 },
  { topic: "Prompting", score: 0 },
  { topic: "Vectors",   score: 0 },
  { topic: "MLOps",     score: 0 },
];

const hasProgress = data.some((d) => d.score > 0);

export function TopicMasteryRadar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
        hasProgress ? (
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={data}>
              <PolarGrid stroke="var(--border-subtle)" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <Radar
                name="Mastery" dataKey="score"
                stroke="var(--accent)" fill="var(--accent)"
                fillOpacity={0.18} strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{
            height: 200, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center",
          }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                border: "1.5px dashed var(--border-default)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 55, height: 55, borderRadius: "50%",
                  border: "1.5px dashed var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-light)" }} />
                </div>
              </div>
              {["12", "4", "7", "9", "2", "6"].map((pos, i) => (
                <div key={i} style={{
                  position: "absolute", width: 6, height: 6, borderRadius: "50%",
                  background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
                  top: pos === "12" ? -3 : pos === "4" ? 28 : pos === "7" ? 97 : pos === "9" ? 97 : pos === "2" ? 28 : -3,
                  left: pos === "12" ? 47 : pos === "4" ? 97 : pos === "7" ? 72 : pos === "9" ? 22 : pos === "2" ? -3 : 22,
                }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>No progress yet</div>
              <Link href="/learn" style={{ textDecoration: "none", fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>
                Start a lesson <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )
      ) : (
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            border: "1.5px dashed var(--border-subtle)",
            animation: "pulse-soft 2s ease-in-out infinite",
          }} />
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
        {data.map((d) => (
          <div key={d.topic} style={{ flex: "1 1 45%", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: d.score > 50 ? "var(--success)" : d.score > 20 ? "var(--warning)" : "var(--border-default)",
            }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.topic}</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: "auto" }}>
              {d.score > 0 ? `${d.score}%` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
