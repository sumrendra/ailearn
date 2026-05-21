"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, RotateCcw, ChevronDown, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TOPICS = [
  { value: "llm-fundamentals", label: "LLM Fundamentals" },
  { value: "rag-systems", label: "RAG & Vector Systems" },
  { value: "ai-agents", label: "AI Agents & Tool Use" },
  { value: "prompt-engineering", label: "Prompt Engineering" },
  { value: "mlops", label: "MLOps & Production AI" },
  { value: "system-design", label: "AI System Design" },
  { value: "general", label: "General AI Engineering" },
];

const DIFFICULTIES = [
  { value: "BEGINNER", label: "Fresher / Junior", color: "var(--beginner)" },
  { value: "INTERMEDIATE", label: "Senior Engineer", color: "var(--intermediate)" },
  { value: "ADVANCED", label: "Staff / Principal", color: "var(--advanced)" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export function InterviewMode() {
  const [started, setStarted] = useState(false);
  const [topic, setTopic] = useState("general");
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);

    const initMsg = { role: "user" as const, content: `Start the interview. Topic: ${topic}, Difficulty: ${difficulty}`, id: crypto.randomUUID() };
    await sendToAPI([initMsg], true);
  };

  const sendToAPI = async (msgHistory: Message[], isInit = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgHistory.map((m) => ({ role: m.role, content: m.content })),
          topic: TOPICS.find((t) => t.value === topic)?.label,
          difficulty,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [...(isInit ? [] : prev), { role: "assistant", content: "", id: assistantId }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
              try {
                const delta = JSON.parse(line.slice(6)).delta?.text ?? "";
                fullContent += delta;
                setMessages((prev) =>
                  prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m)
                );
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant", content: "Connection error. Check your API key.", id: crypto.randomUUID(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    await sendToAPI([...messages, userMsg]);
  };

  if (!started) {
    return (
      <div>
        {/* Header */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", padding: "28px",
          boxShadow: "var(--shadow-sm)", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "var(--danger-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Mic size={22} color="var(--danger)" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>
                AI Engineering Interview Simulator
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>
                Practice with a senior AI engineer interviewer. Get scored feedback on every answer.
              </p>
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
              Interview topic
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
              {TOPICS.map((t) => (
                <div
                  key={t.value}
                  onClick={() => setTopic(t.value)}
                  style={{
                    padding: "10px 14px", borderRadius: "var(--radius-md)",
                    border: `1.5px solid ${topic === t.value ? "var(--accent)" : "var(--border-subtle)"}`,
                    background: topic === t.value ? "var(--accent-light)" : "var(--bg-secondary)",
                    color: topic === t.value ? "var(--accent)" : "var(--text-secondary)",
                    fontSize: 13, fontWeight: topic === t.value ? 500 : 400,
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
              Difficulty level
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {DIFFICULTIES.map((d) => (
                <div
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)", textAlign: "center",
                    border: `1.5px solid ${difficulty === d.value ? d.color : "var(--border-subtle)"}`,
                    background: difficulty === d.value ? d.color + "15" : "var(--bg-secondary)",
                    color: difficulty === d.value ? d.color : "var(--text-secondary)",
                    fontSize: 13, fontWeight: difficulty === d.value ? 500 : 400,
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            style={{
              width: "100%", padding: "14px",
              background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "var(--radius-md)",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Mic size={18} />
            Start interview session
          </button>
        </div>

        {/* Tips */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)", padding: "20px",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
            <Trophy size={14} style={{ display: "inline", marginRight: 6, color: "var(--xp-gold)" }} />
            Interview tips for Java engineers moving into AI
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Relate AI concepts to systems you know: RAG ≈ enriching requests before processing (like a Kafka consumer with enrichment)",
              "Use Spring AI or LangChain4j examples — shows you can apply AI in Java ecosystems",
              "For system design: always mention latency, cost, and scalability tradeoffs",
              "\"I don't know, but here's how I'd think about it\" scores better than guessing",
            ].map((tip, i) => (
              <li key={i} style={{
                fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                padding: "8px 12px", background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)", display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <span style={{ color: "var(--accent)", flexShrink: 0, fontWeight: 600 }}>{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 16, padding: "10px 16px",
        background: "var(--bg-card)", borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--danger)", boxShadow: "0 0 0 3px var(--danger-light)",
          animation: "pulse-soft 2s infinite",
        }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
          Interview in progress
        </span>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {TOPICS.find((t) => t.value === topic)?.label} · {DIFFICULTIES.find((d) => d.value === difficulty)?.label}
        </span>
        <button
          onClick={() => { setStarted(false); setMessages([]); }}
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "5px 10px",
            fontSize: 12, color: "var(--text-secondary)", cursor: "pointer",
          }}
        >
          <RotateCcw size={12} /> End session
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            padding: "14px 18px",
            background: msg.role === "user" ? "var(--accent-light)" : "var(--bg-card)",
            border: `1px solid ${msg.role === "user" ? "var(--accent)30" : "var(--border-subtle)"}`,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, color: msg.role === "user" ? "var(--accent)" : "var(--text-tertiary)" }}>
              {msg.role === "user" ? "You" : "Interviewer"}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)" }} className="prose">
              {msg.role === "user" ? (
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              )}
              {msg.content === "" && loading && (
                <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>Thinking...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)", padding: "12px 16px",
        display: "flex", alignItems: "flex-end", gap: 12,
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnswer(); } }}
          placeholder="Type your answer... (Shift+Enter for new line)"
          rows={2}
          style={{
            flex: 1, border: "none", outline: "none",
            background: "transparent", resize: "none", fontSize: 14,
            color: "var(--text-primary)", lineHeight: 1.6, fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleAnswer}
          disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: input.trim() && !loading ? "var(--accent)" : "var(--bg-tertiary)",
            border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Send size={15} color={input.trim() && !loading ? "#fff" : "var(--text-tertiary)"} />
        </button>
      </div>
    </div>
  );
}
