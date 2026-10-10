import type { Metadata } from 'next';
import { ResourceTypeSchema } from '@/lib/content/resource.schema';
import { getAllResources, filterResources } from '@/lib/content/resources';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ResourceCard } from '@/components/ressources/ResourceCard';
import { ResourceFilters } from '@/components/ressources/ResourceFilters';
import { EmptyState } from '@/components/ressources/EmptyState';

interface PageProps {
  searchParams: Promise<{ persona?: string; type?: string }>;
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Ressources : guides, études de cas et glossaire',
    description:
      'Guides, cas pratiques et glossaire pour digitaliser la gestion scolaire et la formation avec EcoleDigitale.',
    path: '/ressources',
  });
}

export default async function ResourcesHubPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsedType = ResourceTypeSchema.safeParse(params.type);
  const type = parsedType.success ? parsedType.data : undefined;
  const persona = params.persona || undefined;

  const publishedCount = getAllResources().length;
  const resources = filterResources({ persona, type });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Ressources', url: '/ressources' },
        ])}
      />

      {/* Hero */}
      <section className="relative">
        <div className="container-content py-16 md:py-20">
          <h1 className="font-display text-display-md text-primary-800 mt-3 font-bold">
            Guides, études de cas et glossaire
          </h1>
          <p className="text-ink-muted mt-5 max-w-prose text-lg leading-relaxed">
            Des repères concrets pour digitaliser la gestion académique, pédagogique et
            administrative de votre établissement — sans jargon et sans promesse exagérée.
          </p>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="container-content py-12">
        <ResourceFilters currentPersona={persona} currentType={type} />

        <div className="mt-10">
          {publishedCount === 0 ? (
            <EmptyState variant="hub-empty" />
          ) : resources.length === 0 ? (
            <EmptyState variant="no-results" />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((bundle) => (
                <ResourceCard
                  key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                  bundle={bundle}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
