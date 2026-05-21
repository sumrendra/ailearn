"use client";

import { useState, useEffect } from "react";

const WEEKS = 26;
const DAYS = 7;

function generateMockData() {
  const cells: { date: string; count: number }[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (DAYS - 1 - d)));
      // Sparse activity — mostly 0
      const rand = Math.random();
      const count = rand > 0.78 ? Math.floor(Math.random() * 4) + 1 : 0;
      cells.push({ date: date.toISOString().slice(0, 10), count });
    }
  }
  return cells;
}

function generateBlankData() {
  const cells: { date: string; count: number }[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (DAYS - 1 - d)));
      cells.push({ date: date.toISOString().slice(0, 10), count: 0 });
    }
  }
  return cells;
}

function cellColor(count: number): string {
  if (count === 0) return "var(--bg-tertiary)";
  if (count === 1) return "#c4b5fd";
  if (count === 2) return "#a78bfa";
  if (count === 3) return "#8b5cf6";
  return "#6c47ff";
}

const dayLabels = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ActivityHeatmap() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const activeData = data.length > 0 ? data : generateBlankData();

  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < WEEKS; i++) {
    weeks.push(activeData.slice(i * DAYS, i * DAYS + DAYS));
  }

  // Get month labels positions
  const monthMarkers: { label: string; weekIdx: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const month = new Date(week[0].date).getMonth();
    if (month !== lastMonth) {
      monthMarkers.push({ label: monthLabels[month], weekIdx: wi });
      lastMonth = month;
    }
  });

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-subtle)",
      padding: "20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>
            Learning activity
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Last 6 months
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Less</span>
          {[0, 1, 2, 3, 4].map((n) => (
            <div key={n} style={{
              width: 11, height: 11,
              background: cellColor(n),
              borderRadius: 2,
            }} />
          ))}
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>More</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 20, flexShrink: 0 }}>
          {dayLabels.map((label, i) => (
            <div key={i} style={{ height: 11, fontSize: 9, color: "var(--text-tertiary)", lineHeight: "11px" }}>
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowX: "auto" }}>
          {/* Month labels */}
          <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 0 }}>
            {weeks.map((_, wi) => {
              const marker = monthMarkers.find((m) => m.weekIdx === wi);
              return (
                <div key={wi} style={{ width: 11, flexShrink: 0, fontSize: 9, color: "var(--text-tertiary)", overflow: "visible", whiteSpace: "nowrap" }}>
                  {marker ? marker.label : ""}
                </div>
              );
            })}
          </div>

          {/* Cells */}
          <div style={{ display: "flex", gap: 3 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((cell, di) => (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.count} session${cell.count !== 1 ? "s" : ""}`}
                    style={{
                      width: 11, height: 11,
                      background: cellColor(cell.count),
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.4)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
