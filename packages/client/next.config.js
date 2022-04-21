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
};

module.exports = nextConfig;
