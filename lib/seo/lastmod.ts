import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/**
 * Dates de dernière modification des pages statiques (`lastmod` du sitemap).
 *
 * Ces dates sont écrites à la main : à chaque modification réelle du contenu d'une page, mettre à
 * jour sa date ici (format AAAA-MM-JJ). Ne jamais mettre la date du build : un `lastmod` identique
 * partout n'apporte aucun signal à Google.
 * - Packs (`/modules/<slug>`) : champ `updatedAt` de leur fichier MDX.
 * - Ressources : `updatedAt` (ou `publishedAt`) de leur frontmatter.
 * - Confidentialité : `updatedAt` de `content/confidentialite.mdx`.
 */
export const STATIC_PAGE_LASTMOD = {
  home: '2026-10-16',
  modules: '2026-10-16',
  aPropos: '2026-10-16',
  demanderDemo: '2026-10-16',
} as const;

/** Lit `updatedAt` dans le frontmatter d'un fichier MDX du dossier `content/`. */
export function readContentUpdatedAt(file: string): string {
  const raw = readFileSync(join(process.cwd(), 'content', file), 'utf-8');
  const value = matter(raw).data.updatedAt;
  // gray-matter convertit une date YAML non quotée en objet Date.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}
