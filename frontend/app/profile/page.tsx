"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Trophy, Flame, Clock, Award, Key, Check } from "lucide-react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Alex Rivera");
  const [username, setUsername] = useState("k8s_cadet");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar xpPoints={1250} />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Engineer Profile</h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage your credentials, preferences, and examine learning achievements
              </p>
            </div>
            <Badge variant="purple" className="self-start sm:self-center px-3 py-1 text-xs">
              Level 3 DevOps Cadet
            </Badge>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1,250 XP</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Experience Points</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">7 Days</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Daily Streak</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4.8 Hours</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Practice Time</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your public username and display identity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address (Managed by Supabase)</label>
                  <input
                    type="email"
                    disabled
                    value="devops.cadet@kubelab.io"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <Button type="submit" variant="k8s" size="sm">
                    {saved ? (
                      <span className="flex items-center space-x-1.5 text-emerald-200">
                        <Check className="h-4 w-4" />
                        <span>Saved Successfully</span>
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
