import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface TrustItem {
  title: string;
  description: string;
}

const ITEMS: TrustItem[] = [
  {
    title: 'Données sécurisées',
    description: "Hébergement européen, contrôle d'accès par rôle, sauvegardes régulières.",
  },
  {
    title: 'Multi-établissement',
    description: 'Gérez plusieurs établissements et campus depuis une seule plateforme.',
  },
  {
    title: 'Données centralisées',
    description:
      "Une source unique pour l'académique, l'administratif, le financier et le pédagogique.",
  },
  {
    title: 'Plateforme modulaire',
    description: 'Activez uniquement les modules pertinents pour votre activité.',
  },
];

/** Le contenu du cartable : quatre engagements, écrits ligne à ligne comme dans un cahier. */
export function TrustBand() {
  return (
    <section aria-labelledby="trust-heading" className="container-wide py-16 md:py-20">
      <h2
        id="trust-heading"
        className="font-display text-display-sm text-primary-800 max-w-2xl font-bold"
      >
        Dans le <span className="marker">cartable</span> de chaque établissement
      </h2>
      <RevealGroup className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
        {ITEMS.map(({ title, description }) => (
          <RevealItem key={title}>
            <div className="border-primary-200 border-b-2 border-dashed py-5">
              <h3 className="font-display text-primary-700 text-3xl leading-none font-bold">
                {title}
              </h3>
              <p className="text-ink-muted mt-2 text-base leading-relaxed">{description}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
