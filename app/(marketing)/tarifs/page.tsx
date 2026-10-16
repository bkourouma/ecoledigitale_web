import type { Metadata } from 'next';
import { ContentPage } from '@/components/marketing/ContentPage';
import { TARIFS_PAGE } from '@/lib/marketing/pages';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: TARIFS_PAGE.seo.title,
  description: TARIFS_PAGE.seo.description,
  path: TARIFS_PAGE.path,
  ogImage: DEFAULT_OG_IMAGE,
});

export default function TarifsPage() {
  return (
    <ContentPage
      page={TARIFS_PAGE}
      breadcrumb={[
        { name: 'Accueil', url: '/' },
        { name: 'Tarifs', url: TARIFS_PAGE.path },
      ]}
    />
  );
}
