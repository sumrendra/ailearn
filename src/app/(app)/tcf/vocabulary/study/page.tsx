"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";

export default function TcfVocabStudyPage() {
  return (
    <>
      <Topbar
        title="Study today"
        subtitle="Core exam words · reviews first, then new (daily cap)"
      />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 12 }}>
          Your queue mixes <strong>due reviews</strong> and <strong>new words</strong> from the main path (bands A–C).
          Progress saves when you rate each card (Again / Hard / Good / Easy).
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
          French on the front, English on the back.{" "}
          <Link href="/tcf/vocabulary" style={{ color: "var(--accent)" }}>
            Back to vocabulary hub
          </Link>
        </p>
        <FlashcardDeck studySession deckName="Core exam words · today" />
      </div>
    </>
  );
}
