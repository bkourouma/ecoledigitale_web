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
      <section className="relative overflow-hidden border-b border-slate-100 dark:border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(47,129,250,0.09) 0%, transparent 60%), #fff',
          }}
        />
        <div className="container-content py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">Blog</p>
          <h1 className="mt-3 max-w-3xl text-display-md font-semibold tracking-tight text-ink dark:text-white">
            Conseils pour piloter une école plus simple à gérer
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
            Guides pratiques, retours d'expérience et points de méthode pour digitaliser la
            gestion académique, pédagogique et administrative de votre établissement.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="container-content py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Derniers articles</h2>
            <p className="mt-1.5 text-ink-muted">
              Une sélection de contenus actionnables pour les directions et équipes pédagogiques.
            </p>
          </div>
          <Link
            href="/ressources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
          >
            Voir toutes les ressources
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
          <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-card">
            <p className="text-ink-muted">Les premiers articles du blog arrivent bientôt.</p>
          </div>
        )}
      </section>
    </>
  );
}
