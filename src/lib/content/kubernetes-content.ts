/* eslint-disable no-irregular-whitespace */
/**
 * Kubernetes & Infra — 6 lessons. Visual, concise, interview + production ready.
 */

export const K8S_L1 = `# Containers → Why Kubernetes?

You already run apps in Docker. So why add Kubernetes?

## The problem Docker alone can't solve

A single container on one machine is easy. **Ten services across fifty machines** is not:

| Pain | What breaks |
|------|-------------|
| A container dies | Who restarts it? |
| Traffic spikes | Who adds more copies? |
| New version deploy | How do you roll out without downtime? |
| Service A needs B | How does A find B's IP when B keeps moving? |
| Secrets & config | How do you inject them safely per environment? |

Docker Compose solves this **on one machine**. Kubernetes solves it **across a fleet**.

## One sentence mental model

> **Kubernetes is a control system that keeps your containers running the way you declared — on whatever machines have capacity.**

You write *desired state* (3 replicas of \`myapp:2.0\`). Controllers continuously reconcile reality to match.

## Container → Image → Pod

| Term | Plain English |
|------|---------------|
| **Image** | Frozen recipe (layers on disk) — \`nginx:1.25\` |
| **Container** | A running instance of an image |
| **Pod** | K8s wrapper: 1+ containers sharing IP + volumes |

Pods are **disposable**. Don't treat them like pets. If it crashes, K8s makes a new one.

## When you actually need K8s

| Situation | K8s? |
|-----------|------|
| Side project, 1 server | **No** — Docker Compose or a PaaS |
| 3–5 services, small team, one cloud VM | **Maybe** — managed K8s or simpler PaaS |
| Many services, autoscaling, zero-downtime deploys | **Yes** |
| Interview for backend/platform role | **Yes** — know the concepts even if you haven't operated a cluster |

## The 30-second interview answer

*"Kubernetes orchestrates containers across nodes. I declare desired state in YAML — Deployments keep replica count, Services give stable networking, and the control plane schedules pods onto healthy nodes. It's reconciliation loops, not magic."*

\`\`\`java-quiz
level: easy
q: Your team runs 4 microservices on one VM with Docker Compose. Traffic is steady, team is 3 engineers. A manager says "let's move to Kubernetes." Best response?
options: Great idea, K8s is always better | Push back — ops overhead likely isn't worth it yet; Compose is fine until you need multi-node scaling or HA | Use Kubernetes locally only | Rewrite everything in Go first
correct: 1
explain: K8s shines at fleet scale: multi-node scheduling, self-healing across machines, rolling deploys at scale. For a small stable workload on one VM, you inherit complexity without the benefits. Adopt K8s when pain justifies it, not because it's fashionable.
\`\`\`

**Next:** What's actually inside a cluster?
`;

export const K8S_L2 = `# Cluster anatomy — the moving parts

Forget the 50-component diagram. You need **five things** and how they talk.

\`\`\`diagram-k8s-cluster
\`\`\`

## kubectl — your remote control

Every command hits the **API server**. It never talks to nodes directly.

| Command | What it does |
|---------|--------------|
| \`kubectl get pods\` | Read current state |
| \`kubectl apply -f deploy.yaml\` | Create/update desired state |
| \`kubectl describe pod x\` | Events + why something's stuck |
| \`kubectl logs pod x\` | Container stdout |
| \`kubectl exec -it pod x -- sh\` | Shell into a running container |

**Namespaces** = virtual clusters inside one physical cluster. Separate \`dev\` / \`staging\` / \`prod\` or team boundaries.

## The reconciliation loop (this wins interviews)

\`\`\`
1. You:  "I want 3 replicas of api:v2"  →  API server  →  etcd
2. Deployment controller sees: actual=1, desired=3
3. Controller creates 2 more Pods
4. Scheduler assigns each Pod to a node
5. Kubelet on that node pulls image, starts container
6. Repeat forever — if a Pod dies, controller recreates it
\`\`\`

**Declarative ops:** you never say "start container on node-2." You say what you want; the system figures out how.

\`\`\`java-quiz
level: tricky
q: etcd becomes read-only because disk is full. What happens to your running pods?
options: All pods stop immediately | Running pods keep running, but no new scheduling or config changes work — cluster is frozen | Kubernetes auto-scales etcd | Only the API server restarts
correct: 1
explain: etcd is the source of truth. Running containers on nodes are already started. But nothing new can be scheduled, Deployments can't scale, and config updates won't apply. etcd backups and disk alerts are non-negotiable in production.
\`\`\`

**Next:** Pods, Deployments, and labels.
`;

