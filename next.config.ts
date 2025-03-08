import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: "lodash",
      },
      resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
});

export default nextConfig;
