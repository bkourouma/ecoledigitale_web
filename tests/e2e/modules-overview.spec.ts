import { test, expect } from '@playwright/test';

test.describe('Page /modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modules');
  });

  test('affiche le titre et l’intro', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /5 modules pour s['’]adapter/i }),
    ).toBeVisible();
  });

  test('affiche les 5 cartes module dans la grille', async ({ page }) => {
    const grid = page.locator('ul').filter({ hasText: 'Socle EcoleDigitale' }).first();
    await expect(grid).toBeVisible();

    for (const name of [
      'Socle EcoleDigitale',
      'Parcours BTS',
      'Parcours Supérieur',
      'ProFormation',
      'Campus Live',
    ]) {
      await expect(grid.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('affiche la table comparative avec le socle distingué', async ({ page }) => {
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByText(/Socle de base/i)).toBeVisible();
    await expect(table.getByText(/Activable en option/i).first()).toBeVisible();
  });

  test('chaque carte renvoie vers la page module correspondante', async ({ page }) => {
    const slugs = [
      'socle-ecoledigitale',
      'parcours-bts',
      'parcours-superieur',
      'proformation',
      'campus-live',
    ];

    for (const slug of slugs) {
      const link = page.locator(`a[href="/modules/${slug}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('expose un CTA "Demander une offre modulée"', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Demander une offre modulée/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/demander-demo/);
  });
});
