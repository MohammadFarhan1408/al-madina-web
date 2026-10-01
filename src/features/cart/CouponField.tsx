"use client";

import { useState } from "react";
import { couponsService } from "@/services/coupons.service";
import { getErrorMessage } from "@/lib/api/types";
import type { CouponPreview } from "@/types/commerce";

/** Promo-code entry shared by the cart and checkout (no outer margin — callers space it). */
export function CouponField({
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
      {error && <p className="mt-2 font-ui text-xs text-burgundy">{error}</p>}
    </div>
  );
}
