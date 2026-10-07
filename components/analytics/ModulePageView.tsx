'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics/track';
import type { ModuleSlug } from '@/lib/content/module.schema';

export interface ModulePageViewProps {
  moduleSlug: ModuleSlug;
}

/**
 * Client component qui émet `Module Page Viewed` au chargement de la page.
 * Monté en début de `/modules/[slug]/page.tsx`.
 *
 * Umami suit déjà les pageviews automatiquement, mais cet event custom
 * expose la propriété `moduleSlug` pour le ranking des modules les plus consultés.
 */
export function ModulePageView({ moduleSlug }: ModulePageViewProps) {
  useEffect(() => {
    track('Module Page Viewed', { moduleSlug });
  }, [moduleSlug]);

  return null;
}
