"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search as SearchIcon, Heart, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import * as adminApi from "@/services/adminApi";
import type { AdminUser, AdminStats, AdminSearch } from "@/services/adminApi";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searches, setSearches] = useState<AdminSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "activity">("users");

  // Non-admins get bounced to the dashboard rather than seeing this page.
  useEffect(() => {
    if (!authLoading && user && !user.is_admin) {
      router.push("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.is_admin) return;
    Promise.all([adminApi.getAdminStats(), adminApi.getAdminUsers(), adminApi.getAdminSearches()])
      .then(([s, u, sr]) => {
        setStats(s);
        setUsers(u);
        setSearches(sr);
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function handleToggleAdmin(target: AdminUser) {
    const updated = await adminApi.updateAdminUser(target.id, { is_admin: !target.is_admin });
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  async function handleToggleActive(target: AdminUser) {
    const updated = await adminApi.updateAdminUser(target.id, { is_active: !target.is_active });
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  if (authLoading || !user?.is_admin) {
    return (
      <DashboardShell>
        <p className="font-mono text-xs text-ink-soft">Loading...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">Admin</h1>
      <p className="text-ink-soft mb-8">Platform overview and user management.</p>

      {loading ? (
        <p className="font-mono text-xs text-ink-soft">Loading...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Users} label="Total users" value={stats?.total_users ?? 0} />
            <StatCard icon={SearchIcon} label="Total searches" value={stats?.total_searches ?? 0} />
            <StatCard icon={Heart} label="Wishlist saves" value={stats?.total_wishlist_items ?? 0} />
            <StatCard icon={ShieldCheck} label="Admins" value={stats?.admin_count ?? 0} />
          </div>

          <div className="flex gap-6 border-b border-ink/10 mb-6">
            <button
              onClick={() => setTab("users")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === "users" ? "border-teal text-teal-dark" : "border-transparent text-ink-soft"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setTab("activity")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === "activity" ? "border-teal text-teal-dark" : "border-transparent text-ink-soft"
              }`}
            >
              Search activity
            </button>
          </div>

          {tab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs font-mono text-ink-soft border-b border-ink/10">
                    <th className="pb-3 pr-4 font-normal">Name</th>
                    <th className="pb-3 pr-4 font-normal">Email</th>
                    <th className="pb-3 pr-4 font-normal">Joined</th>
                    <th className="pb-3 pr-4 font-normal">Role</th>
                    <th className="pb-3 pr-4 font-normal">Status</th>
                    <th className="pb-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-ink/10 text-sm">
                      <td className="py-3 pr-4">{u.name}</td>
                      <td className="py-3 pr-4 text-ink-soft">{u.email}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-ink-soft">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                            u.is_admin ? "bg-gold/15 text-gold" : "bg-paper-dim text-ink-soft"
                          }`}
                        >
                          {u.is_admin ? "admin" : "user"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                            u.is_active ? "bg-teal/15 text-teal-dark" : "bg-brick/15 text-brick"
                          }`}
                        >
                          {u.is_active ? "active" : "deactivated"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={u.id === user.id}
                            className="text-xs text-teal-dark hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                          >
                            {u.is_admin ? "Demote" : "Promote"}
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            disabled={u.id === user.id}
                            className="text-xs text-brick hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                          >
                            {u.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "activity" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[560px]">
                <thead>
                  <tr className="text-left text-xs font-mono text-ink-soft border-b border-ink/10">
                    <th className="pb-3 pr-4 font-normal">User</th>
                    <th className="pb-3 pr-4 font-normal">Query</th>
                    <th className="pb-3 pr-4 font-normal">Results</th>
                    <th className="pb-3 font-normal">When</th>
                  </tr>
                </thead>
                <tbody>
                  {searches.map((s) => (
                    <tr key={s.id} className="border-b border-ink/10 text-sm">
                      <td className="py-3 pr-4 text-ink-soft">{s.user_email}</td>
                      <td className="py-3 pr-4">{s.query}</td>
                      <td className="py-3 pr-4 font-mono text-xs">{s.result_count}</td>
                      <td className="py-3 font-mono text-xs text-ink-soft">
                        {formatDate(s.created_at)}
                      </td>
                    </tr>
                  ))}
                  {searches.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-ink-soft">
                        No searches yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border border-ink/10 rounded-sm p-5">
      <Icon size={18} className="text-teal mb-3" strokeWidth={1.75} />
      <p className="font-display font-bold text-2xl">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-xs text-ink-soft mt-0.5">{label}</p>
    </div>
  );
}
