import { test, expect } from '@playwright/test';

/**
 * Tests E2E du hub /ressources et de ses filtres serveur.
 *
 * Les assertions s'appuient sur le guide `digitaliser-institut-bts`
 * (persona `superieur`, type `guides`).
 */

const GUIDE_HEADING = /Digitaliser un institut BTS : par où commencer/i;

test.describe('Hub /ressources', () => {
  test('liste les ressources publiées', async ({ page }) => {
    await page.goto('/ressources');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('expose les filtres persona et type (formulaire GET, sans JS)', async ({ page }) => {
    await page.goto('/ressources');
    const form = page.locator('form[method="get" i][action="/ressources"]');
    await expect(form).toBeVisible();
    await expect(page.locator('select[name="persona"]')).toBeVisible();
    await expect(page.locator('select[name="type"]')).toBeVisible();
  });

  test('le filtre persona retourne un sous-ensemble cohérent', async ({ page }) => {
    // Le guide cible le public « superieur » → présent.
    await page.goto('/ressources?persona=superieur');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('le filtre type retourne un sous-ensemble cohérent', async ({ page }) => {
    await page.goto('/ressources?type=guides');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('les filtres sont combinables via l’URL', async ({ page }) => {
    await page.goto('/ressources?persona=superieur&type=guides');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('une combinaison de filtres sans résultat affiche un état vide explicite', async ({
    page,
  }) => {
    // Aucun guide ne cible le public « a-distance » → aucun résultat.
    await page.goto('/ressources?type=guides&persona=a-distance');
    await expect(page.getByText(/Aucune ressource pour ces filtres/i)).toBeVisible();
  });

  test('le filtre type=glossaire affiche les définitions du glossaire', async ({ page }) => {
    await page.goto('/ressources?type=glossaire');
    await expect(page.getByRole('heading', { name: /LMS/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /CEPE/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toHaveCount(0);
    // Le cadre français (Qualiopi, RNCP, alternance) a quitté le glossaire.
    await expect(page.getByRole('heading', { name: /Qualiopi|RNCP|Alternance/i })).toHaveCount(0);
  });

  test('le lien Réinitialiser ramène vers /ressources sans paramètre', async ({ page }) => {
    await page.goto('/ressources?persona=superieur');
    const reset = page.getByRole('link', { name: /Réinitialiser/i });
    await expect(reset).toHaveAttribute('href', '/ressources');
  });
});

test.describe('Étude de cas supprimée', () => {
  test('l’ancienne étude de cas fictive redirige en 301 vers /ressources', async ({ request }) => {
    const response = await request.get('/ressources/etudes-de-cas/exemple-institut-bts', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toMatch(/\/ressources$/);
  });

  test('le hub ne propose plus de filtre « Études de cas » et n’affiche aucun exemple fictif', async ({
    page,
  }) => {
    await page.goto('/ressources');
    await expect(page.locator('select[name="type"] option[value="etudes-de-cas"]')).toHaveCount(0);
    await expect(page.getByText(/données fictives|Exemple illustratif/i)).toHaveCount(0);
    await expect(page.getByText(/Institut Bellevue|Camille Renard/i)).toHaveCount(0);
  });
});
