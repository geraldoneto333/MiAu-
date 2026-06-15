import type { NextConfig } from 'next';

const API_URL = process.env.API_URL ?? 'http://127.0.0.1:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/auth/:path*', destination: `${API_URL}/auth/:path*` },
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
      { source: '/openapi.json', destination: `${API_URL}/openapi.json` },
      { source: '/api-docs/:path*', destination: `${API_URL}/api-docs/:path*` },
    ];
  },
};

export default nextConfig;
