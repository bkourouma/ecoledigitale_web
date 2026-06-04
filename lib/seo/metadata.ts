import type { Metadata } from 'next';

export interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  /**
   * URL d'image OG explicite (statique). Si non fournie, la convention
   * Next.js `opengraph-image.tsx` au niveau de la route prend le relais.
   */
  ogImage?: string;
  noindex?: boolean;
}

const SITE_NAME = 'EcoleDigitale';

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';
}

function getCanonical(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

function getDefaultOgImage(): string {
  const base = getSiteUrl().replace(/\/$/, '');
  return `${base}/opengraph-image`;
}

/**
 * Helper centralisé pour générer les metadata Next.js.
 * Garantit la cohérence canonical / OG / Twitter / robots sur toutes les pages.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = getCanonical(input.path);
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const shouldNoIndex = input.noindex ?? Boolean(isPreview);

  const openGraph: Metadata['openGraph'] = {
    type: 'website',
    locale: 'fr_FR',
    url: canonical,
    siteName: SITE_NAME,
    title: input.title,
    description: input.description,
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: input.title,
    description: input.description,
  };

  const ogImage = input.ogImage ?? getDefaultOgImage();
  openGraph.images = [{ url: ogImage, width: 1200, height: 630, alt: input.title }];
  twitter.images = [ogImage];

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph,
    twitter,
    robots: {
      index: !shouldNoIndex,
      follow: !shouldNoIndex,
    },
  };
}
