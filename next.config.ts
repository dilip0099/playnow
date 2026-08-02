import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // All game artwork (thumbnails, covers, hero images, screenshots) comes from GamePix's
    // CDN — see higherResImage() in src/scripts/import-gamepix.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamepix.com",
      },
    ],
  },
};

export default nextConfig;
