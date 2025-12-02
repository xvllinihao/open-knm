import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  // Allow importing and using MDX files alongside TS/TSX pages and components
  pageExtensions: ["ts", "tsx", "mdx"],
  // Suppress cross-origin warning when accessing from local network
  // Note: You must restart the server after modifying this list.
  allowedDevOrigins: ["localhost:3000", "192.168.100.8:3000", "0.0.0.0:3000"],
  // PostHog rewrites
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default withMDX(nextConfig);
