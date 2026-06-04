import { describe, it, expect, beforeEach } from 'vitest';
import {
  _resetModulesCacheForTests,
  getAllModuleSlugs,
  getModuleBySlug,
  loadModules,
} from '@/lib/content/modules';
import { MODULE_SLUGS } from '@/lib/content/module.schema';

describe('loadModules()', () => {
  beforeEach(() => {
    _resetModulesCacheForTests();
  });

  it('charge exactement 5 modules', () => {
    const modules = loadModules();
    expect(modules).toHaveLength(5);
  });

  it('retourne les modules triés par `order` croissant', () => {
    const modules = loadModules();
    const orders = modules.map((m) => m.frontmatter.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('place le socle en première position (order=1)', () => {
    const modules = loadModules();
    expect(modules[0]!.frontmatter.slug).toBe('socle-ecoledigitale');
    expect(modules[0]!.frontmatter.type).toBe('socle');
  });

  it('valide la présence des 5 slugs attendus', () => {
    const slugs = loadModules().map((m) => m.frontmatter.slug);
    for (const expected of MODULE_SLUGS) {
      expect(slugs).toContain(expected);
    }
  });

  it("contient exactement 1 module de type 'socle'", () => {
    const socles = loadModules().filter((m) => m.frontmatter.type === 'socle');
    expect(socles).toHaveLength(1);
  });

  it('chaque module a un body non vide', () => {
    const modules = loadModules();
    for (const m of modules) {
      expect(m.body.trim().length).toBeGreaterThan(0);
    }
  });

  it('cache le résultat (deux appels successifs retournent la même instance)', () => {
    const first = loadModules();
    const second = loadModules();
    expect(first).toBe(second);
  });
});

describe('getModuleBySlug()', () => {
  beforeEach(() => {
    _resetModulesCacheForTests();
  });

  it('retourne le module Parcours BTS', () => {
    const mod = getModuleBySlug('parcours-bts');
    expect(mod.frontmatter.name).toBe('Parcours BTS');
    expect(mod.frontmatter.type).toBe('optionnel');
  });

  it('retourne ProFormation avec ses audiences', () => {
    const mod = getModuleBySlug('proformation');
    expect(mod.frontmatter.audiences).toContain('trainer');
  });
});

describe('getAllModuleSlugs()', () => {
  beforeEach(() => {
    _resetModulesCacheForTests();
  });

  it('retourne les 5 slugs attendus', () => {
    const slugs = getAllModuleSlugs();
    expect(slugs).toHaveLength(5);
    expect(new Set(slugs)).toEqual(new Set(MODULE_SLUGS));
  });
});
