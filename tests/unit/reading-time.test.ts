import { describe, it, expect } from 'vitest';
import { getReadingTime } from '@/lib/content/reading-time';

describe('getReadingTime()', () => {
  it('retourne la forme { minutes, words, text }', () => {
    const result = getReadingTime('Un texte court de quelques mots.');
    expect(result).toHaveProperty('minutes');
    expect(result).toHaveProperty('words');
    expect(result).toHaveProperty('text');
  });

  it('formate le texte en français', () => {
    const result = getReadingTime('Quelques mots.');
    expect(result.text).toMatch(/min de lecture$/);
  });

  it('garantit un minimum de 1 minute même pour un body très court', () => {
    const result = getReadingTime('Trois mots seulement.');
    expect(result.minutes).toBe(1);
    expect(result.text).toBe('1 min de lecture');
  });

  it('calcule ~1 minute pour ~220 mots (base 220 mots/min)', () => {
    const body = Array.from({ length: 220 }, () => 'mot').join(' ');
    const result = getReadingTime(body);
    expect(result.minutes).toBe(1);
    expect(result.words).toBeGreaterThanOrEqual(200);
    expect(result.words).toBeLessThanOrEqual(240);
  });

  it('calcule ~2 minutes pour ~440 mots', () => {
    const body = Array.from({ length: 440 }, () => 'mot').join(' ');
    const result = getReadingTime(body);
    expect(result.minutes).toBe(2);
  });

  it('arrondit les minutes à l’entier supérieur', () => {
    // ~300 mots → 1,36 min → arrondi à 2
    const body = Array.from({ length: 300 }, () => 'mot').join(' ');
    const result = getReadingTime(body);
    expect(result.minutes).toBe(2);
  });
});
