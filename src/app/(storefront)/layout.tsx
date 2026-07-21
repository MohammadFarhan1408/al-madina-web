import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

// Shared storefront chrome. Header is fixed/transparent-over-content (the
// homepage hero relies on this); each page owns its own top spacing.
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="min-h-screen bg-rich-black">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
