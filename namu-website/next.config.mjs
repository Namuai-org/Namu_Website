/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Vercel installs deps inside `namu-website/` only (Root Directory). Do not set
   * `outputFileTracingRoot` to the repo parent: that makes Next trace sibling folders
   * (e.g. other apps’ node_modules) and can hang or fail at "Collecting build traces".
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/outputFileTracingRoot
   */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
