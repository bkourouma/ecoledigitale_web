import type { Page } from '@playwright/test';

export interface CapturedEvent {
  event: string;
  props: Record<string, unknown> | undefined;
}

declare global {
  interface Window {
    __plausibleEvents?: CapturedEvent[];
  }
}

/**
 * Installe un faux `window.plausible` qui enregistre les events dans
 * `window.__plausibleEvents` avant tout autre script.
 * Doit être appelé AVANT `page.goto(...)`.
 */
export async function installPlausibleMock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.__plausibleEvents = [];
    (window as unknown as {
      plausible: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    }).plausible = (event, opts) => {
      window.__plausibleEvents!.push({ event, props: opts?.props });
    };
  });
}

/** Récupère la liste des events capturés depuis le mock. */
export async function getCapturedEvents(page: Page): Promise<CapturedEvent[]> {
  return page.evaluate(() => window.__plausibleEvents ?? []);
}

/** Filtre les events capturés par nom. */
export async function getEventsByName(
  page: Page,
  eventName: string,
): Promise<CapturedEvent[]> {
  const all = await getCapturedEvents(page);
  return all.filter((e) => e.event === eventName);
}

/** Vide les events capturés (utile entre deux assertions dans un même test). */
export async function clearCapturedEvents(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (window.__plausibleEvents) window.__plausibleEvents.length = 0;
  });
}
