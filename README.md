# KubeLab – Online Kubernetes Practice Platform

> Master Kubernetes by Practicing. Not Just Watching.

KubeLab is an interactive online Kubernetes learning and practice platform where students, developers, and DevOps engineers master Kubernetes by executing real `kubectl` commands and applying YAML manifests directly inside their web browser.

---

## 🌟 Key Features

- **Real In-Browser Kubernetes Terminal**: Powered by `xterm.js` and a high-performance WebSocket terminal gateway connected to actual, isolated Kubernetes pods.
- **Interactive Monaco YAML Editor**: Real-time Kubernetes YAML syntax validation, pre-built manifest templates, and one-click "Apply to Cluster" execution.
- **Live Kubernetes Resource Viewer**: Real-time visual dashboard displaying active Pods, Deployments, Services, and Namespaces in the student's sandbox.
- **Automated Practical Evaluation Engine**: Server-side validation inspecting the actual Kubernetes API state to assess lab objectives and award XP points.
- **Curated 22-Category Curriculum**: From Kubernetes Fundamentals and Pod primitives to StatefulSets, Ingress, RBAC, Network Policies, and Cluster Troubleshooting.
- **Zero-Trust Security Sandbox**: Complete namespace isolation, ephemeral ServiceAccounts, strict ResourceQuotas, non-root containers, and automated TTL cleanup.
- **Gamified Learning & Metrics**: XP rewards, badges, streaks, leaderboards, and detailed user telemetry.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18/19, TypeScript, Tailwind CSS, Lucide Icons |
| **Terminal & Editor** | xterm.js (WebTTY), Monaco Editor |
| **Backend & Database** | Supabase (Auth, PostgreSQL with RLS, Realtime, Storage) |
| **Infrastructure Gateway**| Node.js / Express, WebSockets (`ws`), `@kubernetes/client-node` |
| **Kubernetes Workloads** | Kind (Local dev) / K3s (Hosted), Docker, Helm, kubectl |
| **DevOps & Monitoring** | GitHub Actions, Docker, Prometheus, Grafana |

---

## 📁 Project Structure

```
kube-lab/
├── frontend/               # Next.js 14 Web Application
│   ├── app/                # App Router (Dashboard, Labs, Playground, Auth, Admin)
│   ├── components/         # Reusable UI & Lab components
│   ├── hooks/              # Terminal, Session, & Supabase hooks
│   ├── lib/                # Supabase client & utilities
│   └── types/              # TypeScript definitions
├── infrastructure/         # Backend Terminal Gateway & K8s Controller
│   ├── provisioning/       # Ephemeral namespace & pod provisioner
│   ├── terminal-gateway/   # WebSocket <-> PTY bridge
│   ├── evaluator/          # Automated lab state verification engine
│   └── security/           # ResourceQuota, LimitRange & NetworkPolicy templates
├── supabase/               # Database migrations, seed data & edge functions
│   ├── migrations/         # PostgreSQL schema & RLS definitions
│   └── seed.sql            # Seed labs, tasks, and achievements
├── labs/                   # Lab definitions and practice exercises
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
├── k8s/                    # Cluster manifests & policy manifests
├── docs/                   # Architecture, Roadmap, and Security documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm
- Docker Desktop or Docker Engine
- Kind or Minikube (for local Kubernetes cluster testing)
- kubectl

### Quick Setup

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to access KubeLab.
