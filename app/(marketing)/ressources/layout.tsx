import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Ressources : guides, etudes de cas et glossaire',
  description:
    'Guides, cas pratiques et glossaire pour digitaliser la gestion scolaire et la formation avec EcoleDigitale.',
  path: '/ressources',
});

export default function RessourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
