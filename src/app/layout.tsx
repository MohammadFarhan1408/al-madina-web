import type { Metadata, Viewport } from "next";
import { fugi, playfair, jost } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Al Madina Ittar — Luxury Arabian Perfumery",
    template: "%s · Al Madina Ittar",
  },
  description:
    "Al Madina Ittar — a Maison of Arabian perfumery. Discover Oud Black and a collection of signature fragrances composed from oud, saffron, amber and rare naturals.",
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fugi.variable} ${playfair.variable} ${jost.variable}`}
    >
      <head>
        {/* Mark JS present before paint so scroll-reveal hides content only
            when GSAP can bring it back. No-JS renders fully visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-anim')`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
