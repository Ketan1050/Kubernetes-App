# KubeLab – Technical Architecture Document

## 1. System Overview

**KubeLab** is a multi-tenant, cloud-native interactive Kubernetes learning platform designed to provide real, isolated Kubernetes practice environments accessible directly inside a web browser.

The architecture decouples the user-facing web tier (Next.js & Supabase) from the compute-heavy, security-sensitive infrastructure tier (Terminal Gateway & Kubernetes Provisioner).

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  +-----------------------------------------------------------------------------+  |
|  |                  Next.js Modern Web Application (Dark-First)                 |  |
|  |  +----------------+  +-----------------+  +---------------+  +-----------+  |  |
|  |  | Interactive UI |  | xterm.js WebTTY |  | Monaco Editor |  | Live K8s  |  |  |
|  |  | Dashboard/Labs |  | Terminal Client |  | (YAML Spec)   |  | Dashboard |  |  |
|  |  +----------------+  +-----------------+  +---------------+  +-----------+  |  |
+--+----------|--------------------|-------------------|----------------|-----------+--+
              |                    |                   |                |
     HTTPS / REST / Auth     Secure WebSocket        HTTPS            HTTPS
              |             (WSS + Lab Token)          |                |
              v                    |                   v                v
+-----------------------------+    |    +------------------------------------------+
|      DATA & AUTH TIER       |    |    |          INFRASTRUCTURE TIER             |
|  +-----------------------+  |    |    |  +------------------------------------+  |
|  |     Supabase PaaS     |  |    |    |  | Terminal Gateway & Lab API Proxy   |  |
|  |  * Supabase Auth      |  |    |    |  | * JWT/Session Ticket Verification  |  |
|  |  * Postgres (RLS)     |  |    |    |  | * WebSocket <-> PTY Bridge         |  |
|  |  * Storage (Assets)   |  |    |    |  | * K8s API Reverse Proxy (Filtered) |  |
|  |  * Realtime Pub/Sub   |  |    |    |  | * Automated Lab Evaluator          |  |
|  |  * Edge Functions     |  |    |    |  +-----------------|------------------+  |
|  +-----------------------+  |    |    +--------------------|---------------------+
+-----------------------------+    |                         |
                                   |                 Kube-API / In-Cluster
                                   +-------------------------|
                                                             v
                                        +------------------------------------------+
                                        |       KUBERNETES CLUSTER WORKLOADS       |
                                        |  (Kind for local dev / K3s/EKS for prod) |
                                        |                                          |
                                        |  +------------------------------------+  |
                                        |  | Namespace: lab-user-{id}-{session} |  |
                                        |  |  * Pod: terminal-runner (Alpine)   |  |
                                        |  |    - Restricted user (non-root)    |  |
                                        |  |    - kubectl, k9s, helm, curl, jq  |  |
                                        |  |    - Scoped ServiceAccount Token   |  |
                                        |  |    - ResourceQuota (CPU/RAM/PIDs)  |  |
                                        |  |    - Strict NetworkPolicy (Egress) |  |
                                        |  |  * Student Workloads:              |  |
                                        |  |    - Pods, Deployments, Services   |  |
                                        |  +------------------------------------+  |
                                        +------------------------------------------+
