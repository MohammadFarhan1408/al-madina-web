import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
