/**
 * Helpers JSON-LD (Schema.org) pour les rich results Google.
 *
 * Chaque builder retourne un objet JSON sérialisable destiné à être injecté
 * dans la page via le composant <JsonLd /> (un <script type="application/ld+json">).
 *
 * Schémas couverts :
 *  - Organization      → identité de l'entreprise (root layout)
 *  - WebSite           → identité du site + SearchAction future (root layout)
 *  - BreadcrumbList    → fil d'Ariane (toutes pages internes)
 *  - Course            → pages modules (rich results "cours" Google)
 *  - FAQPage           → home + futures pages produit avec FAQ
 *  - Article           → futur hub /ressources
 */

const SITE_NAME = 'EcoleDigitale';
const ORGANIZATION_ID = '#organization';
const WEBSITE_ID = '#website';

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export interface OrganizationInput {
  /** Liens vers les profils sociaux officiels (LinkedIn, X, YouTube…). */
  sameAs?: readonly string[];
  /** Numéro de téléphone au format international (+33…). */
  telephone?: string;
  /** Email de contact général. */
  email?: string;
}

export function buildOrganization(input: OrganizationInput = {}) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/${ORGANIZATION_ID}`,
    name: SITE_NAME,
    url,
    logo: absoluteUrl('/icon.svg'),
    description:
      'Plateforme SaaS modulaire pour digitaliser la gestion académique, pédagogique et financière des établissements de formation.',
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: [...input.sameAs] } : {}),
    ...(input.telephone || input.email
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            areaServed: 'FR',
            availableLanguage: ['French'],
            ...(input.telephone ? { telephone: input.telephone } : {}),
            ...(input.email ? { email: input.email } : {}),
          },
        }
      : {}),
  } as const;
}

// ---------------------------------------------------------------------------
// WebSite
// ---------------------------------------------------------------------------

export function buildWebSite() {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/${WEBSITE_ID}`,
    url,
    name: SITE_NAME,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${url}/${ORGANIZATION_ID}` },
  } as const;
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string;
  /** Path relatif (commence par /) ou URL absolue. */
  url: string;
}

export function buildBreadcrumbList(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  } as const;
}

// ---------------------------------------------------------------------------
// Course (pages modules)
// ---------------------------------------------------------------------------

export interface CourseInput {
  name: string;
  description: string;
  /** Path relatif (commence par /). */
  path: string;
  /** Image OG ou illustration du module. */
  image?: string;
}

export function buildCourse(input: CourseInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: 'fr-FR',
    provider: {
      '@type': 'Organization',
      '@id': `${url}/${ORGANIZATION_ID}`,
      name: SITE_NAME,
      sameAs: url,
    },
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
  } as const;
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFaqPage(entries: readonly FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  } as const;
}

// ---------------------------------------------------------------------------
// Person (pages auteurs — signal E-E-A-T)
// ---------------------------------------------------------------------------

export interface PersonInput {
  name: string;
  jobTitle?: string;
  description?: string;
  /** Path relatif à l'auteur, ex. /auteurs/marie-dupont. */
  path: string;
  /** Path absolu ou relatif à une photo (commençant par /). */
  image?: string;
  /** Profils sociaux (LinkedIn, X, etc.). */
  sameAs?: readonly string[];
}

export function buildPerson(input: PersonInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: [...input.sameAs] } : {}),
    worksFor: {
      '@type': 'Organization',
      '@id': `${url}/${ORGANIZATION_ID}`,
      name: SITE_NAME,
    },
  } as const;
}

// ---------------------------------------------------------------------------
// Article (pour /ressources futur)
// ---------------------------------------------------------------------------

export interface ArticleInput {
  headline: string;
  description: string;
  /** Path relatif. */
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  /**
   * Mention de désambiguïsation (Schema.org `disambiguatingDescription`).
   * Utilisé notamment pour signaler une étude de cas illustrative/fictive.
   */
  disambiguatingDescription?: string;
}

export function buildArticle(input: ArticleInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    inLanguage: 'fr-FR',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.path),
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(input.disambiguatingDescription
      ? { disambiguatingDescription: input.disambiguatingDescription }
      : {}),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.authorName
      ? { author: { '@type': 'Person', name: input.authorName } }
      : {}),
    publisher: {
      '@type': 'Organization',
      '@id': `${url}/${ORGANIZATION_ID}`,
      name: SITE_NAME,
    },
  } as const;
}
