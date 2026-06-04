import { Info } from 'lucide-react';
import { cn } from '@/lib/ui/cn';

interface FictionalCaseBannerProps {
  className?: string;
}

/**
 * Bandeau affiché en tête d'une étude de cas marquée `isFictional`.
 * Indique sans ambiguïté que les données sont illustratives — évite
 * d'induire le lecteur en erreur tant qu'aucun client réel n'est cité.
 */
export function FictionalCaseBanner({ className }: FictionalCaseBannerProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-ink',
        className,
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Exemple illustratif.</strong> Cette étude de cas
        s’appuie sur des données fictives. Elle sera remplacée par un témoignage réel dès
        qu’un établissement client acceptera d’être cité.
      </p>
    </div>
  );
}
