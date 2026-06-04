'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { track } from '@/lib/analytics/track';

export interface TrackedModuleLinkProps extends Omit<LinkProps, 'onClick'> {
  className?: string;
  children: ReactNode;
}

/**
 * Lien client component vers une page module qui émet
 * `Modules CTA Clicked` avec placement='card' au clic.
 */
export function TrackedModuleLink({ children, className, ...linkProps }: TrackedModuleLinkProps) {
  const pathname = usePathname() || '/';

  const handleClick = () => {
    track('Modules CTA Clicked', {
      placement: 'card',
      sourcePage: pathname,
    });
  };

  return (
    <Link {...linkProps} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
