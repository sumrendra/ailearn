import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { TcfVocabularyHub } from "@/components/tcf/TcfVocabularyHub";

export default function TcfVocabularyPage() {
  return (
    <>
      <Topbar title="Vocabulary" subtitle="Lexique TCF — français d'abord, puis sens en anglais" />
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 80px" }}>
        <TcfSubnav />
        <TcfVocabularyHub />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 28 }}>
          Connectez-vous pour la révision espacée (SM-2).{" "}
          <Link href="/tcf" style={{ color: "var(--accent)" }}>
            Tableau de bord TCF
          </Link>
        </p>
      </div>
    </>
  );
}
