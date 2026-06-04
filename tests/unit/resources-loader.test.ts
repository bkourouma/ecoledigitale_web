import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  loadResources,
  getAllResources,
  getResourceBySlug,
  getResourcesByAuthor,
  filterResources,
  getStaticResourceParams,
  validateResourceCatalog,
  _resetResourcesCacheForTests,
  type ResourceBundle,
} from '@/lib/content/resources';
import { _resetAuthorsCacheForTests, type AuthorBundle } from '@/lib/content/authors';
import { ResourceFrontmatterSchema } from '@/lib/content/resource.schema';
import { AuthorFrontmatterSchema } from '@/lib/content/author.schema';
import { getReadingTime } from '@/lib/content/reading-time';

const DESC =
  'Une ressource de test dont la description dépasse quatre-vingts caractères pour valider correctement le schéma Zod.';

const AUTHOR_MARIE = {
  slug: 'marie-dupont',
  name: 'Marie Dupont',
  role: 'Consultante pédagogique',
  bio: "Quinze ans d'expérience dans l'éducation supérieure, dont huit à la direction d'un institut BTS de six cents étudiants en région parisienne.",
  expertise: ['Conduite du changement'],
};

function guide(slug: string, over: Record<string, unknown> = {}) {
  return {
    slug,
    title: `Guide de test ${slug} pour le hub`,
    description: DESC,
    type: 'guides',
    status: 'published',
    publishedAt: '2026-01-10',
    author: 'marie-dupont',
    personas: ['tous'],
    category: 'Test',
    ...over,
  };
}

function caseStudy(slug: string, over: Record<string, unknown> = {}) {
  return {
    slug,
    title: `Étude de cas ${slug} pour le hub`,
    description: DESC,
    type: 'etudes-de-cas',
    status: 'published',
    publishedAt: '2026-01-10',
    author: 'marie-dupont',
    personas: ['lycee-bts'],
    category: 'Test',
    caseStudy: {
      establishment: 'Institut Test',
      establishmentType: 'Lycée BTS, 800 étudiants',
      modulesActivated: ['socle-ecoledigitale'],
      testimonialAuthor: 'Jean Martin',
      testimonialRole: 'Directeur',
    },
    ...over,
  };
}

function glossary(slug: string, over: Record<string, unknown> = {}) {
  return {
    slug,
    title: `Définition de ${slug} dans le glossaire`,
    description: DESC,
    type: 'glossaire',
    status: 'published',
    publishedAt: '2026-01-10',
    author: 'marie-dupont',
    personas: ['tous'],
    category: 'Test',
    term: slug.toUpperCase(),
    shortDefinition: 'Une définition courte qui dépasse trente caractères pour le schéma.',
    ...over,
  };
}

let tmpDirs: string[] = [];

/** Crée un dossier auteurs temporaire contenant Marie Dupont par défaut. */
function scaffoldAuthors(extra: Record<string, Record<string, unknown>> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), 'res-authors-'));
  tmpDirs.push(dir);
  const files = { 'marie-dupont.mdx': AUTHOR_MARIE, ...extra };
  for (const [name, data] of Object.entries(files)) {
    writeFileSync(join(dir, name), matter.stringify('Bio.', data), 'utf-8');
  }
  return dir;
}

/**
 * Crée un dossier ressources temporaire. `files` est indexé par chemin relatif
 * (ex. 'guides/foo.mdx'). `bodies` permet d'overrider le corps MDX par fichier.
 */
function scaffoldResources(
  files: Record<string, Record<string, unknown>>,
  bodies: Record<string, string> = {},
): string {
  const dir = mkdtempSync(join(tmpdir(), 'res-test-'));
  tmpDirs.push(dir);
  for (const type of ['guides', 'etudes-de-cas', 'glossaire']) {
    mkdirSync(join(dir, type), { recursive: true });
  }
  for (const [rel, data] of Object.entries(files)) {
    const body = bodies[rel] ?? 'Corps de la ressource de test.';
    writeFileSync(join(dir, rel), matter.stringify(body, data), 'utf-8');
  }
  return dir;
}

beforeEach(() => {
  _resetResourcesCacheForTests();
  _resetAuthorsCacheForTests();
});
afterEach(() => {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
  tmpDirs = [];
  delete process.env.VERCEL_ENV;
});

