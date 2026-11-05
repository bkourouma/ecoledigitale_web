import { z } from 'zod';
import { AuthorSlugSchema } from './author.schema';
import { humanizeZodIssue } from './author.schema';
import { MODULE_SLUGS } from './module.schema';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const RESOURCE_PERSONAS = [
  'ecole-privee',
  'primaire',
  'secondaire',
  'superieur',
  'formation-pro',
  'a-distance',
  'tous',
] as const;

export const PersonaSchema = z.enum(RESOURCE_PERSONAS);
export type Persona = z.infer<typeof PersonaSchema>;

/** Libellés d'affichage des personas — badges, filtres du hub. */
export const RESOURCE_PERSONA_LABELS: Record<Persona, string> = {
  'ecole-privee': 'École privée',
  primaire: 'Maternelle et primaire',
  secondaire: 'Collège et lycée',
  superieur: 'Supérieur et BTS',
  'formation-pro': 'Centre de formation',
  'a-distance': 'Formation à distance',
  tous: 'Tous publics',
};

export const RESOURCE_TYPES = ['blog', 'guides', 'etudes-de-cas', 'glossaire'] as const;
export const ResourceTypeSchema = z.enum(RESOURCE_TYPES);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

/** Libellés d'affichage par type — badges, fil d'Ariane, titres de section. */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, { singular: string; plural: string }> = {
  blog: { singular: 'Article', plural: 'Blog' },
  guides: { singular: 'Guide', plural: 'Guides' },
  'etudes-de-cas': { singular: 'Étude de cas', plural: 'Études de cas' },
  glossaire: { singular: 'Définition', plural: 'Glossaire' },
};

export const ResourceStatusSchema = z.enum(['draft', 'published']);
export type ResourceStatus = z.infer<typeof ResourceStatusSchema>;

export const ResourceSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, 'slug doit être en kebab-case (a-z, 0-9, tirets uniquement)')
  .min(3)
  .max(60);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// ---------------------------------------------------------------------------
// Sous-schémas frontmatter
// ---------------------------------------------------------------------------

const SeoSchema = z
  .object({
    keywords: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
    ogImage: z.string().startsWith('/').optional(),
  })
  .default({});

const FaqEntrySchema = z.object({
  question: z.string().trim().min(10).max(200),
  answer: z.string().trim().min(20).max(800),
});

const RelatedRefSchema = z.object({
  type: ResourceTypeSchema,
  slug: ResourceSlugSchema,
});

export const ResourceFrontmatterBaseSchema = z.object({
  slug: ResourceSlugSchema,
  title: z.string().trim().min(20).max(80),
  /**
   * Titre de l'onglet et des résultats Google, sans la marque (le gabarit ajoute ` | EcoleDigitale`,
   * soit 16 caractères : 44 au plus pour rester sous 60). Par défaut, `title` (ou `term`).
   */
  seoTitle: z.string().trim().min(10).max(44).optional(),
  description: z.string().trim().min(80).max(160),
  /** Page hors de l'index Google et du sitemap (brouillons publics). */
  noindex: z.boolean().default(false),

  type: ResourceTypeSchema,
  status: ResourceStatusSchema.default('draft'),
  deprecated: z.boolean().default(false),

  publishedAt: z.string().regex(ISO_DATE, 'date attendue au format YYYY-MM-DD'),
  updatedAt: z.string().regex(ISO_DATE, 'date attendue au format YYYY-MM-DD').optional(),

  author: AuthorSlugSchema,
  personas: z.array(PersonaSchema).min(1).max(5),
  category: z.string().trim().min(2).max(40),

  seo: SeoSchema,

  faq: z.array(FaqEntrySchema).max(15).optional(),
  relatedRessources: z.array(RelatedRefSchema).max(8).optional(),
});

// ---------------------------------------------------------------------------
// Sous-types discriminés
// ---------------------------------------------------------------------------

export const BlogFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('blog'),
});

export const GuideFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('guides'),
});

export const CaseStudyDetailsSchema = z.object({
  establishment: z.string().trim().min(2).max(80),
  establishmentType: z.string().trim().min(2).max(40),
  modulesActivated: z.array(z.string().trim()).min(1),
  testimonialAuthor: z.string().trim().min(2).max(80),
  testimonialRole: z.string().trim().min(2).max(80),
});

export const CaseStudyFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('etudes-de-cas'),
  caseStudy: CaseStudyDetailsSchema,
});

export const GlossaryFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('glossaire'),
  term: z.string().trim().min(2).max(60),
  shortDefinition: z.string().trim().min(30).max(200),
});

export const ResourceFrontmatterSchema = z.discriminatedUnion('type', [
  BlogFrontmatterSchema,
  GuideFrontmatterSchema,
  CaseStudyFrontmatterSchema,
  GlossaryFrontmatterSchema,
]);

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;
export type GuideFrontmatter = z.infer<typeof GuideFrontmatterSchema>;
export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;
export type GlossaryFrontmatter = z.infer<typeof GlossaryFrontmatterSchema>;
export type ResourceFrontmatter = z.infer<typeof ResourceFrontmatterSchema>;

// ---------------------------------------------------------------------------
// Helpers de validation cross-document (utilisés par validateResourceCatalog)
// ---------------------------------------------------------------------------

/** Vérifie qu'un slug de module activé existe dans MODULE_SLUGS. */
export function isValidModuleSlug(slug: string): boolean {
  return (MODULE_SLUGS as readonly string[]).includes(slug);
}

/** Vérifie l'invariant "tous" persona : exclusif avec les autres valeurs. */
export function personasNeedAutoCleaning(personas: readonly Persona[]): boolean {
  return personas.length > 1 && personas.includes('tous');
}

/**
 * Nettoie le tableau personas si "tous" est présent avec d'autres valeurs :
 * on ne garde que ['tous'] (sémantique : transverse).
 */
export function autoCleanPersonas(personas: readonly Persona[]): Persona[] {
  if (personasNeedAutoCleaning(personas)) return ['tous'];
  return [...personas];
}

// ---------------------------------------------------------------------------
// Formatage des erreurs de frontmatter
// ---------------------------------------------------------------------------

/**
 * Formate les erreurs Zod en messages lisibles.
 * Délègue à humanizeZodIssue (partagé avec author.schema).
 */
export function formatResourceErrors(filePath: string, error: z.ZodError): string {
  const lines: string[] = [`Invalid resource frontmatter in ${filePath}:`];
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    lines.push(`  - ${path}: ${humanizeZodIssue(issue)}`);
  }
  return lines.join('\n');
}
