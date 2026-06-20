"use client";

import { useState } from "react";
import { Box, Layers, Copy, ArrowRight } from "lucide-react";

const LAYERS = [
  {
    id: "pod",
    label: "Pod",
    Icon: Box,
    color: "#326ce5",
    yaml: `apiVersion: v1
kind: Pod
metadata:
  name: api-7f3k2
spec:
  containers:
  - name: app
    image: myapp:1.2.0`,
    explain: "Smallest deployable unit. One or more containers sharing network + volumes. Ephemeral — if it dies, it's gone unless something recreates it.",
    interview: "Why not deploy bare Pods? Because they don't self-heal. You want a controller above them.",
  },
  {
    id: "deployment",
    label: "Deployment",
    Icon: Layers,
    color: "#7c3aed",
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
      - name: app
        image: myapp:1.2.0`,
    explain: "Declares desired replica count + pod template. Handles rolling updates and rollbacks. Creates/manages ReplicaSets under the hood.",
    interview: "Deployment → ReplicaSet → Pod. You almost never touch ReplicaSet directly.",
  },
  {
    id: "service",
    label: "Service",
    Icon: Copy,
    color: "#0f766e",
    yaml: `apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP`,
    explain: "Stable DNS name + virtual IP in front of a dynamic set of pods. kube-proxy load-balances to healthy pod IPs matching the selector.",
    interview: "Pods come and go; Services give clients a stable address. Match labels on Service selector = Pod labels.",
  },
] as const;

/**
 * Step-through Pod → Deployment → Service with mini YAML snippets.
 */
export function K8sWorkloadStack() {
  const [step, setStep] = useState(0);
  const layer = LAYERS[step];

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
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
        Workload stack — step {step + 1} of 3
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {LAYERS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setStep(i)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 999,
              border: `1px solid ${step === i ? l.color : "var(--border-subtle)"}`,
              background: step === i ? `${l.color}18` : "transparent",
              color: step === i ? l.color : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <l.Icon size={14} /> {l.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <pre
          style={{
            margin: 0,
            padding: 14,
            borderRadius: 10,
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            fontSize: 11.5,
            lineHeight: 1.5,
            overflow: "auto",
            color: "var(--text-secondary)",
          }}
        >
          {layer.yaml}
        </pre>
        <div>
          <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.5 }}>{layer.explain}</p>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              borderLeft: `3px solid ${layer.color}`,
              background: `${layer.color}10`,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: layer.color }}>Interview tip:</strong> {layer.interview}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
            background: "transparent",
            opacity: step === 0 ? 0.4 : 1,
            cursor: step === 0 ? "default" : "pointer",
            fontSize: 13,
          }}
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === LAYERS.length - 1}
          onClick={() => setStep((s) => s + 1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: layer.color,
            color: "#fff",
            opacity: step === LAYERS.length - 1 ? 0.4 : 1,
            cursor: step === LAYERS.length - 1 ? "default" : "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Next <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
