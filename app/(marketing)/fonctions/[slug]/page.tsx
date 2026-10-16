import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/marketing/ContentPage';
import { FEATURE_LABELS, FEATURE_PAGES, type ContentPageData } from '@/lib/marketing/pages';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findFeature(slug: string): ContentPageData | undefined {
  return FEATURE_PAGES.find((page) => page.path === `/fonctions/${slug}`);
}

export function generateStaticParams() {
  return FEATURE_PAGES.map((page) => ({ slug: page.path.replace('/fonctions/', '') }));
}

// Une URL inconnue répond 404 (pas de rendu à la demande).
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findFeature(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: page.path,
    ogImage: DEFAULT_OG_IMAGE,
  });
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const page = findFeature(slug);
  if (!page) notFound();

  return (
    <ContentPage
      page={page}
      breadcrumb={[
        { name: 'Accueil', url: '/' },
        { name: 'Fonctions', url: '/fonctions' },
        { name: FEATURE_LABELS[page.path] ?? page.h1, url: page.path },
      ]}
    />
  );
}
