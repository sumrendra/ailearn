"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { TcfSubnav } from "@/components/tcf/TcfSubnav";
import { FlashcardDeck } from "@/components/practice/FlashcardDeck";
import { getCoreTopicCardCounts } from "@/lib/content/tcf-exam-lexique";
import { CORE_VOCAB_TOPICS, getCoreTopicMeta, isCoreVocabTopicId } from "@/lib/tcf-program/vocab-core-topics";

export default function TcfVocabCoreTopicPage() {
  const params = useParams();
  const topicId = String(params.topicId ?? "");
  const meta = isCoreVocabTopicId(topicId) ? getCoreTopicMeta(topicId) : undefined;
  const counts = getCoreTopicCardCounts();
  const count = isCoreVocabTopicId(topicId) ? counts[topicId] : 0;

  if (!meta || !count) {
    return (
      <>
        <Topbar title="Vocabulary" subtitle="Topic not found" />
        <p style={{ padding: 24 }}>
          <Link href="/tcf/vocabulary">← Back to TCF vocabulary</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Topbar title={meta.titleEn} subtitle={`${count} core words · ${meta.titleFr}`} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <TcfSubnav />
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 12 }}>{meta.blurbEn}</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
          Same core exam list as the main path — filtered by topic. French on the front, English on the back.{" "}
          <Link href="/tcf/vocabulary" style={{ color: "var(--accent)" }}>
            Back to word path
          </Link>
        </p>
        <FlashcardDeck coreTopicId={topicId} deckName={meta.titleEn} />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 24 }}>
          Other topics:{" "}
          {CORE_VOCAB_TOPICS.filter((t) => t.id !== topicId && counts[t.id] > 0)
            .slice(0, 4)
            .map((t, i, arr) => (
              <span key={t.id}>
                <Link href={`/tcf/vocabulary/topic/${t.id}`} style={{ color: "var(--text-secondary)" }}>
                  {t.titleEn}
                </Link>
                {i < arr.length - 1 ? " · " : null}
              </span>
            ))}
        </p>
      </div>
    </>
  );
}
