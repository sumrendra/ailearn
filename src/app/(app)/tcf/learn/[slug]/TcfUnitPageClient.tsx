"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, ExternalLink } from "lucide-react";
import { LessonViewer } from "@/components/learn/LessonViewer";

interface UnitLesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  estimatedMins: number | null;
  xpReward: number | null;
}

interface Props {
  unit: {
    slug: string;
    title: string;
    content: string;
    estimatedMins: number;
    xpReward: number;
    tags: string[];
    practiceModule?: string;
    practiceHint?: string;
  };
  lessons: UnitLesson[];
  currentIdx: number;
  prevLesson: UnitLesson | null;
  nextLesson: UnitLesson | null;
  initialCompleted?: boolean;
  completedSlugs?: string[];
  isAuthed?: boolean;
}

export function TcfUnitPageClient({
  unit,
  lessons,
  currentIdx,
  prevLesson,
  nextLesson,
  initialCompleted = false,
  isAuthed = false,
}: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [unit.slug, initialCompleted]);

  useEffect(() => {
    document.documentElement.style.setProperty("--path-tint", "#be185d");
    return () => {
      document.documentElement.style.removeProperty("--path-tint");
    };
  }, []);

  const markComplete = async () => {
    if (completed || marking || !isAuthed) return;
    setMarking(true);
    setCompleted(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug: unit.slug, status: "COMPLETED" }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setCompleted(false);
    } finally {
      setMarking(false);
    }
  };

  const practiceHref =
    unit.practiceModule === "listening"
      ? "/tcf/listening"
      : unit.practiceModule === "reading"
        ? "/tcf/reading"
        : unit.practiceModule === "writing"
          ? "/tcf/writing"
          : unit.practiceModule === "speaking"
            ? "/tcf/speaking"
            : null;

  const practiceBlock = practiceHref ? (
    <div
      style={{
        marginTop: 32,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
        border: "1px solid rgba(190,24,93,0.3)",
        background: "rgba(190,24,93,0.06)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Practice time</div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.55 }}>
        {unit.practiceHint}
      </p>
      <Link
        href={practiceHref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#be185d",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Open practice module <ExternalLink size={14} />
      </Link>
    </div>
  ) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative" }}>
      <header
        className="glass-pane"
        style={{
          height: 56,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          zIndex: 20,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <Link
          href="/tcf/learn"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Lessons
        </Link>
        <span style={{ color: "var(--border-default)" }}>/</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#be185d",
            background: "rgba(190,24,93,0.12)",
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          TCF
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {unit.title}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
          {currentIdx + 1} / {lessons.length}
        </span>
        {isAuthed && (
          <button
            type="button"
            onClick={markComplete}
            disabled={completed || marking}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              background: completed ? "#10b981" : "#be185d",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: completed ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            {marking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {completed ? "Done" : "Complete"}
          </button>
        )}
      </header>

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <LessonViewer
          content={unit.content}
          lessonTitle={unit.title}
          lessonSlug={unit.slug}
          pathSlug="tcf-canada"
          pathName="TCF Canada"
          estimatedMins={unit.estimatedMins}
          xpReward={unit.xpReward}
          tags={unit.tags}
          lessonIndex={currentIdx}
          totalLessons={lessons.length}
          prevLesson={prevLesson ? { title: prevLesson.title, slug: prevLesson.slug } : null}
          nextLesson={nextLesson ? { title: nextLesson.title, slug: nextLesson.slug } : null}
          isCompleted={completed}
          onMarkComplete={isAuthed ? markComplete : undefined}
          marking={marking}
          lessonHrefPrefix="/tcf/learn"
          pathOverviewHref="/tcf"
          supplement={practiceBlock}
        />
      </div>
    </div>
  );
}
