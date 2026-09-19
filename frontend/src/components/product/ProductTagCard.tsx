import { Heart } from "lucide-react";
import type { ProductResult } from "@/types/search";

export default function ProductTagCard({
  product,
  rank,
  selectable,
  selected,
  onToggleSelect,
  disabled,
  wishlisted,
  onToggleWishlist,
}: {
  product: ProductResult;
  rank: number;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  disabled?: boolean;
  wishlisted?: boolean;
  onToggleWishlist?: () => void;
}) {
  const rot = rank % 2 === 0 ? -1.5 : 1.5;
  const hasRatingData = product.rating > 0 || product.reviews > 0;

  const content = (
    <>
      <div className="absolute -top-5 left-7 w-px h-6 bg-ink-soft/40" />
      <div className="absolute top-2.5 left-6 w-2.5 h-2.5 rounded-full bg-paper border border-ink/15" />

      {rank === 0 && !selectable && (
        <div className="absolute -top-3 -right-2 w-16 h-16 rounded-full border-2 border-dashed border-brick text-brick flex items-center justify-center text-center font-mono text-[10px] font-semibold rotate-12 leading-tight mix-blend-multiply">
          AI
          <br />
          PICK
        </div>
      )}

      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist();
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className={`w-6 h-6 flex items-center justify-center transition-colors ${
              wishlisted ? "text-brick" : "text-ink-soft hover:text-brick"
            }`}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        )}

        {selectable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleSelect?.();
            }}
            disabled={!selected && disabled}
            aria-label={selected ? "Remove from comparison" : "Add to comparison"}
            className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-colors ${
              selected
                ? "bg-teal border-teal text-paper"
                : disabled
                ? "border-ink/15 text-transparent cursor-not-allowed"
                : "border-ink/25 text-transparent hover:border-teal"
            }`}
          >
            {selected && "✓"}
          </button>
        )}
      </div>

      <p className="font-body font-semibold text-sm mt-1 ml-4 leading-snug pr-14">
        {product.name}
      </p>
      {product.source && (
        <p className="font-mono text-[10px] text-ink-soft/70 ml-4 mt-1 uppercase tracking-wide">
          via {product.source}
        </p>
      )}
      <p className="font-mono font-semibold text-xl text-teal-dark ml-4 mt-2.5">
        <span className="text-xs text-ink-soft font-normal mr-1">Rs.</span>
        {product.price.toLocaleString("en-PK")}
      </p>

      {hasRatingData ? (
        <p className="font-mono text-xs text-ink-soft ml-4 mt-1.5">
          <span className="text-gold">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </span>{" "}
          {product.rating} ({product.reviews.toLocaleString()} reviews)
        </p>
      ) : (
        <p className="font-mono text-xs text-ink-soft/60 ml-4 mt-1.5 italic">
          No rating data available
        </p>
      )}
    </>
  );

  const className = `relative block bg-card border border-ink/15 rounded-sm p-5 shadow-[2px_3px_0_rgba(27,36,32,0.06)] hover:-translate-y-0.5 transition-transform ${
    selected ? "ring-2 ring-teal" : ""
  }`;
  const style = { transform: `rotate(${rot}deg)` };

  // Always a real link now — the checkbox/heart buttons above call
  // e.preventDefault() in their own onClick, which stops just that click
  // from triggering navigation, so they still work independently.
  return (
    <a
      href={product.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {content}
    </a>
  );
}
