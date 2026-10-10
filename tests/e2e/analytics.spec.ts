import { test, expect } from '@playwright/test';
import {
  clearCapturedEvents,
  getCapturedEvents,
  getEventsByName,
  installUmamiMock,
} from './helpers/mock-umami';

test.beforeEach(async ({ page }) => {
  await installUmamiMock(page);
});

test.describe('Analytics — Demo CTA Clicked', () => {
  test('clic sur CTA démo du hero accueil → placement=hero', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Demander une démonstration/i })
      .first()
      .click();

    const events = await getEventsByName(page, 'Demo CTA Clicked');
    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events[0]!.props).toEqual(
      expect.objectContaining({ placement: 'hero', sourcePage: '/' }),
    );
  });

  test('clic sur CTA démo du header sticky → placement=header', async ({ page }) => {
    await page.goto('/modules');
    await page
      .locator('header')
      .getByRole('link', { name: /Demander une démo/i })
      .click();

    const events = await getEventsByName(page, 'Demo CTA Clicked');
    expect(events.some((e) => e.props?.placement === 'header')).toBe(true);
  });
});

test.describe('Analytics — Modules CTA Clicked', () => {
  test('clic sur "Voir les modules" du hero accueil → placement=hero', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Voir les modules/i })
      .first()
      .click();

    const events = await getEventsByName(page, 'Modules CTA Clicked');
    expect(events.some((e) => e.props?.placement === 'hero')).toBe(true);
  });

  test('clic sur une carte module → placement=card', async ({ page }) => {
    await page.goto('/modules');
    await page
      .getByRole('link', { name: /Voir le module/i })
      .first()
      .click();

    const events = await getEventsByName(page, 'Modules CTA Clicked');
    expect(events.some((e) => e.props?.placement === 'card')).toBe(true);
  });
});

test.describe('Analytics — Module Page Viewed', () => {
  test('chargement de /modules/parcours-bts → event avec slug', async ({ page }) => {
    await page.goto('/modules/parcours-bts');

    // Le useEffect doit avoir tourné après navigation
    await page.waitForFunction(() =>
      (window.__umamiEvents ?? []).some((e) => e.event === 'Module Page Viewed'),
    );

    const events = await getEventsByName(page, 'Module Page Viewed');
    expect(events).toHaveLength(1);
    expect(events[0]!.props).toEqual({ moduleSlug: 'parcours-bts' });
  });

  test('chacune des 5 pages module émet un event avec son slug', async ({ page }) => {
    const slugs = [
      'socle-ecoledigitale',
      'parcours-bts',
      'parcours-superieur',
      'proformation',
      'campus-live',
    ];

    for (const slug of slugs) {
      await page.goto(`/modules/${slug}`);
      await page.waitForFunction(
        (s) =>
          (window.__umamiEvents ?? []).some(
            (e) =>
              e.event === 'Module Page Viewed' &&
              (e.props as { moduleSlug?: string })?.moduleSlug === s,
          ),
        slug,
      );
      await clearCapturedEvents(page);
    }
  });
});

test.describe('Analytics — Module Selected In Form', () => {
  test('cocher un module dans le formulaire → event avec moduleSlug', async ({ page }) => {
    await page.goto('/demander-demo');
    await page.getByLabel(/Parcours BTS/i).check();

    const events = await getEventsByName(page, 'Module Selected In Form');
    expect(events).toHaveLength(1);
    expect(events[0]!.props).toEqual(expect.objectContaining({ moduleSlug: 'parcours-bts' }));
  });

  test("décocher un module n'émet PAS d'event (seul le toggle ON est tracé)", async ({ page }) => {
    await page.goto('/demander-demo');
    const checkbox = page.getByLabel(/Parcours BTS/i);
    await checkbox.check();
    await clearCapturedEvents(page);
    await checkbox.uncheck();

    const events = await getEventsByName(page, 'Module Selected In Form');
    expect(events).toHaveLength(0);
  });
});

test.describe('Analytics — Demo Form Submitted / Failed', () => {
  test('soumission valide → Demo Form Submitted avec propriétés correctes', async ({ page }) => {
    await page.goto('/demander-demo');

    await page.getByLabel(/Nom complet/i).fill('Marie Dupont');
    await page.getByLabel(/Votre rôle/i).fill('Directrice');
    await page.getByLabel(/Email professionnel/i).fill('marie@example.com');
    await page.getByLabel(/Téléphone/i).fill('+33 1 23 45 67 89');
    await page.getByLabel(/Nom de l'établissement/i).fill('Institut Exemple');
    await page.getByLabel(/Ville et pays/i).fill('Paris, France');
    await page.getByLabel(/Parcours BTS/i).check();
    await page.getByLabel(/Campus Live/i).check();
    await page.getByLabel(/J'accepte d'être recontacté/i).check();
    await page.getByRole('button', { name: /Envoyer ma demande/i }).click();

    await page.waitForURL('**/demander-demo/merci', { timeout: 10_000 });

    const events = await getEventsByName(page, 'Demo Form Submitted');
    expect(events).toHaveLength(1);
    expect(events[0]!.props).toEqual(
      expect.objectContaining({
        modulesCount: 2,
        hasMessage: false,
        hasStudentCount: false,
      }),
    );
  });
});

test.describe('Analytics — Contact Channel Clicked', () => {
  test('clic sur WhatsApp dans le footer → event avec channel=whatsapp', async ({
    page,
    context,
  }) => {
    // Empêcher la navigation vers wa.me
    await context.route('https://wa.me/**', (route) => route.abort());
    await page.goto('/');
    await page
      .locator('footer')
      .getByRole('link', { name: /WhatsApp/i })
      .click({ noWaitAfter: true });

    const events = await getEventsByName(page, 'Contact Channel Clicked');
    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events[0]!.props).toEqual(
      expect.objectContaining({ channel: 'whatsapp', placement: 'footer' }),
    );
  });
});

test('catalogue complet : aucun event hors-whitelist émis sur le golden path', async ({ page }) => {
  const allowed = new Set([
    'Demo CTA Clicked',
    'Modules CTA Clicked',
    'Module Page Viewed',
    'Module Selected In Form',
    'Demo Form Submitted',
    'Demo Form Submission Failed',
    'Contact Channel Clicked',
    'Brochure Requested',
  ]);

  await page.goto('/');
  await page
    .getByRole('link', { name: /Voir les modules/i })
    .first()
    .click();
  await page.waitForURL('**/modules');

  const events = await getCapturedEvents(page);
  for (const e of events) {
    expect(allowed.has(e.event), `Event hors whitelist : ${e.event}`).toBe(true);
  }
});
