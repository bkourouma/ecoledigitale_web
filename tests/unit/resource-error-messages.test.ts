import { describe, it, expect } from 'vitest';
import {
  ResourceFrontmatterSchema,
  formatResourceErrors,
} from '@/lib/content/resource.schema';
import { AuthorFrontmatterSchema, formatAuthorErrors } from '@/lib/content/author.schema';

/**
 * Vérifie que les messages d'erreur de frontmatter sont LISIBLES :
 * - identifient le fichier et le champ,
 * - traduisent chaque catégorie d'erreur Zod en français,
 * - ne laissent fuir aucun payload technique brut.
 */

const VALID_GUIDE = {
  slug: 'mon-guide',
  title: 'Un titre de ressource suffisamment long',
  description:
    'Une description suffisamment longue pour passer la validation Zod qui impose au minimum quatre-vingts caractères.',
  type: 'guides',
  publishedAt: '2026-01-15',
  author: 'marie-dupont',
  personas: ['tous'],
  category: 'Test',
};

const VALID_AUTHOR = {
  slug: 'marie-dupont',
  name: 'Marie Dupont',
  role: 'Consultante pédagogique',
  bio: "Quinze ans d'expérience dans l'éducation supérieure, dont huit à la direction d'un institut BTS de six cents étudiants en région parisienne.",
  expertise: ['Conduite du changement'],
};

function resourceErrorFor(data: unknown): string {
  const result = ResourceFrontmatterSchema.safeParse(data);
  if (result.success) throw new Error('attendu : échec de validation');
  return formatResourceErrors('content/ressources/guides/exemple.mdx', result.error);
}

function authorErrorFor(data: unknown): string {
  const result = AuthorFrontmatterSchema.safeParse(data);
  if (result.success) throw new Error('attendu : échec de validation');
  return formatAuthorErrors('content/auteurs/exemple.mdx', result.error);
}

describe('formatResourceErrors — lisibilité', () => {
  it('identifie toujours le fichier', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, title: 'Court' });
    expect(msg).toContain('content/ressources/guides/exemple.mdx');
  });

  it('ne laisse fuir aucun payload Zod brut', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, title: 'Court', personas: [] });
    expect(msg).not.toContain('"code"');
    expect(msg).not.toContain('ZodError');
    expect(msg).not.toContain('[object Object]');
  });

  it('traduit too_small (chaîne trop courte)', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, title: 'Court' });
    expect(msg).toMatch(/title/);
    expect(msg).toMatch(/trop courte/);
  });

  it('traduit too_big (chaîne trop longue)', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, category: 'x'.repeat(60) });
    expect(msg).toMatch(/category/);
    expect(msg).toMatch(/trop longue/);
  });

  it('traduit invalid_type (champ manquant)', () => {
    const { description: _omit, ...withoutDescription } = VALID_GUIDE;
    void _omit;
    const msg = resourceErrorFor(withoutDescription);
    expect(msg).toMatch(/description/);
  });

  it('traduit invalid_enum_value (persona hors enum)', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, personas: ['directeur-rh'] });
    expect(msg).toMatch(/non autorisée|valeurs possibles/);
  });

  it('traduit invalid_union_discriminator (type inconnu)', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, type: 'tutoriel' });
    expect(msg).toMatch(/type/);
    expect(msg).toMatch(/valeurs possibles/);
  });

  it('traduit une violation de regex (slug mal formé)', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, slug: 'Mon_Guide' });
    expect(msg).toMatch(/slug/);
    expect(msg).toMatch(/kebab-case/);
  });

  it('liste plusieurs erreurs sur des champs distincts', () => {
    const msg = resourceErrorFor({ ...VALID_GUIDE, title: 'X', category: 'y' });
    const bulletLines = msg.split('\n').filter((l) => l.trim().startsWith('-'));
    expect(bulletLines.length).toBeGreaterThanOrEqual(2);
  });
});

describe('formatAuthorErrors — lisibilité', () => {
  it('identifie le fichier et le champ', () => {
    const msg = authorErrorFor({ ...VALID_AUTHOR, bio: 'court' });
    expect(msg).toContain('content/auteurs/exemple.mdx');
    expect(msg).toMatch(/bio/);
  });

  it('traduit une URL invalide', () => {
    const msg = authorErrorFor({ ...VALID_AUTHOR, linkedinUrl: 'pas-une-url' });
    expect(msg).toMatch(/URL invalide/);
  });

  it('traduit un email invalide', () => {
    const msg = authorErrorFor({ ...VALID_AUTHOR, email: 'pas-un-email' });
    expect(msg).toMatch(/email invalide/);
  });

  it('ne laisse fuir aucun payload Zod brut', () => {
    const msg = authorErrorFor({ ...VALID_AUTHOR, expertise: [] });
    expect(msg).not.toContain('"code"');
    expect(msg).not.toContain('ZodError');
  });
});
