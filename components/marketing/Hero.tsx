import type { ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Hero générique réutilisable (accueil + pages module).
 * Les CTAs sont passés via `children` pour rester typés côté appelant.
 */
export function Hero({ eyebrow, headline, lead, children, className }: HeroProps) {
  return (
    <section className={cn('container-content py-16 md:py-24', className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-display-md font-semibold tracking-tight text-ink">{headline}</h1>
      {lead && <p className="mt-6 max-w-prose text-lg text-ink-muted">{lead}</p>}
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
