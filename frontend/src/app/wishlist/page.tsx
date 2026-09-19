"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import * as api from "@/services/api";
import type { WishlistItem } from "@/services/api";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getWishlist()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(id: number) {
    await api.removeFromWishlist(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <DashboardShell>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-1.5">
        Wishlist
      </h1>
      <p className="text-ink-soft mb-8">Products you've saved for later.</p>

      {loading && (
        <p className="font-mono text-xs text-ink-soft">Loading...</p>
      )}

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-start gap-2 text-ink-soft">
          <Heart size={28} strokeWidth={1.5} />
          <p className="text-sm">
            Nothing saved yet — tap the heart icon on any product from a
            search to add it here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-ink/10 rounded-sm p-5 relative"
            >
              <button
                onClick={() => handleRemove(item.id)}
                aria-label="Remove from wishlist"
                className="absolute top-4 right-4 text-ink-soft hover:text-brick transition-colors"
              >
                <Trash2 size={15} />
              </button>

              <a
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-semibold text-sm hover:text-teal-dark transition-colors leading-snug pr-6 block"
              >
                {item.name}
              </a>
              <p className="font-mono font-semibold text-lg text-teal-dark mt-2.5">
                <span className="text-xs text-ink-soft font-normal mr-1">Rs.</span>
                {item.price.toLocaleString("en-PK")}
              </p>
              <p className="font-mono text-xs text-ink-soft mt-1.5">
                <span className="text-gold">
                  {"★".repeat(Math.round(item.rating))}
                  {"☆".repeat(5 - Math.round(item.rating))}
                </span>{" "}
                {item.rating} ({item.reviews.toLocaleString()} reviews)
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
