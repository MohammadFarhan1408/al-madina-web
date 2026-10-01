import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001").origin;

// Fonts are self-hosted by next/font and GSAP is bundled, so no third-party
// script/font hosts are needed. ponytail: script-src keeps 'unsafe-inline' for
// Next's inline bootstrap; a per-request nonce (via proxy.ts) would drop it but
// forces every page dynamic. Add the gateway's origins here when one is wired.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://placehold.co",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin}${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Content-Security-Policy", value: csp }] }];
  },
  reactCompiler: true,
  // Workspace has sibling lockfiles; pin the root so Turbopack picks this app.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Product images come from the backend's Cloudinary; dev backend serves on localhost.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" }, // dev seed placeholder images
      { protocol: "http", hostname: "localhost", port: "5001" },
    ],
  },
};

export default nextConfig;
