import type { MetadataRoute } from 'next';
import { getAllModuleSlugs, getModuleBySlug } from '@/lib/content/modules';
import { loadResources, getResourcesByAuthor } from '@/lib/content/resources';
import { getAllAuthorSlugs } from '@/lib/content/authors';
import { STATIC_PAGE_LASTMOD, readContentUpdatedAt } from '@/lib/seo/lastmod';
import { FAQ_PAGE } from '@/lib/marketing/faq';
import {
  COTE_D_IVOIRE_PAGE,
  FEATURE_PAGES,
  FONCTIONS_HUB_PAGE,
  TARIFS_PAGE,
  type ContentPageData,
} from '@/lib/marketing/pages';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

/** Un `lastmod` est la date réelle de dernière modification du contenu, jamais la date du build. */
function toDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

/** Page « par sujet » (Côte d'Ivoire, fonctions, tarifs) : `lastmod` = `updatedAt` du contenu. */
function contentRoute(
  base: string,
  page: ContentPageData,
  changeFrequency: 'weekly' | 'monthly',
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${base}${page.path}`,
    lastModified: toDate(page.updatedAt),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  // Ressources publiées dont la date de publication est passée.
  // Les ressources deprecated restent incluses (priorité basse) pour préserver
  // le link equity ; les drafts et publications futures sont exclus (FR-023).
  // Les pages `noindex` sont exclues : une URL du sitemap doit être indexable.
  const today = now.toISOString().slice(0, 10);
  const indexableResources = loadResources().filter(
    (b) =>
      b.frontmatter.status === 'published' &&
      b.frontmatter.publishedAt <= today &&
      !b.frontmatter.noindex,
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
    contentRoute(base, COTE_D_IVOIRE_PAGE, 'monthly', 0.9),
    contentRoute(base, FONCTIONS_HUB_PAGE, 'monthly', 0.8),
    ...FEATURE_PAGES.map((page) => contentRoute(base, page, 'monthly', 0.8)),
    contentRoute(base, TARIFS_PAGE, 'monthly', 0.8),
    {
      url: `${base}/faq`,
      lastModified: toDate(FAQ_PAGE.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
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
