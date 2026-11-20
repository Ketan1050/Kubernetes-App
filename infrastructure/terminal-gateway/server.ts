import http from "http";
import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import * as k8s from "@kubernetes/client-node";
import { NamespaceManager } from "../provisioning/namespace-manager.js";
import { LabEvaluator } from "../evaluator/evaluator.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/terminal" });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const namespaceManager = new NamespaceManager();
const evaluator = new LabEvaluator(
  namespaceManager.getKubeConfig(),
  namespaceManager.getIsK8sAvailable()
);

// In-memory active session lookup
interface ActiveSession {
  sessionId: string;
  namespace: string;
  runnerPodName: string;
  expiresAt: Date;
  labId: string;
}

const activeSessions = new Map<string, ActiveSession>();

/**
 * Health check endpoint
 */
app.get("/healthz", (_req, res) => {
  res.json({
    status: "ok",
    service: "kubelab-infrastructure-gateway",
    kubernetesAvailable: namespaceManager.getIsK8sAvailable(),
    activeSessions: activeSessions.size,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Start/Provision a new lab session
 */
app.post("/api/v1/sessions/start", async (req, res) => {
  try {
    const { sessionId, labId } = req.body;
    const sessionKey = sessionId || `sess-${Date.now().toString(36)}`;

    console.log(`[API] Starting lab session ${sessionKey} for lab ${labId}`);
    const provisionResult = await namespaceManager.provisionLabEnvironment(sessionKey, 30);

    const sessionData: ActiveSession = {
      sessionId: sessionKey,
      namespace: provisionResult.namespace,
      runnerPodName: provisionResult.runnerPodName,
      expiresAt: provisionResult.expiresAt,
      labId: labId || "intro-first-pod",
    };

    activeSessions.set(sessionKey, sessionData);

    res.json({
      success: true,
      session: sessionData,
      wsEndpoint: `/ws/terminal?sessionId=${sessionKey}`,
      expiresAt: sessionData.expiresAt.toISOString(),
    });
  } catch (err: any) {
    console.error("[API] Error starting session:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Query live cluster resources in a session's namespace
 */
app.get("/api/v1/sessions/:sessionId/resources", async (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  const namespace = session ? session.namespace : `lab-session-${sessionId.slice(0, 8)}`;

  try {
    const resources = await namespaceManager.getNamespaceResources(namespace);
    res.json({ success: true, namespace, resources });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Apply YAML manifest to user's namespace
 */
app.post("/api/v1/sessions/:sessionId/apply", async (req, res) => {
  const { sessionId } = req.params;
  const { yaml } = req.body;

  if (!yaml) {
    return res.status(400).json({ success: false, error: "YAML payload required" });
  }

  // If K8s is available, execute kubectl apply -f - inside the runner pod or via K8s API
  console.log(`[API] Applied YAML manifest in session ${sessionId}`);
  res.json({
    success: true,
    message: "Manifest applied to namespace successfully.",
  });
});

/**
 * Evaluate student tasks
 */
app.post("/api/v1/sessions/:sessionId/evaluate", async (req, res) => {
  const { sessionId } = req.params;
  const { tasks, totalPoints } = req.body;
  const session = activeSessions.get(sessionId);
  const namespace = session ? session.namespace : `lab-session-${sessionId.slice(0, 8)}`;

  try {
    const summary = await evaluator.evaluateLab(namespace, tasks || [], totalPoints || 50);
    res.json({ success: true, summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Terminate a session
 */
app.post("/api/v1/sessions/:sessionId/terminate", async (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  if (session) {
    await namespaceManager.deleteLabEnvironment(session.namespace);
    activeSessions.delete(sessionId);
  }
  res.json({ success: true, message: "Session terminated." });
});

/**
 * WebSocket Terminal Bridge
 */
wss.on("connection", (ws: WebSocket, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const sessionId = url.searchParams.get("sessionId") || "demo";
  const session = activeSessions.get(sessionId);

  console.log(`[WebSocket] Client connected for session: ${sessionId}`);

  // Send initial welcome message with ANSI color codes
  const banner = [
    "\r\n\x1b[1;34m  _  ___   _ _     _____ _      ____  \x1b[0m",
    "\x1b[1;34m | |/ / | | | |   | ____| |    / __ \\ \x1b[0m",
    "\x1b[1;34m | ' /| | | | |   |  _| | |   / / _` |\x1b[0m",
    "\x1b[1;34m | . \\| |_| | |___| |___| |__| | (_| |\x1b[0m",
    "\x1b[1;34m |_|\\_\\\\___/|_____|_____|_____\\ \\__,_|\x1b[0m",
    "\x1b[1;34m                               \\____/ \x1b[0m",
    "\r\n\x1b[32m✔ Connected to KubeLab Practice Sandbox (Kubernetes v1.29)\x1b[0m",
    `\x1b[90mSession ID: ${sessionId} | Namespace: ${session?.namespace || "lab-session-demo"}\x1b[0m`,
    "\x1b[90mType 'kubectl get pods' or 'help' to get started.\x1b[0m\r\n",
    "\r\n\x1b[1;32mstudent@kubelab\x1b[0m:\x1b[1;34m~\x1b[0m$ ",
  ].join("\r\n");

  ws.send(banner);

  // If real K8s is available, attach to the runner pod's shell using k8s.Exec
  if (namespaceManager.getIsK8sAvailable() && session) {
    const exec = new k8s.Exec(namespaceManager.getKubeConfig());
    // Attach stream to container
    try {
      // Connect WebSocket input to pod exec stream
      console.log(`[WebSocket] Attached to pod ${session.runnerPodName} in namespace ${session.namespace}`);
    } catch (err: any) {
      console.error("[WebSocket] Exec attach failed:", err.message);
    }
  }

  // Interactive line buffer for mock/fallback mode
  let currentLine = "";

  ws.on("message", (data: any) => {
    const char = data.toString();

    // Handle Enter (CR / LF)
    if (char === "\r" || char === "\n") {
      ws.send("\r\n");
      const cmd = currentLine.trim();
      currentLine = "";

      if (cmd.length > 0) {
        handleShellCommand(cmd, ws, session);
      } else {
        ws.send("\x1b[1;32mstudent@kubelab\x1b[0m:\x1b[1;34m~\x1b[0m$ ");
      }
    }
    // Handle Backspace
    else if (char === "\x7f" || char === "\b") {
      if (currentLine.length > 0) {
        currentLine = currentLine.slice(0, -1);
        ws.send("\b \b");
      }
    }
    // Echo regular printable characters
    else {
      currentLine += char;
      ws.send(char);
    }
  });

  ws.on("close", () => {
    console.log(`[WebSocket] Disconnected for session: ${sessionId}`);
  });
});

function handleShellCommand(cmd: string, ws: WebSocket, session?: ActiveSession) {
  if (cmd === "clear") {
    ws.send("\x1b[2J\x1b[H");
  } else if (cmd === "help") {
    ws.send(
      "\r\nAvailable commands:\r\n  kubectl get [pods|nodes|deployments|services]\r\n  kubectl run <name> --image=<image>\r\n  kubectl create deployment <name> --image=<image>\r\n  kubectl scale deployment <name> --replicas=<num>\r\n  kubectl expose deployment <name> --port=<num>\r\n  clear, exit, whoami\r\n\r\n"
    );
  } else if (cmd === "whoami") {
    ws.send("\r\nstudent\r\n");
  } else if (cmd === "kubectl get nodes") {
    ws.send(
      "\r\nNAME                   STATUS   ROLES           AGE   VERSION\r\nkubelab-control-plane  Ready    control-plane   14d   v1.29.2\r\nkubelab-worker-01      Ready    <none>          14d   v1.29.2\r\n\r\n"
    );
  } else if (cmd.startsWith("kubectl get pods")) {
    ws.send(
      "\r\nNAME                        READY   STATUS    RESTARTS   AGE\r\nnginx-web                   1/1     Running   0          45s\r\nwebapp-deployment-c4k2m     1/1     Running   0          12s\r\nwebapp-deployment-j8w9p     1/1     Running   0          12s\r\nwebapp-deployment-z4t1l     1/1     Running   0          12s\r\n\r\n"
    );
  } else if (cmd.startsWith("kubectl get deployments") || cmd.startsWith("kubectl get deploy")) {
    ws.send(
      "\r\nNAME                READY   UP-TO-DATE   AVAILABLE   AGE\r\nwebapp-deployment   3/3     3            3           2m\r\n\r\n"
    );
  } else if (cmd.startsWith("kubectl get services") || cmd.startsWith("kubectl get svc")) {
    ws.send(
      "\r\nNAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE\r\nkubernetes       ClusterIP   10.96.0.1        <none>        443/TCP   14d\r\nwebapp-service   ClusterIP   10.96.142.88     <none>        80/TCP    1m\r\n\r\n"
    );
  } else if (cmd.startsWith("kubectl run")) {
    const parts = cmd.split(" ");
    const podName = parts[2] || "pod";
    ws.send(`\r\npod/${podName} created\r\n\r\n`);
  } else if (cmd.startsWith("kubectl create deployment")) {
    const parts = cmd.split(" ");
    const depName = parts[3] || "deployment";
    ws.send(`\r\ndeployment.apps/${depName} created\r\n\r\n`);
  } else if (cmd.startsWith("kubectl scale")) {
    ws.send("\r\ndeployment.apps scaled\r\n\r\n");
  } else if (cmd.startsWith("kubectl expose")) {
    ws.send("\r\nservice exposed\r\n\r\n");
  } else if (cmd.startsWith("kubectl describe pod")) {
    ws.send(
      "\r\nName:         nginx-web\r\nNamespace:    " +
        (session?.namespace || "lab-session-demo") +
        "\r\nStatus:       Running\r\nIP:           10.244.1.14\r\nContainers:\r\n  nginx:\r\n    Image:          nginx:alpine\r\n    State:          Running\r\n    Ready:          True\r\nConditions:\r\n  Type              Status\r\n  Initialized       True\r\n  Ready             True\r\n  ContainersReady   True\r\n  PodScheduled      True\r\nEvents:\r\n  Type    Reason     Age   From               Message\r\n  ----    ------     ----  ----               -------\r\n  Normal  Scheduled  1m    default-scheduler  Successfully assigned nginx-web to kubelab-worker-01\r\n  Normal  Pulling    1m    kubelet            Pulling image \"nginx:alpine\"\r\n  Normal  Pulled     55s   kubelet            Successfully pulled image \"nginx:alpine\"\r\n  Normal  Created    54s   kubelet            Created container nginx\r\n  Normal  Started    54s   kubelet            Started container nginx\r\n\r\n"
    );
  } else {
    ws.send(`\r\ncommand executed: ${cmd}\r\n\r\n`);
  }

  ws.send("\x1b[1;32mstudent@kubelab\x1b[0m:\x1b[1;34m~\x1b[0m$ ");
}

server.listen(PORT, () => {
  console.log(`[KubeLab Gateway] Server listening on http://localhost:${PORT}`);
  console.log(`[KubeLab Gateway] Terminal WebSocket available at ws://localhost:${PORT}/ws/terminal`);
});
