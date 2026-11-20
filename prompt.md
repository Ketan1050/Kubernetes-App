# Project: KubeLab – Online Kubernetes Practice Platform

## 1. Project Overview

Act as a senior full-stack developer, DevOps engineer, Kubernetes architect, UI/UX designer, and cloud infrastructure engineer.

Build a complete, modern, production-oriented web application called **KubeLab**.

KubeLab is an interactive online Kubernetes learning and practice platform where students, developers, and DevOps engineers can learn Kubernetes by executing real commands directly inside their web browser.

Users should not need to install Kubernetes, Docker, Minikube, or Kind on their personal computers to use the hosted platform.

The platform must provide actual Kubernetes environments, interactive browser terminals, practical exercises, YAML editing, automated lab evaluation, progress tracking, and learning resources.

IMPORTANT: This must be a functional application. Do not build only a static dashboard, frontend mockup, or simulated terminal.

## 2. Technology Stack

Use the following technologies.

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend Platform – Supabase ONLY
Use Supabase as the only backend-as-a-service platform.

Supabase services:
- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions

Do not introduce Firebase, Appwrite, MongoDB Atlas, or another backend-as-a-service platform.

### Development Tools
- xterm.js for the interactive browser terminal.
- Monaco Editor for Kubernetes YAML editing.
- WebSockets for terminal communication.

### Kubernetes Infrastructure
- Docker for containerization.
- Kubernetes for real cluster orchestration.
- Kind for local Kubernetes development.
- K3s for lightweight hosted Kubernetes infrastructure.
- kubectl for Kubernetes command execution.
- Helm for Kubernetes package management.

### Deployment and DevOps
- Vercel for frontend hosting.
- Cloud VM or dedicated infrastructure server for Kubernetes lab workloads.
- GitHub for source code management.
- GitHub Actions for CI/CD.
- Prometheus and Grafana for monitoring.

Do not deploy Kubernetes clusters inside Vercel.

Supabase is responsible for application data and backend services. A separate, isolated infrastructure service is responsible for provisioning Kubernetes labs and handling terminal sessions.

## 3. Application Design and User Interface

Create a professional developer-focused interface inspired by modern platforms such as:
- Killercoda
- Play with Kubernetes
- GitHub Codespaces
- GitLab
- Kubernetes Dashboard

### Design requirements
- Modern dark-first interface.
- Clean developer dashboard.
- Professional typography.
- Responsive design.
- Consistent spacing and alignment.
- Sidebar navigation.
- Attractive cards and status indicators.
- Interactive charts and progress indicators.
- Smooth transitions.
- Mobile-friendly layouts.

Use a dark background with subtle blue and purple accents. Maintain readability and avoid excessive gradients.

## 4. Main Application Pages

### A. Landing Page

Create an attractive homepage containing:

- KubeLab logo and branding.
- Navigation menu.
- Hero section explaining the platform.
- Start Practicing button.
- Explore Labs button.
- Platform features.
- Kubernetes learning roadmap.
- Example terminal preview.
- Technology stack.
- Frequently asked questions.
- Footer.

Main headline:

"Master Kubernetes by Practicing. Not Just Watching."

Subtitle:

"Learn Kubernetes through real-world interactive labs, hands-on terminal sessions, and practical DevOps challenges directly in your browser."

### B. Authentication

Implement:
- User registration.
- Login.
- Logout.
- Forgot password.
- Password reset.
- Email verification.
- Protected routes.
- User profile.

Use Supabase Authentication.

### C. User Dashboard

Display:
- Welcome message.
- Total completed labs.
- Available labs.
- Current learning level.
- Learning progress.
- Total practice time.
- Achievements.
- Recent activities.
- Recommended next practical.
- Continue learning button.

### D. Kubernetes Labs

Create a dedicated lab library with categories:

1. Kubernetes Fundamentals
2. Pods
3. Deployments
4. ReplicaSets
5. Services
6. Namespaces
7. ConfigMaps
8. Secrets
9. Volumes and Persistent Volumes
10. Persistent Volume Claims
11. Ingress
12. StatefulSets
13. DaemonSets
14. Jobs and CronJobs
15. RBAC
16. Network Policies
17. Resource Management
18. Helm
19. Monitoring and Logging
20. Kubernetes Troubleshooting
21. Kubernetes Security
22. Cluster Administration

Each lab must contain:
- Lab title.
- Difficulty level.
- Estimated completion time.
- Learning objectives.
- Detailed instructions.
- Required tasks.
- Expected results.
- Hints.
- Validation criteria.
- Reset lab option.

