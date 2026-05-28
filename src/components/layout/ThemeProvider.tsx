"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
  toggle: () => void;   // backwards-compat with existing call sites
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "ailearn-theme";

function resolveSystem(): ResolvedTheme {
  // We are a drenched-dark-by-default product. When the user has selected
  // "system" we still default to dark — the design IS the dark experience.
  // Only honor `prefers-color-scheme: light` if the user has actively asked
  // for system AND their OS says light.
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitial(): Theme {
  // First-time visitors get dark, not system. This matches the redesigned
  // brand: dark is the front door, not an opt-in mode.
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const initial = getInitial();
    const resolved = initial === "system" ? resolveSystem() : initial;
    setThemeState(initial);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = resolveSystem();
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (t: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, t);
    const resolved = t === "system" ? resolveSystem() : t;
    setThemeState(t);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  };

  const toggle = () => setTheme(resolvedTheme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider — return dark
    // to match the SSR/no-JS-yet rendering of :root.
    return { theme: "dark", resolvedTheme: "dark", setTheme: () => {}, toggle: () => {} };
  }
  return ctx;
}
