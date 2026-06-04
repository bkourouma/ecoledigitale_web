import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/ui/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full appearance-none rounded-xl border bg-white bg-no-repeat pr-9 pl-3.5 py-2.5 text-sm text-ink shadow-xs dark:bg-white/8 dark:text-neutral-50',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:bg-surface-muted dark:disabled:bg-white/5',
        invalid ? 'border-red-400 focus:ring-red-500' : 'border-neutral-300 dark:border-white/10',
        // Chevron en background-image
        "bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.75rem_center]",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
