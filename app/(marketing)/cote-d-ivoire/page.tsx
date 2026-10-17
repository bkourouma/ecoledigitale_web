import type { Metadata } from 'next';
import { ContentPage } from '@/components/marketing/ContentPage';
import { COTE_D_IVOIRE_PAGE } from '@/lib/marketing/pages';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: COTE_D_IVOIRE_PAGE.seo.title,
  description: COTE_D_IVOIRE_PAGE.seo.description,
  path: COTE_D_IVOIRE_PAGE.path,
  ogImage: DEFAULT_OG_IMAGE,
});

export default function CoteDIvoirePage() {
  return (
    <ContentPage
      page={COTE_D_IVOIRE_PAGE}
      breadcrumb={[
        { name: 'Accueil', url: '/' },
        { name: "Côte d'Ivoire", url: COTE_D_IVOIRE_PAGE.path },
      ]}
    />
  );
}
