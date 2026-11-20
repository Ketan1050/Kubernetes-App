-- ==============================================================================
-- KUBELAB SEED DATA
-- Default Practice Labs across 22 Categories & Core Achievements
-- ==============================================================================

-- 1. Seed Achievements
INSERT INTO public.achievements (name, description, icon, points) VALUES
('First Pod Standing', 'Successfully created and verified your first running Kubernetes Pod.', 'Rocket', 50),
('Replica Master', 'Scaled a deployment to 5 replicas with zero downtime.', 'Layers', 75),
('Network Navigator', 'Configured a ClusterIP and exposed a web workload.', 'Network', 100),
('YAML Whisperer', 'Created and applied a valid multi-container Pod manifest using Monaco.', 'Code2', 100),
('Troubleshooter Extraordinaire', 'Diagnosed and fixed a CrashLoopBackOff container failure.', 'Wrench', 150),
('Security Guardian', 'Enforced a zero-trust NetworkPolicy blocking unauthorized traffic.', 'ShieldCheck', 200),
('Cluster Commander', 'Completed 10 interactive Kubernetes practice practicals.', 'Trophy', 500)
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Labs
INSERT INTO public.labs (slug, title, description, category, difficulty, instructions, estimated_time, points, is_published) VALUES
(
    'intro-first-pod',
    'Deploy Your First Nginx Pod',
    'Learn how to inspect the cluster, run your first containerized workload using an imperative kubectl command, and inspect its runtime status.',
    'Pods',
    'Beginner',
    '### Objective\nCreate an Nginx pod named `nginx-web` using image `nginx:alpine` in your practice namespace.\n\n### Commands\n1. Run `kubectl run nginx-web --image=nginx:alpine`\n2. Verify with `kubectl get pods`\n3. Inspect details with `kubectl describe pod nginx-web`',
    10,
    50,
    true
),
(
    'scale-deployment-replicas',
    'Create and Scale Deployments',
    'Deploy a high-availability microservice deployment and scale its replicas to handle increased student traffic.',
    'Deployments',
    'Beginner',
    '### Objective\nCreate a deployment named `webapp-deployment` with 3 replicas running `nginx:1.25-alpine`.\n\n### Commands\n1. Run `kubectl create deployment webapp-deployment --image=nginx:1.25-alpine`\n2. Scale with `kubectl scale deployment webapp-deployment --replicas=3`\n3. Wait for all 3 replicas to reach Running status with `kubectl get deployments`',
    15,
    75,
    true
),
(
    'expose-service-clusterip',
    'Exposing Applications with ClusterIP Services',
    'Create a stable network endpoint to allow internal communication between pods using Kubernetes CoreDNS.',
    'Services',
    'Beginner',
    '### Objective\nExpose the `webapp-deployment` on port 80 using a ClusterIP service named `webapp-service`.\n\n### Commands\n1. Run `kubectl expose deployment webapp-deployment --name=webapp-service --port=80 --target-port=80`\n2. Check service IP and endpoints with `kubectl get svc webapp-service`\n3. Inspect endpoints with `kubectl get endpoints webapp-service`',
    15,
    75,
    true
),
(
    'configmaps-env-injection',
    'Externalizing Config with ConfigMaps',
    'Decouple application configuration from container images by injecting environment variables via ConfigMaps.',
    'ConfigMaps',
    'Intermediate',
    '### Objective\nCreate a ConfigMap named `app-config` with key `APP_COLOR=darkblue` and consume it in a pod named `color-pod`.\n\n### Steps\n1. Run `kubectl create configmap app-config --from-literal=APP_COLOR=darkblue`\n2. Deploy a pod referencing `app-config` via `envFrom` or `valueFrom`',
    20,
    100,
    true
),
(
    'rbac-namespace-role',
    'Configure Namespace RBAC Security',
    'Create a Role and RoleBinding to grant a developer ServiceAccount read-only pod access according to the least-privilege principle.',
    'RBAC',
    'Advanced',
    '### Objective\nDefine a Role named `pod-reader` that allows `get`, `list`, and `watch` verbs on `pods` resource.\n\n### Steps\n1. Create ServiceAccount `dev-user`\n2. Apply Role `pod-reader` with pod read permissions\n3. Bind the role to `dev-user` with a RoleBinding named `read-pods-binding`',
    25,
    150,
    true
),
(
    'network-policy-isolation',
    'Enforce Pod-to-Pod Zero-Trust Network Policy',
    'Implement default-deny ingress network policies to block unauthorized access to a backend database pod.',
    'Network Policies',
    'Advanced',
    '### Objective\nCreate a NetworkPolicy named `db-access-policy` allowing ingress traffic to pod `app=database` exclusively from pods with label `role=frontend` on port 5432.',
    25,
    150,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Lab Tasks for Validation Engine
-- Task 1 for 'intro-first-pod'
INSERT INTO public.lab_tasks (lab_id, title, description, validation_config, task_order, hints)
SELECT 
    id,
    'Pod Exists & Running',
    'Create an Nginx pod named nginx-web with image nginx:alpine and ensure it reaches Running status.',
    '{"resourceType": "pod", "name": "nginx-web", "expectedImage": "nginx:alpine", "expectedStatus": "Running"}'::jsonb,
    1,
    ARRAY['Run: kubectl run nginx-web --image=nginx:alpine', 'Check status with kubectl get pod nginx-web']
FROM public.labs WHERE slug = 'intro-first-pod'
ON CONFLICT DO NOTHING;

-- Tasks for 'scale-deployment-replicas'
INSERT INTO public.lab_tasks (lab_id, title, description, validation_config, task_order, hints)
SELECT 
    id,
    'Create Deployment',
    'Create a deployment named webapp-deployment with image nginx:1.25-alpine.',
    '{"resourceType": "deployment", "name": "webapp-deployment", "expectedImage": "nginx:1.25-alpine"}'::jsonb,
    1,
    ARRAY['kubectl create deployment webapp-deployment --image=nginx:1.25-alpine']
FROM public.labs WHERE slug = 'scale-deployment-replicas'
ON CONFLICT DO NOTHING;

INSERT INTO public.lab_tasks (lab_id, title, description, validation_config, task_order, hints)
SELECT 
    id,
    'Scale to 3 Ready Replicas',
    'Scale the webapp-deployment so that exactly 3 replicas are running and available.',
    '{"resourceType": "deployment", "name": "webapp-deployment", "expectedReplicas": 3}'::jsonb,
    2,
    ARRAY['kubectl scale deployment webapp-deployment --replicas=3']
FROM public.labs WHERE slug = 'scale-deployment-replicas'
ON CONFLICT DO NOTHING;

-- Tasks for 'expose-service-clusterip'
INSERT INTO public.lab_tasks (lab_id, title, description, validation_config, task_order, hints)
SELECT 
    id,
    'Expose ClusterIP Service',
    'Expose webapp-deployment through a Service named webapp-service on port 80.',
    '{"resourceType": "service", "name": "webapp-service", "expectedPort": 80}'::jsonb,
    1,
    ARRAY['kubectl expose deployment webapp-deployment --name=webapp-service --port=80 --target-port=80']
FROM public.labs WHERE slug = 'expose-service-clusterip'
ON CONFLICT DO NOTHING;
