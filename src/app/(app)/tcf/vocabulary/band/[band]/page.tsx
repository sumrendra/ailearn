"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";
import { EXAM_BAND_META, type TcfExamBand } from "@/lib/content/tcf-exam-lexique";

const VALID: TcfExamBand[] = ["a", "b", "c"];

export default function TcfVocabBandPage() {
  const params = useParams();
  const band = String(params.band ?? "") as TcfExamBand;
  const meta = EXAM_BAND_META.find((b) => b.id === band);

  if (!VALID.includes(band) || !meta) {
    return (
      <>
        <Topbar title="Vocabulary" subtitle="Bande introuvable" />
        <p style={{ padding: 24 }}>
          <Link href="/tcf/vocabulary">← Retour au vocabulaire TCF</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Topbar title={meta.title} subtitle={`${meta.count} mots · ${meta.cefr} · aligné Q${band === "a" ? "1–10" : band === "b" ? "11–29" : "30–39"}`} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 20 }}>{meta.blurb}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
          Les cartes sont triées par échéance si vous êtes connecté.{" "}
          <Link href="/tcf/vocabulary" style={{ color: "var(--accent)" }}>Autres bandes et packs</Link>
        </p>
        <FlashcardDeck bandId={band} deckName={meta.title} />
      </div>
    </>
  );
}
