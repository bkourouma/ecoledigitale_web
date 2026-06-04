import { test, expect } from '@playwright/test';

/**
 * Tests E2E du hub /ressources et de ses filtres serveur.
 *
 * Le contenu MVP comprend un guide unique `digitaliser-institut-bts`
 * (persona `lycee-bts`, type `guides`). Les assertions s'appuient dessus.
 */

const GUIDE_HEADING = /Digitaliser un institut BTS/i;

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
    // Le guide cible lycee-bts → présent.
    await page.goto('/ressources?persona=lycee-bts');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('le filtre type retourne un sous-ensemble cohérent', async ({ page }) => {
    await page.goto('/ressources?type=guides');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('les filtres sont combinables via l’URL', async ({ page }) => {
    await page.goto('/ressources?persona=lycee-bts&type=guides');
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toBeVisible();
  });

  test('une combinaison de filtres sans résultat affiche un état vide explicite', async ({
    page,
  }) => {
    // Aucune étude de cas ne cible le public "campus-live" → aucun résultat.
    await page.goto('/ressources?type=etudes-de-cas&persona=campus-live');
    await expect(page.getByText(/Aucune ressource pour ces filtres/i)).toBeVisible();
  });

  test('le filtre type=glossaire affiche les définitions du glossaire', async ({ page }) => {
    await page.goto('/ressources?type=glossaire');
    await expect(page.getByRole('heading', { name: /LMS/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: GUIDE_HEADING })).toHaveCount(0);
  });

  test('le lien Réinitialiser ramène vers /ressources sans paramètre', async ({ page }) => {
    await page.goto('/ressources?persona=lycee-bts');
    const reset = page.getByRole('link', { name: /Réinitialiser/i });
    await expect(reset).toHaveAttribute('href', '/ressources');
  });
});

test.describe('Étude de cas', () => {
  const CASE_STUDY_URL = '/ressources/etudes-de-cas/exemple-institut-bts';

  test('une étude de cas fictive affiche le bandeau FictionalCaseBanner', async ({ page }) => {
    await page.goto(CASE_STUDY_URL);
    await expect(page.getByText(/données fictives/i)).toBeVisible();
  });

  test('le JSON-LD Article d’une étude fictive porte disambiguatingDescription', async ({
    page,
  }) => {
    await page.goto(CASE_STUDY_URL);
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const payloads = scripts.map((s) => JSON.parse(s) as Record<string, unknown>);
    const article = payloads.find((p) => p['@type'] === 'Article');
    expect(article, 'un JSON-LD Article doit être présent').toBeTruthy();
    expect(article?.disambiguatingDescription).toBeTruthy();
  });

  test('l’étude de cas expose un CTA vers /demander-demo', async ({ page }) => {
    await page.goto(CASE_STUDY_URL);
    const cta = page.getByRole('link', { name: /Demander une démonstration/i }).first();
    await expect(cta).toHaveAttribute('href', '/demander-demo');
  });
});
