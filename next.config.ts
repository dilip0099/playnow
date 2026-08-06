import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // All game artwork (thumbnails, covers, hero images, screenshots) comes from GameMonetize's
    // CDN — see src/scripts/import-gamemonetize.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamemonetize.com",
      },
      {
        protocol: "https",
        hostname: "html5.gamemonetize.co",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes — allow GameMonetize iframes to load without being
        // blocked by Vercel's default X-Frame-Options / CSP headers in production.
        source: "/:path*",
        headers: [
          // Allow our own pages to be served normally (not framed by others)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Referrer policy so GameMonetize SDK gets the correct origin for publisher validation
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
          // Permissions for fullscreen API used by GamePlayer auto-fullscreen feature
          { key: "Permissions-Policy", value: "fullscreen=*, autoplay=*, gyroscope=*, accelerometer=*" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // The Vercel-issued subdomain still resolves and serves the same deployment as
      // playthorn.com now that a real domain is connected — without this, Google would see
      // identical content under two hosts (duplicate content), and it's the exact URL this
      // site was indexed under before the domain migration.
      {
        source: "/:path*",
        has: [{ type: "host", value: "playnow-eta.vercel.app" }],
        destination: "https://playthorn.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

