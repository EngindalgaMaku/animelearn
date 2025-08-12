/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 specific configuration for static asset serving
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Force static optimization for better asset serving
  experimental: {
    // Disable optimizations that might interfere with asset serving
    optimizePackageImports: [],
  },

  // Webpack configuration for Next.js 15
  webpack: (config, { isServer, dev }) => {
    // Ensure proper asset handling in Next.js 15
    if (dev && !isServer) {
      // Force filesystem cache for development
      config.cache = {
        type: "filesystem",
        allowCollectingMemory: false,
        buildDependencies: {
          config: [__filename],
        },
      };

      // Ensure static assets are properly resolved
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": require("path").resolve(__dirname, "src"),
      };
    }

    return config;
  },

  // Next.js 15 compatible image configuration
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

  // Static file serving configuration
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Ensure proper trailing slash handling
  trailingSlash: false,

  // Disable output optimization for development
  ...(process.env.NODE_ENV !== "production" &&
    {
      // No output configuration in development
    }),
};

module.exports = nextConfig;
