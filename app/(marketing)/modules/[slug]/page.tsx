import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ModuleSlugSchema } from '@/lib/content/module.schema';
import { getAllModuleSlugs, getModuleBySlug } from '@/lib/content/modules';
import { getResourceBySlug } from '@/lib/content/resources';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  buildBreadcrumbList,
  buildFaqPage,
  buildSoftwareApplication,
  buildWebPage,
} from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ModuleHero } from '@/components/mdx/ModuleHero';
import { ModuleBenefits } from '@/components/mdx/ModuleBenefits';
import { ModuleFeatures } from '@/components/mdx/ModuleFeatures';
import { ModuleAudiences } from '@/components/mdx/ModuleAudiences';
import { ModuleSeeAlso, type SeeAlsoLink } from '@/components/mdx/ModuleSeeAlso';
import { CalloutFinalCTA } from '@/components/mdx/CalloutFinalCTA';
import { createModuleMdxComponents } from '@/components/mdx/moduleMdxComponents';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { Reveal } from '@/components/ui/Reveal';
import { ModulePageView } from '@/components/analytics/ModulePageView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllModuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsedSlug = ModuleSlugSchema.safeParse(slug);
  if (!parsedSlug.success) return {};
  const { frontmatter } = getModuleBySlug(parsedSlug.data);
  return buildMetadata({
    title: frontmatter.seo.title,
    description: frontmatter.seo.description,
    path: `/modules/${frontmatter.slug}`,
    // ogImage non fourni → la convention `opengraph-image.tsx` au niveau
    // de la route /modules/[slug] génère une image dynamique par module.
  });
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const parsedSlug = ModuleSlugSchema.safeParse(slug);
  if (!parsedSlug.success) notFound();

  const { frontmatter, body } = getModuleBySlug(parsedSlug.data);
  const mdxComponents = createModuleMdxComponents(frontmatter);
  const path = `/modules/${frontmatter.slug}`;

  const software = buildSoftwareApplication({
    name: frontmatter.name,
    description: frontmatter.seo.description,
    path,
  });
  const jsonLd: Record<string, unknown>[] = [
    buildBreadcrumbList([
      { name: 'Accueil', url: '/' },
      { name: 'Packs', url: '/modules' },
      { name: frontmatter.name, url: path },
    ]),
    buildWebPage({
      name: frontmatter.h1,
      description: frontmatter.seo.description,
      path,
      mainEntityId: software['@id'],
    }),
    software,
  ];
  if (frontmatter.faq.length > 0) jsonLd.push(buildFaqPage(frontmatter.faq));

  const packLinks: SeeAlsoLink[] = frontmatter.related.map((relatedSlug) => {
    const related = getModuleBySlug(relatedSlug).frontmatter;
    return { href: `/modules/${related.slug}`, label: related.name, hint: related.tagline };
  });
  const resourceLinks: SeeAlsoLink[] = frontmatter.resources.flatMap((ref) => {
    const bundle = getResourceBySlug(ref.type, ref.slug);
    if (!bundle) return [];
    const fm = bundle.frontmatter;
    return [
      {
        href: `/ressources/${fm.type}/${fm.slug}`,
        label: fm.type === 'glossaire' ? fm.term : fm.title,
      },
    ];
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <ModulePageView moduleSlug={frontmatter.slug} />
      <ModuleHero module={frontmatter} />
      <ModuleBenefits module={frontmatter} />
      <ModuleFeatures module={frontmatter} />
      <ModuleAudiences module={frontmatter} />

      <section className="container-content py-16">
        <article className="prose-style">
          <MDXRemote source={body} components={mdxComponents} />
        </article>
      </section>

      {frontmatter.faq.length > 0 && (
        <section aria-labelledby="module-faq-heading" className="container-content py-12 md:py-16">
          <Reveal>
            <h2
              id="module-faq-heading"
              className="font-display text-display-sm text-primary-800 font-bold"
            >
              Questions <span className="marker">fréquentes</span>
            </h2>
          </Reveal>
          <FaqAccordion
            items={frontmatter.faq.map((entry) => ({
              question: entry.question,
              answer: entry.answer,
            }))}
            className="border-primary-700/70 mt-8 border-t-2"
          />
        </section>
      )}

      <ModuleSeeAlso packs={packLinks} resources={resourceLinks} />

      <CalloutFinalCTA module={frontmatter} />
    </>
  );
}
