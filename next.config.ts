import type { NextConfig } from "next";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "haotian-visual-archive";
const basePath = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";
const assetBaseUrl = basePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_ASSET_BASE_URL: assetBaseUrl,
  },
};

export default nextConfig;

