"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Scale } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProductTagCard from "@/components/product/ProductTagCard";
import * as api from "@/services/api";
import type { SearchResponse } from "@/types/search";
import { useComparison } from "@/context/ComparisonContext";

function SearchPageInner() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selected, toggleProduct, isSelected, atLimit } = useComparison();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tracks which product URLs are wishlisted, and their wishlist row ID
  // (needed to call DELETE /wishlist/{id} on un-save) — keyed by URL
  // since scraped products don't have a stable ID of their own.
  const [wishlistIds, setWishlistIds] = useState<Record<string, number>>({});

  async function runSearch(q: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.runSearch(q);
      setResult(res);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong running that search. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // If we arrived from the History page's "Search again" link
  // (/search?q=...), pre-fill and immediately run that search.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      runSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleWishlist(product: SearchResponse["products"][number]) {
    const key = product.url || product.name;
    const existingId = wishlistIds[key];

    if (existingId) {
      await api.removeFromWishlist(existingId);
      setWishlistIds((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      const saved = await api.addToWishlist(product);
      setWishlistIds((prev) => ({ ...prev, [key]: saved.id }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    runSearch(query);
  }

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Find something
      </h1>
      <p className="text-ink-soft mb-7">
        Describe what you want and your budget — the AI does the rest.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2.5 max-w-2xl mb-9">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="gaming laptop under Rs. 150,000"
          className="flex-1 border border-ink/15 rounded-sm px-4 py-3 text-sm outline-none focus:border-teal transition-colors bg-card font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-teal text-paper px-6 py-3 rounded-sm font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? "Searching..." : "Find it"}
        </button>
      </form>

      {error && (
        <p className="text-brick text-sm bg-brick/5 border border-brick/20 rounded-sm px-4 py-3 max-w-2xl mb-6">
          {error}
        </p>
      )}

      {loading && (
        <p className="font-mono text-xs text-ink-soft">
          Parsing your request, checking real listings, weighing reviews...
        </p>
      )}

      {result && !loading && (
        <>
          {result.products.length === 0 ? (
            <p className="text-ink-soft text-sm">
              No matching products found. Try a broader search or a different budget.
            </p>
          ) : (
            <>
              <div className="bg-card border border-ink/10 rounded-sm p-5 max-w-2xl mb-6">
                <p className="font-mono text-[11px] text-gold mb-1.5">
                  AI RECOMMENDATION
                </p>
                <p className="text-sm leading-relaxed">{result.recommendation}</p>
              </div>

              <p className="text-xs text-ink-soft mb-6 font-mono">
                Tap the heart to save, or the checkbox (up to 4) to compare.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-24">
                {result.products.map((product, i) => (
                  <ProductTagCard
                    key={i}
                    product={product}
                    rank={i}
                    selectable
                    selected={isSelected(product)}
                    onToggleSelect={() => toggleProduct(product)}
                    disabled={atLimit}
                    wishlisted={!!wishlistIds[product.url || product.name]}
                    onToggleWishlist={() => handleToggleWishlist(product)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {selected.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-teal text-paper rounded-sm shadow-lg px-6 py-3.5 flex items-center gap-4 z-40">
          <span className="text-sm font-medium">
            {selected.length} product{selected.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => router.push("/compare")}
            className="flex items-center gap-2 bg-paper text-teal-dark px-4 py-2 rounded-sm font-semibold text-sm hover:bg-paper-dim transition-colors"
          >
            <Scale size={15} />
            Compare
          </button>
        </div>
      )}
    </DashboardShell>
  );
}

export default function SearchPage() {
  // useSearchParams needs a Suspense boundary in Next.js's app router.
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
