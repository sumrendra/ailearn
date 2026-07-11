"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Grid3X3, Library, Headphones,
  ClipboardCheck, TrendingUp, Calendar,
} from "lucide-react";

const TABS = [
  { href: "/tcf", label: "Home", Icon: LayoutDashboard, exact: true },
  { href: "/tcf/learn", label: "Learn", Icon: BookOpen },
  { href: "/tcf/grammar", label: "Grammar", Icon: Grid3X3 },
  { href: "/tcf/vocabulary", label: "Vocabulary", Icon: Library },
  { href: "/tcf/listening", label: "Practice", Icon: Headphones, match: "/tcf/listening" },
  { href: "/tcf/mocks", label: "Mocks", Icon: ClipboardCheck },
  { href: "/tcf/progress", label: "Progress", Icon: TrendingUp },
  { href: "/tcf/plan", label: "Plan", Icon: Calendar },
];

export function TcfSubnav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        marginBottom: 28,
        padding: 4,
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {TABS.map(({ href, label, Icon, exact, match }) => {
        const active = exact
          ? pathname === href
          : match
            ? pathname.startsWith(match) || pathname.startsWith("/tcf/reading") || pathname.startsWith("/tcf/writing") || pathname.startsWith("/tcf/speaking")
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? "#be185d" : "var(--text-secondary)",
              background: active ? "rgba(190,24,93,0.12)" : "transparent",
              textDecoration: "none",
            }}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
