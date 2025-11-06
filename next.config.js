import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force new build ID to bypass Vercel cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google OAuth images
      'avatars.githubusercontent.com', // GitHub OAuth images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Exclude client-only libraries from server bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
