import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tech-note",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
