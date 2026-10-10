import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/ui/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'text-ink placeholder:text-ink-soft block w-full rounded-none border-0 border-b-2 bg-white/80 px-3 py-2.5 text-base transition-colors',
        'focus:ring-primary-300 focus:bg-white focus:ring-2 focus:outline-none',
        'disabled:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-70',
        invalid
          ? 'border-pen-500 focus:ring-pen-100'
          : 'border-primary-300 focus:border-primary-700',
        className,
      )}
      {...rest}
    />
  );
});
