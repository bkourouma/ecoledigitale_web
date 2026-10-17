import { test, expect } from '@playwright/test';

const MVP_ROUTES = [
  '/',
  '/modules',
  '/ressources',
  '/modules/socle-ecoledigitale',
  '/modules/ecoledigitale-primary',
  '/modules/ecoledigitale-secondary',
  '/modules/ecoledigitale-higher',
  '/modules/ecoledigitale-virtual',
  '/demander-demo',
  '/confidentialite',
  '/cote-d-ivoire',
  '/fonctions',
  '/fonctions/bulletins-et-notes',
  '/fonctions/frais-de-scolarite',
  '/fonctions/portail-parents',
  '/fonctions/emploi-du-temps-et-absences',
  '/faq',
  '/tarifs',
];

test.describe('Navigation au clavier', () => {
  test('le skip-link est le premier élément focusable et mène au main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const active = await page.evaluate(() => document.activeElement?.textContent ?? '');
    expect(active).toMatch(/Aller au contenu principal/i);

    // Activation du skip-link → focus déplace sur #main-content
    await page.keyboard.press('Enter');
    const focusedId = await page.evaluate(() => (document.activeElement as HTMLElement)?.id ?? '');
    expect(focusedId).toBe('main-content');
  });

  test('Tab parcourt header + main + footer sans piège', async ({ page }) => {
    await page.goto('/');

    const tabbedRoles = new Set<string>();
    let lastFocused = '';
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return { tag: '', text: '' };
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent ?? '').slice(0, 40),
        };
      });
      tabbedRoles.add(info.tag);
      if (info.text === lastFocused) break;
      lastFocused = info.text;
    }

    // Doit avoir traversé au moins : a (lien header), button (submit nul ici mais a la home), a (footer)
    expect(tabbedRoles.has('a')).toBe(true);
  });

  test('focus visible sur le CTA hero après Tab', async ({ page }) => {
    await page.goto('/');
    // Skip le skip-link
    await page.keyboard.press('Tab');
    // Passer au header logo + nav + CTA — on tabe jusqu'à trouver "Demander une démonstration"
    for (let i = 0; i < 15; i++) {
      const text = await page.evaluate(
        () => (document.activeElement as HTMLElement)?.textContent ?? '',
      );
      if (/Demander une démonstration/i.test(text)) break;
      await page.keyboard.press('Tab');
    }

    // Vérifier qu'un style d'outline est appliqué (focus-visible)
    const outlineWidth = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return '';
      return window.getComputedStyle(el).outlineStyle;
    });
    expect(outlineWidth).not.toBe('none');
  });
});

test.describe('Navigation links — toutes les routes répondent 200', () => {
  for (const path of MVP_ROUTES) {
    test(`GET ${path} → 200`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe('Liens du header et footer', () => {
  test('le menu principal expose Ressources et n’expose plus Blog', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await page
        .locator('header')
        .getByRole('button', { name: /Ouvrir le menu/i })
        .click();
    }
    const nav = page.locator('header').getByRole('navigation').first();
    const mobileNav = page.locator('header nav[aria-label="Navigation mobile"]');
    const scope = isMobile ? mobileNav : nav;
    await expect(scope.getByRole('link', { name: 'Ressources' })).toBeVisible();
    await expect(scope.getByRole('link', { name: 'Blog' })).toHaveCount(0);
  });

  test('le logo header ramène à l’accueil depuis n’importe quelle page', async ({ page }) => {
    await page.goto('/modules/ecoledigitale-higher');
    await page
      .locator('header')
      .getByRole('link', { name: /EcoleDigitale/i })
      .first()
      .click();
    await page.waitForURL('**/');
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('le footer expose les liens de navigation, dont Ressources', async ({ page }) => {
    await page.goto('/');
    const footerNav = page.locator('footer').getByRole('navigation', { name: /Pages/i });
    for (const label of [
      'Accueil',
      'Packs',
      'Ressources',
      'Demander une démonstration',
      'Confidentialité',
    ]) {
      await expect(footerNav.getByRole('link', { name: label })).toBeVisible();
    }
  });
});