export const K8S_L3 = `# Workloads — Pod, Deployment, Service

The stack you'll use 95% of the time:

\`\`\`diagram-k8s-workloads
\`\`\`

## Labels & selectors — the glue

\`\`\`yaml
labels: { app: api, tier: backend }   # on pods
selector:
  app: api                            # on Service
\`\`\`

No matching labels → Service sends traffic nowhere. #1 "connection refused" bug.

## Rolling updates

\`\`\`
Before:  [v1] [v1] [v1]
Step 1:  [v2] [v1] [v1]   ← wait until v2 passes readiness
Step 2:  [v2] [v2] [v1]
Step 3:  [v2] [v2] [v2]
\`\`\`

| Probe | Question |
|-------|----------|
| **readiness** | Should this pod get traffic? |
| **liveness** | Is this pod stuck and need restart? |
| **startup** | Has slow-starting app finished booting? |

> **Rule:** Liveness = minimal ("process up"). Readiness = includes dependencies (DB). Mixing them causes restart loops during DB blips.

## Resource kinds cheat sheet

| Kind | Use for |
|------|---------|
| **Deployment** | Stateless APIs, web servers |
| **StatefulSet** | Stable identity — databases, Kafka |
| **DaemonSet** | One pod per node — log agents |
| **Job / CronJob** | Batch / scheduled work |

\`\`\`java-quiz
level: medium
q: You deploy api:v2 but traffic still hits v1. kubectl get pods shows 3 Running v2 pods. Most likely cause?
options: Rolling update is broken | Service selector mismatch or v2 pods fail readiness so endpoints are empty | Need to restart etcd | Image pull policy is Always
correct: 1
explain: Running ≠ receiving traffic. Check endpoints (kubectl get endpoints api), readiness probe, and label selectors. Pod phase Running only means the container started.
\`\`\`

**Next:** Networking — Services and Ingress.
`;

export const K8S_L4 = `# Networking — Services & Ingress

Pods get ephemeral IPs. **Services** give stable addresses. **Ingress** routes HTTP from outside.

\`\`\`diagram-k8s-routing
\`\`\`

## DNS inside the cluster

\`\`\`
<service>.<namespace>.svc.cluster.local
\`\`\`

Call \`http://orders:80\` from another pod → resolves to Service ClusterIP → kube-proxy forwards to a healthy pod.

## Ingress in 20 seconds

Ingress rules map host/path → Service. You still need an **Ingress Controller** (nginx, Traefik, ALB) to enforce them. Ingress alone does nothing.

## Production checklist

- ClusterIP for internal traffic
- One Ingress for external HTTP/S + TLS
- Readiness probes so bad pods leave the pool
- NetworkPolicy for sensitive namespaces (requires Calico/Cilium)

\`\`\`java-quiz
level: tricky
q: Two pods in the same namespace can't connect. Service exists, endpoints look correct. What next?
options: Restart API server | DNS from inside pod, then NetworkPolicy, then app binding on 0.0.0.0 not 127.0.0.1 | Delete namespace | Change to LoadBalancer
correct: 1
explain: Work the stack: DNS → endpoints → NetworkPolicy → app listening on localhost only → port mismatch. Methodical beats guessing.
\`\`\`

**Next:** Config, secrets, resource limits.
`;

export const K8S_L5 = `# Config, secrets & resource limits

## ConfigMap vs Secret

| | ConfigMap | Secret |
|---|-----------|--------|
| **For** | Non-sensitive config | Passwords, tokens, certs |
| **In etcd** | Plaintext | Base64 — **not encrypted by default** |

Production: enable etcd encryption at rest, or sync from Vault / AWS Secrets Manager.

## Requests & limits

\`\`\`yaml
resources:
  requests: { cpu: "250m", memory: "256Mi" }  # scheduling
  limits:   { cpu: "500m", memory: "512Mi" }  # OOMKilled if exceeded
\`\`\`

| Hit limit | Result |
|-----------|--------|
| CPU | Throttled (slow) |
| Memory | **OOMKilled** — restart |

Set requests from real metrics. Limits slightly above p99.

## Graceful shutdown

\`kubectl delete pod\` → SIGTERM → removed from Service endpoints → drain → SIGKILL after grace period.

\`\`\`java-quiz
level: medium
q: Pods restart with OOMKilled. Fastest fix path?
options: More replicas | Raise memory limits from actual usage; profile for leaks | Remove liveness probe | Switch to StatefulSet
correct: 1
explain: OOMKilled = exceeded memory limit. Bump limits short-term, profile medium-term. Don't remove probes — that hides the symptom.
\`\`\`

**Next:** Production ops + interview rapid-fire.
`;

