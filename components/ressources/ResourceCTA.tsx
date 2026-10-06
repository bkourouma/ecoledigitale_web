'use client';

import { usePathname } from 'next/navigation';
import { ButtonLink, type ButtonLinkProps } from '@/components/ui/Button';
import { track } from '@/lib/analytics/track';
import type { ResourceType } from '@/lib/content/resource.schema';
import type { ResourceCtaTarget } from '@/lib/analytics/events';

export interface ResourceCTAProps extends Omit<ButtonLinkProps, 'onClick'> {
  resourceType: ResourceType;
  resourceSlug: string;
  ctaTarget: ResourceCtaTarget;
}

/**
 * CTA des pages ressources. Émet l'événement Umami `Resource CTA Clicked`
 * avec le contexte de la ressource d'origine — permet de mesurer SC-006
 * (chaque lead démo issu du hub renseigne une ressource source identifiable).
 */
export function ResourceCTA({
  resourceType,
  resourceSlug,
  ctaTarget,
  children,
  ...rest
}: ResourceCTAProps) {
  const pathname = usePathname() || '/';
  const handleClick = () => {
    track('Resource CTA Clicked', {
      resourceType,
      resourceSlug,
      ctaTarget,
      sourcePage: pathname,
    });
  };

  return (
    <ButtonLink onClick={handleClick} {...rest}>
      {children}
    </ButtonLink>
  );
}
