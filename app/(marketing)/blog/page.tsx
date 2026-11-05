import type { Metadata } from 'next';
import Link from 'next/link';
import { ResourceCard } from '@/components/ressources/ResourceCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllResources } from '@/lib/content/resources';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Blog : conseils en gestion scolaire',
  description:
    'Articles, conseils et analyses pour réussir la digitalisation de votre établissement scolaire, du primaire à l’enseignement supérieur.',
  path: '/blog',
});

export default function BlogPage() {
  const allResources = getAllResources();
  const blogPosts = allResources.filter((bundle) => bundle.frontmatter.type === 'blog');
  const guidePosts = allResources.filter(
    (bundle) => bundle.frontmatter.type === 'guides' || bundle.frontmatter.type === 'etudes-de-cas',
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Ressources', url: '/ressources' },
          { name: 'Blog', url: '/blog' },
        ])}
      />

      {/* Hero */}
      <section className="relative">
        <div className="container-content py-16 md:py-20">
          <p className="red-note text-2xl font-bold">Ressources & Réflexions</p>
          <h1 className="font-display text-display-md text-primary-800 mt-3 max-w-3xl font-bold">
            Le Blog d’EcoleDigitale
          </h1>
          <p className="text-ink-muted mt-5 max-w-2xl text-lg leading-relaxed">
            Analyses, bonnes pratiques et retours d’expérience pour piloter un établissement plus
            simple à gérer, de la gestion académique aux relations avec les familles.
          </p>
        </div>
      </section>

      {/* Articles de blog */}
      <section className="container-content py-10">
        <div className="border-primary-200 flex flex-wrap items-end justify-between gap-4 border-b-2 border-dashed pb-4">
          <div>
            <h2 className="font-display text-primary-800 text-4xl leading-none font-bold">
              Derniers billets
            </h2>
            <p className="text-ink-muted mt-1.5">
              Les articles récents de l’équipe éditoriale pour éclairer vos décisions.
            </p>
          </div>
          <Link
            href="/ressources"
            className="text-brand-700 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Voir tout le hub Ressources
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {blogPosts.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((bundle) => (
              <ResourceCard
                key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                bundle={bundle}
              />
            ))}
          </ul>
        ) : (
          <div className="border-line shadow-card mt-8 rounded-md border bg-white p-10 text-center">
            <p className="text-ink-muted">Les premiers articles du blog arrivent bientôt.</p>
          </div>
        )}
      </section>

      {/* Guides et cas pratiques associés */}
      {guidePosts.length > 0 && (
        <section className="container-content py-12">
          <div className="border-primary-200 flex flex-wrap items-end justify-between gap-4 border-b-2 border-dashed pb-4">
            <div>
              <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
                Guides méthodologiques & études de cas
              </h2>
              <p className="text-ink-muted mt-1.5">
                Des formats longs pour approfondir le choix de vos outils et la conduite du
                changement.
              </p>
            </div>
            <Link
              href="/ressources?type=guides"
              className="text-brand-700 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Consulter les guides
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guidePosts.slice(0, 3).map((bundle) => (
              <ResourceCard
                key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                bundle={bundle}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
