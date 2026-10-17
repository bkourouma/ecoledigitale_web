import { test, expect, type Page } from '@playwright/test';

/**
 * Pages « par sujet » : Côte d'Ivoire, fonctions, FAQ, tarifs.
 * Métadonnées, plan de titres, JSON-LD (FAQPage identique au texte visible), maillage, sitemap.
 */

const TITLE_SUFFIX = ' | EcoleDigitale';

const PAGES = [
  '/cote-d-ivoire',
  '/fonctions',
  '/fonctions/bulletins-et-notes',
  '/fonctions/frais-de-scolarite',
  '/fonctions/portail-parents',
  '/fonctions/emploi-du-temps-et-absences',
  '/faq',
  '/tarifs',
];

type JsonLd = Record<string, unknown>;

async function jsonLdPayloads(page: Page): Promise<JsonLd[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.map((t) => JSON.parse(t) as JsonLd);
}

for (const path of PAGES) {
  test.describe(path, () => {
    test('title, meta, canonical, un seul H1', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title.endsWith(TITLE_SUFFIX), 'suffixe du gabarit').toBe(true);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title.split('EcoleDigitale').length - 1, 'marque non répétée').toBe(1);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeGreaterThan(80);
      expect(description!.length).toBeLessThanOrEqual(155);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical!).pathname).toBe(path);

      const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
      expect(robots).toMatch(/index/);
      expect(robots).not.toMatch(/noindex/);

      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });

    test('JSON-LD : WebPage, BreadcrumbList et FAQPage dont le texte est visible', async ({
      page,
    }) => {
      await page.goto(path);
      const payloads = await jsonLdPayloads(page);
      const types = payloads.map((p) => p['@type']);
      for (const type of ['WebPage', 'BreadcrumbList', 'FAQPage']) expect(types).toContain(type);

      const faq = payloads.find((p) => p['@type'] === 'FAQPage')!;
      const entities = faq.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
      expect(entities.length).toBeGreaterThanOrEqual(3);

      // textContent : les réponses repliées (<details>) comptent aussi.
      const visible = ((await page.locator('main').textContent()) ?? '').replace(/\s+/g, ' ');
      for (const entity of entities) {
        expect(visible, entity.name).toContain(entity.name.replace(/\s+/g, ' '));
        expect(visible, entity.name).toContain(entity.acceptedAnswer.text.replace(/\s+/g, ' '));
      }

      // Pas d'offre chiffrée dans le JSON-LD.
      expect(JSON.stringify(payloads)).not.toMatch(/"offers"|"price"/);
    });

    test('liens vers un pack, /demander-demo et /ressources', async ({ page }) => {
      await page.goto(path);
      // :visible écarte les liens des réponses repliées de la FAQ.
      const main = page.locator('main');
      await expect(main.locator('a[href^="/modules/"]:visible').first()).toBeVisible();
      await expect(main.locator('a[href="/demander-demo"]:visible').first()).toBeVisible();
      await expect(main.locator('a[href^="/ressources"]:visible').first()).toBeVisible();
    });

    test('aucun prix, aucun opérateur, aucune certification', async ({ request }) => {
      const html = await (await request.get(path)).text();
      expect(html).not.toMatch(/\d\s?(FCFA|XOF|€|EUR)\b/);
      expect(html).not.toMatch(/Orange Money|MTN|Moov|\bWave\b/);
      expect(html).not.toMatch(/Qualiopi|RNCP|alternance|RGPD|ARTCI/i);
    });
  });
}

test.describe('Plan de titres', () => {
  test('la page Côte d’Ivoire cite le pays dans le H1 et les trois examens', async ({ page }) => {
    await page.goto('/cote-d-ivoire');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Côte d.Ivoire/);
    const text = (await page.locator('main').textContent()) ?? '';
    for (const word of ['CEPE', 'BEPC', 'BAC', 'MGA', 'Mobile Money', 'Afrique francophone']) {
      expect(text).toContain(word);
    }
  });

  test('la FAQ est organisée en groupes de H2', async ({ page }) => {
    await page.goto('/faq');
    for (const heading of [
      'Choisir et démarrer',
      'Cycles et examens',
      'Notes et bulletins',
      'Frais de scolarité et paiements',
      'Parents et mobile',
      'Données et sécurité',
      'Tarifs',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }
  });

  test('les tarifs citent les trois offres, le délai et la réponse sous 48 h, sans montant', async ({
    page,
  }) => {
    await page.goto('/tarifs');
    const text = (await page.locator('main').textContent()) ?? '';
    for (const word of [
      'Starter',
      'Professional',
      'Enterprise',
      'devis',
      '1 à 3 semaines',
      '48 h',
    ]) {
      expect(text).toContain(word);
    }
  });
});

