"use client";

import { Topbar } from "@/components/layout/Topbar";
import { TutorChat } from "@/components/ai/TutorChat";

export default function TutorPage() {
  return (
    <>
      <Topbar
        title="AI Tutor"
        subtitle="Powered by Claude · Context-aware · Answers in Java-developer terms"
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", maxWidth: 900, width: "100%" }}>
        <TutorChat />
      </div>
    </>
  );
}
