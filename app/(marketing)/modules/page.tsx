import type { Metadata } from 'next';
import { ModulesGrid } from '@/components/marketing/ModulesGrid';
import { ModulesCompareTable } from '@/components/marketing/ModulesCompareTable';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Packs : primaire, secondaire, supérieur, LMS',
  description:
    'Primary, Secondary, Higher, Virtual : comparez les packs EcoleDigitale et combinez-les sur un même compte selon vos cycles. Offres sur devis.',
  path: '/modules',
  ogImage: DEFAULT_OG_IMAGE,
});

export default function ModulesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'Packs', url: '/modules' },
        ])}
      />

      <section className="relative">
        <Reveal className="container-wide py-20 md:py-24">
          <h1 className="font-display text-display-md text-primary-800 mt-3 max-w-3xl font-bold">
            Un socle commun et quatre packs par cycle
          </h1>
          <p className="text-ink-muted mt-5 max-w-xl text-lg leading-relaxed">
            Le socle EcoleDigitale porte les élèves, les notes, les absences et les frais de
            scolarité. Ajoutez les packs de vos cycles : maternelle et primaire, collège et lycée,
            supérieur et BTS, formation à distance. Les offres sont établies sur devis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedDemoCTA placement="hero" size="lg">
              Demander un devis
            </TrackedDemoCTA>
          </div>
        </Reveal>
      </section>

      <section className="container-wide py-16">
        <Reveal className="mb-8">
          <h2 className="font-display text-display-sm text-primary-800 font-bold">
            Aperçu du socle et des packs
          </h2>
          <p className="text-ink-muted mt-2">
            Ouvrez une fiche pour voir les fonctionnalités détaillées, les profils utilisateurs et
            les questions fréquentes.
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
              Le socle est la base de tous les établissements ; les packs s&apos;y ajoutent selon
              vos cycles et peuvent se combiner sur un même compte.
            </p>
          </Reveal>
          <Reveal>
            <ModulesCompareTable />
          </Reveal>
        </div>
      </section>

      <FinalCTA
        title="Construisons votre offre sur devis"
        description="Décrivez-nous votre établissement : nous identifions ensemble les packs pertinents et préparons une démonstration personnalisée."
        ctaLabel="Demander un devis"
      />
    </>
  );
}
