"use client";

import { Topbar } from "@/components/layout/Topbar";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <Topbar title="Settings" subtitle="App preferences and configuration" />
      <div style={{ padding: "24px", maxWidth: 620, width: "100%" }}>

        {/* Appearance */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
          boxShadow: "var(--shadow-sm)", marginBottom: 20,
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>Appearance</div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Choose your preferred colour mode</div>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", gap: 12 }}>
            {[
              { label: "Light", icon: <Sun size={18} />, value: "light" },
              { label: "Dark", icon: <Moon size={18} />, value: "dark" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { if (theme !== opt.value) toggle(); }}
                style={{
                  flex: 1, padding: "14px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  borderRadius: "var(--radius-md)", cursor: "pointer",
                  border: `2px solid ${theme === opt.value ? "var(--accent)" : "var(--border-subtle)"}`,
                  background: theme === opt.value ? "var(--accent-light)" : "var(--bg-secondary)",
                  color: theme === opt.value ? "var(--accent)" : "var(--text-secondary)",
                  transition: "all 0.12s",
                }}
              >
                {opt.icon}
                <span style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* API Keys info */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", overflow: "hidden",
          boxShadow: "var(--shadow-sm)", marginBottom: 20,
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>AI Configuration</div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>API keys are configured via environment variables</div>
          </div>
          <div style={{ padding: "20px 24px" }}>
            {[
              { label: "GEMINI_API_KEY", desc: "Primary AI provider (Google Gemini). Free tier available." },
              { label: "ANTHROPIC_API_KEY", desc: "Fallback AI provider (Claude). Used if Gemini is unavailable." },
            ].map((k) => (
              <div key={k.label} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "12px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}>
                <div style={{
                  fontFamily: "monospace", fontSize: 12,
                  background: "var(--bg-tertiary)", color: "var(--accent)",
                  padding: "3px 8px", borderRadius: 4,
                  flexShrink: 0, marginTop: 1,
                }}>
                  {k.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {k.desc}
                </div>
              </div>
            ))}
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 12, lineHeight: 1.5 }}>
              Set these in your <code style={{ fontSize: 11, background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 3 }}>.env.local</code> file (or Docker environment). Restart the app after changes.
            </p>
          </div>
        </div>

        {/* About */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", padding: "20px 24px",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>About AILearn</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Personal AI engineering learning platform. Built with Next.js 16, PostgreSQL, Prisma, and Claude/Gemini for AI features. Deployed on Portainer with a self-hosted PostgreSQL database.
          </div>
        </div>
      </div>
    </>
  );
}
