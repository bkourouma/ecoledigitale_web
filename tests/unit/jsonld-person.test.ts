import { describe, it, expect } from 'vitest';
import { buildPerson } from '@/lib/seo/jsonld';

describe('buildPerson()', () => {
  it('produit un payload Person avec les champs requis', () => {
    const person = buildPerson({ name: 'Marie Dupont', path: '/auteurs/marie-dupont' });
    expect(person['@context']).toBe('https://schema.org');
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Marie Dupont');
  });

  it('absolutise l’URL de la page auteur', () => {
    const person = buildPerson({ name: 'X', path: '/auteurs/x' });
    expect(person.url).toMatch(/^https?:\/\/.+\/auteurs\/x$/);
  });

  it('inclut worksFor pointant vers l’Organization', () => {
    const person = buildPerson({ name: 'X', path: '/auteurs/x' });
    expect(person.worksFor['@type']).toBe('Organization');
    expect(person.worksFor.name).toBe('EcoleDigitale');
  });

  it('omet jobTitle, description, image et sameAs quand absents', () => {
    const person = buildPerson({ name: 'X', path: '/auteurs/x' });
    expect(person).not.toHaveProperty('jobTitle');
    expect(person).not.toHaveProperty('description');
    expect(person).not.toHaveProperty('image');
    expect(person).not.toHaveProperty('sameAs');
  });

  it('inclut jobTitle et description quand fournis', () => {
    const person = buildPerson({
      name: 'X',
      path: '/auteurs/x',
      jobTitle: 'Consultante',
      description: 'Bio courte.',
    });
    expect(person).toHaveProperty('jobTitle', 'Consultante');
    expect(person).toHaveProperty('description', 'Bio courte.');
  });

  it('absolutise l’image quand fournie', () => {
    const person = buildPerson({ name: 'X', path: '/auteurs/x', image: '/images/x.jpg' });
    expect(person).toHaveProperty('image');
    expect((person as { image: string }).image).toMatch(/\/images\/x\.jpg$/);
  });

  it('inclut sameAs quand au moins une URL est fournie', () => {
    const person = buildPerson({
      name: 'X',
      path: '/auteurs/x',
      sameAs: ['https://www.linkedin.com/in/x/'],
    });
    expect(person).toHaveProperty('sameAs');
    expect((person as { sameAs: string[] }).sameAs).toContain('https://www.linkedin.com/in/x/');
  });

  it('omet sameAs quand le tableau est vide', () => {
    const person = buildPerson({ name: 'X', path: '/auteurs/x', sameAs: [] });
    expect(person).not.toHaveProperty('sameAs');
  });
});
