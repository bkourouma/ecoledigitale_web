import { test, expect, type Page } from '@playwright/test';

/**
 * Fondations SEO : repositionnement, coordonnées, redirections, sitemap, JSON-LD.
 */

const PHONE_E164 = '+2250101510136';
const WHATSAPP_URL = 'https://wa.me/2250101510136';
const EMAIL = 'ecoledigitale@allianceconsultants.net';

const PUBLIC_PAGES = [
  '/',
  '/modules',
  '/modules/socle-ecoledigitale',
  '/modules/ecoledigitale-primary',
  '/modules/ecoledigitale-secondary',
  '/modules/ecoledigitale-higher',
  '/modules/ecoledigitale-virtual',
  '/a-propos',
  '/demander-demo',
  '/confidentialite',
  '/ressources',
  '/ressources/guides/choisir-logiciel-gestion-ecole-privee',
  '/ressources/guides/digitaliser-institut-bts',
  '/ressources/glossaire/cepe',
  '/auteurs/equipe-ecoledigitale',
];

async function jsonLdPayloads(page: Page): Promise<Record<string, unknown>[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.map((t) => JSON.parse(t) as Record<string, unknown>);
}

test.describe('Coordonnées', () => {
  test('le pied de page expose un seul numéro : +225 01 01 51 01 36 (téléphone et WhatsApp)', async ({
    page,
  }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute(
      'href',
      WHATSAPP_URL,
    );
    await expect(footer.locator(`a[href="tel:${PHONE_E164}"]`)).toContainText(
      '+225 01 01 51 01 36',
    );
    await expect(footer.locator(`a[href="mailto:${EMAIL}"]`)).toBeVisible();
  });

  test('le pied de page nomme l’éditeur : Alliance Consultants, Abidjan', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText(
      /Alliance Consultants, Abidjan, Côte d.Ivoire/,
    );
  });

  for (const path of PUBLIC_PAGES) {
    test(`${path} : aucune trace de l’ancien Gmail ni de l’ancien numéro WhatsApp`, async ({
      request,
    }) => {
      const html = await (await request.get(path)).text();
      expect(html).not.toMatch(/gmail\.com/i);
      expect(html).not.toContain('2250101610136');
      expect(html).not.toMatch(/Union [Ee]urop/);
    });
  }
});

test.describe('JSON-LD Organization', () => {
  test('logo en 200, adresse limitée à la ville et au pays, contact cohérent', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const org = (await jsonLdPayloads(page)).find((p) => p['@type'] === 'Organization');
    expect(org).toBeTruthy();

    const logo = String(org!.logo);
    const logoPath = new URL(logo).pathname;
    const logoResponse = await request.get(logoPath);
    expect(logoResponse.status()).toBe(200);

    expect(org!.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    });
    const contact = org!.contactPoint as Record<string, unknown>;
    expect(contact.telephone).toBe(PHONE_E164);
    expect(contact.email).toBe(EMAIL);
    expect(contact.areaServed).toBe('CI');
  });
});

test.describe('Redirections', () => {
  test('/blog → 301 vers /ressources', async ({ request }) => {
    const response = await request.get('/blog', { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toMatch(/\/ressources$/);
  });

  test('/blog/un-article → 301 vers /ressources', async ({ request }) => {
    const response = await request.get('/blog/un-article', { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toMatch(/\/ressources$/);
  });

  for (const slug of ['qualiopi', 'referentiel-rncp', 'alternance']) {
    test(`/ressources/glossaire/${slug} (cadre français retiré) → 301`, async ({ request }) => {
      const response = await request.get(`/ressources/glossaire/${slug}`, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
    });
  }
});

test.describe('Sitemap', () => {
  test('exclut /blog et l’étude de cas fictive, garde les packs et le glossaire ivoirien', async ({
    request,
  }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    expect(body).not.toContain('/blog');
    expect(body).not.toContain('exemple-institut-bts');
    expect(body).toContain('/modules/ecoledigitale-primary</loc>');
    expect(body).toContain('/ressources/glossaire/cepe</loc>');
    expect(body).toContain('/ressources/glossaire/mga</loc>');
  });

  test('les lastmod ne sont pas tous identiques (dates réelles)', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    const dates = [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]!.slice(0, 10));
    expect(dates.length).toBeGreaterThan(5);
    expect(new Set(dates).size).toBeGreaterThan(1);
    const today = new Date().toISOString().slice(0, 10);
    for (const date of dates) expect(date <= today).toBe(true);
  });
});

test.describe('Open Graph par page', () => {
  test('chaque pack a sa propre image Open Graph', async ({ request }) => {
    const images = new Set<string>();
    for (const slug of [
      'socle-ecoledigitale',
      'ecoledigitale-primary',
      'ecoledigitale-secondary',
      'ecoledigitale-higher',
      'ecoledigitale-virtual',
    ]) {
      const html = await (await request.get(`/modules/${slug}`)).text();
      const ogImages = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(
        (m) => m[1]!,
      );
      expect(ogImages, `/modules/${slug} : une seule image OG`).toHaveLength(1);
      expect(ogImages[0]).toContain(`/modules/${slug}/opengraph-image`);
      images.add(ogImages[0]!);
    }
    expect(images.size).toBe(5);
  });
});

test.describe('Repositionnement', () => {
  test('l’accueil vise la Côte d’Ivoire et les quatre cycles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Côte d.Ivoire/);
    // textContent : les réponses de la FAQ (repliées) comptent aussi.
    const text = (await page.locator('main').textContent()) ?? '';
    for (const word of ['maternelle', 'CEPE', 'BEPC', 'Mobile Money', 'devis']) {
      expect(text).toContain(word);
    }
  });

  test('aucune page publique ne parle de Qualiopi, RNCP ou d’alternance', async ({ request }) => {
    for (const path of PUBLIC_PAGES) {
      const html = await (await request.get(path)).text();
      expect(html, path).not.toMatch(/Qualiopi|RNCP|alternance/i);
    }
  });

  test('aucun prix affiché', async ({ request }) => {
    for (const path of PUBLIC_PAGES) {
      const html = await (await request.get(path)).text();
      expect(html, path).not.toMatch(/\d\s?(FCFA|XOF|€|EUR)\b/);
    }
  });
});

test.describe('404', () => {
  test('la page 404 est en français, avec le menu', async ({ page }) => {
    const response = await page.goto('/page-qui-nexiste-pas');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/introuvable/i);
    await expect(page.locator('header')).toBeVisible();
  });

  test('un guide inconnu ne porte pas de canonical vers /ressources', async ({ request }) => {
    const response = await request.get('/ressources/guides/inconnu');
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).not.toMatch(/<link rel="canonical"/);
  });
});
