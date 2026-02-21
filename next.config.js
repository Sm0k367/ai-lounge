/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Empty turbopack config to silence warning
  turbopack: {},
};

module.exports = nextConfig;
