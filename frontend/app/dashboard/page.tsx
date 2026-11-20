"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Clock,
  BookOpen,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Zap,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const user = {
    username: "k8s_cadet",
    fullName: "Alex Rivera",
    level: "Level 3 - DevOps Cadet",
    xp: 1250,
    nextLevelXp: 1500,
    completedLabs: 4,
    totalLabs: 22,
    streak: 7,
    totalTimeHours: 4.8,
  };

  const recentActivities = [
    { title: "Completed: Exposing Applications with ClusterIP", time: "2 hours ago", xp: "+75 XP", type: "success" },
    { title: "Practiced: Deploy Your First Nginx Pod", time: "Yesterday", xp: "+50 XP", type: "success" },
    { title: "Unlocked Badge: Replica Master", time: "2 days ago", xp: "+75 XP", type: "badge" },
    { title: "Terminal Session in namespace lab-session-29f1", time: "3 days ago", xp: "", type: "session" },
  ];

  const recommendedLab = {
    title: "Create and Scale Deployments",
    slug: "scale-deployment-replicas",
    category: "Deployments",
    difficulty: "Beginner",
    time: "15 mins",
    xp: 75,
    description: "Learn how to define Kubernetes Deployments, manage rolling replica sets, and test zero-downtime application updates.",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar xpPoints={user.xp} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 z-10">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Cadet Dashboard
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-400">Streak: {user.streak} days 🔥</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user.fullName}!
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                You have completed <span className="text-white font-semibold">{user.completedLabs}</span> out of{" "}
                <span className="text-white font-semibold">{user.totalLabs}</span> Kubernetes practical tracks. Continue practicing to level up your DevOps skills.
              </p>
            </div>

            <div className="z-10 flex flex-col sm:flex-row items-center gap-3">
              <Link href={`/labs/${recommendedLab.slug}`}>
                <Button variant="k8s" size="lg" className="space-x-2 shadow-lg shadow-blue-500/20">
                  <Play className="h-4 w-4 fill-white" />
                  <span>Continue Learning</span>
                </Button>
              </Link>
            </div>

            {/* Subtle glow */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-0" />
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-11 w-11 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{user.completedLabs} / {user.totalLabs}</div>
                  <div className="text-xs text-slate-400">Completed Labs</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-11 w-11 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{user.xp} XP</div>
                  <div className="text-xs text-slate-400">Total Earned XP</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-11 w-11 rounded-xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Flame className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{user.streak} Days</div>
                  <div className="text-xs text-slate-400">Active Daily Streak</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-11 w-11 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{user.totalTimeHours}h</div>
                  <div className="text-xs text-slate-400">Practice Time</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="border-slate-800 bg-slate-900/40 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-sm font-semibold text-white">{user.level}</span>
                <span className="text-xs text-slate-400 ml-2">({user.xp} / {user.nextLevelXp} XP)</span>
              </div>
              <span className="text-xs text-blue-400 font-medium">
                {user.nextLevelXp - user.xp} XP to Level 4: Senior Pod Pilot
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
              />
            </div>
          </Card>

          {/* 2-Column Split: Recommended Lab & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recommended Lab */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <span>Recommended Next Practical</span>
                </h2>
                <Link href="/labs" className="text-xs text-blue-400 hover:underline">
                  Browse all labs &rarr;
                </Link>
              </div>

              <Card className="border-blue-500/30 bg-gradient-to-br from-slate-900 to-blue-950/30 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">{recommendedLab.category}</Badge>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{recommendedLab.time}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">+{recommendedLab.xp} XP</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white">{recommendedLab.title}</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    {recommendedLab.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <div className="text-xs text-slate-400">
                    Difficulty: <span className="text-emerald-400 font-semibold">{recommendedLab.difficulty}</span>
                  </div>
                  <Link href={`/labs/${recommendedLab.slug}`}>
                    <Button variant="k8s" size="sm" className="space-x-1.5">
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Start Lab</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                <span>Recent Activity</span>
              </h2>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-3">
                {recentActivities.map((act, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between pb-3 border-b border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-slate-200">{act.title}</div>
                      <div className="text-[11px] text-slate-500">{act.time}</div>
                    </div>
                    {act.xp && (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {act.xp}
                      </span>
                    )}
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
