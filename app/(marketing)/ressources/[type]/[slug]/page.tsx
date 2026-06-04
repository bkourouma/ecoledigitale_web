import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  ResourceTypeSchema,
  RESOURCE_TYPE_LABELS,
} from '@/lib/content/resource.schema';
import { getResourceBySlug, getStaticResourceParams } from '@/lib/content/resources';
import { getAuthor } from '@/lib/content/authors';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildArticle, buildBreadcrumbList, buildFaqPage } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ResourceMeta } from '@/components/ressources/ResourceMeta';
import { RelatedResources } from '@/components/ressources/RelatedResources';
import { DeprecatedBanner } from '@/components/ressources/DeprecatedBanner';
import { FictionalCaseBanner } from '@/components/ressources/FictionalCaseBanner';
import { CaseStudyAside } from '@/components/ressources/CaseStudyAside';
import { ResourceCTA } from '@/components/ressources/ResourceCTA';
import { resourceMdxComponents } from '@/components/ressources/resourceMdxComponents';
import { AuthorCard } from '@/components/auteurs/AuthorCard';

interface PageProps {
  params: Promise<{ type: string; slug: string }>;
}

export function generateStaticParams() {
  return getStaticResourceParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, slug } = await params;
  const parsedType = ResourceTypeSchema.safeParse(type);
  if (!parsedType.success) return {};

  const bundle = getResourceBySlug(parsedType.data, slug);
  if (!bundle) return {};

  const { frontmatter } = bundle;
  return buildMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/ressources/${frontmatter.type}/${frontmatter.slug}`,
    // ogImage explicite si fourni ; sinon la convention `opengraph-image.tsx`
    // au niveau de la route génère l'image dynamiquement.
    ogImage: frontmatter.seo.ogImage,
  });
}

export default async function ResourcePage({ params }: PageProps) {
  const { type, slug } = await params;
  const parsedType = ResourceTypeSchema.safeParse(type);
  if (!parsedType.success) notFound();

  const bundle = getResourceBySlug(parsedType.data, slug);
  if (!bundle) notFound();

  const { frontmatter, body, readingTime } = bundle;
  const author = getAuthor(frontmatter.author);
  const typeLabel = RESOURCE_TYPE_LABELS[frontmatter.type];
  const path = `/ressources/${frontmatter.type}/${frontmatter.slug}`;
  const isGlossary = frontmatter.type === 'glossaire';
  // Extraction typée pour l'affichage spécifique aux études de cas.
  const caseStudyFm = frontmatter.type === 'etudes-de-cas' ? frontmatter : null;

  const heading = isGlossary ? frontmatter.term : frontmatter.title;
  const lead = isGlossary ? frontmatter.shortDefinition : frontmatter.description;

  const jsonLd: Record<string, unknown>[] = [
    buildBreadcrumbList([
      { name: 'Accueil', url: '/' },
      { name: 'Ressources', url: '/ressources' },
      { name: typeLabel.plural, url: `/ressources?type=${frontmatter.type}` },
      { name: heading, url: path },
    ]),
    buildArticle({
      headline: frontmatter.title,
      description: frontmatter.description,
      path,
      datePublished: frontmatter.publishedAt,
      dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
      image: frontmatter.seo.ogImage,
      authorName: author?.frontmatter.name,
      disambiguatingDescription: caseStudyFm?.isFictional
        ? 'Étude de cas illustrative basée sur des données fictives.'
        : undefined,
    }),
  ];
  if (frontmatter.faq && frontmatter.faq.length > 0) {
    jsonLd.push(buildFaqPage(frontmatter.faq));
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="container-content py-12 md:py-16">
        <nav aria-label="Fil d’Ariane" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/ressources" className="underline-offset-4 hover:underline">
                Ressources
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/ressources?type=${frontmatter.type}`}
                className="underline-offset-4 hover:underline"
              >
                {typeLabel.plural}
              </Link>
            </li>
          </ol>
        </nav>

        {frontmatter.deprecated && <DeprecatedBanner className="mt-6" />}
        {caseStudyFm?.isFictional && <FictionalCaseBanner className="mt-6" />}

        <header className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            {typeLabel.singular}
          </p>
          <h1 className="mt-3 text-display-md font-semibold tracking-tight text-ink">
            {heading}
          </h1>
          <p className="mt-4 text-lg text-ink-muted">{lead}</p>
          <ResourceMeta
            frontmatter={frontmatter}
            author={author}
            readingTime={readingTime}
            className="mt-6"
          />
        </header>

        {caseStudyFm && (
          <CaseStudyAside
            caseStudy={caseStudyFm.caseStudy}
            className="mt-8 max-w-3xl"
          />
        )}

        {body.trim().length > 0 && (
          <div className="mt-10 max-w-prose">
            <MDXRemote source={body} components={resourceMdxComponents} />
          </div>
        )}

        {frontmatter.faq && frontmatter.faq.length > 0 && (
          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Questions fréquentes
            </h2>
            <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
              {frontmatter.faq.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 hover:bg-surface-subtle transition-colors">
                    <h3 className="text-sm font-semibold text-ink">{item.question}</h3>
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-ink-muted transition-transform duration-200 group-open:rotate-45"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <RelatedResources
          refs={frontmatter.relatedRessources ?? []}
          heading={isGlossary ? 'Voir aussi' : 'Ressources liées'}
          className="mt-14"
        />

        {author && <AuthorCard author={author} className="mt-14 max-w-3xl" />}

        <section className="mt-14 max-w-3xl rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 shadow-card">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            EcoleDigitale pour votre établissement
          </h2>
          <p className="mt-2 text-ink-muted">
            Découvrez en conditions réelles comment la plateforme couvre la gestion académique,
            pédagogique et financière de votre établissement.
          </p>
          <div className="mt-5">
            <ResourceCTA
              resourceType={frontmatter.type}
              resourceSlug={frontmatter.slug}
              ctaTarget="demo"
              href="/demander-demo"
              size={isGlossary ? 'md' : 'lg'}
            >
              Demander une démonstration
            </ResourceCTA>
          </div>
        </section>
      </article>
    </>
  );
}
