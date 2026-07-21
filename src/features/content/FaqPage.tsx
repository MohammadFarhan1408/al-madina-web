import { Container, PageIntro } from "@/components/ui/primitives";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery arrives within 3–5 business days across the UAE. Express delivery (+AED 30 at checkout) arrives within 1–2 business days.",
  },
  {
    q: "Is shipping free?",
    a: "Standard shipping is free on orders of AED 250 or more. Below that, a flat AED 20 shipping fee applies.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes — cash on delivery is available at checkout alongside card and wallet payment.",
  },
  {
    q: "Can I check out as a guest?",
    a: "Yes, guest checkout is available. Creating an account lets you track orders, save addresses and build a wishlist.",
  },
  {
    q: "What is your return policy?",
    a: "Unopened fragrances may be returned within 14 days of delivery. See our Shipping & Returns page for full details.",
  },
  {
    q: "How do I track my order?",
    a: "Sign in and visit My Orders to see live status — processing, shipped or delivered. Guest orders can be viewed with your order reference and email.",
  },
];

export function FaqPage() {
  return (
    <main>
      <PageIntro eyebrow="Support" title="Frequently Asked Questions" />
      <Container className="max-w-3xl py-20">
        <div className="divide-y divide-bronze/15 border-y border-bronze/15">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-base text-ivory marker:content-none">
                {item.q}
                <span className="shrink-0 font-display text-xl text-antique-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 font-ui text-sm leading-relaxed text-stone">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </main>
  );
}
