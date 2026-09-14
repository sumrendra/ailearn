import type { TCFListeningQuestion } from "./tcf-listening";
import type { TCFReadingQuestion } from "./tcf-reading";
import type { WritingTask } from "./tcf-writing";
import type { SpeakingTask } from "./tcf-speaking";
import { TCF_LISTENING, estimateCLBFromListening } from "./tcf-listening";
import { TCF_READING, estimateCLBFromReading } from "./tcf-reading";
import { TCF_WRITING } from "./tcf-writing";
import { TCF_SPEAKING } from "./tcf-speaking";
import { TCF_LISTENING_P2 } from "./tcf-listening-p2";
import { TCF_LISTENING_P3 } from "./tcf-listening-p3";
import { TCF_LISTENING_P4 } from "./tcf-listening-p4";
import { TCF_LISTENING_P5 } from "./tcf-listening-p5";
import { TCF_READING_P2 } from "./tcf-reading-p2";
import { TCF_READING_P3 } from "./tcf-reading-p3";
import { TCF_READING_P4 } from "./tcf-reading-p4";
import { TCF_READING_P5 } from "./tcf-reading-p5";
import { TCF_WRITING_P2 } from "./tcf-writing-p2";
import { TCF_WRITING_P3 } from "./tcf-writing-p3";
import { TCF_WRITING_P4 } from "./tcf-writing-p4";
import { TCF_WRITING_P5 } from "./tcf-writing-p5";
import { TCF_SPEAKING_P2 } from "./tcf-speaking-p2";
import { TCF_SPEAKING_P3 } from "./tcf-speaking-p3";
import { TCF_SPEAKING_P4 } from "./tcf-speaking-p4";
import { TCF_SPEAKING_P5 } from "./tcf-speaking-p5";
import { TCF_LISTENING_P6 } from "./tcf-listening-p6";
import { TCF_LISTENING_P7 } from "./tcf-listening-p7";
import { TCF_READING_P6 } from "./tcf-reading-p6";
import { TCF_READING_P7 } from "./tcf-reading-p7";
import { TCF_WRITING_P6 } from "./tcf-writing-p6";
import { TCF_WRITING_P7 } from "./tcf-writing-p7";
import { TCF_SPEAKING_P6 } from "./tcf-speaking-p6";
import { TCF_SPEAKING_P7 } from "./tcf-speaking-p7";
import { normalizeMcqPaper } from "@/lib/tcf-program/normalize-mcq";

export type { TCFListeningQuestion, TCFReadingQuestion, WritingTask, SpeakingTask };
export { estimateCLBFromListening, estimateCLBFromReading };

export const LISTENING_PAPERS: Record<number, TCFListeningQuestion[]> = {
  1: normalizeMcqPaper(TCF_LISTENING),
  2: normalizeMcqPaper(TCF_LISTENING_P2),
  3: normalizeMcqPaper(TCF_LISTENING_P3),
  4: normalizeMcqPaper(TCF_LISTENING_P4),
  5: normalizeMcqPaper(TCF_LISTENING_P5),
  6: normalizeMcqPaper(TCF_LISTENING_P6),
  7: normalizeMcqPaper(TCF_LISTENING_P7),
};

export const READING_PAPERS: Record<number, TCFReadingQuestion[]> = {
  1: normalizeMcqPaper(TCF_READING),
  2: normalizeMcqPaper(TCF_READING_P2),
  3: normalizeMcqPaper(TCF_READING_P3),
  4: normalizeMcqPaper(TCF_READING_P4),
  5: normalizeMcqPaper(TCF_READING_P5),
  6: normalizeMcqPaper(TCF_READING_P6),
  7: normalizeMcqPaper(TCF_READING_P7),
};

export const WRITING_PAPERS: Record<number, WritingTask[]> = {
  1: TCF_WRITING,
  2: TCF_WRITING_P2,
  3: TCF_WRITING_P3,
  4: TCF_WRITING_P4,
  5: TCF_WRITING_P5,
  6: TCF_WRITING_P6,
  7: TCF_WRITING_P7,
};

export const SPEAKING_PAPERS: Record<number, SpeakingTask[]> = {
  1: TCF_SPEAKING,
  2: TCF_SPEAKING_P2,
  3: TCF_SPEAKING_P3,
  4: TCF_SPEAKING_P4,
  5: TCF_SPEAKING_P5,
  6: TCF_SPEAKING_P6,
  7: TCF_SPEAKING_P7,
};

export const PAPER_COUNT = 7;
