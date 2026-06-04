import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output for Docker self-hosted deployment. Vercel ignores this.
  output: 'standalone',
  experimental: {
    mdxRs: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
