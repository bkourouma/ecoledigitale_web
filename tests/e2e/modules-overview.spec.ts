import { test, expect } from '@playwright/test';

test.describe('Page /modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modules');
  });

  test('affiche le titre et l’intro', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: /Un socle commun et quatre packs par cycle/i }),
    ).toBeVisible();
  });

  test('affiche le socle et les 4 packs dans la grille', async ({ page }) => {
    const grid = page.locator('ul').filter({ hasText: 'Socle EcoleDigitale' }).first();
    await expect(grid).toBeVisible();

    for (const name of [
      'Socle EcoleDigitale',
      'EcoleDigitale Primary',
      'EcoleDigitale Secondary',
      'EcoleDigitale Higher',
      'EcoleDigitale Virtual',
    ]) {
      await expect(grid.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('affiche la table comparative avec le socle distingué', async ({ page }) => {
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByText(/Socle de base/i)).toBeVisible();
    await expect(table.getByText(/Pack à ajouter/i).first()).toBeVisible();
  });

  test('chaque carte renvoie vers la page module correspondante', async ({ page }) => {
    const slugs = [
      'socle-ecoledigitale',
      'ecoledigitale-primary',
      'ecoledigitale-secondary',
      'ecoledigitale-higher',
      'ecoledigitale-virtual',
    ];

    for (const slug of slugs) {
      const link = page.locator(`a[href="/modules/${slug}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('expose un CTA "Demander un devis"', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Demander un devis/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/demander-demo/);
  });
});
