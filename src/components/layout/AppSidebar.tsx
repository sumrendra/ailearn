"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, FileText, MessageCircle, Trophy, Search,
  Sparkles, ChevronsLeft, Settings, LogIn, ListTree, Mic,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    xp?: number;
    level?: number;
    currentStreak?: number;
  } | null;
}

const NAV_ITEMS = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Dashboard", shortcut: "G D" },
  { href: "/learn",     Icon: BookOpen,        label: "Learn",     shortcut: "G L" },
  { href: "/lessons",   Icon: ListTree,        label: "All lessons", shortcut: "G A" },
  { href: "/flashcards", Icon: FileText,       label: "Flashcards", shortcut: "G F" },
  { href: "/quiz",      Icon: Trophy,          label: "Quizzes",    shortcut: "G Q" },
  { href: "/tutor",     Icon: MessageCircle,   label: "Tutor",      shortcut: "G T" },
  { href: "/interview", Icon: Mic,             label: "Interview",  shortcut: "G I" },
];

const STORAGE_KEY = "ailearn-sidebar-collapsed";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * App-level sidebar — frosted glass surface floating above the canvas mesh.
 * Uses `.glass-pane` so atmospheric mesh drifts visibly behind it; nav items
 * use `.glow-ring` on hover and an accent outline on active (no path-color
 * backgrounds; path identity stays ambient).
 */
export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Persist collapse state
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, mounted]);

  // Open command palette
  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("ailearn:open-palette"));
  };

  const width = collapsed ? 72 : 252;

  return (
    <aside
      className="glass-pane"
      style={{
        width,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        // Override .glass-pane's full border with a right-only hairline so the
        // pane reads as an edge of frosted material on the canvas.
        border: "none",
        borderRight: "1px solid var(--border-default)",
        transition: `width 0.24s ${EASE}`,
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 10,
          transition: `padding 0.24s ${EASE}`,
        }}
      >
        <Link
          href="/learn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text-primary)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg, var(--accent-hover), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 4px 12px color-mix(in srgb, var(--accent) 35%, transparent)`,
            }}
          >
            <Sparkles size={16} color="var(--text-on-accent)" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              AILearn
            </span>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "none",
              background: "transparent",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: `background 0.18s ${EASE}, color 0.18s ${EASE}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
            }}
          >
            <ChevronsLeft size={15} />
          </button>
        )}
      </div>

      {/* Search trigger (opens Cmd-K) */}
      <div style={{ padding: collapsed ? "0 12px 12px" : "0 12px 14px" }}>
        <button
          onClick={openPalette}
          aria-label="Search courses (⌘K)"
          title="Search courses (⌘K)"
          className="hairline-t"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "8px 0" : "9px 11px",
            background: "var(--bg-sunken)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 9,
            color: "var(--text-tertiary)",
            fontSize: 13,
            cursor: "pointer",
            transition: `background 0.18s ${EASE}, border-color 0.18s ${EASE}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-sunken)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Search size={13} />
            {!collapsed && <span>Search</span>}
          </span>
          {!collapsed && (
            <kbd
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                padding: "1px 5px",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV_ITEMS.map(({ href, Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={active ? undefined : "glow-ring"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "9px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                color: active ? "var(--accent-text)" : "var(--text-secondary)",
                background: active ? "var(--accent-soft)" : "transparent",
                outline: active ? "1px solid var(--accent)" : undefined,
                outlineOffset: active ? "-1px" : undefined,
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                transition: `background 0.18s ${EASE}, color 0.18s ${EASE}, outline-color 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
                position: "relative",
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User card / sign-in */}
      <div
        className="hairline-t"
        style={{ padding: collapsed ? "10px" : "12px" }}
      >
        {user ? (
          <UserCard user={user} collapsed={collapsed} />
        ) : (
          <Link
            href="/login"
            className="glow-ring"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              padding: collapsed ? "9px 0" : "10px 12px",
              background: "var(--accent)",
              color: "var(--text-on-accent)",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: `0 4px 12px color-mix(in srgb, var(--accent) 25%, transparent)`,
              transition: `background 0.18s ${EASE}, box-shadow 0.22s ${EASE}`,
            }}
          >
            <LogIn size={14} strokeWidth={2.5} />
            {!collapsed && <span>Sign in</span>}
          </Link>
        )}
      </div>

      {/* Bottom row — theme toggle + expand */}
      <div
        className="hairline-t"
        style={{
          padding: collapsed ? "10px" : "10px 12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-sunken)",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: `background 0.18s ${EASE}, color 0.18s ${EASE}`,
            }}
          >
            <ChevronsLeft size={14} style={{ transform: "rotate(180deg)" }} />
          </button>
        ) : (
          <>
            <ThemeToggle />
            <Link
              href="/settings"
              title="Settings"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-sunken)",
                color: "var(--text-tertiary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: `background 0.18s ${EASE}, color 0.18s ${EASE}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-overlay)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-sunken)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-tertiary)";
              }}
            >
              <Settings size={14} />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

function UserCard({
  user,
  collapsed,
}: {
  user: NonNullable<AppSidebarProps["user"]>;
  collapsed: boolean;
}) {
  const name = user.name ?? user.email?.split("@")[0] ?? "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: collapsed ? 0 : "4px",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          width: collapsed ? 36 : 34,
          height: collapsed ? 36 : 34,
          borderRadius: 999,
          background: "linear-gradient(135deg, var(--accent-hover), var(--accent))",
          color: "var(--text-on-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: `0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)`,
        }}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={name}
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        ) : initial}
      </div>
      {!collapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              display: "flex",
              gap: 8,
              alignItems: "baseline",
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span className="mono-overline" style={{ fontSize: 9.5, color: "var(--text-tertiary)" }}>
              Lv
            </span>
            <span>{user.level ?? 1}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span>{(user.xp ?? 0).toLocaleString()}</span>
            <span className="mono-overline" style={{ fontSize: 9.5, color: "var(--text-tertiary)" }}>
              XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
