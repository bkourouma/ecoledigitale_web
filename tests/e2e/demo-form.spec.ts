import { test, expect, type Page } from '@playwright/test';
import { mockLeadsApi } from './helpers/mock-leads';

test.describe('Formulaire de demande de démo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demander-demo');
  });

  test('affiche le formulaire complet', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Découvrez EcoleDigitale/i })).toBeVisible();
    await expect(page.getByLabel(/Nom complet/i)).toBeVisible();
    await expect(page.getByLabel(/Email professionnel/i)).toBeVisible();
    await expect(page.getByLabel(/Téléphone/i)).toBeVisible();
    await expect(page.getByLabel(/Nom de l'établissement/i)).toBeVisible();
    await expect(page.getByLabel(/Votre rôle/i)).toBeVisible();
    await expect(page.getByLabel(/Ville et pays/i)).toBeVisible();
    // Le groupe de cases à cocher porte son intitulé via <fieldset>/<legend> ;
    // getByText résoudrait aussi le texte d'introduction de la page.
    await expect(page.getByRole('group', { name: /Modules qui vous intéressent/i })).toBeVisible();
  });

  test('soumission vide → erreurs de validation sur les champs requis', async ({ page }) => {
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    // 7 champs requis + consent => au moins 7 messages d'erreur
    const errors = await page.getByRole('alert').count();
    expect(errors).toBeGreaterThanOrEqual(6);
  });

  test('email invalide → erreur ciblée sur le champ email', async ({ page }) => {
    await page.getByLabel(/Email professionnel/i).fill('pas-un-email');
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    const emailField = page.getByLabel(/Email professionnel/i);
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');
  });

  test('aucun module sélectionné → erreur sur le groupe modules', async ({ page }) => {
    await fillRequiredFields(page, { skipModules: true, skipConsent: false });
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    await expect(page.getByText(/Sélectionnez au moins un module/i)).toBeVisible();
  });

  test('soumission valide → redirection vers /merci', async ({ page }) => {
    await mockLeadsApi(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    await page.waitForURL('**/demander-demo/merci', { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: /Merci pour votre demande/i })).toBeVisible();
  });

  test('double-clic submit → une seule requête', async ({ page }) => {
    await mockLeadsApi(page);
    await fillRequiredFields(page);

    const requests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/api/leads') && req.method() === 'POST') requests.push(req.url());
    });

    const submit = page.getByRole('button', { name: /Envoyer ma demande/i });
    await Promise.all([submit.click(), submit.click().catch(() => undefined)]);
    await page.waitForURL('**/demander-demo/merci', { timeout: 10_000 });

    expect(requests.length).toBe(1);
  });
});

async function fillRequiredFields(
  page: Page,
  options: { skipModules?: boolean; skipConsent?: boolean } = {},
) {
  await page.getByLabel(/Nom complet/i).fill('Marie Dupont');
  await page.getByLabel(/Votre rôle/i).fill('Directrice');
  await page.getByLabel(/Email professionnel/i).fill('marie@example.com');
  await page.getByLabel(/Téléphone/i).fill('+33 1 23 45 67 89');
  await page.getByLabel(/Nom de l'établissement/i).fill('Institut Exemple');
  await page.getByLabel(/Ville et pays/i).fill('Paris, France');
  if (!options.skipModules) {
    await page.getByLabel(/Parcours BTS/i).check();
  }
  if (!options.skipConsent) {
    await page.getByLabel(/J'accepte d'être recontacté/i).check();
  }
}
