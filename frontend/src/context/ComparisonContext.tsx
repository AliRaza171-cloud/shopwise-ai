"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { ProductResult } from "@/types/search";

const MAX_COMPARE = 4;

interface ComparisonContextValue {
  selected: ProductResult[];
  toggleProduct: (product: ProductResult) => void;
  isSelected: (product: ProductResult) => boolean;
  clear: () => void;
  atLimit: boolean;
}

const ComparisonContext = createContext<ComparisonContextValue | undefined>(undefined);

function sameProduct(a: ProductResult, b: ProductResult) {
  // Products don't have a stable ID from the scraper, so url (falls back
  // to name) is the closest thing to a unique key we have within one
  // search's results.
  return (a.url && a.url === b.url) || a.name === b.name;
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ProductResult[]>([]);

  function isSelected(product: ProductResult) {
    return selected.some((p) => sameProduct(p, product));
  }

  function toggleProduct(product: ProductResult) {
    setSelected((prev) => {
      if (prev.some((p) => sameProduct(p, product))) {
        return prev.filter((p) => !sameProduct(p, product));
      }
      if (prev.length >= MAX_COMPARE) return prev; // silently ignore past the limit
      return [...prev, product];
    });
  }

  function clear() {
    setSelected([]);
  }

  return (
    <ComparisonContext.Provider
      value={{ selected, toggleProduct, isSelected, clear, atLimit: selected.length >= MAX_COMPARE }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used inside a ComparisonProvider");
  return ctx;
}
