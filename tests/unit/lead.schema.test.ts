import { describe, it, expect } from 'vitest';
import { LeadSchema, LeadSubmissionSchema, maskLeadForLog } from '@/lib/leads/lead.schema';

const validBase = {
  fullName: 'Marie Dupont',
  email: 'm.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  institutionName: 'Institut Exemple',
  role: 'Directrice académique',
  location: 'Paris, France',
  modulesOfInterest: ['ecoledigitale-higher'] as const,
  consent: true,
  sourcePage: '/demander-demo',
};

describe('LeadSchema', () => {
  it('accepte un lead minimal valide', () => {
    const result = LeadSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepte les champs optionnels valides', () => {
    const result = LeadSchema.safeParse({
      ...validBase,
      studentCount: 350,
      institutionType: 'Institut privé post-bac',
      message: 'Nous cherchons à digitaliser le suivi de notre cycle BTS.',
      preferredChannel: 'email',
    });
    expect(result.success).toBe(true);
  });

  it('rejette si fullName est trop court', () => {
    const result = LeadSchema.safeParse({ ...validBase, fullName: 'a' });
    expect(result.success).toBe(false);
  });

  it('rejette un email invalide', () => {
    const result = LeadSchema.safeParse({ ...validBase, email: 'pas-un-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'email')).toBe(true);
    }
  });

  it('rejette un téléphone vide', () => {
    const result = LeadSchema.safeParse({ ...validBase, phone: '' });
    expect(result.success).toBe(false);
  });

  it("rejette si aucun module n'est sélectionné", () => {
    const result = LeadSchema.safeParse({ ...validBase, modulesOfInterest: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'modulesOfInterest')).toBe(true);
    }
  });

  it('rejette un module slug inconnu', () => {
    const result = LeadSchema.safeParse({ ...validBase, modulesOfInterest: ['unknown-module'] });
    expect(result.success).toBe(false);
  });

  it("rejette si consent n'est pas explicitement true", () => {
    expect(LeadSchema.safeParse({ ...validBase, consent: false }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...validBase, consent: undefined }).success).toBe(false);
  });

  it('lowercase email automatiquement', () => {
    const result = LeadSchema.parse({ ...validBase, email: 'MARIE@example.COM' });
    expect(result.email).toBe('marie@example.com');
  });

  it('rejette studentCount non entier ou négatif', () => {
    expect(LeadSchema.safeParse({ ...validBase, studentCount: -1 }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...validBase, studentCount: 1.5 }).success).toBe(false);
    expect(LeadSchema.safeParse({ ...validBase, studentCount: 1_000_000 }).success).toBe(false);
  });

  it('rejette un message > 2000 caractères', () => {
    const longMessage = 'a'.repeat(2001);
    expect(LeadSchema.safeParse({ ...validBase, message: longMessage }).success).toBe(false);
  });

  it('rejette sourcePage qui ne commence pas par /', () => {
    expect(LeadSchema.safeParse({ ...validBase, sourcePage: 'demander-demo' }).success).toBe(false);
  });
});

describe('LeadSubmissionSchema (honeypot)', () => {
  it('accepte website vide', () => {
    const result = LeadSubmissionSchema.safeParse({ ...validBase, website: '' });
    expect(result.success).toBe(true);
  });

  it('accepte website absent (default "")', () => {
    const result = LeadSubmissionSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe('');
  });

  it('accepte website rempli — le honeypot est traité par la route, pas le schéma', () => {
    const result = LeadSubmissionSchema.safeParse({ ...validBase, website: 'bot.com' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe('bot.com');
  });
});

describe('maskLeadForLog', () => {
  it('masque email, téléphone et nom', () => {
    const masked = maskLeadForLog(LeadSchema.parse(validBase));
    expect(masked.email).toBe('m***@example.com');
    expect(masked.phone).toBe('*** *** 89');
    expect(masked.fullName).toMatch(/^M\*\*\*$/);
  });

  it('résume un message par sa longueur', () => {
    const lead = LeadSchema.parse({ ...validBase, message: 'Bonjour, je voudrais une démo.' });
    const masked = maskLeadForLog(lead);
    expect(masked.message).toBe('[30 chars]');
  });
});
