/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for troubleshooting
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Basic image configuration
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Remove all experimental features and optimizations
  experimental: {},

  // No output configuration
  trailingSlash: false,
};

module.exports = nextConfig;
