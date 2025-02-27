import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.figma.com',
      },
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
      {
        protocol: 'https',
        hostname: 's3-id-jkt-1.kilatstorage.id',
      },
    ],
  },
  redirects: async () => ([
    {
      source: '/',
      destination: '/home',
      permanent: true,
    },
    {
      source: '/dashboard',
      destination: '/dashboard/home',
      permanent: true,
    },
    {
      source: '/dashboard/listings',
      destination: '/dashboard/home',
      permanent: true,
    },
  ]),
};

export default nextConfig;
