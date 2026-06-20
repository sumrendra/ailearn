# Kubernetes local lab setup (macOS)

One-time install for **Lesson 7 — Hands-on minikube lab**. Run everything on your **Mac terminal**, not on the HomeLab Portainer host.

## Prerequisites

- **Docker Desktop** — running (whale icon in menu bar)
- **~4 GB RAM** free for minikube
- Lessons 1–6 completed (or skimmed) — theory first, lab second

## Install (Homebrew)

```bash
# kubectl — cluster CLI
brew install kubectl

# minikube — local cluster
brew install minikube

# helm — lesson 8 (install now to save time later)
brew install helm
```

Verify:

```bash
kubectl version --client
minikube version
helm version
```

## Start your first cluster

```bash
minikube start --driver=docker
kubectl get nodes
```

Expected: `minikube` node in **Ready** state.

## Useful aliases (optional)

```bash
alias k=kubectl
```

## Lab manifest

Create a folder for the lab:

```bash
mkdir -p ~/k8s-lab && cd ~/k8s-lab
```

Copy `nginx-deploy.yaml` from lesson 7 into that folder, then:

```bash
kubectl apply -f nginx-deploy.yaml
kubectl get pods -l app=web
minikube service web --url
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `docker: not running` | Start Docker Desktop |
| `minikube` stuck / NotReady | `minikube delete && minikube start --driver=docker` |
| No URL from `minikube service` | `minikube tunnel` in a separate terminal (LoadBalancer) |
| `kubectl` talks to wrong cluster | `kubectl config use-context minikube` |
| Out of disk | `minikube delete` and `docker system prune` |

## Cleanup

```bash
minikube stop      # pause — keeps cluster state
minikube delete    # remove cluster entirely
```

## kind (optional — for CI-minded learners)

If you later need fast multi-node clusters for CI:

```bash
brew install kind
kind create cluster
kubectl cluster-info --context kind-kind
kind delete cluster
```

Stick with **minikube** for lesson 7 — addons and `minikube service` are simpler for first hands-on.

## Next

Open lesson **k8s-minikube-lab** in AILearn and work through the 10 checkpoints.

After the lab, continue to **k8s-helm-production** (lesson 8).
