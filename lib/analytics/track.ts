import type { AnalyticsEventMap, AnalyticsEventName } from '@/lib/analytics/events';

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Wrapper typé d'émission d'événements Plausible.
 * No-op côté serveur (rendu RSC).
 *
 * Voir specs/001-site-marketing/contracts/analytics-events.contract.md
 */
export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEventMap[E]): void {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(event, { props: props as Record<string, string | number | boolean> });
}
