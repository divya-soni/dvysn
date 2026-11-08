import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/test",
        destination: "/blog/cursor-for-reading",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
