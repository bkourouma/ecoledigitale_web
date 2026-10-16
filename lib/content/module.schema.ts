import { z } from 'zod';

/**
 * Catalogue : un socle commun et quatre packs par cycle.
 * Les anciens slugs (parcours-bts, parcours-superieur, proformation, campus-live)
 * redirigent en 301 vers ecoledigitale-higher ou ecoledigitale-virtual (voir next.config.mjs).
 */
export const MODULE_SLUGS = [
  'socle-ecoledigitale',
  'ecoledigitale-primary',
  'ecoledigitale-secondary',
  'ecoledigitale-higher',
  'ecoledigitale-virtual',
] as const;

export const ModuleSlugSchema = z.enum(MODULE_SLUGS);
export type ModuleSlug = z.infer<typeof ModuleSlugSchema>;

export const AUDIENCES = [
  'director',
  'academic',
  'admin',
  'teacher',
  'student',
  'parent',
  'trainer',
  'owner',
] as const;

export const AudienceSchema = z.enum(AUDIENCES);
export type Audience = z.infer<typeof AudienceSchema>;

export const ModuleTypeSchema = z.enum(['socle', 'pack']);
export type ModuleType = z.infer<typeof ModuleTypeSchema>;

export const ModuleCtaTargetSchema = z.enum(['demo', 'modular-offer', 'contact']);
export type ModuleCtaTarget = z.infer<typeof ModuleCtaTargetSchema>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Le gabarit de titre du site ajoute ` | EcoleDigitale` (16 caractères) : 60 - 16 = 44. */
export const MODULE_TITLE_MAX = 44;
/** Une meta description au-delà de 155 caractères est tronquée par Google. */
export const MODULE_DESCRIPTION_MAX = 155;

const ModuleResourceRefSchema = z.object({
  type: z.enum(['guides', 'etudes-de-cas', 'glossaire']),
  slug: z.string().trim().min(2),
});

export const ModuleFrontmatterSchema = z.object({
  slug: ModuleSlugSchema,
  /** Nom du produit : surtitre de la page, cartes, formulaire. */
  name: z.string().trim().min(2).max(40),
  /** Titre H1 de la page : la requête visée (« Logiciel de gestion pour… »). */
  h1: z.string().trim().min(20).max(90),
  tagline: z.string().trim().min(30).max(120),
  type: ModuleTypeSchema,
  order: z.number().int().min(1).max(99),
  /** Date de dernière modification du contenu (`lastmod` du sitemap). */
  updatedAt: z.string().regex(ISO_DATE, 'date attendue au format YYYY-MM-DD'),
  headline: z.string().trim().min(50).max(220),
  benefits: z.array(z.string().trim().min(20).max(160)).min(3).max(8),
  features: z.array(z.string().trim().min(10).max(120)).min(4).max(12),
  audiences: z.array(AudienceSchema).min(1),
  seo: z.object({
    /** Sans la marque : le gabarit l'ajoute. */
    title: z.string().trim().min(20).max(MODULE_TITLE_MAX),
    description: z.string().trim().min(120).max(MODULE_DESCRIPTION_MAX),
  }),
  cta: z
    .object({
      label: z.string().trim().min(5).max(50),
      target: ModuleCtaTargetSchema,
    })
    .default({ label: 'Demander une démonstration', target: 'demo' }),
  /** Autres packs à proposer en bas de page (maillage). */
  related: z.array(ModuleSlugSchema).default([]),
  /** Ressources liées (guides, définitions) : liens « Voir aussi ». */
  resources: z.array(ModuleResourceRefSchema).default([]),
  /** Questions fréquentes : affichées sur la page et reprises en JSON-LD `FAQPage`. */
  faq: z
    .array(
      z.object({
        question: z.string().trim().min(10).max(200),
        answer: z.string().trim().min(20).max(600),
      }),
    )
    .max(8)
    .default([]),
});

export type ModuleFrontmatter = z.infer<typeof ModuleFrontmatterSchema>;

/**
 * Validation cross-modules : invariants du catalogue.
 * Lance une erreur descriptive si une violation est détectée.
 */
export function validateModuleCatalog(modules: ModuleFrontmatter[]): void {
  if (modules.length !== MODULE_SLUGS.length) {
    throw new Error(
      `Module catalog: expected ${MODULE_SLUGS.length} modules, got ${modules.length}.`,
    );
  }

  const socles = modules.filter((m) => m.type === 'socle');
  if (socles.length !== 1) {
    throw new Error(
      `Module catalog: expected exactly 1 "socle" module, got ${socles.length} (${socles
        .map((m) => m.slug)
        .join(', ')}).`,
    );
  }

  const slugs = new Set<string>();
  const orders = new Set<number>();
  for (const m of modules) {
    if (slugs.has(m.slug)) throw new Error(`Module catalog: duplicate slug "${m.slug}".`);
    if (orders.has(m.order))
      throw new Error(`Module catalog: duplicate order ${m.order} (slug: ${m.slug}).`);
    slugs.add(m.slug);
    orders.add(m.order);
  }

  for (const expected of MODULE_SLUGS) {
    if (!slugs.has(expected))
      throw new Error(`Module catalog: missing required slug "${expected}".`);
  }

  for (const m of modules) {
    if (m.related.includes(m.slug)) {
      throw new Error(`Module catalog: "${m.slug}" ne peut pas se référencer lui-même.`);
    }
  }
}
