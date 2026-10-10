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
        'text-ink placeholder:text-ink-soft block w-full appearance-none rounded-none border-0 border-b-2 bg-white/80 bg-no-repeat py-2.5 pr-9 pl-3 text-base transition-colors',
        'focus:ring-primary-300 focus:bg-white focus:ring-2 focus:outline-none',
        'disabled:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-70',
        invalid
          ? 'border-pen-500 focus:ring-pen-100'
          : 'border-primary-300 focus:border-primary-700',
        // Chevron en background-image
        "bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231f2d7a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.75rem_center]",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
