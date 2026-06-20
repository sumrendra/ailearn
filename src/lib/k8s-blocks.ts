/**
 * Parser for Kubernetes lab checkpoint blocks in lesson markdown.
 *
 * ```k8s-checkpoint
 * step: 1
 * title: Start the cluster
 * command: minikube start --driver=docker
 * expect: Done! kubectl is now configured
 * hint: Docker Desktop must be running
 * ```
 */

export interface K8sCheckpointData {
  step: number;
  title: string;
  command: string;
  expect: string;
  hint?: string;
}

export function parseK8sCheckpoint(raw: string): K8sCheckpointData | null {
  const out: Partial<K8sCheckpointData> = {};
  const lines = raw.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = /^(\w+)\s*:\s*(.*)$/.exec(line.trim());
    if (!m) {
      i++;
      continue;
    }
    const [, key, valueRest] = m;
    if (key === "step") out.step = parseInt(valueRest.trim(), 10);
    else if (key === "title") out.title = valueRest.trim();
    else if (key === "command") out.command = valueRest.trim();
    else if (key === "hint") out.hint = valueRest.trim();
    else if (key === "expect") {
      if (valueRest.trim()) {
        out.expect = valueRest.trim();
      } else {
        const expectLines: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j];
          if (next.trim() && /^\w+\s*:/.test(next.trim()) && !next.startsWith(" ") && !next.startsWith("\t")) {
            break;
          }
          expectLines.push(next);
          j++;
        }
        out.expect = expectLines.join("\n").trim();
        i = j - 1;
      }
    }
    i++;
  }
  if (!out.step || !out.title || !out.command || !out.expect) return null;
  return out as K8sCheckpointData;
}