test.describe('Sitemap', () => {
  test('liste les nouvelles pages et les deux nouveaux guides, avec un lastmod réel', async ({
    request,
  }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    for (const path of [...PAGES, '/ressources/guides/reduire-impayes-frais-de-scolarite']) {
      expect(body, path).toContain(`${path}</loc>`);
    }
    expect(body).toContain('/ressources/guides/bulletins-sans-excel</loc>');
    const today = new Date().toISOString().slice(0, 10);
    for (const block of body.split('<url>').slice(1)) {
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      expect(lastmod, 'lastmod présent').toBeTruthy();
      expect(lastmod!.slice(0, 10) <= today).toBe(true);
    }
  });
});

test.describe('Navigation et pied de page', () => {
  test('le menu expose Fonctions (avec ses pages), Tarifs et Ressources', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');
    if (isMobile) {
      await page
        .locator('header')
        .getByRole('button', { name: /Ouvrir le menu/i })
        .click();
      const nav = page.locator('header nav[aria-label="Navigation mobile"]');
      await expect(nav.getByRole('link', { name: 'Fonctions', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Tarifs' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Portail parents' })).toBeVisible();
      await expect(nav.getByRole('link', { name: /Côte d.Ivoire/ })).toBeVisible();
    } else {
      const nav = page.locator('header').getByRole('navigation', { name: 'Navigation principale' });
      await expect(nav.getByRole('link', { name: 'Tarifs' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Ressources' })).toBeVisible();
      const trigger = nav.getByRole('button', { name: 'Fonctions' });
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      for (const label of [
        'Notes et bulletins',
        'Frais de scolarité et Mobile Money',
        'Portail parents',
        'Emploi du temps et absences',
        'Toutes les fonctions',
      ]) {
        await expect(nav.getByRole('link', { name: label })).toBeVisible();
      }
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('le pied de page expose les pages par fonction, la FAQ et les tarifs', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    const features = footer.getByRole('navigation', { name: 'Fonctions' });
    for (const href of [
      '/cote-d-ivoire',
      '/fonctions/bulletins-et-notes',
      '/fonctions/frais-de-scolarite',
      '/fonctions/portail-parents',
      '/fonctions/emploi-du-temps-et-absences',
    ]) {
      await expect(features.locator(`a[href="${href}"]`)).toBeVisible();
    }
    const pages = footer.getByRole('navigation', { name: 'Pages' });
    await expect(pages.locator('a[href="/faq"]')).toBeVisible();
    await expect(pages.locator('a[href="/tarifs"]')).toBeVisible();
  });

  test('l’accueil, un pack et les ressources renvoient vers les nouvelles pages', async ({
    page,
  }) => {
    await page.goto('/');
    const home = page.locator('main');
    for (const href of ['/fonctions', '/cote-d-ivoire', '/faq', '/tarifs']) {
      await expect(home.locator(`a[href="${href}"]`).first()).toBeAttached();
    }
    await page.goto('/modules/ecoledigitale-primary');
    for (const href of ['/fonctions', '/cote-d-ivoire', '/faq', '/tarifs']) {
      await expect(page.locator('main').locator(`a[href="${href}"]`).first()).toBeAttached();
    }
    await page.goto('/ressources');
    for (const href of ['/fonctions', '/cote-d-ivoire', '/faq']) {
      await expect(page.locator('main').locator(`a[href="${href}"]`).first()).toBeAttached();
    }
  });
});

test.describe('Mobile', () => {
  test('aucun défilement horizontal à 375 px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const path of PAGES) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test.describe('Étude de cas supprimée', () => {
  test('aucune page ne mentionne l’institut fictif', async ({ request }) => {
    for (const path of [...PAGES, '/ressources', '/ressources/guides/digitaliser-institut-bts']) {
      const html = await (await request.get(path)).text();
      expect(html, path).not.toMatch(/Institut Bellevue|Camille Renard|exemple-institut-bts/);
    }
  });
});