### E. Interactive Kubernetes Playground

This is the most important module.

Build a browser-based Kubernetes workspace.

The workspace should have:

1. Terminal panel.
2. YAML editor panel.
3. Kubernetes resource overview.
4. Lab instructions panel.
5. Command output.
6. Reset environment button.
7. Session timer.
8. Submit practical button.

The terminal must execute actual Kubernetes commands.

Example commands:

kubectl get pods
kubectl get nodes
kubectl get deployments
kubectl get services
kubectl describe pod nginx
kubectl logs nginx
kubectl create deployment nginx --image=nginx
kubectl scale deployment nginx --replicas=3
kubectl delete pod nginx

Use xterm.js in the frontend and a secure terminal gateway in the infrastructure layer.

Implement real-time terminal input and output using WebSockets.

Do not create a fake terminal that only displays predefined command responses.

### F. YAML Editor

Use Monaco Editor.

Features:
- YAML syntax highlighting.
- Kubernetes YAML templates.
- Edit configuration files.
- Validate YAML syntax.
- Apply YAML to the actual cluster.
- Save YAML configurations.
- Download YAML files.
- Reset editor.
- Display Kubernetes API validation errors.

Example:

apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80

### G. Kubernetes Resource Dashboard

Display actual Kubernetes resources from the user's lab environment.

Include:
- Nodes.
- Pods.
- Deployments.
- Services.
- Namespaces.
- ConfigMaps.
- Secrets.
- Persistent Volumes.
- Persistent Volume Claims.

Show:
- Resource name.
- Status.
- Namespace.
- Creation time.
- Health information.

Do not display hardcoded resource information.

### H. Lab Evaluation System

Build an automated practical evaluation engine.

Example:

Lab: Deploy Nginx with three replicas.

Validation:
1. Deployment exists.
2. Deployment uses the Nginx image.
3. Desired replica count is three.
4. Three replicas are available.

When all conditions are satisfied:
- Mark the lab as completed.
- Award points.
- Update user progress.
- Display success feedback.

Evaluation must inspect actual Kubernetes resources through a trusted infrastructure service.

### I. Learning Progress and Gamification

Implement:
- XP points.
- Achievement badges.
- Completed labs.
- Learning streaks.
- Difficulty-based levels.
- Leaderboard.
- User progress history.

Store progress in Supabase PostgreSQL.

### J. Admin Dashboard

Create an administrator panel to manage:
- Users.
- Lab categories.
- Practical exercises.
- Lab instructions.
- Difficulty levels.
- User achievements.
- Platform statistics.

Restrict administrator features using secure role-based access control.

## 5. Database Design – Supabase PostgreSQL

Create an appropriate relational schema.

Suggested tables:

### profiles
- id
- username
- full_name
- avatar_url
- role
- created_at

### labs
- id
- title
- description
- category
- difficulty
- instructions
- estimated_time
- points
- is_published
- created_at

### lab_tasks
- id
- lab_id
- title
- description
- validation_config
- task_order

### user_lab_progress
- id
- user_id
- lab_id
- status
- score
- completed_at
- time_spent

### lab_sessions
- id
- user_id
- lab_id
- environment_id
- status
- started_at
- expires_at
- ended_at

### achievements
- id
- name
- description
- icon
- points

### user_achievements
- id
- user_id
- achievement_id
- unlocked_at

### activity_logs
- id
- user_id
- activity_type
- description
- created_at

Create proper foreign keys, indexes, constraints, and Row Level Security (RLS) policies.

Users must only access their own private data. Public lab content can be read by authenticated users according to the access policy.

Never expose Supabase service-role keys in frontend code.

## 6. Kubernetes Lab Infrastructure

Implement a separate infrastructure service for Kubernetes environments.

Requirements:

1. User clicks Start Lab.
2. Backend verifies user authentication.
3. Infrastructure service provisions an isolated practice environment.
4. A Kubernetes cluster or appropriately isolated lab environment becomes available.
5. A secure terminal session is established.
6. User executes actual kubectl commands.
7. The lab evaluator checks the actual cluster state.
8. User completes the practical.
9. Session expires automatically.
10. Environment and temporary resources are cleaned up.

For initial development:
- Use Kind for local cluster development.
- Use K3s or dedicated Kubernetes worker infrastructure for hosted environments.

