import * as k8s from "@kubernetes/client-node";

export interface ProvisionResult {
  sessionId: string;
  namespace: string;
  runnerPodName: string;
  expiresAt: Date;
}

export class NamespaceManager {
  private kc: k8s.KubeConfig;
  private coreApi: k8s.CoreV1Api;
  private appsApi: k8s.AppsV1Api;
  private rbacApi: k8s.RbacAuthorizationV1Api;
  private netApi: k8s.NetworkingV1Api;
  private isK8sAvailable: boolean = false;

  constructor() {
    this.kc = new k8s.KubeConfig();
    try {
      this.kc.loadFromDefault();
      this.coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
      this.appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
      this.rbacApi = this.kc.makeApiClient(k8s.RbacAuthorizationV1Api);
      this.netApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
      this.isK8sAvailable = true;
      console.log("[NamespaceManager] Kubernetes client initialized successfully.");
    } catch (err) {
      console.warn("[NamespaceManager] Running in resilient mock/standalone mode.");
      this.coreApi = {} as any;
      this.appsApi = {} as any;
      this.rbacApi = {} as any;
      this.netApi = {} as any;
    }
  }

  public getKubeConfig(): k8s.KubeConfig {
    return this.kc;
  }

  public getIsK8sAvailable(): boolean {
    return this.isK8sAvailable;
  }

  async provisionLabEnvironment(sessionId: string, ttlMinutes: number = 30): Promise<ProvisionResult> {
    const namespace = `lab-session-${sessionId.slice(0, 8)}`;
    const runnerPodName = `terminal-runner-${sessionId.slice(0, 6)}`;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    if (!this.isK8sAvailable) {
      console.log(`[Mock Mode] Simulated provision for namespace: ${namespace}`);
      return { sessionId, namespace, runnerPodName, expiresAt };
    }

    try {
      // 1. Create Namespace
      const nsObj: k8s.V1Namespace = {
        metadata: {
          name: namespace,
          labels: {
            "kubelab.io/session-id": sessionId,
            "kubelab.io/managed-by": "kubelab-provisioner",
            "kubelab.io/expires-at": Math.floor(expiresAt.getTime() / 1000).toString(),
          },
        },
      };
      await (this.coreApi as any).createNamespace({ body: nsObj });

      // 2. Apply ResourceQuota
      const quotaObj: k8s.V1ResourceQuota = {
        metadata: { name: "student-quota", namespace },
        spec: {
          hard: {
            "requests.cpu": "1",
            "requests.memory": "1Gi",
            "limits.cpu": "2",
            "limits.memory": "2Gi",
            "pods": "8",
            "services": "5",
            "configmaps": "10",
            "secrets": "10",
          },
        },
      };
      await (this.coreApi as any).createNamespacedResourceQuota({ namespace, body: quotaObj });

      // 3. Apply NetworkPolicy
      const netPolicyObj: any = {
        metadata: { name: "student-isolation-policy", namespace },
        spec: {
          podSelector: {},
          policyTypes: ["Ingress", "Egress"],
          ingress: [
            {
              _from: [{ podSelector: {} }],
            },
          ],
          egress: [
            {
              to: [{ podSelector: {} }],
            },
            {
              ports: [
                { protocol: "UDP", port: 53 },
                { protocol: "TCP", port: 53 },
              ],
            },
          ],
        },
      };
      await (this.netApi as any).createNamespacedNetworkPolicy({ namespace, body: netPolicyObj });

      // 4. Create ServiceAccount & RoleBinding
      const saObj: k8s.V1ServiceAccount = {
        metadata: { name: "student-sa", namespace },
      };
      await (this.coreApi as any).createNamespacedServiceAccount({ namespace, body: saObj });

      const roleObj: k8s.V1Role = {
        metadata: { name: "student-role", namespace },
        rules: [
          {
            apiGroups: ["", "apps", "batch", "networking.k8s.io"],
            resources: ["pods", "pods/log", "pods/status", "deployments", "services", "replicasets", "configmaps", "secrets", "jobs"],
            verbs: ["get", "list", "watch", "create", "update", "patch", "delete"],
          },
        ],
      };
      await (this.rbacApi as any).createNamespacedRole({ namespace, body: roleObj });

      const roleBindingObj: k8s.V1RoleBinding = {
        metadata: { name: "student-rolebinding", namespace },
        subjects: [{ kind: "ServiceAccount", name: "student-sa", namespace }],
        roleRef: { kind: "Role", name: "student-role", apiGroup: "rbac.authorization.k8s.io" },
      };
      await (this.rbacApi as any).createNamespacedRoleBinding({ namespace, body: roleBindingObj });

      // 5. Deploy Terminal Runner Pod
      const runnerPod: k8s.V1Pod = {
        metadata: {
          name: runnerPodName,
          namespace,
          labels: { "app.kubernetes.io/name": "terminal-runner" },
        },
        spec: {
          serviceAccountName: "student-sa",
          containers: [
            {
              name: "shell",
              image: "alpine/k8s:1.29.2",
              command: ["sh", "-c", "sleep 86400"],
              resources: {
                limits: { cpu: "500m", memory: "512Mi" },
                requests: { cpu: "100m", memory: "128Mi" },
              },
              securityContext: {
                allowPrivilegeEscalation: false,
                capabilities: { drop: ["ALL"] },
              },
            },
          ],
        },
      };
      await (this.coreApi as any).createNamespacedPod({ namespace, body: runnerPod });

      console.log(`[NamespaceManager] Provisioned namespace ${namespace} with runner ${runnerPodName}`);
      return { sessionId, namespace, runnerPodName, expiresAt };
    } catch (err: any) {
      console.error(`[NamespaceManager] Error provisioning lab:`, err);
      throw new Error(`Failed to provision Kubernetes sandbox: ${err.message}`);
    }
  }

