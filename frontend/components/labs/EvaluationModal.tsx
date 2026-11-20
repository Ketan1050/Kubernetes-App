"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy, Sparkles, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EvaluationResult {
  taskId: string;
  taskTitle: string;
  passed: boolean;
  message: string;
}

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    success: boolean;
    totalTasks: number;
    passedTasks: number;
    pointsEarned: number;
    results: EvaluationResult[];
  } | null;
}

export function EvaluationModal({ isOpen, onClose, summary }: EvaluationModalProps) {
  useEffect(() => {
    if (isOpen && summary?.success) {
      // Fire victory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, summary]);

  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-white rounded-lg focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          {summary.success ? (
            <div className="inline-flex h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center mb-1">
              <Trophy className="h-7 w-7 text-emerald-400" />
            </div>
          ) : (
            <div className="inline-flex h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 items-center justify-center mb-1">
              <Sparkles className="h-7 w-7 text-amber-400" />
            </div>
          )}

          <h3 className="text-xl font-bold text-white">
            {summary.success ? "Lab Successfully Completed! 🎉" : "Verification In Progress"}
          </h3>
          <p className="text-xs text-slate-400">
            {summary.success
              ? `All ${summary.totalTasks} evaluation criteria satisfied. Points awarded!`
              : `${summary.passedTasks} of ${summary.totalTasks} tasks passed. Check the diagnostic feedback below.`}
          </p>

          <div className="flex items-center justify-center space-x-2 pt-1">
            <Badge variant="purple" className="text-xs font-semibold px-3 py-1">
              +{summary.pointsEarned} XP Awarded
            </Badge>
          </div>
        </div>

        {/* Task Item Checklist */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {summary.results.map((res, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                res.passed
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center space-x-2">
                  {res.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span>{res.taskTitle}</span>
                </span>
                <span className="text-[10px] uppercase font-mono">
                  {res.passed ? "Passed" : "Action Required"}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] pl-6">{res.message}</p>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} className="border-slate-700 text-xs">
            {summary.success ? "Review Sandbox" : "Keep Trying"}
          </Button>

          {summary.success ? (
            <Link href="/dashboard">
              <Button variant="k8s" size="sm" className="space-x-1.5 text-xs">
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : (
            <Button variant="k8s" size="sm" onClick={onClose} className="text-xs">
              Back to Terminal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
