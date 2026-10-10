import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Hero frames are fetched ahead of the playhead and re-requested after eviction,
        // so they must be served from the HTTP cache rather than revalidated each time.
        source: "/frames/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
