import { Topbar } from "@/components/layout/Topbar";
import { InterviewMode } from "@/components/ai/InterviewMode";

export default function InterviewPage() {
  return (
    <>
      <Topbar
        title="Mock Interview"
        subtitle="AI interviewer · Real questions · Scored feedback"
      />
      <div style={{ padding: "24px", maxWidth: 860, width: "100%" }}>
        <InterviewMode />
      </div>
    </>
  );
}
