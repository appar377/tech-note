import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental:
    process.env.TECH_NOTE_SERIAL_BUILD === "1" ? { cpus: 1 } : undefined,
  basePath: "/tech-note",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
