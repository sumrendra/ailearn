"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { VocabList } from "@/components/french/VocabList";
import { MatchQuiz } from "@/components/french/MatchQuiz";
import { contextPackMatchPairs, getContextPack } from "@/lib/content/tcf-exam-lexique";

export default function TcfVocabPackPage() {
  const params = useParams();
  const packId = String(params.packId ?? "");
  const pack = getContextPack(packId);

  if (!pack) {
    return (
      <>
        <Topbar title="Vocabulary" subtitle="Pack introuvable" />
        <p style={{ padding: 24 }}>
          <Link href="/tcf/vocabulary">← Retour</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Topbar title={pack.title} subtitle={pack.subtitle} />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
          Lisez l&apos;extrait, puis associez les mots. Ensuite, révisez en cartes.
        </p>
        <blockquote
          style={{
            margin: "16px 0 24px",
            padding: "16px 20px",
            borderLeft: "3px solid var(--accent)",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            fontStyle: "italic",
            lineHeight: 1.55,
          }}
        >
          {pack.excerptFr}
        </blockquote>
        <VocabList items={pack.items} title="Mots clés" />
        <MatchQuiz title="Associez FR ↔ EN" pairs={contextPackMatchPairs(pack)} />
        <div style={{ marginTop: 32 }}>
          <Link
            href={`/flashcards?pack=${pack.id}`}
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: 10,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Réviser en cartes ({pack.items.length})
          </Link>
        </div>
      </div>
    </>
  );
}
