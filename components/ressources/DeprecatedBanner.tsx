import { cn } from '@/lib/ui/cn';

interface DeprecatedBannerProps {
  className?: string;
}

/**
 * Bandeau affiché en tête d'une ressource marquée `deprecated`.
 * La ressource reste accessible (préservation du link equity) mais le lecteur
 * est averti que le contenu n'est plus tenu à jour.
 */
export function DeprecatedBanner({ className }: DeprecatedBannerProps) {
  return (
    <div
      role="note"
      className={cn(
        'rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900',
        className,
      )}
    >
      <strong className="font-semibold">Ressource archivée.</strong> Cette ressource n’est plus
      tenue à jour — certaines informations peuvent être obsolètes.
    </div>
  );
}
