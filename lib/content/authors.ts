import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  AuthorFrontmatterSchema,
  formatAuthorErrors,
  type AuthorFrontmatter,
} from './author.schema';

export interface AuthorBundle {
  frontmatter: AuthorFrontmatter;
  /** Corps MDX (bio longue) — peut être vide. */
  body: string;
}

const DEFAULT_AUTHORS_DIR = join(process.cwd(), 'content', 'auteurs');

let cachedAuthors: AuthorBundle[] | null = null;
let cachedFromDir: string | null = null;

export interface LoadAuthorsOptions {
  /** Override du dossier source — utilisé exclusivement par les tests. */
  dir?: string;
}

/**
 * Charge tous les auteurs depuis disque (premier appel) ou retourne le cache.
 *
 * - Skip les fichiers commençant par `_` (templates, brouillons privés).
 * - Valide chaque frontmatter via Zod, message lisible si échec (formatAuthorErrors).
 * - Enforce `slug === filename` pour éviter les incohérences silencieuses.
 * - Cache process-level lorsque appelée sur le dossier par défaut.
 */
export function loadAuthors(opts?: LoadAuthorsOptions): AuthorBundle[] {
  const dir = opts?.dir ?? DEFAULT_AUTHORS_DIR;
  if (cachedAuthors && cachedFromDir === dir) return cachedAuthors;

  // Dossier inexistant ou vide → catalogue vide (cas légitime en pré-MVP).
  if (!existsSync(dir)) {
    cachedAuthors = [];
    cachedFromDir = dir;
    return cachedAuthors;
  }

  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));
  const bundles: AuthorBundle[] = [];

  for (const file of files) {
    const slugFromFile = file.replace(/\.mdx$/, '');
    const filePath = join(dir, file);
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);

    const result = AuthorFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      throw new Error(formatAuthorErrors(filePath, result.error));
    }

    // Enforce slug === filename : garantit aussi l'unicité des slugs, puisque
    // les noms de fichiers sont uniques par nature dans un répertoire.
    if (result.data.slug !== slugFromFile) {
      throw new Error(
        `Author slug mismatch in ${filePath}: frontmatter has "${result.data.slug}", expected "${slugFromFile}".`,
      );
    }

    bundles.push({ frontmatter: result.data, body: parsed.content.trim() });
  }

  // Cache uniquement quand on charge le dossier par défaut (production).
  if (dir === DEFAULT_AUTHORS_DIR) {
    cachedAuthors = bundles;
    cachedFromDir = dir;
  }

  return bundles;
}

export function getAuthor(slug: string, opts?: LoadAuthorsOptions): AuthorBundle | undefined {
  return loadAuthors(opts).find((a) => a.frontmatter.slug === slug);
}

export function getAllAuthorSlugs(opts?: LoadAuthorsOptions): string[] {
  return loadAuthors(opts).map((a) => a.frontmatter.slug);
}

/** Utilitaire de tests : vider le cache. */
export function _resetAuthorsCacheForTests(): void {
  cachedAuthors = null;
  cachedFromDir = null;
}
