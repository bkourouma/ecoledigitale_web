import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/ui/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'shimmer-btn bg-accent-500 text-neutral-950 shadow-xs hover:bg-accent-400 active:bg-accent-600 disabled:bg-accent-200 hover:shadow-sm dark:text-neutral-950',
  secondary:
    'bg-white text-ink ring-1 ring-inset ring-neutral-200 hover:bg-surface-subtle hover:ring-accent-300 disabled:opacity-60 shadow-xs dark:bg-white/8 dark:text-neutral-50 dark:ring-white/10 dark:hover:bg-white/12',
  ghost:
    'text-ink-muted hover:text-ink hover:bg-surface-muted disabled:opacity-60 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs font-medium',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:hover:translate-y-0 select-none';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
});

export type ButtonLinkProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
  const isExternal =
    /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
