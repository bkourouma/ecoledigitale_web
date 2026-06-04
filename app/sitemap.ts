import type { MetadataRoute } from 'next';
import { getAllModuleSlugs } from '@/lib/content/modules';
import { loadResources, getResourcesByAuthor } from '@/lib/content/resources';
import { getAllAuthorSlugs } from '@/lib/content/authors';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/modules`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${base}/demander-demo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${base}/ressources`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const moduleRoutes: MetadataRoute.Sitemap = getAllModuleSlugs().map((slug) => ({
    url: `${base}/modules/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Ressources publiées dont la date de publication est passée.
  // Les ressources deprecated restent incluses (priorité basse) pour préserver
  // le link equity ; les drafts et publications futures sont exclus (FR-023).
  const today = now.toISOString().slice(0, 10);
  const resourceRoutes: MetadataRoute.Sitemap = loadResources()
    .filter(
      (b) =>
        b.frontmatter.status === 'published' && b.frontmatter.publishedAt <= today,
    )
    .map((b) => ({
      url: `${base}/ressources/${b.frontmatter.type}/${b.frontmatter.slug}`,
      lastModified: new Date(b.frontmatter.updatedAt ?? b.frontmatter.publishedAt),
      changeFrequency: 'monthly',
      priority: b.frontmatter.deprecated ? 0.3 : 0.5,
    }));

  // Pages auteur — uniquement celles qui ont au moins une ressource publiée.
  const authorRoutes: MetadataRoute.Sitemap = getAllAuthorSlugs()
    .filter((slug) => getResourcesByAuthor(slug).length > 0)
    .map((slug) => ({
      url: `${base}/auteurs/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    }));

  return [...staticRoutes, ...moduleRoutes, ...resourceRoutes, ...authorRoutes];
}
