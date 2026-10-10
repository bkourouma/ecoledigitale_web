import type { Metadata } from 'next';
import Link from 'next/link';
import { ResourceCard } from '@/components/ressources/ResourceCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllResources } from '@/lib/content/resources';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Blog EcoleDigitale : guides et conseils',
  description:
    'Articles, guides et cas pratiques pour structurer la digitalisation de votre ecole, institut BTS ou organisme de formation.',
  path: '/blog',
});

export default function BlogPage() {
  const posts = getAllResources().filter((bundle) => bundle.frontmatter.type !== 'glossaire');

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />

      {/* Hero */}
      <section className="relative">
        <div className="container-content py-16 md:py-20">
          <h1 className="font-display text-display-md text-primary-800 mt-3 max-w-3xl font-bold">
            Conseils pour piloter une école plus simple à gérer
          </h1>
          <p className="text-ink-muted mt-5 max-w-xl text-lg leading-relaxed">
            Guides pratiques, retours d'expérience et points de méthode pour digitaliser la gestion
            académique, pédagogique et administrative de votre établissement.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="container-content py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-primary-800 text-4xl leading-none font-bold">
              Derniers articles
            </h2>
            <p className="text-ink-muted mt-1.5">
              Une sélection de contenus actionnables pour les directions et équipes pédagogiques.
            </p>
          </div>
          <Link
            href="/ressources"
            className="text-brand-700 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            Voir toutes les ressources
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

        {posts.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((bundle) => (
              <ResourceCard
                key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                bundle={bundle}
              />
            ))}
          </ul>
        ) : (
          <div className="border-line shadow-card mt-10 rounded-md border bg-white p-10 text-center">
            <p className="text-ink-muted">Les premiers articles du blog arrivent bientôt.</p>
          </div>
        )}
      </section>
    </>
  );
}
