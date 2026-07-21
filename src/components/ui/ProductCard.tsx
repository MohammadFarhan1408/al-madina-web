"use client";

import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { Price, Rating, Badge } from "./primitives";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types/catalog";

/** Editorial product tile — image, family, name, price, wishlist + quick add. */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const wishlisted = useIsWishlisted(product.id);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.add);
  // Backend resolves products by _id only (no slug lookup) — always link by id.
  const href = `/product/${product.id}`;

  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="relative block">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="aspect-[3/4] w-full"
        />
        {product.badge && (
          <span className="absolute left-3 top-3">
            <Badge>{product.badge}</Badge>
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 grid place-items-center bg-rich-black/55">
            <span className="font-ui text-xs uppercase tracking-[0.28em] text-ivory">
              Sold Out
            </span>
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        onClick={() => toggleWish(product.id)}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition-colors ${
          wishlisted
            ? "bg-rich-black/60 text-antique-gold"
            : "bg-rich-black/40 text-ivory/80 hover:text-antique-gold"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
          <path d="M12 20s-7-4.5-9.3-8.6C1 8.4 2.5 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.3 0 4.8 3.4 3.1 6.4C19 15.5 12 20 12 20Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mt-4 flex flex-col gap-1.5">
        <p className="font-ui text-[0.68rem] uppercase tracking-[0.18em] text-stone">
          {product.scentFamily} · {product.volumeMl} ml
        </p>
        <Link href={href}>
          <h3 className="font-display text-xl text-ivory transition-colors group-hover:text-antique-gold">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between gap-3">
          <Price amount={product.price} original={product.originalPrice} />
          {product.reviewCount > 0 && (
            <Rating value={product.rating} count={product.reviewCount} />
          )}
        </div>
        {product.inStock && (
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="mt-3 border-t border-bronze/20 pt-3 text-left font-ui text-[0.72rem] uppercase tracking-[0.24em] text-antique-gold opacity-0 transition-opacity duration-300 hover:text-gold-bright group-hover:opacity-100 focus-visible:opacity-100"
          >
            Add to Bag +
          </button>
        )}
      </div>
    </article>
  );
}
