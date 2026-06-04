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
      <section className="relative overflow-hidden border-b border-slate-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(47,129,250,0.09) 0%, transparent 60%), #fff',
          }}
        />
        <div className="container-content py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            Ressources
          </p>
          <h1 className="mt-3 text-display-md font-semibold tracking-tight text-ink">
            Guides, études de cas et glossaire
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-muted">
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
