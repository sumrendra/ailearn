import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { TcfVocabularyHub } from "@/components/tcf/TcfVocabularyHub";

export default function TcfVocabularyPage() {
  return (
    <>
      <Topbar title="Vocabulary" subtitle="TCF Canada word path · progress tracked when signed in" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <TcfVocabularyHub />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 32 }}>
          Spaced repetition (SM-2) runs when you rate flashcards while signed in.{" "}
          <Link href="/tcf" style={{ color: "var(--accent)" }}>
            TCF dashboard
          </Link>
        </p>
      </div>
    </>
  );
}
