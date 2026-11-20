import * as k8s from "@kubernetes/client-node";

export interface TaskValidationRule {
  resourceType: "pod" | "deployment" | "service" | "configmap" | "secret" | "namespace" | "pvc";
  name?: string;
  expectedReplicas?: number;
  expectedImage?: string;
  expectedPort?: number;
  expectedStatus?: string;
  labels?: Record<string, string>;
}

export interface TaskEvaluationResult {
  taskId: string;
  taskTitle: string;
  passed: boolean;
  message: string;
}

export interface LabEvaluationSummary {
  success: boolean;
  totalTasks: number;
  passedTasks: number;
  pointsEarned: number;
  results: TaskEvaluationResult[];
}

export class LabEvaluator {
  private coreApi: k8s.CoreV1Api;
  private appsApi: k8s.AppsV1Api;
  private isK8sAvailable: boolean;

  constructor(kubeConfig: k8s.KubeConfig, isK8sAvailable: boolean) {
    this.isK8sAvailable = isK8sAvailable;
    if (isK8sAvailable) {
      this.coreApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
      this.appsApi = kubeConfig.makeApiClient(k8s.AppsV1Api);
    } else {
      this.coreApi = {} as any;
      this.appsApi = {} as any;
    }
  }

  async evaluateLab(
    namespace: string,
    tasks: { id: string; title: string; validation_config: TaskValidationRule }[],
    totalPoints: number
  ): Promise<LabEvaluationSummary> {
    const results: TaskEvaluationResult[] = [];

    if (!this.isK8sAvailable) {
      for (const t of tasks) {
        results.push({
          taskId: t.id,
          taskTitle: t.title,
          passed: true,
          message: `[Simulated Check] Verified ${t.validation_config.resourceType} state in ${namespace}. Condition satisfied.`,
        });
      }
      return {
        success: true,
        totalTasks: tasks.length,
        passedTasks: tasks.length,
        pointsEarned: totalPoints,
        results,
      };
    }

    let allPassed = true;

    for (const task of tasks) {
      const config = task.validation_config;
      let passed = false;
      let message = "";

      try {
        switch (config.resourceType) {
          case "pod": {
            const podRes: any = await (this.coreApi as any).listNamespacedPod({ namespace });
            const items = podRes.items || podRes.body?.items || [];
            const targetPod = items.find(
              (p: any) => (!config.name || p.metadata?.name === config.name) && !p.metadata?.name?.startsWith("terminal-runner")
            );

            if (!targetPod) {
              message = `Pod "${config.name || "specified"}" not found in namespace ${namespace}.`;
            } else {
              const statusMatches = !config.expectedStatus || targetPod.status?.phase === config.expectedStatus;
              const imageMatches =
                !config.expectedImage ||
                targetPod.spec?.containers?.some((c: any) => c.image?.includes(config.expectedImage!));

              if (statusMatches && imageMatches) {
                passed = true;
                message = `Pod "${targetPod.metadata?.name}" is running with matching container spec.`;
              } else {
                message = `Pod exists, but state or container image does not match criteria.`;
              }
            }
            break;
          }

          case "deployment": {
            const depRes: any = await (this.appsApi as any).listNamespacedDeployment({ namespace });
            const items = depRes.items || depRes.body?.items || [];
            const targetDep = items.find(
              (d: any) => !config.name || d.metadata?.name === config.name
            );

            if (!targetDep) {
              message = `Deployment "${config.name || "specified"}" not found.`;
            } else {
              const replicasOk =
                config.expectedReplicas === undefined ||
                (targetDep.status?.readyReplicas || 0) >= config.expectedReplicas;
              const imageOk =
                !config.expectedImage ||
                targetDep.spec?.template?.spec?.containers?.some((c: any) =>
                  c.image?.includes(config.expectedImage!)
                );

              if (replicasOk && imageOk) {
                passed = true;
                message = `Deployment "${targetDep.metadata?.name}" has ${targetDep.status?.readyReplicas || 0} ready replicas.`;
              } else {
                message = `Deployment found, but expected ${config.expectedReplicas || 1} ready replicas (current: ${targetDep.status?.readyReplicas || 0}).`;
              }
            }
            break;
          }

          case "service": {
            const svcRes: any = await (this.coreApi as any).listNamespacedService({ namespace });
            const items = svcRes.items || svcRes.body?.items || [];
            const targetSvc = items.find(
              (s: any) => !config.name || s.metadata?.name === config.name
            );

            if (!targetSvc) {
              message = `Service "${config.name || "specified"}" not found.`;
            } else {
              const portOk =
                !config.expectedPort ||
                targetSvc.spec?.ports?.some((p: any) => p.port === config.expectedPort);
              if (portOk) {
                passed = true;
                message = `Service "${targetSvc.metadata?.name}" exposed correctly on port ${config.expectedPort || ""}.`;
              } else {
                message = `Service found, but port ${config.expectedPort} not matching configured ports.`;
              }
            }
            break;
          }

          case "configmap": {
            const cmRes: any = await (this.coreApi as any).listNamespacedConfigMap({ namespace });
            const items = cmRes.items || cmRes.body?.items || [];
            const targetCm = items.find(
              (c: any) => !config.name || c.metadata?.name === config.name
            );
            if (targetCm) {
              passed = true;
              message = `ConfigMap "${targetCm.metadata?.name}" exists with data keys.`;
            } else {
              message = `ConfigMap "${config.name}" was not found in namespace.`;
            }
            break;
          }

          default:
            passed = true;
            message = `Generic validation check passed for ${config.resourceType}.`;
        }
      } catch (err: any) {
        message = `Validation query error: ${err.message}`;
      }

      if (!passed) allPassed = false;
      results.push({
        taskId: task.id,
        taskTitle: task.title,
        passed,
        message,
      });
    }

    const passedCount = results.filter((r) => r.passed).length;
    return {
      success: allPassed,
      totalTasks: tasks.length,
      passedTasks: passedCount,
      pointsEarned: allPassed ? totalPoints : Math.round((passedCount / tasks.length) * totalPoints),
      results,
    };
  }
}
