"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  Award,
  CheckCircle2,
  Terminal,
  FileCode,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Shield,
  Layers,
} from "lucide-react";

export default function LabDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "intro-first-pod";

  const labData = {
    title: "Deploy Your First Nginx Pod",
    category: "Pods",
    difficulty: "Beginner",
    time: "10 mins",
    points: 50,
    description:
      "Learn how to inspect the cluster, run your first containerized workload using an imperative kubectl command, and inspect its runtime status.",
    objectives: [
      "Understand the Pod concept as the smallest deployable unit in Kubernetes",
      "Use imperative kubectl run to deploy an Nginx image",
      "Inspect Pod statuses (Pending, ContainerCreating, Running)",
      "Examine container logs and describe pod events",
    ],
    tasks: [
      {
        order: 1,
        title: "Create Pod nginx-web",
        desc: "Deploy a pod named `nginx-web` using image `nginx:alpine` in your practice namespace.",
        hint: "Run: kubectl run nginx-web --image=nginx:alpine",
      },
      {
        order: 2,
        title: "Verify Running State",
        desc: "Check that the pod reaches the `Running` phase and has 1/1 containers ready.",
        hint: "Run: kubectl get pod nginx-web",
      },
      {
        order: 3,
        title: "Inspect Pod Details",
        desc: "Examine pod IP, events, and container spec using describe.",
        hint: "Run: kubectl describe pod nginx-web",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar xpPoints={1250} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Back link */}
          <Link
            href="/labs"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Lab Catalog</span>
          </Link>

          {/* Lab Header Hero */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="default">{labData.category}</Badge>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                  {labData.difficulty}
                </Badge>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{labData.time}</span>
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-amber-400 font-medium">+{labData.points} XP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {labData.title}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {labData.description}
              </p>
            </div>

            <Link href={`/playground?lab=${slug}`}>
              <Button size="lg" variant="k8s" className="space-x-2 h-12 px-8 shrink-0">
                <Play className="h-4 w-4 fill-white" />
                <span>Launch Interactive Playground</span>
              </Button>
            </Link>
          </div>

          {/* Objectives */}
          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Learning Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                {labData.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tasks Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Required Lab Tasks</h2>
            <div className="space-y-3">
              {labData.tasks.map((task) => (
                <Card key={task.order} className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            Task {task.order}
                          </span>
                          <CardTitle className="text-base">{task.title}</CardTitle>
                        </div>
                        <CardDescription className="text-slate-300 text-xs pt-1">
                          {task.desc}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-[11px] text-slate-400 shrink-0">
                        Auto-Evaluated
                      </Badge>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center space-x-2">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>{task.hint}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
