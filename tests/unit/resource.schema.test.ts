import { describe, it, expect } from 'vitest';
import {
  ResourceFrontmatterSchema,
  formatResourceErrors,
  isValidModuleSlug,
  personasNeedAutoCleaning,
  autoCleanPersonas,
} from '@/lib/content/resource.schema';

const BASE = {
  title: 'Un titre de ressource suffisamment long',
  description:
    'Une description suffisamment longue pour passer la validation Zod qui impose au minimum quatre-vingts caractères.',
  publishedAt: '2026-01-15',
  author: 'marie-dupont',
  personas: ['tous'],
  category: 'Test',
};

const VALID_GUIDE = { ...BASE, slug: 'mon-guide', type: 'guides' };

const VALID_CASE_STUDY = {
  ...BASE,
  slug: 'mon-etude',
  type: 'etudes-de-cas',
  caseStudy: {
    establishment: 'Institut Test',
    establishmentType: 'Lycée BTS, 800 étudiants',
    modulesActivated: ['socle-ecoledigitale'],
    testimonialAuthor: 'Jean Martin',
    testimonialRole: 'Directeur',
  },
};

const VALID_GLOSSARY = {
  ...BASE,
  slug: 'lms',
  type: 'glossaire',
  term: 'LMS',
  shortDefinition:
    'Un Learning Management System est une plateforme de gestion des apprentissages.',
};

describe('ResourceFrontmatterSchema — union discriminée', () => {
  it('résout le sous-type guides', () => {
    const result = ResourceFrontmatterSchema.safeParse(VALID_GUIDE);
    expect(result.success).toBe(true);
  });

  it('résout le sous-type etudes-de-cas avec son objet caseStudy', () => {
    const result = ResourceFrontmatterSchema.safeParse(VALID_CASE_STUDY);
    expect(result.success).toBe(true);
  });

  it('résout le sous-type glossaire avec term et shortDefinition', () => {
    const result = ResourceFrontmatterSchema.safeParse(VALID_GLOSSARY);
    expect(result.success).toBe(true);
  });

  it('rejette un type inconnu', () => {
    const result = ResourceFrontmatterSchema.safeParse({ ...VALID_GUIDE, type: 'tutoriel' });
    expect(result.success).toBe(false);
  });

  it('applique les valeurs par défaut (status=draft, deprecated=false, seo={})', () => {
    const result = ResourceFrontmatterSchema.safeParse(VALID_GUIDE);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.status).toBe('draft');
    expect(result.data.deprecated).toBe(false);
    expect(result.data.seo).toEqual({});
  });
});

describe('Contraintes par sous-type', () => {
  it('rejette une étude de cas sans objet caseStudy', () => {
    const { caseStudy: _omit, ...withoutCaseStudy } = VALID_CASE_STUDY;
    void _omit;
    const result = ResourceFrontmatterSchema.safeParse(withoutCaseStudy);
    expect(result.success).toBe(false);
  });

  it('rejette un glossaire sans term', () => {
    const { term: _omit, ...withoutTerm } = VALID_GLOSSARY;
    void _omit;
    const result = ResourceFrontmatterSchema.safeParse(withoutTerm);
    expect(result.success).toBe(false);
  });

  it('rejette un slug non kebab-case', () => {
    const result = ResourceFrontmatterSchema.safeParse({ ...VALID_GUIDE, slug: 'Mon_Guide' });
    expect(result.success).toBe(false);
  });

  it('rejette un author non kebab-case (FK auteur)', () => {
    const result = ResourceFrontmatterSchema.safeParse({ ...VALID_GUIDE, author: 'Marie D' });
    expect(result.success).toBe(false);
  });

  it('rejette une publishedAt mal formatée', () => {
    const result = ResourceFrontmatterSchema.safeParse({
      ...VALID_GUIDE,
      publishedAt: '15/01/2026',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un titre trop court (< 20 caractères)', () => {
    const result = ResourceFrontmatterSchema.safeParse({ ...VALID_GUIDE, title: 'Court' });
    expect(result.success).toBe(false);
  });

  it('rejette une persona hors enum', () => {
    const result = ResourceFrontmatterSchema.safeParse({
      ...VALID_GUIDE,
      personas: ['directeur-rh'],
    });
    expect(result.success).toBe(false);
  });

  it('accepte une FAQ et des relatedRessources bien formées', () => {
    const result = ResourceFrontmatterSchema.safeParse({
      ...VALID_GUIDE,
      faq: [{ question: 'Une question ?', answer: 'Une réponse suffisamment longue.' }],
      relatedRessources: [{ type: 'glossaire', slug: 'lms' }],
    });
    expect(result.success).toBe(true);
  });
});

describe('formatResourceErrors()', () => {
  it('produit un message lisible identifiant fichier et champ', () => {
    const result = ResourceFrontmatterSchema.safeParse({ ...VALID_GUIDE, title: 'X' });
    expect(result.success).toBe(false);
    if (result.success) return;
    const msg = formatResourceErrors('content/ressources/guides/mon-guide.mdx', result.error);
    expect(msg).toContain('content/ressources/guides/mon-guide.mdx');
    expect(msg).toContain('title');
    expect(msg).not.toContain('"code"');
  });
});

describe('Helpers de validation', () => {
  it('isValidModuleSlug reconnaît un module du catalogue', () => {
    expect(isValidModuleSlug('socle-ecoledigitale')).toBe(true);
    expect(isValidModuleSlug('parcours-bts')).toBe(true);
  });

  it('isValidModuleSlug rejette un slug inconnu', () => {
    expect(isValidModuleSlug('module-inexistant')).toBe(false);
  });

  it('personasNeedAutoCleaning détecte "tous" combiné à d’autres valeurs', () => {
    expect(personasNeedAutoCleaning(['tous', 'lycee-bts'])).toBe(true);
    expect(personasNeedAutoCleaning(['tous'])).toBe(false);
    expect(personasNeedAutoCleaning(['lycee-bts', 'superieur'])).toBe(false);
  });

  it('autoCleanPersonas réduit à ["tous"] quand "tous" est combiné', () => {
    expect(autoCleanPersonas(['tous', 'lycee-bts', 'superieur'])).toEqual(['tous']);
  });

  it('autoCleanPersonas laisse intact un tableau sans "tous"', () => {
    expect(autoCleanPersonas(['lycee-bts', 'superieur'])).toEqual(['lycee-bts', 'superieur']);
  });
});
