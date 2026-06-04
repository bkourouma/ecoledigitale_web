import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  ResourceFrontmatterSchema,
  RESOURCE_TYPES,
  formatResourceErrors,
  autoCleanPersonas,
  personasNeedAutoCleaning,
  isValidModuleSlug,
  type ResourceFrontmatter,
  type ResourceType,
} from './resource.schema';
import { getReadingTime, type ReadingTimeResult } from './reading-time';
import { loadAuthors, type AuthorBundle, type LoadAuthorsOptions } from './authors';

export interface ResourceBundle {
  frontmatter: ResourceFrontmatter;
  body: string;
  readingTime: ReadingTimeResult;
}

export interface ResourceFilter {
  persona?: string;
  type?: ResourceType;
}

export interface LoadResourcesOptions {
  /** Override du dossier content/ressources — tests uniquement. */
  dir?: string;
  /** Override du dossier content/auteurs pour la validation croisée — tests uniquement. */
  authorsDir?: string;
}

const DEFAULT_RESOURCES_DIR = join(process.cwd(), 'content', 'ressources');
const GLOSSARY_MAX_WORDS = 500;

let cachedResources: ResourceBundle[] | null = null;
let cachedFromDir: string | null = null;

/** En production Vercel, les drafts et ressources futures sont masqués. */
function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

/** Date du jour en `YYYY-MM-DD` (comparaison lexicographique sûre avec les dates ISO). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Une ressource est-elle réellement publiée et visible publiquement ? */
function isLiveResource(b: ResourceBundle): boolean {
  return b.frontmatter.status === 'published' && b.frontmatter.publishedAt <= today();
}

// ---------------------------------------------------------------------------
// Chargement disque
// ---------------------------------------------------------------------------

/**
 * Charge tout le catalogue de ressources depuis disque (premier appel) ou cache.
 *
 * - Parcourt content/ressources/{guides,etudes-de-cas,glossaire}/*.mdx.
 * - Skip les fichiers commençant par `_` (templates, brouillons privés).
 * - Valide chaque frontmatter (union discriminée Zod), message lisible si échec.
 * - Enforce `slug === filename` et `type === nom du sous-dossier`.
 * - Calcule le temps de lecture par ressource.
 * - Lance validateResourceCatalog() (cross-références).
 */
export function loadResources(opts?: LoadResourcesOptions): ResourceBundle[] {
  const dir = opts?.dir ?? DEFAULT_RESOURCES_DIR;
  if (cachedResources && cachedFromDir === dir) return cachedResources;

  const bundles: ResourceBundle[] = [];

  for (const type of RESOURCE_TYPES) {
    const typeDir = join(dir, type);
    if (!existsSync(typeDir)) continue;

    const files = readdirSync(typeDir).filter(
      (f) => f.endsWith('.mdx') && !f.startsWith('_'),
    );

    for (const file of files) {
      const slugFromFile = file.replace(/\.mdx$/, '');
      const filePath = join(typeDir, file);
      const raw = readFileSync(filePath, 'utf-8');
      const parsed = matter(raw);

      const result = ResourceFrontmatterSchema.safeParse(parsed.data);
      if (!result.success) {
        throw new Error(formatResourceErrors(filePath, result.error));
      }

      const fm = result.data;

      if (fm.slug !== slugFromFile) {
        throw new Error(
          `Resource slug mismatch in ${filePath}: frontmatter has "${fm.slug}", expected "${slugFromFile}".`,
        );
      }
      if (fm.type !== type) {
        throw new Error(
          `Resource type mismatch in ${filePath}: frontmatter type "${fm.type}" but file is in "${type}/".`,
        );
      }

      // Auto-clean de l'invariant "tous" exclusif (warning + correction).
      if (personasNeedAutoCleaning(fm.personas)) {
        console.warn(
          `Resource "${fm.slug}": "tous" ne peut pas être combiné à d'autres personas ; conservé "tous" seul.`,
        );
        fm.personas = autoCleanPersonas(fm.personas);
      }

      bundles.push({
        frontmatter: fm,
        body: parsed.content.trim(),
        readingTime: getReadingTime(parsed.content),
      });
    }
  }

  const authors = loadAuthors(
    opts?.authorsDir ? ({ dir: opts.authorsDir } satisfies LoadAuthorsOptions) : undefined,
  );
  validateResourceCatalog(bundles, authors);

  // Tri stable par date de publication décroissante.
  bundles.sort((a, b) => b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt));

  if (dir === DEFAULT_RESOURCES_DIR) {
    cachedResources = bundles;
    cachedFromDir = dir;
  }

  return bundles;
}

// ---------------------------------------------------------------------------
// Validation cross-références (cf. data-model.md §7)
// ---------------------------------------------------------------------------

/**
 * Valide les invariants cross-documents du catalogue.
 * Lève une Error (fail-fast au build) pour les violations dures,
 * émet un console.warn pour les violations souples.
 */
