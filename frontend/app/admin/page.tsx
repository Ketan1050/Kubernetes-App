"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Server,
  Plus,
  Trash2,
  Edit,
  Activity,
  Cpu,
  Layers,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"labs" | "sessions" | "users">("labs");

  const labs = [
    { id: "1", title: "Deploy Your First Nginx Pod", category: "Pods", difficulty: "Beginner", status: "Published", completions: 142 },
    { id: "2", title: "Create and Scale Deployments", category: "Deployments", difficulty: "Beginner", status: "Published", completions: 98 },
    { id: "3", title: "Exposing Applications with ClusterIP Services", category: "Services", difficulty: "Beginner", status: "Published", completions: 85 },
    { id: "4", title: "Externalizing Config with ConfigMaps", category: "ConfigMaps", difficulty: "Intermediate", status: "Published", completions: 64 },
    { id: "5", title: "Configure Namespace RBAC Security", category: "RBAC", difficulty: "Advanced", status: "Draft", completions: 12 },
  ];

  const activeSessions = [
    { id: "sess-a91f42", user: "k8s_cadet", namespace: "lab-session-a91f42", status: "Active", ttl: "24m 12s", cpuUsage: "45m", memory: "118Mi" },
    { id: "sess-b38d91", user: "sarah_cloud", namespace: "lab-session-b38d91", status: "Active", ttl: "11m 45s", cpuUsage: "120m", memory: "240Mi" },
    { id: "sess-e77a10", user: "vikram_devops", namespace: "lab-session-e77a10", status: "Active", ttl: "29m 02s", cpuUsage: "60m", memory: "135Mi" },
  ];

  const users = [
    { id: "u-1", username: "k8s_cadet", email: "alex@domain.com", role: "user", xp: 1250, joined: "2026-11-15" },
    { id: "u-2", username: "sarah_cloud", email: "sarah@domain.com", role: "admin", xp: 3450, joined: "2026-10-01" },
    { id: "u-3", username: "vikram_devops", email: "vikram@domain.com", role: "user", xp: 2900, joined: "2026-10-14" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar userRole="admin" xpPoints={1250} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
                <span>KubeLab Administrator Portal</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage curriculum exercises, monitor cluster sessions, and review user telemetry
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab("labs")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "labs" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Labs ({labs.length})
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "sessions" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Active Sessions ({activeSessions.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "users" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Users ({users.length})
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Active Namespaces</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{activeSessions.length} Running</div>
            </Card>
            <Card className="border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Published Labs</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">22 Tracks</div>
            </Card>
            <Card className="border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Practice Hours</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">1,482 Hours</div>
            </Card>
          </div>

          {/* Labs Management View */}
          {activeTab === "labs" && (
            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">Curriculum Practical Exercises</span>
                <Button variant="k8s" size="sm" className="space-x-1.5 text-xs h-8">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create New Lab</span>
                </Button>
              </div>

              <div className="divide-y divide-slate-800/60 text-xs">
                {labs.map((lab) => (
                  <div key={lab.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">{lab.title}</div>
                      <div className="text-slate-400 flex items-center space-x-2">
                        <Badge variant="secondary" className="text-[10px]">{lab.category}</Badge>
                        <span>•</span>
                        <span>{lab.difficulty}</span>
                        <span>•</span>
                        <span>{lab.completions} completions</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge variant={lab.status === "Published" ? "success" : "outline"} className="text-[10px]">
                        {lab.status}
                      </Badge>
                      <button className="p-1 text-slate-400 hover:text-white" title="Edit Lab">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Active Sessions View */}
          {activeTab === "sessions" && (
            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <span className="font-semibold text-sm text-white">Active Ephemeral Kubernetes Sandboxes</span>
              </div>

              <div className="divide-y divide-slate-800/60 text-xs font-mono">
                {activeSessions.map((sess) => (
                  <div key={sess.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-blue-400">{sess.namespace}</div>
                      <div className="text-slate-400 flex items-center space-x-3">
                        <span>User: {sess.user}</span>
                        <span>TTL Left: {sess.ttl}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right text-[11px] text-slate-400">
                        <div>CPU: {sess.cpuUsage}</div>
                        <div>RAM: {sess.memory}</div>
                      </div>
                      <Button variant="destructive" size="sm" className="h-7 text-xs px-2.5">
                        Terminate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* User Management View */}
          {activeTab === "users" && (
            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <span className="font-semibold text-sm text-white">Registered Engineers</span>
              </div>

              <div className="divide-y divide-slate-800/60 text-xs">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                    <div>
                      <div className="text-sm font-semibold text-white">{u.username}</div>
                      <div className="text-slate-400">{u.email}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-amber-400 font-bold">{u.xp} XP</span>
                      <Badge variant={u.role === "admin" ? "purple" : "secondary"} className="text-[10px]">
                        {u.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
