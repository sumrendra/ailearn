"use client";

import { useState } from "react";
import { Layers } from "lucide-react";

const ENVS = {
  dev: {
    label: "values-dev.yaml",
    color: "#7c3aed",
    yaml: `replicaCount: 1

image:
  repository: myregistry/api
  tag: dev
  pullPolicy: Always

resources:
  requests: { cpu: 100m, memory: 128Mi }
  limits:   { cpu: 250m, memory: 256Mi }

ingress:
  enabled: true
  host: api.dev.local`,
  },
  prod: {
    label: "values-prod.yaml",
    color: "#0f766e",
    yaml: `replicaCount: 3

image:
  repository: myregistry/api
  tag: "1.4.2"
  pullPolicy: IfNotPresent

resources:
  requests: { cpu: 250m, memory: 512Mi }
  limits:   { cpu: 500m, memory: 1Gi }

ingress:
  enabled: true
  host: api.mycompany.com
  tls: true`,
  },
} as const;

/**
 * Toggle dev vs prod Helm values — same chart, different overlays.
 */
export function HelmValuesCompare() {
  const [env, setEnv] = useState<keyof typeof ENVS>("dev");
  const current = ENVS[env];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 18,
        margin: "24px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Layers size={16} color="#326ce5" />
        <span style={{ fontWeight: 700, fontSize: 14 }}>Same chart — different values file</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {(Object.keys(ENVS) as (keyof typeof ENVS)[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setEnv(key)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${env === key ? ENVS[key].color : "var(--border-subtle)"}`,
              background: env === key ? `${ENVS[key].color}18` : "transparent",
              color: env === key ? ENVS[key].color : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "monospace" }}>
        helm upgrade --install api ./chart -f {current.label}
      </div>
      <pre
        style={{
          margin: 0,
          padding: 14,
          borderRadius: 10,
          background: "var(--bg-subtle)",
          border: `1px solid ${current.color}44`,
          fontSize: 12,
          lineHeight: 1.55,
          overflow: "auto",
        }}
      >
        {current.yaml}
      </pre>
      <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
        {env === "dev"
          ? "1 replica, dev tag, smaller limits — fast iteration."
          : "3 replicas, pinned semver tag, TLS ingress — production safe."}
      </p>
    </div>
  );
}
