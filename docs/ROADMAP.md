# KubeLab – Master Development Roadmap

This roadmap outlines the 10-phase execution plan for building the complete, production-ready KubeLab platform.

---

## Phase 1: Project Setup & Frontend Architecture 🏁 (Current)
- [x] Analyze complete project requirements and technical architecture.
- [x] Design multi-tier decoupled system (Next.js, Supabase, Terminal Gateway, K8s).
- [x] Establish repository structure and security guardrails.
- [ ] Initialize Next.js 14 App Router project with TypeScript, Tailwind CSS, and shadcn/ui components.
- [ ] Implement global dark-first theme (#090D16 palette, blue/purple accents, monospace typography).
- [ ] Build responsive application shell (Sidebar, Navbar, User status, Notification toasts).
- [ ] Build landing page with Hero, Features, Kubernetes Learning Roadmap, Terminal Preview, and FAQ.
- [ ] Unit & Component smoke testing.

## Phase 2: Supabase Configuration & Authentication
- [ ] Design and generate PostgreSQL schema migrations (`profiles`, `labs`, `lab_tasks`, `user_lab_progress`, `lab_sessions`, `achievements`, `user_achievements`, `activity_logs`).
- [ ] Configure Row Level Security (RLS) policies for complete multi-tenant tenant isolation.
- [ ] Seed initial labs across 22 categories and default achievement badges.
- [ ] Implement Supabase client/server helpers (`@supabase/ssr`).
- [ ] Build authentication pages: Registration, Login, Forgot Password, Reset Password, and Protected Route middleware.
- [ ] Build User Profile view with avatar upload and stats.

## Phase 3: Dashboard & Lab Library
- [ ] Build User Dashboard (Metrics cards: Completed Labs, Total Practice Time, Current Streak, XP, Radar Chart).
- [ ] Build Lab Library page with category filtering (Fundamentals, Pods, Deployments, Services, RBAC, etc.).
- [ ] Implement lab card components with difficulty indicators, estimated time, and prerequisites.
- [ ] Build Lab Detail view with learning objectives, tasks checklist, and "Start Practice Lab" action.

## Phase 4: Interactive Terminal UI
- [ ] Integrate `@xterm/xterm` with `@xterm/addon-fit`, `@xterm/addon-web-links`.
- [ ] Build custom Terminal toolbar (Clear, Copy, Reconnect, Fullscreen, Font sizing).
- [ ] Implement robust WebSocket client hook with reconnect logic, ping/pong heartbeats, and input buffering.
- [ ] Provide fallback simulated terminal demo mode for offline development and testing.

## Phase 5: Secure Terminal Gateway & Kubernetes Provisioning
- [ ] Develop Node.js / TypeScript Terminal Gateway service with Express and `ws`.
- [ ] Implement Kubernetes Client integration (`@kubernetes/client-node`).
- [ ] Build ephemeral Namespace Provisioner with ResourceQuotas, LimitRanges, and NetworkPolicies.
- [ ] Build ServiceAccount generator with scoped namespace RBAC roles.
- [ ] Implement PTY bridge attaching `ws` streams to `terminal-runner` pod exec streams.
- [ ] Build automatic Reaper daemon to terminate expired sessions and clean up namespaces.

## Phase 6: YAML Editor & Real Kubernetes Integration
- [ ] Integrate Monaco Editor (`@monaco-editor/react`) with Kubernetes YAML schema validation.
- [ ] Implement YAML template selector for standard resources (Pod, Deployment, Service, ConfigMap, Ingress).
- [ ] Implement "Apply to Cluster" button that dispatches YAML to the user's active namespace.
- [ ] Build Live Kubernetes Resource Dashboard displaying live pods, deployments, services, and events via REST API.

## Phase 7: Lab Evaluation Engine
- [ ] Implement automated evaluation engine on the Infrastructure Gateway.
- [ ] Support validation rules: resource existence, status condition (`Ready`), replicas count, image name, port mapping, environment variables.
- [ ] Expose `/api/v1/sessions/:id/evaluate` endpoint.
- [ ] Integrate frontend verification feedback modal with pass/fail itemized checklist and XP award celebration.

## Phase 8: Progress Tracking, Gamification & Leaderboard
- [ ] Implement XP calculation logic and level progression curves.
- [ ] Implement achievement trigger system (e.g. "First Pod Deployed", "YAML Master", "Speed Demon").
- [ ] Build global Leaderboard page with weekly and all-time rankings.
- [ ] Build Activity Timeline showing recent command history and lab milestones.

## Phase 9: Admin Dashboard
- [ ] Build Admin navigation and RBAC guard middleware (`role === 'admin'`).
- [ ] Build Lab Management CRUD (Create, Edit, Publish, Reorder tasks, Edit validation JSON).
- [ ] Build User Management table (View progress, change roles, deactivate).
- [ ] Build Cluster Health & Active Sessions monitor (Active namespaces, CPU/memory consumption).

## Phase 10: Testing, Hardening & Deployment
- [ ] End-to-end integration testing for terminal, evaluation, and session timeout.
- [ ] Penetration testing & security audit against container escape and network traversal.
- [ ] Dockerfiles for Frontend, Terminal Gateway, and `terminal-runner` image.
- [ ] Helm chart or Kubernetes manifests for hosting KubeLab infrastructure on K3s/Kind/Cloud VM.
- [ ] GitHub Actions CI/CD workflows for linting, testing, and deployment.
- [ ] Prometheus metrics exporter and Grafana dashboard templates.
