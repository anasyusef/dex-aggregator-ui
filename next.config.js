/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "assets.coingecko.com",
      "raw.githubusercontent.com",
      "s2.coinmarketcap.com",
      "*.ipfs.dweb.link",
      "cloudflare-ipfs.com",
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
