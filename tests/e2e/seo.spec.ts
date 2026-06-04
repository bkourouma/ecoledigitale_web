import { test, expect, type Page } from '@playwright/test';

const MVP_ROUTES: { path: string; expectedTitleHint: RegExp; allowNoindex?: boolean }[] = [
  { path: '/', expectedTitleHint: /EcoleDigitale/i },
  { path: '/modules', expectedTitleHint: /Modules/i },
  { path: '/modules/socle-ecoledigitale', expectedTitleHint: /Socle/i },
  { path: '/modules/parcours-bts', expectedTitleHint: /BTS/i },
  { path: '/modules/parcours-superieur', expectedTitleHint: /Supérieur/i },
  { path: '/modules/proformation', expectedTitleHint: /ProFormation|formation professionnelle/i },
  { path: '/modules/campus-live', expectedTitleHint: /Campus Live|cours en (ligne|direct)/i },
  { path: '/demander-demo', expectedTitleHint: /Demander|démonstration/i },
  { path: '/confidentialite', expectedTitleHint: /Confidentialité/i },
  { path: '/demander-demo/merci', expectedTitleHint: /Merci/i, allowNoindex: true },
  { path: '/ressources', expectedTitleHint: /Ressources/i },
  {
    path: '/ressources/guides/digitaliser-institut-bts',
    expectedTitleHint: /BTS/i,
  },
  {
    path: '/ressources/guides/choisir-logiciel-gestion-ecole-privee',
    expectedTitleHint: /ecole privee|gestion/i,
  },
];

async function getMeta(page: Page, selector: string, attribute: 'content' | 'href' = 'content') {
  return page.locator(selector).first().getAttribute(attribute);
}

