import { LegalPage } from "./LegalPage";

export function ShippingReturnsPage() {
  return (
    <LegalPage
      eyebrow="Care"
      title="Shipping & Returns"
      sections={[
        {
          heading: "Shipping",
          body: [
            "Standard delivery is free on orders of AED 250 or more; otherwise a flat AED 20 fee applies. Standard delivery arrives within 3–5 business days across the UAE.",
            "Express delivery (AED 30, selected at checkout) arrives within 1–2 business days.",
          ],
        },
        {
          heading: "Order Tracking",
          body: [
            "Signed-in customers can follow an order's status — processing, shipped or delivered — from My Orders. A confirmation and status updates are also sent by notification.",
          ],
        },
        {
          heading: "Returns & Exchanges",
          body: [
            "Unopened fragrances in their original packaging may be returned within 14 days of delivery for a full refund.",
            "Opened items can only be returned if faulty. To start a return, contact us with your order reference.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Approved refunds are issued to the original payment method within 5–7 business days of the return being received. Cash-on-delivery orders are refunded via bank transfer.",
          ],
        },
      ]}
    />
  );
}
