/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  serverExternalPackages: ["sharp"],

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // WebSocket configuration for better HMR
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };

      // Only disable CSS cache, not all webpack cache
      if (config.cache && config.cache.type === "memory") {
        config.cache.maxAge = 1000; // 1 second for CSS refresh
      }

      // Tailwind CSS optimization
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Development mode settings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Image optimization for better Core Web Vitals
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
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression and performance
  compress: true,
  poweredByHeader: false,

  // SEO and performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https: https://www.google-analytics.com https://analytics.google.com; frame-src 'self'",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/sitemap-:type.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
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
      {
        source: "/_next/static/css/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "production"
                ? "public, max-age=31536000, immutable"
                : "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/_next/static/chunks/(.*).js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "production"
                ? "public, max-age=31536000, immutable"
                : "no-cache, no-store, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/_next/static/chunks/(.*)",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "production"
                ? "public, max-age=31536000, immutable"
                : "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/media/(.*).woff2",
        headers: [
          {
            key: "Content-Type",
            value: "font/woff2",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/media/(.*).woff",
        headers: [
          {
            key: "Content-Type",
            value: "font/woff",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        source: "/api/secure-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Rewrites for better SEO URLs
  async rewrites() {
    return [
      // Static file handling
      {
        source: "/uploads/:path*",
        destination: "/api/static-files/:path*",
      },
      // SEO-friendly URLs
      {
        source: "/python-kursu",
        destination: "/code-arena",
      },
      {
        source: "/python-kursu/:path*",
        destination: "/code-arena/:path*",
      },
      {
        source: "/kart-koleksiyonu",
        destination: "/shop",
      },
      {
        source: "/kart-koleksiyonu/:path*",
        destination: "/shop/:path*",
      },
      {
        source: "/rozetler-basarimlar",
        destination: "/achievements",
      },
      {
        source: "/gunluk-gorevler",
        destination: "/dashboard",
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/learn",
        destination: "/code-arena",
        permanent: true,
      },
      {
        source: "/lessons",
        destination: "/code-arena",
        permanent: true,
      },
      {
        source: "/collection",
        destination: "/shop",
        permanent: true,
      },
    ];
  },

  // Bundle optimization
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Static file handling
  trailingSlash: false,
  output: "standalone",
};

module.exports = nextConfig;
