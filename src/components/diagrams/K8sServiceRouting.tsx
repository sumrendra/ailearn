"use client";

import { useState } from "react";
import { Globe, Server, Box } from "lucide-react";

const TYPES = [
  {
    id: "clusterip",
    label: "ClusterIP",
    color: "#326ce5",
    reach: "Inside cluster only",
    flow: ["Pod A", "→", "Service VIP", "→", "Pod B, C, D"],
    when: "Default. Microservice-to-microservice traffic. Other pods call `http://orders.default.svc.cluster.local`.",
    gotcha: "Not reachable from outside the cluster without port-forward or Ingress.",
  },
  {
    id: "nodeport",
    label: "NodePort",
    color: "#7c3aed",
    reach: "Outside via <NodeIP>:30000–32767",
    flow: ["Internet", "→", "Node:30080", "→", "Service", "→", "Pods"],
    when: "Quick dev/demo access. Opens a high port on every node.",
    gotcha: "Not production-friendly — use LoadBalancer or Ingress instead.",
  },
  {
    id: "loadbalancer",
    label: "LoadBalancer",
    color: "#0f766e",
    reach: "Cloud LB → Service → Pods",
    flow: ["Internet", "→", "Cloud LB", "→", "Service", "→", "Pods"],
    when: "Managed cloud (EKS, GKE, AKS). Cloud provisions an external LB automatically.",
    gotcha: "Costs money per LB. Often pair with Ingress to share one LB across many services.",
  },
  {
    id: "ingress",
    label: "Ingress (+ Ingress Controller)",
    color: "#ea580c",
    reach: "HTTP/S routing by host/path",
    flow: ["Internet", "→", "Ingress", "→", "Service A or B", "→", "Pods"],
    when: "One entry point, many services. TLS termination, path-based routing (`/api` → api-svc).",
    gotcha: "Ingress is just rules — you need a controller (nginx, traefik, AWS ALB) to enforce them.",
  },
] as const;

/**
 * Service type picker with traffic-flow visualization.
 */
export function K8sServiceRouting() {
  const [active, setActive] = useState<string>("clusterip");
  const t = TYPES.find((x) => x.id === active) ?? TYPES[0];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        margin: "24px 0",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
        How traffic reaches your pods
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setActive(type.id)}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: `1px solid ${active === type.id ? type.color : "var(--border-subtle)"}`,
              background: active === type.id ? `${type.color}18` : "transparent",
              color: active === type.id ? type.color : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 16, padding: 14, borderRadius: 10, background: "var(--bg-subtle)" }}>
        {t.flow.map((node, i) =>
          node === "→" ? (
            <span key={i} style={{ color: t.color, fontWeight: 700 }}>→</span>
          ) : (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 6,
                border: `1px solid ${t.color}55`,
                background: `${t.color}12`,
                fontSize: 12,
                fontWeight: 600,
                color: t.color,
              }}
            >
              {node.includes("Internet") ? <Globe size={12} /> : node.includes("Pod") ? <Box size={12} /> : <Server size={12} />}
              {node}
            </span>
          ),
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, lineHeight: 1.5 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4, color: t.color }}>Reach: {t.reach}</div>
          <div style={{ color: "var(--text-secondary)" }}>{t.when}</div>
        </div>
        <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(220,38,38,0.08)", borderLeft: "3px solid var(--danger)" }}>
          <strong>Watch out:</strong> {t.gotcha}
        </div>
      </div>
    </div>
  );
}
