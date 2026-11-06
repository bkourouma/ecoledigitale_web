import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const MVP_ROUTES = [
  '/',
  '/modules',
  '/modules/socle-ecoledigitale',
  '/modules/ecoledigitale-primary',
  '/modules/ecoledigitale-secondary',
  '/modules/ecoledigitale-higher',
  '/modules/ecoledigitale-virtual',
  '/demander-demo',
  '/confidentialite',
  '/ressources',
  '/ressources/guides/digitaliser-institut-bts',
  '/ressources/guides/choisir-logiciel-gestion-ecole-privee',
  '/ressources/guides/reduire-impayes-frais-de-scolarite',
  '/ressources/guides/bulletins-sans-excel',
  '/auteurs/equipe-ecoledigitale',
  '/cote-d-ivoire',
  '/fonctions',
  '/fonctions/bulletins-et-notes',
  '/fonctions/frais-de-scolarite',
  '/fonctions/portail-parents',
  '/fonctions/emploi-du-temps-et-absences',
  '/faq',
  '/tarifs',
];

for (const path of MVP_ROUTES) {
  test(`a11y — ${path} : aucune violation serious/critical`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blockingViolations = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    if (blockingViolations.length > 0) {
      console.error(
        `Violations a11y sur ${path} :\n` +
          blockingViolations
            .map((v) => `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} occurrence(s))`)
            .join('\n'),
      );
    }

    expect(blockingViolations).toEqual([]);
  });
}

test('a11y — formulaire de démo en état d’erreur reste accessible', async ({ page }) => {
  await page.goto('/demander-demo');
  // Déclenche les erreurs de validation
  await page.getByRole('button', { name: /Envoyer ma demande/i }).click();
  // Attend que les messages d'erreur soient rendus
  await page.waitForSelector('[role="alert"]');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );

  expect(blocking).toEqual([]);
});