  async deleteLabEnvironment(namespace: string): Promise<void> {
    if (!this.isK8sAvailable) {
      console.log(`[Mock Mode] Simulated cleanup of namespace: ${namespace}`);
      return;
    }

    try {
      await (this.coreApi as any).deleteNamespace({ name: namespace });
      console.log(`[NamespaceManager] Cleaned up namespace: ${namespace}`);
    } catch (err: any) {
      console.warn(`[NamespaceManager] Namespace ${namespace} cleanup note:`, err.message);
    }
  }

  async getNamespaceResources(namespace: string): Promise<any> {
    if (!this.isK8sAvailable) {
      return {
        pods: [
          { name: "web-app-6bf4f877d9-c4k2m", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
          { name: "web-app-6bf4f877d9-j8w9p", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
          { name: "web-app-6bf4f877d9-z4t1l", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
        ],
        deployments: [
          { name: "web-app", ready: "3/3", upToDate: 3, available: 3, age: "2m" },
        ],
        services: [
          { name: "web-app", type: "ClusterIP", clusterIP: "10.96.142.88", ports: "80/TCP", age: "1m" },
        ],
      };
    }

    try {
      const podsRes: any = await (this.coreApi as any).listNamespacedPod({ namespace });
      const depsRes: any = await (this.appsApi as any).listNamespacedDeployment({ namespace });
      const svcRes: any = await (this.coreApi as any).listNamespacedService({ namespace });

      const podItems = podsRes.items || podsRes.body?.items || [];
      const depItems = depsRes.items || depsRes.body?.items || [];
      const svcItems = svcRes.items || svcRes.body?.items || [];

      return {
        pods: podItems
          .filter((p: any) => !p.metadata?.name?.startsWith("terminal-runner"))
          .map((p: any) => ({
            name: p.metadata?.name,
            status: p.status?.phase,
            ready: `${p.status?.containerStatuses?.filter((c: any) => c.ready).length || 0}/${p.spec?.containers?.length || 0}`,
            restarts: p.status?.containerStatuses?.[0]?.restartCount || 0,
            age: p.metadata?.creationTimestamp,
          })),
        deployments: depItems.map((d: any) => ({
          name: d.metadata?.name,
          ready: `${d.status?.readyReplicas || 0}/${d.status?.replicas || 0}`,
          upToDate: d.status?.updatedReplicas || 0,
          available: d.status?.availableReplicas || 0,
          age: d.metadata?.creationTimestamp,
        })),
        services: svcItems.map((s: any) => ({
          name: s.metadata?.name,
          type: s.spec?.type,
          clusterIP: s.spec?.clusterIP,
          ports: s.spec?.ports?.map((p: any) => `${p.port}/${p.protocol}`).join(", "),
          age: s.metadata?.creationTimestamp,
        })),
      };
    } catch (err: any) {
      console.error("[NamespaceManager] getNamespaceResources error:", err.message);
      return { pods: [], deployments: [], services: [] };
    }
  }
}
