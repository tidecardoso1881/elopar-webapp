import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Otimiza Server Components para Vercel Edge Network
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
}

export default nextConfig