Implement:
- Environment creation.
- Environment deletion.
- Session management.
- Resource quotas.
- CPU and memory limits.
- Automatic expiration.
- Network restrictions.
- Audit logging.

IMPORTANT SECURITY REQUIREMENTS:

- Never expose Kubernetes cluster-admin credentials to the browser.
- Never expose Docker socket access to users.
- Never execute arbitrary terminal commands directly on the application server.
- Never allow users to access other users' environments.
- Isolate workloads and terminal sessions.
- Restrict dangerous host access and privileged containers.
- Apply network policies and resource limits.
- Validate all infrastructure requests.
- Protect terminal WebSocket connections with authenticated, short-lived session authorization.
- Use a trusted infrastructure agent with narrowly scoped permissions.

## 7. Supabase Integration

Use Supabase for:
- Authentication.
- Database operations.
- User profiles.
- Lab metadata.
- Learning progress.
- Achievements.
- File storage.
- Realtime progress updates.
- Edge Functions for suitable application workflows.

Use database migrations to manage the schema.

Implement Row Level Security for all user-owned records.

Do not use Supabase as a replacement for a real Kubernetes execution environment.

## 8. Project Folder Structure

Use a modular and maintainable project structure.

Suggested structure:

kube-lab/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── labs/
│   │   ├── playground/
│   │   ├── achievements/
│   │   ├── profile/
│   │   └── admin/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase/
│   ├── types/
│   └── public/
│
├── infrastructure/
│   ├── provisioning/
│   ├── terminal-gateway/
│   ├── evaluator/
│   ├── kubernetes/
│   ├── security/
│   └── Dockerfile
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
│
├── labs/
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
│
├── k8s/
│   ├── namespaces/
│   ├── deployments/
│   └── policies/
│
├── .github/
│   └── workflows/
│
├── docs/
│
└── README.md

You may refine the structure where technically necessary.

## 9. Testing Requirements

Implement:
- Frontend component testing.
- Authentication testing.
- Supabase database testing.
- API testing.
- Terminal connection testing.
- Kubernetes provisioning tests.
- Practical evaluation tests.
- Session expiration tests.
- Security and isolation tests.

Use realistic test data and actual Kubernetes environments for infrastructure integration tests.

## 10. Deployment Requirements

Frontend:
Deploy Next.js on Vercel.

Application backend:
Use Supabase services and a dedicated infrastructure service.

Kubernetes:
Deploy the lab infrastructure on a cloud VM or dedicated Kubernetes-capable servers.

CI/CD:
Use GitHub Actions.

Monitoring:
Use Prometheus and Grafana.

Provide environment variable examples in .env.example.

Never commit API secrets, credentials, or kubeconfig files.

## 11. Development Approach

Build the application incrementally.

Phase 1: Project setup and frontend architecture.

Phase 2: Supabase configuration and authentication.

Phase 3: Dashboard and lab library.

Phase 4: Interactive terminal UI.

Phase 5: Secure terminal gateway and Kubernetes provisioning.

Phase 6: YAML editor and real Kubernetes integration.

Phase 7: Lab evaluation engine.

Phase 8: Progress tracking and achievements.

Phase 9: Admin dashboard.

Phase 10: Testing, security hardening, and deployment.

Do not attempt to generate the entire project in one enormous code response.

For each phase:
- Explain the architecture.
- Create the required files.
- Provide complete working code.
- Explain where each file belongs.
- Provide installation commands.
- Explain environment variables.
- Test the implementation.
- Fix errors before moving to the next phase.

## 12. Final Expected Result

Deliver a complete KubeLab platform where:

- Users can register and log in.
- Users can browse Kubernetes practicals.
- Users can start actual Kubernetes lab environments.
- Users can execute real kubectl commands in their browser.
- Users can edit and apply YAML files.
- Users can monitor their Kubernetes resources.
- Users can complete practical challenges.
- The platform automatically evaluates practical exercises.
- Users can earn points and track progress.
- Admins can manage labs and users.
- Lab environments expire and are cleaned up securely.

The final application must be functional, scalable in architecture, maintainable, secure, and suitable for a major college project as well as a future real-world product.

## 13. First Task

Before writing code:

1. Analyze the complete project requirements.
2. Finalize the technical architecture.
3. Explain how the frontend, Supabase, terminal gateway, and Kubernetes infrastructure communicate.
4. Identify security risks and infrastructure requirements.
5. Create the project folder structure.
6. Provide a detailed development roadmap.

Then begin Phase 1.

Do not skip architecture planning or security considerations.