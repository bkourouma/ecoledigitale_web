'use client';

import { usePathname } from 'next/navigation';
import { ButtonLink, type ButtonLinkProps } from '@/components/ui/Button';
import { track } from '@/lib/analytics/track';
import type { CtaPlacement } from '@/lib/analytics/events';

export interface TrackedDemoCTAProps extends Omit<ButtonLinkProps, 'href' | 'onClick'> {
  placement: CtaPlacement;
  href?: string;
}

/**
 * CTA "Demander une démonstration" qui émet `Demo CTA Clicked` avec le placement.
 * Wrapper client component utilisable dans une page server component.
 */
export function TrackedDemoCTA({ placement, href = '/demander-demo', children, ...rest }: TrackedDemoCTAProps) {
  const pathname = usePathname() || '/';
  const handleClick = () => {
    track('Demo CTA Clicked', { placement, sourcePage: pathname });
  };

  return (
    <ButtonLink href={href} onClick={handleClick} {...rest}>
      {children}
    </ButtonLink>
  );
}

export interface TrackedModulesCTAProps extends Omit<ButtonLinkProps, 'href' | 'onClick'> {
  placement: 'hero' | 'inline' | 'card';
  href?: string;
}

export function TrackedModulesCTA({
  placement,
  href = '/modules',
  children,
  ...rest
}: TrackedModulesCTAProps) {
  const pathname = usePathname() || '/';
  const handleClick = () => {
    track('Modules CTA Clicked', { placement, sourcePage: pathname });
  };

  return (
    <ButtonLink href={href} onClick={handleClick} {...rest}>
      {children}
    </ButtonLink>
  );
}
