"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Wifi,
  WifiOff,
  Copy,
  Check,
} from "lucide-react";

interface XTermTerminalProps {
  sessionId?: string;
  wsEndpoint?: string;
  onCommandRun?: (cmd: string) => void;
}

export function XTermTerminal({ sessionId = "demo", wsEndpoint, onCommandRun }: XTermTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermInstance = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js instance
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: "bar",
      fontSize: fontSize,
      fontFamily: "'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
      theme: {
        background: "#090d16",
        foreground: "#cbd5e1",
        cursor: "#38bdf8",
        selectionBackground: "rgba(56, 189, 248, 0.3)",
        black: "#0f172a",
        red: "#ef4444",
        green: "#10b981",
        yellow: "#f59e0b",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#06b6d4",
        white: "#f8fafc",
        brightBlack: "#475569",
        brightRed: "#f87171",
        brightGreen: "#34d399",
        brightYellow: "#fbbf24",
        brightBlue: "#60a5fa",
        brightMagenta: "#c084fc",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermInstance.current = term;
    fitAddonRef.current = fitAddon;

    // Connect to WebSocket gateway
    const wsUrl =
      wsEndpoint ||
      `${process.env.NEXT_PUBLIC_GATEWAY_WS_URL || "ws://localhost:4000"}/ws/terminal?sessionId=${sessionId}`;

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (event) => {
        term.write(event.data);
      };

      socket.onclose = () => {
        setConnected(false);
      };

      socket.onerror = () => {
        setConnected(false);
        // Fallback banner when gateway is not active
        setupFallbackTerminal(term, sessionId, onCommandRun);
      };
    } catch {
      setupFallbackTerminal(term, sessionId, onCommandRun);
    }

    term.onData((data) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (socket) socket.close();
      term.dispose();
    };
  }, [sessionId, wsEndpoint]);

  // Adjust font size
  useEffect(() => {
    if (xtermInstance.current && fitAddonRef.current) {
      xtermInstance.current.options.fontSize = fontSize;
      fitAddonRef.current.fit();
    }
  }, [fontSize]);

  const setupFallbackTerminal = (term: XTerm, sessId: string, cmdCallback?: (cmd: string) => void) => {
    term.writeln("\x1b[1;34m  _  ___   _ _     _____ _      ____  \x1b[0m");
    term.writeln("\x1b[1;34m | |/ / | | | |   | ____| |    / __ \\ \x1b[0m");
    term.writeln("\x1b[1;34m | ' /| | | | |   |  _| | |   / / _` |\x1b[0m");
    term.writeln("\x1b[1;34m | . \\| |_| | |___| |___| |__| | (_| |\x1b[0m");
    term.writeln("\x1b[1;34m |_|\\_\\\\___/|_____|_____|_____\\ \\__,_|\x1b[0m");
    term.writeln("\x1b[1;34m                               \\____/ \x1b[0m");
    term.writeln("\r\n\x1b[32m✔ Connected to KubeLab In-Browser Sandbox (v1.29.2)\x1b[0m");
    term.writeln(`\x1b[90mSession: ${sessId} | Namespace: lab-session-${sessId.slice(0, 8)}\x1b[0m`);
    term.writeln("\x1b[90mType 'kubectl get pods' or 'help' to get started.\x1b[0m\r\n");
    term.write("\x1b[1;32mstudent@kubelab\x1b[0m:\x1b[1;34m~\x1b[0m$ ");

    let inputBuffer = "";
    term.onData((data) => {
      if (data === "\r" || data === "\n") {
        term.write("\r\n");
        const cmd = inputBuffer.trim();
        inputBuffer = "";

        if (cmd.length > 0) {
          if (cmdCallback) cmdCallback(cmd);
          if (cmd === "clear") {
            term.clear();
          } else if (cmd === "help") {
            term.writeln("Available commands:");
            term.writeln("  kubectl get pods");
            term.writeln("  kubectl get nodes");
            term.writeln("  kubectl get deployments");
            term.writeln("  kubectl get services");
            term.writeln("  kubectl run <name> --image=<image>");
            term.writeln("  kubectl create deployment <name> --image=<image>");
            term.writeln("  kubectl scale deployment <name> --replicas=<num>");
            term.writeln("  kubectl expose deployment <name> --port=<num>");
            term.writeln("  clear, whoami, pwd");
          } else if (cmd === "whoami") {
            term.writeln("student");
          } else if (cmd === "kubectl get nodes") {
            term.writeln("NAME                   STATUS   ROLES           AGE   VERSION");
            term.writeln("kubelab-control-plane  Ready    control-plane   14d   v1.29.2");
            term.writeln("kubelab-worker-01      Ready    <none>          14d   v1.29.2");
          } else if (cmd.startsWith("kubectl get pods")) {
            term.writeln("NAME                        READY   STATUS    RESTARTS   AGE");
            term.writeln("nginx-web                   1/1     Running   0          45s");
            term.writeln("webapp-deployment-c4k2m     1/1     Running   0          12s");
            term.writeln("webapp-deployment-j8w9p     1/1     Running   0          12s");
            term.writeln("webapp-deployment-z4t1l     1/1     Running   0          12s");
          } else if (cmd.startsWith("kubectl get deployments") || cmd.startsWith("kubectl get deploy")) {
            term.writeln("NAME                READY   UP-TO-DATE   AVAILABLE   AGE");
            term.writeln("webapp-deployment   3/3     3            3           2m");
          } else if (cmd.startsWith("kubectl get svc") || cmd.startsWith("kubectl get services")) {
            term.writeln("NAME             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE");
            term.writeln("kubernetes       ClusterIP   10.96.0.1      <none>        443/TCP   14d");
            term.writeln("webapp-service   ClusterIP   10.96.142.88   <none>        80/TCP    1m");
          } else if (cmd.startsWith("kubectl run")) {
            const parts = cmd.split(" ");
            term.writeln(`pod/${parts[2] || "pod"} created`);
          } else if (cmd.startsWith("kubectl create deployment")) {
            const parts = cmd.split(" ");
            term.writeln(`deployment.apps/${parts[3] || "deployment"} created`);
          } else if (cmd.startsWith("kubectl scale")) {
            term.writeln("deployment.apps scaled");
          } else if (cmd.startsWith("kubectl expose")) {
            term.writeln("service exposed");
          } else {
            term.writeln(`command executed: ${cmd}`);
          }
        }
        term.write("\x1b[1;32mstudent@kubelab\x1b[0m:\x1b[1;34m~\x1b[0m$ ");
      } else if (data === "\x7f" || data === "\b") {
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        inputBuffer += data;
        term.write(data);
      }
    });
  };

  const handleClear = () => {
    xtermInstance.current?.clear();
  };

  const handleCopy = () => {
    if (xtermInstance.current) {
      const selection = xtermInstance.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-[#090d16] rounded-xl border border-slate-800 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
      }`}
    >
      {/* Terminal Titlebar & Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-slate-400 font-medium pl-1">
            terminal-runner (bash 5.2)
          </span>
          <span className="flex items-center space-x-1 text-[11px] text-slate-500">
            {connected ? (
              <span className="flex items-center space-x-1 text-emerald-400">
                <Wifi className="h-3 w-3" />
                <span>Live Socket</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-blue-400">
                <WifiOff className="h-3 w-3" />
                <span>Sandbox Ready</span>
              </span>
            )}
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-1 text-slate-400">
          <button
            onClick={() => setFontSize(Math.min(18, fontSize + 1))}
            className="p-1 hover:text-white rounded"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            className="p-1 hover:text-white rounded"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 hover:text-white rounded"
            title="Copy Selection"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleClear}
            className="p-1 hover:text-white rounded"
            title="Clear Terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:text-white rounded"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div ref={terminalRef} className="flex-1 w-full p-2 overflow-hidden" />
    </div>
  );
}
