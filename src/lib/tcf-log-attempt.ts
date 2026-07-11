/** Fire-and-forget log of a TCF practice attempt for the progress dashboard */
export function logTcfAttempt(payload: {
  module: string;
  paper?: number;
  scoreRaw?: number;
  scoreNclc?: number;
  score699?: number;
  durationSec?: number;
}) {
  void fetch("/api/tcf/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
