import { Price } from "@/components/ui/primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatAED } from "@/types/catalog";
import type { Order, OrderStatus, PaymentStatus } from "@/types/commerce";

// Shared order-display pieces used by both the confirmation and account detail.

export function OrderLines({
  order,
  renderAction,
}: {
  order: Order;
  renderAction?: (item: Order["items"][number]) => React.ReactNode;
}) {
  return (
    <ul className="divide-y divide-bronze/15">
      {order.items.map((item, i) => (
        <li key={`${item.productId}-${i}`} className="flex items-center gap-4 py-4">
          <ProductImage
            src={item.productImage}
            alt={item.productName}
            sizes="56px"
            className="h-16 w-14 shrink-0"
          />
          <div className="flex-1">
            <p className="font-display text-lg text-ivory">{item.productName}</p>
            <p className="font-ui text-xs uppercase tracking-[0.14em] text-stone">
              Qty {item.quantity}
              {item.volumeMl ? ` · ${item.volumeMl} ml` : ""}
            </p>
            {renderAction?.(item)}
          </div>
          <span className="font-ui text-sm text-ivory">
            {formatAED(item.price * item.quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ShippingBlock({ order }: { order: Order }) {
  const a = order.shippingAddress;
  return (
    <div>
      <h2 className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">Shipping to</h2>
      <div className="mt-4 font-ui text-sm leading-relaxed text-ivory/80">
        <p className="text-ivory">{a.fullName}</p>
        <p>{a.phone}</p>
        <p>{a.address}</p>
        <p>{a.city}</p>
      </div>
      <p className="mt-4 font-ui text-xs uppercase tracking-[0.16em] text-stone">
        {order.deliveryMethod === "express" ? "Express delivery" : "Standard delivery"}
      </p>
    </div>
  );
}

export function TotalsBlock({ order }: { order: Order }) {
  return (
    <div>
      <h2 className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">Summary</h2>
      <dl className="mt-4 space-y-3 font-ui text-sm">
        <SummaryRow label="Subtotal" value={formatAED(order.subtotal)} />
        {order.discountAmount > 0 && (
          <SummaryRow
            label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
            value={`− ${formatAED(order.discountAmount)}`}
            accent
          />
        )}
        <SummaryRow
          label="Shipping"
          value={order.shipping === 0 ? "Complimentary" : formatAED(order.shipping)}
        />
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-bronze/15 pt-4">
        <span className="font-ui text-xs uppercase tracking-[0.2em] text-bronze">Total</span>
        <Price amount={order.total} />
      </div>
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone">{label}</dt>
      <dd className={accent ? "text-antique-gold" : "text-ivory"}>{value}</dd>
    </div>
  );
}

const PAYMENT_TONE: Record<PaymentStatus, string> = {
  pending: "border-bronze/50 text-champagne",
  processing: "border-bronze/50 text-champagne",
  paid: "border-emerald/60 text-emerald",
  failed: "border-burgundy/60 text-burgundy",
  cancelled: "border-burgundy/60 text-burgundy",
  refunded: "border-bronze/50 text-stone",
};

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "gold" | "good" | "bad";
}) {
  const cls =
    tone === "gold"
      ? "border-antique-gold/60 text-antique-gold"
      : tone === "good"
        ? "border-emerald/60 text-emerald"
        : tone === "bad"
          ? "border-burgundy/60 text-burgundy"
          : "border-bronze/50 text-champagne";
  return (
    <span
      className={`inline-block border px-3 py-1 font-ui text-[0.6rem] uppercase tracking-[0.2em] capitalize ${cls}`}
    >
      {label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-block border px-3 py-1 font-ui text-[0.6rem] uppercase tracking-[0.2em] capitalize ${PAYMENT_TONE[status]}`}
    >
      {status}
    </span>
  );
}

/** Fulfillment tone for the status badge. */
export function statusTone(status: OrderStatus): "neutral" | "gold" | "good" | "bad" {
  if (status === "delivered") return "good";
  if (status === "cancelled") return "bad";
  if (status === "shipped") return "gold";
  return "neutral";
}
