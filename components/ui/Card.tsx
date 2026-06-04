import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ className, children, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/6',
        interactive &&
          'transition-all duration-200 hover:-translate-y-1 hover:border-accent-300/70 hover:shadow-card-hover focus-within:shadow-card-hover cursor-pointer dark:hover:border-accent-400/50',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
