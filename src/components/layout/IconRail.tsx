"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  LogIn,
  ChevronRight,
  Zap,
  Flame,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

interface IconRailProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    xp?: number;
    level?: number;
    currentStreak?: number;
  } | null;
}

// ── Constants ────────────────────────────────────────────────────────────────

const RAIL_COLLAPSED = 64;
const RAIL_EXPANDED = 236;
const STORAGE_KEY = "ailearn-rail-open";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",  icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/learn",      icon: <BookOpen size={20} />,        label: "Learn" },
  { href: "/flashcards", icon: <CreditCard size={20} />,      label: "Flashcards" },
  { href: "/quiz",       icon: <Trophy size={20} />,          label: "Quiz" },
  { href: "/interview",  icon: <MessageSquare size={20} />,   label: "Interview Prep" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function IconRail({ user }: IconRailProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Persist open state
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setOpen(stored === "true");
    setMounted(true);
  }, []);

  function toggle() {
    setOpen(v => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  if (!mounted) {
    return <div style={{ width: RAIL_COLLAPSED, flexShrink: 0 }} />;
  }

  return (
    <>
      {/* Animated rail — frosted glass over the canvas mesh */}
      <motion.aside
        ref={railRef}
        className="glass-pane"
        initial={false}
        animate={{ width: open ? RAIL_EXPANDED : RAIL_COLLAPSED }}
        transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.8 }}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "none",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        {/* ── Logo + toggle ── */}
        <div
          className="hairline-b"
          style={{
            height: 60, flexShrink: 0,
            display: "flex", alignItems: "center",
            padding: "0 12px",
            gap: 10,
          }}
        >
          {/* Logo icon */}
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)",
              cursor: "pointer",
            }}
            onClick={toggle}
          >
            <Brain size={20} color="var(--text-on-accent)" />
          </motion.div>

          {/* Brand name */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                style={{ overflow: "hidden", flex: 1 }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                  AILearn
                </div>
                <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                  AI Engineering
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle chevron */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.button
                key="chevron"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggle}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", padding: 4, color: "var(--text-tertiary)",
                  borderRadius: 6,
                  display: "flex", alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronRight size={16} />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Nav items ── */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  className={active ? undefined : "glow-ring"}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: "relative",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--accent-text)" : "var(--text-secondary)",
                    outline: active ? "1px solid var(--accent)" : undefined,
                    outlineOffset: active ? "-1px" : undefined,
                    transition: `background 0.18s ${EASE}, color 0.18s ${EASE}, outline-color 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ flexShrink: 0, display: "flex" }}>
                    {item.icon}
                  </div>

                  <AnimatePresence mode="wait">
                    {open && (
                      <motion.span
                        key={item.label}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when collapsed */}
                  {!open && hovered === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: -6, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-pane"
                      style={{
                        position: "fixed",
                        left: RAIL_COLLAPSED + 10,
                        color: "var(--text-primary)",
                        padding: "6px 10px",
                        borderRadius: 7,
                        fontSize: 13, fontWeight: 600,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 100,
                      }}
                    >
                      {item.label}
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ── User stats strip (when expanded) ── */}
        <AnimatePresence>
          {open && user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="hairline-t"
              style={{
                margin: "0 8px 8px",
                padding: "10px 12px",
                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                borderRadius: 10,
                border: "1px solid color-mix(in srgb, var(--accent) 12%, transparent)",
              }}
            >
              <div style={{ display: "flex", gap: 12, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Zap size={13} color="var(--warning)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                    {(user.xp ?? 0).toLocaleString()} XP
                  </span>
                </div>
                {(user.currentStreak ?? 0) > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Flame size={13} color="var(--danger)" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                      {user.currentStreak}d
                    </span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 6 }}>
                <div
                  className="mono-overline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 9.5,
                    color: "var(--text-tertiary)",
                    marginBottom: 4,
                    letterSpacing: "0.14em",
                  }}
                >
                  <span>Lv {user.level ?? 1}</span>
                  <span>Lv {(user.level ?? 1) + 1}</span>
                </div>
                <div style={{ height: 4, background: "var(--bg-sunken)", borderRadius: 99, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((user.xp ?? 0) % 500) / 5}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: "var(--accent)", borderRadius: 99 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom user section ── */}
        <div
          className="hairline-t"
          style={{
            padding: "8px 8px 12px",
            display: "flex", flexDirection: "column", gap: 2,
          }}
        >
          {user ? (
            <>
              {/* Profile row */}
              <Link href="/settings" style={{ textDecoration: "none" }}>
                <div
                  className="glow-ring"
                  onMouseEnter={() => setHovered("settings")}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 10,
                    background: hovered === "settings" ? "var(--bg-overlay)" : "transparent",
                    transition: `background 0.18s ${EASE}, box-shadow 0.22s ${EASE}, outline-color 0.18s ${EASE}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "var(--text-on-accent)",
                  }}>
                    {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <AnimatePresence mode="wait">
                    {open && (
                      <motion.div
                        key="user-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.name ?? "You"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.email}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {open && <Settings size={14} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />}
                </div>
              </Link>

              {/* Sign out */}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="glow-ring"
                  onMouseEnter={() => setHovered("signout")}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "8px 12px", borderRadius: 10,
                    background: hovered === "signout"
                      ? "color-mix(in srgb, var(--danger) 8%, transparent)"
                      : "transparent",
                    border: "none", cursor: "pointer",
                    color: hovered === "signout" ? "var(--danger)" : "var(--text-tertiary)",
                    transition: `background 0.18s ${EASE}, color 0.18s ${EASE}, box-shadow 0.22s ${EASE}, outline-color 0.18s ${EASE}`,
                    textAlign: "left",
                  }}
                >
                  <LogOut size={18} style={{ flexShrink: 0 }} />
                  <AnimatePresence mode="wait">
                    {open && (
                      <motion.span
                        key="signout-label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}
                      >
                        Sign out
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </>
          ) : (
            /* Guest — sign in button */
            <Link href="/login" style={{ textDecoration: "none" }}>
              <div
                className="glow-ring"
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  background: hovered === "login"
                    ? "var(--accent-soft)"
                    : "color-mix(in srgb, var(--accent) 6%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
                  cursor: "pointer",
                  transition: `background 0.18s ${EASE}, box-shadow 0.22s ${EASE}, outline-color 0.18s ${EASE}`,
                  color: "var(--accent-text)",
                }}
              >
                <LogIn size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence mode="wait">
                  {open && (
                    <motion.span
                      key="login-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
                    >
                      Sign in / Register
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  );
}
