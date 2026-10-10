import type { ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /**
   * `field` (défaut) : contrôle unique labellisable → rend un `<label htmlFor>`.
   * `group` : ensemble de contrôles (cases à cocher…) dont le composant enfant
   * fournit sa propre sémantique de groupe (`<fieldset>`/`<legend>`). On rend
   * alors un simple intitulé visuel, sans `htmlFor` orphelin.
   */
  as?: 'field' | 'group';
  children: ReactNode;
}

/**
 * Wrapper accessible pour un champ de formulaire.
 * - `field` : label associé au contrôle via htmlFor / id.
 * - `group` : intitulé visuel ; l'accessibilité du groupe est portée par l'enfant.
 * - Description et erreur reliées via aria-describedby (à câbler côté contrôle).
 */
export function FormField({
  id,
  label,
  description,
  error,
  required,
  className,
  as = 'field',
  children,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const headingContent = (
    <>
      {label}
      {required && (
        <span className="ml-1 text-red-600" aria-hidden="true">
          *
        </span>
      )}
    </>
  );

  return (
    <div className={cn('space-y-1.5', className)}>
      {as === 'group' ? (
        <span className="text-primary-800 block text-base font-bold">{headingContent}</span>
      ) : (
        <label htmlFor={id} className="text-primary-800 block text-base font-bold">
          {headingContent}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="text-ink-soft text-sm">
          {description}
        </p>
      )}

      <div data-described-by={describedBy}>{children}</div>

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
