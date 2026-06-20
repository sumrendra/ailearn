import path from "node:path";
import fs from "node:fs";

export const TCF_LISTENING_NAMESPACE = "tcf-listening";

export const TCF_LISTENING_VOICES: Record<string, string> = {
  A1: "fr-CA-SylvieNeural",
  A2: "fr-CA-SylvieNeural",
  B1: "fr-FR-DeniseNeural",
  B2: "fr-FR-HenriNeural",
  C1: "fr-FR-DeniseNeural",
  C2: "fr-FR-HenriNeural",
};

/** Relative path under AUDIO_ROOT (e.g. `tcf/p1/q00.mp3`). */
export function tcfListeningStoragePath(paper: number, questionIndex: number): string {
  const q = String(questionIndex).padStart(2, "0");
  return `tcf/p${paper}/q${q}.mp3`;
}

/** Container default; local dev can set AUDIO_ROOT to project `data` parent. */
export function getAudioRoot(): string {
  return process.env.AUDIO_ROOT ?? "/data/audio";
}

export function resolveAudioFile(storagePath: string): string {
  const canonical = path.join(getAudioRoot(), storagePath);
  if (fs.existsSync(canonical)) return canonical;

  // Local dev: files under data/tcf-audio/p{N}/ (storagePath is tcf/p{N}/…)
  const devPath = path.join(
    process.cwd(),
    "data/tcf-audio",
    storagePath.replace(/^tcf\//, ""),
  );
  if (fs.existsSync(devPath)) return devPath;

  return canonical;
}

/** Local generate output dirs (legacy `tcf-audio`, canonical `tcf`). */
export function localListeningMp3Path(paper: number, questionIndex: number): string {
  const q = String(questionIndex).padStart(2, "0");
  const rel = `p${paper}/q${q}.mp3`;
  const cwd = process.cwd();
  return path.join(cwd, "data", "tcf-audio", rel);
}
