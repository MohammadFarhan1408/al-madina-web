"use client";

import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Spinner, ErrorState } from "@/components/ui/feedback";
import { useOrder, useOrderPayments, useRetryPayment } from "@/hooks/queries/use-orders";
import { useSessionStore } from "@/store/session.store";
import { OrderLines, ShippingBlock, TotalsBlock } from "./parts";
import type { PaymentStatus } from "@/types/commerce";

const PAYMENT_COPY: Record<
  PaymentStatus,
  { eyebrow: string; title: string; body: string; tone: "gold" | "processing" | "error" }
> = {
  pending: {
    eyebrow: "Order Confirmed",
    title: "Thank you for your order",
    body: "Your order is confirmed. You'll pay on delivery.",
    tone: "gold",
  },
  processing: {
    eyebrow: "Confirming Payment",
    title: "Almost there",
    body: "We're confirming your payment securely. This usually takes only a moment.",
    tone: "processing",
  },
  paid: {
    eyebrow: "Payment Received",
    title: "Thank you for your order",
    body: "Your payment is confirmed and your fragrance is being prepared.",
    tone: "gold",
  },
  failed: {
    eyebrow: "Payment Failed",
    title: "Your payment didn't go through",
    body: "No charge was made. You can retry the payment below.",
    tone: "error",
  },
  cancelled: {
    eyebrow: "Payment Cancelled",
    title: "Payment was cancelled",
    body: "You can retry the payment below to complete your order.",
    tone: "error",
  },
  refunded: {
    eyebrow: "Refunded",
    title: "This order was refunded",
    body: "Your payment has been returned.",
    tone: "gold",
  },
};

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export function OrderConfirmation({ id, email }: { id: string; email?: string }) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data: order, isLoading, isError, refetch } = useOrder(id, email);
  const retry = useRetryPayment(id);

  if (isLoading) {
    return (
      <Container className="grid min-h-[60vh] place-items-center pt-32">
        <Spinner className="h-8 w-8" />
      </Container>
    );
  }
  if (isError || !order) {
    return (
      <Container className="pt-40">
        <ErrorState onRetry={() => refetch()} message="We couldn't find this order." />
      </Container>
    );
  }

  const copy = PAYMENT_COPY[order.paymentStatus];
  const canRetry = order.paymentStatus === "failed" || order.paymentStatus === "cancelled";

  return (
    <main>
      <Container className="pt-32 pb-24 sm:pt-40">
        {/* Status hero */}
        <div className="mx-auto max-w-2xl text-center">
          <StatusMark tone={copy.tone} />
          <p
            className={`mt-8 overline ${copy.tone === "error" ? "text-burgundy" : ""}`}
          >
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 font-ui text-sm leading-relaxed text-stone">{copy.body}</p>
          <p className="mt-6 font-ui text-xs uppercase tracking-[0.24em] text-antique-gold">
            Order {order.reference}
          </p>

          {order.paymentStatus === "processing" && (
            <div className="mt-6 flex items-center justify-center gap-2 font-ui text-xs uppercase tracking-[0.2em] text-bronze">
              <Spinner className="h-4 w-4" /> Checking status…
            </div>
          )}

          {canRetry && (
            <button
              type="button"
              onClick={() => retry.mutate(uuid())}
              disabled={retry.isPending}
              className="mt-8 inline-flex items-center gap-3 bg-antique-gold px-8 py-3.5 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-bright disabled:opacity-60"
            >
              {retry.isPending && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
              {retry.isPending ? "Retrying" : "Retry Payment"}
            </button>
          )}
        </div>

        {/* Order detail */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-10 border-t border-bronze/15 pt-12">
          <OrderLines order={order} />
          <div className="grid gap-8 sm:grid-cols-2">
            <ShippingBlock order={order} />
            <TotalsBlock order={order} />
          </div>
          <PaymentAttempts id={id} email={email} />
        </div>

        {/* Actions */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {isAuthenticated ? (
            <Link
              href={`/account/orders/${order.id}`}
              className="border border-bronze/60 px-8 py-3.5 font-ui text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold"
            >
              View in My Orders
            </Link>
          ) : null}
          <Link
            href="/shop"
            className="px-8 py-3.5 font-ui text-xs uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-antique-gold"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </main>
  );
}

function StatusMark({ tone }: { tone: "gold" | "processing" | "error" }) {
  const color =
    tone === "error" ? "text-burgundy border-burgundy/40" : "text-antique-gold border-antique-gold/40";
  return (
    <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full border ${color}`}>
      {tone === "processing" ? (
        <Spinner className="h-6 w-6" />
      ) : tone === "error" ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function PaymentAttempts({ id, email }: { id: string; email?: string }) {
  const { data: txns } = useOrderPayments(id, email);
  if (!txns || txns.length <= 1) return null;
  return (
    <div className="border-t border-bronze/15 pt-8">
      <h2 className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">Payment Attempts</h2>
      <ul className="mt-4 space-y-2 font-ui text-sm text-ivory/80">
        {txns.map((t) => (
          <li key={t.id} className="flex justify-between">
            <span>{new Date(t.createdAt).toLocaleString("en-AE")}</span>
            <span className="capitalize text-stone">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
