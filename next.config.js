/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image configuration
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

  // Proper static file serving configuration
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Ensure proper trailing slash handling
  trailingSlash: false,

  // Production build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Ensure proper path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };

    return config;
  },
};

module.exports = nextConfig;
