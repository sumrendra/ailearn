"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

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

  const errorId = "signup-error";
  const strengthId = "signup-password-strength";

  const strengthLabel =
    password.length === 0
      ? ""
      : password.length < 8
        ? "Too short"
        : password.length < 12
          ? "OK"
          : password.length < 16
            ? "Good"
            : "Strong";

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
        <span className="mono-overline">Start your craft</span>
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
          {/* Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="mono-overline"
              style={{ marginBottom: 8, display: "block" }}
            >
              Name <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="mono-overline"
              style={{ marginBottom: 8, display: "block" }}
            >
              Email
            </label>
            <input
              id="signup-email"
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
            <label
              htmlFor="signup-password"
              className="mono-overline"
              style={{ marginBottom: 8, display: "block" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="signup-password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                aria-invalid={!!error}
                aria-describedby={
                  [error ? errorId : null, password.length > 0 ? strengthId : null]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
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

            {/* Strength */}
            {password.length > 0 && (
              <div
                id={strengthId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {[8, 12, 16].map((threshold, i) => {
                  const met = password.length >= threshold;
                  const tones = [
                    "var(--warning)",
                    "var(--accent-text)",
                    "var(--success)",
                  ];
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 2,
                        borderRadius: 99,
                        background: met ? tones[i] : "var(--border-default)",
                        transition: "background 0.2s",
                      }}
                    />
                  );
                })}
                <span
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.02em",
                    marginLeft: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
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
          <PrimaryButton
            loading={loading}
            label="Create account"
            loadingLabel="Creating account…"
          />
        </form>
      </div>

      {/* Login link */}
      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 13,
          color: "var(--text-tertiary)",
        }}
      >
        Already have an account?{" "}
        <Link href="/login" style={secondaryLinkStyle}>
          Sign in
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
