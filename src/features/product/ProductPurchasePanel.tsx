"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Price, Rating, Badge } from "@/components/ui/primitives";
import { useCartStore } from "@/store/cart.store";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlist.store";
import type { Product, ProductVariant } from "@/types/catalog";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.add);
  const wishlisted = useIsWishlisted(product.id);
  const toggleWish = useWishlistStore((s) => s.toggle);

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

  // Default to the first in-stock variant (or first) when variants exist.
  const [selected, setSelected] = useState<ProductVariant | null>(
    hasVariants ? variants.find((v) => v.inStock) ?? variants[0] : null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = selected?.price ?? product.price;
  const inStock = selected ? selected.inStock : product.inStock;
  const volumeMl = selected?.volumeMl;

  const originalPrice = useMemo(
    () => (selected ? undefined : product.originalPrice),
    [selected, product.originalPrice],
  );

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product, qty, volumeMl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="font-ui text-xs uppercase tracking-[0.24em] text-antique-gold">
          {product.brand} · {product.scentFamily}
        </p>
        {product.badge && <Badge>{product.badge}</Badge>}
      </div>

      <h1 className="mt-4 font-display text-4xl leading-[1.02] text-ivory sm:text-5xl">
        {product.name}
      </h1>
      {product.nameAr && (
        <p className="mt-2 font-editorial text-2xl text-stone" dir="rtl">
          {product.nameAr}
        </p>
      )}

      {product.reviewCount > 0 && (
        <div className="mt-4">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
      )}

      <div className="mt-6">
        <Price
          amount={price}
          original={originalPrice}
          className="text-2xl [&>span:first-child]:text-2xl"
        />
      </div>

      {product.description && (
        <p className="mt-6 max-w-prose font-ui text-sm leading-relaxed text-ivory-dim/75">
          {product.description}
        </p>
      )}

      {/* Variant / size selection */}
      {hasVariants && (
        <div className="mt-8">
          <p className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">
            Size
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = selected?.volumeMl === v.volumeMl;
              return (
                <button
                  key={v.sku || v.volumeMl}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() => setSelected(v)}
                  className={`border px-4 py-2.5 font-ui text-sm transition-colors ${
                    active
                      ? "border-antique-gold text-antique-gold"
                      : "border-bronze/30 text-ivory/80 hover:border-antique-gold/60"
                  } ${!v.inStock ? "cursor-not-allowed opacity-40 line-through" : ""}`}
                >
                  {v.volumeMl} ml
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + actions */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-bronze/30">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center text-ivory/80 transition-colors hover:text-antique-gold"
          >
            −
          </button>
          <span className="w-10 text-center font-ui text-sm tabular-nums text-ivory">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-12 place-items-center text-ivory/80 transition-colors hover:text-antique-gold"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className="flex-1 min-w-48 bg-antique-gold px-8 py-3.5 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:bg-smoke disabled:text-ivory/60"
        >
          {!inStock ? "Sold Out" : added ? "Added to Bag ✓" : "Add to Bag"}
        </button>

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => toggleWish(product.id)}
          className={`grid h-12 w-12 place-items-center border transition-colors ${
            wishlisted
              ? "border-antique-gold text-antique-gold"
              : "border-bronze/40 text-ivory/70 hover:border-antique-gold hover:text-antique-gold"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
            <path d="M12 20s-7-4.5-9.3-8.6C1 8.4 2.5 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.3 0 4.8 3.4 3.1 6.4C19 15.5 12 20 12 20Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="mt-4 font-ui text-xs uppercase tracking-[0.24em] text-antique-gold underline-offset-4 hover:underline"
        >
          View bag →
        </button>
      )}
    </div>
  );
}
