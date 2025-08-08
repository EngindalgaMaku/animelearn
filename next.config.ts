import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode to prevent Monaco Editor issues
  reactStrictMode: false,


  // SEO and Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=43200",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cards",
        destination: "/shop",
        permanent: true,
      },
    ];
  },

  // ESLint configuration for build
  eslint: {
    // Ignore ESLint errors during production builds for faster deployment
    // TODO: Fix ESLint issues and remove this in the future
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration for build
  typescript: {
    // Ignore TypeScript errors during builds (only if absolutely necessary)
    // ignoreBuildErrors: false, // Keep this commented for now
  },


  // Experimental features for better SEO
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
