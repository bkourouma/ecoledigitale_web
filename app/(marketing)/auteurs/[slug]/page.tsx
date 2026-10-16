import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthor, getAllAuthorSlugs } from '@/lib/content/authors';
import { getResourcesByAuthor } from '@/lib/content/resources';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildPerson, buildEditorialTeam, buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { AuthorBio } from '@/components/auteurs/AuthorBio';
import { ResourceCard } from '@/components/ressources/ResourceCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllAuthorSlugs().map((slug) => ({ slug }));
}

/** Tronque une bio au mot près pour servir de meta description (155 car. au plus). */
function toDescription(bio: string): string {
  if (bio.length <= 155) return bio;
  return `${bio.slice(0, 152).replace(/\s+\S*$/, '')}…`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};

  return buildMetadata({
    // Le gabarit de titre ajoute déjà « | EcoleDigitale » : on retire la marque du nom de l'équipe.
    title: author.frontmatter.name.replace(/\s*EcoleDigitale\s*/, ' ').trim(),
    description: toDescription(author.frontmatter.bio),
    path: `/auteurs/${slug}`,
  });
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const resources = getResourcesByAuthor(slug);
  const { frontmatter } = author;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbList([
            { name: 'Accueil', url: '/' },
            { name: frontmatter.name, url: `/auteurs/${slug}` },
          ]),
          frontmatter.kind === 'organization'
            ? buildEditorialTeam({
                name: frontmatter.name,
                description: frontmatter.bio,
                path: `/auteurs/${slug}`,
              })
            : buildPerson({
                name: frontmatter.name,
                jobTitle: frontmatter.role,
                description: frontmatter.bio,
                path: `/auteurs/${slug}`,
                image: frontmatter.photo,
                sameAs: frontmatter.linkedinUrl ? [frontmatter.linkedinUrl] : undefined,
              }),
        ]}
      />

      <section className="container-content py-12 md:py-16">
        <nav aria-label="Fil d’Ariane" className="text-ink-soft text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{frontmatter.name}</li>
          </ol>
        </nav>

        <div className="mt-8">
          <AuthorBio author={author} />
        </div>

        {resources.length > 0 && (
          <div className="border-line mt-14 border-t pt-12">
            <h2 className="font-display text-primary-800 text-4xl leading-none font-bold">
              Ressources signées
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((bundle) => (
                <ResourceCard
                  key={`${bundle.frontmatter.type}/${bundle.frontmatter.slug}`}
                  bundle={bundle}
                />
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