export const K8S_L6 = `# Production & interview rapid-fire

## Minimum production stack

\`\`\`
CI → container registry → Helm/kustomize apply → rolling deploy
Prometheus metrics + centralized logs + distributed traces
\`\`\`

No service mesh required on day one. **Do** need: probes, limits, logs, runbooks.

## HPA — autoscaling

Scales Deployment replicas when CPU (or custom metrics) crosses threshold. **Requires resource requests** on pods or metrics are meaningless.

## Troubleshooting

| Symptom | First move |
|---------|------------|
| Won't start | \`kubectl describe pod\` → Events |
| CrashLoopBackOff | \`kubectl logs --previous\` |
| Unreachable | \`kubectl get endpoints\`, test DNS |
| Deploy stuck | \`kubectl rollout status\`, readiness |

## Interview rapid-fire

| Q | A |
|---|---|
| Pod vs Deployment? | Pod = instance. Deployment = N pods + rolling updates. |
| Service finds pods how? | Label selector → Endpoints → pod IPs |
| StatefulSet vs Deployment? | Stable network ID + persistent volume per pod |
| Node dies? | Pods evicted, rescheduled if replicas > 1 |
| etcd role? | Cluster state; needs quorum (3 or 5 nodes) |
| taint/toleration? | Node repels pods unless tolerated |
| PDB? | Min pods available during voluntary disruptions |

## What you learned (theory)

- Explain the reconciliation loop
- Draw Pod → Deployment → Service from memory
- Split liveness vs readiness correctly
- Debug with describe + logs + endpoints
- Say when K8s is overkill

**Next:** Put your hands on a real cluster — minikube lab on your Mac.
`;

export const K8S_L7 = `# Hands-on lab — minikube on your Mac

> **Run commands on your Mac terminal** — not inside Portainer or the AILearn container.
> One-time setup: \`docs/K8S-LAB.md\` in the repo (install minikube, kubectl, helm).

## What you'll build

A live cluster on your laptop. Deploy nginx, break it on purpose, fix it, roll out a new version, inject config. **This is what interviews assume you've done at least once.**

| Tool | Role |
|------|------|
| **minikube** | Local single-node cluster |
| **kubectl** | Talks to the cluster |
| **Docker Desktop** | Driver (already on your Mac) |

---

\`\`\`k8s-checkpoint
step: 1
title: Start minikube
command: minikube start --driver=docker
expect:
  😄  minikube v1.x.x on Darwin
  ✨  Using the docker driver
  🏄  Done! kubectl is now configured to use "minikube"
hint: First start takes 2–3 min. Docker Desktop must be running.
\`\`\`

\`\`\`k8s-checkpoint
step: 2
title: Verify cluster is alive
command: kubectl get nodes
expect:
  NAME       STATUS   ROLES           AGE   VERSION
  minikube   Ready    control-plane   1m    v1.x.x
hint: STATUS must be Ready. If NotReady, run minikube delete && minikube start again.
\`\`\`

## Deploy your first app

Save this as \`nginx-deploy.yaml\`:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports: [{ containerPort: 80 }]
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector: { app: web }
  ports: [{ port: 80, targetPort: 80 }]
  type: NodePort
\`\`\`

\`\`\`k8s-checkpoint
step: 3
title: Apply the manifest
command: kubectl apply -f nginx-deploy.yaml
expect:
  deployment.apps/web created
  service/web created
\`\`\`

\`\`\`k8s-checkpoint
step: 4
title: Confirm pods are running
command: kubectl get pods -l app=web
expect:
  NAME                   READY   STATUS    RESTARTS   AGE
  web-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
  web-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
hint: READY must be 1/1. If ImagePullBackOff, check image name.
\`\`\`

\`\`\`k8s-checkpoint
step: 5
title: Hit the app from your browser
command: minikube service web --url
expect:
  http://127.0.0.1:3xxxx
hint: Open the URL — you should see the nginx welcome page.
\`\`\`

## Break it — then fix it (the interview skill)

\`\`\`k8s-checkpoint
step: 6
title: Deploy a broken image on purpose
command: kubectl set image deployment/web nginx=nginx:does-not-exist-tag
expect:
  deployment.apps/web image updated
\`\`\`

Wait ~30 seconds, then:

\`\`\`k8s-checkpoint
step: 7
title: Diagnose CrashLoopBackOff
command: kubectl get pods -l app=web
expect:
  STATUS    CrashLoopBackOff
hint: Now run kubectl describe pod <name> and look at Events. Then kubectl logs <name> --previous
\`\`\`

Fix it:

\`\`\`k8s-checkpoint
step: 8
title: Roll back to a working image
command: kubectl rollout undo deployment/web
expect:
  deployment.apps/web rolled back
\`\`\`

\`\`\`k8s-checkpoint
step: 9
title: Watch a rolling update succeed
command: kubectl rollout status deployment/web
expect:
  deployment "web" successfully rolled out
\`\`\`

## ConfigMap — change config without rebuilding the image

\`\`\`bash
kubectl create configmap web-html --from-literal=index.html='<h1>Hello from K8s lab</h1>'
kubectl set env deployment/web HTML=from-configmap   # placeholder — real mount shown below
\`\`\`

For a quick win, scale instead:

\`\`\`k8s-checkpoint
step: 10
title: Scale replicas — see the scheduler work
command: kubectl scale deployment/web --replicas=3
expect:
  deployment.apps/web scaled
hint: kubectl get pods -l app=web — you should see 3 Running pods.
\`\`\`

## Cleanup

\`\`\`bash
minikube stop          # pause cluster, keep state
minikube delete        # wipe everything when done for the day
\`\`\`

## What you just proved

- You can **apply** manifests and **read** pod state
- You know **CrashLoopBackOff** → describe + logs
- You've done a **rollout undo** — same as production rollback
- You've seen **reconciliation** happen live, not just on a diagram

**Next:** Helm — how teams actually ship to production.
`;

