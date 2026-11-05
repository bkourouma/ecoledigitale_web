import type { Metadata } from 'next';
import { ResourceTypeSchema } from '@/lib/content/resource.schema';
import { getAllResources, filterResources } from '@/lib/content/resources';
import Link from 'next/link';
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
    title: 'Ressources : guides et glossaire scolaire',
    description:
      'Guides et glossaire pour choisir et utiliser un logiciel de gestion scolaire : CEPE, BEPC, BAC, MGA, conseil de classe, bulletins.',
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
  const guides = resources.filter((b) => b.frontmatter.type !== 'glossaire');
  const glossaire = resources.filter((b) => b.frontmatter.type === 'glossaire');

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
            Guides et glossaire de la gestion scolaire
          </h1>
          <p className="text-ink-muted mt-5 max-w-prose text-lg leading-relaxed">
            Des repères concrets pour choisir un logiciel de gestion scolaire et digitaliser la
            gestion de votre établissement en Côte d&apos;Ivoire — sans jargon et sans promesse
            exagérée.
          </p>
          <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">
            Vous préférez voir le produit ? Parcourez{' '}
            <Link
              href="/fonctions"
              className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
            >
              les fonctions
            </Link>
            ,{' '}
            <Link
              href="/cote-d-ivoire"
              className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
            >
              la page Côte d&apos;Ivoire
            </Link>{' '}
            ou{' '}
            <Link
              href="/faq"
              className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
            >
              la FAQ
            </Link>
            .
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
            <div className="space-y-14">
              {guides.length > 0 && (
                <div>
                  <h2 className="font-display text-primary-800 text-3xl font-bold">
                    Guides pratiques
                  </h2>
                  <p className="text-ink-muted mt-3 max-w-prose text-lg leading-relaxed">
                    Des guides pour choisir et utiliser un logiciel de gestion scolaire dans votre
                    établissement.
                  </p>
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {guides.map((bundle) => (
                      <ResourceCard
                        key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                        bundle={bundle}
                      />
                    ))}
                  </ul>
                </div>
              )}
              {glossaire.length > 0 && (
                <div>
                  <h2 className="font-display text-primary-800 text-3xl font-bold">
                    Glossaire scolaire ivoirien
                  </h2>
                  <p className="text-ink-muted mt-3 max-w-prose text-lg leading-relaxed">
                    Les termes de la vie scolaire en Côte d&apos;Ivoire (CEPE, BEPC, BAC, MGA,
                    conseil de classe) expliqués simplement.
                  </p>
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {glossaire.map((bundle) => (
                      <ResourceCard
                        key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                        bundle={bundle}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
