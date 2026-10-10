import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

/** Une fiche de papier posée sur la page. */
export function Card({ className, children, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'border-line shadow-card rounded-md border bg-white p-6',
        interactive &&
          'hover:shadow-card-hover focus-within:shadow-card-hover cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[-0.4deg]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
