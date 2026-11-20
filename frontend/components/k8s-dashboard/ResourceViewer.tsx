"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCw, Layers, Server, Network, Box, Clock } from "lucide-react";

interface ResourceViewerProps {
  sessionId?: string;
  refreshTrigger?: number;
}

export function ResourceViewer({ sessionId = "demo", refreshTrigger = 0 }: ResourceViewerProps) {
  const [activeTab, setActiveTab] = useState<"pods" | "deployments" | "services">("pods");
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<any>({
    pods: [
      { name: "web-app-6bf4f877d9-c4k2m", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
      { name: "web-app-6bf4f877d9-j8w9p", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
      { name: "web-app-6bf4f877d9-z4t1l", ready: "1/1", status: "Running", restarts: 0, age: "2m" },
    ],
    deployments: [
      { name: "web-app", ready: "3/3", upToDate: 3, available: 3, age: "2m" },
    ],
    services: [
      { name: "web-app", type: "ClusterIP", clusterIP: "10.96.142.88", ports: "80/TCP", age: "1m" },
    ],
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GATEWAY_HTTP_URL || "http://localhost:4000"}/api/v1/sessions/${sessionId}/resources`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.resources) {
          setResources(data.resources);
        }
      }
    } catch {
      // In offline mode, keep simulated resources active
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    const interval = setInterval(fetchResources, 8000);
    return () => clearInterval(interval);
  }, [sessionId, refreshTrigger]);

  return (
    <div className="flex flex-col h-full bg-[#090d16] rounded-xl border border-slate-800 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab("pods")}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === "pods"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>Pods ({resources.pods?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("deployments")}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === "deployments"
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Deployments ({resources.deployments?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === "services"
                ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Services ({resources.services?.length || 0})</span>
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchResources}
          disabled={loading}
          className="h-7 px-2 text-xs text-slate-400 hover:text-white"
        >
          <RotateCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Content View */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
        {activeTab === "pods" && (
          <div className="space-y-2">
            {resources.pods?.length === 0 ? (
              <div className="text-slate-500 py-6 text-center">No pods deployed in this namespace yet.</div>
            ) : (
              resources.pods.map((pod: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-white font-medium">{pod.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                      <span>Ready: {pod.ready}</span>
                      <span>Restarts: {pod.restarts}</span>
                      <span>Age: {pod.age}</span>
                    </div>
                  </div>
                  <Badge
                    variant={pod.status === "Running" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {pod.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "deployments" && (
          <div className="space-y-2">
            {resources.deployments?.length === 0 ? (
              <div className="text-slate-500 py-6 text-center">No deployments found.</div>
            ) : (
              resources.deployments.map((dep: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-white font-medium">{dep.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                      <span>Replicas: {dep.ready}</span>
                      <span>Up-to-date: {dep.upToDate}</span>
                      <span>Available: {dep.available}</span>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    Ready
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-2">
            {resources.services?.length === 0 ? (
              <div className="text-slate-500 py-6 text-center">No services found.</div>
            ) : (
              resources.services.map((svc: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-white font-medium">{svc.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                      <span>Type: {svc.type}</span>
                      <span>ClusterIP: {svc.clusterIP}</span>
                      <span>Ports: {svc.ports}</span>
                    </div>
                  </div>
                  <Badge variant="purple" className="text-[10px]">
                    Active
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
