import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAllTcfUnits, getNextTcfUnit, getTcfProgramStats } from "@/lib/tcf-program";
import { GRAMMAR_TOPICS } from "@/lib/tcf-program/grammar-topics";
import { VOCAB_THEMES } from "@/lib/tcf-program/vocab-themes";
import { scoreToNclcListening, scoreToNclcProduction, scoreToNclcReading, weakestNclc } from "@/lib/tcf-program/nclc";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";
import { countDueFlashcards, getExamBandPercents, getVocabThemePercents } from "@/lib/tcf-program/vocab-progress";
import { EXAM_BAND_META } from "@/lib/content/tcf-exam-lexique";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  const units = getAllTcfUnits();
  const stats = getTcfProgramStats();

  if (!userId) {
    return Response.json({
      authed: false,
      stats,
      programPercent: 0,
      completedUnits: 0,
      totalUnits: units.length,
      nextUnit: units[0] ?? null,
      tracks: buildTrackProgress([], units),
      skills: defaultSkills(),
      profile: null,
    });
  }

  const [profile, completedRows, attempts] = await Promise.all([
    prisma.tcfProfile.findUnique({ where: { userId } }),
    prisma.lessonProgress.findMany({
      where: { userId, status: "COMPLETED", lessonSlug: { startsWith: "tcf-" } },
      select: { lessonSlug: true },
    }),
    prisma.tcfAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  const completedSlugs = new Set(completedRows.map((r) => r.lessonSlug));
  const completedCount = units.filter((u) => completedSlugs.has(u.slug)).length;
  const programPercent = Math.round((completedCount / units.length) * 100);

  const lastByModule = {
    listening: attempts.find((a) => a.module === "listening"),
    reading: attempts.find((a) => a.module === "reading"),
    writing: attempts.find((a) => a.module === "writing"),
    speaking: attempts.find((a) => a.module === "speaking"),
  };

  const skills = {
    listening: lastByModule.listening?.scoreNclc ?? 0,
    reading: lastByModule.reading?.scoreNclc ?? 0,
    writing: lastByModule.writing?.scoreNclc ?? 0,
    speaking: lastByModule.speaking?.scoreNclc ?? 0,
  };

  const weak = weakestNclc(skills);
  const target = profile?.targetNclc ?? 7;

  const lastCompleted = units.filter((u) => completedSlugs.has(u.slug)).pop();
  const nextUnit = getNextTcfUnit(lastCompleted?.slug) ?? units.find((u) => !completedSlugs.has(u.slug)) ?? null;

  const grammarMastery = GRAMMAR_TOPICS.map((t) => {
    const unitDone = t.unitSlug ? completedSlugs.has(t.unitSlug) : false;
    return {
      id: t.id,
      label: t.label,
      cefr: t.cefr,
      category: t.category,
      state: unitDone ? "mastered" : "available",
    };
  });

  const weeksRemaining = profile?.weeklyHours
    ? Math.ceil((stats.totalHours * (1 - programPercent / 100)) / profile.weeklyHours)
    : null;

  const [vocabPercents, bandPercents, vocabDue] = await Promise.all([
    getVocabThemePercents(userId),
    getExamBandPercents(userId),
    countDueFlashcards(userId),
  ]);

  return Response.json({
    authed: true,
    stats,
    programPercent,
    completedUnits: completedCount,
    totalUnits: units.length,
    weeksRemaining,
    nextUnit: nextUnit
      ? { slug: nextUnit.slug, title: nextUnit.title, trackId: nextUnit.trackId }
      : null,
    tracks: buildTrackProgress([...completedSlugs], units),
    skills: { ...skills, target, weakest: weak },
    grammarMastery,
    vocabThemes: VOCAB_THEMES.map((v) => ({
      ...v,
      percent: vocabPercents[v.id] ?? 0,
    })),
    examBands: EXAM_BAND_META.map((b) => ({
      ...b,
      percent: bandPercents[b.id] ?? 0,
    })),
    vocabDue,
    profile: profile ?? {
      targetNclc: 7,
      placementCefr: "A0",
      weeklyHours: 6,
      onboardingDone: false,
      roadmapPrefs: null,
    },
    practicePapers: {
      listening: PAPER_COUNT,
      reading: PAPER_COUNT,
      writing: PAPER_COUNT,
      speaking: PAPER_COUNT,
    },
    recentAttempts: attempts.slice(0, 5).map((a) => ({
      module: a.module,
      scoreNclc: a.scoreNclc,
      score699: a.score699,
      createdAt: a.createdAt,
    })),
  });
}

function defaultSkills() {
  return { listening: 0, reading: 0, writing: 0, speaking: 0, target: 7, weakest: { skill: "listening" as const, nclc: 0 } };
}

function buildTrackProgress(completedSlugs: string[], units: ReturnType<typeof getAllTcfUnits>) {
  const tracks = ["foundation", "bridge", "b2", "exam"] as const;
  return tracks.map((id) => {
    const trackUnits = units.filter((u) => u.trackId === id);
    const done = trackUnits.filter((u) => completedSlugs.includes(u.slug)).length;
    return {
      id,
      total: trackUnits.length,
      completed: done,
      percent: trackUnits.length ? Math.round((done / trackUnits.length) * 100) : 0,
    };
  });
}

export { scoreToNclcListening, scoreToNclcReading, scoreToNclcProduction };
