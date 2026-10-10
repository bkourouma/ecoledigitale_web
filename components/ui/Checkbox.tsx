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
        'text-primary-700 accent-primary-700 h-5 w-5 rounded-[3px] border-2',
        'focus:ring-primary-300 focus:ring-2 focus:ring-offset-1 focus:outline-none',
        invalid ? 'border-pen-500' : 'border-primary-400',
        className,
      )}
      {...rest}
    />
  );
});
