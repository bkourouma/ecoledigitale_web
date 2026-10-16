import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
import { Board } from '@/components/ui/Board';
import { Reveal } from '@/components/ui/Reveal';

export interface FinalCTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
}

export function FinalCTA({
  title = 'Prêt à digitaliser votre établissement ?',
  description = 'Échangez avec un conseiller pour découvrir EcoleDigitale en conditions réelles.',
  ctaLabel = 'Demander une démonstration',
}: FinalCTAProps) {
  return (
    <section className="container-wide py-16 md:py-20">
      <Reveal>
        <Board innerClassName="px-6 py-14 text-center md:px-16 md:py-20">
          <h2 className="chalk font-display text-display-md mx-auto max-w-3xl font-bold">
            {title}
          </h2>
          <p className="text-ink-muted mx-auto mt-4 max-w-xl text-lg leading-relaxed">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <TrackedDemoCTA placement="footer" size="lg" variant="chalk">
              {ctaLabel}
            </TrackedDemoCTA>
          </div>
          <p className="font-display text-chalk-yellow mt-5 text-2xl font-bold">
            Réponse sous 48 h ouvrées, sans engagement
          </p>
        </Board>
      </Reveal>
    </section>
  );
}
