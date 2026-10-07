import type { AnalyticsEventMap, AnalyticsEventName } from '@/lib/analytics/events';

type UmamiTrackFn = (event: string, data?: Record<string, string | number | boolean>) => void;

declare global {
  interface Window {
    /** Posé par le script Umami (components/analytics/UmamiScript.tsx) ; absent en développement. */
    umami?: { track: UmamiTrackFn };
  }
}

/**
 * Wrapper typé d'émission d'événements Umami.
 * No-op côté serveur (rendu RSC) et tant que le script Umami n'est pas chargé
 * (développement local, bloqueur de publicités, domaine non compté).
 *
 * Voir specs/001-site-marketing/contracts/analytics-events.contract.md
 */
export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEventMap[E]): void {
  if (typeof window === 'undefined') return;
  if (typeof window.umami?.track !== 'function') return;
  window.umami.track(event, props as Record<string, string | number | boolean>);
}
