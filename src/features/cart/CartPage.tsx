"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container, PageIntro, Price, ButtonLink } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  useCartStore,
  computeCartSummary,
  linePrice,
  type CartItem,
} from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { couponsService } from "@/services/coupons.service";
import { getErrorMessage } from "@/lib/api/types";
import { formatAED } from "@/types/catalog";
import type { CouponPreview } from "@/types/commerce";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const summary = useMemo(() => computeCartSummary(items), [items]);

  const [coupon, setCoupon] = useState<CouponPreview | null>(null);

  if (items.length === 0) {
    return (
      <main>
        <PageIntro eyebrow="Your Bag" title="Shopping Bag" />
        <Container>
          <EmptyState
            title="Your bag is empty"
            body="Discover the Maison and add a fragrance to begin."
            action={{ label: "Shop the collection", href: "/shop" }}
          />
        </Container>
      </main>
    );
  }

  const discount = coupon?.valid ? Math.min(coupon.discountAmount, summary.subtotal) : 0;
  const total = summary.total - discount;

  return (
    <main>
      <PageIntro eyebrow="Your Bag" title="Shopping Bag" />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          {/* Line items */}
          <ul className="divide-y divide-bronze/15 border-y border-bronze/15">
            {items.map((item) => (
              <CartLine key={`${item.product.id}:${item.volumeMl ?? ""}`} item={item} />
            ))}
          </ul>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-bronze/20 bg-charcoal/40 p-8">
              <h2 className="font-display text-2xl text-ivory">Order Summary</h2>

              <CouponField
                subtotal={summary.subtotal}
                applied={coupon}
                onApply={setCoupon}
              />

              <dl className="mt-8 space-y-4 border-t border-bronze/15 pt-6 font-ui text-sm">
                <Row label="Subtotal" value={formatAED(summary.subtotal)} />
                {discount > 0 && (
                  <Row
                    label={`Discount (${coupon?.coupon.code})`}
                    value={`− ${formatAED(discount)}`}
                    accent
                  />
                )}
                <Row
                  label="Shipping"
                  value={summary.shipping === 0 ? "Complimentary" : formatAED(summary.shipping)}
                />
              </dl>

              <div className="mt-6 flex items-baseline justify-between border-t border-bronze/15 pt-6">
                <span className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">
                  Total
                </span>
                <Price amount={total} className="text-xl [&>span:first-child]:text-xl" />
              </div>

              <p className="mt-3 font-ui text-[0.7rem] leading-relaxed text-stone">
                Shipping and any express fee are confirmed at checkout. Final totals
                are validated by our system.
              </p>

              <ButtonLink href="/checkout" className="mt-7 w-full">
                Proceed to Checkout
              </ButtonLink>
              <Link
                href="/shop"
                className="mt-4 block text-center font-ui text-xs uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-antique-gold"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-stone">{label}</dt>
      <dd className={accent ? "text-antique-gold" : "text-ivory"}>{value}</dd>
    </div>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const addWish = useWishlistStore((s) => s.add);
  const { product, quantity, volumeMl } = item;
  const unit = linePrice(item);

  const moveToWishlist = () => {
    addWish(product.id);
    remove(product.id, volumeMl);
  };

  return (
    <li className="flex gap-5 py-7">
      <Link href={`/product/${product.id}`} className="shrink-0">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          sizes="96px"
          className="h-32 w-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-ui text-[0.68rem] uppercase tracking-[0.18em] text-stone">
              {product.scentFamily}
              {volumeMl ? ` · ${volumeMl} ml` : product.volumeMl ? ` · ${product.volumeMl} ml` : ""}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="mt-1 truncate font-display text-xl text-ivory transition-colors hover:text-antique-gold">
                {product.name}
              </h3>
            </Link>
          </div>
          <Price amount={unit * quantity} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <div className="flex items-center border border-bronze/30">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(product.id, quantity - 1, volumeMl)}
              className="grid h-9 w-9 place-items-center text-ivory/80 transition-colors hover:text-antique-gold"
            >
              −
            </button>
            <span className="w-8 text-center font-ui text-sm tabular-nums text-ivory">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(product.id, quantity + 1, volumeMl)}
              className="grid h-9 w-9 place-items-center text-ivory/80 transition-colors hover:text-antique-gold"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4 font-ui text-[0.68rem] uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={moveToWishlist}
              className="text-ivory/60 transition-colors hover:text-antique-gold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => remove(product.id, volumeMl)}
              className="text-ivory/60 transition-colors hover:text-burgundy"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function CouponField({
  subtotal,
  applied,
  onApply,
}: {
  subtotal: number;
  applied: CouponPreview | null;
  onApply: (c: CouponPreview | null) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await couponsService.validate(trimmed, subtotal);
      if (res.valid) {
        onApply(res);
        setCode("");
      } else {
        setError("This code isn't valid.");
      }
    } catch (err) {
      onApply(null);
      setError(getErrorMessage(err, "This code isn't valid for your bag."));
    } finally {
      setLoading(false);
    }
  };

  if (applied?.valid) {
    return (
      <div className="mt-6 flex items-center justify-between border border-antique-gold/40 bg-antique-gold/5 px-4 py-3">
        <span className="font-ui text-xs uppercase tracking-[0.16em] text-antique-gold">
          {applied.coupon.code} applied
        </span>
        <button
          type="button"
          onClick={() => onApply(null)}
          className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-ivory/60 hover:text-ivory"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Promo code"
          className="min-w-0 flex-1 border border-bronze/30 bg-rich-black px-4 py-3 font-ui text-sm uppercase tracking-[0.1em] text-ivory placeholder:normal-case placeholder:tracking-normal placeholder:text-smoke focus:border-antique-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || !code.trim()}
          className="border border-bronze/50 px-5 font-ui text-xs uppercase tracking-[0.16em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold disabled:opacity-40"
        >
          {loading ? "…" : "Apply"}
        </button>
      </div>
      {error && <p className="mt-2 font-ui text-xs text-burgundy">{error}</p>}
    </div>
  );
}
