"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Price } from "@/components/ui/primitives";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/feedback";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  useCartStore,
  computeCartSummary,
  linePrice,
} from "@/store/cart.store";
import { useSessionStore } from "@/store/session.store";
import { useAddresses, useCreateOrder } from "@/hooks/queries/use-orders";
import { addressesService } from "@/services/addresses.service";
import { couponsService } from "@/services/coupons.service";
import { getErrorMessage } from "@/lib/api/types";
import { formatAED } from "@/types/catalog";
import type {
  Address,
  CouponPreview,
  DeliveryMethod,
  PaymentMethod,
  ShippingAddress,
} from "@/types/commerce";
import {
  checkoutAddressSchema,
  computeShipping,
  EXPRESS_SURCHARGE,
  type CheckoutAddressForm,
} from "./schema";

const STEPS = ["Address", "Delivery", "Payment", "Review"] as const;

export function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const { data: addresses } = useAddresses(isAuthenticated);
  const createOrder = useCreateOrder();

  // One idempotency key per checkout attempt; resent unchanged on retry so a
  // double-submit dedupes to the same order server-side.
  const idempotencyKey = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  ).current;

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);

  const form = useForm<CheckoutAddressForm>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: { fullName: "", phone: "", address: "", city: "", email: "" },
  });

  const summary = useMemo(() => computeCartSummary(items), [items]);
  const shipping = computeShipping(summary.subtotal, delivery);
  const discount = coupon?.valid ? Math.min(coupon.discountAmount, summary.subtotal) : 0;
  const total = summary.subtotal + shipping - discount;

  const savedAddresses = addresses ?? [];
  const usingSaved = selectedAddressId !== "new";
  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

  if (items.length === 0) {
    return (
      <Container className="py-40 text-center">
        <h1 className="font-display text-4xl text-ivory">Your bag is empty</h1>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-bronze/60 px-8 py-3.5 font-ui text-xs uppercase tracking-[0.2em] text-ivory hover:border-antique-gold hover:text-antique-gold"
        >
          Return to shop
        </Link>
      </Container>
    );
  }

  function resolveShippingAddress(): ShippingAddress | null {
    if (usingSaved && selectedAddress) {
      return {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        address: [selectedAddress.addressLine, selectedAddress.landmark]
          .filter(Boolean)
          .join(", "),
        city: selectedAddress.city,
      };
    }
    const v = form.getValues();
    return { fullName: v.fullName, phone: v.phone, address: v.address, city: v.city };
  }

  async function advanceFromAddress() {
    if (usingSaved && selectedAddress) {
      setStep(1);
      return;
    }
    const ok = await form.trigger(["fullName", "phone", "address", "city"]);
    // Guests must supply an email for the order confirmation.
    if (!isAuthenticated) {
      const email = form.getValues("email");
      if (!email) {
        form.setError("email", { message: "Email is required for guest checkout" });
        return;
      }
    }
    if (ok) setStep(1);
  }

  async function placeOrder() {
    const shippingAddress = resolveShippingAddress();
    if (!shippingAddress) return;
    const guestEmail = !isAuthenticated ? form.getValues("email") || undefined : undefined;

    createOrder.mutate(
      {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          volumeMl: i.volumeMl,
        })),
        shippingAddress,
        deliveryMethod: delivery,
        paymentMethod: payment,
        guestEmail,
        couponCode: coupon?.valid ? coupon.coupon.code : undefined,
        idempotencyKey,
      },
      {
        onSuccess: (order) => {
          // Persist a newly-entered address for signed-in shoppers (best effort).
          if (isAuthenticated && !usingSaved) {
            const v = form.getValues();
            void addressesService
              .create({
                fullName: v.fullName,
                phone: v.phone,
                addressLine: v.address,
                city: v.city,
                country: "United Arab Emirates",
              })
              .catch(() => {});
          }
          clearCart();
          const q = guestEmail ? `?email=${encodeURIComponent(guestEmail)}` : "";
          router.push(`/order/${order.id}${q}`);
        },
      },
    );
  }

  return (
    <Container className="grid gap-12 pt-32 pb-24 sm:pt-40 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      {/* Left: steps */}
      <div>
        <Stepper current={step} onJump={(i) => i < step && setStep(i)} />

        <div className="mt-10">
          {step === 0 && (
            <AddressStep
              form={form}
              isAuthenticated={isAuthenticated}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onNext={advanceFromAddress}
            />
          )}
          {step === 1 && (
            <DeliveryStep
              value={delivery}
              onChange={setDelivery}
              subtotal={summary.subtotal}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              value={payment}
              onChange={setPayment}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <ReviewStep
              subtotal={summary.subtotal}
              coupon={coupon}
              onCoupon={setCoupon}
              payment={payment}
              delivery={delivery}
              placing={createOrder.isPending}
              error={
                createOrder.isError
                  ? getErrorMessage(createOrder.error, "We couldn't place your order.")
                  : null
              }
              onBack={() => setStep(2)}
              onPlace={placeOrder}
            />
          )}
        </div>
      </div>

      {/* Right: summary */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="border border-bronze/20 bg-charcoal/40 p-7">
          <h2 className="font-display text-xl text-ivory">Order Summary</h2>
          <ul className="mt-6 space-y-4">
            {items.map((i) => (
              <li key={`${i.product.id}:${i.volumeMl ?? ""}`} className="flex gap-3">
                <ProductImage
                  src={i.product.images?.[0]}
                  alt={i.product.name}
                  sizes="56px"
                  className="h-16 w-14 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-ui text-sm text-ivory">{i.product.name}</span>
                  <span className="font-ui text-[0.68rem] uppercase tracking-[0.14em] text-stone">
                    Qty {i.quantity}
                    {i.volumeMl ? ` · ${i.volumeMl} ml` : ""}
                  </span>
                </div>
                <span className="font-ui text-sm text-ivory">
                  {formatAED(linePrice(i) * i.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-bronze/15 pt-5 font-ui text-sm">
            <SummaryRow label="Subtotal" value={formatAED(summary.subtotal)} />
            {discount > 0 && (
              <SummaryRow
                label={`Discount (${coupon?.coupon.code})`}
                value={`− ${formatAED(discount)}`}
                accent
              />
            )}
            <SummaryRow
              label={`Shipping${delivery === "express" ? " (Express)" : ""}`}
              value={shipping === 0 ? "Complimentary" : formatAED(shipping)}
            />
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-bronze/15 pt-5">
            <span className="font-ui text-xs uppercase tracking-[0.24em] text-bronze">Total</span>
            <Price amount={total} className="text-lg [&>span:first-child]:text-lg" />
          </div>
        </div>
      </aside>
    </Container>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone">{label}</dt>
      <dd className={accent ? "text-antique-gold" : "text-ivory"}>{value}</dd>
    </div>
  );
}

function Stepper({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-3">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i >= current}
              className={`flex items-center gap-2 font-ui text-xs uppercase tracking-[0.16em] transition-colors ${
                active ? "text-antique-gold" : done ? "text-ivory/70 hover:text-ivory" : "text-smoke"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-[0.7rem] ${
                  active
                    ? "border-antique-gold text-antique-gold"
                    : done
                      ? "border-ivory/40 text-ivory/70"
                      : "border-smoke"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-bronze/30 sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}

// ---- Step 0: Address ----
function AddressStep({
  form,
  isAuthenticated,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onNext,
}: {
  form: ReturnType<typeof useForm<CheckoutAddressForm>>;
  isAuthenticated: boolean;
  savedAddresses: Address[];
  selectedAddressId: string | "new";
  onSelectAddress: (id: string | "new") => void;
  onNext: () => void;
}) {
  const { register, formState } = form;
  const showForm = selectedAddressId === "new";

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory">Delivery Address</h2>

      {!isAuthenticated && (
        <p className="mt-3 font-ui text-sm text-stone">
          Checking out as a guest.{" "}
          <Link href="/login?next=/checkout" className="text-antique-gold hover:underline">
            Sign in
          </Link>{" "}
          for saved addresses and faster checkout.
        </p>
      )}

      {savedAddresses.length > 0 && (
        <div className="mt-6 space-y-3">
          {savedAddresses.map((a) => (
            <label
              key={a.id}
              className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                selectedAddressId === a.id ? "border-antique-gold" : "border-bronze/25 hover:border-bronze/50"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === a.id}
                onChange={() => onSelectAddress(a.id)}
                className="mt-1 accent-antique-gold"
              />
              <span className="font-ui text-sm text-ivory/85">
                <span className="text-ivory">{a.fullName}</span> · {a.phone}
                <br />
                {a.addressLine}, {a.city}
                {a.isDefault && (
                  <span className="ml-2 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-antique-gold">
                    Default
                  </span>
                )}
              </span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => onSelectAddress("new")}
            className={`w-full border border-dashed p-3 font-ui text-xs uppercase tracking-[0.16em] transition-colors ${
              showForm ? "border-antique-gold text-antique-gold" : "border-bronze/30 text-ivory/70 hover:text-ivory"
            }`}
          >
            + Add a new address
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {!isAuthenticated && (
            <div className="sm:col-span-2">
              <Field label="Email" type="email" placeholder="you@example.com" error={formState.errors.email?.message} {...register("email")} />
            </div>
          )}
          <Field label="Full name" error={formState.errors.fullName?.message} {...register("fullName")} />
          <Field label="Phone" error={formState.errors.phone?.message} {...register("phone")} />
          <div className="sm:col-span-2">
            <Field label="Address" error={formState.errors.address?.message} {...register("address")} />
          </div>
          <Field label="City" error={formState.errors.city?.message} {...register("city")} />
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="mt-8 w-full bg-antique-gold px-8 py-3.5 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-bright sm:w-auto"
      >
        Continue to Delivery
      </button>
    </div>
  );
}

// ---- Step 1: Delivery ----
function DeliveryStep({
  value,
  onChange,
  subtotal,
  onBack,
  onNext,
}: {
  value: DeliveryMethod;
  onChange: (v: DeliveryMethod) => void;
  subtotal: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const baseFree = subtotal >= 250;
  const OPTIONS: { id: DeliveryMethod; title: string; sub: string; price: string }[] = [
    {
      id: "standard",
      title: "Standard",
      sub: "3–5 business days",
      price: baseFree ? "Complimentary" : formatAED(20),
    },
    {
      id: "express",
      title: "Express",
      sub: "Next business day",
      price: `+ ${formatAED(EXPRESS_SURCHARGE)}`,
    },
  ];
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory">Delivery Method</h2>
      <div className="mt-6 space-y-3">
        {OPTIONS.map((o) => (
          <OptionRow key={o.id} selected={value === o.id} onSelect={() => onChange(o.id)} title={o.title} sub={o.sub} trailing={o.price} />
        ))}
      </div>
      <StepNav onBack={onBack} onNext={onNext} nextLabel="Continue to Payment" />
    </div>
  );
}

// ---- Step 2: Payment ----
function PaymentStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const OPTIONS: { id: PaymentMethod; title: string; sub: string }[] = [
    { id: "cod", title: "Cash on Delivery", sub: "Pay in cash when your order arrives" },
    { id: "card", title: "Card", sub: "Confirmed after you place the order" },
    { id: "wallet", title: "Wallet", sub: "Confirmed after you place the order" },
  ];
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory">Payment Method</h2>
      <div className="mt-6 space-y-3">
        {OPTIONS.map((o) => (
          <OptionRow key={o.id} selected={value === o.id} onSelect={() => onChange(o.id)} title={o.title} sub={o.sub} />
        ))}
      </div>
      {value !== "cod" && (
        <p className="mt-4 font-ui text-xs leading-relaxed text-stone">
          Card and wallet payments are confirmed securely after your order is placed —
          you&apos;ll see the status update on the confirmation screen.
        </p>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel="Review Order" />
    </div>
  );
}

// ---- Step 3: Review ----
function ReviewStep({
  subtotal,
  coupon,
  onCoupon,
  payment,
  delivery,
  placing,
  error,
  onBack,
  onPlace,
}: {
  subtotal: number;
  coupon: CouponPreview | null;
  onCoupon: (c: CouponPreview | null) => void;
  payment: PaymentMethod;
  delivery: DeliveryMethod;
  placing: boolean;
  error: string | null;
  onBack: () => void;
  onPlace: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl text-ivory">Review &amp; Place Order</h2>

      <div className="mt-6 grid gap-3 font-ui text-sm text-ivory/80">
        <p>
          <span className="text-bronze">Delivery:</span> {delivery === "express" ? "Express (next day)" : "Standard (3–5 days)"}
        </p>
        <p>
          <span className="text-bronze">Payment:</span>{" "}
          {payment === "cod" ? "Cash on Delivery" : payment === "card" ? "Card" : "Wallet"}
        </p>
      </div>

      <div className="mt-6">
        <CouponField subtotal={subtotal} applied={coupon} onApply={onCoupon} />
      </div>

      {error && (
        <p className="mt-6 border border-burgundy/50 bg-burgundy/10 px-4 py-3 font-ui text-sm text-champagne-soft">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onPlace}
          disabled={placing}
          className="flex flex-1 items-center justify-center gap-3 bg-antique-gold px-8 py-4 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {placing && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
          {placing ? "Placing Order" : "Place Order"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={placing}
          className="px-6 py-4 font-ui text-xs uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-ivory disabled:opacity-40"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function OptionRow({
  selected,
  onSelect,
  title,
  sub,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
  trailing?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition-colors ${
        selected ? "border-antique-gold" : "border-bronze/25 hover:border-bronze/50"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`grid h-4 w-4 place-items-center rounded-full border ${
            selected ? "border-antique-gold" : "border-smoke"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-antique-gold" />}
        </span>
        <span>
          <span className="block font-ui text-sm text-ivory">{title}</span>
          <span className="block font-ui text-xs text-stone">{sub}</span>
        </span>
      </span>
      {trailing && <span className="font-ui text-sm text-antique-gold">{trailing}</span>}
    </button>
  );
}

function StepNav({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="mt-8 flex items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-3.5 font-ui text-xs uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-ivory"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="bg-antique-gold px-8 py-3.5 font-ui text-[0.78rem] uppercase tracking-[0.2em] text-rich-black transition-colors hover:bg-gold-bright"
      >
        {nextLabel}
      </button>
    </div>
  );
}

// Coupon preview (shared shape with cart; kept local to avoid premature abstraction).
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
        <button type="button" onClick={() => onApply(null)} className="font-ui text-[0.68rem] uppercase tracking-[0.16em] text-ivory/60 hover:text-ivory">
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
          className="min-w-0 flex-1 border border-bronze/30 bg-rich-black px-4 py-3 font-ui text-sm uppercase tracking-[0.1em] text-ivory placeholder:normal-case placeholder:tracking-normal placeholder:text-smoke focus:border-antique-gold focus:outline-none"
        />
        <button type="button" onClick={submit} disabled={loading || !code.trim()} className="border border-bronze/50 px-5 font-ui text-xs uppercase tracking-[0.16em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold disabled:opacity-40">
          {loading ? "…" : "Apply"}
        </button>
      </div>
      {error && <p className="mt-2 font-ui text-xs text-burgundy">{error}</p>}
    </div>
  );
}