describe('loadResources() — chargement', () => {
  it('charge un guide valide', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'guides/guide-un.mdx': guide('guide-un') });
    const resources = loadResources({ dir, authorsDir });
    expect(resources).toHaveLength(1);
    expect(resources[0]!.frontmatter.type).toBe('guides');
    expect(resources[0]!.readingTime.minutes).toBeGreaterThanOrEqual(1);
  });

  it('charge les trois types de ressources', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un'),
      'etudes-de-cas/cas-un.mdx': caseStudy('cas-un'),
      'glossaire/lms.mdx': glossary('lms'),
    });
    expect(loadResources({ dir, authorsDir })).toHaveLength(3);
  });

  it('trie par publishedAt décroissant', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/ancien.mdx': guide('ancien', { publishedAt: '2026-01-05' }),
      'guides/recent.mdx': guide('recent', { publishedAt: '2026-03-20' }),
    });
    const slugs = loadResources({ dir, authorsDir }).map((r) => r.frontmatter.slug);
    expect(slugs).toEqual(['recent', 'ancien']);
  });

  it('ignore les fichiers préfixés par _', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un'),
      'guides/_TEMPLATE.mdx': guide('template-x'),
    });
    expect(loadResources({ dir, authorsDir })).toHaveLength(1);
  });

  it('retourne un tableau vide pour un catalogue vide', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({});
    expect(loadResources({ dir, authorsDir })).toEqual([]);
  });
});

describe('loadResources() — validations structurelles', () => {
  it('échoue si le slug ne correspond pas au nom de fichier', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'guides/autre.mdx': guide('guide-un') });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/slug mismatch/i);
  });

  it('échoue si le type ne correspond pas au sous-dossier', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'glossaire/guide-un.mdx': guide('guide-un') });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/type mismatch/i);
  });

  it('échoue sur un frontmatter invalide avec un message lisible', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un', { title: 'Court' }),
    });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/Invalid resource frontmatter/);
  });

  it('validateResourceCatalog rejette un slug dupliqué dans le même type', () => {
    // Inatteignable via le chargement disque (slug === filename + noms de fichiers
    // uniques) — on teste donc la garde défensive de validateResourceCatalog en direct.
    const marie: AuthorBundle = {
      frontmatter: AuthorFrontmatterSchema.parse(AUTHOR_MARIE),
      body: '',
    };
    const resBundle = (fm: Record<string, unknown>): ResourceBundle => ({
      frontmatter: ResourceFrontmatterSchema.parse(fm),
      body: 'Corps.',
      readingTime: getReadingTime('Corps.'),
    });
    const duplicates = [resBundle(guide('meme-slug')), resBundle(guide('meme-slug'))];
    expect(() => validateResourceCatalog(duplicates, [marie])).toThrow(/duplicate slug/i);
  });

  it('autorise un même slug entre deux types différents', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/lms.mdx': guide('lms'),
      'glossaire/lms.mdx': glossary('lms'),
    });
    expect(loadResources({ dir, authorsDir })).toHaveLength(2);
  });
});

describe('validateResourceCatalog — cross-références', () => {
  it('échoue si l’auteur référencé n’existe pas', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un', { author: 'auteur-inconnu' }),
    });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/unknown author/i);
  });

  it('échoue si relatedRessources pointe vers une ressource inexistante', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un', {
        relatedRessources: [{ type: 'glossaire', slug: 'inexistant' }],
      }),
    });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/invalid related/i);
  });

  it('échoue si une étude de cas active un module inconnu', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'etudes-de-cas/cas-un.mdx': caseStudy('cas-un', {
        caseStudy: {
          establishment: 'Institut Test',
          establishmentType: 'Lycée BTS',
          modulesActivated: ['module-fantome'],
          testimonialAuthor: 'Jean Martin',
          testimonialRole: 'Directeur',
        },
      }),
    });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/module activé inconnu/i);
  });

  it('échoue si updatedAt est antérieur à publishedAt', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un', {
        publishedAt: '2026-03-10',
        updatedAt: '2026-01-01',
      }),
    });
    expect(() => loadResources({ dir, authorsDir })).toThrow(/updatedAt/i);
  });

  it('émet un warning si un glossaire dépasse 500 mots (sans échouer)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const authorsDir = scaffoldAuthors();
    const longBody = Array.from({ length: 600 }, () => 'mot').join(' ');
    const dir = scaffoldResources(
      { 'glossaire/lms.mdx': glossary('lms') },
      { 'glossaire/lms.mdx': longBody },
    );
    expect(() => loadResources({ dir, authorsDir })).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('dépasse 500 mots'));
    warnSpy.mockRestore();
  });
});

