import type { MetadataRoute } from 'next';
import { getAllModuleSlugs, getModuleBySlug } from '@/lib/content/modules';
import { loadResources, getResourcesByAuthor } from '@/lib/content/resources';
import { getAllAuthorSlugs } from '@/lib/content/authors';
import { STATIC_PAGE_LASTMOD, readContentUpdatedAt } from '@/lib/seo/lastmod';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

/** Un `lastmod` est la date réelle de dernière modification du contenu, jamais la date du build. */
function toDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  // Ressources publiées dont la date de publication est passée.
  // Les ressources deprecated restent incluses (priorité basse) pour préserver
  // le link equity ; les drafts et publications futures sont exclus (FR-023).
  // Les pages `noindex` (dont l'étude de cas fictive) sont exclues : une URL du sitemap
  // doit être indexable.
  const today = now.toISOString().slice(0, 10);
  const indexableResources = loadResources().filter(
    (b) =>
      b.frontmatter.status === 'published' &&
      b.frontmatter.publishedAt <= today &&
      !b.frontmatter.noindex &&
      !(b.frontmatter.type === 'etudes-de-cas' && b.frontmatter.isFictional),
  );
  const resourceDate = (b: (typeof indexableResources)[number]) =>
    b.frontmatter.updatedAt ?? b.frontmatter.publishedAt;
  const hubLastmod = indexableResources.map(resourceDate).sort().at(-1) ?? STATIC_PAGE_LASTMOD.home;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: toDate(STATIC_PAGE_LASTMOD.home),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/modules`,
      lastModified: toDate(STATIC_PAGE_LASTMOD.modules),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/a-propos`,
      lastModified: toDate(STATIC_PAGE_LASTMOD.aPropos),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/demander-demo`,
      lastModified: toDate(STATIC_PAGE_LASTMOD.demanderDemo),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${base}/ressources`,
      lastModified: toDate(hubLastmod),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/confidentialite`,
      lastModified: toDate(readContentUpdatedAt('confidentialite.mdx')),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const moduleRoutes: MetadataRoute.Sitemap = getAllModuleSlugs().map((slug) => ({
    url: `${base}/modules/${slug}`,
    lastModified: toDate(getModuleBySlug(slug).frontmatter.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = indexableResources.map((b) => ({
    url: `${base}/ressources/${b.frontmatter.type}/${b.frontmatter.slug}`,
    lastModified: toDate(resourceDate(b)),
    changeFrequency: 'monthly',
    priority: b.frontmatter.deprecated ? 0.3 : 0.5,
  }));

  // Pages auteur — uniquement celles qui ont au moins une ressource publiée et indexable.
  const authorRoutes: MetadataRoute.Sitemap = getAllAuthorSlugs()
    .filter((slug) => getResourcesByAuthor(slug).length > 0)
    .map((slug) => {
      const dates = indexableResources
        .filter((b) => b.frontmatter.author === slug)
        .map(resourceDate)
        .sort();
      return {
        url: `${base}/auteurs/${slug}`,
        lastModified: toDate(dates.at(-1) ?? STATIC_PAGE_LASTMOD.home),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      };
    });

  return [...staticRoutes, ...moduleRoutes, ...resourceRoutes, ...authorRoutes];
}
