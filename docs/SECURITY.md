# KubeLab – Security & Infrastructure Model

## 1. Zero-Trust Security Principles

KubeLab operates under an adversarial security model where code entered into browser terminals must be treated as untrusted student execution. The host cluster and backend servers must remain protected against container breakout, network eavesdropping, resource exhaustion, and privilege escalation.

---

## 2. Threat Matrix & Mitigation Strategies

| Threat Scenario | Vector / Target | Applied Mitigation |
| :--- | :--- | :--- |
| **Container Breakout** | Linux kernel exploits, privileged pods | Run student containers unprivileged (`securityContext.privileged: false`), drop all capabilities (`drop: ["ALL"]`), enable seccomp profile `RuntimeDefault`, prevent privilege escalation (`allowPrivilegeEscalation: false`), run as non-root user (`runAsNonRoot: true`, UID: 1000). |
| **Cluster Takeover** | Stealing admin kubeconfig or service account tokens | Student containers NEVER have the default Kubernetes ServiceAccount token auto-mounted (`automountServiceAccountToken: false` by default or mount a strictly scoped ServiceAccount with role bindings restricted solely to their own ephemeral namespace). Cluster-admin credentials reside only in the Gateway server. |
| **Docker Socket Abuse** | Mounting `/var/run/docker.sock` | Docker socket is NEVER exposed or mounted into student containers. Student containers only run userland binaries (`kubectl`, `helm`, `curl`, `nano`, etc.). |
| **Lateral Movement** | Accessing neighboring student namespaces or kube-system | Kubernetes `NetworkPolicy` isolates each namespace. Ingress/Egress policies block intra-cluster pod-to-pod routing across namespaces and forbid access to cloud metadata endpoints (`169.254.169.254`). |
| **Cryptomining / DoS** | CPU/Memory starvation, fork bombs | Strict `ResourceQuota` enforces CPU limits (e.g., max 1000m), memory limits (max 1Gi), and object limits (max 5 pods, 3 services). PID limits (`pidsLimit`) prevent fork bombs. |
| **Session Hijacking** | Unauthorized WebSocket terminal attach | WebSockets require a single-use, cryptographically signed, short-lived (60-second validity) session ticket verified by the Gateway before PTY allocation. |
| **Database Tampering** | Client tampering with scores or progress | Supabase Row Level Security (RLS) restricts read/write permissions. Lab evaluations are computed server-side in the trusted Infrastructure tier using service credentials. |

---

## 3. Kubernetes Namespace Isolation Spec

Every lab session triggers an ephemeral namespace created with the following resources:

### 3.1 NetworkPolicy: Deny Inter-Namespace & Cloud Metadata
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: student-isolation-policy
  namespace: lab-session-xyz
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Allow traffic within the same namespace
    - from:
        - podSelector: {}
  egress:
    # Allow DNS lookup
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    # Allow traffic within the student namespace
    - to:
        - podSelector: {}
    # Deny cloud metadata IP (169.254.169.254) and internal kube-apiserver
```

### 3.2 ResourceQuota: Guardrails
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: student-quota
  namespace: lab-session-xyz
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    pods: "6"
    services: "4"
    persistentvolumeclaims: "2"
    configmaps: "10"
    secrets: "10"
```

### 3.3 Scoped RBAC Role
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: student-lab-role
  namespace: lab-session-xyz
spec:
  - apiGroups: ["", "apps", "batch"]
    resources: ["pods", "pods/log", "services", "deployments", "replicasets", "configmaps", "secrets", "persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  # Explicitly forbid cluster-scoped resources like nodes, persistentvolumes, storageclasses, clusterroles
```

---

## 4. Ephemeral Lifecycle & Cleanup

1. **Active TTL**: Default session duration is 30 minutes.
2. **Heartbeat**: Frontend sends ping pulses every 30 seconds; 5 consecutive missed pulses triggers session idle suspension.
3. **Automatic Garbage Collection**: An automated reaper task scans namespaces with `lab-session-*` labels and purges those whose `kubelab.io/expires-at` Unix timestamp has passed.
