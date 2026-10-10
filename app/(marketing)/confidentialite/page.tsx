import type { Metadata } from 'next';
import { useMDXComponents as getMdxComponents } from '@/mdx-components';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Confidentialité et protection des données',
  description:
    'Comment EcoleDigitale collecte, conserve et protège vos données personnelles. Mention RGPD et droits utilisateur.',
  path: '/confidentialite',
});

export default function ConfidentialitePage() {
  const filePath = join(process.cwd(), 'content', 'confidentialite.mdx');
  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Confidentialité', url: '/confidentialite' },
        ])}
      />
      <section className="container-content py-16 md:py-20">
        <article className="mx-auto max-w-3xl">
          <MDXRemote source={content} components={getMdxComponents({})} />
        </article>
      </section>
    </>
  );
}