export const K8S_L8 = `# Helm — ship like production

Raw \`kubectl apply -f\` works for learning. **Production teams use Helm** (or Kustomize) because:

- One chart → dev, staging, prod (different values files)
- Versioned releases with **rollback in one command**
- CI/CD runs the same \`helm upgrade --install\` every time

## Chart anatomy (30 seconds)

\`\`\`
my-chart/
  Chart.yaml          # name + version
  values.yaml         # defaults (treat as prod-ish)
  templates/
    deployment.yaml   # {{ .Values.replicaCount }}
    service.yaml
    ingress.yaml
\`\`\`

**Chart** = templates. **Release** = one installed instance. **Values** = your config overlay.

## Dev vs prod — same chart

\`\`\`diagram-k8s-helm-values
\`\`\`

Install with the right overlay:

\`\`\`bash
# Dev
helm upgrade --install api ./chart -f values-dev.yaml -n dev --create-namespace

# Prod
helm upgrade --install api ./chart -f values-prod.yaml -n prod --create-namespace \\
  --atomic --wait --timeout 5m
\`\`\`

| Flag | Why |
|------|-----|
| \`--install\` | Creates release if missing (idempotent CI) |
| \`--atomic\` | Auto-rollback if upgrade fails |
| \`--wait\` | Don't return until pods are Ready |
| \`-f values-prod.yaml\` | Environment-specific config |

## The workflow you'll use at work

\`\`\`
1. helm lint ./chart
2. helm template api ./chart -f values-prod.yaml   # preview rendered YAML
3. helm upgrade --install api ./chart -f values-prod.yaml --atomic --wait
4. helm history api
5. helm rollback api 1    # if something's wrong
\`\`\`

**Never store passwords in values.yaml** — use Sealed Secrets, External Secrets Operator, or your cloud secret manager.

## Map to your homelab

Your AILearn stack in Portainer is already the same idea:

| Portainer / Compose | Helm equivalent |
|---------------------|-----------------|
| \`docker-compose.yml\` | Chart templates |
| \`.env\` / stack env vars | \`values.yaml\` |
| Pull & redeploy | \`helm upgrade --install\` |
| Roll back image tag manually | \`helm rollback\` |

## Create a minimal chart (5 min exercise)

\`\`\`bash
helm create demo-api
cd demo-api
# Edit values.yaml: image.repository, replicaCount, ingress.host
helm install demo . --dry-run   # see rendered YAML without applying
helm install demo . -n lab --create-namespace
helm list -n lab
helm uninstall demo -n lab
\`\`\`

\`\`\`java-quiz
level: tricky
q: CI runs helm upgrade on every merge to main. A bad values change breaks readiness probes. What's the safest production flag combo?
options: --force only | --atomic --wait with a timeout | --recreate-pods always | Skip helm, use kubectl apply
correct: 1
explain: --atomic rolls back automatically if the new revision never becomes healthy. --wait ensures CI fails loudly instead of "deploy succeeded" while pods are crash-looping. --force and --recreate-pods are sledgehammers for emergencies, not default CI. kubectl apply in CI loses Helm release history and rollback.
\`\`\`

## When to learn next (optional)

| Topic | When |
|-------|------|
| **Kustomize** | Team prefers patch overlays over templating |
| **ArgoCD / Flux** | GitOps — Git is source of truth, cluster reconciles |
| **kind** | Fast ephemeral clusters in GitHub Actions |

## Course complete

You now have **theory** (lessons 1–6), **hands-on muscle memory** (lesson 7), and **production packaging** (lesson 8). That's the working engineer's Kubernetes — enough to interview, ship, and debug on a real cluster.
`;

