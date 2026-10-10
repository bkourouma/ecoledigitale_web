import type { ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface HeroProps {
  headline: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Hero générique réutilisable (accueil + pages module).
 * Les CTAs sont passés via `children` pour rester typés côté appelant.
 */
export function Hero({ headline, lead, children, className }: HeroProps) {
  return (
    <section className={cn('container-content py-16 md:py-24', className)}>
      <h1 className="font-display text-display-md text-primary-800 font-bold">{headline}</h1>
      {lead && <p className="text-ink-muted mt-6 max-w-prose text-lg">{lead}</p>}
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