describe('Auto-clean des personas', () => {
  it('réduit ["tous", "lycee-bts"] à ["tous"] avec un warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-un.mdx': guide('guide-un', { personas: ['tous', 'lycee-bts'] }),
    });
    const resources = loadResources({ dir, authorsDir });
    expect(resources[0]!.frontmatter.personas).toEqual(['tous']);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('getAllResources()', () => {
  it('exclut les brouillons', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/publie.mdx': guide('publie'),
      'guides/brouillon.mdx': guide('brouillon', { status: 'draft' }),
    });
    expect(loadResources({ dir, authorsDir })).toHaveLength(2);
    expect(getAllResources({ dir, authorsDir })).toHaveLength(1);
    expect(getAllResources({ dir, authorsDir })[0]!.frontmatter.slug).toBe('publie');
  });

  it('exclut les ressources avec publishedAt dans le futur', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/futur.mdx': guide('futur', { publishedAt: '2099-01-01' }),
    });
    expect(getAllResources({ dir, authorsDir })).toHaveLength(0);
  });

  it('exclut les ressources deprecated du listing', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/obsolete.mdx': guide('obsolete', { deprecated: true }),
    });
    expect(getAllResources({ dir, authorsDir })).toHaveLength(0);
  });
});

describe('getResourceBySlug()', () => {
  it('retourne la ressource demandée', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'guides/guide-un.mdx': guide('guide-un') });
    const bundle = getResourceBySlug('guides', 'guide-un', { dir, authorsDir });
    expect(bundle?.frontmatter.slug).toBe('guide-un');
  });

  it('retourne undefined pour un slug inconnu', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'guides/guide-un.mdx': guide('guide-un') });
    expect(getResourceBySlug('guides', 'inconnu', { dir, authorsDir })).toBeUndefined();
  });

  it('retourne une ressource deprecated (accessible en direct, banner côté page)', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/obsolete.mdx': guide('obsolete', { deprecated: true }),
    });
    expect(getResourceBySlug('guides', 'obsolete', { dir, authorsDir })).toBeDefined();
  });

  it('masque un brouillon en environnement production', () => {
    process.env.VERCEL_ENV = 'production';
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/brouillon.mdx': guide('brouillon', { status: 'draft' }),
    });
    expect(getResourceBySlug('guides', 'brouillon', { dir, authorsDir })).toBeUndefined();
  });
});

describe('getResourcesByAuthor()', () => {
  it('retourne les ressources publiées d’un auteur', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-a.mdx': guide('guide-a'),
      'guides/guide-b.mdx': guide('guide-b'),
    });
    expect(getResourcesByAuthor('marie-dupont', { dir, authorsDir })).toHaveLength(2);
    expect(getResourcesByAuthor('inconnu', { dir, authorsDir })).toHaveLength(0);
  });
});

describe('filterResources()', () => {
  it('filtre par type', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/guide-a.mdx': guide('guide-a'),
      'glossaire/lms.mdx': glossary('lms'),
    });
    const onlyGlossary = filterResources({ type: 'glossaire' }, { dir, authorsDir });
    expect(onlyGlossary).toHaveLength(1);
    expect(onlyGlossary[0]!.frontmatter.type).toBe('glossaire');
  });

  it('filtre par persona (inclut les ressources "tous")', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/transverse.mdx': guide('transverse', { personas: ['tous'] }),
      'guides/cible-bts.mdx': guide('cible-bts', { personas: ['lycee-bts'] }),
      'guides/cible-pro.mdx': guide('cible-pro', { personas: ['formation-pro'] }),
    });
    const forBts = filterResources({ persona: 'lycee-bts' }, { dir, authorsDir });
    const slugs = forBts.map((r) => r.frontmatter.slug).sort();
    expect(slugs).toEqual(['cible-bts', 'transverse']);
  });

  it('ignore une persona invalide', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({ 'guides/guide-a.mdx': guide('guide-a') });
    expect(filterResources({ persona: 'persona-bidon' }, { dir, authorsDir })).toHaveLength(1);
  });
});

describe('getStaticResourceParams()', () => {
  it('retourne tous les params en environnement non-production (drafts inclus)', () => {
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/publie.mdx': guide('publie'),
      'guides/brouillon.mdx': guide('brouillon', { status: 'draft' }),
    });
    expect(getStaticResourceParams({ dir, authorsDir })).toHaveLength(2);
  });

  it('exclut les drafts en environnement production', () => {
    process.env.VERCEL_ENV = 'production';
    const authorsDir = scaffoldAuthors();
    const dir = scaffoldResources({
      'guides/publie.mdx': guide('publie'),
      'guides/brouillon.mdx': guide('brouillon', { status: 'draft' }),
    });
    const params = getStaticResourceParams({ dir, authorsDir });
    expect(params).toHaveLength(1);
    expect(params[0]!.slug).toBe('publie');
  });
});
