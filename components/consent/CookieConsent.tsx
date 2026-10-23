'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  setConsentChoice,
  subscribeConsent,
} from './consentStore';

// Même poids visuel pour les deux choix (et pour « Fermer ») : contour bleu de 2 px, fond blanc.
const BTN =
  'border-primary-700 text-primary-800 hover:bg-marker-soft font-display inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border-2 bg-white px-6 text-2xl leading-none font-bold shadow-xs transition-colors sm:flex-none';

/**
 * Bandeau de consentement : fixé en bas (aucun décalage de mise en page), non bloquant, il ne couvre
 * aucun contrôle de façon définitive (il disparaît dès qu'un choix est fait, ou avec « Fermer » / Échap).
 * « Accepter » et « Refuser » ont le même poids visuel.
 */
export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [reopened, setReopened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const open = () => {
      if (document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
      setReopened(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  const visible = consent === 'unset' || reopened;

  const close = () => {
    setReopened(false);
    // Rend le focus au bouton « Gérer mes cookies » qui a rouvert le bandeau.
    const target = opener.current;
    opener.current = null;
    if (target?.isConnected) setTimeout(() => target.focus(), 0);
  };

  // Échap ferme le bandeau rouvert, sans changer le choix existant.
  useEffect(() => {
    if (!reopened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reopened]);

  // À la réouverture volontaire, le focus entre dans le bandeau ; au premier passage on ne le vole pas.
  useEffect(() => {
    if (reopened) ref.current?.focus();
  }, [reopened]);

  const shown = consent !== 'loading' && visible;

  // Réserve en bas de page la hauteur réelle du bandeau tant qu'il est affiché, pour qu'il ne masque
  // ni le pied de page ni le bouton « Gérer mes cookies ».
  useEffect(() => {
    if (!shown) return;
    const el = ref.current;
    if (!el) return;
    const previous = document.body.style.paddingBottom;
    const apply = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    };
    apply();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply);
    observer?.observe(el);
    window.addEventListener('resize', apply);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', apply);
      document.body.style.paddingBottom = previous;
    };
  }, [shown]);

  if (!shown) return null;

  const choose = (choice: 'accepted' | 'refused') => {
    setConsentChoice(choice);
    close();
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      tabIndex={-1}
      className="border-primary-700 bg-paper text-ink fixed inset-x-0 bottom-0 z-[70] border-t-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_24px_-14px_rgba(17,27,77,0.35)] outline-none print:hidden"
    >
      <div className="container-wide flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-[68ch]">
          <p
            id="cookie-consent-title"
            className="font-display text-primary-800 text-3xl leading-none font-bold"
          >
            Vos choix sur les cookies
          </p>
          <p id="cookie-consent-desc" className="text-ink-muted mt-2 text-base leading-snug">
            Avec votre accord, nous mesurons l&apos;audience du site avec Google Analytics (cookies
            de mesure). Sans votre accord, aucun cookie Google n&apos;est déposé. Vous pouvez
            changer d&apos;avis à tout moment.{' '}
            <Link
              href="/confidentialite#cookies-traceurs"
              className="text-primary-700 hover:bg-marker-soft inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4"
            >
              Politique de confidentialité
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {reopened && consent !== 'unset' && (
            <button type="button" className={BTN} onClick={close}>
              Fermer
            </button>
          )}
          <button type="button" className={BTN} onClick={() => choose('refused')}>
            Refuser
          </button>
          <button type="button" className={BTN} onClick={() => choose('accepted')}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
