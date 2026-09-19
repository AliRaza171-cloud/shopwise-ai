"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center">
        <p className="font-mono text-sm text-ink-soft">Loading...</p>
      </main>
    );
  }

  if (!user) return null; // redirecting to /login

  return (
    <div className="min-h-screen bg-paper flex">
      <Sidebar />
      <div className="flex-1 px-9 py-9">{children}</div>
    </div>
  );
}
