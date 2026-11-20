"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Trophy,
  User,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: "user" | "admin";
  xpPoints?: number;
}

export function Sidebar({ userRole = "user", xpPoints = 1250 }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lab Library", href: "/labs", icon: BookOpen },
    { name: "Live Playground", href: "/playground", icon: Terminal },
    { name: "Achievements & XP", href: "/achievements", icon: Trophy },
    { name: "User Profile", href: "/profile", icon: User },
  ];

  if (userRole === "admin") {
    navigation.push({ name: "Admin Portal", href: "/admin", icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-6">
        {/* User Quick Stats Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>DevOps Cadet</span>
            <span className="font-semibold text-blue-400 flex items-center space-x-1">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>{xpPoints} XP</span>
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[65%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">Level 3: 250 XP to Level 4</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-blue-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <Link
          href="/login"
          className="flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
