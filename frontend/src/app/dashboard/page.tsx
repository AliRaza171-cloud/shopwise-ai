"use client";

import { Search, Scale, Heart, History } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import QuickActionCard from "@/components/dashboard/QuickActionCard";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Welcome, {user?.name}
      </h1>
      <p className="text-ink-soft mb-9">
        Here&apos;s what you can do once every phase is wired up.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <QuickActionCard
          title="Start a search"
          description="Tell the AI what you're after and your budget."
          href="/search"
          icon={Search}
        />
        <QuickActionCard
          title="Compare products"
          description="Put two or more picks side by side."
          href="/compare"
          icon={Scale}
        />
        <QuickActionCard
          title="Your wishlist"
          description="Products you've saved for later."
          href="/wishlist"
          icon={Heart}
        />
        <QuickActionCard
          title="Search history"
          description="Revisit what you've searched before."
          href="/history"
          icon={History}
        />
      </div>
    </DashboardShell>
  );
}
