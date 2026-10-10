import Link from 'next/link';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';

interface EmptyStateProps {
  /**
   * `hub-empty` : aucune ressource publiée (hub en construction).
   * `no-results` : des ressources existent mais aucune ne matche les filtres.
   */
  variant: 'hub-empty' | 'no-results';
}

/**
 * État vide du hub. Reste indexable et expose une porte de sortie
 * (CTA démo ou réinitialisation des filtres) — jamais de page vide.
 */
export function EmptyState({ variant }: EmptyStateProps) {
  if (variant === 'hub-empty') {
    return (
      <div className="border-line bg-surface-subtle rounded-md border p-10 text-center">
        <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
          Le hub se construit
        </h2>
        <p className="text-ink-muted mx-auto mt-2 max-w-prose">
          Les premières ressources — guides, études de cas et glossaire — arrivent très
          prochainement. En attendant, échangeons sur votre établissement.
        </p>
        <div className="mt-6 flex justify-center">
          <TrackedDemoCTA placement="inline">Demander une démonstration</TrackedDemoCTA>
        </div>
      </div>
    );
  }

  return (
    <div className="border-line bg-surface-subtle rounded-md border p-10 text-center">
      <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
        Aucune ressource pour ces filtres
      </h2>
      <p className="text-ink-muted mx-auto mt-2 max-w-prose">
        Aucune ressource ne correspond à cette combinaison. Essayez d’élargir votre recherche ou de
        revenir à l’ensemble du catalogue.
      </p>
      <div className="mt-6">
        <Link
          href="/ressources"
          className="text-brand-700 text-sm font-medium underline-offset-4 hover:underline"
        >
          Effacer les filtres
        </Link>
      </div>
    </div>
  );
}
