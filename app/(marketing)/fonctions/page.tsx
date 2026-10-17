import type { Metadata } from 'next';
import { ContentPage } from '@/components/marketing/ContentPage';
import { FONCTIONS_HUB_PAGE } from '@/lib/marketing/pages';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: FONCTIONS_HUB_PAGE.seo.title,
  description: FONCTIONS_HUB_PAGE.seo.description,
  path: FONCTIONS_HUB_PAGE.path,
  ogImage: DEFAULT_OG_IMAGE,
});

export default function FonctionsPage() {
  return (
    <ContentPage
      page={FONCTIONS_HUB_PAGE}
      breadcrumb={[
        { name: 'Accueil', url: '/' },
        { name: 'Fonctions', url: FONCTIONS_HUB_PAGE.path },
      ]}
    />
  );
}
