"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrder, useOrderPayments, useRetryPayment } from "@/hooks/queries/use-orders";
import { Spinner, ErrorState } from "@/components/ui/feedback";
import {
  OrderLines,
  ShippingBlock,
  TotalsBlock,
  StatusBadge,
  PaymentStatusBadge,
  statusTone,
} from "@/features/order/parts";
import { WriteReview } from "./WriteReview";
import type { OrderStatus } from "@/types/commerce";

const TRACK: OrderStatus[] = ["processing", "shipped", "delivered"];

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export function OrderDetail({ id }: { id: string }) {
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const retry = useRetryPayment(id);
  const { data: txns } = useOrderPayments(id);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  if (isLoading) return <div className="py-16 text-center"><Spinner className="h-7 w-7" /></div>;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} message="We couldn't load this order." />;

  const cancelled = order.status === "cancelled";
  const currentStep = TRACK.indexOf(order.status);
  const canRetry = order.paymentStatus === "failed" || order.paymentStatus === "cancelled";
  const delivered = order.status === "delivered";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/account/orders" className="font-ui text-xs uppercase tracking-[0.16em] text-bronze hover:text-antique-gold">
            ← All orders
          </Link>
          <h2 className="mt-3 font-display text-3xl text-ivory">{order.reference}</h2>
          <p className="mt-1 font-ui text-xs uppercase tracking-[0.14em] text-stone">
            Placed {new Date(order.placedAt).toLocaleDateString("en-AE", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={order.status} tone={statusTone(order.status)} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Tracking timeline */}
      {cancelled ? (
        <div className="border border-burgundy/40 bg-burgundy/10 px-5 py-4 font-ui text-sm text-champagne-soft">
          This order was cancelled.
        </div>
      ) : (
        <ol className="flex items-center">
          {TRACK.map((step, i) => {
            const done = i <= currentStep;
            return (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border text-xs ${
                      done ? "border-antique-gold bg-antique-gold/10 text-antique-gold" : "border-smoke text-smoke"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className={`font-ui text-[0.6rem] uppercase tracking-[0.18em] capitalize ${done ? "text-ivory" : "text-smoke"}`}>
                    {step}
                  </span>
                </div>
                {i < TRACK.length - 1 && (
                  <span className={`mx-2 h-px flex-1 ${i < currentStep ? "bg-antique-gold/60" : "bg-smoke/40"}`} />
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* Retry payment */}
      {canRetry && (
        <div className="flex items-center justify-between border border-burgundy/40 bg-burgundy/10 px-5 py-4">
          <span className="font-ui text-sm text-champagne-soft">Payment {order.paymentStatus}. You can retry.</span>
          <button
            type="button"
            onClick={() => retry.mutate(uuid())}
            disabled={retry.isPending}
            className="inline-flex items-center gap-2 bg-antique-gold px-5 py-2.5 font-ui text-[0.72rem] uppercase tracking-[0.18em] text-rich-black hover:bg-gold-bright disabled:opacity-60"
          >
            {retry.isPending && <Spinner className="h-3.5 w-3.5 border-rich-black/40 border-t-rich-black" />}
            Retry Payment
          </button>
        </div>
      )}

      {/* Items (+ review when delivered) */}
      <OrderLines
        order={order}
        renderAction={(item) =>
          delivered ? (
            reviewed.has(item.productId) ? (
              <p className="mt-2 font-ui text-[0.68rem] uppercase tracking-[0.16em] text-emerald">Review submitted ✓</p>
            ) : reviewing === item.productId ? (
              <WriteReview
                productId={item.productId}
                productName={item.productName}
                onDone={() => {
                  setReviewed((s) => new Set(s).add(item.productId));
                  setReviewing(null);
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setReviewing(item.productId)}
                className="mt-2 font-ui text-[0.68rem] uppercase tracking-[0.16em] text-antique-gold hover:text-gold-bright"
              >
                Write a review
              </button>
            )
          ) : null
        }
      />

      <div className="grid gap-8 border-t border-bronze/15 pt-8 sm:grid-cols-2">
        <ShippingBlock order={order} />
        <TotalsBlock order={order} />
      </div>

      {txns && txns.length > 1 && (
        <div className="border-t border-bronze/15 pt-8">
          <h3 className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">Payment Attempts</h3>
          <ul className="mt-4 space-y-2 font-ui text-sm text-ivory/80">
            {txns.map((t) => (
              <li key={t.id} className="flex justify-between">
                <span>{new Date(t.createdAt).toLocaleString("en-AE")}</span>
                <span className="capitalize text-stone">{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
