import React from "react";
import Link from "next/link";
import { Terminal, Shield, Cpu, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Terminal className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Kube<span className="text-blue-400">Lab</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The next-generation online interactive Kubernetes practice platform. Execute real kubectl commands in real cloud environments without local setup.
          </p>
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Infrastructure Status: Operational</span>
          </div>
        </div>

        {/* Curriculum */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Curriculum
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/labs?cat=Fundamentals" className="hover:text-blue-400 transition-colors">Kubernetes Fundamentals</Link></li>
            <li><Link href="/labs?cat=Pods" className="hover:text-blue-400 transition-colors">Pod Management</Link></li>
            <li><Link href="/labs?cat=Deployments" className="hover:text-blue-400 transition-colors">Deployments & Scaling</Link></li>
            <li><Link href="/labs?cat=Services" className="hover:text-blue-400 transition-colors">Services & Networking</Link></li>
            <li><Link href="/labs?cat=RBAC" className="hover:text-blue-400 transition-colors">RBAC & Security</Link></li>
            <li><Link href="/labs" className="text-blue-400 hover:underline">All 22 Categories &rarr;</Link></li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/playground" className="hover:text-blue-400 transition-colors">Browser Terminal</Link></li>
            <li><Link href="/playground" className="hover:text-blue-400 transition-colors">Monaco YAML Studio</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Progress Dashboard</Link></li>
            <li><Link href="/achievements" className="hover:text-blue-400 transition-colors">Badges & XP</Link></li>
            <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Security & Architecture */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
            Architecture
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Zero-Trust Namespace Sandbox</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              <span>Dedicated K3s / Kind Engines</span>
            </li>
            <li className="flex items-center space-x-1.5">
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>Low-Latency WebTTY Gateway</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} KubeLab. Built for engineers, developers, and DevOps practitioners.</p>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/docs/ARCHITECTURE.md" className="hover:text-slate-300">Architecture</Link>
          <Link href="/docs/SECURITY.md" className="hover:text-slate-300">Security Model</Link>
          <Link href="/docs/ROADMAP.md" className="hover:text-slate-300">Roadmap</Link>
        </div>
      </div>
    </footer>
  );
}
