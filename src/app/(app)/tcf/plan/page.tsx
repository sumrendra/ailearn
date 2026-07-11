import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { TcfRoadmap } from "@/components/tcf/TcfRoadmap";

export default function TcfPlanPage() {
  return (
    <>
      <Topbar title="Roadmap" subtitle="Phases, progress, and tutor vs self-study plan" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <TcfRoadmap />
      </div>
    </>
  );
}
