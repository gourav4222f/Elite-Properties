import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The hero film is large, so repeat visits take it from the HTTP cache rather than
        // revalidating. If it is re-encoded, rename the file or shorten this header.
        source: "/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
