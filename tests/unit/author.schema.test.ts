import { describe, it, expect } from 'vitest';
import {
  AuthorFrontmatterSchema,
  formatAuthorErrors,
} from '@/lib/content/author.schema';

const VALID = {
  slug: 'marie-dupont',
  name: 'Marie Dupont',
  role: 'Consultante pédagogique en transformation numérique',
  bio: "Quinze ans d'expérience dans l'éducation supérieure, dont huit à la direction d'un institut BTS de six cents étudiants en région parisienne.",
  expertise: ['Conduite du changement', 'BTS'],
};

describe('AuthorFrontmatterSchema', () => {
  it('accepte un frontmatter auteur valide', () => {
    const result = AuthorFrontmatterSchema.safeParse(VALID);
    expect(result.success).toBe(true);
  });

  it('accepte les champs optionnels (photo, linkedinUrl, email)', () => {
    const result = AuthorFrontmatterSchema.safeParse({
      ...VALID,
      photo: '/images/auteurs/marie.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/marie-dupont/',
      email: 'marie@example.fr',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un slug non kebab-case', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, slug: 'Marie_Dupont' });
    expect(result.success).toBe(false);
  });

  it('rejette une bio trop courte (< 100 caractères)', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, bio: 'Trop court.' });
    expect(result.success).toBe(false);
  });

  it('rejette une expertise vide', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, expertise: [] });
    expect(result.success).toBe(false);
  });

  it('rejette une photo qui ne commence pas par /', () => {
    const result = AuthorFrontmatterSchema.safeParse({
      ...VALID,
      photo: 'images/marie.jpg',
    });
    expect(result.success).toBe(false);
  });

  it('rejette une linkedinUrl invalide', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, linkedinUrl: 'pas-une-url' });
    expect(result.success).toBe(false);
  });

  it('rejette un email invalide', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, email: 'pas-un-email' });
    expect(result.success).toBe(false);
  });
});

describe('formatAuthorErrors()', () => {
  it('produit un message identifiant le fichier et le champ', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, bio: 'court' });
    expect(result.success).toBe(false);
    if (result.success) return;
    const msg = formatAuthorErrors('content/auteurs/marie-dupont.mdx', result.error);
    expect(msg).toContain('content/auteurs/marie-dupont.mdx');
    expect(msg).toContain('bio');
  });

  it('ne contient pas de payload Zod brut (pas de JSON technique)', () => {
    const result = AuthorFrontmatterSchema.safeParse({ ...VALID, name: 'X' });
    expect(result.success).toBe(false);
    if (result.success) return;
    const msg = formatAuthorErrors('f.mdx', result.error);
    expect(msg).not.toContain('"code"');
    expect(msg).not.toContain('ZodError');
  });

  it('liste plusieurs erreurs sur des champs distincts', () => {
    const result = AuthorFrontmatterSchema.safeParse({
      slug: 'BAD',
      name: 'X',
      role: 'X',
      bio: 'court',
      expertise: [],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const msg = formatAuthorErrors('f.mdx', result.error);
    const lines = msg.split('\n').filter((l) => l.trim().startsWith('-'));
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });
});
