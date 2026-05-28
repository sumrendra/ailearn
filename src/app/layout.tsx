import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/layout/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Instrument Serif — editorial display face paired with Inter for headings.
// Single weight (400) is intentional: this serif is built for large, airy
// chapter titles, not body text.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AILearn — Master AI Engineering",
  description: "Your personal AI learning platform. Learn LLMs, RAG, Agents, and more with interactive lessons, quizzes, and an AI tutor.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        {/* No-flash theme script. Runs before any paint, reads the saved
            preference from localStorage, and applies the right data-theme
            attribute. Without this, light-mode users see a dark→light flash
            because :root defaults to dark and ThemeProvider only runs after
            React hydrates. The script is small enough to inline; it must
            run synchronously, before <body> renders. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ailearn-theme');var r='dark';if(t==='light'||t==='dark'){r=t;}else if(t==='system'){r=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',r);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
