"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Something went wrong");
      return;
    }

    // Auto-login after signup
    const login = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (login?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/login");
    }
  }

  const inputStyle = {
    width: "100%", boxSizing: "border-box" as const,
    padding: "11px 14px 11px 42px",
    background: "var(--bg-sunken)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 10, fontSize: 14,
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6c47ff, #a78bff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 12px 32px rgba(108,71,255,0.35)",
          }}
        >
          <Brain size={28} color="#fff" />
        </motion.div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
          Start your AI learning journey
        </p>
      </div>

      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 20,
        border: "1px solid var(--border-subtle)",
        padding: "32px 28px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Name <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(optional)</span>
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} color="var(--text-tertiary)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="var(--text-tertiary)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border-subtle)"}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-tertiary)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                style={{ ...inputStyle, paddingRight: 42 }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border-subtle)"}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-tertiary)",
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: -8 }}>
              {[8, 12, 16].map((threshold, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 99,
                  background: password.length >= threshold
                    ? i === 0 ? "#f97316" : i === 1 ? "#eab308" : "#16a34a"
                    : "var(--border-subtle)",
                  transition: "background 0.2s",
                }} />
              ))}
              <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: 4, whiteSpace: "nowrap" }}>
                {password.length < 8 ? "Too short" : password.length < 12 ? "OK" : password.length < 16 ? "Good" : "Strong"}
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "10px 14px",
                background: "var(--danger-light)",
                border: "1px solid var(--danger)",
                borderRadius: 8,
                fontSize: 13, color: "var(--danger)", fontWeight: 500,
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px 20px",
              background: loading ? "var(--accent-2)" : "var(--accent)",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 20px rgba(108,71,255,0.35)",
              transition: "background 0.15s",
              marginTop: 4,
            }}
          >
            {loading ? "Creating account…" : <><span>Create account</span><ArrowRight size={16} /></>}
          </motion.button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-tertiary)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          Sign in →
        </Link>
      </p>
    </motion.div>
  );
}
