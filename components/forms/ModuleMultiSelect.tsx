'use client';

import { forwardRef } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { track } from '@/lib/analytics/track';
import type { ModuleSlug } from '@/lib/content/module.schema';
import { cn } from '@/lib/ui/cn';

export interface ModuleOption {
  slug: ModuleSlug;
  label: string;
  description?: string;
}

export interface ModuleMultiSelectProps {
  options: ModuleOption[];
  value: ModuleSlug[];
  onChange: (next: ModuleSlug[]) => void;
  invalid?: boolean;
  errorId?: string;
  sourcePage?: string;
}

/**
 * Liste de cases à cocher pour la sélection des modules d'intérêt.
 * Émet `Module Selected In Form` à chaque activation (toggle ON, pas OFF).
 *
 * Note : exposé comme ref-forwarded pour intégration react-hook-form.
 */
export const ModuleMultiSelect = forwardRef<HTMLFieldSetElement, ModuleMultiSelectProps>(
  function ModuleMultiSelect(
    { options, value, onChange, invalid, errorId, sourcePage = '/demander-demo' },
    ref,
  ) {
    const toggle = (slug: ModuleSlug) => {
      const isOn = value.includes(slug);
      if (isOn) {
        onChange(value.filter((s) => s !== slug));
      } else {
        onChange([...value, slug]);
        track('Module Selected In Form', { moduleSlug: slug, sourcePage });
      }
    };

    return (
      <fieldset
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        className={cn('rounded-md border p-3', invalid ? 'border-red-400' : 'border-line')}
      >
        <legend className="sr-only">Packs qui vous intéressent</legend>
        <ul className="space-y-2">
          {options.map((opt) => {
            const checked = value.includes(opt.slug);
            const inputId = `module-${opt.slug}`;
            return (
              <li key={opt.slug}>
                <label
                  htmlFor={inputId}
                  className="hover:bg-surface-muted flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors"
                >
                  <Checkbox
                    id={inputId}
                    checked={checked}
                    onChange={() => toggle(opt.slug)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="text-ink block text-sm font-medium">{opt.label}</span>
                    {opt.description && (
                      <span className="text-ink-soft block text-xs">{opt.description}</span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    );
  },
);
