import type { Metadata } from 'next';

/**
 * Image Open Graph racine (`app/opengraph-image.tsx`). Les pages qui n'ont pas leur propre
 * `opengraph-image.tsx` (accueil, packs en liste, à propos, démonstration, confidentialité)
 * la passent explicitement : un `openGraph` défini au niveau d'une page remplace en effet
 * celui du layout, image comprise.
 */
export const DEFAULT_OG_IMAGE = '/opengraph-image';

export interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  /**
   * URL d'image OG explicite (statique). Si non fournie, la convention
   * Next.js `opengraph-image.tsx` au niveau de la route prend le relais
   * (image par module, par ressource, par auteur, sinon l'image racine).
   */
  ogImage?: string;
  noindex?: boolean;
  /**
   * Titre complet, sans le gabarit `%s | EcoleDigitale` (page d'accueil, qui porte déjà la marque).
   */
  absoluteTitle?: boolean;
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

  // Image explicite uniquement si fournie : sinon Next.js ajoute lui-même l'image du fichier
  // `opengraph-image.tsx` le plus proche de la route (module, ressource, auteur, hub ou racine).
  // Poser `images` ici écraserait ces images par page (c'était le cas avant : même image partout).
  if (input.ogImage) {
    openGraph.images = [{ url: input.ogImage, width: 1200, height: 630, alt: input.title }];
    twitter.images = [input.ogImage];
  }

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
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
