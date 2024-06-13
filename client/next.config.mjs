import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      //rewrite API requests to Express server
      {
        source: "/:path*",
        destination: "http://localhost:8080/:path*",
        //TODO change destination to server host using env var
      }
    ]
  }
}

export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
});

