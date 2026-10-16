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
  // Redirections permanentes en 301 (et non 308, valeur par défaut de `permanent: true`).
  async redirects() {
    return [
      // /blog n'avait aucun article propre : il doublait /ressources.
      { source: '/blog', destination: '/ressources', statusCode: 301 },
      { source: '/blog/:path*', destination: '/ressources', statusCode: 301 },
      // Anciens modules, remplacés par le socle et les 4 packs.
      {
        source: '/modules/parcours-bts',
        destination: '/modules/ecoledigitale-higher',
        statusCode: 301,
      },
      {
        source: '/modules/parcours-superieur',
        destination: '/modules/ecoledigitale-higher',
        statusCode: 301,
      },
      {
        source: '/modules/proformation',
        destination: '/modules/ecoledigitale-virtual',
        statusCode: 301,
      },
      {
        source: '/modules/campus-live',
        destination: '/modules/ecoledigitale-virtual',
        statusCode: 301,
      },
      // Définitions du cadre français (Qualiopi, RNCP, alternance), retirées du glossaire.
      ...['qualiopi', 'referentiel-rncp', 'alternance'].map((slug) => ({
        source: `/ressources/glossaire/${slug}`,
        destination: '/ressources?type=glossaire',
        statusCode: 301,
      })),
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
