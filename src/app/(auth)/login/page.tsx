"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  }

  async function guestLogin() {
    router.push("/dashboard");
  }

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
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
          Sign in to track your progress
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 20,
        border: "1px solid var(--border-subtle)",
        padding: "32px 28px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 14px 11px 42px",
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10, fontSize: 14,
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
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
                placeholder="••••••••"
                required
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 42px 11px 42px",
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10, fontSize: 14,
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
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

          {/* Submit */}
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
            {loading ? "Signing in…" : <><span>Sign in</span><ArrowRight size={16} /></>}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        {/* Guest */}
        <motion.button
          onClick={guestLogin}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 20px",
            background: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: "var(--text-secondary)", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-sunken)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Continue as guest
        </motion.button>
      </div>

      {/* Sign up link */}
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-tertiary)" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          Create one free →
        </Link>
      </p>
    </motion.div>
  );
}
