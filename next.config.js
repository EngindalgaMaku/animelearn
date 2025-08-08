/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static file serving in production
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/static-files/:path*',
      },
    ]
  },
  // Ensure proper static file handling
  trailingSlash: false,
  output: 'standalone',
}

module.exports = nextConfig