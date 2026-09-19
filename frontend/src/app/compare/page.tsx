"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { X } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useComparison } from "@/context/ComparisonContext";
import * as api from "@/services/api";

const ROWS: { label: string; key: "price" | "rating" | "reviews" | "trust_score" }[] = [
  { label: "Price", key: "price" },
  { label: "Rating", key: "rating" },
  { label: "Reviews", key: "reviews" },
  { label: "Trust score", key: "trust_score" },
];

export default function ComparePage() {
  const { selected, toggleProduct, clear } = useComparison();
  const router = useRouter();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selected.length < 2) return;

    setLoading(true);
    setError(null);
    api
      .runCompare(selected)
      .then((res) => setSummary(res.summary))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Couldn't generate a comparison. Please try again.");
        }
      })
      .finally(() => setLoading(false));
    // Only re-run when the actual selection changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.length]);

  if (selected.length < 2) {
    return (
      <DashboardShell>
        <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
          Compare
        </h1>
        <p className="text-ink-soft mb-6">
          Pick at least 2 products from a search to compare them here.
        </p>
        <button
          onClick={() => router.push("/search")}
          className="bg-teal text-paper px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-teal-dark transition-colors"
        >
          Go to search
        </button>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="font-display font-bold text-3xl tracking-tight">Compare</h1>
        <button
          onClick={() => {
            clear();
            router.push("/search");
          }}
          className="text-sm text-ink-soft hover:text-brick transition-colors"
        >
          Clear all
        </button>
      </div>
      <p className="text-ink-soft mb-8">
        {selected.length} products side by side.
      </p>

      {loading && (
        <p className="font-mono text-xs text-ink-soft mb-6">
          Weighing the tradeoffs...
        </p>
      )}
      {error && (
        <p className="text-brick text-sm bg-brick/5 border border-brick/20 rounded-sm px-4 py-3 max-w-2xl mb-6">
          {error}
        </p>
      )}
      {summary && !loading && (
        <div className="bg-card border border-ink/10 rounded-sm p-5 max-w-3xl mb-9">
          <p className="font-mono text-[11px] text-gold mb-1.5">AI COMPARISON</p>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-mono text-ink-soft pb-3 pr-4 w-32"></th>
              {selected.map((p, i) => (
                <th key={i} className="text-left pb-3 px-4 border-b border-ink/10 min-w-[180px]">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={p.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-semibold text-sm hover:text-teal-dark transition-colors leading-snug"
                    >
                      {p.name}
                    </a>
                    <button
                      onClick={() => toggleProduct(p)}
                      aria-label="Remove from comparison"
                      className="text-ink-soft hover:text-brick transition-colors shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const values = selected.map((p) => p[row.key]);
              const best =
                row.key === "price" ? Math.min(...values) : Math.max(...values);

              return (
                <tr key={row.key} className="border-b border-ink/10">
                  <td className="py-3.5 pr-4 text-xs font-mono text-ink-soft">
                    {row.label}
                  </td>
                  {selected.map((p, i) => {
                    const value = p[row.key];
                    const isBest = value === best;
                    const display =
                      row.key === "price"
                        ? `Rs. ${value.toLocaleString("en-PK")}`
                        : row.key === "rating"
                        ? `${value}★`
                        : row.key === "trust_score"
                        ? value.toFixed(2)
                        : value.toLocaleString();

                    return (
                      <td key={i} className="py-3.5 px-4">
                        <span
                          className={`font-mono text-sm ${
                            isBest ? "text-teal-dark font-semibold" : "text-ink"
                          }`}
                        >
                          {display}
                          {isBest && (
                            <span className="text-gold ml-1.5 text-xs">best</span>
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