```

---

## 2. Component Responsibilities

### 2.1 Frontend (Next.js, TypeScript, Tailwind CSS, shadcn/ui)
- **Role**: Client application, authentication flows, UI state, user telemetry.
- **Key Modules**:
  - **Landing Page**: Modern developer hero section, features, pricing, roadmaps.
  - **User Dashboard**: Metrics, streak tracker, current enrolled labs, XP leaderboard.
  - **Lab Catalog**: 22 curated tracks from Pod basics to RBAC and Network Policies.
  - **Playground IDE**: Split-pane layout with Monaco editor (YAML), live terminal (xterm.js), dynamic resource viewer, and instruction steps.
  - **Admin Panel**: Lab content management, user metrics, active cluster sessions monitor.

### 2.2 Backend & Data Tier (Supabase)
- **Role**: Authoritative data store and identity provider.
- **Components**:
  - **Supabase Auth**: Email/password, OAuth providers, JWT issuance with custom user claims.
  - **PostgreSQL Database**: Relational schema storing user profiles, lab definitions, task validation rules, progress metrics, and audit logs.
  - **Row Level Security (RLS)**: Enforces zero-trust database access at the query engine level.
  - **Supabase Realtime**: Broadcasts lab progress updates, session countdowns, and evaluation completions.

### 2.3 Terminal Gateway & Lab API Proxy (Infrastructure Node.js / Go Service)
- **Role**: Mediates between frontend WebSockets and Kubernetes container PTYs.
- **Responsibilities**:
  - Authenticates WebSocket connection requests using short-lived session tickets signed by the application.
  - Attaches to the user's running `terminal-runner` pod using the Kubernetes Exec API (`/api/v1/namespaces/{ns}/pods/{pod}/exec`).
  - Pipes terminal input/output (ANSI escape sequences, window resize events) bidirectionally with xterm.js.
  - Enforces session idle timeouts and terminal output throttling.

### 2.4 Kubernetes Provisioner & Lifecycle Controller
- **Role**: Provisions, manages, and cleans up isolated student environments.
- **Lifecycle Sequence**:
  1. **Provision Request**: Upon lab start, creates an isolated Kubernetes namespace: `lab-session-{sessionId}`.
  2. **RBAC Configuration**: Binds a scoped `Role` and `RoleBinding` granting full permissions *only* within the student's namespace.
  3. **Resource Guardrails**: Applies a strict `ResourceQuota` (e.g. Max 4 Pods, 1 CPU core, 1Gi Memory) and `LimitRange`.
  4. **Network Policy**: Denies access to internal cluster metadata (AWS/GCP metadata endpoints, kube-dns spoofing, cross-namespace traffic).
  5. **Terminal Pod Launch**: Deploys the student's shell container configured with custom prompt (`student@kubelab:~$ `) and kubectl pre-authenticated.
  6. **Reaper Service**: Monitors `expires_at` timestamps (default: 30 minutes) and deletes expired namespaces automatically.

### 2.5 Automated Lab Evaluation Engine
- **Role**: Evaluates student accomplishments against objective criteria without trusting client input.
- **Execution Mechanism**:
  - Runs in the trusted infrastructure tier.
  - Reads lab evaluation criteria defined in Supabase (`lab_tasks.validation_config`).
  - Directly queries the Kubernetes API server for the target namespace.
  - Validates object existence, label selectors, container images, replica readiness, and service endpoints.
  - Returns structured task evaluation results (Success/Failed, checklist items, diagnostic messages) and records scores to Supabase.

---

## 3. Communication Flows

### Flow 1: Lab Session Creation & Terminal Connection
```mermaid
sequenceDiagram
    autonumber
    actor User as Student Browser
    participant FE as Next.js Frontend
    participant SB as Supabase (Auth & DB)
    participant GW as Terminal Gateway / Provisioner
    participant K8s as Kubernetes Cluster (API Server)

    User->>FE: Click "Start Lab"
    FE->>SB: Authenticate & Record `lab_sessions` (Status: pending)
    FE->>GW: POST /api/v1/sessions/start (Bearer JWT, labId)
    GW->>SB: Verify Session & User Tier
    GW->>K8s: Create Namespace (lab-{userId}-{sessionId})
    GW->>K8s: Apply ResourceQuota, LimitRange, NetworkPolicy
    GW->>K8s: Create ServiceAccount & RoleBinding (scoped to namespace)
    GW->>K8s: Deploy `terminal-runner` Pod
    K8s-->>GW: Pod Running & Ready
    GW->>SB: Update `lab_sessions` (status: active, endpoints, expires_at)
    GW-->>FE: Return Session Ticket & WebSocket URL
    FE->>GW: WebSocket Handshake (wss://gateway/term?ticket=xyz)
    GW->>K8s: Kubernetes Exec API (sh -l with PTY)
    GW-->>FE: PTY Stream Connected
    FE->>User: Interactive xterm.js prompt ready!
```

### Flow 2: Live Resource Dashboard Sync
```mermaid
sequenceDiagram
    autonumber
    actor User as Student Browser
    participant FE as Next.js Frontend
    participant GW as Gateway / Resource Proxy
    participant K8s as Kubernetes Cluster

    User->>FE: View Pods / Deployments Tab
    FE->>GW: GET /api/v1/sessions/{id}/resources?types=pods,services
    GW->>GW: Validate Session Ownership
    GW->>K8s: GET /api/v1/namespaces/{userNs}/pods
    K8s-->>GW: PodList JSON
    GW-->>FE: Sanitized Resource Metrics (Name, Status, Restarts, Age)
    FE->>User: Real-time UI cards updated
```

### Flow 3: Lab Verification & Evaluation
```mermaid
sequenceDiagram
    autonumber
    actor User as Student Browser
    participant FE as Next.js Frontend
    participant GW as Gateway / Evaluator
    participant K8s as Kubernetes Cluster
    participant SB as Supabase

    User->>FE: Click "Submit Lab / Verify"
    FE->>GW: POST /api/v1/sessions/{id}/evaluate
    GW->>SB: Fetch Task Validation Criteria (JSON schema)
    loop For each Task in Lab
        GW->>K8s: Query Resource State (e.g., deployment/nginx replicas=3)
        GW->>GW: Compare Actual vs Expected State
    end
    alt All Tasks Passed
        GW->>SB: Update `user_lab_progress` (status: completed, score: 100)
        GW->>SB: Award XP & Check Achievements
        GW-->>FE: { success: true, pointsAwarded: 50, feedback: [...] }
        FE->>User: Confetti & Success Modal
    else Tasks Incomplete
        GW-->>FE: { success: false, failedChecks: [...] }
        FE->>User: Display specific hints & error checklist
    end
```
