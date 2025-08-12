/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  serverExternalPackages: ["sharp"],

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Fixed webpack configuration for better asset serving
  webpack: (config, { isServer, dev }) => {
    // Only optimize for production, keep cache in development
    if (!dev && !isServer) {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    // Ensure proper asset handling
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

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

  // Optimized headers for asset serving
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
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "production"
                ? "public, max-age=31536000, immutable"
                : "no-cache, no-store, must-revalidate",
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

  // Remove standalone output for development - only use in production
  trailingSlash: false,
  ...(process.env.NODE_ENV === "production" && { output: "standalone" }),
};

module.exports = nextConfig;