test.describe('SEO — meta tags par page', () => {
  for (const route of MVP_ROUTES) {
    test(`${route.path} : title, description, canonical, OG, Twitter`, async ({ page }) => {
      await page.goto(route.path);

      // Title
      const title = await page.title();
      expect(title).toMatch(route.expectedTitleHint);
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(80);

      // Meta description
      const description = await getMeta(page, 'meta[name="description"]');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThanOrEqual(50);
      expect(description!.length).toBeLessThanOrEqual(200);

      // Canonical
      const canonical = await getMeta(page, 'link[rel="canonical"]', 'href');
      expect(canonical).toBeTruthy();
      if (route.path === '/') {
        expect(new URL(canonical!).pathname).toBe('/');
      } else {
        expect(canonical!.endsWith(route.path)).toBe(true);
      }

      // Open Graph
      const ogTitle = await getMeta(page, 'meta[property="og:title"]');
      const ogDescription = await getMeta(page, 'meta[property="og:description"]');
      const ogUrl = await getMeta(page, 'meta[property="og:url"]');
      const ogType = await getMeta(page, 'meta[property="og:type"]');
      const ogLocale = await getMeta(page, 'meta[property="og:locale"]');
      const ogImage = await getMeta(page, 'meta[property="og:image"]');

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogUrl).toBeTruthy();
      expect(ogType).toBe('website');
      expect(ogLocale).toBe('fr_FR');
      expect(ogImage).toBeTruthy();

      // Twitter
      const twitterCard = await getMeta(page, 'meta[name="twitter:card"]');
      expect(twitterCard).toBe('summary_large_image');

      // Robots
      const robots = await getMeta(page, 'meta[name="robots"]');
      if (route.allowNoindex) {
        // /merci doit être noindex
        expect(robots).toMatch(/noindex/);
      }
    });
  }

  test('chaque page MVP a un h1 unique', async ({ page }) => {
    for (const route of MVP_ROUTES) {
      await page.goto(route.path);
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${route.path} doit avoir 1 h1`).toBe(1);
    }
  });

  test('toutes les pages utilisent lang="fr"', async ({ page }) => {
    for (const route of MVP_ROUTES) {
      await page.goto(route.path);
      const lang = await page.locator('html').first().getAttribute('lang');
      expect(lang).toBe('fr');
    }
  });
});

async function getJsonLd(page: Page): Promise<unknown[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  const payloads: unknown[] = [];
  for (const script of scripts) {
    const text = await script.textContent();
    if (!text) continue;
    payloads.push(JSON.parse(text));
  }
  return payloads;
}

function flattenTypes(payloads: unknown[]): string[] {
  const types: string[] = [];
  for (const p of payloads) {
    if (p && typeof p === 'object' && '@type' in p) {
      const t = (p as { '@type': unknown })['@type'];
      if (typeof t === 'string') types.push(t);
      else if (Array.isArray(t)) types.push(...t.filter((x): x is string => typeof x === 'string'));
    }
  }
  return types;
}

test.describe('SEO — JSON-LD structured data', () => {
  test('chaque page MVP injecte au moins un JSON-LD valide', async ({ page }) => {
    for (const route of MVP_ROUTES) {
      if (route.allowNoindex) continue; // /merci peut ne pas avoir de JSON-LD
      await page.goto(route.path);
      const payloads = await getJsonLd(page);
      expect(payloads.length, `${route.path} doit avoir au moins un JSON-LD`).toBeGreaterThan(0);
    }
  });

  test('toutes les pages contiennent Organization + WebSite (root layout)', async ({ page }) => {
    for (const route of MVP_ROUTES) {
      if (route.allowNoindex) continue;
      await page.goto(route.path);
      const types = flattenTypes(await getJsonLd(page));
      expect(types, `${route.path} doit contenir Organization`).toContain('Organization');
      expect(types, `${route.path} doit contenir WebSite`).toContain('WebSite');
    }
  });

  test('/ contient un FAQPage', async ({ page }) => {
    await page.goto('/');
    const types = flattenTypes(await getJsonLd(page));
    expect(types).toContain('FAQPage');
  });

  test('/modules contient un BreadcrumbList', async ({ page }) => {
    await page.goto('/modules');
    const types = flattenTypes(await getJsonLd(page));
    expect(types).toContain('BreadcrumbList');
  });

  test('chaque page module contient Course + BreadcrumbList', async ({ page }) => {
    const slugs = [
      'socle-ecoledigitale',
      'parcours-bts',
      'parcours-superieur',
      'proformation',
      'campus-live',
    ];
    for (const slug of slugs) {
      await page.goto(`/modules/${slug}`);
      const types = flattenTypes(await getJsonLd(page));
      expect(types, `/modules/${slug} doit avoir Course`).toContain('Course');
      expect(types, `/modules/${slug} doit avoir BreadcrumbList`).toContain('BreadcrumbList');
    }
  });

  test('/a-propos, /demander-demo, /confidentialite ont un BreadcrumbList', async ({ page }) => {
    for (const path of ['/a-propos', '/demander-demo', '/confidentialite']) {
      await page.goto(path);
      const types = flattenTypes(await getJsonLd(page));
      expect(types, `${path} doit avoir BreadcrumbList`).toContain('BreadcrumbList');
    }
  });

  test('une page guide contient Article + BreadcrumbList + FAQPage', async ({ page }) => {
    await page.goto('/ressources/guides/digitaliser-institut-bts');
    const types = flattenTypes(await getJsonLd(page));
    expect(types, 'la page guide doit avoir Article').toContain('Article');
    expect(types, 'la page guide doit avoir BreadcrumbList').toContain('BreadcrumbList');
    // Le guide MVP contient une FAQ dans son frontmatter → FAQPage attendu.
    expect(types, 'la page guide doit avoir FAQPage').toContain('FAQPage');
  });

  test('une page auteur contient Person + BreadcrumbList', async ({ page }) => {
    await page.goto('/auteurs/equipe-ecoledigitale');
    const types = flattenTypes(await getJsonLd(page));
    expect(types, 'la page auteur doit avoir Person').toContain('Person');
    expect(types, 'la page auteur doit avoir BreadcrumbList').toContain('BreadcrumbList');
  });
});
