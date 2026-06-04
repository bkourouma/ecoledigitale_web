import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  loadAuthors,
  getAuthor,
  getAllAuthorSlugs,
  _resetAuthorsCacheForTests,
} from '@/lib/content/authors';

const VALID_AUTHOR = {
  slug: 'marie-dupont',
  name: 'Marie Dupont',
  role: 'Consultante pédagogique',
  bio: "Quinze ans d'expérience dans l'éducation supérieure, dont huit à la direction d'un institut BTS de six cents étudiants en région parisienne.",
  expertise: ['Conduite du changement', 'BTS'],
};

let tmpDirs: string[] = [];

/** Crée un dossier auteurs temporaire. Les valeurs objet sont sérialisées en MDX. */
function scaffold(files: Record<string, Record<string, unknown> | string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'authors-test-'));
  tmpDirs.push(dir);
  for (const [name, data] of Object.entries(files)) {
    const content = typeof data === 'string' ? data : matter.stringify('Bio longue.', data);
    writeFileSync(join(dir, name), content, 'utf-8');
  }
  return dir;
}

beforeEach(() => _resetAuthorsCacheForTests());
afterEach(() => {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
  tmpDirs = [];
});

describe('loadAuthors()', () => {
  it('charge un auteur valide', () => {
    const dir = scaffold({ 'marie-dupont.mdx': VALID_AUTHOR });
    const authors = loadAuthors({ dir });
    expect(authors).toHaveLength(1);
    expect(authors[0]!.frontmatter.name).toBe('Marie Dupont');
  });

  it('retourne un tableau vide pour un dossier inexistant', () => {
    const authors = loadAuthors({ dir: join(tmpdir(), 'dossier-qui-nexiste-pas-xyz') });
    expect(authors).toEqual([]);
  });

  it('ignore les fichiers préfixés par _ (templates)', () => {
    const dir = scaffold({
      'marie-dupont.mdx': VALID_AUTHOR,
      '_TEMPLATE.mdx': VALID_AUTHOR,
    });
    expect(loadAuthors({ dir })).toHaveLength(1);
  });

  it('échoue (fail-fast) sur un frontmatter invalide', () => {
    const dir = scaffold({
      'marie-dupont.mdx': { ...VALID_AUTHOR, bio: 'trop court' },
    });
    expect(() => loadAuthors({ dir })).toThrow(/Invalid author frontmatter/);
  });

  it('échoue si le slug du frontmatter ne correspond pas au nom de fichier', () => {
    const dir = scaffold({ 'autre-nom.mdx': VALID_AUTHOR });
    expect(() => loadAuthors({ dir })).toThrow(/slug mismatch/i);
  });

  it('charge plusieurs auteurs aux slugs distincts', () => {
    const dir = scaffold({
      'marie-dupont.mdx': VALID_AUTHOR,
      'jean-martin.mdx': { ...VALID_AUTHOR, slug: 'jean-martin', name: 'Jean Martin' },
    });
    expect(loadAuthors({ dir })).toHaveLength(2);
  });

  it('met en cache le dossier par défaut (deux appels = même instance)', () => {
    // content/auteurs/ est vide au pré-MVP → [] mis en cache
    expect(loadAuthors()).toBe(loadAuthors());
  });
});

describe('getAuthor()', () => {
  it('retourne l’auteur demandé', () => {
    const dir = scaffold({ 'marie-dupont.mdx': VALID_AUTHOR });
    expect(getAuthor('marie-dupont', { dir })?.frontmatter.name).toBe('Marie Dupont');
  });

  it('retourne undefined pour un slug inconnu', () => {
    const dir = scaffold({ 'marie-dupont.mdx': VALID_AUTHOR });
    expect(getAuthor('inconnu', { dir })).toBeUndefined();
  });
});

describe('getAllAuthorSlugs()', () => {
  it('retourne tous les slugs', () => {
    const dir = scaffold({
      'marie-dupont.mdx': VALID_AUTHOR,
      'jean-martin.mdx': { ...VALID_AUTHOR, slug: 'jean-martin', name: 'Jean Martin' },
    });
    expect(new Set(getAllAuthorSlugs({ dir }))).toEqual(
      new Set(['marie-dupont', 'jean-martin']),
    );
  });
});
