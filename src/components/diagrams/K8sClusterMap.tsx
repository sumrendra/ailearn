"use client";

import { useState } from "react";
import { Server, Database, GitBranch, Shield, Cpu } from "lucide-react";

const PARTS = [
  {
    id: "api",
    label: "API Server",
    Icon: Server,
    color: "#326ce5",
    oneLiner: "The front door — every kubectl command and controller talks here.",
    detail:
      "Validates requests, writes desired state to etcd, and is the only component that talks to etcd directly. Think of it as the cluster's REST API.",
  },
  {
    id: "etcd",
    label: "etcd",
    Icon: Database,
    color: "#0f766e",
    oneLiner: "The cluster's memory — all desired state lives here.",
    detail:
      "A distributed key-value store. If etcd is gone, the cluster loses its brain. Always run it with odd-numbered replicas (3 or 5) for quorum.",
  },
  {
    id: "scheduler",
    label: "Scheduler",
    Icon: GitBranch,
    color: "#7c3aed",
    oneLiner: "Picks which node runs each new pod.",
    detail:
      "Watches for unscheduled pods and scores nodes (CPU/memory fit, affinity, taints). It only decides WHERE — kubelet does the actual start.",
  },
  {
    id: "controller",
    label: "Controllers",
    Icon: Shield,
    color: "#dc2626",
    oneLiner: "Reconciliation loops — make reality match desired state.",
    detail:
      "Deployment controller keeps replica count. Node controller handles node health. Job controller finishes batch work. All watch etcd and act.",
  },
  {
    id: "kubelet",
    label: "Kubelet (per node)",
    Icon: Cpu,
    color: "#ea580c",
    oneLiner: "Agent on every worker — runs containers via the runtime.",
    detail:
      "Pulls images, starts/stops containers, reports pod status back to the API server. Also runs liveness/readiness probes you configure.",
  },
] as const;

/**
 * Clickable control-plane + worker map for K8s cluster anatomy lessons.
 */
export function K8sClusterMap() {
  const [active, setActive] = useState<string>("api");
  const current = PARTS.find((p) => p.id === active) ?? PARTS[0];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        margin: "24px 0",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
        Cluster anatomy — tap a part
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div>
          <div
            style={{
              border: "1px dashed var(--border-subtle)",
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              background: "rgba(50,108,229,0.06)",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "#326ce5", marginBottom: 8, letterSpacing: "0.06em" }}>
              CONTROL PLANE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PARTS.filter((p) => p.id !== "kubelet").map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: `1px solid ${active === p.id ? p.color : "var(--border-subtle)"}`,
                    background: active === p.id ? `${p.color}22` : "var(--bg-elevated)",
                    color: active === p.id ? p.color : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <p.Icon size={13} /> {p.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px dashed var(--border-subtle)",
              borderRadius: 12,
              padding: 14,
              background: "rgba(234,88,12,0.05)",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "#ea580c", marginBottom: 8, letterSpacing: "0.06em" }}>
              WORKER NODES × N
            </div>
            <button
              type="button"
              onClick={() => setActive("kubelet")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${active === "kubelet" ? "#ea580c" : "var(--border-subtle)"}`,
                background: active === "kubelet" ? "rgba(234,88,12,0.15)" : "var(--bg-elevated)",
                color: active === "kubelet" ? "#ea580c" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Cpu size={13} /> Kubelet + container runtime
            </button>
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 6,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "var(--text-muted)",
                  }}
                >
                  Pod
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: `1px solid ${current.color}44`,
            background: `${current.color}0d`,
            minHeight: 160,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <current.Icon size={18} color={current.color} />
            <span style={{ fontWeight: 700, fontSize: 15, color: current.color }}>{current.label}</span>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, lineHeight: 1.45 }}>{current.oneLiner}</p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{current.detail}</p>
        </div>
      </div>
    </div>
  );
}
