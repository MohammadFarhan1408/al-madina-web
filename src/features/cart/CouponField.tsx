"use client";

import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { couponsService } from "@/services/coupons.service";
import { getErrorMessage } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/keys";
import { useCartStore } from "@/store/cart.store";
import type { CouponPreview } from "@/types/commerce";

/**
 * The bag's applied coupon, re-validated against the current subtotal so the
 * discount tracks quantity changes and survives the trip to checkout. The
 * server re-checks it again when the order is placed.
 */
export function useAppliedCoupon(subtotal: number) {
  const code = useCartStore((s) => s.couponCode);
  const setCode = useCartStore((s) => s.setCouponCode);
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.coupon(code ?? "", subtotal),
    queryFn: () => couponsService.validate(code!, subtotal),
    enabled: !!code && subtotal > 0,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 60 * 1000,
  });
  const coupon = code && !query.isError && query.data?.valid ? query.data : null;
  const apply = (c: CouponPreview | null) => {
    if (c) qc.setQueryData(queryKeys.coupon(c.coupon.code, subtotal), c);
    setCode(c?.coupon.code ?? null);
  };
  // e.g. the bag dropped below the coupon's minimum purchase.
  const error =
    code && query.isError
      ? getErrorMessage(query.error, `${code} no longer applies to your bag.`)
      : null;
  return { coupon, apply, error };
}

/** Promo-code entry shared by the cart and checkout (no outer margin — callers space it). */
export function CouponField({
  subtotal,
  applied,
  onApply,
  staleError,
}: {
  subtotal: number;
  applied: CouponPreview | null;
  onApply: (c: CouponPreview | null) => void;
  /** Why a previously applied code stopped applying. */
  staleError?: string | null;
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
      } else setError("This code isn't valid.");
    } catch (err) {
      onApply(null);
      setError(getErrorMessage(err, "This code isn't valid for your bag."));
    } finally {
      setLoading(false);
    }
  };

  if (applied?.valid) {
    return (
      <div className="flex items-center justify-between border border-antique-gold/40 bg-antique-gold/5 px-4 py-3">
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
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Promo code"
          className="min-w-0 flex-1 border border-bronze/30 bg-rich-black px-4 py-3 font-ui text-sm uppercase tracking-widest text-ivory placeholder:normal-case placeholder:tracking-normal placeholder:text-smoke focus:border-antique-gold focus:outline-none"
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
      {(error ?? staleError) && (
        <p className="mt-2 font-ui text-xs text-burgundy">{error ?? staleError}</p>
      )}
    </div>
  );
}