export function validateResourceCatalog(
  resources: readonly ResourceBundle[],
  authors: readonly AuthorBundle[],
): void {
  const authorSlugs = new Set(authors.map((a) => a.frontmatter.slug));
  // Index des slugs existants par type, pour valider relatedRessources.
  const slugsByType = new Map<ResourceType, Set<string>>();
  for (const type of RESOURCE_TYPES) slugsByType.set(type, new Set());

  // Détection des doublons de slug PAR type (collision inter-types autorisée).
  const seenByType = new Map<ResourceType, Set<string>>();
  for (const type of RESOURCE_TYPES) seenByType.set(type, new Set());

  for (const { frontmatter: fm } of resources) {
    const seen = seenByType.get(fm.type)!;
    if (seen.has(fm.slug)) {
      throw new Error(
        `Resource catalog: duplicate slug "${fm.slug}" in type "${fm.type}".`,
      );
    }
    seen.add(fm.slug);
    slugsByType.get(fm.type)!.add(fm.slug);
  }

  for (const { frontmatter: fm } of resources) {
    // Règle : auteur référencé doit exister.
    if (!authorSlugs.has(fm.author)) {
      throw new Error(
        `Resource "${fm.slug}" references unknown author "${fm.author}". ` +
          `Créer content/auteurs/${fm.author}.mdx.`,
      );
    }

    // Règle : updatedAt >= publishedAt.
    if (fm.updatedAt && fm.updatedAt < fm.publishedAt) {
      throw new Error(
        `Resource "${fm.slug}": updatedAt (${fm.updatedAt}) est antérieur à publishedAt (${fm.publishedAt}).`,
      );
    }

    // Règle : relatedRessources pointent vers des ressources existantes.
    for (const rel of fm.relatedRessources ?? []) {
      const pool = slugsByType.get(rel.type);
      if (!pool || !pool.has(rel.slug)) {
        throw new Error(
          `Resource "${fm.slug}" has invalid related reference "${rel.type}/${rel.slug}" (introuvable).`,
        );
      }
    }

    // Règle : étude de cas — modulesActivated doivent exister dans MODULE_SLUGS.
    if (fm.type === 'etudes-de-cas') {
      for (const moduleSlug of fm.caseStudy.modulesActivated) {
        if (!isValidModuleSlug(moduleSlug)) {
          throw new Error(
            `Case study "${fm.slug}": module activé inconnu "${moduleSlug}".`,
          );
        }
      }
    }
  }

  // Règle souple : glossaire body trop long.
  for (const b of resources) {
    if (b.frontmatter.type === 'glossaire' && b.readingTime.words > GLOSSARY_MAX_WORDS) {
      console.warn(
        `Glossary entry "${b.frontmatter.slug}" body dépasse ${GLOSSARY_MAX_WORDS} mots (${b.readingTime.words}).`,
      );
    }
  }

  // Règle souple : related vers une ressource draft/deprecated (omise au rendu).
  const liveSlugsByType = new Map<ResourceType, Set<string>>();
  for (const type of RESOURCE_TYPES) liveSlugsByType.set(type, new Set());
  for (const b of resources) {
    if (isLiveResource(b) && !b.frontmatter.deprecated) {
      liveSlugsByType.get(b.frontmatter.type)!.add(b.frontmatter.slug);
    }
  }
  for (const { frontmatter: fm } of resources) {
    for (const rel of fm.relatedRessources ?? []) {
      if (!liveSlugsByType.get(rel.type)!.has(rel.slug)) {
        console.warn(
          `Resource "${fm.slug}" référence "${rel.type}/${rel.slug}" qui est draft ou deprecated — sera masquée du rendu.`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Accesseurs
// ---------------------------------------------------------------------------

/** Toutes les ressources publiées, non deprecated, triées par date desc. */
export function getAllResources(opts?: LoadResourcesOptions): ResourceBundle[] {
  return loadResources(opts).filter((b) => isLiveResource(b) && !b.frontmatter.deprecated);
}

/**
 * Une ressource par type + slug. Retourne undefined si introuvable.
 * En production, masque draft et ressources futures (→ notFound() côté route).
 * Les ressources deprecated restent accessibles (bandeau affiché côté page).
 */
export function getResourceBySlug(
  type: ResourceType,
  slug: string,
  opts?: LoadResourcesOptions,
): ResourceBundle | undefined {
  const bundle = loadResources(opts).find(
    (b) => b.frontmatter.type === type && b.frontmatter.slug === slug,
  );
  if (!bundle) return undefined;
  if (isProductionEnv() && !isLiveResource(bundle)) return undefined;
  return bundle;
}

/** Ressources publiées signées par un auteur, triées par date desc. */
export function getResourcesByAuthor(
  authorSlug: string,
  opts?: LoadResourcesOptions,
): ResourceBundle[] {
  return getAllResources(opts).filter((b) => b.frontmatter.author === authorSlug);
}

/**
 * Filtre combiné par persona et/ou type. Une persona invalide est ignorée.
 * Opère sur les ressources publiées non deprecated (vue hub).
 */
export function filterResources(
  filter: ResourceFilter,
  opts?: LoadResourcesOptions,
): ResourceBundle[] {
  let list = getAllResources(opts);

  if (filter.type) {
    list = list.filter((b) => b.frontmatter.type === filter.type);
  }
  if (filter.persona) {
    const persona = filter.persona;
    list = list.filter(
      (b) =>
        b.frontmatter.personas.includes('tous') ||
        (b.frontmatter.personas as readonly string[]).includes(persona),
    );
  }
  return list;
}

/**
 * Params pour generateStaticParams de la route [type]/[slug].
 * En production : seulement les ressources réellement publiées.
 * En preview/dev : tout (permet de prévisualiser les drafts).
 */
export function getStaticResourceParams(
  opts?: LoadResourcesOptions,
): Array<{ type: ResourceType; slug: string }> {
  const all = loadResources(opts);
  const visible = isProductionEnv() ? all.filter(isLiveResource) : all;
  return visible.map((b) => ({ type: b.frontmatter.type, slug: b.frontmatter.slug }));
}

/** Utilitaire de tests : vider le cache. */
export function _resetResourcesCacheForTests(): void {
  cachedResources = null;
  cachedFromDir = null;
}
