import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/ui/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-invalid={invalid || undefined}
      className={cn(
        'h-4 w-4 rounded border text-accent-600',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1 dark:focus:ring-offset-neutral-950',
        invalid ? 'border-red-400' : 'border-neutral-300 dark:border-white/20',
        className,
      )}
      {...rest}
    />
  );
});
