"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Star,
  Shield,
  Layers,
  Wrench,
  Rocket,
  Code2,
  TrendingUp,
} from "lucide-react";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<"badges" | "leaderboard">("badges");

  const badges = [
    {
      id: "1",
      name: "First Pod Standing",
      desc: "Successfully created and verified your first running Kubernetes Pod.",
      icon: Rocket,
      points: 50,
      unlocked: true,
      unlockedAt: "3 days ago",
    },
    {
      id: "2",
      name: "Replica Master",
      desc: "Scaled a deployment to 5 replicas with zero downtime.",
      icon: Layers,
      points: 75,
      unlocked: true,
      unlockedAt: "2 days ago",
    },
    {
      id: "3",
      name: "Network Navigator",
      desc: "Configured a ClusterIP and exposed a web workload.",
      icon: Zap,
      points: 100,
      unlocked: true,
      unlockedAt: "Yesterday",
    },
    {
      id: "4",
      name: "YAML Whisperer",
      desc: "Created and applied a valid multi-container Pod manifest using Monaco.",
      icon: Code2,
      points: 100,
      unlocked: false,
    },
    {
      id: "5",
      name: "Troubleshooter Extraordinaire",
      desc: "Diagnosed and fixed a CrashLoopBackOff container failure.",
      icon: Wrench,
      points: 150,
      unlocked: false,
    },
    {
      id: "6",
      name: "Security Guardian",
      desc: "Enforced a zero-trust NetworkPolicy blocking unauthorized traffic.",
      icon: Shield,
      points: 200,
      unlocked: false,
    },
    {
      id: "7",
      name: "Cluster Commander",
      desc: "Completed 10 interactive Kubernetes practice practicals.",
      icon: Trophy,
      points: 500,
      unlocked: false,
    },
  ];

  const leaderboard = [
    { rank: 1, user: "sarah_cloud", role: "Cluster Architect", labs: 21, xp: 3450 },
    { rank: 2, user: "vikram_devops", role: "Senior Pod Pilot", labs: 18, xp: 2900 },
    { rank: 3, user: "elena_k8s", role: "DevOps Engineer", labs: 16, xp: 2600 },
    { rank: 4, user: "k8s_cadet (You)", role: "DevOps Cadet", labs: 4, xp: 1250, isCurrent: true },
    { rank: 5, user: "marcus_sre", role: "DevOps Cadet", labs: 3, xp: 1100 },
    { rank: 6, user: "chen_wei", role: "Beginner", labs: 2, xp: 850 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar xpPoints={1250} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-amber-400" />
                <span>Achievements &amp; Leaderboard</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Track your accomplishments, earn experience points, and climb the DevOps rankings
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab("badges")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "badges" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "leaderboard" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Global Leaderboard
              </button>
            </div>
          </div>

          {activeTab === "badges" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card
                    key={badge.id}
                    className={`border transition-all ${
                      badge.unlocked
                        ? "border-blue-500/30 bg-slate-900/60 shadow-lg shadow-blue-950/20"
                        : "border-slate-800/60 bg-slate-950/40 opacity-75"
                    }`}
                  >
                    <CardHeader className="p-5">
                      <div className="flex items-start justify-between">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center border ${
                            badge.unlocked
                              ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                              : "bg-slate-900 border-slate-800 text-slate-600"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge
                          variant={badge.unlocked ? "purple" : "outline"}
                          className="text-[10px]"
                        >
                          {badge.unlocked ? `Unlocked` : `Locked`}
                        </Badge>
                      </div>

                      <CardTitle className="text-base text-white pt-3">{badge.name}</CardTitle>
                      <CardDescription className="text-slate-400 text-xs leading-relaxed">
                        {badge.desc}
                      </CardDescription>

                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-semibold font-mono">+{badge.points} XP</span>
                        {badge.unlocked && (
                          <span className="text-slate-500 text-[11px]">{badge.unlockedAt}</span>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
              <div className="p-4 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 grid grid-cols-12">
                <div className="col-span-2">Rank</div>
                <div className="col-span-5">Engineer</div>
                <div className="col-span-3">Completed Labs</div>
                <div className="col-span-2 text-right">XP Points</div>
              </div>

              <div className="divide-y divide-slate-800/60 text-sm">
                {leaderboard.map((row) => (
                  <div
                    key={row.rank}
                    className={`p-4 grid grid-cols-12 items-center transition-colors ${
                      row.isCurrent ? "bg-blue-950/20 font-semibold" : "hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="col-span-2 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          row.rank === 1
                            ? "bg-amber-500 text-slate-950"
                            : row.rank === 2
                            ? "bg-slate-300 text-slate-950"
                            : row.rank === 3
                            ? "bg-amber-700 text-white"
                            : "text-slate-400"
                        }`}
                      >
                        {row.rank}
                      </span>
                    </div>

                    <div className="col-span-5">
                      <div className="text-white text-sm">{row.user}</div>
                      <div className="text-xs text-slate-500">{row.role}</div>
                    </div>

                    <div className="col-span-3 text-slate-300 text-xs font-mono">{row.labs} Labs</div>

                    <div className="col-span-2 text-right font-mono font-bold text-amber-400">
                      {row.xp} XP
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
