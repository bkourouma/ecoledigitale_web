import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
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
    <section className="container-wide py-20">
      <Reveal className="relative overflow-hidden rounded-3xl bg-primary-950 px-8 py-16 text-center shadow-elevated transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.18),0_8px_18px_rgba(15,23,42,0.08),0_28px_70px_rgba(15,23,42,0.14)] md:px-16">
        <div aria-hidden="true" className="animate-glow-pulse pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(59,130,246,0.35) 0%, transparent 55%)' }} />
        <div aria-hidden="true" className="animate-glow-pulse-delayed pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 80% 110%, rgba(16,185,129,0.28) 0%, transparent 60%)' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 70%)' }} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-300">
            Passez à l'étape suivante
          </p>
          <h2 className="mt-3 font-display text-display-sm font-semibold text-white">{title}</h2>
          <p className="mt-4 text-lg text-primary-100">{description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TrackedDemoCTA
              placement="footer"
              size="lg"
              className="!bg-white !text-primary-800 !shadow-elevated hover:!bg-accent-100"
            >
              {ctaLabel}
            </TrackedDemoCTA>
          </div>
          <p className="mt-4 text-xs text-primary-200">Réponse sous 48 h — sans engagement</p>
        </div>
      </Reveal>
    </section>
  );
}
