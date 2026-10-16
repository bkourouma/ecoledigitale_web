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
 *  - WebPage + SoftwareApplication → pages modules (packs)
 *  - FAQPage           → home + futures pages produit avec FAQ
 *  - Article           → futur hub /ressources
 */

import { CONTACT_EMAIL, CONTACT_PHONE_E164, PUBLISHER } from '@/lib/site/contact';

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
  /** Liens vers les profils sociaux officiels (LinkedIn, X, YouTube…). Aucun n'est confirmé à ce jour. */
  sameAs?: readonly string[];
  /** Numéro de téléphone au format international (+225…). Par défaut : le numéro public du site. */
  telephone?: string;
  /** E-mail de contact général. Par défaut : l'adresse publique du site. */
  email?: string;
}

/**
 * Logo : une image qui répond 200. `/apple-icon` est générée par `app/apple-icon.tsx`
 * (PNG 180×180) ; l'ancien `/icon.svg` n'existait pas et répondait 404.
 */
export const ORGANIZATION_LOGO_PATH = '/apple-icon';

export function buildOrganization(input: OrganizationInput = {}) {
  const url = getSiteUrl();
  const telephone = input.telephone ?? CONTACT_PHONE_E164;
  const email = input.email ?? CONTACT_EMAIL;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/${ORGANIZATION_ID}`,
    name: SITE_NAME,
    url,
    logo: absoluteUrl(ORGANIZATION_LOGO_PATH),
    description:
      "Logiciel de gestion scolaire pour les établissements d'Afrique francophone, de la maternelle au supérieur, avec la Côte d'Ivoire pour marché de référence.",
    // Siège limité à la ville et au pays : aucune adresse postale publiée.
    address: {
      '@type': 'PostalAddress',
      addressLocality: PUBLISHER.city,
      addressCountry: PUBLISHER.countryCode,
    },
    areaServed: { '@type': 'Country', name: PUBLISHER.country },
    parentOrganization: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      address: {
        '@type': 'PostalAddress',
        addressLocality: PUBLISHER.city,
        addressCountry: PUBLISHER.countryCode,
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      areaServed: PUBLISHER.countryCode,
      availableLanguage: ['French'],
      telephone,
      email,
    },
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: [...input.sameAs] } : {}),
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
// WebPage + SoftwareApplication (pages modules / packs)
// ---------------------------------------------------------------------------

export interface SoftwareApplicationInput {
  name: string;
  description: string;
  /** Path relatif (commence par /). */
  path: string;
  /** Image OG ou illustration du pack (URL absolue ou path relatif). */
  image?: string;
}

/**
 * Un pack est un logiciel, pas un cours : `SoftwareApplication` (l'ancien type `Course`
 * n'était pas adapté). Aucun `offers`, `aggregateRating` ni `review` : les offres sont
 * sur devis et aucun avis réel n'existe.
 */
export function buildSoftwareApplication(input: SoftwareApplicationInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${absoluteUrl(input.path)}#software`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'fr',
    publisher: { '@id': `${url}/${ORGANIZATION_ID}` },
    ...(input.image
      ? { image: input.image.startsWith('http') ? input.image : absoluteUrl(input.image) }
      : {}),
  } as const;
}

export interface WebPageInput {
  name: string;
  description: string;
  /** Path relatif (commence par /). */
  path: string;
  /** Si fourni, la page a pour sujet principal ce `SoftwareApplication` (`@id` de la même page). */
  mainEntityId?: string;
}

export function buildWebPage(input: WebPageInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: 'fr',
    isPartOf: { '@id': `${url}/${WEBSITE_ID}` },
    ...(input.mainEntityId ? { mainEntity: { '@id': input.mainEntityId } } : {}),
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
// Signature d'équipe (page auteur de type « équipe éditoriale »)
// ---------------------------------------------------------------------------

export interface EditorialTeamInput {
  name: string;
  description?: string;
  /** Path relatif à la page auteur, ex. /auteurs/equipe-ecoledigitale. */
  path: string;
}

/**
 * Une équipe n'est pas une personne : `Organization` rattachée à l'organisation
 * EcoleDigitale (`Person` serait un type incorrect pour une signature collective).
 */
export function buildEditorialTeam(input: EditorialTeamInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: absoluteUrl(input.path),
    parentOrganization: { '@id': `${url}/${ORGANIZATION_ID}` },
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
  /** `Organization` pour une signature d'équipe (par défaut `Person`). */
  authorType?: 'Person' | 'Organization';
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
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.authorName
      ? { author: { '@type': input.authorType ?? 'Person', name: input.authorName } }
      : {}),
    publisher: {
      '@type': 'Organization',
      '@id': `${url}/${ORGANIZATION_ID}`,
      name: SITE_NAME,
    },
  } as const;
}
