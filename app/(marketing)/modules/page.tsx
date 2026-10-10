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

      <section className="relative">
        <Reveal className="container-wide py-20 md:py-24">
          <h1 className="font-display text-display-md text-primary-800 mt-3 max-w-3xl font-bold">
            5 modules pour s'adapter à votre activité
          </h1>
          <p className="text-ink-muted mt-5 max-w-xl text-lg leading-relaxed">
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
          <h2 className="font-display text-display-sm text-primary-800 font-bold">
            Aperçu des modules
          </h2>
          <p className="text-ink-muted mt-2">
            Cliquez sur un module pour voir les fonctionnalités détaillées, les profils utilisateurs
            adressés et les cas d'usage.
          </p>
        </Reveal>
        <Reveal>
          <ModulesGrid />
        </Reveal>
      </section>

      <section className="py-16">
        <div className="container-wide">
          <Reveal className="mb-8">
            <h2 className="font-display text-display-sm text-primary-800 font-bold">
              Vue comparative
            </h2>
            <p className="text-ink-muted mt-2">
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
