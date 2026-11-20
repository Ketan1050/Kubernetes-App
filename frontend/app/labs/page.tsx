"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Filter,
  Clock,
  Play,
  CheckCircle2,
  Trophy,
  Layers,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { LabCategory, LabDifficulty } from "@/types";

interface LabItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: LabCategory;
  difficulty: LabDifficulty;
  time: string;
  points: number;
  completed?: boolean;
}

export default function LabsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allLabs: LabItem[] = [
    {
      id: "1",
      slug: "intro-first-pod",
      title: "Deploy Your First Nginx Pod",
      description: "Learn how to inspect the cluster, run your first containerized workload using an imperative kubectl command, and inspect its runtime status.",
      category: "Pods",
      difficulty: "Beginner",
      time: "10 mins",
      points: 50,
      completed: true,
    },
    {
      id: "2",
      slug: "scale-deployment-replicas",
      title: "Create and Scale Deployments",
      description: "Deploy a high-availability microservice deployment and scale its replicas to handle increased student traffic.",
      category: "Deployments",
      difficulty: "Beginner",
      time: "15 mins",
      points: 75,
      completed: false,
    },
    {
      id: "3",
      slug: "expose-service-clusterip",
      title: "Exposing Applications with ClusterIP Services",
      description: "Create a stable network endpoint to allow internal communication between pods using Kubernetes CoreDNS.",
      category: "Services",
      difficulty: "Beginner",
      time: "15 mins",
      points: 75,
      completed: true,
    },
    {
      id: "4",
      slug: "configmaps-env-injection",
      title: "Externalizing Config with ConfigMaps",
      description: "Decouple application configuration from container images by injecting environment variables via ConfigMaps.",
      category: "ConfigMaps",
      difficulty: "Intermediate",
      time: "20 mins",
      points: 100,
      completed: false,
    },
    {
      id: "5",
      slug: "rbac-namespace-role",
      title: "Configure Namespace RBAC Security",
      description: "Create a Role and RoleBinding to grant a developer ServiceAccount read-only pod access according to the least-privilege principle.",
      category: "RBAC",
      difficulty: "Advanced",
      time: "25 mins",
      points: 150,
      completed: false,
    },
    {
      id: "6",
      slug: "network-policy-isolation",
      title: "Enforce Pod-to-Pod Zero-Trust Network Policy",
      description: "Implement default-deny ingress network policies to block unauthorized access to a backend database pod.",
      category: "Network Policies",
      difficulty: "Advanced",
      time: "25 mins",
      points: 150,
      completed: false,
    },
    {
      id: "7",
      slug: "persistent-volumes-nfs",
      title: "Provision PersistentVolumes & PVCs",
      description: "Configure stateful storage bindings using PersistentVolumes, PersistentVolumeClaims, and hostPath storage classes.",
      category: "Volumes and Persistent Volumes",
      difficulty: "Intermediate",
      time: "20 mins",
      points: 100,
      completed: false,
    },
    {
      id: "8",
      slug: "statefulset-redis-cluster",
      title: "Deploy StatefulSets with Persistent Identities",
      description: "Deploy ordered, gracefully terminated stateful applications with dedicated VolumeClaimTemplates.",
      category: "StatefulSets",
      difficulty: "Advanced",
      time: "30 mins",
      points: 200,
      completed: false,
    },
  ];

  const categories = [
    "All",
    "Kubernetes Fundamentals",
    "Pods",
    "Deployments",
    "Services",
    "ConfigMaps",
    "Secrets",
    "Volumes and Persistent Volumes",
    "StatefulSets",
    "RBAC",
    "Network Policies",
    "Kubernetes Troubleshooting",
  ];

  const filteredLabs = allLabs.filter((lab) => {
    const matchesCat = selectedCategory === "All" || lab.category === selectedCategory;
    const matchesDiff = selectedDifficulty === "All" || lab.difficulty === selectedDifficulty;
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar xpPoints={1250} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span>Kubernetes Lab Library</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Explore real hands-on Kubernetes practical exercises with automated evaluation
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-white">{filteredLabs.length}</span> labs available
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search labs by command, concept, or resource..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                      selectedDifficulty === diff
                        ? "bg-blue-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-200 text-slate-950 font-semibold"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Labs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLabs.map((lab) => (
              <Card
                key={lab.id}
                className="border-slate-800 bg-slate-900/50 hover:border-slate-700/80 transition-all flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-[11px]">
                        {lab.category}
                      </Badge>
                      <Badge
                        variant={
                          lab.difficulty === "Beginner"
                            ? "default"
                            : lab.difficulty === "Intermediate"
                            ? "warning"
                            : "purple"
                        }
                        className="text-[11px]"
                      >
                        {lab.difficulty}
                      </Badge>
                    </div>

                    {lab.completed && (
                      <span className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <CardTitle className="text-lg text-white font-semibold">
                    {lab.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
                    {lab.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{lab.time}</span>
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">+{lab.points} XP</span>
                  </div>

                  <Link href={`/labs/${lab.slug}`}>
                    <Button variant="k8s" size="sm" className="space-x-1 h-8 text-xs">
                      <Play className="h-3 w-3 fill-white" />
                      <span>{lab.completed ? "Practice Again" : "Start Lab"}</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
