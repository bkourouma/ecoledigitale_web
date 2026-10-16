import { test, expect } from '@playwright/test';

interface ModuleExpectation {
  slug: string;
  name: string;
  /** H1 : la requête visée, pas seulement le nom du produit. */
  h1: RegExp;
  badge: 'Le socle commun' | 'Pack à ajouter au socle';
  /** Mots-clés qui DOIVENT apparaître dans les features ou le body. */
  keywords: string[];
}

const MODULES: ModuleExpectation[] = [
  {
    slug: 'socle-ecoledigitale',
    name: 'Socle EcoleDigitale',
    h1: /Logiciel de gestion d.école privée/i,
    badge: 'Le socle commun',
    keywords: ['inscriptions', 'frais de scolarité', 'absences'],
  },
  {
    slug: 'ecoledigitale-primary',
    name: 'EcoleDigitale Primary',
    h1: /école primaire et maternelle/i,
    badge: 'Pack à ajouter au socle',
    keywords: ['CEPE', 'bulletins', 'portail parents'],
  },
  {
    slug: 'ecoledigitale-secondary',
    name: 'EcoleDigitale Secondary',
    h1: /collège et lycée/i,
    badge: 'Pack à ajouter au socle',
    keywords: ['BEPC', 'BAC', 'conseil de classe'],
  },
  {
    slug: 'ecoledigitale-higher',
    name: 'EcoleDigitale Higher',
    h1: /école supérieure, institut BTS et centre de formation/i,
    badge: 'Pack à ajouter au socle',
    keywords: ['filières', 'évaluations', 'relevés'],
  },
  {
    slug: 'ecoledigitale-virtual',
    name: 'EcoleDigitale Virtual',
    h1: /Plateforme LMS pour école en ligne/i,
    badge: 'Pack à ajouter au socle',
    keywords: ['classes virtuelles', 'certificats', 'devoirs'],
  },
];

for (const mod of MODULES) {
  test.describe(`Page module : ${mod.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/modules/${mod.slug}`);
    });

    test('affiche le nom du produit, le h1 mot-clé et le type', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: mod.h1 })).toBeVisible();
      await expect(page.getByText(mod.name, { exact: true }).first()).toBeVisible();
      await expect(page.getByText(mod.badge, { exact: true })).toBeVisible();
    });

    test('rend les sections benefits, features, audiences, FAQ, voir aussi', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /Ce que (le socle|ce pack) apporte/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: /Principales fonctionnalités/i }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: /Profils utilisateurs adressés/i }),
      ).toBeVisible();
      await expect(page.getByRole('heading', { name: /Questions fréquentes/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Voir aussi/i })).toBeVisible();
    });

    test('contient les mots-clés attendus', async ({ page }) => {
      for (const kw of mod.keywords) {
        await expect(page.getByText(kw, { exact: false }).first()).toBeVisible();
      }
    });

    test('expose un CTA démo cliquable', async ({ page }) => {
      const cta = page.getByRole('link', { name: /Demander une démonstration/i }).first();
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', /\/demander-demo/);
    });

    test('renvoie vers /ressources (maillage)', async ({ page }) => {
      await expect(page.locator('main a[href="/ressources"]').first()).toBeVisible();
    });
  });
}

test.describe('Anciennes pages module', () => {
  const REDIRECTS: Record<string, string> = {
    'parcours-bts': 'ecoledigitale-higher',
    'parcours-superieur': 'ecoledigitale-higher',
    proformation: 'ecoledigitale-virtual',
    'campus-live': 'ecoledigitale-virtual',
  };

  for (const [oldSlug, newSlug] of Object.entries(REDIRECTS)) {
    test(`/modules/${oldSlug} → 301 vers /modules/${newSlug}`, async ({ request }) => {
      const response = await request.get(`/modules/${oldSlug}`, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers()['location']).toContain(`/modules/${newSlug}`);
    });
  }
});
