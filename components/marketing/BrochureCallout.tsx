'use client';

import { usePathname } from 'next/navigation';
import { FileDown } from 'lucide-react';
import { track } from '@/lib/analytics/track';

/**
 * Stub Phase 2 : bouton "Recevoir la brochure" non actif.
 *
 * Comportement actuel : visuellement neutre + label "bientôt disponible".
 * Émet quand même `Brochure Requested` au clic afin de **mesurer l'intérêt**
 * pour la brochure avant sa mise en place effective en Phase 2 (PRD §17 Phase 2).
 *
 * Pas monté dans les pages MVP par défaut — disponible pour test A/B futur.
 */
export function BrochureCallout() {
  const pathname = usePathname() || '/';

  const handleClick = () => {
    track('Brochure Requested', { sourcePage: pathname });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border-line text-ink-muted hover:bg-surface-muted focus-visible:outline-brand-500 inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label="Demander la brochure (bientôt disponible)"
    >
      <FileDown className="h-4 w-4" aria-hidden="true" />
      <span>Recevoir la brochure</span>
      <span className="text-ink-soft text-xs">— bientôt</span>
    </button>
  );
}
