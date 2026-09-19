"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History as HistoryIcon, RotateCcw } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import * as api from "@/services/api";
import type { SearchHistoryItem } from "@/services/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .getHistory()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Search history
      </h1>
      <p className="text-ink-soft mb-8">Your last 50 searches.</p>

      {loading && <p className="font-mono text-xs text-ink-soft">Loading...</p>}

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-start gap-2 text-ink-soft">
          <HistoryIcon size={28} strokeWidth={1.5} />
          <p className="text-sm">
            No searches yet — your search history will show up here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="max-w-2xl divide-y divide-ink/10 border-t border-b border-ink/10">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4 gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.query}</p>
                <p className="font-mono text-xs text-ink-soft mt-1">
                  {formatDate(item.created_at)} · {item.result_count} results
                  {item.max_price && ` · under Rs. ${item.max_price.toLocaleString("en-PK")}`}
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(`/search?q=${encodeURIComponent(item.query)}`)
                }
                aria-label="Search again"
                className="flex items-center gap-1.5 text-sm text-teal-dark hover:text-teal transition-colors shrink-0"
              >
                <RotateCcw size={14} />
                Search again
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
