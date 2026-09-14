import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { TcfVocabularyHub } from "@/components/tcf/TcfVocabularyHub";

export default function TcfVocabularyPage() {
  return (
    <>
      <Topbar title="Vocabulary" subtitle="Lexique TCF Canada — bandes, packs interactifs, flashcards SM-2" />
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.55 }}>
          Les sujets TCF réutilisent les mêmes champs lexicaux. Choisissez une bande d&apos;examen, jouez un pack
          « match », puis verrouillez les mots en cartes.
        </p>
        <TcfVocabularyHub />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
          Connectez-vous pour sauvegarder la progression SM-2 sur le{" "}
          <Link href="/tcf" style={{ color: "var(--accent)" }}>
            tableau de bord TCF
          </Link>
          .
        </p>
      </div>
    </>
  );
}
