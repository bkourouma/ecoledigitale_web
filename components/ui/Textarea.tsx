import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/ui/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink shadow-xs placeholder:text-ink-soft dark:bg-white/8 dark:text-neutral-50 dark:placeholder:text-neutral-500',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:bg-surface-muted dark:disabled:bg-white/5',
        invalid ? 'border-red-400 focus:ring-red-500' : 'border-neutral-300 dark:border-white/10',
        className,
      )}
      {...rest}
    />
  );
});
