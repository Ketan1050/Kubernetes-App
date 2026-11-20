import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KubeLab – Online Kubernetes Practice Platform",
  description:
    "Master Kubernetes through real-world interactive labs, hands-on terminal sessions, and practical DevOps challenges directly in your browser.",
  keywords: [
    "Kubernetes",
    "K8s",
    "DevOps",
    "kubectl",
    "Docker",
    "Interactive Labs",
    "CKA",
    "CKAD",
    "Hands-on",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="font-sans min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
