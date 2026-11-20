import createMDX from '@next/mdx';

// Read only while building: Next serializes these headers into the production artifact.
const commitSha = process.env.APP_COMMIT_SHA;
const commitHeaders = commitSha?.length === 40 && /^[0-9a-f]{40}$/.test(commitSha)
  ? [{ key: "x-commit-sha", value: commitSha }]
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output for Docker self-hosted deployment. Vercel ignores this.
  output: process.platform === 'win32' && !process.env.CI ? undefined : 'standalone',
  experimental: {
    mdxRs: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return commitHeaders.length ? [{ source: "/(.*)", headers: commitHeaders }] : [];
  },
  // Redirections permanentes en 301 (et non 308, valeur par défaut de `permanent: true`).
  async redirects() {
    return [
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
      // Ancienne étude de cas fictive, supprimée : aucune étude de cas n'est publiée.
      {
        source: '/ressources/etudes-de-cas/exemple-institut-bts',
        destination: '/ressources',
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
