import { test, expect } from '@playwright/test';

test.describe('Sitemap', () => {
  test('/sitemap.xml répond 200 avec du XML valide', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/xml/);

    const body = await response.text();
    expect(body.startsWith('<?xml')).toBe(true);
    expect(body).toContain('<urlset');
  });

  test('/sitemap.xml liste les 8 routes MVP + /confidentialite', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();

    const expectedPaths = [
      '/',
      '/modules',
      '/modules/socle-ecoledigitale',
      '/modules/ecoledigitale-primary',
      '/modules/ecoledigitale-secondary',
      '/modules/ecoledigitale-higher',
      '/modules/ecoledigitale-virtual',
      '/demander-demo',
      '/confidentialite',
    ];

    for (const path of expectedPaths) {
      // Le sitemap utilise une URL absolue ; on vérifie la présence du chemin final
      // (path === '/' → vérifier la fin par "/" suivie de "</loc>")
      if (path === '/') {
        expect(body).toMatch(/<loc>[^<]+\/<\/loc>/);
      } else {
        expect(body).toContain(`${path}</loc>`);
      }
    }
  });

  test('/sitemap.xml inclut le hub et les ressources publiées', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    expect(body).toContain('/ressources</loc>');
    expect(body).toContain('/ressources/guides/digitaliser-institut-bts</loc>');
    expect(body).toContain('/ressources/guides/choisir-logiciel-gestion-ecole-privee</loc>');
  });
});

test.describe('Robots', () => {
  test('/robots.txt répond 200 avec du texte', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/text/);
    const body = await response.text();
    expect(body).toMatch(/User-Agent:/i);
  });

  test('/robots.txt en non-prod : disallow / partout', async ({ request }) => {
    // Le test tourne en dev/preview par défaut → VERCEL_ENV !== 'production'
    if (process.env.VERCEL_ENV === 'production') {
      test.skip();
    }
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/Disallow:\s*\//);
  });
});

test.describe('Open Graph images', () => {
  test('opengraph-image accessible sur /', async ({ request }) => {
    // Next.js sert l'image générée à /opengraph-image (auto-route)
    const response = await request.get('/opengraph-image');
    expect([200, 308, 307]).toContain(response.status());
  });

  test('opengraph-image accessible sur chacune des 5 pages module', async ({ request }) => {
    const slugs = [
      'socle-ecoledigitale',
      'ecoledigitale-primary',
      'ecoledigitale-secondary',
      'ecoledigitale-higher',
      'ecoledigitale-virtual',
    ];
    for (const slug of slugs) {
      const html = await (await request.get(`/modules/${slug}`)).text();
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
      expect(ogImage, `/modules/${slug} doit exposer une image OG`).toBeTruthy();

      const response = await request.get(ogImage!);
      expect([200, 308, 307]).toContain(response.status());
    }
  });
});

test.describe('Icônes et manifest', () => {
  test('/icon répond 200 (image PNG)', async ({ request }) => {
    const response = await request.get('/icon');
    expect([200, 308, 307]).toContain(response.status());
  });

  test('/apple-icon répond 200 (image PNG)', async ({ request }) => {
    const response = await request.get('/apple-icon');
    expect([200, 308, 307]).toContain(response.status());
  });

  test('/manifest.webmanifest répond 200 avec JSON valide', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('EcoleDigitale');
    expect(body.theme_color).toBeTruthy();
    expect(Array.isArray(body.icons)).toBe(true);
    expect(body.icons.length).toBeGreaterThan(0);
  });
});
