import Link from "next/link";
import type { Metadata } from "next";
import { Wordmark } from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

// Focused checkout chrome — no homepage nav or scroll animation. Just the
// wordmark + a secure badge so shoppers stay in the flow.
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-rich-black">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-bronze/20 bg-rich-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-10 lg:px-16">
          <Link href="/" className="text-ivory" aria-label="Al Madina Ittar — home">
            <Wordmark />
          </Link>
          <span className="flex items-center gap-2 font-ui text-[0.68rem] uppercase tracking-[0.2em] text-bronze">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Secure Checkout
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
