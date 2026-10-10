import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ModuleSlugSchema } from '@/lib/content/module.schema';
import { getAllModuleSlugs, getModuleBySlug } from '@/lib/content/modules';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList, buildCourse } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { ModuleHero } from '@/components/mdx/ModuleHero';
import { ModuleBenefits } from '@/components/mdx/ModuleBenefits';
import { ModuleFeatures } from '@/components/mdx/ModuleFeatures';
import { ModuleAudiences } from '@/components/mdx/ModuleAudiences';
import { CalloutFinalCTA } from '@/components/mdx/CalloutFinalCTA';
import { createModuleMdxComponents } from '@/components/mdx/moduleMdxComponents';
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

  const jsonLd = [
    buildBreadcrumbList([
      { name: 'Accueil', url: '/' },
      { name: 'Modules', url: '/modules' },
      { name: frontmatter.name, url: `/modules/${frontmatter.slug}` },
    ]),
    buildCourse({
      name: frontmatter.name,
      description: frontmatter.seo.description,
      path: `/modules/${frontmatter.slug}`,
      image: frontmatter.seo.ogImage,
    }),
  ];

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

      <CalloutFinalCTA module={frontmatter} />
    </>
  );
}
