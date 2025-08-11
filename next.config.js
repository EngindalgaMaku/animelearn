/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration to fix static asset issues

  // Disable Turbopack - use webpack instead
  turbo: false,

  // Performance optimizations
  serverExternalPackages: ["sharp"],

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Simple webpack configuration
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      // Disable all caching in development
      config.cache = false;
    }
    return config;
  },

  // Image optimization
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
    formats: ["image/avif", "image/webp"],
  },

  // Compression
  compress: true,
  poweredByHeader: false,

  // Minimal headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  // Simple rewrites
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/static-files/:path*",
      },
    ];
  },

  // Bundle optimization
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Static file handling
  trailingSlash: false,
  output: "standalone",
};

module.exports = nextConfig;
