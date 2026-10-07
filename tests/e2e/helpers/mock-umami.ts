import type { Page } from '@playwright/test';

export interface CapturedEvent {
  event: string;
  props: Record<string, unknown> | undefined;
}

declare global {
  interface Window {
    __umamiEvents?: CapturedEvent[];
  }
}

/**
 * Installe un faux `window.umami` qui enregistre les events dans
 * `window.__umamiEvents` avant tout autre script.
 * Doit être appelé AVANT `page.goto(...)`.
 */
export async function installUmamiMock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.__umamiEvents = [];
    (
      window as unknown as {
        umami: { track: (event: string, data?: Record<string, unknown>) => void };
      }
    ).umami = {
      track: (event, data) => {
        window.__umamiEvents!.push({ event, props: data });
      },
    };
  });
}

/** Récupère la liste des events capturés depuis le mock. */
export async function getCapturedEvents(page: Page): Promise<CapturedEvent[]> {
  return page.evaluate(() => window.__umamiEvents ?? []);
}

/** Filtre les events capturés par nom. */
export async function getEventsByName(page: Page, eventName: string): Promise<CapturedEvent[]> {
  const all = await getCapturedEvents(page);
  return all.filter((e) => e.event === eventName);
}

/** Vide les events capturés (utile entre deux assertions dans un même test). */
export async function clearCapturedEvents(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (window.__umamiEvents) window.__umamiEvents.length = 0;
  });
}
