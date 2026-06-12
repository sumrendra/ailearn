import type { TCFListeningQuestion } from "./tcf-listening";
import type { TCFReadingQuestion } from "./tcf-reading";
import { TCF_LISTENING, estimateCLBFromListening } from "./tcf-listening";
import { TCF_READING, estimateCLBFromReading } from "./tcf-reading";
import { TCF_LISTENING_P2 } from "./tcf-listening-p2";
import { TCF_LISTENING_P3 } from "./tcf-listening-p3";
import { TCF_LISTENING_P4 } from "./tcf-listening-p4";
import { TCF_LISTENING_P5 } from "./tcf-listening-p5";
import { TCF_READING_P2 } from "./tcf-reading-p2";
import { TCF_READING_P3 } from "./tcf-reading-p3";
import { TCF_READING_P4 } from "./tcf-reading-p4";
import { TCF_READING_P5 } from "./tcf-reading-p5";

export type { TCFListeningQuestion, TCFReadingQuestion };
export { estimateCLBFromListening, estimateCLBFromReading };

export const LISTENING_PAPERS: Record<number, TCFListeningQuestion[]> = {
  1: TCF_LISTENING,
  2: TCF_LISTENING_P2,
  3: TCF_LISTENING_P3,
  4: TCF_LISTENING_P4,
  5: TCF_LISTENING_P5,
};

export const READING_PAPERS: Record<number, TCFReadingQuestion[]> = {
  1: TCF_READING,
  2: TCF_READING_P2,
  3: TCF_READING_P3,
  4: TCF_READING_P4,
  5: TCF_READING_P5,
};

export const PAPER_COUNT = 5;
