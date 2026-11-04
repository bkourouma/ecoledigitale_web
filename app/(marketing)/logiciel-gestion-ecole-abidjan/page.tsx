import type { Metadata } from 'next';
import { ContentPage } from '@/components/marketing/ContentPage';
import { ABIDJAN_PAGE } from '@/lib/marketing/pages';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: ABIDJAN_PAGE.seo.title,
  description: ABIDJAN_PAGE.seo.description,
  path: ABIDJAN_PAGE.path,
  ogImage: DEFAULT_OG_IMAGE,
});

export default function AbidjanPage() {
  return (
    <ContentPage
      page={ABIDJAN_PAGE}
      breadcrumb={[
        { name: 'Accueil', url: '/' },
        { name: "Logiciel de gestion d'école à Abidjan", url: ABIDJAN_PAGE.path },
      ]}
    />
  );
}
