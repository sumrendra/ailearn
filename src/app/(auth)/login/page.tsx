"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

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

  const errorId = "login-error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}
    >
      {/* Brand mark */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.02,
            color: "var(--text-primary)",
            margin: 0,
            marginBottom: 10,
          }}
        >
          AILearn
        </h1>
        <span className="mono-overline">Premium technical learning</span>
      </div>

      {/* Form card */}
      <div
        className="glass-pane"
        style={{
          padding: "32px 28px",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 0 100px var(--accent-glow), var(--shadow-2xl)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mono-overline"
              style={{ marginBottom: 8, display: "block" }}
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <label
                htmlFor="login-password"
                className="mono-overline"
                style={{ display: "block" }}
              >
                Password
              </label>
              <Link href="/login" style={secondaryLinkStyle}>
                Forgot?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={revealButtonStyle}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: 12.5,
                color: "var(--danger)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em",
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <PrimaryButton loading={loading} label="Sign in" loadingLabel="Signing in…" />
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0 18px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--hairline-top)" }} />
          <span
            className="mono-overline"
            style={{ color: "var(--text-tertiary)" }}
          >
            or
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--hairline-top)" }} />
        </div>

        {/* Guest */}
        <button
          type="button"
          onClick={guestLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 20px",
            background: "transparent",
            border: "1px solid var(--border-default)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-overlay)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Continue as guest
        </button>
      </div>

      {/* Sign up link */}
      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 13,
          color: "var(--text-tertiary)",
        }}
      >
        No account?{" "}
        <Link href="/signup" style={secondaryLinkStyle}>
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}

/* ── styles & subcomponents ──────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  background: "var(--bg-sunken)",
  border: "1px solid var(--border-default)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  color: "var(--text-primary)",
  outline: "none",
  transition: "border-color 0.15s",
};

const revealButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-tertiary)",
  borderRadius: 6,
};

const secondaryLinkStyle: React.CSSProperties = {
  color: "var(--accent-text)",
  fontSize: 12.5,
  fontWeight: 500,
  textDecoration: "none",
  fontFamily: "var(--font-sans)",
};

function PrimaryButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "12px 20px",
        background: "var(--accent)",
        color: "var(--text-on-accent)",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        boxShadow: pressed
          ? "inset 0 2px 6px hsl(0 0% 0% / 0.25)"
          : hover
            ? "0 0 40px var(--accent-glow)"
            : "none",
        transition: pressed
          ? "box-shadow 80ms ease"
          : "box-shadow 0.2s ease, opacity 0.15s ease",
        marginTop: 4,
        fontFamily: "var(--font-sans)",
      }}
    >
      {loading ? (
        <span>{loadingLabel}</span>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}
