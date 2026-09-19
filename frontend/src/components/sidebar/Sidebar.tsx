"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Scale,
  Heart,
  History,
  Settings,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Search", href: "/search", icon: Search },
  { label: "Compare", href: "/compare", icon: Scale },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "History", href: "/history", icon: History },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = user?.is_admin
    ? [...NAV_ITEMS, { label: "Admin", href: "/admin", icon: ShieldCheck }]
    : NAV_ITEMS;

  return (
    <aside className="w-64 shrink-0 bg-card border-r border-ink/10 min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-ink/10">
        <Link href="/" className="font-display font-bold text-2xl text-teal-dark">
          Sahi
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm transition-colors ${
                active
                  ? "bg-teal text-paper font-medium"
                  : "text-ink-soft hover:bg-paper-dim hover:text-ink"
              }`}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-ink/10">
        <div className="mb-4">
          <ThemeToggle />
        </div>
        {user && (
          <p className="text-sm font-medium mb-0.5 truncate">{user.name}</p>
        )}
        {user && (
          <p className="text-xs text-ink-soft mb-3 truncate">{user.email}</p>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-ink-soft hover:text-brick transition-colors"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}
