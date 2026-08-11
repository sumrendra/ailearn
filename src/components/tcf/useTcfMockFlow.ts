"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PAPER_COUNT } from "@/lib/content/tcf-papers";
import {
  getMockSession,
  nextMockHref,
  recordMockScore,
  type MockModule,
  type MockModuleScore,
} from "@/lib/tcf-program/mock-session";

export function useTcfMockFlow(module: MockModule) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bootedRef = useRef(false);

  const isMock = searchParams.get("mock") === "1";
  const mockPaper = Math.min(PAPER_COUNT, Math.max(1, Number(searchParams.get("paper") ?? "1") || 1));
  const session = isMock ? getMockSession() : null;
  const seedParam = Number(searchParams.get("seed"));
  /** Exam mode draws from the whole bank; the seed keeps the sitting stable. */
  const mockSeed = isMock
    ? (Number.isFinite(seedParam) && seedParam > 0 ? seedParam : session?.seed ?? null)
    : null;

  const advanceMock = useCallback(
    (score: MockModuleScore) => {
      const updated = recordMockScore(module, score);
      if (updated) router.push(nextMockHref(updated));
    },
    [module, router],
  );

  return { isMock, mockPaper, mockSeed, session, advanceMock, bootedRef };
}

/** Call once on mount to skip paper select and enable exam mode for mock flow. */
export function useTcfMockAutoStart(
  isMock: boolean,
  mockPaper: number,
  bootedRef: MutableRefObject<boolean>,
  start: (paper: number, exam: boolean) => void,
) {
  useEffect(() => {
    if (!isMock || bootedRef.current) return;
    bootedRef.current = true;
    start(mockPaper, true);
  }, [isMock, mockPaper, bootedRef, start]);
}
