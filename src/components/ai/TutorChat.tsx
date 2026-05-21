"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, RotateCcw, Copy, Check } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const STARTER_PROMPTS = [
  "Explain RAG to me like I'm a Java developer who knows Kafka",
  "What's the difference between fine-tuning and prompt engineering?",
  "How does the attention mechanism work in transformers?",
  "What should I know about LLMs for a senior AI engineer interview?",
  "Compare pgvector vs Pinecone vs Weaviate for a Java backend",
];

export function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg: Message = { role: "user", content: userText, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.delta?.text ?? "";
                fullContent += delta;
                setMessages((prev) =>
                  prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m)
                );
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I hit an error. Make sure your ANTHROPIC_API_KEY is set in .env.local.",
        id: crypto.randomUUID(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", gap: 0 }}>
      {/* Empty state */}
      {messages.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={26} color="var(--accent)" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              Your AI tutor is ready
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.6 }}>
              Ask anything about AI engineering. I know you&apos;re a Java developer with Kafka & microservices experience — I&apos;ll frame everything in terms you already understand.
            </p>
          </div>

          {/* Starter prompts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 560 }}>
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                style={{
                  textAlign: "left", padding: "12px 16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14, color: "var(--text-primary)",
                  cursor: "pointer", lineHeight: 1.4,
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div style={{
          flex: 1, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 20,
          padding: "0 0 20px",
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start", gap: 12,
            }}>
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: msg.role === "user" ? "var(--accent-light)" : "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {msg.role === "user"
                  ? <User size={15} color="var(--accent)" />
                  : <Sparkles size={15} color="var(--accent)" />
                }
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: "75%",
                background: msg.role === "user" ? "var(--accent)" : "var(--bg-card)",
                color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                borderRadius: msg.role === "user"
                  ? "var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)"
                  : "var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
                padding: "12px 16px",
                border: msg.role === "user" ? "none" : "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
              }}>
                <div style={{
                  fontSize: 14, lineHeight: 1.7,
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {msg.content}
                  {msg.content === "" && loading && (
                    <span style={{ display: "inline-flex", gap: 3, marginLeft: 4, verticalAlign: "middle" }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: "var(--accent)",
                          animation: "pulse-soft 1.2s ease infinite",
                          animationDelay: `${i * 0.2}s`,
                          display: "inline-block",
                        }} />
                      ))}
                    </span>
                  )}
                </div>

                {msg.role === "assistant" && msg.content && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "transparent", border: "none",
                      cursor: "pointer", padding: 4, borderRadius: 6,
                      color: "var(--text-tertiary)",
                      opacity: 0.6,
                      transition: "opacity 0.12s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.6"; }}
                    title="Copy"
                  >
                    {copiedId === msg.id ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input area */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "12px 16px",
        display: "flex", alignItems: "flex-end", gap: 12,
        boxShadow: "var(--shadow-sm)",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about AI engineering... (Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1, border: "none", outline: "none",
            background: "transparent",
            resize: "none", fontSize: 14,
            color: "var(--text-primary)",
            lineHeight: 1.6,
            maxHeight: 160, overflowY: "auto",
            fontFamily: "inherit",
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 160) + "px";
          }}
        />

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 6, borderRadius: 8, color: "var(--text-tertiary)",
            }}
            title="Clear conversation"
          >
            <RotateCcw size={15} />
          </button>
        )}

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: input.trim() && !loading ? "var(--accent)" : "var(--bg-tertiary)",
            border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.12s",
          }}
        >
          <Send size={15} color={input.trim() && !loading ? "#fff" : "var(--text-tertiary)"} />
        </button>
      </div>
    </div>
  );
}
