import type { Metadata } from 'next';
import { ModulesGrid } from '@/components/marketing/ModulesGrid';
import { ModulesCompareTable } from '@/components/marketing/ModulesCompareTable';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Modules EcoleDigitale — socle, BTS, formation',
  description:
    "Découvrez les 5 modules d'EcoleDigitale : socle de base, gestion BTS, formations post-BTS, formation professionnelle et cours en direct. Demandez une offre modulée.",
  path: '/modules',
});

export default function ModulesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Modules', url: '/modules' },
        ])}
      />

      <section className="relative overflow-hidden premium-surface dark:dark-premium-surface">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-45 dark:opacity-15" aria-hidden="true" />
        <Reveal className="container-wide py-20 md:py-24">
          <p className="section-kicker">Catalogue des modules</p>
          <h1 className="mt-3 max-w-3xl font-display text-display-md font-semibold text-ink dark:text-white">
            5 modules pour s'adapter à votre activité
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
            Commencez par le socle EcoleDigitale, indispensable au pilotage de la scolarité, et
            activez les modules optionnels selon vos besoins : BTS, post-BTS, formation
            professionnelle, cours en direct.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedDemoCTA placement="hero" size="lg">
              Demander une offre modulée
            </TrackedDemoCTA>
          </div>
        </Reveal>
      </section>

      <section className="container-wide py-16">
        <Reveal className="mb-8">
          <h2 className="font-display text-display-sm font-semibold text-ink dark:text-white">
            Aperçu des modules
          </h2>
          <p className="mt-2 text-ink-muted dark:text-neutral-300">
            Cliquez sur un module pour voir les fonctionnalités détaillées, les profils utilisateurs
            adressés et les cas d'usage.
          </p>
        </Reveal>
        <Reveal>
          <ModulesGrid />
        </Reveal>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-16 dark:border-white/10 dark:bg-neutral-950">
        <div className="container-wide">
          <Reveal className="mb-8">
            <h2 className="font-display text-display-sm font-semibold text-ink dark:text-white">
              Vue comparative
            </h2>
            <p className="mt-2 text-ink-muted dark:text-neutral-300">
              Le module socle est obligatoire — les autres s'activent en complément selon votre
              activité.
            </p>
          </Reveal>
          <Reveal>
            <ModulesCompareTable />
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="Construisons votre offre modulée"
        description="Décrivez-nous votre activité : nous identifions ensemble les modules pertinents et préparons une démonstration personnalisée."
        ctaLabel="Demander une offre modulée"
      />
    </>
  );
}
