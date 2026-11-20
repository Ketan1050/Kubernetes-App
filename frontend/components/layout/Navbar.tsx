"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Shield, Compass, BookOpen, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] transition-transform group-hover:scale-105">
            <div className="h-full w-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Terminal className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Kube<span className="text-blue-400">Lab</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Live
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/labs"
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span>Explore Labs</span>
          </Link>
          <Link
            href="/playground"
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <Terminal className="h-4 w-4 text-indigo-400" />
            <span>Interactive Playground</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <Compass className="h-4 w-4 text-purple-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/#roadmap"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Roadmap
          </Link>
          <Link
            href="/#faq"
            className="text-slate-300 hover:text-white transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="k8s" size="sm" className="space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-200" />
              <span>Get Started Free</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/labs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-white"
          >
            Explore Labs
          </Link>
          <Link
            href="/playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-white"
          >
            Interactive Playground
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/#roadmap"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-white"
          >
            Roadmap
          </Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="k8s" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
