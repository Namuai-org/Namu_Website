import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Monorepo (repo root = Namu-/, app = namu-website/): file tracing must include
   * the workspace root or Vercel can fail or hang during "Collecting build traces".
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/outputFileTracingRoot
   */
  outputFileTracingRoot: path.join(__dirname, ".."),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

