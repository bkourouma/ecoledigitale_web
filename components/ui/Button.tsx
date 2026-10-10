import {
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { cn } from '@/lib/ui/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'chalk';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'stamp disabled:opacity-50',
  chalk: 'stamp-chalk disabled:opacity-50',
  secondary:
    'rounded-md border-2 border-primary-700 bg-paper text-primary-800 rotate-[0.8deg] shadow-xs hover:rotate-0 hover:bg-marker-soft disabled:opacity-50',
  ghost: 'text-primary-700 pen-underline hover:text-primary-900 disabled:opacity-50',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-lg',
  md: 'h-11 px-5 text-xl',
  lg: 'h-12 px-7 text-2xl',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 font-display font-bold leading-none transition-all duration-200 disabled:cursor-not-allowed select-none';

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
