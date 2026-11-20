export type LabDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type LabCategory =
  | 'Kubernetes Fundamentals'
  | 'Pods'
  | 'Deployments'
  | 'ReplicaSets'
  | 'Services'
  | 'Namespaces'
  | 'ConfigMaps'
  | 'Secrets'
  | 'Volumes and Persistent Volumes'
  | 'Persistent Volume Claims'
  | 'Ingress'
  | 'StatefulSets'
  | 'DaemonSets'
  | 'Jobs and CronJobs'
  | 'RBAC'
  | 'Network Policies'
  | 'Resource Management'
  | 'Helm'
  | 'Monitoring and Logging'
  | 'Kubernetes Troubleshooting'
  | 'Kubernetes Security'
  | 'Cluster Administration';

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  xp_points: number;
  streak_days: number;
  created_at: string;
}

export interface LabTask {
  id: string;
  lab_id: string;
  title: string;
  description: string;
  validation_config: {
    resourceType: 'pod' | 'deployment' | 'service' | 'configmap' | 'secret' | 'namespace' | 'pvc';
    name?: string;
    expectedReplicas?: number;
    expectedImage?: string;
    expectedPort?: number;
    expectedStatus?: string;
    labels?: Record<string, string>;
  };
  task_order: number;
  hints?: string[];
}

export interface Lab {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: LabCategory;
  difficulty: LabDifficulty;
  instructions: string;
  estimated_time: number; // in minutes
  points: number;
  is_published: boolean;
  tasks?: LabTask[];
  created_at: string;
}

export interface UserLabProgress {
  id: string;
  user_id: string;
  lab_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  time_spent: number; // in seconds
  completed_at?: string;
}

export interface LabSession {
  id: string;
  user_id: string;
  lab_id: string;
  environment_id: string;
  namespace: string;
  status: 'provisioning' | 'active' | 'expired' | 'terminated';
  ws_ticket?: string;
  started_at: string;
  expires_at: string;
  ended_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface K8sResourceItem {
  name: string;
  namespace: string;
  kind: string;
  status: string;
  ready?: string;
  restarts?: number;
  age: string;
}
