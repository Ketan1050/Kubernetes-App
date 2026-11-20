"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Terminal,
  Play,
  CheckCircle2,
  Cpu,
  Shield,
  Layers,
  Code2,
  Award,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Server,
  Database,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { title: "Kubernetes Fundamentals", level: "Beginner", count: "4 Labs", desc: "Core concepts, architecture, control plane and worker nodes." },
    { title: "Pods Management", level: "Beginner", count: "6 Labs", desc: "Pod lifecycles, multi-container pods, init containers and probes." },
    { title: "Deployments & Scaling", level: "Beginner", count: "5 Labs", desc: "Rolling updates, rollbacks, blue-green deployments, and horizontal scaling." },
    { title: "ReplicaSets", level: "Beginner", count: "3 Labs", desc: "Self-healing reconciliation, selectors, and scaling guarantees." },
    { title: "Services & Networking", level: "Beginner", count: "5 Labs", desc: "ClusterIP, NodePort, LoadBalancer, DNS resolution, and endpoints." },
    { title: "Namespaces & Quotas", level: "Beginner", count: "4 Labs", desc: "Multi-tenant boundaries, ResourceQuotas, and LimitRanges." },
    { title: "ConfigMaps", level: "Intermediate", count: "4 Labs", desc: "Externalizing app configuration, env variables, and config volume mounts." },
    { title: "Secrets Management", level: "Intermediate", count: "4 Labs", desc: "Base64 encoding, immutable secrets, mounted credentials, and TLS certificates." },
    { title: "Volumes & Storage", level: "Intermediate", count: "5 Labs", desc: "emptyDir, hostPath, PersistentVolumes, and storage access modes." },
    { title: "Persistent Volume Claims", level: "Intermediate", count: "4 Labs", desc: "Dynamic provisioning, StorageClasses, and volume reclamation." },
    { title: "Ingress Controllers", level: "Intermediate", count: "5 Labs", desc: "Path-based routing, host-based routing, SSL termination, and rewrite annotations." },
    { title: "StatefulSets", level: "Advanced", count: "4 Labs", desc: "Stable network identities, ordered rollouts, and persistent storage per replica." },
    { title: "DaemonSets", level: "Intermediate", count: "3 Labs", desc: "Node-level log shippers, monitoring agents, and tolerations." },
    { title: "Jobs & CronJobs", level: "Beginner", count: "4 Labs", desc: "Batch operations, completion policies, parallelism, and scheduled tasks." },
    { title: "RBAC & Permissions", level: "Advanced", count: "6 Labs", desc: "Roles, ClusterRoles, RoleBindings, ServiceAccounts, and least-privilege security." },
    { title: "Network Policies", level: "Advanced", count: "5 Labs", desc: "Zero-trust pod isolation, ingress/egress filtering, and CIDR rules." },
    { title: "Resource Management", level: "Intermediate", count: "4 Labs", desc: "CPU/Memory requests vs limits, QOS classes, and eviction thresholds." },
    { title: "Helm Packaging", level: "Intermediate", count: "5 Labs", desc: "Chart creation, values templating, dependency management, and releases." },
    { title: "Monitoring & Logging", level: "Advanced", count: "4 Labs", desc: "Metrics Server, Prometheus scrapes, container logs, and diagnostic tracing." },
    { title: "Troubleshooting", level: "Advanced", count: "7 Labs", desc: "CrashLoopBackOff, ImagePullBackOff, Pending pods, and broken endpoints." },
    { title: "Kubernetes Security", level: "Advanced", count: "5 Labs", desc: "SecurityContexts, PodSecurityStandards, non-root users, and seccomp." },
    { title: "Cluster Administration", level: "Advanced", count: "6 Labs", desc: "Node drains, cordons, kubeadm upgrades, backup/restore with etcdctl." },
  ];

  const faqs = [
    {
      q: "Do I need to install Docker, Minikube, or Kind on my computer?",
      a: "No! KubeLab is 100% browser-based. All Kubernetes clusters and worker environments are provisioned on dedicated cloud infrastructure. You only need a modern web browser.",
    },
    {
      q: "Is this a real Kubernetes cluster or just a fake command simulator?",
      a: "KubeLab executes your commands inside genuine, isolated Kubernetes environments powered by actual container runtimes and Kubernetes control planes. You run real kubectl commands, edit real YAML specs, and inspect real cluster state.",
    },
    {
      q: "How does the automated lab evaluation work?",
      a: "Our trusted infrastructure service queries the actual Kubernetes API for your provisioned session namespace. It inspects your resources (e.g. deployment status, replica counts, labels, images, endpoints) and verifies your solution against real cluster state.",
    },
    {
      q: "Can I use KubeLab to study for CKA, CKAD, or CKS exams?",
      a: "Absolutely. The practical exercises are specifically tailored to align with Linux Foundation / CNCF curriculum objectives, focusing on speed, imperative kubectl proficiency, and accurate YAML authoring.",
    },
    {
      q: "How are student environments isolated from each other?",
      a: "Every session is provisioned in an ephemeral, strictly isolated namespace with non-root security contexts, dropped capabilities, rigid ResourceQuotas, zero host-mount access, and strict NetworkPolicies preventing any inter-namespace traffic.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/15 blur-3xl -z-10 rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-2xl -z-10 rounded-full" />

        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">Interactive Cloud-Native Practice Platform</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400 flex items-center">
              Real Clusters <ArrowRight className="h-3 w-3 ml-1" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Master Kubernetes by <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Practicing</span>. Not Just Watching.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Learn Kubernetes through real-world interactive labs, hands-on terminal sessions, and practical DevOps challenges directly in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/playground">
              <Button size="lg" variant="k8s" className="w-full sm:w-auto h-12 px-8 text-base space-x-2">
                <Play className="h-4 w-4 fill-white" />
                <span>Start Practicing Now</span>
              </Button>
            </Link>
            <Link href="/labs">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base space-x-2 border-slate-700 hover:bg-slate-800/80">
                <Layers className="h-4 w-4 text-blue-400" />
                <span>Explore 22 Lab Tracks</span>
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-slate-800/60 mt-12">
            <div className="p-3">
              <div className="text-2xl font-bold text-white">22+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Lab Categories</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Real kubectl Shell</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-emerald-400">&lt; 3s</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Sandbox Launch</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-purple-400">0 Install</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Zero Local Setup</div>
            </div>
          </div>
        </div>

        {/* Live Terminal & IDE Preview Mockup */}
        <div className="max-w-5xl mx-auto mt-16 rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-blue-950/20 overflow-hidden">
          {/* Mock Window Titlebar */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">kubelab-session-4b92 :: k3s-cluster-v1.30</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-950/20 text-[10px]">
                Cluster Ready
              </Badge>
              <span className="font-mono text-slate-400">Session TTL: 28:45</span>
            </div>
          </div>

          {/* Split Pane Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] font-mono text-xs">
            {/* Left: Terminal output */}
            <div className="lg:col-span-7 p-5 bg-slate-950 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-900">
                <span className="flex items-center space-x-1.5 text-blue-400 font-semibold">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>xterm.js WebTTY</span>
                </span>
                <span className="text-slate-500">bash 5.2</span>
              </div>
              <div className="text-slate-300 space-y-1.5 leading-relaxed">
                <div>
                  <span className="text-emerald-400 font-bold">student@kubelab</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-slate-300">$ </span>
                  <span className="text-amber-200">kubectl create deployment web-app --image=nginx:alpine --replicas=3</span>
                </div>
                <div className="text-slate-400">deployment.apps/web-app created</div>
                <div className="pt-1">
                  <span className="text-emerald-400 font-bold">student@kubelab</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-slate-300">$ </span>
                  <span className="text-amber-200">kubectl get pods -l app=web-app</span>
                </div>
                <div className="text-slate-300">
                  <div className="text-slate-500 font-semibold">NAME                        READY   STATUS    RESTARTS   AGE</div>
                  <div>web-app-6bf4f877d9-c4k2m   1/1     Running   0          12s</div>
                  <div>web-app-6bf4f877d9-j8w9p   1/1     Running   0          12s</div>
                  <div>web-app-6bf4f877d9-z4t1l   1/1     Running   0          12s</div>
                </div>
                <div className="pt-1">
                  <span className="text-emerald-400 font-bold">student@kubelab</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-slate-300">$ </span>
                  <span className="text-amber-200">kubectl expose deployment web-app --port=80 --target-port=80 --type=ClusterIP</span>
                </div>
                <div className="text-slate-400">service/web-app exposed</div>
                <div className="pt-2 flex items-center space-x-2 text-emerald-400">
                  <span className="animate-pulse">●</span>
                  <span>Evaluator: Task 1 & 2 passed! (+50 XP)</span>
                </div>
              </div>
            </div>

            {/* Right: Monaco YAML spec preview */}
            <div className="lg:col-span-5 p-5 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                <span className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>deployment.yaml (Monaco)</span>
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Validated</span>
              </div>
              <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80`}
              </pre>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Live K8s API Sync: Active</span>
                <Link href="/playground">
                  <Button size="sm" variant="k8s" className="text-xs h-7 px-3">
                    Try Live Playground
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-blue-400 border-blue-500/30">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything you need to master production Kubernetes
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            No mock shells or static multiple choice quizzes. Real hands-on infrastructure engineered for genuine DevOps competency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-2">
                <Terminal className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle>Genuine Kubernetes Terminal</CardTitle>
              <CardDescription>
                Full xterm.js terminal connected over low-latency WebSockets to dedicated Linux runner pods with pre-configured kubectl, k9s, and helm.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:border-indigo-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center mb-2">
                <Code2 className="h-6 w-6 text-indigo-400" />
              </div>
              <CardTitle>Monaco YAML Studio</CardTitle>
              <CardDescription>
                Write and edit Kubernetes manifests with YAML schema validation, built-in templates, and a 1-click &apos;Apply to Cluster&apos; direct action.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle>Automated Lab Evaluation</CardTitle>
              <CardDescription>
                Our infrastructure engine inspects the actual Kubernetes API in your namespace to verify object states, replicas, and container health.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <CardTitle>Zero-Trust Sandbox Isolation</CardTitle>
              <CardDescription>
                Each user gets an isolated namespace governed by strict NetworkPolicies, non-root runtimes, and ResourceQuotas to guarantee safety.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="hover:border-amber-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <CardTitle>Live Resource Dashboard</CardTitle>
              <CardDescription>
                Watch your cluster come alive. Real-time visual cards show pod status, restarts, age, and health metrics directly alongside the terminal.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="hover:border-pink-500/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-pink-600/10 border border-pink-500/30 flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-pink-400" />
              </div>
              <CardTitle>Gamification & Telemetry</CardTitle>
              <CardDescription>
                Earn XP points, unlock milestone badges, maintain learning streaks, and track your progression on global leaderboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Curriculum & Roadmap Section */}
      <section id="roadmap" className="py-20 bg-slate-900/40 border-y border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Badge variant="outline" className="text-purple-400 border-purple-500/30 mb-2">
                Curriculum Roadmap
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Comprehensive 22-Category Learning Path
              </h2>
              <p className="text-slate-400 mt-2 max-w-xl">
                Structured progressively from Pod primitives to enterprise RBAC, NetworkPolicies, and cluster administration.
              </p>
            </div>
            <Link href="/labs">
              <Button variant="outline" className="space-x-2">
                <span>View All Practical Labs</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, idx) => (
              <div
                key={cat.title}
                className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500">Track #{String(idx + 1).padStart(2, "0")}</span>
                    <Badge
                      variant={
                        cat.level === "Beginner"
                          ? "default"
                          : cat.level === "Intermediate"
                          ? "warning"
                          : "purple"
                      }
                      className="text-[11px]"
                    >
                      {cat.level}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                  <span>{cat.count}</span>
                  <Link
                    href={`/labs?cat=${encodeURIComponent(cat.title)}`}
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <span>Start Track</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-14">
          <Badge variant="outline" className="text-blue-400 border-blue-500/30">
            Engineered With Leading Standards
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Production-Ready Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Cpu className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">Kubernetes</div>
            <div className="text-xs text-slate-400">Kind / K3s</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Database className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">Supabase</div>
            <div className="text-xs text-slate-400">Auth, Postgres, RLS</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Server className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">Next.js 14</div>
            <div className="text-xs text-slate-400">App Router & React</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Terminal className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">xterm.js</div>
            <div className="text-xs text-slate-400">WebTTY Terminal</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Code2 className="h-8 w-8 text-sky-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">Monaco</div>
            <div className="text-xs text-slate-400">YAML Studio</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <Lock className="h-8 w-8 text-pink-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-white">Docker</div>
            <div className="text-xs text-slate-400">Container Runtime</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-900/30 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Answers to common questions regarding our lab environments and architecture.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/80 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-base font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-900 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/60 -z-10" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to become a certified Kubernetes expert?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Join developers and DevOps engineers practicing on real clusters today. Zero setup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="k8s" className="h-12 px-8 text-base">
                Create Free Account
              </Button>
            </Link>
            <Link href="/playground">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-700">
                Launch Sandbox Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
