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
  User,
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

  // Close on outside click (only when expanded)
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (railRef.current && !railRef.current.contains(e.target as Node)) {
        // Don't auto-close — let user control it
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!mounted) {
    return <div style={{ width: RAIL_COLLAPSED, flexShrink: 0 }} />;
  }

  return (
    <>
      {/* Animated rail */}
      <motion.aside
        ref={railRef}
        initial={false}
        animate={{ width: open ? RAIL_EXPANDED : RAIL_COLLAPSED }}
        transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.8 }}
        style={{
          position: "fixed",
          left: 0, top: 0, bottom: 0,
          zIndex: 50,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {/* ── Logo + toggle ── */}
        <div style={{
          height: 60, flexShrink: 0,
          display: "flex", alignItems: "center",
          padding: "0 12px",
          borderBottom: "1px solid var(--border-subtle)",
          gap: 10,
        }}>
          {/* Logo icon */}
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, #6c47ff, #a78bff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(108,71,255,0.3)",
              cursor: "pointer",
            }}
            onClick={toggle}
          >
            <Brain size={20} color="#fff" />
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
                <motion.div
                  onHoverStart={() => setHovered(item.href)}
                  onHoverEnd={() => setHovered(null)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    position: "relative",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: active
                      ? "var(--accent-light)"
                      : hovered === item.href
                        ? "var(--bg-sunken)"
                        : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    transition: "background 0.12s, color 0.12s",
                    overflow: "hidden",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Active indicator pill */}
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      style={{
                        position: "absolute", left: 0, top: "50%",
                        transform: "translateY(-50%)",
                        width: 3, height: 22, borderRadius: "0 3px 3px 0",
                        background: "var(--accent)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

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
                      style={{
                        position: "fixed",
                        left: RAIL_COLLAPSED + 10,
                        background: "#1a1a2e",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 7,
                        fontSize: 13, fontWeight: 600,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                        zIndex: 100,
                      }}
                    >
                      {item.label}
                      {/* Arrow */}
                      <div style={{
                        position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)",
                        width: 0, height: 0,
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderRight: "5px solid #1a1a2e",
                      }} />
                    </motion.div>
                  )}
                </motion.div>
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
              style={{
                margin: "0 8px 8px",
                padding: "10px 12px",
                background: "linear-gradient(135deg, rgba(108,71,255,0.08), rgba(167,139,255,0.05))",
                borderRadius: 10,
                border: "1px solid rgba(108,71,255,0.12)",
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Zap size={13} color="#eab308" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                    {(user.xp ?? 0).toLocaleString()} XP
                  </span>
                </div>
                {(user.currentStreak ?? 0) > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Flame size={13} color="#ef4444" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                      {user.currentStreak}d
                    </span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-tertiary)", marginBottom: 4 }}>
                  <span>Lv.{user.level ?? 1}</span>
                  <span>Lv.{(user.level ?? 1) + 1}</span>
                </div>
                <div style={{ height: 4, background: "rgba(0,0,0,0.1)", borderRadius: 99, overflow: "hidden" }}>
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
        <div style={{
          padding: "8px 8px 12px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {user ? (
            <>
              {/* Profile row */}
              <Link href="/settings" style={{ textDecoration: "none" }}>
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  onHoverStart={() => setHovered("settings")}
                  onHoverEnd={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 10,
                    background: hovered === "settings" ? "var(--bg-sunken)" : "transparent",
                    transition: "background 0.12s",
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #6c47ff, #a78bff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff",
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
                </motion.div>
              </Link>

              {/* Sign out */}
              <form action="/api/auth/signout" method="POST">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  onHoverStart={() => setHovered("signout")}
                  onHoverEnd={() => setHovered(null)}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "8px 12px", borderRadius: 10,
                    background: hovered === "signout" ? "rgba(220,38,38,0.06)" : "transparent",
                    border: "none", cursor: "pointer",
                    color: hovered === "signout" ? "var(--danger)" : "var(--text-tertiary)",
                    transition: "background 0.12s, color 0.12s",
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
                </motion.button>
              </form>
            </>
          ) : (
            /* Guest — sign in button */
            <Link href="/login" style={{ textDecoration: "none" }}>
              <motion.div
                whileTap={{ scale: 0.96 }}
                onHoverStart={() => setHovered("login")}
                onHoverEnd={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  background: hovered === "login"
                    ? "var(--accent-light)"
                    : "rgba(108,71,255,0.06)",
                  border: "1px solid rgba(108,71,255,0.15)",
                  cursor: "pointer", transition: "background 0.12s",
                  color: "var(--accent)",
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
              </motion.div>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Spacer so content doesn't hide behind rail */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ width: open ? RAIL_EXPANDED : RAIL_COLLAPSED }}
        transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.8 }}
        style={{ flexShrink: 0 }}
      />
    </>
  );
}
