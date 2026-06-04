import { z } from 'zod';

export const MODULE_SLUGS = [
  'socle-ecoledigitale',
  'parcours-bts',
  'parcours-superieur',
  'proformation',
  'campus-live',
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

export const ModuleTypeSchema = z.enum(['socle', 'optionnel']);
export type ModuleType = z.infer<typeof ModuleTypeSchema>;

export const ModuleCtaTargetSchema = z.enum(['demo', 'modular-offer', 'contact']);
export type ModuleCtaTarget = z.infer<typeof ModuleCtaTargetSchema>;

export const ModuleFrontmatterSchema = z.object({
  slug: ModuleSlugSchema,
  name: z.string().trim().min(2).max(40),
  tagline: z.string().trim().min(30).max(120),
  type: ModuleTypeSchema,
  order: z.number().int().min(1).max(99),
  headline: z.string().trim().min(50).max(200),
  benefits: z.array(z.string().trim().min(20).max(160)).min(3).max(8),
  features: z.array(z.string().trim().min(10).max(120)).min(4).max(12),
  audiences: z.array(AudienceSchema).min(1),
  seo: z.object({
    title: z.string().trim().min(20).max(60),
    description: z.string().trim().min(120).max(160),
    ogImage: z.string().startsWith('/'),
  }),
  cta: z.object({
    label: z.string().trim().min(5).max(50),
    target: ModuleCtaTargetSchema,
  }),
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
}
