import { test, expect } from '@playwright/test';

interface ModuleExpectation {
  slug: string;
  name: string;
  type: 'Module socle' | 'Module optionnel';
  /** Mots-clés qui DOIVENT apparaître dans les features ou le body. */
  keywords: string[];
}

const MODULES: ModuleExpectation[] = [
  {
    slug: 'socle-ecoledigitale',
    name: 'Socle EcoleDigitale',
    type: 'Module socle',
    keywords: ['inscriptions', 'paiements', 'présences'],
  },
  {
    slug: 'parcours-bts',
    name: 'Parcours BTS',
    type: 'Module optionnel',
    keywords: ['filières', 'bulletins', 'coefficients'],
  },
  {
    slug: 'parcours-superieur',
    name: 'Parcours Supérieur',
    type: 'Module optionnel',
    keywords: ['programmes', 'parcours', 'enseignants'],
  },
  {
    slug: 'proformation',
    name: 'ProFormation',
    type: 'Module optionnel',
    keywords: ['catalogue', 'sessions', 'formateurs'],
  },
  {
    slug: 'campus-live',
    name: 'Campus Live',
    type: 'Module optionnel',
    keywords: ['cours en direct', 'visioconférence', 'présences'],
  },
];

for (const mod of MODULES) {
  test.describe(`Page module : ${mod.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/modules/${mod.slug}`);
    });

    test(`affiche le h1 et le type (${mod.type})`, async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: mod.name })).toBeVisible();
      await expect(page.getByText(mod.type, { exact: false })).toBeVisible();
    });

    test('rend les sections benefits, features, audiences', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Ce que ce module apporte/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Principales fonctionnalités/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Profils utilisateurs adressés/i })).toBeVisible();
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
  });
}
