"use client";

import Link from "next/link";
import { Library } from "lucide-react";

export function TcfVocabMissionCard({
  vocabDue,
  weakestSkill,
}: {
  vocabDue: number;
  weakestSkill: string;
}) {
  const band =
    weakestSkill === "reading" || weakestSkill === "listening" ? "b" : weakestSkill === "writing" ? "c" : "b";

  return (
    <Link
      href={`/tcf/vocabulary/band/${band}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: 12,
        border: "1px solid rgba(190,24,93,0.35)",
        background: "linear-gradient(90deg, rgba(190,24,93,0.08), transparent)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ padding: 10, borderRadius: 10, background: "rgba(190,24,93,0.15)" }}>
        <Library size={22} color="#be185d" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#be185d" }}>Lexique TCF</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
          {vocabDue > 0
            ? `${vocabDue} cartes à réviser · cible bande ${band.toUpperCase()} (${weakestSkill})`
            : `Renforcer le vocabulaire — focus ${weakestSkill}`}
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#be185d" }}>Ouvrir →</span>
    </Link>
  );
}
